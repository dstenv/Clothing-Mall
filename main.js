import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import store from 'store/index.js'
Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

// 权限判断 是否登录
Vue.prototype.navTo = (options) => {
	if(!store.state.user.loginStatus) {
		return uni.navigateTo({
			url:'/pages/login/login',
			animationType:'slide-in-bottom'
		})
	}
	uni.switchTab(options)
}

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
// import { createSSRApp } from 'vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// #endif