import { paginationHandler } from '$lib/model/src/util.js';
import { getProvincialLocations } from '$lib/server/database/index.js';

/**
 * Loads paginated provincial location data.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.url - The URL object provided by SvelteKit.
 * @param {URLSearchParams} params.url.searchParams - The URL search parameters.
 * @returns {Promise<Object>} An object containing paginated provincial location data, page number, and limit.
 */
export async function load({ url: { searchParams } }) {
	const { page, limit } = paginationHandler(searchParams);

	const res = await getProvincialLocations(page, limit);

	const data = { ...res, page, limit };

	return data;
}
