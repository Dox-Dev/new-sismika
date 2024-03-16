import { getAllStationData } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export async function load() {
    const res = await getAllStationData();
    if (res === false) error(StatusCodes.NOT_FOUND);

    res.forEach(element => {
        element._id = element._id?.toString()
    });

    const data = { stationData: res }
    return data
}