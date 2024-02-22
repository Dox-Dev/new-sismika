import { z } from 'zod';

export const CoordinatesSchema = z.object({
	id: z.string(),
	long: z.number(),
	lat: z.number()
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export enum Collection {
	EARTHQUAKE = 'earthquake',
	STATION = 'station',
	EVAC = 'evac',
	INFO = 'info'
}
