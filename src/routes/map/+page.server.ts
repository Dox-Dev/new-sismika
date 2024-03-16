import { getAllEarthquakeData, getAllEvacData, getAllStationData } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load() {
	const equakeData = await getAllEarthquakeData();
	const evacData = await getAllEvacData();
	const stationData = await getAllStationData();

	if (equakeData !== false) equakeData.map((data) => (data._id = data._id?.toString()));
	if (evacData !== false) evacData.map((data) => (data._id = data._id?.toString()));
	if (stationData !== false) stationData.map((data) => (data._id = data._id?.toString()));

	if ([equakeData, evacData, stationData].every((el) => el === false)) error(StatusCodes.NOT_FOUND);

	return { equake: equakeData, evac: evacData, station: stationData };
}
