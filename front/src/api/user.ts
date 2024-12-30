import axios from "@api/axios.ts";
import Endpoints from "@api/endpoints.ts";

export default async function getMe() {
    let session = localStorage.getItem('session');
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

export async function getAllUsers() {
    let session = localStorage.getItem('session');
    let response = null;

    try {
        response = await axios.get(
            Endpoints.users.all,
            {
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            }
        )
    } catch (error) {
        throw error;
    }

    return response;
}

export async function saveUserProfile(password: string, image: File|null|undefined) {
    let session = localStorage.getItem('session');
    let response = null;
    const formData = new FormData();

    if (!password && !image)
        return null;

    if (password)
        formData.append("password", password);
    if (image)
        formData.append("avatar", image);

    try {
        response = await axios.patch(
            Endpoints.users.update,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${session}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    } catch (error) {
        throw error;
    }

    return response;
}
