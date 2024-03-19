import { MongoClient, ObjectId, Binary } from 'mongodb';
import { DatabaseConnectionError, ParseValidationError } from '$lib/model/src/errors';
import { EarthquakeEventSchema, type EarthquakeEvent } from '$lib/model/src/event';
import { Collection } from '$lib/model/src/util';
import { EvacCenterSchema, type EvacCenter } from '$lib/model/src/evac';
import { StationSchema } from '$lib/model/src/station';
import { PendingSchema, SessionSchema } from '../model/session';
import { v4 as uuidv4 } from 'uuid';
import { randomFillSync } from 'crypto';
import { ok } from 'assert';
import { UserSchema, type User } from '$lib/model/src/user';
import type { Session } from '$lib/server/model/session';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

/**
 * Attempts to connect to the MongoDB client with the following information.
 * @returns connect
 */
async function connect() {
	try {
		await client.connect();
		return client.db('sismika');
	} catch (err) {
		console.error('MongoDB connection error:', err);
		throw DatabaseConnectionError;
	}
}
/**
 * Adds EarthquakeEvent to the MongoDB database.
 * @param data : validated EarthquakeEvent
 * @returns insertedId: the ObjectId of the inserted entry
 */
export async function addEarthquakeData(data: EarthquakeEvent) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EARTHQUAKE);

		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);
		return insertedId;
	} catch (err) {
		throw err;
	}
}

/**
 * Gets all EarthquakeEvent from the MongoDB database.
 * @returns EarthquakeEventSchema[] an array of validated EarthquakeEvents
 * @returns false - if there is no earthquakeData in the database
 */
export async function getAllEarthquakeData() {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);
	const equakeCursor = collection.find({});
	const equakes = await equakeCursor.toArray();

	if (equakes === null) return false;

	try {
		const validated = equakes.map((doc) => EarthquakeEventSchema.parse(doc));
		return validated;
	} catch (err) {
		throw ParseValidationError;
	}
}

/**
 * Gets a singular entry of an EarthquakeEvent given an ObjectId
 * @param id an ObjectId of the EartquakeEvent to retrieve
 * @returns validated an single entry of an EartquakeEvent
 * @returns false if nothing was found
 */
export async function getEarthquakeData(id: ObjectId) {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);
	const equakeCursor = await collection.findOne({ _id: id });
	console.log(equakeCursor);
	if (equakeCursor === null) return false;

	try {
		const validated = EarthquakeEventSchema.parse(equakeCursor);
		return validated;
	} catch (err) {
		throw ParseValidationError;
	}
}

/**
 * Removes a singular entry of an EarthquakeEvent given an ObjectId
 * @param id an ObjectId of the EarthquakeEvent to remove
 * @returns deletecCount a count on how many was removed
 */
export async function deleteEarthquakeData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EARTHQUAKE);
		const { deletedCount } = await collection.deleteOne({ _id: id });
		return deletedCount;
	} catch (err) {
		throw err;
	}
}

/**
 * Gets all Stations in the MongoDB database.
 * @returns StationSchema[]: returns an array of validated StationSchemas
 * @returns false - if no StationData is found
 */
export async function getAllStationData() {
	const db = await connect();

	const collection = db.collection(Collection.STATION);
	const stationCursor = collection.find({});

	if (stationCursor === null) return false;

	const stations = await stationCursor.toArray();

	try {
		const validated = stations.map((doc) => StationSchema.parse(doc));
		return validated;
	} catch (err) {
		throw ParseValidationError;
	}
}

/**
 * Adds a station to the MongoDB database.
 * @param data a validated StationSchema to add to the database
 * @returns insertedId a ObjectId of the inserted entry
 */
export async function addStationData(data: StationSchema) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.STATION);
		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);

		return insertedId;
	} catch (err) {
		throw err;
	}
}

/**
 * Deletes a Station entry given a ObjectId
 * @param id a MongoDB ObjectId
 * @returns deletedCount a value indicating how many was removed
 */
export async function deleteStationData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.STATION);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieve a StationData given an ObjectId
 * @param id a MongoDB ObjectId of the station to be found
 * @returns validated a validated StationData
 * @returns false - if no ObjectId of the StationData was found
 */
export async function getStationData(id: ObjectId) {
	const db = await connect();

	const collection = db.collection(Collection.STATION);
	const stationCursor = await collection.findOne({ _id: id });
	console.log(stationCursor);
	if (stationCursor === null) return false;

	try {
		const validated = StationSchema.parse(stationCursor);
		return validated;
	} catch (err) {
		throw err;
	}
}

/**
 * Gets all entries in the MongoDB database for all Evacuation center entries
 * @returns EvacCenter[]: an array of EvacCenters
 * @false - if MongoDB does not have any EvacCenters
 */
export async function getAllEvacData() {
	const db = await connect();

	const collection = db.collection(Collection.EVAC);
	const evacCursor = collection.find({});

	if (evacCursor === null) return false;

	const evacs = await evacCursor.toArray();

	try {
		const validated = evacs.map((doc) => EvacCenterSchema.parse(doc));
		return validated;
	} catch (err) {
		throw err;
	}
}

/**
 * Adds an EvacCenter entry to the MongoDB database
 * @param data an validated EvacCenter object
 * @returns insertedId - the ObjectID of the recently inserted EvacCenter
 */
export async function addEvacData(data: EvacCenter) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);

		return insertedId;
	} catch (err) {
		throw err;
	}
}

/**
 * Deletes an EvacCenter entry given an ObjectId
 * @param id a validated ObjectId of the entry to deleted
 * @returns deletedCount - the amount of entries deleted
 */
export async function deleteEvacData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		throw err;
	}
}

/**
 * Searches for an Evacuation center with the given ObjectId
 * @param id the ObjectId of the Evacuation center to find
 * @returns validated - the EvacCenter object of the found entry
 * @returns false - if the ObjectId cannot be found
 */
export async function getEvacData(id: ObjectId) {
	const db = await connect();

	const collection = db.collection(Collection.EVAC);
	const evacCursor = await collection.findOne({ _id: id });

	if (evacCursor === null) return false;

	try {
		const validated = EvacCenterSchema.parse(evacCursor);
		return validated;
	} catch (err) {
		throw ParseValidationError;
	}
}

export async function createPending() {
	const db = await connect();

	const randomnonce = new Uint8Array(8);
	randomFillSync(randomnonce);
	const genPending = {
		session_id: uuidv4(),
		expiration: Date.now() + 15 * 60 * 1000,
		nonce: randomnonce
	};
	const parsedPending = PendingSchema.parse(genPending);
	try {
		const collection = db.collection(Collection.PENDINGS);
		const { _id, ...entry } = parsedPending;
		const { insertedId } = await collection.insertOne(entry);

		ok(insertedId);
		return entry;
	} catch (err) {
		throw err;
	}
}

export async function deletePending(sid: string) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.PENDINGS);
		const session = await collection.findOneAndDelete({ session_id: sid });

		if (session === null) return false;
		if (!(session.nonce instanceof Binary)) return false;
		session.nonce = session.nonce.read(0, 64);
		return PendingSchema.parse(session);
	} catch (err) {
		throw err;
	}
}

export async function upsertUser(data: User) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.USERS);
		const { matchedCount, upsertedId } = await collection.replaceOne(
			{ user_id: data.user_id },
			data,
			{ upsert: true }
		);

		if (matchedCount || upsertedId) return true;
		return false;
	} catch (err) {
		throw err;
	}
}

export async function upgradeSession(data: Session) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.SESSIONS);
		const { matchedCount, upsertedId } = await collection.replaceOne(
			{ user_id: data.user_id },
			data,
			{ upsert: true }
		);

		if (matchedCount || upsertedId) return true;
		return false;
	} catch (err) {
		throw err;
	}
}

export async function deleteSession(sid: string) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.SESSIONS);
		const { deletedCount } = await collection.deleteOne({ session_id: sid });

		if (deletedCount) return true;
		return false;
	} catch (err) {
		throw err;
	}
}

export async function getUserFromSession(sid: string) {
	const db = await connect();

	try {
		const sessioncol = db.collection(Collection.SESSIONS);
		const sessionPointer = await sessioncol.findOne({ session_id: sid });

		//find session
		if (sessionPointer === null) return false;
		const { user_id } = SessionSchema.parse(sessionPointer);

		const usercol = db.collection(Collection.USERS);
		const userPointer = await usercol.findOne({ user_id: user_id });

		if (userPointer === null) return false;
		return UserSchema.parse(userPointer);
	} catch (err) {
		throw err;
	}
}
