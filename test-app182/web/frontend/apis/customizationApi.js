import axiosClient from "../services";


const customizationApi = {
    
    async save(data){
        return await axiosClient.put('/customization',data);
    },
    async get() {
        return await axiosClient.get('/customization');
    },
};
export default customizationApi;
