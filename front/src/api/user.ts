import axios from "@api/axios.ts";
import Endpoints from "@api/endpoints.ts";
import Cookies from "js-cookie";

export default async function getMe()
{
    let session = Cookies.get('session');
    let response = null;

    try {
        response = await axios.get(
            Endpoints.users.me,
            {
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            }
        );
    } catch (error) {
        throw error;
    }

    return response;
}
