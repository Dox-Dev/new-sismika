import { getAllEarthquakeData, getAllEvacData, getAllStationData } from '$lib/server/database';

export async function load() {
	const equakeData = await getAllEarthquakeData();
	const evacData = await getAllEvacData();
	const stationData = await getAllStationData();

	return { equake: equakeData.equakes, evac: evacData.evacs, station: stationData.stations };
}
