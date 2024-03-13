import { getEvacData } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

export async function load({params:{id}}) {
    const objId = ObjectId.createFromHexString(id);
    const res = await getEvacData(objId);

    if (res === false) error(StatusCodes.NOT_FOUND);
    res._id = res._id?.toString();

    return res;
}