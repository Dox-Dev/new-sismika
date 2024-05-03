import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
//import { addEarthquakeData, getUserFromSession } from '$lib/server/database';
import { getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { parseOrZero } from '$lib/model/src/util';
import { EarthquakeFilteringSchema } from '$lib/model/src/event';

export const actions = {
	async default({ cookies, request }) {
		const form = await request.formData();

		/*
		// I wasn't sure if this was the way
		// to get the maxDepth and minDepth
		const depth = form.get('depth');
		if (depth === null || depth instanceof File)
			return fail(StatusCodes.BAD_REQUEST, { time, long, lat, missing: true });
		*/

		const maxDepth = form.get('maxDepth')?.toString();
		if (maxDepth === undefined) return fail(StatusCodes.BAD_REQUEST, { missing: true });

		const minDepth = form.get('minDepth')?.toString();
		if (minDepth === undefined) return fail(StatusCodes.BAD_REQUEST, { maxDepth, missing: true });

		const maxIntensity = form.get('maxIntensity')?.toString();
		if (maxIntensity === undefined) return fail(StatusCodes.BAD_REQUEST, { maxDepth, minDepth, missing: true });

		const minIntensity = form.get('minIntensity')?.toString();
		if (minIntensity === undefined) return fail(StatusCodes.BAD_REQUEST, { maxDepth, minDepth, maxIntensity, missing: true });

		const maxTime = form.get('maxTime')?.toString();
		if (maxTime === undefined) return fail(StatusCodes.BAD_REQUEST, { maxDepth, minDepth, maxIntensity, minIntensity, missing: true });

		const minTime = form.get('minTime')?.toString();
		if (minTime === undefined) return fail(StatusCodes.BAD_REQUEST, { maxDepth, minDepth, maxIntensity, minIntensity, maxTime, missing: true });

		// TODO: add way to get geographicBound or coordinateCenter
		// Notes:
		// - to check for error, check if geographicBound is defined while coordinateCenter is NOT defined
		//   or vice-versa (this results in no error)
		// - Errors: both are defined, neither are defined


		// DIVIDER (below is original)

		/*
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
		*/

		const sid = cookies.get('sid');
		if (!sid) return fail(StatusCodes.UNAUTHORIZED, { maxDepth, minDepth, maxIntensity, minIntensity, maxTime, authFail: true });
		// A check can be done to see if a session exists.

		const user = await getUserFromSession(sid);
		if (user === false)
			return fail(StatusCodes.UNAUTHORIZED, { maxDepth, minDepth, maxIntensity, minIntensity, maxTime, authFail: true });
		if (user.permission < Permission.RESEARCHER)
			return fail(StatusCodes.UNAUTHORIZED, { maxDepth, minDepth, maxIntensity, minIntensity, maxTime, noPerms: true });

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
			li: li ?? '',
			title: ''
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
