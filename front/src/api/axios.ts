import axiosModule from 'axios';
import { HOST_API, ENVIRONMENT } from '@config/globlal';

let axiosInstance = null;

if (ENVIRONMENT !== 'production') {
    axiosInstance = axiosModule.create({
        baseURL: HOST_API
    });
} else {
    axiosInstance = axiosModule.create();
}

export default axiosInstance;
