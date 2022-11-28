<template>
	<view class="my-order">
		<MyLine />
		
		<view class="order-head">
			<text v-for="(item,index) in headText" :key="index"
				@tap="changeList(index)" :class="{active: index == initIndex}"
			>
				{{item.text}}
			</text>
		</view>
		
		<view class="order-list " :style="{transform: `translate(${-initIndex*100}vw)`}">
			<!-- :class="{'no-orders': true}" -->
			<view class="type-orders bg-default" v-for="(item,index) in headText" :key="index" 
				:style="{'height': `${dataClientHeight}px`}"
			>
				<orderList v-if="showOrders.length > 0" :orderList="showOrders"/>
				
				<view class="no-order" v-else>
					<text>您还没有相关订单</text>
					<view @tap="goHome">
						<text class="no-order-home f-active-color">去首页逛逛</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import MyLine from '@/components/common/Line.vue'
	import orderList from '@/components/common/order-list.vue'
	import http from '@/common/api/request.js'
	export default {
		data() {
			return {
				initIndex: 0,
				headText: [
					{
						text: '全部',
						count: 0,
						status: 1
					},
					{
						text: '待付款',
						count: 0,
						status: 2
					},
					{
						text: '待发货',
						count: 0,
						status: 3
					},
					{
						text: '待收货',
						count: 0,
						status: 4
					},
					{
						text: '待评价',
						count: 0,
						status: 5
					}
				],
				dataClientHeight: 0,
				allOrder: []
			}
		},
		components: {
			MyLine,
			orderList
		},
		computed: {
			orderByType() {
				return [
					{
						// 全部
						status: 1,
						list: this.allOrder
					},
					{
						// 待付款
						status: 2,
						list: this.allOrder.filter(o => parseInt(o.order_status) === 2)
					},
					{
						// 待发货
						status: 3,
						list: this.allOrder.filter(o => parseInt(o.order_status) === 3)
					},
					{
						// 待收货
						status: 4,
						list: this.allOrder.filter(o => parseInt(o.order_status) === 4)
					},
					{
						// 待评价
						status: 5,
						list: this.allOrder.filter(o => parseInt(o.order_status) === 5)
					}
				]
			},
			showOrders() {
				return this.orderByType.filter(ot => ot.status == this.headText[this.initIndex].status)[0].list
			}
		},
		onLoad(event) {
			if(event.index) {
				this.initIndex = event.index
			}
			// 获取订单
			this.getMyAllOrderList()
			uni.getSystemInfo({
				success: (res) => {
					console.log(res.windowHeight)
					// uni.upx2px(80) 80rpx转化为px
					this.dataClientHeight = res.windowHeight - uni.upx2px(80) - this.getClientHeight()
					console.log(this.dataClientHeight)
				}
			})
		},
		methods: {
			changeList(index) {
				this.initIndex = index
				console.log(this.initIndex)
			},
			// 获取可视区域顶部高度(兼容)
			getClientHeight() {
				const res = uni.getSystemInfoSync()
				// console.log('123',res.platform,res.statusBarHeight)
				const system = res.platform
				if(system === 'ios') {
					if(res.statusBarHeight == 0) {
						return 0
					}
					return 44 + res.statusBarHeight
				}else if(system === 'android') {
					return 0
				}else {
					return 48.5
				}
			},
			goHome() {
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			getMyAllOrderList() {
				http.request({
					url: '/order/find',
					header: {
						token: true
					}
				}).then(res => {
					console.log(res)
					this.allOrder = res
				})
			}
		}
	}
</script>

<style scoped>
@keyframes topTabChange {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}
.my-order {
	
}
.order-head {
	display: flex;
	padding-top: 10rpx;
	/* margin-bottom: 20rpx; */
	border-bottom: 2rpx solid #ddd;
}
.order-head text {
	flex: 1;
	display: inline-block;
	text-align: center;
	padding: 0 20rpx 0;
	box-sizing: border-box;
}
.order-head .active::after {
	content: '';
	margin-top: 10rpx;
	display: block;
	width: 100%;
	animation: topTabChange .35s linear 1;
	height: 4rpx;
	border-radius: 999px;
	background-color: #49BDFB;
}
.order-list {
	display: flex;
	width: 500vw;
	/* padding-top: 20rpx; */
	transition: all .3s linear;
}
.type-orders {
	width: 100vw;
	/* height: calc(100vh - 168rpx); */
	overflow: auto;
	box-sizing: border-box;
	flex: none;
}
.no-orders {
	display: flex;
	align-items: center;
	justify-content: center;
}
.no-order {
	margin-top: 200rpx;
	text-align: center;
}
.no-order-home {
	margin-top: 20rpx;
	display: inline-block;
	padding: 4rpx 50rpx;
	border-radius: 999px;
	border: 2rpx solid #42B7FB;
}
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
