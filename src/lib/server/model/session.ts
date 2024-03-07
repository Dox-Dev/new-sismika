import { UserSchema } from "$lib/model/src/auth";
import { z } from 'zod';

const SessionBase = z.object({
    session_id: z.string().uuid(),
    expiration: z.coerce.date(),
});

export const PendingSchema = SessionBase.extend({
    nonce: z.instanceof(Uint8Array),
})

export const SessionSchema = SessionBase.extend({
    user_id: UserSchema.shape.user_id,
})