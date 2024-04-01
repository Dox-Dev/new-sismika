import { env } from '$env/dynamic/private';
import { ok } from 'assert';

const { MONGODB_SRC, MONGODB_URI, MONGODB_USER, MONGODB_PASS, MONGODB_PARAMS } = env;

export default {
	MONGODB_URI: MONGODB_URI,
	MONGODB_USER: MONGODB_USER || '',
	MONGODB_PASS: MONGODB_PASS || '',
	MONGODB_PARAMS: MONGODB_PARAMS || '',
	MONGODB_CONNECTION_STRING:
		(MONGODB_SRC === 'prod' && (MONGODB_USER || MONGODB_PASS))
			? `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_URI}/?${MONGODB_PARAMS}`
			: `mongodb://localhost:27017`
};
