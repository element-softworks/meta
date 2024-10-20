import { useForm, useFormContext } from 'react-hook-form';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';

interface TwoFactorCheckInputProps {
	visible?: boolean;
	name: string;
	isLoading: boolean;
}
export function TwoFactorCheckInput(props: TwoFactorCheckInputProps) {
	const { visible = true } = props;
	const form = useFormContext();

	if (!visible) {
		return null;
	}
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }) => (
				<FormItem className="flex items-center gap-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
					<div className="flex-1">
						<FormLabel>Email two factor authentication</FormLabel>
						<FormDescription>
							Enable two factor authentication for your account, you will receive an
							email upon login with a code to enter.
						</FormDescription>
					</div>
					<FormControl>
						<Switch
							id="2fa-enabled"
							checked={field.value}
							onCheckedChange={field.onChange}
							disabled={props.isLoading}
						/>
					</FormControl>

					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
