import { getUserFromSession } from '$lib/server/database/index.js';

export async function load({cookies}) {
    const sid = cookies.get('sid');

    if (!sid) return;

    const data = await getUserFromSession(sid);
    if (!data) return;
    return {user: data};
}