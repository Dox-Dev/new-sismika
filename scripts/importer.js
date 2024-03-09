import fs from 'fs';
import csvParser from 'csv-parser';
import stripBom from 'strip-bom-stream'
import z from 'zod';
import { MongoClient } from 'mongodb';

const GeoJSONTypes = z.union([z.literal('Point'), z.literal('LineString'), z.literal('Polygon'), z.literal('MultiPoint'), z.literal('MultiLineString'), z.literal('MultiPolygon')])
const CoordinatesSchema = z.object({
	type: GeoJSONTypes,
	coordinates: z.number().array().length(2),
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

const results = new Array()
const resStn = new Array()


const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connect() {
	await client.connect();
	return client.db('sismika');
}


const equakeDump = fs.createReadStream('.\\scripts\\equakedump.csv')
	.pipe(stripBom())
    .pipe(csvParser())
    .on('data', (data) => {
		const dataIn = {
			time: new Date(parseInt(data['year']), parseInt(data['month'])-1, parseInt(data['day']), parseInt(data['hour']), parseInt(data['minute']), parseInt(data['second'])).toISOString(),
			coord: {
				type: "Point",
				coordinates: [parseFloat(data['longitude']), parseFloat(data['latitude'])]
			},
			depth: parseInt(data['depth']),
			mi: isNaN(parseFloat(data['mi']))? 0: parseFloat(data['mi']),
			mb: isNaN(parseFloat(data['mb']))? 0: parseFloat(data['mb']),
			ms: isNaN(parseFloat(data['ms']))? 0: parseFloat(data['ms']),
			mw: isNaN(parseFloat(data['mw']))? 0: parseFloat(data['mw']),
			li: data['intensity'] ?? '',
		}
        try {
            results.push(EarthquakeEventSchema.parse(dataIn));
        } catch (err) {
            console.error('Validation error:', err);
        }
    })
	.on('end', async() => {
		const db = await connect();

		const collection = db.collection("earthquake");
		const { insertedIds } = await collection.insertMany(results);
		console.log("Inserted this many documents in the earthquakes folder: ", insertedIds);
		equakeDump.destroy()
	})

const stationDump = fs.createReadStream('.\\scripts\\stationdump.csv')
	.pipe(stripBom())
    .pipe(csvParser())
    .on('data', (data) => {
		console.log(data)
		const dataIn = {
			code: data['code'],
			coord: {
				type: "Point",
				coordinates: [parseFloat(data['long']), parseFloat(data['lat'])]
			},
			name: data['long_name'],
			type: data['type']
		}
        try {
            resStn.push(StationSchema.parse(dataIn));
        } catch (err) {
            console.error('Validation error:', err);
        }
    })
	.on('end', async() => {
		const db = await connect();

		const collection = db.collection("station");
		const { insertedIds } = await collection.insertMany(resStn);
		console.log("Inserted this many in stations document:", insertedIds)
		stationDump.destroy()
	})

