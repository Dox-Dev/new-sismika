import { z } from 'zod';
import { CoordinatesSchema, ObjectIDSchema } from './util';
import { ObjectId } from 'mongodb';

export const EvacCenterSchema = z.object({
	_id: ObjectIDSchema,
	name: z.string(),
	coord: CoordinatesSchema
});

export type EvacCenter = z.infer<typeof EvacCenterSchema>;
