import { getAllStationData, getStationData } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

export async function load({params: {id}}) {
    const query = ObjectId.createFromHexString(id)
    const res = await getStationData(query);

    if (res === false) error(StatusCodes.NOT_FOUND);
    res._id = res._id?.toString()

    return {selectedStation: res}
}

