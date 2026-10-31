import axios from 'axios';
import { useWebsitConfigStore } from '@/stores/websitConfig';

let baseURL = "";





// 创建axios实例
export const paxios = axios.create({
    timeout: 120000, // 设置请求超时时间
    //withCredentials: true, // 是否允许带cookie这些
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    validateStatus: function (status) {
        return status === 401 || (status >= 200 && status < 300);
    },

});

// 添加请求拦截器
paxios.interceptors.request.use(function (config: any) {
    
    if (baseURL == "") {
        let websitConfigStore = useWebsitConfigStore()
        const { apiUrl } = websitConfigStore
        baseURL = apiUrl;
    }
    if(config.url.startsWith("http")){
        if(config.url.startsWith(baseURL)){
            config.url = config.url.substring(baseURL.length)
        }else{
            return config;
        }
    }
    let aid = null;
    if (config.url.startsWith("/check")) {
       aid = window.$useraid;
    }
    if (aid) {
        config.headers.aid = aid
    }
    config.url = baseURL + config.url
    
    return config;
}, function (error: any) {
    // 对请求错误做些什么
    return Promise.reject(error);
});