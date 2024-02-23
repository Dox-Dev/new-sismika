import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const ObjectIDSchema = z.union([z.string(), z.instanceof(ObjectId)]).optional()

export const CoordinatesSchema = z.object({
	_id: ObjectIDSchema,
	long: z.number(),
	lat: z.number()
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export enum Collection {
	EARTHQUAKE = 'earthquake',
	STATION = 'station',
	EVAC = 'evac',
	INFO = 'info',
	SESSIONS = 'sessions',
	USERS = 'users'
}
