import axios from 'axios';
import router from '../router';
import store from '../store/index';
import {Message} from 'element-ui';
import {apiUrl} from "./helper";
import { showLoading, hideLoading } from './loading';

// 创建axios实例
const http = axios.create({
    baseURL: apiUrl,
    timeout: 30000,
    withCredentials:true
});

// 添加请求拦截器
http.interceptors.request.use(function(config) {
    showLoading();
    config.headers["CLIENT-TYPE"] = "ADMIN";
    if (store.getters.user_token) {
        config.headers["Authorization"] = store.getters.user_token;
    }else{
        router.push('/login');
    }
	return config;
}, function(error) {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        Message({
            message: 'timeout请求超时',
            type:'error'
        });
    }
    // const errorInfo = error.response;
    // if (errorInfo) {
    //     error = errorInfo.data;
    //     const errorStatus = errorInfo.status;
    //     router.push({
    //         path: `/error/${errorStatus}`
    //     });
    // }
	return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function(response) {
    hideLoading();
    let data = response.data;
    if(data.code!=1){
        Message({
            message: data.msg,
            type:'error'
        });
    }
	return response.data;
}, function(error) {
    hideLoading();
    if(error.response && error.response.status == 404){
        router.push('/404.vue');
    }
    if(String(error).indexOf('Network Error')!=-1){
        Message({
            message: '网络错误，请检查您的网络',
            type:'error'
        });
        return;
    }
    if(String(error).indexOf('timeout')!=-1){
        Message({
            message: '请求超时，请检查您的网络',
            type:'error'
        });
        return;
    }
	Message({
        showClose: true,
        message: error.message,
        type: 'error',
        duration:3000
    });
	return Promise.reject(error);
});


export function get(url,params={}){
    params.t = new Date().getTime();
    return http({
        url:url,
        method:'get',
        params
    });
}

export function post(url,data={}){
    return http({
        url:url,
        method:'post',
        data:data
    });
}


