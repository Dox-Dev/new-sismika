import fs from 'fs';
import csvParser from 'csv-parser';
import stripBom from 'strip-bom-stream';
import z from 'zod';
import { MongoClient } from 'mongodb';
import path from 'path';

const GeoJSONTypes = z.union([
	z.literal('Point'),
	z.literal('LineString'),
	z.literal('Polygon'),
	z.literal('MultiPoint'),
	z.literal('MultiLineString'),
	z.literal('MultiPolygon')
]);
const CoordinatesSchema = z.object({
	type: GeoJSONTypes,
	coordinates: z.number().array().length(2)
});

const EarthquakeEventSchema = z.object({
	time: z.string().datetime(),
	coord: CoordinatesSchema,
	depth: z.number(),
	mi: z.number(), //moment magnitude, mi
	mb: z.number(), //body-wave magnitude
	ms: z.number(), //surface wave magnitude.
	mw: z.number(),
	li: z.string() //string list of local intensities
});

const StationSchema = z.object({
	code: z.string(),
	name: z.string(),
	type: z.string(),
	coord: CoordinatesSchema
});

function convertToMw(magnitude, type) {
	let Mw;

	switch(type) {
		case 'ML':
			if (magnitude < 6) {
				Mw = magnitude + 0.01 * (6 - magnitude);
			} else {
				Mw = magnitude;
			}
			break;
		case 'Mb':
			Mw = 0.9 * magnitude + 1;
			break;
		case 'Ms':
			Mw = magnitude + 0.65;
			break;
		default:
			return null;
	}
	return Math.floor(Mw * 100) / 100;
}

const results = new Array();
const resStn = new Array();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const equakeDumpFile = path.join('.', 'scripts', 'equakedump.csv');
const stationDumpFile = path.join('.', 'scripts', 'stationdump.csv');
const evacDumpFile = path.join('.', 'scripts', 'evacdump.csv');
const psgcDumpFile = path.join('.', 'scripts', 'psgc_coord.json')

async function connect() {
	await client.connect();
	return client.db('sismika');
}

const equakeDump = fs
	.createReadStream(equakeDumpFile)
	.pipe(stripBom())
	.pipe(csvParser())
	.on('data', (data) => {
		const dataIn = {
			time: new Date(
				parseInt(data['year']),
				parseInt(data['month']) - 1,
				parseInt(data['day']),
				parseInt(data['hour']),
				parseInt(data['minute']),
				parseInt(data['second'])
			).toISOString(),
			coord: {
				type: 'Point',
				coordinates: [parseFloat(data['longitude']), parseFloat(data['latitude'])]
			},
			depth: parseInt(data['depth']),
			mi: isNaN(parseFloat(data['mi'])) ? 0 : parseFloat(data['mi']),
			mb: isNaN(parseFloat(data['mb'])) ? 0 : parseFloat(data['mb']),
			ms: isNaN(parseFloat(data['ms'])) ? 0 : parseFloat(data['ms']),
			mw: isNaN(parseFloat(data['mw'])) ? 0 : parseFloat(data['mw']),
			li: data['intensity'] ?? ''
		};

		if (dataIn.mw === 0) {
			if (dataIn.mi > 0) dataIn.mw = convertToMw(dataIn.mi, 'ML');
			else if (dataIn.mb > 0) dataIn.mw = convertToMw(dataIn.mb, 'Mb');
			else if (dataIn.ms > 0) dataIn.mw = convertToMw(dataIn.ms, 'Ms')
		}
		if (dataIn.mw === 0) {
			console.log(dataIn)
			throw Error(`MW is not resolved! ${dataIn}`)
		}
		try {
			results.push(EarthquakeEventSchema.parse(dataIn));
		} catch (err) {
			console.error('Validation error:', err);
		}
	})
	.on('end', async () => {
		const db = await connect();

		const collection = db.collection('earthquake');
		const { insertedIds } = await collection.insertMany(results);
		console.log('Inserted this many documents in the earthquakes folder: ', insertedIds);
		equakeDump.destroy();
	});

const stationDump = fs
	.createReadStream(stationDumpFile)
	.pipe(stripBom())
	.pipe(csvParser())
	.on('data', (data) => {
		console.log(data);
		const dataIn = {
			code: data['code'],
			coord: {
				type: 'Point',
				coordinates: [parseFloat(data['lat']), parseFloat(data['long'])]
			},
			name: data['long_name'],
			type: data['type']
		};
		try {
			resStn.push(StationSchema.parse(dataIn));
		} catch (err) {
			console.error('Validation error:', err);
		}
	})
	.on('end', async () => {
		const db = await connect();

		const collection = db.collection('station');
		const { insertedIds } = await collection.insertMany(resStn);
		console.log('Inserted this many in stations document:', insertedIds);
		stationDump.destroy();
	});

async function importPSGC() {
	const db = await connect()
	const collection = db.collection('locations');

	const fileContent = fs.readFileSync(psgcDumpFile, 'utf8');
	const data = JSON.parse(fileContent);

	data.forEach(element => {
		delete element._id;
		element.coord = element.coords;
		delete element.coords;
	});

	const {insertedCount} = await collection.insertMany(data);
	console.log(`${insertedCount} this much locations.`)
	await client.close()
}

async function setupIndexes() {
	const db = await connect()
	const earthquakeCollection = db.collection('earthquake');
	const stationsCollection = db.collection('station')
	//const evacCollection = db.collection('evac')
	const locationCollection = db.collection('locations')

	await earthquakeCollection.createIndex({"coord": "2dsphere"}),
	await stationsCollection.createIndex({"coord": "2dsphere"}),
	await locationCollection.createIndex({"coord": "2dsphere"})
	await locationCollection.createIndex({"longname": "text"})
}

await importPSGC()
await setupIndexes()