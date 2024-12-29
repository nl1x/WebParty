import Cookies from "js-cookie";
import axios from "@api/axios.ts";
import Endpoints from "@api/endpoints.ts";

function dataImageToFile(dataurl: string, filename: string): File|null {
    const arr = dataurl.split(',');
    if (arr.length === 0)
        return null;

    const mimeTab = arr[0].match(/:(.*?);/);
    if (!mimeTab || mimeTab?.length < 2)
        return null;

    const mime = mimeTab[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export async function validateCurrentAction(isDone: boolean, picture?: string|null)
{
    let session = Cookies.get('session');
    let response = null;
    const formData = new FormData();

    // Send the picture as a file
    if (picture) {
        const file = dataImageToFile(picture, 'proof.webp')
        if (file !== null)
            formData.append('proofPicture', file, 'proof.webp');
    }
    if (isDone)
        formData.append('isDone', '1');

    try {
        response = await axios.patch(
            Endpoints.actions.validate,
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

    return response.status === 200;
}

export async function getPendingForApprovalActions()
{
    let session = Cookies.get('session');
    let response = null;


    try {
        response = await axios.get(
            Endpoints.actions.pendingApproval,
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

export async function approveAction(id: number, isApproved: boolean)
{
    let session = Cookies.get('session');
    let response = null;
    const data = {
        isApproved: isApproved
    }

    try {
        response = await axios.post(
            Endpoints.actions.approve(id),
            data,
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
