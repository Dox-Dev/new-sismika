import { MediaSchema } from '$lib/model/src/posts.js';
import { Permission } from '$lib/model/src/user.js';
import {
	collateNearbyLocations,
	getEarthquakeData,
	getUserFromSession,
	postMedia
} from '$lib/server/database/index.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

export async function load({ params: { id } }) {
	const objId = ObjectId.createFromHexString(id);
	const res = await getEarthquakeData(objId);
	const effectId = await collateNearbyLocations(objId);

	if (res === false) error(StatusCodes.NOT_FOUND);

	return { selectedEarthquake: res, affected: effectId };
}
export const actions = {
	async default({ cookies, request, params: { id } }) {
		const form = await request.formData();

		const mediaType = form.get('mediaType')?.toString();
		if (mediaType === undefined) return fail(StatusCodes.BAD_REQUEST, { missing: true });

		const url = form.get('url')?.toString();
		const content = form.get('content')?.toString();
		if (url === undefined && content === undefined)
			return fail(StatusCodes.BAD_REQUEST, { mediaType, empty: true });

		const sid = cookies.get('sid');
		if (!sid) return fail(StatusCodes.UNAUTHORIZED, { mediaType, url, content, authFail: true });

		const user = await getUserFromSession(sid);
		if (user === false)
			return fail(StatusCodes.UNAUTHORIZED, { mediaType, url, content, authFail: true });
		if (user.permission < Permission.RESEARCHER)
			return fail(StatusCodes.FORBIDDEN, { mediaType, url, content, noPerms: true });

		const insert = {
			equakeId: ObjectId.createFromHexString(id),
			type: Number(mediaType),
			time: new Date().toISOString(),
			submitter_id: user.user_id,
			url: url ?? '',
			content: content ?? ''
		};

		try {
			const insertValidated = MediaSchema.parse(insert);
			const result = await postMedia(insertValidated);

			if (typeof result === 'object')
				return redirect(StatusCodes.MOVED_TEMPORARILY, `/earthquake/${id}`);
			return fail(StatusCodes.BAD_REQUEST, { mediaType, url, content, parseFail: true });
		} catch (err) {
			throw err;
		}
	}
};
