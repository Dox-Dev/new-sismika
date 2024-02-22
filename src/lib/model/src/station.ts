import { z } from 'zod';
import { CoordinatesSchema } from './util.ts';

export const StationSchema = z.object({
	id: z.string(),
	code: z.string(),
	name: z.string(),
	type: z.string(),
	coord: CoordinatesSchema
});

export type StationSchema = z.infer<typeof StationSchema>;
