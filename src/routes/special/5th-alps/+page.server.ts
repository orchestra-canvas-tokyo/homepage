import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';
import { concerts } from '$lib/concerts';
import organizationStats from '$lib/organizationStats.json';
import { getOrganizationStatsDisplayValues } from '$lib/organizationStats';
import type { TimelinePosterGroup } from './data';

const timelineYears = ['2021', '2022', '2023', '2024', '2025', '2026'];
const anniversaryConcertTypes = ['regular', 'chamber'];

export const load: PageServerLoad = async () => {
	const firstConcert = concerts.find((concert) => concert.slug === 'regular-1');
	const alpsConcert = concerts.find((concert) => concert.slug === 'regular-17');

	if (!firstConcert || !alpsConcert) {
		error(500, 'Required concert data for the 5th anniversary prototype was not found.');
	}

	const anniversaryConcerts = concerts.filter(
		(concert) =>
			anniversaryConcertTypes.includes(concert.type) &&
			!dayjs(concert.dateTime.date).isAfter(dayjs(alpsConcert.dateTime.date))
	);
	const anniversaryStats = {
		concertCount: anniversaryConcerts.length,
		programCount: anniversaryConcerts.reduce(
			(total, concert) =>
				total + (concert.programs?.filter((program) => !program.encoreType).length ?? 0),
			0
		)
	};
	const timelinePosterGroups: TimelinePosterGroup[] = timelineYears.map((year) => ({
		year,
		concerts: concerts
			.filter((concert) => dayjs(concert.dateTime.date).format('YYYY') === year)
			.sort((a, b) => (dayjs(a.dateTime.date).isAfter(dayjs(b.dateTime.date)) ? 1 : -1))
			.map((concert) => ({
				title: concert.title,
				slug: concert.slug,
				type: concert.type,
				number: concert.number,
				date: concert.dateTime.date,
				flyer: concert.flyers?.[0]
			}))
	}));

	return {
		firstConcert,
		alpsConcert,
		anniversaryStats,
		stats: getOrganizationStatsDisplayValues(organizationStats),
		rawStats: organizationStats,
		timelinePosterGroups
	};
};
