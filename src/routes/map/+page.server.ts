import { getAllEarthquakeData, getAllEvacData, getAllStationData } from '$lib/server/database';

/**
 * Loads all earthquake data, evacuation center data, and station data.
 *
 * @returns {Promise<Object>} An object containing earthquake data, evacuation center data, and station data.
 */
export async function load() {
	const equakeData = await getAllEarthquakeData();
	const evacData = await getAllEvacData();
	const stationData = await getAllStationData();

	return { equake: equakeData.equakes, evac: evacData.evacs, station: stationData.stations };
}
