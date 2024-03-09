import { UserSchema } from '$lib/model/src/auth';
import { ObjectIDSchema } from '$lib/model/src/util';
import { z } from 'zod';

const SessionBase = z.object({
	_id: ObjectIDSchema,
	session_id: z.string().uuid(),
	expiration: z.coerce.date()
});

export const PendingSchema = SessionBase.extend({
	nonce: z.instanceof(Uint8Array)
});
export type PendingSession = z.infer<typeof PendingSchema>;

export const SessionSchema = SessionBase.extend({
	user_id: UserSchema.shape.user_id
});
export type Session = z.infer<typeof SessionSchema>;
