import { getEarthquakeData } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

export async function load({params:{id}}) {
    const objId = new ObjectId()
    const res = await getEarthquakeData(objId);

    if (res === null) error(StatusCodes.NOT_FOUND);

    return res;
}