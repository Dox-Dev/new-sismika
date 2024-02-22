import { error, type RequestEvent } from '@sveltejs/kit';
import { EarthquakeEventSchema } from '$lib/model/src/event';
import { StatusCodes } from 'http-status-codes';
import { Collection } from '$lib/model/src/util';
import { ZodError } from 'zod';
import { connect } from '$lib/database';

export async function GET() {
	const db = await connect();
	if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection error.');

	const collection = db.collection(Collection.EARTHQUAKE);
	const equakeCursor = collection.find({});
	const equakes = await equakeCursor.toArray();

	if (equakes.length === 0) error(StatusCodes.NOT_FOUND, 'Nothing retrieved.');

	try {
		const validated = equakes.map((doc) => EarthquakeEventSchema.parse(doc));
		return { status: StatusCodes.OK, body: validated };
	} catch (err) {
		error(StatusCodes.BAD_REQUEST, 'Data validation error');
	}
}

export async function POST({ request }) {
	const db = await connect();
	if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection error.');

	try {
		const formData = request.json();
		const payload = EarthquakeEventSchema.parse(formData);

		const collection = db.collection(Collection.EARTHQUAKE);
		const { insertedId } = await collection.insertOne(payload);

		return { status: StatusCodes.OK, body: { message: 'Eartquake data inserted' } };
	} catch (err) {
		if (err instanceof ZodError) {
			error(StatusCodes.BAD_REQUEST, 'Data validation error.');
		}
		throw err;
	}
}

export async function PUT({ params, request }: RequestEvent) {
	const db = await connect();
	if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection error.');

	try {
		const formData = request.json();
		const payload = EarthquakeEventSchema.parse(formData);

		const collection = db.collection(Collection.EARTHQUAKE);
		const { insertedId } = await collection.inser(payload);

		return { status: StatusCodes.OK, body: { message: 'Eartquake data inserted' } };
	} catch (err) {
		if (err instanceof ZodError) {
			error(StatusCodes.BAD_REQUEST, 'Data validation error.');
		}
		throw err;
	}
}
