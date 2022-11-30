<template>
	<view class="confirm-order bg-default" :style="{'height': `${dataClientHeight}px`}">
		<MyLine />
		<view class="path" @tap="goAddress">
			<view class="iconfont icon-shouhuodizhi"></view>
			<view class="path-info" v-if="defaultPath && defaultPath.phone">
				<view class="path-user">
					<text class="recievename">收货人：{{defaultPath.recievename}}</text>
					<text>{{defaultPath.phone}}</text>
				</view>
				<view class="path-address">
					<text>收货地址：{{defaultPath.address}}{{defaultPath.detailaddress}}</text>
				</view>
			</view>
			<view class="" v-else>
				您暂时还没有收货地址，请添加
			</view>
			<view class="iconfont icon-shangjiantou"></view>
		</view>
		
		<!-- 这里需要循环 -->
		<view class="confirm-item"
			v-for="(item,index) in goodItems" :key="item.id"
		>
			<view class="brank">
				<image src="https://img.alicdn.com/imgextra/i2/446338500/O1CN01W88Jl42Cf3KpzX9Au_!!446338500-0-alimamacc.jpg" mode="widthFix"></image>
				<text>阿迪达斯</text>
			</view>
			<orderItem :data="item"/>
			<view class="freight">
				<text>运费</text>
				<text>￥0.00</text>
			</view>
			<view class="message">
				<text>留言：</text>
				<input type="text" placeholder="给卖家的留言,140字以内">
			</view>
			<view class="confirm-count">
				<text>共{{item.count}}件商品 小计：</text>
				<text class="f-active-color">￥</text>
				<text class="confirm-price f-active-color">{{item.pprice * item.count}}</text>
			</view>
		</view>
		
		<view class="footer-control">
			<view class="footer-total f-active-color">
				<text class="total-text">合计:</text>
				￥<text class="total-price f-active-color">{{Math.round(controlData.total*100)/100}}</text>
			</view>
			<view class="footer-jiesuan bg-color" @tap="goPayment">
				<text>提交订单</text>
			</view>
		</view>
	</view>
</template>

<script>
	import MyLine from '@/components/common/Line.vue'
	import http from '@/common/api/request.js'
	import orderItem from '@/components/common/orderItem.vue'
	import { mapState,mapGetters } from 'vuex'
	export default {
		data() {
			return {
				dataClientHeight: 0,
				defaultPath: {},
				goodIds: [],
			}
		},
		onShow() {
			// #ifdef MP-WEIXIN
			uni.$on('sendSelAddress', (data) => {
				this.defaultPath = data
				console.log('默认地址',this.defaultPath,typeof this.defaultPath)
			})
			// #endif
		},
		activated() {
			// this.getDefaultAddress()
			// this.getDefaultAddress()
			uni.$on('sendSelAddress', (data) => {
				this.defaultPath = data
				console.log('默认地址',this.defaultPath,typeof this.defaultPath)
			})
		},
		onLoad(event) {
			if(event.selId) {
				this.goodIds = JSON.parse(event.selId)
				console.log(this.goodIds)
			}
			
			uni.getSystemInfo({
				success: (res) => {
					console.log(res.windowHeight)
					this.dataClientHeight = res.windowHeight - uni.upx2px(110) - this.getClientHeight()
					console.log(this.dataClientHeight)
				}
			})
			this.getDefaultAddress()
		},
		components: {
			MyLine,
			orderItem
		},
		computed: {
			...mapState({
				list: state => state.cart.list,
				uid: state => state.user.userInfo.id,
				oid: state => state.order.orderId,
				selectedList: state => state.cart.selected,
			}),
			...mapGetters(['controlData']),
			goodItems() {
				return this.goodIds.map(g => {
					return this.list.filter(l => l.id == g)[0]
				})
			},
			goodTotal() {
				return this.goodItems.reduce((prev,next) => {
					return prev + next.pprice * parseInt(next.count)
				},0)
			}
		},
		methods: {
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
			// 获取默认地址,如果没有则获取第一个地址
			async getDefaultAddress() {
				this.defaultPath = await http.request({
					url: '/address/default',
					data: {
						uid: this.uid
					}
				})
				// #ifdef APP-PLUS
				uni.$on('sendSelAddress', (data) => {
					this.defaultPath = data
					// console.log(this.defaultPath)
				})
				// #endif
			},
			goAddress() {
				uni.navigateTo({
					url:'/pages/myAddress/myAddress?type=confirm'
				})
			},
			goPayment() {
				if(!this.defaultPath.id) {
					return uni.showToast({
						title:'您还没有选择收货地址',
						icon: 'error'
					})
				}
				
				let nameList = []
				this.goodItems.forEach(v => {
					nameList.push(v.name)
				})
				
				// 修改订单状态 this.oid订单号 this.defaultPath地址id
				http.request({
					url: '/order/update',
					method: 'POST',
					header: {
						token: true
					},
					data: {
						orderId: this.oid,
						addressId: this.defaultPath.id,
						goodIds: JSON.stringify(this.selectedList)
					}
				}).then(res => {
					if(res === 'success') {
						console.log('修改订单状态成功')
						uni.navigateTo({
							url:'/pages/payment/payment?detail=' + JSON.stringify({
								price: Math.round(this.controlData.total*100)/100,
								nameList
							})
						})
					}
					
				})
				
				
			}
		}
	}
</script>

<style scoped>
.confirm-order {
	overflow-y: auto;
}
.path {
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
}
.path-info {
	flex: 1;
	padding: 0 30rpx;
}
.path-user {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.recievename {
	font-size: 30rpx;
	font-weight: bold;
}
.path-address {
	width: 540rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.iconfont {
	flex: none;
	font-size: 45rpx;
}
.icon-shangjiantou {
	transform: rotate(90deg);
}

.confirm-item {
	background-color: #fff;
	margin: 10rpx;
	border: 2rpx solid #ddd;
}
.brank {
	display: flex;
	align-items: center;
}
.brank image {
	width: 80rpx;
	border-radius: 50%;
	outline: none;
}
.brank text {
	margin-left: 10rpx;
}
.freight {
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	padding: 20rpx 10rpx;
	border-bottom: 2rpx solid #ddd;
}
.message {
	display: flex;
	padding: 20rpx 10rpx;
	align-items: center;
	border-bottom: 2rpx solid #ddd;
}
.message input {
	font-size: 28rpx;
}
.confirm-count {
	display: flex;
	padding: 20rpx 10rpx;
	justify-content: flex-end;
	align-items: baseline;
}
.f-active-color {
	font-size: 24rpx;
}
.confirm-price {
	font-size: 36rpx;
}
.footer-control {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	background-color: #fff;
	/* padding: 40rpx 0; */
	align-items: center;
	justify-content: flex-end;
}
.total-text {
	color: #000;
}
.footer-total {
	font-size: 20rpx;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
}
.footer-total text {
	font-size: 28rpx;
}
.footer-total .total-price{
	font-size: 40rpx;
	position: relative;
	top: -5rpx;
}
.footer-jiesuan {
	padding: 30rpx 60rpx;
	color: #fff;
}
</style>
