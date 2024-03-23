import { z } from 'zod';
import { ObjectIDSchema } from './util';
import { GoogleUserId } from './user';

export enum MEDIATYPE {
    Image,
    Video,
    Article,  
}

export const PostBase = z.object({
    id: z.string().uuid(),
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

export const PostSchema = z.object({
    _id: ObjectIDSchema,
    title: z.string().min(1),
    date: z.string().datetime(),
    authorId: GoogleUserId,
    earthquakeId: ObjectIDSchema,
    mediaContent: z.union([ArticleSchema, MediaSchema]).optional(),
    
})

export type Post = z.infer<typeof PostSchema>

export const CommentSchema = z.object({
    id: z.string().uuid(),
    authodId: GoogleUserId,
    content: z.string().min(1)
})

