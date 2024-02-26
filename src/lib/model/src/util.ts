import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const ObjectIDSchema = z.union([z.string(), z.instanceof(ObjectId)]).optional()
const GeoJSONTypes = z.union([z.literal('Point'), z.literal('LineString'), z.literal('Polygon'), z.literal('MultiPoint'), z.literal('MultiLineString'), z.literal('MultiPolygon')])
export const CoordinatesSchema = z.object({
	_id: ObjectIDSchema,
	type: GeoJSONTypes,
	coordinates: z.number().array().length(2),
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
