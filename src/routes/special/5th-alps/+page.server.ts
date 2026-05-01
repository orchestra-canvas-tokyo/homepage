import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { concerts } from '$lib/concerts';
import organizationStats from '$lib/organizationStats.json';
import { getOrganizationStatsDisplayValues } from '$lib/organizationStats';

export const load: PageServerLoad = async () => {
	const firstConcert = concerts.find((concert) => concert.slug === 'regular-1');
	const alpsConcert = concerts.find((concert) => concert.slug === 'regular-17');

	if (!firstConcert || !alpsConcert) {
		error(500, 'Required concert data for the 5th anniversary prototype was not found.');
	}

	return {
		firstConcert,
		alpsConcert,
		stats: getOrganizationStatsDisplayValues(organizationStats)
	};
};
