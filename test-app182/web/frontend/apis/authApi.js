import axiosClient from "../services";


const authApi = { 
    async fakeLogin(data){
        return await axiosClient.post('/login',data);
    },
};
export default authApi;
