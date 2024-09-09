import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { getConciergeTokenByToken } from '@/data/concierge-token';

export default async function RegisterPage({ searchParams }: { searchParams?: { token: string } }) {
	const token = await getConciergeTokenByToken(searchParams?.token ?? '');
	return (
		<main>
			<RegisterForm token={token} />
		</main>
	);
}
