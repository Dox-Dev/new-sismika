import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
import { addEarthquakeData, getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { parseOrZero } from '$lib/model/src/util';
import { EarthquakeEventSchema } from '$lib/model/src/event';

export const actions = {
	async default({ cookies, request }) {
		const form = await request.formData();

		const time = form.get('time')?.toString();
		if (time === undefined) return fail(StatusCodes.BAD_REQUEST, { missing: true });

		const long = form.get('long')?.toString();
		if (long === undefined) return fail(StatusCodes.BAD_REQUEST, { time, missing: true });

		const lat = form.get('lat')?.toString();
		if (lat === undefined) return fail(StatusCodes.BAD_REQUEST, { time, long, missing: true });

		const depth = form.get('depth');
		if (depth === null || depth instanceof File)
			return fail(StatusCodes.BAD_REQUEST, { time, long, lat, missing: true });
		const mi = form.get('mi')?.toString();
		const mb = form.get('mb')?.toString();
		const ms = form.get('ms')?.toString();
		const mw = form.get('mw')?.toString();
		if (mi === undefined && mb === undefined && ms === undefined && mw === undefined)
			return fail(StatusCodes.BAD_REQUEST, { time, long, lat, depth, missing: true });

		const li = form.get('li')?.toString();
		if (li === undefined)
			return fail(StatusCodes.BAD_REQUEST, { time, long, lat, depth, mw, missing: true });

		const sid = cookies.get('sid');
		if (!sid) return fail(StatusCodes.UNAUTHORIZED, { time, long, lat, depth, mw, authFail: true });
		// A check can be done to see if a session exists.

		const user = await getUserFromSession(sid);
		if (user === false)
			return fail(StatusCodes.UNAUTHORIZED, { time, long, lat, depth, mw, authFail: true });
		if (user.permission < Permission.RESEARCHER)
			return fail(StatusCodes.UNAUTHORIZED, { time, long, lat, depth, mw, noPerms: true });

		const insert = {
			time: new Date(time).toISOString(),
			coord: {
				type: 'Point',
				coordinates: [parseFloat(long), parseFloat(lat)]
			},
			depth: parseInt(depth),
			mi: parseOrZero(mi),
			mb: parseOrZero(mb),
			ms: parseOrZero(ms),
			mw: parseOrZero(mw),
			li: li ?? ''
		};

		try {
			const insertValidated = EarthquakeEventSchema.parse(insert);
			const result = await addEarthquakeData(insertValidated);
			const resId = result.toString();
			if (typeof result === 'object') {
				return redirect(StatusCodes.MOVED_TEMPORARILY, `/earthquake/${resId}`);
			}
			return fail(StatusCodes.BAD_REQUEST, { time, long, lat, depth, mw, li, parseFail: true });
		} catch (err) {
			throw err;
		}
	}
} satisfies Actions;
