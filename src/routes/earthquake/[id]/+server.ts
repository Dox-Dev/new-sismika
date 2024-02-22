import { error } from '@sveltejs/kit';
import { EarthquakeEventSchema } from '$lib/model/src/event';
import { connect } from '$lib/database';
import { ObjectId } from 'mongodb';
import { StatusCodes } from 'http-status-codes';
import { Collection } from '$lib/model/src/util';

export async function GET({ params }) {
	const db = await connect();
	if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection error.');

	const { id } = params;
	const collection = db.collection(Collection.EARTHQUAKE);
	const equakeCursor = collection.findOne({ _id: new ObjectId(id) });

	if (!equakeCursor) error(StatusCodes.NOT_FOUND, 'Nothing retrieved.');

	try {
		const validated = EarthquakeEventSchema.parse(equakeCursor);
		return { status: StatusCodes.OK, body: validated.toString };
	} catch (err) {
		error(StatusCodes.BAD_REQUEST, 'Data validation error');
	}
}

export async function DELETE({ params: { id } }) {
	const db = await connect();
	if (!db) error(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection error.');

	if (!(typeof id === 'string')) error(StatusCodes.BAD_REQUEST, 'Failed string check.');
	if (!ObjectId.isValid(id)) error(StatusCodes.BAD_REQUEST, 'Invalid ID.');

	try {
		const collection = db.collection(Collection.EARTHQUAKE);
		const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(id) });

		if (deletedCount === 0) error(StatusCodes.NOT_FOUND, 'No entry deleted.');

		return { status: StatusCodes.OK, body: { message: 'Indicated earthquake data deleted.' } };
	} catch (err) {
		error(StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
