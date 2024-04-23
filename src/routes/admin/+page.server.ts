import { Permission } from '$lib/model/src/user.js';
import { getUserFromSession, getUsers } from '$lib/server/database/index.js';
import { error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'

export async function load({cookies, url: {searchParams}}) {
    const sid = cookies.get('sid')
    if (!sid) error(StatusCodes.UNAUTHORIZED);

    const user = await getUserFromSession(sid);
    if (!user) error(StatusCodes.UNAUTHORIZED);
    if (user.permission < Permission.ADMIN) error(StatusCodes.FORBIDDEN);

    const res = await getUsers();

    return {...res};
}