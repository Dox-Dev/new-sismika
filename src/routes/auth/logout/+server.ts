import { deleteSession } from '$lib/server/database';
import { error, type RequestHandler } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

/**
 * Handles the DELETE request to log out a user by deleting their session.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.cookies - The cookies object provided by SvelteKit.
 * @returns {Promise<Response>} Returns a response with no content if the session deletion is successful.
 * @throws Will throw an error if the session ID is missing or invalid, or if the session deletion fails.
 */
export const DELETE: RequestHandler = async ({ cookies }) => {
	const sid = cookies.get('sid');
	cookies.delete('sid', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});
	if (sid === undefined) throw error(StatusCodes.BAD_REQUEST);
	const result = await deleteSession(sid);
	if (!result) throw error(StatusCodes.UNAUTHORIZED);

	return new Response(null, { status: StatusCodes.NO_CONTENT });
};
