import { getTeamById } from '@/data/team';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest, res: Response) {
	if (!process.env.STRIPE_SECRET_KEY) {
		NextResponse.json({ error: 'Stripe secret key not found' }, { status: 500 });
	}
	const rawBody = await req.text();
	const sig = req.headers.get('stripe-signature');
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret!);
	} catch (err: any) {
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}

	const getCustomer = async (customerId: string) => {
		const customer = await stripe.customers.retrieve(customerId);
		return customer as Stripe.Customer;
	};

	const handleSubscriptionEvent = async (
		event: Stripe.Event,
		type: 'created' | 'updated' | 'deleted'
	) => {
		const subscription = event.data.object as Stripe.Subscription;

		const customer = await getCustomer(subscription.customer as string);
		const user = await getUserByEmail(customer.email ?? '');
		const team = await getTeamById(customer?.metadata?.teamId ?? '');

		if (!user) {
			console.error('User not found');
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		if (!!subscription.pending_update) {
			console.log('Subscription pending update' + subscription.pending_update);

			return NextResponse.json({ error: 'Subscription pending update' });
		}

		const endDate = new Date(subscription?.current_period_end * 1000); //Convert unix timestamp to JS date

		const subscriptionData = {
			teamId: team.team?.id ?? '',
			userId: user.id ?? '',
			stripeCustomerId: subscription.customer as string,
			stripeSubscriptionId: subscription.id,
			planId: subscription?.items?.data[0]?.price?.id,
			email: user?.email ?? '',
			status: subscription.status,
			cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
			endDate: endDate,
		};

		try {
			if (type === 'created') {
				// Create subscription
				await db.customer
					.create({
						data: { ...subscriptionData },
					})
					.catch((error) => {
						console.error('Error creating subscription', error);
					});

				await db.team.update({
					where: {
						id: team?.team?.id,
					},
					data: {
						stripeCustomerId: customer.id,
					},
				});

				await createNotification({
					userId: customer.metadata.userId,
					message: `Your subscription to ${team.team?.name} has been created`,
					title: 'Subscription created',
				});
			} else if (type === 'updated') {
				// Update subscription
				await db.customer
					.update({
						where: {
							stripeCustomerId: customer.id,
						},
						data: { ...subscriptionData },
					})
					.catch((error) => {
						console.error('Error updating subscription', error);
					});
			} else if (type === 'deleted') {
				// Delete subscription
				await db.customer.update({
					where: {
						stripeCustomerId: subscriptionData.stripeCustomerId,
					},
					data: {
						status: 'cancelled',
						email: customer.email ?? '',
					},
				});

				await createNotification({
					userId: customer.metadata.userId,
					message: `Your subscription to ${team.team?.name} has been deleted`,
					title: 'Subscription deleted',
				});
			}
		} catch (error) {
			console.error('Error handling subscription event', error);
			return NextResponse.json(
				{ error: 'Error handling subscription event' },
				{ status: 500 }
			);
		}
	};

	const handleInvoiceEvent = async (event: Stripe.Event, status: 'succeeded' | 'failed') => {
		const invoice = event.data.object as Stripe.Invoice;

		const customer = await getCustomer(invoice.customer as string);
		const user = await getUserByEmail(customer.email ?? '');
		const team = await getTeamById(customer?.metadata?.teamId ?? '');

		const foundCustomer = await db.customer.findFirst({
			where: {
				stripeCustomerId: customer.id,
			},
		});

		if (!user) {
			console.error('User not found');
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}
		if (!team) {
			console.error('Team not found');
			return NextResponse.json({ error: 'Team not found' }, { status: 404 });
		}

		await db.customer
			.update({
				where: {
					stripeCustomerId: customer.id,
				},
				data: { status: status === 'failed' ? 'unpaid' : 'active' },
			})
			.catch((error) => {
				console.error('Error updating subscription', error);
			});

		try {
			await db.customerInvoice.create({
				data: {
					invoiceId: invoice.id ?? '',
					teamId: team.team?.id ?? '',
					amountPaid: invoice.amount_paid ?? '',
					amountDue: invoice.amount_due ?? '',
					total: invoice.total ?? '',
					invoicePdf: invoice.invoice_pdf ?? '',
					amountRemaining: invoice.amount_remaining ?? '',
					currency: invoice.currency ?? '',
					email: user?.email ?? '',
					status: status ?? 'failed',
					stripeSubscriptionId: invoice.subscription?.toString() ?? '',
					customerId: foundCustomer?.id ?? '',
				},
			});

			await createNotification({
				userId: customer?.metadata?.userId ?? '',
				message: `Your invoice for ${team.team?.name} has been ${status}`,
				title: `Invoice ${status}`,
			});
		} catch (error) {
			console.error('Error handling subscription event', error);
			return NextResponse.json(
				{ error: 'Error handling subscription event' },
				{ status: 500 }
			);
		}
	};

	const handleCheckoutSessionCompletedEvent = async (event: Stripe.Event) => {
		const subscription = event.data.object as Stripe.Subscription;
		const customer = await getCustomer(subscription.customer as string);
		const team = await getTeamById(customer?.metadata?.teamId ?? '');
	};

	switch (event.type) {
		//One time payment logic
		case 'payment_intent.succeeded':
			console.log('Payment intent succeeded');
			break;
		case 'charge.updated':
			console.log('Charge updated');
			break;

		//Subscription logic
		case 'customer.subscription.created':
			await handleSubscriptionEvent(event, 'created');
			break;
		case 'customer.subscription.updated':
			await handleSubscriptionEvent(event, 'updated');
			break;
		case 'customer.subscription.deleted':
			await handleSubscriptionEvent(event, 'deleted');
			break;
		case 'invoice.payment_succeeded':
			await handleInvoiceEvent(event, 'succeeded');
			break;
		case 'invoice.payment_failed':
			await handleInvoiceEvent(event, 'failed');
			break;
		case 'checkout.session.completed':
			await handleCheckoutSessionCompletedEvent(event);
			console.log('Checkout session completed');
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
			break;
	}

	return NextResponse.json({ received: true });
}
