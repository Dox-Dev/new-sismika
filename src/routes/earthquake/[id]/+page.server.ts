import { collateNearbyLocations, getEarthquakeData, getMediaForEarthquake } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

export async function load({ params: { id } }) {
	const objId = ObjectId.createFromHexString(id);
	const res = await getEarthquakeData(objId);
	const effectId = await collateNearbyLocations(objId);
	const articles = await getMediaForEarthquake(objId)

	if (typeof articles !== 'boolean') articles.forEach(element => {
		element._id = element._id?.toString()
		element.equakeId =  element.equakeId?.toString()
	});

	if (res === false) error(StatusCodes.NOT_FOUND);
	res._id = res._id?.toString();

	return { selectedEarthquake: res, affected: effectId, articles };
}	
