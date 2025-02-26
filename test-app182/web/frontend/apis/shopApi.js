import axiosClient from "../services";


const shopApi = {
    
    async getOne({data}) {
        return await axiosClient.post(`/shop`,data);
    },
    async save(data) {
        return await axiosClient.post(`/shop`,data);
    },
};
export default shopApi;
