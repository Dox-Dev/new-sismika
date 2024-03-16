import { GoogleUserId } from './user';
import { ObjectIDSchema } from './util';
import { z } from 'zod';

export const UserSchema = z.object({
	_id: ObjectIDSchema,
	user_id: GoogleUserId,
	email: z.string().email(),
	username: z.string(),
	givenName: z.string(),
	familyName: z.string(),
	picture: z.string().url(),
	local: z.string()
});
export type GoogleUser = z.infer<typeof UserSchema>;
