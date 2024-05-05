import { EarthquakeFilteringSchema, type EarthquakeFilters } from '$lib/model/src/event.js';
import { Permission } from '$lib/model/src/user.js';
import type { BoundingBox, Coordinates } from '$lib/model/src/util.js';
import { getAllEarthquakeData, getUserFromSession } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod'

const formKeys = ["maxDepth", "minDepth", "maxIntensity", "minIntensity", "radius", "limit", "tl_long", "tl_lat", "tr_long", "tr_lat", "bl_long", "bl_lat", "br_long", "br_lat", "c_long", "c_lat"]
export async function load({ cookies, url: { searchParams }}) {
	const sid = cookies.get('sid');
	if (!sid) error(StatusCodes.UNAUTHORIZED);

	const user = await getUserFromSession(sid);
	if (!user) error(StatusCodes.UNAUTHORIZED);
	if (user.permission < Permission.RESEARCHER) error(StatusCodes.FORBIDDEN);

	const query: Record<string, number | boolean | string | BoundingBox | Coordinates > = {};

	searchParams.forEach((val, key) => {
		if (formKeys.includes(key)) {
			query[key] = z.coerce.number().parse(val)
		}
		else if (["minTime", "maxTime"].includes(key)) {
			query[key] = z.coerce.string().datetime().parse(val);
		}
	})

	const selected = z.coerce.number().parse(searchParams.get("selection"));

	if (selected === 1) {
		query['geographicBound'] = {
			type: "Polygon",
			coordinates: [[query.bl_long, query.bl_lat], [query.tl_long, query.tl_lat], [query.br_long, query.br_lat], [query.tr_long, query.tr_lat]]
		} as BoundingBox;
	} else if (selected === 2) {
		query['coordinateCenter'] = {
			type: "Point",
			coordinates: [query.c_long, query.c_lat]
		} as Coordinates;
	}

	const parsedQuery = EarthquakeFilteringSchema.parse(query)
	console.log(parsedQuery)
	const { equakes } = await getAllEarthquakeData(undefined, undefined, parsedQuery);
	return { equakes };
}
