import { z } from 'zod';
import { CoordinatesSchema } from './util.ts';

export const EvacCenterSchema = z.object({
	id: z.string(),
	name: z.string(),
	coord: CoordinatesSchema
});

export type EvacCenter = z.infer<typeof EvacCenterSchema>;
