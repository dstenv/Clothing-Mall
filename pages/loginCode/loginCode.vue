<template>
	<view>
		<MyLine />
		<view class="login-tel">
			<view class="tel-main">
				<view class="register-form">
					<view class="form-user">
						<view class="form-text">用户名</view>
						<input type="text" v-model="userName" placeholder="请输入用户名" />
					</view>
					<view class="form-user">
						<view class="form-text">密码</view>
						<input type="text" v-model="userPwd" placeholder="请输入密码" />
					</view>
					<view class="form-user">
						<view class="form-text">昵称</view>
						<input type="text" v-model="nikename" placeholder="请输入昵称" />
					</view>
					<view class="form-user">
						<view class="form-text">验证码</view>
						<input type="number" v-model="code" placeholder="请输入验证码" />
						<text class="time-text"
							:class="{'keydown': time == 0}"
							@tap="sendCode"
						>{{time ==0 ? '重新发送':`重新发送(${time})`}}</text>
					</view>
				</view>
				<text class="reminder">我们已经给您的手机号码{{phone}}发送了验证短信</text>
				<view class="text" @tap="nextGo">
					注册
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import MyLine from '@/components/common/Line.vue'
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				code: '',
				phone: null,
				time: 0,
				timer: null,
				userName: '',
				userPwd: '',
				nikename: '',
			}
		},
		components: {
			MyLine
		},
		onLoad(event) {
			this.phone = event.phone
		},
		onReady() {
			this.sendCode()
		},
		methods: {
			...mapMutations(['login']),
			initTime() {
				this.time = 60
				this.timer = setInterval(() => {
					if(this.time === 0) {
						clearInterval(this.timer)
						return
					}
					this.time--
				},1000)
			},
			nextGo() {
				// 验证 验证码是否正确
				http.request({
					url: '/code/validate',
					method: 'POST',
					data: {
						code: this.code
					}
				}).then(res => {
					console.log(res)
					if(res == 'success') {
						// 添加用户信息
						http.request({
							url: '/register/user',
							method: 'POST',
							data: {
								userName: this.userName,
								userPwd: this.userPwd,
								phone: this.phone,
								nikename: this.nikename,
							}
						}).then(res => {
							uni.showToast({
								title:'注册成功',
								icon:'success'
							})
							// 登录
							// console.log(res)
							this.login(res)
							uni.switchTab({
								url:'/pages/index/index'
							})
						}).catch(() => {
							uni.showToast({
								title:'网络错误',
								icon:'none'
							})
						})
					}else {
						uni.showToast({
							title:'验证码错误',
							icon:'none'
						})
					}
				}).catch(() => {
					uni.showToast({
						title:'网络错误',
						icon:'none'
					})
				})
			},
			sendCode() {
				// 调用接口获取验证码
				http.request({
					url: '/register/code',
					method: 'POST',
					data: {
						phone: this.phone
					}
				}).then(res => {
					console.log(res)
					this.initTime()
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
.form-user {
	font-size: 32rpx;
	display: flex;
	align-items: baseline;
	border-bottom: 2rpx solid #ddd;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
}
.form-text {
	width: 100rpx;
	white-space: nowrap;
	text-align: justify;
	text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
	text-align-last: justify;
	flex: none;
}
.form-user input {
	flex: 1;
	padding-left: 20rpx;
	display: flex;
	font-size: 30rpx;
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
.time-text {
	display: inline-block;
	padding: 2rpx 20rpx;
	border: 2rpx solid #acacac;
	border-radius: 999px;
	pointer-events: none;
	color: #acacac;
}
.keydown {
	pointer-events: auto;
	border: 2rpx solid #000;
	color: #000;
}
.reminder {
	font-size: 24rpx;
	display: block;
	padding-bottom: 10rpx;
}
</style>
