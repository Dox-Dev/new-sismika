import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
import { addEarthquakeData, getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { parseOrZero } from '$lib/model/src/util';
import { EarthquakeEventSchema } from '$lib/model/src/event';

export const actions = {
    async default({cookies, request}) {
        const form = await request.formData();

        const time = form.get('time')?.toString();
        if (time === undefined) return fail(StatusCodes.BAD_REQUEST);

        const long = form.get('long')?.toString();
        if (long === undefined) return fail(StatusCodes.BAD_REQUEST);
        
        const lat = form.get('lat')?.toString();
        if (lat === undefined) return fail(StatusCodes.BAD_REQUEST);

        const depth = form.get('depth');
        if (depth === null || depth instanceof File) return fail(StatusCodes.BAD_REQUEST);
        const mi = form.get('mi')?.toString()
        const mb = form.get('mb')?.toString()
        const ms = form.get('ms')?.toString()
        const mw = form.get('mw')?.toString()
        if ( mi === undefined && mb === undefined && ms === undefined && mw === undefined) return fail(StatusCodes.BAD_REQUEST);

        const li = form.get('li')?.toString();
        if (li === undefined) return fail(StatusCodes.BAD_REQUEST);

        const sid = cookies.get('sid');
        if (!sid) throw error(StatusCodes.UNAUTHORIZED);
        // A check can be done to see if a session exists.

        const user = await getUserFromSession(sid);
        if (user === false) throw error(StatusCodes.UNAUTHORIZED);
        if (user.permission < Permission.RESEARCHER) throw error(StatusCodes.FORBIDDEN);

        const insert = {
            time,
			coord: {
				type: "Point",
				coordinates: [parseFloat(long), parseFloat(lat)]
			},
			depth: parseInt(depth),
			mi: parseOrZero(mi),
			mb: parseOrZero(mb),
			ms: parseOrZero(ms),
			mw: parseOrZero(mw),
			li: li ?? ''
        }

        const insertValidated = EarthquakeEventSchema.parse(insert);
        const result = await addEarthquakeData(insertValidated)
        const resId = result.toString()
        if (typeof result === 'object') {
            throw redirect(StatusCodes.MOVED_TEMPORARILY, `/earthquake/${resId}`)
        }
        throw error(StatusCodes.NOT_FOUND);
    }
} satisfies Actions