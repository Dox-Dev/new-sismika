import { Permission } from '$lib/model/src/user.js';
import { getAllEarthquakeData, getUserFromSession } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({cookies}) {
	const sid = cookies.get('sid');
	if (!sid) error(StatusCodes.UNAUTHORIZED)
	
	const user = await getUserFromSession(sid);
	if (!user) error(StatusCodes.UNAUTHORIZED);
	if (user.permission < Permission.RESEARCHER) error(StatusCodes.FORBIDDEN);

	const {equakes} = await getAllEarthquakeData();
	return {equakes};
}
