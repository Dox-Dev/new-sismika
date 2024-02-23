import { z } from 'zod';
import { CoordinatesSchema } from './util';

export const StationSchema = z.object({
	code: z.string(),
	name: z.string(),
	type: z.string(),
	coord: CoordinatesSchema
});

export type StationSchema = z.infer<typeof StationSchema>;
