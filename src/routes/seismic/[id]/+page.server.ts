import { getAllStationData } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export async function load() {
    const res = await getAllStationData();
    if (res === false) error(StatusCodes.NOT_FOUND);

    res.forEach(el => {
        el._id = el._id?.toString()
    })

    const data = { stationData: res};
    return data;
}

