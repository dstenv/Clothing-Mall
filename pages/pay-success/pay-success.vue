<template>
	<view class="success">
		<text class="success-text">恭喜您支付成功,{{time}}秒后即将跳转到首页</text>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	export default {
		data() {
			return {
				time: 3,
				timer: null
			}
		},
		onLoad(event) {
			if(event.status == 1) {
				http.request({
					url: '/order/paystatus',
					method:'POST',
					header: {
						token: true
					},
					data: {
						oid: event.oid
					}
				}).then(res => {
					
				})
			}
			this.timer = setInterval(() => {
				if(this.time === 0) {
					clearInterval(this.timer)
					uni.switchTab({
						url:'/pages/index/index'
					})
					return 
				}
				--this.time
			},1000)
		},
		methods: {
			
		}
	}
</script>

<style scoped>
.success {
	overflow: hidden;
}
.success-text {
	display: block;
	margin-top: 100rpx;
	text-align: center;
	font-size: 34rpx;
}

</style>
