import axios from '@api/axios';
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

    localStorage.setItem('session', response.data['session']);
    return true;
}
