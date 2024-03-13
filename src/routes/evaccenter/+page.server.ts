import { getAllEvacData } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export async function load() {
    const res = await getAllEvacData();
    if (res === false) error(StatusCodes.NOT_FOUND);

    res.forEach(element => {
        element._id = element._id?.toString()
    });

    const data = { evacData: res }
    return data;
}