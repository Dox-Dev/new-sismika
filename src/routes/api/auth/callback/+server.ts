import { error } from "@sveltejs/kit"
import { StatusCodes } from "http-status-codes";

export async function GET ({url}) {
    const code = url.searchParams.get('code');

    if (code === null) error(StatusCodes.BAD_REQUEST, "Code is required.");

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'ContentType' : 'application/json'},
            body: JSON.stringify({
                code,
                scope: 'openid profile',
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'http://localhost:5173/api/auth/callback',
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();
        
        if (data.access_token === null) error(StatusCodes.BAD_REQUEST, 'Failed to obtain access token.');

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${data.access_token}`}
        });

        const userInfo = userInfoResponse.json();
        console.log(userInfo)
    }
}