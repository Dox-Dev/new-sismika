import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
import { addEvacData, getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { EvacCenterSchema } from '$lib/model/src/evac';

export const actions = {
    /**
     * Default action handler for submitting evacuation center data.
     *
     * @param {Object} params - The parameters object.
     * @param {Object} params.cookies - The cookies object provided by SvelteKit.
     * @param {Object} params.request - The request object provided by SvelteKit.
     * @returns {Promise<Response>} Redirects to the newly created evacuation center page on success or returns a failure response on error.
     * @throws Will throw an error if there is an issue with the form data, authentication, permissions, or database operations.
     */
	async default({ cookies, request }) {
		const form = await request.formData();

		const name = form.get('name')?.toString();
		if (name === undefined) return fail(StatusCodes.BAD_REQUEST, { missing: true });

		const long = form.get('long')?.toString();
		if (long === undefined) return fail(StatusCodes.BAD_REQUEST, { name, missing: true });

		const lat = form.get('lat')?.toString();
		if (lat === undefined) return fail(StatusCodes.BAD_REQUEST, { name, long, missing: true });

		//console.log('reaches before trycatch');
		const sid = cookies.get('sid');
		if (!sid) return fail(StatusCodes.UNAUTHORIZED, { name, long, lat, authFail: true });
		// A check can be done to see if a session exists.

		const user = await getUserFromSession(sid);
		if (user === false) return fail(StatusCodes.UNAUTHORIZED, { name, long, lat, authFail: true });
		if (user.permission < Permission.RESEARCHER)
			return fail(StatusCodes.UNAUTHORIZED, { name, long, lat, noPerms: true });

		const insert = {
			name,
			coord: {
				type: 'Point',
				coordinates: [parseFloat(long), parseFloat(lat)]
			}
		};

		try {
			const insertValidated = EvacCenterSchema.parse(insert);
			const result = await addEvacData(insertValidated);
			const resId = result.toString();
			if (typeof result === 'object') {
				return redirect(StatusCodes.MOVED_TEMPORARILY, `/evaccenter/${resId}`);
			}
			return fail(StatusCodes.BAD_REQUEST, { long, lat, parseFail: true });
		} catch (err) {
			throw err;
		}
	}
} satisfies Actions;
