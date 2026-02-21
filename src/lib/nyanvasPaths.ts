export const NYANVAS_ENTRY_PATH = '/nyanvas';
export const NYANVAS_LATEST_PATH = '/nyanvas-20260222';

const nyanvasVersionedPathPattern = /^\/nyanvas-\d{8}$/;

export const isNyanvasPath = (pathname: string): boolean => {
	return pathname === NYANVAS_ENTRY_PATH || nyanvasVersionedPathPattern.test(pathname);
};
