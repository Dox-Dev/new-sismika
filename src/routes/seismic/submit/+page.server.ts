/*
import { StationSchema } from '$lib/model/src/station.js';
import { Permission } from '$lib/model/src/user.js';
import { addStationData, getUserFromSession } from '$lib/server/database/index.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
	async default({ cookies, request }) {
		const form = await request.formData();

		const code = form.get('code')?.toString();
		if (code === undefined) return fail(StatusCodes.BAD_REQUEST);

		const name = form.get('name')?.toString();
		if (name === undefined) return fail(StatusCodes.BAD_REQUEST);

		const type = form.get('type')?.toString();
		if (type === undefined) return fail(StatusCodes.BAD_REQUEST);

		const long = form.get('long')?.toString();
		if (long === undefined) return fail(StatusCodes.BAD_REQUEST);

		const lat = form.get('lat')?.toString();
		if (lat === undefined) return fail(StatusCodes.BAD_REQUEST);

		const sid = cookies.get('sid');
		if (!sid) throw error(StatusCodes.UNAUTHORIZED);

		const user = await getUserFromSession(sid);
		if (user === false) throw error(StatusCodes.UNAUTHORIZED);
		if (user.permission < Permission.RESEARCHER) throw error(StatusCodes.FORBIDDEN);

		const payload = {
			code,
			name,
			type,
			coord: {
				type: 'Point',
				coordinates: [long, lat]
			}
		};

		const validatedPayload = StationSchema.parse(payload);
		const result = await addStationData(validatedPayload);
		if (typeof result === 'object') {
			const resId = result.toString();
			throw redirect(StatusCodes.MOVED_TEMPORARILY, `/seismic/${resId}`);
		}

		throw error(StatusCodes.NOT_FOUND);
	}
};
*/

import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
import { addStationData, getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { StationSchema } from '$lib/model/src/station';

export const actions = {
	async default({ cookies, request }) {
		const form = await request.formData();

		const code = form.get('code')?.toString();
		if (code === undefined) return fail(StatusCodes.BAD_REQUEST, { missing: true });

		const name = form.get('name')?.toString();
		if (name === undefined) return fail(StatusCodes.BAD_REQUEST, { code, missing: true });

		const type = form.get('type')?.toString();
		if (name === undefined) return fail(StatusCodes.BAD_REQUEST, { code, name, missing: true });

		const long = form.get('long')?.toString();
		if (long === undefined)
			return fail(StatusCodes.BAD_REQUEST, { code, name, type, missing: true });

		const lat = form.get('lat')?.toString();
		if (lat === undefined)
			return fail(StatusCodes.BAD_REQUEST, { code, name, type, long, missing: true });

		//console.log('reaches before trycatch');
		const sid = cookies.get('sid');
		if (!sid)
			return fail(StatusCodes.UNAUTHORIZED, { code, name, type, long, lat, authFail: true });
		// A check can be done to see if a session exists.

		const user = await getUserFromSession(sid);
		if (user === false)
			return fail(StatusCodes.UNAUTHORIZED, { code, name, type, long, lat, authFail: true });
		if (user.permission < Permission.RESEARCHER)
			return fail(StatusCodes.UNAUTHORIZED, { code, name, type, long, lat, noPerms: true });

		const insert = {
			code,
			name,
			type,
			coord: {
				type: 'Point',
				coordinates: [parseFloat(long), parseFloat(lat)]
			}
		};

		try {
			const insertValidated = StationSchema.parse(insert);
			const result = await addStationData(insertValidated);
			const resId = result.toString();
			if (typeof result === 'object') {
				return redirect(StatusCodes.MOVED_TEMPORARILY, `/seismic/${resId}`);
			}
			return fail(StatusCodes.BAD_REQUEST, { long, lat, parseFail: true });
		} catch (err) {
			throw err;
		}
	}
} satisfies Actions;
