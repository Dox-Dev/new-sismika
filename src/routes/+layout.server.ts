import { getUserFromSession } from '$lib/server/database/index.js';

/**
 * Loads user data based on the session ID stored in cookies.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.cookies - The cookies object provided by SvelteKit.
 * @returns {Promise<Object|undefined>} An object containing user data if the session ID is valid, otherwise undefined.
 */
export async function load({ cookies }) {
	const sid = cookies.get('sid');

	if (!sid) return;

	const data = await getUserFromSession(sid);
	if (!data) return;
	return { user: data };
}
