'use server';
import axios from 'axios';

export const getLocation = async ({
	query,
	lang,
	show,
	types,
	at,
	limit,
}: {
	query: string;
	lang?: string;
	show?: string;
	types?: string[];
	at?: number[];
	limit: number;
}) => {
	const { data } = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
		params: {
			apiKey: process.env.HERE_API_KEY,
			at: Array.isArray(at) ? at.join(',') : at,
			q: query,
			// types: 'address, area, city, houseNumber, postalCode, street',
			lang: 'en',
		},
	});

	console.log(data, 'found data');

	return data?.items;
};
