import axiosModule from 'axios';
import { HOST_API } from '@config/globlal';

const axiosInstance = axiosModule.create({
    baseURL: HOST_API
});

export default axiosInstance;
