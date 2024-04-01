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

export const BoundingBoxSchema = z.object({
    type: GeoJSONTypes,
    coordinates: z.array(z.number().array().length(2)).length(4)
})

export type BoundingBox = z.infer<typeof BoundingBoxSchema>

export enum Collection {
	EARTHQUAKE = 'earthquake',
	STATION = 'station',
	EVAC = 'evac',
	INFO = 'info',
	SESSIONS = 'sessions',
	PENDINGS = 'pendings',
	USERS = 'users',
	MEDIA = 'posts',
	COMMENTS = 'comments',
	LOCATION = 'locations'
}

export function transformToObjectId(data: ObjectId | string) {
	if (data instanceof ObjectId) return data;
	try {
		return ObjectId.createFromHexString(data);
	} catch {
		throw ObjectIdTransformError;
	}
}

export function transformToObjectString(data: ObjectId | string) {
	if (data instanceof ObjectId) return data.toHexString();
	return data
}

export function parseOrZero(value: string | undefined) {
	if (value === undefined || isNaN(parseFloat(value))) return 0;
	return parseFloat(value);
}

export function calculateDistanceinMeters(pointA: Coordinates, pointB: Coordinates) {
    const radius = 6371e3; // Earth's radius in meters

    const lat1 = pointA.coordinates[1] * Math.PI / 180;
    const lat2 = pointB.coordinates[1] * Math.PI / 180;
    const deltaLat = (pointB.coordinates[1] - pointA.coordinates[1]) * Math.PI / 180;
    const deltaLon = (pointB.coordinates[0] - pointA.coordinates[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = radius * c; // Distance in meters

    return distance;
}