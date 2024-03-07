import { z } from 'zod';

export const GoogleUserId = z.string().min(1).max(255);

export const UserSchema = z.object({
    user_id: GoogleUserId, 
    name: z.string().max(64),
    email: z.string().max(40),
    picture: z.string().url(),
    permission: z.number().max(2) // 0 - no perms, 1-researcher, 2-admin
})

export type User = z.infer<typeof UserSchema>