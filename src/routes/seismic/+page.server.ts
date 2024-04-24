import { paginationHandler } from '$lib/model/src/util.js';
import { getAllStationData } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ url: { searchParams } }) {
	const { page, limit } = paginationHandler(searchParams);

	const res = await getAllStationData(page, limit);

	const data = { ...res, page, limit };
	return data;
}
