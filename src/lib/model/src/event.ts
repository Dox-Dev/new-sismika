import { z } from 'zod';
import { CoordinatesSchema } from './util';

export const EarthquakeEventSchema = z.object({
	id: z.string(),
	time: z.string().datetime(),
	coord: CoordinatesSchema,
	depth: z.number(),
	mw: z.number(), //moment magnitude, mi
	mb: z.number(), //body-wave magnitude
	ms: z.number(), //surface wave magnitude.
	li: z.string() //string list of local intensities
});

export type EarthquakeEvent = z.infer<typeof EarthquakeEventSchema>;
