import { GoogleUserId } from '$lib/model/src/user';
import { z } from 'zod';

const OAUTH_SCOPES = [
	'openid',
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/userinfo.email'
];
export const OAUTH_SCOPE_STRING = OAUTH_SCOPES.join(' ');
export const OAUTH_TOKEN_TYPE = 'Bearer';

export const AuthorizationCode = z.string().min(1).max(256);

export const TokenResponseSchema = z.object({
	id_token: z.string().min(1),
	scope: z
		.string()
		.transform((str) => new Set(str.split(' ')))
		.refine((set) => OAUTH_SCOPES.every((s) => set.has(s))),
	token_type: z.literal(OAUTH_TOKEN_TYPE),
	expires_in: z.number().int()
});

const UNIX_TIME_SEC = z
	.number()
	.int()
	.transform((s) => new Date(s * 1000));

export const IdTokenSchema = z.object({
	aud: z.string(),
	sub: GoogleUserId,
	iat: UNIX_TIME_SEC,
	exp: UNIX_TIME_SEC,
	iss: z.string(),
	azp: z.string().min(1),
	at_hash: z.string().min(1),
	email: z.string().email(),
	email_verified: z.boolean(),
	name: z.string().min(1),
	nonce: z.string().min(1),
	picture: z.string().url()
});
