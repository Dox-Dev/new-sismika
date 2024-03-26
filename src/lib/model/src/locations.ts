import { z } from 'zod';
import { CoordinatesSchema, BoundingBoxSchema } from './util';

export const OSMSchema = z.object({
    place_id: z.number(),
    licence: z.string(),
    osm_type: z.literal('node').or(z.literal('way')).or(z.literal('relation')),
    osm_id: z.number(),
    lat: z.string(),
    lon: z.string(),
    class: z.string(),
    type: z.string(),
    place_rank: z.number(),
    importance: z.number(),
    addresstype: z.string(),
    name: z.string(),
    display_name: z.string(),
    boundingbox: z.array(z.string()),
  });

export const LocationData = z.object({
    psgc: z.string().min(10).max(10),
    name: z.string(),
    longname: z.string(),
    geographicLevel: z.string(),
    oldNames: z.string(),
    cityClass: z.string(),
    incomeClassification: z.string(),
    isRural: z.boolean(),
    population: z.number(),
    status: z.number(),
    coords: CoordinatesSchema.optional(),
    boundingBox: BoundingBoxSchema.optional(),
    osmresult: OSMSchema.optional(),
})
export type Location = z.infer<typeof LocationData>