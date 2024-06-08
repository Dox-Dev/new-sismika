import { paginationHandler } from '$lib/model/src/util.js';
import {
	collateNearbyLocations,
	getEarthquakeData,
	getMediaForEarthquake,
	resolveEarthquakeTitle
} from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

/**
 * Loads earthquake data, collates nearby locations, and fetches media articles for the earthquake.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.params - The URL parameters provided by SvelteKit.
 * @param {string} params.params.id - The earthquake ID as a string.
 * @param {Object} params.url - The URL object provided by SvelteKit.
 * @param {URLSearchParams} params.url.searchParams - The URL search parameters.
 * @returns {Promise<Object>} An object containing earthquake data, affected locations, population, media articles, and pagination details.
 * @throws Will throw an error if the earthquake data is not found.
 */
export async function load({ params: { id }, url: { searchParams } }) {
	const { page: mediaPage, limit: mediaLimit } = paginationHandler(
		searchParams,
		{ name: 'mPage', number: 0 },
		{ name: 'mLimit', number: 10 }
	);

	const objId = ObjectId.createFromHexString(id);
	const res = await getEarthquakeData(objId);
	const effectId = await collateNearbyLocations(objId);
	const articles = await getMediaForEarthquake(objId, mediaPage, mediaLimit);

	if (res === false) error(StatusCodes.NOT_FOUND);
	return {
		selectedEarthquake: res,
		affectedLocations: effectId.locations,
		locationSize: effectId.totalCount,
		affectedPopulation: effectId.totalPopulation,
		articles: articles.articles,
		articleSize: articles.totalCount,
		mediaPage,
		mediaLimit,
		title: res.title
	};
}
