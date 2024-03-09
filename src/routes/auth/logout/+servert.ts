import { deleteSession } from "$lib/server/database";
import { error, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const DELETE: RequestHandler = async ({cookies}) => {
    const sid = cookies.get('sid');
    cookies.delete('sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
    })

    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const result = await deleteSession(sid);
    if (!result) throw error(StatusCodes.UNAUTHORIZED);

    return new Response(null, { status: StatusCodes.NO_CONTENT})
}