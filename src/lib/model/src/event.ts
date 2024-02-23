import { z } from 'zod';
import { CoordinatesSchema } from './util';

export const EarthquakeEventSchema = z.object({
	id: z.string().uuid(),
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
