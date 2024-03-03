import { ObjectIDSchema } from "./util";
import { z } from 'zod';

export const UserSchema = z.object({
    _id: ObjectIDSchema,
    email: z.string().email(),
    username: z.string(),
    givenName: z.string(),
    familyName: z.string(),
    picture: z.string().url(),
    local: z.string()
})

export type User = z.infer<typeof UserSchema>

export const SessionSchema = z.object({
    _id: ObjectIDSchema,
    userId: ObjectIDSchema,
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime()
})

export type Session = z.infer<typeof SessionSchema> 

