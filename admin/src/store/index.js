import Vue from "vue";
import Vuex from "vuex";
import Router from "@/router";
import Config from "../config";
import secret from '@/util/crypto';
import userApi from '../api/modules/user'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user_token: sessionStorage.getItem(Config.tokenKey),
		user_info: null,
        user_permission:[]
	},
	mutations: {
		setUserToken(state, token) {
			state.user_token = token;
			sessionStorage.setItem(Config.tokenKey, token);
		},
		setUserInfo(state, info) {
			state.user_info = info;
		},
        setUserPermission(state,permission){
            state.user_permission = permission;
        }
	},
	getters: {
		user_token: (state) => state.user_token,
		user_info: (state) => state.user_info,
        user_permission:(state) => state.user_permission
	},
	actions: {
        handleLogin({commit},form){
            return new Promise((resolve,reject)=>{
                const pwd = secret.Encrypt(form.password,Config.aes.key,Config.aes.iv)
                let data = {
                    account:form.account,
                    password:pwd
                }
                userApi.login(data).then(res=>{
                    if(res.code==1){
                        commit('setUserToken','Bearer '+res.data.token);
                        commit('setUserInfo',res.data);
                        resolve()
                        Router.push({name: 'home'}).catch(() => {})
                    }
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        getUserProfile({commit}){
            return new Promise((resolve,reject)=>{
                userApi.userProfile().then(res=>{
                    if(res.code==1){
                        commit('setUserInfo',res.data);
                        resolve(res.data)
                    }else{
                        reject(res.msg)
                    }
                })
            })
        },
        getUserPermission(){
            return new Promise((resolve,reject)=>{
                //todo
                resolve()
                reject()
            })
        },
		//退出
		handleLogout() {
            return new Promise((resolve,reject)=>{
                this.dispatch("clearData").then(()=>{
                    Router.push({name: 'login'}).catch(() => {})
                    resolve()
                }).catch(err=>{
                   reject(err)
                });
            })

		},
		//清除数据
		clearData({ commit }) {
            return new Promise(resolve=>{
                commit("setUserToken", null);
                commit("setUserInfo", null);
                commit("setUserPermission", []);
                resolve();
            })
		},
	},
	modules: {},
});
