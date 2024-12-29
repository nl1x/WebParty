import axios from '@api/axios';
import Cookies from 'js-cookie';
import Endpoints from "@api/endpoints.ts";

export async function login(username: string, password: string)
{
    let response = null;
    try {
        response = await axios.post(
            Endpoints.auth.login,
            {
                username: username,
                password: password
            },
        );
    } catch (error) {
        return false;
    }

    if (response.status !== 200)
        return false;

    Cookies.set('session', response.data['session'],
        {
            expires: 7,
            path: '/',
            sameSite: 'strict'
        }
    );
    console.log("cookies set");
    return true;
}
