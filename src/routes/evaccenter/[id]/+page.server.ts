import { getEvacData } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

/**
 * Loads evacuation center data based on the provided evacuation center ID.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.params - The URL parameters provided by SvelteKit.
 * @param {string} params.params.id - The evacuation center ID as a string.
 * @returns {Promise<Object>} An object containing the selected evacuation center data.
 * @throws Will throw an error if the evacuation center data is not found.
 */
export async function load({ params: { id } }) {
	const objId = ObjectId.createFromHexString(id);
	const res = await getEvacData(objId);

	if (res === false) error(StatusCodes.NOT_FOUND);
	res._id = res._id?.toString();

	return { selectedEvac: res };
}
