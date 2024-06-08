import { blake3 } from '@noble/hashes/blake3';
import { OAUTH_SCOPE_STRING } from '$lib/server/model/google';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { createPending } from '$lib/server/database';
import env from '$lib/model/src/env/oauth';
import { fetchDiscoveryDocument } from '$lib/server/model/openid';
import { StatusCodes } from 'http-status-codes';

/**
 * Handles the GET request to initiate the OAuth2 login process.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.cookies - The cookies object provided by SvelteKit.
 * @returns {Promise<void>} Redirects to the Google OAuth2 authorization endpoint.
 * @throws Will throw a redirect to the Google OAuth2 authorization endpoint with the necessary parameters.
 */
export const GET: RequestHandler = async ({ cookies }) => {
	const { session_id, nonce, expiration } = await createPending();
	cookies.set('sid', session_id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		expires: expiration
	});
	const params = new URLSearchParams({
		state: Buffer.from(blake3(session_id)).toString('base64url'),
		client_id: env.GOOGLE_ID,
		redirect_uri: env.OAUTH_REDIRECT,
		nonce: Buffer.from(nonce).toString('base64url'),
		access_type: 'online',
		response_type: 'code',
		scope: OAUTH_SCOPE_STRING,
		prompt: 'select_account'
	});

	const { authorization_endpoint } = await fetchDiscoveryDocument();
	throw redirect(StatusCodes.MOVED_TEMPORARILY, `${authorization_endpoint}?${params}`);
};
