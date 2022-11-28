export default {
	state: {
		// 登录状态
		loginStatus: false,
		// token
		token: null,
		// 用户信息
		userInfo: {}
	},
	getters: {},
	mutations: {
		initUser(state) {
			let user = uni.getStorageSync('user')
			if(user) {
				user = JSON.parse(user)
				state.userInfo = user
				state.loginStatus = true
				state.token = user.token
			}
		},
		// 登录成功的方法
		login(state,user) {
			state.userInfo = user
			state.loginStatus = true
			state.token = user.token
			uni.setStorageSync('user',JSON.stringify(user))
		},
		loginOut(state) {
			state.userInfo = {}
			state.loginStatus = false
			state.token = null
			uni.removeStorageSync('user')
		}
	},
	actions: {}
}