import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { ObjectIdTransformError } from './errors';

export const ObjectIDSchema = z.union([z.string(), z.instanceof(ObjectId)]).optional();
const GeoJSONTypes = z.union([
	z.literal('Point'),
	z.literal('LineString'),
	z.literal('Polygon'),
	z.literal('MultiPoint'),
	z.literal('MultiLineString'),
	z.literal('MultiPolygon')
]);
export const CoordinatesSchema = z.object({
	_id: ObjectIDSchema,
	type: GeoJSONTypes,
	coordinates: z.number().array().length(2)
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export enum Collection {
	EARTHQUAKE = 'earthquake',
	STATION = 'station',
	EVAC = 'evac',
	INFO = 'info',
	SESSIONS = 'sessions',
	PENDINGS = 'pendings',
	USERS = 'users'
}

export function transformObjectId(data: ObjectId | string) {
	if (data instanceof ObjectId) return data;
	try {
		return ObjectId.createFromHexString(data);
	} catch {
		throw ObjectIdTransformError;
	}
}

export function parseOrZero(value: string | undefined) {
	if (value === undefined || isNaN(parseFloat(value))) return 0;
	return parseFloat(value);
}
