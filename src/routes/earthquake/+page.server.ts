import { paginationHandler, parseIntOrZero } from '$lib/model/src/util.js';
import { getAllEarthquakeData } from '$lib/server/database/index.js';

export async function load({ url: { searchParams } }) {
	const { page, limit } = paginationHandler(searchParams);
	const res = await getAllEarthquakeData(page, limit);
	const data = { ...res, page, limit };
	return data;
}
