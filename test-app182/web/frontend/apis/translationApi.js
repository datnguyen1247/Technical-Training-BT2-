import axiosClient from "../services";


const translationApi = {
    async getAll() {
        return await axiosClient.get('/translation');
    },
    async getOne(locale) {
        return await axiosClient.get(`/translation/${locale}`);
    },
    async save(data,options={}) {
        return await axiosClient.post('/translation',data,options);
    },
    async delete(locale){
        return await axiosClient.delete(`/translation/${locale}`);
    },
};
export default translationApi;
