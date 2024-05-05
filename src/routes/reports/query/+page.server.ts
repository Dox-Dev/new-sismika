import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';
//import { addEarthquakeData, getUserFromSession } from '$lib/server/database';
import { getUserFromSession } from '$lib/server/database';
import { Permission } from '$lib/model/src/user';
import { parseIntOrZero, parseOrZero, type BoundingBox, type Coordinates } from '$lib/model/src/util';
import { z } from 'zod'

function filterParamHandler(form: FormData){
	let param: Record<string, string> = {};

	form.forEach((val, key) => {
		console.log(val, key)
		if (["maxDepth", "minDepth", "maxIntensity", "minIntensity", "radius", "limit"].includes(key)) {
			console.log('in ' + key);
			if (parseIntOrZero(val?.toString()) !== 0) {
				const parse = z.coerce.number().safeParse(val?.toString());
				if (parse.success) param[key] = parse.data.toString();
			}	
		}
		else if (["minTime", "maxTime"].includes(key)) {
			const parse = z.coerce.date().safeParse(val?.toString());
			if (parse.success) param[key] = parse.data.toISOString();
		}
	});
	console.log(param);
	return new URLSearchParams(Object.entries(param));
}
export const actions = {
	async default({ cookies, request }) {
		const form = await request.formData();
		const fitlerParams = filterParamHandler(form);
		redirect(StatusCodes.MOVED_TEMPORARILY, `/reports?`+ fitlerParams)
	}
} satisfies Actions;
