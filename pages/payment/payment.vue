<template>
	<view class="pay-page">
		<!-- #ifdef APP-PLUS -->
		<uniNavBar
			title="确认支付" fixed="true" statusBar="true"
			leftText="关闭"
			@clickLeft="exit"
		/>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
		<uniNavBar
			title="确认支付" fixed="true" statusBar="true"
			leftText="关闭"
			@clickLeft="exit"
		/>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<uniNavBar
			title="确认支付" fixed="true" statusBar="true"
			leftText="关闭"
			@clickLeft="exit"
		/>
		<!-- #endif -->
		<label for="">
			<view class="payment-type">
				<view class="iconfont icon-zhifubaozhifu"></view>
				<view class="payment-text">
					<text class="type">支付宝支付</text>
					<text class="type-desc">推荐支付宝用户使用</text>
				</view>
				<label class="radio">
					<radio name="radio-type" :checked="payType" @tap="payType = true" color="#13d113"/>
				</label>
			</view>
		</label>
		
		<label for="">
			<view class="payment-type">
				<view class="iconfont icon-weixinzhifu"></view>
				<view class="payment-text">
					<text class="type">微信支付</text>
					<text class="type-desc">推荐微信用户使用</text>
				</view>
				<label class="radio">
					<radio name="radio-type" :checked="!payType" @tap="payType = false" color="#13d113" />
				</label>
			</view>
		</label>
	
		<view class="popup" v-if="showPay">
			<text class="no-pay" @tap="showPay = !showPay">取消支付</text>
			<view style="position: relative;" >
				<image :src="qrCodeImage" class="custom-qrcode" />
			</view>
		</view>
		
		<view class="pay-foot">
			<view class="total">
				<text class="f-color">合计：</text>
				<text class="total-price">￥{{detail.price}}</text>
			</view>
			<view class="go-pay bg-color" @tap="pay">
				去支付
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni/uni-nav-bar/uni-nav-bar.vue'
	import http from '@/common/api/request.js'
	import Qrcode from 'qrious'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				detail: {},
				payType: true,
				showPay: false,
				qrCodeImage: ''
			}
		},
		components:{
			uniNavBar,
		},
		onLoad(event) {
			if(event.detail) {
				this.detail = JSON.parse(event.detail)
			}
		},
		computed: {
			...mapState({
				oid: state => state.order.orderId
			}),
		},
		methods: {
			exit() {
				console.log('关闭')
				uni.navigateBack()
			},
			getQriousCode(value) {
				this.showPay = true;
				let qr = new Qrcode({
					value,
					background:'white', // 背景色
					foreground:'#000' ,// 二维码颜色
					level:'L', // 二维码复杂程度
					size: 375 ,// 尺寸大小
					mime:'image/png' // 图片类型
				});
				this.qrCodeImage = qr.toDataURL();
				console.log('二维码图片',this.qrCodeImage)
			},
			pay() {
				// 支付
				console.log(this.oid)
				let url = ''
				if(this.payType) {
					// 支付宝支付
					url = '/pay/alipay'
				}else {
					// 微信支付
					url = '/pay/wxpay'
				}
				http.request({
					url,
					method: 'POST',
					header: {
						token: true
					},
					data: {
						oid: this.oid,
						price: this.detail.price,
						nameList: JSON.stringify(this.detail.nameList)
					}
				}).then(res => {
					console.log('支付',res.payUrl)
					// #ifdef H5
					// window.open(res.payUrl)
					// window.location.href = res.payUrl
					this.getQriousCode(res.payUrl)
					// #endif
					
					// #ifdef APP-PLUS
					// this.getQriousCode(res.payUrl)
					plus.runtime.openURL( res.payUrl );
					// #endif
					
					
				})
			}
		}
	}
</script>

<style scoped>
.pay-page {
	position: relative;
	width: 100vw;
	height: 100vh;
}
.payment-type {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	border-bottom: 2rpx solid #ddd;
}
.iconfont {
	font-size: 80rpx;
}
.payment-text {
	position: relative;
	left: -20rpx;
	width: 300rpx;
}
.payment-text text {
	display: block;
}
.type {
	font-size: 30rpx;
	font-weight: bold;
}
.type-desc {
	font-size: 24rpx;
	color: #8b8b8b;
}
.pay-foot {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.total {
	flex: 1;
	padding-left: 30rpx;
	background-color: #000;
	line-height: 100rpx;
}
.total-price {
	font-size: 32rpx;
	color: #fff;
}
.go-pay {
	flex: none;
	color: #fff;
	padding: 0 70rpx;
	line-height: 100rpx;
}
.popup {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 99;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, .7);
}
.no-pay {
	display: inline-block;
	padding: 5rpx 20rpx;
	border: 2rpx solid red;
	border-radius: 999px;
	color: red;
	font-size: 34rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
}
.custom-qrcode {
	width: 100vw;
	height: 100vw;
}
</style>
