import { Check, EyeIcon, EyeOff, X } from 'lucide-react';
import { FormInput } from '../auth/form-input';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface PasswordInputProps {
	isLoading: boolean;
	name: string;
	visible?: boolean;
	label?: string;
	disabled?: boolean;
	placeholder?: string;
	showStrengthRequirements?: boolean;
}
export function PasswordInput(props: PasswordInputProps) {
	const { visible = true } = props;
	const [showPassword, setShowPassword] = useState(false);

	const { watch } = useFormContext();

	const password = watch(props.name);

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

	function passwordStrengthRequirement({ label, isValid }: { label: string; isValid: boolean }) {
		return (
			<div
				className={`flex items-center gap-1 ${
					isValid ? 'text-successful' : 'text-destructive'
				}`}
			>
				{isValid ? (
					<Check size={14} className="text-successful" />
				) : (
					<X size={14} className="text-destructive" />
				)}
				<span className="text-xs">{label}</span>
			</div>
		);
	}

	const passwordRequirements = [
		{
			label: 'More than 8 chars',
			isValid: password?.length > 8,
		},
		{
			label: 'Contains a uppercase letter',
			isValid: /[A-Z]/.test(password),
		},
		{
			label: 'Contains a number',
			isValid: /[0-9]/.test(password),
		},
		{
			label: 'Contains a special character',
			isValid: /[^A-Za-z0-9]/.test(password),
		},
	];

	if (!visible) return null;

	return (
		<div>
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
							placeholder={
								props.placeholder ?? showPassword ? 'password' : '********'
							}
							autoComplete="on"
						/>

						<Button
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
			{props.showStrengthRequirements ? (
				<div className="flex gap-2 flex-wrap mt-2">
					{passwordRequirements.map((requirement, index) => (
						<div key={index} className="flex items-center ">
							{passwordStrengthRequirement(requirement)}
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}
