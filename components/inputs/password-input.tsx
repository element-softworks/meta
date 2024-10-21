import { EyeIcon, EyeOff } from 'lucide-react';
import { FormInput } from '../auth/form-input';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';

interface PasswordInputProps {
	isLoading: boolean;
	name: string;
	visible?: boolean;
	label?: string;
	disabled?: boolean;
	placeholder?: string;
}
export function PasswordInput(props: PasswordInputProps) {
	const { visible = true } = props;
	const [showPassword, setShowPassword] = useState(false);

	function passwordIcon() {
		return !showPassword ? (
			<EyeOff
				aria-label="Show password"
				size={20}
				onClick={() => setShowPassword(!showPassword)}
				className="cursor-pointer"
			/>
		) : (
			<EyeIcon
				aria-label="Hide password"
				size={20}
				onClick={() => setShowPassword(!showPassword)}
				className="cursor-pointer"
			/>
		);
	}

	if (!visible) return null;

	return (
		<FormInput
			disabled={props.disabled}
			name={props.name}
			label={props.label}
			render={({ field }) => (
				<div className="relative">
					<Input
						{...field}
						disabled={props.isLoading || props.disabled}
						type={showPassword ? 'text' : 'password'}
						placeholder={(props.placeholder ?? showPassword) ? 'password' : '********'}
						autoComplete="on"
					/>

					<Button
						isLoading={props.isLoading}
						disabled={props.isLoading || props.disabled}
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-0 p-0 bottom-0 text-muted-foreground"
					>
						{passwordIcon()}
					</Button>
				</div>
			)}
		/>
	);
}
