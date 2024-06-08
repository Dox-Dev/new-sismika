import { Permission } from '$lib/model/src/user.js';
import { getUserFromSession, getUsers } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

/**
 * Loads user data for the admin panel.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.cookies - The cookies object provided by SvelteKit.
 * @param {Object} params.url - The URL object provided by SvelteKit.
 * @param {URLSearchParams} params.url.searchParams - The URL search parameters.
 * @returns {Promise<Object>} An object containing user data.
 * @throws Will throw an error if the session ID is missing or invalid, or if the user does not have admin permissions.
 */
export async function load({ cookies, url: { searchParams } }) {
	const sid = cookies.get('sid');
	if (!sid) error(StatusCodes.UNAUTHORIZED);

	const user = await getUserFromSession(sid);
	if (!user) error(StatusCodes.UNAUTHORIZED);
	if (user.permission < Permission.ADMIN) error(StatusCodes.FORBIDDEN);

	const res = await getUsers();

	return { ...res };
}
