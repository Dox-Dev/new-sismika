import { Permission, UserSchema } from '$lib/model/src/user';
import { deleteUser, getUserFromSession, updatePermissions } from '$lib/server/database';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const PATCH: RequestHandler = async ({ cookies, url: { searchParams } }) => {
	const sid = cookies.get('sid');
	if (!sid) throw error(StatusCodes.UNAUTHORIZED);

	const user = await getUserFromSession(sid);
	if (!user) throw error(StatusCodes.UNAUTHORIZED);
	if (user.permission < Permission.ADMIN) throw error(StatusCodes.FORBIDDEN);

	const target = searchParams.get('userId');
	const permsVal = searchParams.get('perms');

	const perms = Number(permsVal);

	const parsed = UserSchema.pick({ user_id: true, permission: true }).safeParse({
		user_id: target,
		permission: perms
	});
	if (!parsed.success) throw error(StatusCodes.BAD_REQUEST);
	const { data } = parsed;
	const res = await updatePermissions(data.user_id, data.permission);

	if (res) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/admin');
	throw StatusCodes.NOT_FOUND;
};

export const DELETE: RequestHandler = async ({ cookies, url: { searchParams } }) => {
	const sid = cookies.get('sid');
	if (!sid) throw error(StatusCodes.UNAUTHORIZED);

	const user = await getUserFromSession(sid);
	if (!user) throw error(StatusCodes.UNAUTHORIZED);
	if (user.permission < Permission.ADMIN) throw error(StatusCodes.FORBIDDEN);

	const target = searchParams.get('userId');

	const parsed = UserSchema.pick({ user_id: true }).safeParse({ user_id: target });
	if (!parsed.success) throw error(StatusCodes.BAD_REQUEST);
	const { data } = parsed;
	const res = await deleteUser(data.user_id);

	if (res) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/admin');
	throw StatusCodes.NOT_FOUND;
};
