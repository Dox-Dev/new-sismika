import { getAllEvacData } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

/**
 * Loads all evacuation center data.
 *
 * @returns {Promise<Object>} An object containing all evacuation center data.
 * @throws Will throw an error if the evacuation center data is not found.
 */
export async function load() {
	const res = await getAllEvacData();
	if (res === false) error(StatusCodes.NOT_FOUND);

	res.forEach((element) => {
		element._id = element._id?.toString();
	});

	const data = { evacData: res };
	return data;
}
