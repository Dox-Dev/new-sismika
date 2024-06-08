import { paginationHandler } from '$lib/model/src/util.js';
import {
	getAllEarthquakeData,
	getAllStationData,
	getLocationFromPSGC
} from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

/**
 * Loads paginated earthquake data, location data, and station data based on the provided location ID.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.params - The URL parameters provided by SvelteKit.
 * @param {string} params.params.id - The location ID (PSGC) as a string.
 * @param {Object} params.url - The URL object provided by SvelteKit.
 * @param {URLSearchParams} params.url.searchParams - The URL search parameters.
 * @returns {Promise<Object>} An object containing paginated earthquake data, total count, location data, and evacuation centers (currently empty).
 * @throws Will throw an error if the location data is not found or if the bounding box is undefined.
 */
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
