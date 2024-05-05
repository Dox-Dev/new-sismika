import { z } from 'zod';
import { BoundingBoxSchema, CoordinatesSchema, ObjectIDSchema } from './util';

export const EarthquakeEventSchema = z.object({
	_id: ObjectIDSchema,
	title: z.string(),
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

export const EarthquakeFilteringSchema = z.object({
	maxDepth: z.number().optional(),
	minDepth: z.number().optional(),
	orderDepth: z.boolean().optional(),
	maxIntensity: z.number().optional(),
	minIntensity: z.number().optional(),
	orderIntensity: z.boolean().optional(),
	minTime: z.string().datetime().optional(),
	maxTime: z.string().datetime().optional(),
	orderTime: z.boolean().optional(),
	geographicBound: BoundingBoxSchema.optional(),
	coordinateCenter: CoordinatesSchema.optional(),
    radius: z.number().optional(),
	limit: z.number().optional()
});

export type EarthquakeFilters = z.infer<typeof EarthquakeFilteringSchema>;
