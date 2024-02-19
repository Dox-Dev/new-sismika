import { error } from "@sveltejs/kit";
import { connect } from "$lib/server/database";
import { EarthquakeEventSchema } from "$lib/model/src/event";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Collection } from "$lib/model/src/util";

export async function GET(){
    const db = await connect();
    if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, "Database connection error.");

    const collection = db.collection(Collection.EARTHQUAKE);
    const equakeCursor = collection.find({});
    const equakes = await equakeCursor.toArray();

    if (equakes.length === 0) error(StatusCodes.NOT_FOUND, "Nothing retrieved.");

    try {
        const validated = equakes.map(doc => EarthquakeEventSchema.parse(doc))
        return {status: StatusCodes.OK, body:validated};
    } catch (err) {
        error(StatusCodes.BAD_REQUEST, "Data validation error");
    }
}

export async function POST({request}){
    const db = await connect();
    if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, "Database connection error.");

    const collection = db.collection(Collection.EARTHQUAKE);
    const equakeCursor = collection.find({});
    const equakes = await equakeCursor.toArray();

    if (equakes.length === 0) error(StatusCodes.NOT_FOUND, "Nothing retrieved.");

    try {
        const validated = equakes.map(doc => EarthquakeEventSchema.parse(doc))
        return {status: StatusCodes.OK, body:validated};
    } catch (err) {
        error(StatusCodes.BAD_REQUEST, "Data validation error");
    }
}

export async function DEL(){

}