import {
	getAllEarthquakeData,
	getAllStationData,
	getLocationFromPSGC
} from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ params: { id } }) {
	const location = await getLocationFromPSGC(id);
	if (location === false || location?.boundingBox === undefined) error(StatusCodes.BAD_REQUEST);

	const stations = await getAllStationData();

	const res = await getAllEarthquakeData(undefined, undefined, {
		geographicBound: location.boundingBox
	});

	return {
		equake: res.equakes,
		totalCount: res.totalCount,
		location,
		station: stations.stations,
		evac: []
	};
}
