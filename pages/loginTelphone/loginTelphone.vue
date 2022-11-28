<template>
	<view>
		<MyLine />
		<view class="login-tel">
			<view class="tel-main">
				<view class="register-form">
					<view class="form-user">
						<text>手机号</text>
						<input type="number" focus="true" v-model="phone" placeholder="请输入手机号" />
					</view>
				</view>
				<view class="text" @tap="submit">
					下一步
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import MyLine from '@/components/common/Line.vue'
	import http from '@/common/api/request.js'
	export default {
		data() {
			return {
				phone: '',
				rules: {
					phone: {
						rule: /^1[3-9]\d{9}/,
						msg: '手机号为1开头的11位数字'
					},
				}
			}
		},
		components: {
			MyLine
		},
		methods: {
			submit() {
				if(!this.validUser('phone')) return;
				
				http.request({
					url: '/register/phone',
					method: 'POST',
					data: {
						userName: this.phone
					}
				}).then(res => {
					console.log(res)
					if(res.success == 'fail') {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						return
					}else {
						uni.navigateTo({
							url:'/pages/loginCode/loginCode?phone=' + this.phone
						})
					}
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
.form-user input {
	flex: 1;
	padding-left: 20rpx;
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
</style>
