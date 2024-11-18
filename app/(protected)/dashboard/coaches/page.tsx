'use client';
import { createCoach } from '@/actions/booking-system/create-coach';
import { createCoachBooking } from '@/actions/booking-system/create-coach-booking';
import { reviewCoachApplication } from '@/actions/booking-system/review-coach-application';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { addDays, addMinutes } from 'date-fns';
=======
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';
import { addDays, addHours, addMinutes } from 'date-fns';
import Link from 'next/link';
>>>>>>> b67b96c66b3e0193080fbbc7ed00b4642de87234

export default async function DashboardPage({ searchParams }: any) {
	const coach = {
		timeframeDays: [
			{
				day: 0,
<<<<<<< HEAD
				startHour: 9,
				endHour: 17,
			},
			{
				day: 1,
				startHour: 9,
				endHour: 17,
			},
			{
				day: 2,
				startHour: 9,
				endHour: 17,
			},
			{
				day: 3,
				startHour: 9,
				endHour: 17,
			},
			{
				day: 4,
				startHour: 9,
				endHour: 17,
			},
			{
				day: 5,
				startHour: 10,
				endHour: 15,
			},
			{
				day: 5,
				startHour: 18,
				endHour: 20,
			},
			{
				day: 6,
				startHour: 11,
				endHour: 14,
			},
			{
				day: 6,
				startHour: 17,
				endHour: 19,
			},
			{
				day: 6,
				startHour: 21,
				endHour: 23,
=======
				startDate: 9,
				endDate: 17,
			},
			{
				day: 1,
				startDate: 9,
				endDate: 17,
			},
			{
				day: 2,
				startDate: 9,
				endDate: 17,
			},
			{
				day: 3,
				startDate: 9,
				endDate: 17,
			},
			{
				day: 4,
				startDate: 9,
				endDate: 17,
			},
			{
				day: 5,
				startDate: 10,
				endDate: 15,
			},
			{
				day: 5,
				startDate: 18,
				endDate: 20,
			},
			{
				day: 6,
				startDate: 11,
				endDate: 14,
			},
			{
				day: 6,
				startDate: 17,
				endDate: 19,
			},
			{
				day: 6,
				startDate: 21,
				endDate: 23,
>>>>>>> b67b96c66b3e0193080fbbc7ed00b4642de87234
			},
		],
	};

	return (
		<main className="flex flex-col  gap-4">
<<<<<<< HEAD
=======
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Teams overview</p>
					<p className="text-muted-foreground text-sm">Manage your teams below</p>
				</div>
				<Link href="/dashboard/teams/create">
					<Button className="w-fit">Create team</Button>
				</Link>
			</div>
			<Separator />

>>>>>>> b67b96c66b3e0193080fbbc7ed00b4642de87234
			<Button onClick={async () => await createCoach(coach)} className="w-fit">
				Create coach
			</Button>

			<Button
				onClick={async () =>
					await createCoachBooking(
						{
							bookingType: 'BOOKING',
							startDate: addMinutes(addDays(new Date(), 14), 100),
							endDate: addDays(new Date(), 15),
						},
						'cfe8be4e-fb40-4345-aac7-1676da712274'
					)
				}
				className="w-fit"
			>
				Book coach time
			</Button>

			<Button
				onClick={async () =>
					await reviewCoachApplication(
						{ status: 'APPROVED' },
						'd037ab85-e0e0-4369-ad52-f9981e2971d7'
					)
				}
				className="w-fit"
			>
				Review coach app
			</Button>
		</main>
	);
}
