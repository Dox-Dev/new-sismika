import { z } from 'zod';
import { ObjectIDSchema } from './util';
import { GoogleUserId } from './user';
import { ObjectId } from 'mongodb';

export enum MEDIATYPE {
    Image,
    Video,
    Article,  
}

export const PostBase = z.object({
    _id: ObjectIDSchema,
    equakeId: z.instanceof(ObjectId),
    type: z.number(),
    time: z.string().datetime()
})

export const MediaSchema = PostBase.extend({
    url: z.string().url()
})

export type Media = z.infer<typeof MediaSchema>

export const ArticleSchema = PostBase.extend({
    content: z.string().min(1)
})

export type Article = z.infer<typeof ArticleSchema>

export const CommentSchema = z.object({
    _id: ObjectIDSchema,
    earthquakeId: z.instanceof(ObjectId),
    authodId: GoogleUserId,
    content: z.string().min(1)
})

