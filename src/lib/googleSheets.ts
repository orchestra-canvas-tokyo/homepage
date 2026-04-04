export const normalizePublishedGoogleSheetCsvUrl = (inputUrl: string): string => {
	try {
		const url = new URL(inputUrl);

		if (url.hostname !== 'docs.google.com') {
			return inputUrl;
		}

		if (url.pathname.endsWith('/pubhtml')) {
			url.pathname = url.pathname.replace(/\/pubhtml$/, '/pub');
		}

		if (url.pathname.endsWith('/pub')) {
			url.searchParams.set('output', 'csv');
		}

		return url.toString();
	} catch {
		return inputUrl;
	}
};
