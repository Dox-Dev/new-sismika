import { getAllEarthquakeData } from "$lib/server/database";
import { error } from '@sveltejs/kit';
import { StatusCodes } from "http-status-codes";

export async function load() {
    const res = await getAllEarthquakeData();
    if (res === false) error(StatusCodes.NOT_FOUND);
    res.map(doc => doc._id = doc._id?.toString())
    console.log(res)
    return {equake: res}
}