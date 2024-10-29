import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { concerts } from '$lib/concerts';
export const load: PageServerLoad = async ({ params }) => {
	// slugが一致する演奏会が見つかれば、それを返す
	const concert = concerts.find((concert) => concert.slug === params.slug);
	if (concert) {
		return concert;
	}
	error(404, 'Not found');
};
