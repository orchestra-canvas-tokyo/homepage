export type SeasonalEventId = 'nyanvas';

export type SeasonalEventConfig = {
	id: SeasonalEventId;
	label: string;
	dates: string[];
	queryParam: string;
};

export type SeasonalEvent = {
	id: SeasonalEventId;
	label: string;
};

const seasonalTimeZone = 'Asia/Tokyo';

// Update these explicit dates each year (YYYY-MM-DD, JST).
const seasonalEvents: SeasonalEventConfig[] = [
	{
		id: 'nyanvas',
		label: 'Nyanvas',
		dates: ['2025-02-22', '2025-04-01'],
		queryParam: 'nyan'
	}
];

const formatDateInTimeZone = (date: Date, timeZone: string): string => {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(date);

	const year = parts.find((part) => part.type === 'year')?.value;
	const month = parts.find((part) => part.type === 'month')?.value;
	const day = parts.find((part) => part.type === 'day')?.value;

	if (!year || !month || !day) {
		throw new Error('Failed to format date for seasonal events.');
	}

	return `${year}-${month}-${day}`;
};

const findEventByQuery = (url: URL): SeasonalEventConfig | null => {
	const override = url.searchParams.get('seasonal');
	if (override) {
		const normalized = override.trim().toLowerCase();
		const matched = seasonalEvents.find(
			(event) => event.id === normalized || event.queryParam === normalized
		);
		if (matched) return matched;
	}

	const directMatch = seasonalEvents.find((event) => url.searchParams.has(event.queryParam));
	return directMatch ?? null;
};

export const getActiveSeasonalEvent = ({
	url,
	now = new Date()
}: {
	url: URL;
	now?: Date;
}): SeasonalEvent | null => {
	const queryMatch = findEventByQuery(url);
	if (queryMatch) return { id: queryMatch.id, label: queryMatch.label };

	const today = formatDateInTimeZone(now, seasonalTimeZone);
	const dateMatch = seasonalEvents.find((event) => event.dates.includes(today));
	if (!dateMatch) return null;

	return { id: dateMatch.id, label: dateMatch.label };
};
