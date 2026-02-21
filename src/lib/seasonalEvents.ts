export const SEASONAL_COOKIE_NAME = 'seasonal_override';

export const SEASONAL_EVENT_DEFINITIONS = {
	nyanvas: {
		label: 'Nyanvas',
		queryValue: 'nyan'
	}
} as const;

export type SeasonalEventId = keyof typeof SEASONAL_EVENT_DEFINITIONS;

export type SeasonalEvent = {
	id: SeasonalEventId;
	label: string;
};

export type SeasonalOverrideAction =
	| { type: 'set'; eventId: SeasonalEventId }
	| { type: 'clear' }
	| { type: 'none' };

const seasonalTimeZone = 'Asia/Tokyo';
const clearOverrideValues = new Set(['0', 'off', 'false', 'clear']);

// Update these explicit dates each year (YYYY-MM-DD, JST).
export const SEASONAL_EVENT_SCHEDULE: Record<string, SeasonalEventId> = {
	'2025-04-01': 'nyanvas',
	'2026-02-22': 'nyanvas'
};

const findEventIdByQueryValue = (queryValue: string): SeasonalEventId | null => {
	for (const [eventId, eventDefinition] of Object.entries(SEASONAL_EVENT_DEFINITIONS)) {
		if (eventDefinition.queryValue === queryValue) {
			return eventId as SeasonalEventId;
		}
	}

	return null;
};

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

export const normalizeSeasonalOverride = (
	value: string | null | undefined
): SeasonalEventId | null => {
	if (!value) return null;

	const normalizedValue = value.trim().toLowerCase();
	if (!normalizedValue) return null;

	if (normalizedValue in SEASONAL_EVENT_DEFINITIONS) {
		return normalizedValue as SeasonalEventId;
	}

	return findEventIdByQueryValue(normalizedValue);
};

export const getSeasonalOverrideAction = (url: URL): SeasonalOverrideAction => {
	const seasonalValues = url.searchParams.getAll('seasonal');
	if (seasonalValues.length !== 1) return { type: 'none' };

	const normalizedValue = seasonalValues[0].trim().toLowerCase();
	if (!normalizedValue) return { type: 'none' };

	if (clearOverrideValues.has(normalizedValue)) {
		return { type: 'clear' };
	}

	const eventId = findEventIdByQueryValue(normalizedValue);
	if (!eventId) return { type: 'none' };

	return { type: 'set', eventId };
};

export const getActiveSeasonalEvent = ({
	overrideEventId,
	now = new Date()
}: {
	overrideEventId?: SeasonalEventId | null;
	now?: Date;
}): SeasonalEvent | null => {
	const normalizedOverrideEventId = normalizeSeasonalOverride(overrideEventId);
	if (normalizedOverrideEventId) {
		return {
			id: normalizedOverrideEventId,
			label: SEASONAL_EVENT_DEFINITIONS[normalizedOverrideEventId].label
		};
	}

	const today = formatDateInTimeZone(now, seasonalTimeZone);
	const activeEventId = SEASONAL_EVENT_SCHEDULE[today];
	if (!activeEventId) return null;

	return {
		id: activeEventId,
		label: SEASONAL_EVENT_DEFINITIONS[activeEventId].label
	};
};
