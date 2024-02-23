import { z } from 'zod';
import { CoordinatesSchema, ObjectIDSchema } from './util';
import { ObjectId } from 'mongodb';

export const EarthquakeEventSchema = z.object({
	_id: ObjectIDSchema,
	time: z.string().datetime(),
	coord: CoordinatesSchema,
	depth: z.number(),
	mi: z.number(), //moment magnitude, mi
	mb: z.number(), //body-wave magnitude
	ms: z.number(), //surface wave magnitude.
	mw: z.number(),
	li: z.string() //string list of local intensities
});

export type EarthquakeEvent = z.infer<typeof EarthquakeEventSchema>;
