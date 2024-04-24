import { paginationHandler } from '$lib/model/src/util.js';
import { collateNearbyLocations, getEarthquakeData, getMediaForEarthquake, resolveEarthquakeTitle } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

export async function load({ params: { id }, url: {searchParams}}) {
	const {page: mediaPage, limit: mediaLimit} = paginationHandler(searchParams, {name: 'mPage', number: 0 }, {name: 'mLimit', number: 10})
	
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
