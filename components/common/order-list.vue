<template>
	<view>
		<view class="order-item"
			v-for="(item,index) in orderList" :key="item.id"
		>
			<view class="business">
				<view class="business-left">
					<image src="https://img.alicdn.com/imgextra/i2/446338500/O1CN01W88Jl42Cf3KpzX9Au_!!446338500-0-alimamacc.jpg" mode="widthFix"></image>
					<text>阿迪达斯</text>
				</view>
				<text class="f-active-color">
					{{statusText(item.order_status).text}}
				</text>
			</view>
			
			<orderItem
				class="order-good-list"
				v-for="value in item.goodList" :key="value.id"
				:data="value"
			/>
			
			<view class="money f-active-color">
				<text class="money-text">订单金额：</text>￥
				<text class="money-price">{{item.goods_price}}</text>
				<text class="money-text">(包含运费￥0.00)</text>
			</view>
			<view class="pay">
				<text class="f-active-color" @tap="goFunBySta(item.order_status,item)">{{statusText(item.order_status).btn}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import orderItem from './orderItem.vue'
	export default {
		props: {
			orderList: Array
		},
		components: {
			orderItem
		},
		methods: {
			statusText(status) {
				status = parseInt(status)
				switch(status) {
					case 2:
						return {
							text:'待买家付款',
							btn: '支付'
						}
						break;
					case 3:
						return {
							text: '待卖家发货',
							btn: '待发货'
						}
						break;
					case 4:
						return {
							text: '待买家收货',
							btn: '收货'
						}
						break;
					case 5:
						return {
							text: '待买家评价',
							btn: '评价'
						}
						break;
					default: 
						return {
							text: '未知错误',
							btn: '未知错误'
						}
						break;
				}
			},
			// 支付
			pay(data) {
				uni.navigateTo({
					url:'/pages/payment/payment?detail=' + JSON.stringify({
						price: data.goods_price,
						nameList: data.goods_name.split(',')
					})
				})
			},
			goFunBySta(status,data) {
				status = parseInt(status)
				switch(status) {
					case 2:
					this.pay(data)
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style scoped>
.order-item {
	margin-bottom: 40rpx;
	background-color: #fff;
}
.business {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 20rpx;
}
.business-left {
	display: flex;
	align-items: center;
}
.business-left image {
	width: 80rpx;
}
.business-left text {
	margin-left: 10rpx;
}
.info {
	padding: 10rpx 20rpx;
	display: flex;
	justify-content: space-between;
}
.info-img {
	width: 200rpx;
	flex: none;
}
.info-center {
	flex: 1;
	padding: 10rpx 20rpx 0 15rpx;
}
.info-center text {
	display: block;
}
.info-center .info-name {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient:vertical;
	word-break: break-all;
	line-height: 1.5;
}
.info-center .small {
	font-size: 20rpx;
} 
.info-label {
	color: #939393;
}
.info-money {
	width: 100rpx;
	padding-top: 10rpx;
	flex: none;
}
.info-count {
	display: flex;
	width: 100%;
	justify-content: flex-end;
	color: #939393;
	align-items: center;
}
.order-good-list {
	margin-bottom: 10rpx;
}

.money {
	display: flex;
	justify-content: flex-end;
	align-items: baseline;
	padding: 5rpx 30rpx 5rpx 0;
	border-bottom: 2rpx solid #e5e5e5;
}
.money-text {
	color: #000;
}
.money-price {
	font-size: 40rpx;
}
.pay {
	margin-top: 20rpx;
	display: flex;
	justify-content: flex-end;
	padding-right: 30rpx;
	padding-bottom: 20rpx;
}
.pay text{
	display: inline-block;
	padding: 3rpx 50rpx;
	border-radius: 999px;
	border: 2rpx solid #42B7FB;
}
</style>