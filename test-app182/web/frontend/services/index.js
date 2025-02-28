import { useAppBridge } from '@shopify/app-bridge-react';
import { createApp } from '@shopify/app-bridge/client';
import { getSessionToken } from "@shopify/app-bridge/utilities";
import axios from 'axios';

const app = createApp({
    apiKey: '6bb248354a3d7b486b1c822382651d02', 
    host: 'YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvZGF0LW50Mg',
    forceRedirect: true,
  });

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
});


axiosClient.interceptors.request.use(
    async function (config) {   
        const token = await getSessionToken(app);
        console.log('token session',token)
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        const appBridge =  useAppBridge();
        const shopify_domain = appBridge.config.shop
        if(shopify_domain){
            config.headers.shopify_domain = shopify_domain
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    },
);

export default axiosClient