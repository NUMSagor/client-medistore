import axios from "axios";


const apiClient = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api",
    headers:{
        "Content-Type": "application/json", 
    },
    withCredentials: true
});


apiClient.interceptors.request.use((config) => {
    if(typeof window !== "undefined"){
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }

    return config;
},
(error)=>Promise.reject(error)
);

export default apiClient;