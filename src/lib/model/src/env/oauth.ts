import { env } from '$env/dynamic/private';
import { ok } from 'assert';

const { GOOGLE_ID, GOOGLE_SECRET, OAUTH_REDIRECT } = env;
ok(GOOGLE_ID);
ok(GOOGLE_SECRET);

export default {
	GOOGLE_ID,
	GOOGLE_SECRET,
	OAUTH_REDIRECT: OAUTH_REDIRECT || 'http://localhost:5173/auth/callback'
};
