import type { Handle } from '@sveltejs/kit';
import { sveltekitSessionHandle } from 'svelte-kit-sessions';
import KvStore from 'svelte-kit-connect-cloudflare-kv';
import type { Store } from 'svelte-kit-sessions';

declare module 'svelte-kit-sessions' {
	interface SessionData {
		csrfToken: string;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	let sessionHandle: Handle | null = null;

	if (event.platform && event.platform.env) {
		// https://kit.svelte.dev/docs/adapter-cloudflare#bindings
		const store = new KvStore({ client: event.platform.env.KV }) as Store;
		sessionHandle = sveltekitSessionHandle({
			secret: 'secret',
			store
		});
	}

	return sessionHandle ? sessionHandle({ event, resolve }) : resolve(event);
};
