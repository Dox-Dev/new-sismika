import { paginationHandler } from '$lib/model/src/util.js';
import { getProvincialLocations } from '$lib/server/database/index.js';

export async function load({ url: { searchParams } }) {
	const { page, limit } = paginationHandler(searchParams);

	const res = await getProvincialLocations(page, limit);

	const data = { ...res, page, limit };

	return data;
}
