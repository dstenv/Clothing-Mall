<template>
	<view class="login">
		
		<swiper vertical="true" style="height: 100vh;" :duration="1000">
			<swiper-item>
				<scroll-view scroll-y="true" >
					<view class="login-tel">
						<view class="tel-main">
							<!-- #ifdef H5 -->
							<view class="iconfont icon-chahao" @tap="closePage"></view>
							<!-- #endif -->
							
							<!-- #ifdef MP-WEIXIN -->
							<view class="iconfont icon-chahao icon-chahao-weixin" @tap="closePage"></view>
							<!-- #endif -->
							
							<!-- #ifdef APP-PLUS -->
							<view class="iconfont icon-chahao close" @tap="closePage"></view>
							<!-- #endif -->
							
							<!-- #ifdef H5 -->
							<view class="logo">
								<image class="logo-img" src="../../static/imgs/logo.jpg" mode="widthFix"></image>
							</view>
							<!-- #endif -->
							
							<!-- #ifdef MP-WEIXIN -->
							<view class="logo">
								<image class="logo-img" src="../../static/imgs/logo.jpg" mode="widthFix"></image>
							</view>
							<!-- #endif -->
								
							<!-- #ifdef APP-PLUS -->
							<view class="logo logo-app">
								<image class="app" src="../../static/imgs/logo.jpg" mode="widthFix"></image>
							</view>
							<!-- #endif -->
							
							<view class="text" @tap="goTelphone">
								手机号注册
							</view>
							<loginOrther />
							
							<!-- #ifdef H5 -->
							<view class="login-to">
								<text class="to">已有账号，去登录</text>
								<text class="iconfont icon-xiajiantou"></text>
							</view>
							<!-- #endif -->
							
							<!-- #ifdef APP-PLUS -->
							<view class="login-to to-app">
								<text class="to">已有账号，去登录</text>
								<text class="iconfont icon-xiajiantou"></text>
							</view>
							<!-- #endif -->
							
							<!-- #ifdef MP-WEIXIN -->
							<view class="login-to to-app">
								<text class="to">已有账号，去登录</text>
								<text class="iconfont icon-xiajiantou"></text>
							</view>
							<!-- #endif -->
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" >
					<view class="login-tel">
						<view class="tel-main">
							<view class="register-top">
								<!-- #ifdef H5 -->
								<view class="iconfont icon-chahao " @tap="closePage"></view>
								<!-- #endif -->
								
								<!-- #ifdef MP-WEIXIN -->
								<view class="iconfont icon-chahao icon-chahao-weixin" @tap="closePage"></view>
								<!-- #endif -->
								
								<!-- #ifdef APP-PLUS -->
								<view class="iconfont icon-chahao close"@tap="closePage" ></view>
								<!-- #endif -->
								
								<!-- #ifdef APP-PLUS -->
								<view class="register-go register-go-app">
									<view class="iconfont icon-shangjiantou"></view>
									<text class="register-text">没有账号，去注册</text>
								</view>
								<!-- #endif -->
								
								<!-- #ifdef H5 -->
								<view class="register-go">
									<view class="iconfont icon-shangjiantou"></view>
									<text class="register-text">没有账号，去注册</text>
								</view>
								<!-- #endif -->
								
								<!-- #ifdef MP-WEIXIN -->
								<view class="register-go register-go-weixin">
									<view class="iconfont icon-shangjiantou"></view>
									<text class="register-text">没有账号，去注册</text>
								</view>
								<!-- #endif -->
								
								<view style="width: 60rpx;"></view>
							</view>
							
							<view class="register-form">
								<view class="form-user">
									<text>账号</text>
									<input type="text" v-model="userName" placeholder="请输入手机号/昵称" />
								</view>
								<view class="form-user">
									<text>密码</text>
									<input type="password" v-model="userPwd" placeholder="6-16位字符" />
								</view>
							</view>
							
							<view class="register-quick">
								<text>忘记密码?</text>
								<text>免密登录</text>
							</view>
							<view class="text" @tap="submit">
								登录
							</view>
							<view class="reminder">
								温馨提示，你可以选择免密登录，更加方便
							</view>
							
							<loginOrther />
							
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import loginOrther from '@/components/common/loginOrther.vue'
	import http from '@/common/api/request.js'
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				userName: '',
				userPwd: '',
				rules: {
					userName: {
						rule: /\S/,
						msg: '账号不能为空'
					},
					userPwd: {
						rule: /^[0-9a-zA-Z]{6,16}$/,
						msg: '密码应为6-16位字符'
					}
				},
			}
		},
		components: {
			loginOrther
		},
		methods: {
			...mapMutations(['login']),
			closePage() {
				uni.navigateBack()
			},
			submit() {
				if(!this.validUser('userName')) return;
				if(!this.validUser('userPwd')) return;
				uni.showLoading({
					title:'登录中...'
				})
				http.request({
					url: '/login',
					method: 'POST',
					data: {
						userName: this.userName,
						userPwd: this.userPwd
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if(res.success == 'fail') {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}else {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						const { data } = res
						this.login(data)
						uni.navigateBack()
					}
				}).catch(err => {
					uni.showToast({
						title:'网络错误',
						icon:'error'
					})
				})
			},
			// 验证规则
			validUser(key) {
				if(!this.rules[key].rule.test(this[key])) {
					uni.showToast({
						title:this.rules[key].msg,
						icon:'none'
					})
					return false
				}
				return true
			},
			goTelphone() {
				uni.navigateTo({
					url:'/pages/loginTelphone/loginTelphone'
				})
			}
		}
	}
</script>

<style scoped>
.login-tel {
	width: 100vw;
	height: 100vh;
}
.tel-main {
	padding: 0 40rpx;
}
.icon-chahao {
	font-size: 60rpx;
	color: #000;
}
.icon-chahao-weixin {
	padding-top: 40rpx;
}
.close {
	padding-top: 40rpx;
}
.logo {
	padding-bottom: 100rpx;
	display: flex;
	justify-content: center;
}
.logo-app {
	display: flex;
	justify-content: center;
	padding-bottom: 50rpx;
}
.logo-img {
	width: 500rpx;
}
.app {
	width: 450rpx;
}
.text {
	width: 100%;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	color: #fff;
	background-color: #49bdfb;
	border-radius: 999px;
}
.login-to {
	margin-top: 20rpx;
	text-align: center;
}
.login-to text {
	display: block;
	text-align: center;
}
.to {
	position: relative;
	top: 40rpx;
}
.icon-xiajiantou,
.icon-shangjiantou{
	font-size: 60rpx;
}
.icon-xiajiantou::before {
	color: #000;
}
.icon-shangjiantou::before {
	color: #000;
}

.register-top {
	display: flex;
	justify-content: space-between;
}
.register-go {
	text-align: center;
}
.register-go-app {
	padding-top: 40rpx;
}
.register-go-weixin {
	padding-top: 40rpx;
}
.register-text {
	position: relative;
	top: -40rpx;
}
.register-form {
	padding-top: 180rpx;
}
.form-user {
	font-size: 32rpx;
	display: flex;
	align-items: baseline;
	border-bottom: 2rpx solid #ddd;
	padding-bottom: 10rpx;
	margin-bottom: 20rpx;
}
.form-user input {
	flex: 1;
	padding-left: 20rpx;
	font-size: 30rpx;
}
.register-quick {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;
}
.reminder {
	text-align: center;
	padding-top: 10rpx;
	color: #b3b3b3;
}
</style>
