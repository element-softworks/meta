'use client';
import { createCoachBooking } from '@/actions/booking-system/create-coach-booking';
import { reviewCoachApplication } from '@/actions/booking-system/review-coach-application';
import { Button } from '@/components/ui/button';
import { addDays, addMinutes } from 'date-fns';

export default async function DashboardPage({ searchParams }: any) {
	const coach = {
		timeframeDays: [
			{
				day: 0,
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
			},
		],
	};

	return (
		<main className="flex flex-col  gap-4">
			{/* <Button onClick={async () => await createCoach(coach)} className="w-fit"> */}
			<Button onClick={async () => await {}} className="w-fit">
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
