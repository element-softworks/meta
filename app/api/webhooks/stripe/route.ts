import { getTeamById } from '@/data/team';
import { getUserByEmail } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { customer, customerInvoice, session, team } from '@/db/drizzle/schema';
import { createNotification } from '@/lib/notifications';
import { eq } from 'drizzle-orm';
import { stat } from 'fs';
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

		const customerResponse = await getCustomer(subscription.customer as string);
		const userResponse = await getUserByEmail(customerResponse.email ?? '');
		const teamResponse = await getTeamById(customerResponse?.metadata?.teamId ?? '');

		if (!userResponse) {
			console.error('User not found');
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		if (!!subscription.pending_update) {
			return NextResponse.json({ error: 'Subscription pending update' });
		}

		const endDate = new Date(subscription?.current_period_end * 1000); //Convert unix timestamp to JS date

		const subscriptionData = {
			teamId: teamResponse.data?.team?.id ?? '',
			userId: userResponse.id ?? '',
			stripeCustomerId: subscription.customer as string,
			stripeSubscriptionId: subscription.id,
			planId: subscription?.items?.data[0]?.price?.id,
			email: userResponse?.email ?? '',
			status: subscription.status,
			cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
			endDate: endDate,
		};

		const foundCustomer = await db.query.customer.findFirst({
			where: eq(customer.stripeCustomerId, customerResponse.id),
		});

		try {
			if (type === 'created') {
				// Create subscription

				if (!!foundCustomer) {
					await db
						.update(customer)
						.set({
							...subscriptionData,
						})
						.where(eq(customer.stripeCustomerId, customerResponse.id));
				} else {
					await db.insert(customer).values({
						...subscriptionData,
					});
				}

				await db
					.update(team)
					.set({
						stripeCustomerId: customerResponse.id,
					})
					.where(eq(team.id, teamResponse?.data?.team?.id!));

				await createNotification({
					userId: customerResponse.metadata.userId,
					message: `Your subscription to ${teamResponse?.data?.team?.name} has been created`,
					title: 'Subscription created',
				});
			} else if (type === 'updated') {
				// Update subscription

				await db
					.update(customer)
					.set({
						...subscriptionData,
					})
					.where(eq(customer.stripeCustomerId, customerResponse.id));
			} else if (type === 'deleted') {
				// Delete subscription
				await db
					.update(customer)
					.set({
						status: 'cancelled',
						email: customerResponse.email ?? '',
					})
					.where(eq(customer.stripeCustomerId, subscriptionData.stripeCustomerId));

				await createNotification({
					userId: customerResponse.metadata.userId,
					message: `Your subscription to ${teamResponse?.data?.team?.name} has been deleted`,
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

		const customerResponse = await getCustomer(invoice.customer as string);
		const userResponse = await getUserByEmail(customerResponse.email ?? '');
		const teamResponse = await getTeamById(customerResponse?.metadata?.teamId ?? '');

		let foundCustomer = await db.query.customer.findFirst({
			where: eq(customer.stripeCustomerId, customerResponse.id),
		});

		if (!userResponse) {
			console.error('User not found');
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}
		if (!team) {
			console.error('Team not found');
			return NextResponse.json({ error: 'Team not found' }, { status: 404 });
		}

		if (!foundCustomer) {
			const endDate = new Date(invoice?.period_end * 1000); //Convert unix timestamp to JS date

			const [newCustomer] = await db
				.insert(customer)
				.values({
					cancelAtPeriodEnd: false,
					email: userResponse.email,
					planId: '',
					status: invoice.status as string,
					stripeCustomerId: invoice.customer as string,
					stripeSubscriptionId: '',
					teamId: teamResponse?.data?.team?.id ?? '',
					userId: userResponse.id,
					endDate: endDate,
				})
				.returning();

			foundCustomer = newCustomer;
		}

		if (status === 'succeeded') {
			if (!!customerResponse?.metadata?.userSession && invoice?.amount_paid > 0) {
				await db
					.update(session)
					.set({
						converted: true,
					})
					.where(eq(session.id, customerResponse?.metadata?.userSession));
			}
		}

		await db
			.update(customer)
			.set({
				status: status === 'failed' ? 'unpaid' : 'active',
			})
			.where(eq(customer.stripeCustomerId, customerResponse.id));

		try {
			await db.insert(customerInvoice).values({
				invoiceId: invoice.id ?? '',
				teamId: teamResponse?.data?.team?.id ?? '',
				amountPaid: invoice.amount_paid ?? '',
				amountDue: invoice.amount_due ?? '',
				total: invoice.total ?? '',
				invoicePdf: invoice.invoice_pdf ?? '',
				amountRemaining: invoice.amount_remaining ?? '',
				currency: invoice.currency ?? '',
				email: userResponse?.email ?? '',
				status: status ?? 'failed',
				stripeSubscriptionId: invoice.subscription?.toString() ?? '',
				customerId: foundCustomer?.id ?? '',
			});
			await createNotification({
				userId: customerResponse?.metadata?.userId ?? '',
				message: `Your invoice for ${teamResponse?.data?.team?.name} has ${
					status === 'succeeded' ? 'been paid' : 'failed'
				}`,
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
			console.log('Subscription created');
			await handleSubscriptionEvent(event, 'created');
			break;
		case 'customer.subscription.updated':
			console.log('Subscription updated');
			await handleSubscriptionEvent(event, 'updated');
			break;
		case 'customer.subscription.deleted':
			console.log('Subscription deleted');
			await handleSubscriptionEvent(event, 'deleted');
			break;
		case 'invoice.payment_succeeded':
			console.log('Invoice payment succeeded');
			await handleInvoiceEvent(event, 'succeeded');
			break;
		case 'invoice.payment_failed':
			console.log('Invoice payment failed');
			await handleInvoiceEvent(event, 'failed');
			break;
		case 'checkout.session.completed':
			console.log('Checkout session completed');
			await handleCheckoutSessionCompletedEvent(event);
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
			break;
	}

	return NextResponse.json({ received: true });
}
