import store from '@/store/index.js'
export default {
	common: {
		baseUrl: 'http://192.168.41.64:3000/api',
		// baseUrl: 'http://172.17.15.68:3000/api',
		data: {},
		header: {
			"Content-Type": "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "GET",
		dataType: "json"
	},
	request(options = {}) {
		// uni.showLoading({
		// 	title:"加载中..."
		// })
		options.url = this.common.baseUrl + options.url
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.header = {
			...this.common.header,
			...options.header
		}
		// options.header = options.header || this.common.header
		options.dataType = options.dataType || this.common.dataType
		
		if(options.header.token) {
			options.header.token = store.state.user.token
			if(!options.header.token) {
				uni.showToast({
					title:'请先登录',
					icon:'none'
				})
				uni.navigateTo({
					url:'/pages/login/login'
				})
				return Promise.reject('未登录')
			}
		}
		console.log(options.header)
		return new Promise((res,rej) => {
			uni.request({
				...options,
				success: (result) => {
					if(result.statusCode != 200) {
						setTimeout(() => {
							uni.hideLoading()
						}, 1000)
						return rej('错误')
						
					}
					let{data} = result.data
					setTimeout(() => {
						uni.hideLoading()
					}, 1000)
					res(data)
				}
			})
		})
	}
	
}
