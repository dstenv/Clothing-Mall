<template>
	<view class="login-orther">
		<view class="orther-text">
			<view>
				或用以下方式登录
			</view>
		</view>
		<view class="orther-type">
			<view class="type-item"
				v-for="item in loginType" :key="item.text"
				@tap="loginTypeFun(item.type)"
			>
				<view class="iconfont" :class="item.iconName"></view>
				<text>{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginType: [
					{
						text: '微信登录',
						iconName: 'icon-weixin',
						type: 'weixin'
					},
					{
						text: '微博登录',
						iconName: 'icon-weibo',
						type: 'sinaweibo'
					},
					{
						text: 'QQ登录',
						iconName: 'icon-qq',
						type: 'qq'
					},
				]
			}
		},
		methods: {
			// 第三方快捷登录 先不做 
			loginTypeFun(type) {
				uni.login({
					provider:type,
					success: (res) => {
						// console.log(res)
						let openid = res.authResult.openid
						
					}
				})
			}
		}
	}
</script>

<style scoped>
.orther-text {
	display: flex;
	justify-content: center;
	margin-top: 100rpx;
	padding: 50rpx 0;
}
.orther-text view {
	line-height: 0rpx;
	padding: 0 10rpx;
}
.orther-text::after {
	content: '';
	flex: 1;
	height: 2rpx;
	background-color: #CCCCCC;
	
}
.orther-text::before {
	content: '';
	flex: 1;
	height: 2rpx;
	background-color: #CCCCCC;
	
}
.orther-type {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.type-item {
	text-align: center;
}
.iconfont {
	font-size: 60rpx;
}
</style>