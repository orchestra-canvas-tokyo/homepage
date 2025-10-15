import type { Concert } from './types';

export type Program = NonNullable<Concert['programs']>[number];

/**
 * Generate a stable identifier for Svelte `{#each ...}` blocks that render concert programs.
 *
 * We deliberately avoid `JSON.stringify(program)` because:
 * - JSON drops properties whose values are `undefined`, which would treat `{ encoreType: undefined }`
 *   the same as omitting `encoreType` entirely and collapse otherwise distinct entries.
 * - The program objects occasionally gain new metadata fields. Stringifying the entire object would
 *   change every key whenever a new field lands, forcing Svelte to re-create the whole list despite
 *   no visible change for visitors.
 *
 * Instead, we compose the key from the visible metadata plus the array index so duplicates remain
 * distinct while still producing compact, human-readable keys.
 */
export const getProgramKey = (program: Program, index: number): string =>
	[program.composer, program.title, program.arranger ?? '', program.encoreType ?? '', index].join(
		'-'
	);
