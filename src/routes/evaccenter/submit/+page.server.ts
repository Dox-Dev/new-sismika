import { EvacCenterSchema } from '$lib/model/src/evac.js';
import { Permission } from '$lib/model/src/user.js';
import { addEvacData, getUserFromSession } from '$lib/server/database/index.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
    async default({cookies, request}) {
        const form = await request.formData();

        const name = form.get('name')?.toString();
        if (name === undefined) return fail(StatusCodes.BAD_REQUEST);

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
            name,
            coord: {
                type: "Point",
                coordinates: [parseFloat(long), parseFloat(lat)]
            }
        }

        const validatedPayload = EvacCenterSchema.parse(payload);
        const result = await addEvacData(validatedPayload);
        const resId = result.toString()
        if (typeof result === 'object') {
            throw redirect(StatusCodes.MOVED_TEMPORARILY, `/evaccenter/${resId}`)
        }
        
        throw error(StatusCodes.NOT_FOUND);
    }
}