import { MongoClient, ObjectId } from 'mongodb';
import { DatabaseConnectionError, ParseValidationError } from '$lib/model/src/errors';
import { EarthquakeEventSchema, type EarthquakeEvent } from '$lib/model/src/event';
import { Collection } from '$lib/model/src/util';
import { EvacCenterSchema, type EvacCenter } from '$lib/model/src/evac';
import { StationSchema } from '$lib/model/src/station';

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

export async function addEarthquakeData(data: EarthquakeEvent) {
	const db = await connect();

	try {
		const payload = EarthquakeEventSchema.parse(data);
		const collection = db.collection(Collection.EARTHQUAKE);

		const { insertedId } = await collection.insertOne(payload);
		return insertedId;
	} catch (err) {
		throw err;
	}
}

export async function getAllEarthquakeData() {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);
	const equakeCursor = collection.find({});
	const equakes = await equakeCursor.toArray();

	try {
		const validated = equakes.map((doc) => EarthquakeEventSchema.parse(doc));
		return validated;
	} catch (err) {
		throw err;
	}
}

export async function getEarthquakeData(id: ObjectId) {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);
	const equakeCursor = collection.findOne({ _id: id });

	if (!equakeCursor) return false;

	try {
		const validated = EarthquakeEventSchema.parse(equakeCursor);
		return validated;
	} catch (err) {
		throw ParseValidationError;
	}
}

export async function deleteEarthquakeData(id: ObjectId) {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);
	const { deletedCount } = await collection.deleteOne({ _id: id });

	return deletedCount;
}

export async function getAllStationData() {
	const db = await connect();

	const collection = db.collection(Collection.EVAC);
	const evacCursor = collection.find({});
	const evacs = await evacCursor.toArray();

	try {
		const validated = evacs.map((doc) => EvacCenterSchema.parse(doc));
		return validated;
	} catch (err) {
		throw err;
	}
}

export async function addStationData(data: EvacCenter) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { insertedId } = await collection.insertOne(data);

		return insertedId;
	} catch (err) {
		throw err;
	}
}

export async function deleteStationData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		throw err;
	}
}

export async function getStationData(id: ObjectId) {
	const db = await connect();

	const collection = db.collection(Collection.EVAC);
	const stationCursor = collection.findOne({ _id: id });

	if (!stationCursor) return false;

	try {
		const validated = StationSchema.parse(stationCursor);
		return validated;
	} catch (err) {
		throw err;
	}
}
