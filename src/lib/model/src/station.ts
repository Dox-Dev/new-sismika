import { z } from 'zod';
import { CoordinatesSchema, ObjectIDSchema } from './util';
import { ObjectId } from 'mongodb';

export const StationSchema = z.object({
	_id: ObjectIDSchema,
	code: z.string(),
	name: z.string(),
	type: z.string(),
	coord: CoordinatesSchema
});

export type StationSchema = z.infer<typeof StationSchema>;
