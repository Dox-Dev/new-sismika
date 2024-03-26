import { z } from 'zod';
import { ObjectIDSchema } from './util';
import { GoogleUserId } from './user';
import { ObjectId } from 'mongodb';

export enum MEDIATYPE {
    Image,
    Video,
    Article,  
    Comment,
}

export const MediaSchema = z.object({
    _id: ObjectIDSchema,
    equakeId: z.instanceof(ObjectId),
    type: z.number(),
    time: z.string().datetime(),
    url: z.string().url().optional(),
    content: z.string().min(1).optional()
})

export type Media = z.infer<typeof MediaSchema>
export const MediaArraySchema = z.array(MediaSchema)

