import axiosModule, {AxiosInstance} from 'axios';
import { HOST_API, ENVIRONMENT } from '@config/globlal';

let axiosInstance: AxiosInstance;

if (ENVIRONMENT !== 'production') {
    axiosInstance = axiosModule.create({
        baseURL: HOST_API
    });
} else {
    axiosInstance = axiosModule.create();
}

export default axiosInstance;
