import { type ClassValue, clsx } from 'clsx';
import { addHours, format, startOfDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formDataToNestedObject(formData: FormData): Record<string, any> {
	const result: Record<string, any> = {};

	for (const [key, value] of formData.entries()) {
		// Split the key into parts (e.g., "openingTimes.0.0.time")
		const keys = key.split('.');
		let current = result;

		keys.forEach((k, index) => {
			// If at the last key, assign the value
			if (index === keys.length - 1) {
				if (Array.isArray(current[k])) {
					current[k].push(value);
				} else if (current[k] !== undefined) {
					current[k] = [current[k], value]; // Convert to array if duplicate keys
				} else {
					current[k] = value; // Single value
				}
			} else {
				// If the next key is a number, treat it as an array
				if (!current[k]) {
					current[k] = isNaN(Number(keys[index + 1])) ? {} : [];
				}
				current = current[k];
			}
		});
	}

	return result;
}

export const convertHourToAMPM = (hour: number, formatString?: string) => {
	// if (!hour) return null;
	return format(
		new Date(addHours(startOfDay(Date.now()), hour)),
		!!formatString ? formatString : 'h:mmaaa'
	);
};
