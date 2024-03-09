import { env } from '$env/dynamic/private';
import { ok } from 'assert';

const { MONGODB_URI, MONGODB_USER, MONGODB_PASS } = env;

export default {
	MONGODB_URI: MONGODB_URI || 'localhost:27017',
	MONGODB_USER: MONGODB_USER || '',
	MONGODB_PASS: MONGODB_PASS || '',
	MONGODB_CONNECTION_STRING:
		MONGODB_USER || MONGODB_PASS
			? `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_URI}`
			: `mongodb://${MONGODB_URI}`
};
