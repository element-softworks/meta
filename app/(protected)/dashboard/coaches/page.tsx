'use client';
import { createCoach } from '@/actions/booking-system/create-coach';
import { reviewCoachApplication } from '@/actions/booking-system/review-coach-application';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage({ searchParams }: any) {
	const coach = {
		timeframeDays: [
			{
				day: 0,
				timeframes: [
					{
						startDate: '09:00',
						endDate: '17:00',
					},
					{
						startDate: '19:00',
						endDate: '22:00',
					},
					{
						startDate: '01:00',
						endDate: '02:00',
					},
					{
						startDate: '03:00',
						endDate: '04:00',
					},
				],
			},
			{
				day: 1,
				timeframes: [
					{
						startDate: '09:00',
						endDate: '17:00',
					},
					{
						startDate: '19:00',
						endDate: '22:00',
					},
				],
			},
			{
				day: 2,
				timeframes: [
					{
						startDate: '09:00',
						endDate: '17:00',
					},
				],
			},
			{
				day: 3,
				timeframes: [
					{
						startDate: '09:00',
						endDate: '17:00',
					},
				],
			},
			{
				day: 4,
				timeframes: [
					{
						startDate: '09:00',
						endDate: '17:00',
					},
				],
			},
			{
				day: 5,
				timeframes: [],
			},
			{
				day: 6,
				timeframes: [
					{
						startDate: '13:00',
						endDate: '16:00',
					},
					{
						startDate: '14:00',
						endDate: '17:00',
					},
				],
			},
		],
	};

	return (
		<main className="flex flex-col  gap-4">
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

			<Button onClick={async () => await createCoach(coach)} className="w-fit">
				Create coach
			</Button>

			<Button
				onClick={async () =>
					await reviewCoachApplication(
						{ status: 'APPROVED' },
						'60a1264a-60ff-4c3e-a6b0-901482326d03'
					)
				}
				className="w-fit"
			>
				Review coach app
			</Button>
		</main>
	);
}
