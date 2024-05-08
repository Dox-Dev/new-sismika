import { paginationHandler } from '$lib/model/src/util.js';
import {
	getAllEarthquakeData,
	getAllStationData,
	getLocationFromPSGC
} from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ params: { id }, url: {searchParams}}) {
	const location = await getLocationFromPSGC(id);
	if (location === false || location?.boundingBox === undefined) error(StatusCodes.BAD_REQUEST);

	const { page, limit } = paginationHandler(searchParams);

	const res = await getAllEarthquakeData(page, limit, {
		geographicBound: location.boundingBox
	});

	return {
		page,
		limit,
		equake: res.equakes,
		totalCount: res.totalCount,
		location,
		evac: []
	};
}
