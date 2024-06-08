import {
	getAllEarthquakeData,
	getAllStationData,
	getLocationFromPSGC
} from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

/**
 * Loads data for earthquakes, stations, and location based on the provided location ID.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.params - The URL parameters provided by SvelteKit.
 * @param {string} params.params.id - The location ID (PSGC) as a string.
 * @returns {Promise<Object>} An object containing earthquake data, total count, location data, station data, and evacuation centers (currently empty).
 * @throws Will throw an error if the location data is not found or if the bounding box is undefined.
 */
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
