import axiosModule, {AxiosInstance} from 'axios';
import { HOST_API } from '@config/globlal';

let axiosInstance: AxiosInstance = axiosModule.create({
    baseURL: HOST_API
});

export default axiosInstance;
