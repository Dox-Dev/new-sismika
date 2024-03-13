import { getAllEarthquakeData } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load () {
    const res = await getAllEarthquakeData();
    if (res === false) error(StatusCodes.NOT_FOUND);

    res.forEach(element => {
        element._id = element._id?.toString()
    });

    const data = { equakeData: res }
    return data;
}