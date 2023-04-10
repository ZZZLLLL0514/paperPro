import axios from 'axios'
import Cookies from 'js-cookie';
import { Message } from 'element-ui'
import router from '../../router'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers["authorization"] ="Bearer "+ Cookies.get("token")
    return config;
}, function (error) {
    // 对请求错误做些什么
    Message({
        showClose: true,
        message: '请求错误',
        type: "warning"
    });
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    if (response.status === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    if (error.response.status) {
        switch (error.response.status) {
            // 401: 未登录
            // 未登录则跳转登录页面，并携带当前页面的路径
            // 在登录成功后返回当前页面，这一步需要在登录页操作。
            case 401:
                router.replace({
                    name: "login"
                });
                break;

            // 403 token过期
            // 登录过期对用户进行提示
            // 清除本地token和清空vuex中token对象
            // 跳转登录页面
            case 403:
                Message({
                    message: '登录过期，请重新登录',
                    duration: 1000,
                    forbidClick: true
                });
                // 清除token
                // localStorage.removeItem('token');
                // store.commit('loginSuccess', null);
                // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                setTimeout(() => {
                    router.replace({
                        name: "login"
                    });
                }, 1000);
                break;

            // 404请求不存在
            case 404:
                Message({
                    message: '网络请求不存在',
                    duration: 1500,
                    forbidClick: true
                });
                break;
            // 其他错误，直接抛出错误提示
            default:
                Message({
                    message: error.response.data.message,
                    duration: 1500,
                    forbidClick: true
                });
        }
        return Promise.reject(error.response);
    }
});
export {axios}