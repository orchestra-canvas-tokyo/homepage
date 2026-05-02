import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';
import { concerts } from '$lib/concerts';
import organizationStats from '$lib/organizationStats.json';
import { getOrganizationStatsDisplayValues } from '$lib/organizationStats';
import type { TimelinePosterGroup } from './data';

const timelineYears = ['2021', '2022', '2023', '2024', '2025', '2026'];

export const load: PageServerLoad = async () => {
	const firstConcert = concerts.find((concert) => concert.slug === 'regular-1');
	const alpsConcert = concerts.find((concert) => concert.slug === 'regular-17');
	const timelinePosterGroups: TimelinePosterGroup[] = timelineYears.map((year) => ({
		year,
		concerts: concerts
			.filter(
				(concert) => dayjs(concert.dateTime.date).format('YYYY') === year && concert.flyers?.[0]
			)
			.sort((a, b) => (dayjs(a.dateTime.date).isAfter(dayjs(b.dateTime.date)) ? 1 : -1))
			.map((concert) => ({
				title: concert.title,
				slug: concert.slug,
				type: concert.type,
				number: concert.number,
				date: concert.dateTime.date,
				flyer: concert.flyers![0]
			}))
	}));

	if (!firstConcert || !alpsConcert) {
		error(500, 'Required concert data for the 5th anniversary prototype was not found.');
	}

	return {
		firstConcert,
		alpsConcert,
		stats: getOrganizationStatsDisplayValues(organizationStats),
		rawStats: organizationStats,
		timelinePosterGroups
	};
};
