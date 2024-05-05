import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
//import { addEarthquakeData, getUserFromSession } from '$lib/server/database';
import { getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { parseIntOrZero, parseOrZero } from '$lib/model/src/util';
import { z } from 'zod'

export async function load({cookies}) {
	const sid = cookies.get('sid');
	if (!sid) error(StatusCodes.UNAUTHORIZED);

	const user = await getUserFromSession(sid);
	if (!user) error(StatusCodes.UNAUTHORIZED);
	if (user.permission < Permission.RESEARCHER) error(StatusCodes.FORBIDDEN);
}

const formKeys = ["selection", "maxDepth", "minDepth", "maxIntensity", "minIntensity", "radius", "limit", "tl_long", "tl_lat", "tr_long", "tr_lat", "bl_long", "bl_lat", "br_long", "br_lat", "c_long", "c_lat"]
export const actions = {
	async default({ request }) {
		const form = await request.formData();

		let param: Record<string, string> = {};
		form.forEach((val, key) => {
			if (formKeys.includes(key)) {
				if (parseOrZero(val?.toString()) !== 0) {
					const parse = z.coerce.number().safeParse(val?.toString());
					if (parse.success) param[key] = parse.data.toString();
				}	
			}
			else if (["minTime", "maxTime"].includes(key)) {
				const parse = z.coerce.date().safeParse(val?.toString());
				if (parse.success) param[key] = parse.data.toISOString();
			}
		});
		
		const selection = parseIntOrZero(form.get('selection')?.toString());
		const keys = Object.keys(param);

		if (selection === 1) {
			for (let key of ["tl_long", "tl_lat", "tr_long", "tr_lat", "bl_long", "bl_lat", "br_long", "br_lat"]) {
				if (!keys.includes(key)) {
					return fail(StatusCodes.BAD_REQUEST, {...param, missingCoord: true});
				}
			}
		} else if (selection === 2) {
			for (let key of ["c_long", "c_lat", "radius"]) {
				if (!keys.includes(key)) return fail(StatusCodes.BAD_REQUEST, {...param, missingCoord: true});
			}
		}
		
		const fitlerParams = new URLSearchParams(Object.entries(param));
		redirect(StatusCodes.MOVED_TEMPORARILY, `/reports?`+ fitlerParams)
	}
} satisfies Actions;
