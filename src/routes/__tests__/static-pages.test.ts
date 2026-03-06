import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import ConceptsPage from '../about/concepts/+page.svelte';
import RecruitPage from '../recruit/+page.svelte';
import SupportUsPage from '../support-us/+page.svelte';

describe('route page regressions', () => {
	it('renders recruit page title and breadcrumb link', () => {
		render(RecruitPage);

		expect(screen.getByRole('heading', { level: 1, name: 'recruit' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
	});

	it('renders concepts page title and organization image', () => {
		render(ConceptsPage);

		expect(screen.getByRole('heading', { level: 1, name: 'concepts' })).toBeInTheDocument();
		expect(screen.getByRole('img', { name: '組織図' })).toBeInTheDocument();
	});

	it('renders support-us page title and supporter links', () => {
		render(SupportUsPage);

		expect(screen.getByRole('heading', { level: 1, name: 'ご支援のお願い' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
		expect(screen.getAllByRole('link', { name: '専用フォーム' })).toHaveLength(2);
	});
});
