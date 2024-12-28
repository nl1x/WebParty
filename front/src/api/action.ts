import Cookies from "js-cookie";
import axios from "@api/axios.ts";
import Endpoints from "@api/endpoints.ts";


export async function validateCurrentAction(isDone: boolean)
{
    let session = Cookies.get('session');
    let response = null;

    try {
        response = await axios.patch(
            Endpoints.actions.validate,
            {
                isDone: isDone
            },
            {
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            }
        );
    } catch (error) {
        throw error;
    }

    return response.status === 200;
}
