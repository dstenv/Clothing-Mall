<template>
	<view class="my">
		<!-- #ifdef APP-PLUS -->
		<view class="my-head">
			<image src="../../static/imgs/config.png" mode="widthFix" class="config"
				@tap="goConfig"
			></image>
			<view class="user">
				<image :src="loginStatus? userInfo.head:'../../static/imgs/default-head.png'" mode="widthFix" class="user-head"></image>
				<text>{{loginStatus? userInfo.nikename:'默认昵称'}}</text>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="my-head">
			<image src="../../static/imgs/config.png" mode="widthFix" class="config"
				@tap="goConfig"
			></image>
			<view class="user">
				<image :src="loginStatus? userInfo.head:'../../static/imgs/default-head.png'" mode="widthFix" class="user-head"></image>
				<text>{{loginStatus? userInfo.nikename:'默认昵称'}}</text>
			</view>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="my-head-weixin">
			<image src="../../static/imgs/config.png" mode="widthFix" class="config"
				@tap="goConfig"
			></image>
			<image src="../../static/imgs/sky.png" mode="widthFix" class="weixin-bg"></image>
			<view class="user user-weixin">
				<image :src="loginStatus? userInfo.head:'../../static/imgs/default-head.png'" mode="widthFix" class="user-head"></image>
				<text>{{loginStatus? userInfo.nikename:'默认昵称'}}</text>
			</view>
		</view>
		<!-- #endif -->
		
		<view class="main">
			<view class="order">
				<view class="order-title">
					<text class="order-text1">我的订单</text>
					<text class="order-text2" @tap="goMyOrder">全部订单&nbsp;&gt;</text>
				</view>
				<view class="sel-list">
					<view class="sel-item"
						v-for="(item,index) in selOrderList" :key="index"
						@tap="goOrder(index)"
					>
						<image class="sel-img" :src="item.img" mode="widthFix"></image>
						<text>{{item.text}}</text>
					</view>
					<view class="sel-item">
						<image class="sel-img" src="../../static/imgs/order5.png" mode="widthFix"></image>
						<text>退款管理</text>
					</view>
				</view>
			</view>
			<view class="operation-item" :class="{'operation-vip': item.isVip}"
				v-for="(item,index) in mySelect" :key="index"
			>
				<view class="item-left">
					<view class="iconfont" :class="item.iconName"></view>
					<text>{{item.text}}</text>
				</view>
				<view class="item-right">
					<text class="f-color" v-if="/\d+/.test(item.count)">{{item.count}}</text>
					<view class="iconfont icon-shangjiantou right-icon"></view>
				</view>
			</view>
		</view>
		<Tabbar currentPage="my"></Tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import Tabbar from '@/common/tabbar.vue'
	export default {
		data() {
			return {
				selOrderList: [
					{
						img: require("@/static/imgs/order1.png"),
						text: '待付款'
					},
					{
						img: require("@/static/imgs/order2.png"),
						text: '待发货'
					},
					{
						img: require("@/static/imgs/order3.png"),
						text: '待收货'
					},
					{
						img: require("@/static/imgs/order4.png"),
						text: '待评价'
					}
				],
				mySelect: [
					{
						iconName: 'icon-like',
						text: '我的收藏',
						isVip: false,
						count: 1
					},
					{
						iconName: 'icon-youhuiquan',
						text: '我的优惠券',
						isVip: false,
						count: 0
					},
					{
						iconName: 'icon-jifen',
						text: '我的积分',
						isVip: false
					},
					{
						iconName: 'icon-VIP',
						text: '加入超级VIP',
						isVip: true
					},
					{
						iconName: 'icon-bangzhu',
						text: '帮助中心',
						isVip: false
					},
					{
						iconName: 'icon-kefu',
						text: '联系客服',
						isVip: false
					},
					{
						iconName: 'icon-shangjia',
						text: '商家入驻',
						isVip: false
					}
				]
			}
		},
		components: {
			Tabbar
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
				loginStatus: state => state.user.loginStatus
			})
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			})
		},
		methods: {
			goConfig(){
				uni.navigateTo({
					url:"/pages/myConfig/myConfig"
				})
			},
			goMyOrder() {
				uni.navigateTo({
					url:'/pages/my-order/my-order'
				})
			},
			goOrder(index) {
				uni.navigateTo({
					url:'/pages/my-order/my-order?index=' + (index + 1)
				})
			}
		}
	}
</script>

<style scoped>
.my-head {
	background: url('../../static/imgs/sky.png') no-repeat;
	width: 100%;
	height: 400rpx;
	background-size: cover;
	position: relative;
}
.my-head-weixin {
	width: 100%;
	height: 400rpx;
}
.weixin-bg {
	width: 100%;
	height: 100%;
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
}
.config {
	width: 60rpx;
	margin: 30rpx 0 0 30rpx;
}
.user　{
	position: absolute;
	top: 60%;
	left: 50%;
	right: 0;
	transform: translate(-50%,-50%);
	text-align: center;
	color: #fff;
}
.user-weixin {
	top: 20%;
}
.user-head {
	width: 140rpx;
	margin: 0 auto 20rpx;
	border-radius: 50%;
	border: 4rpx solid #fff;
	display: block;
}

	
.main {
	width: 100%;
	padding-bottom: 30rpx;
	background-color: #f0f0f0;
}
.order {
	padding: 20rpx 30rpx 0;
	margin-bottom: 30rpx;
	background-color: #fff;
}
.order-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.order-text1 {
	font-size: 30rpx;
	font-weight: bold;
}
.order-text2 {
	color: #616161;
}


.sel-list {
	display: flex;
	justify-content: space-between;
	padding: 40rpx 0 20rpx;
	text-align: center;
}
.sel-item {
	color: #616161;
}
.sel-img {
	width: 60rpx;
	display: block;
	margin: 0 auto;
}
.operation-item{
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 30rpx;
	border-bottom: 2rpx solid #e3e3e3;
}
.operation-vip {
	margin: 30rpx 0;
}
.item-left {
	display: flex;
	align-items: center;
}
.item-left text {
	margin-left: 20rpx;
}
.iconfont{
	font-size: 40rpx;
}
.item-right {
	display: flex;
	align-items: center;
}
.right-icon {
	margin-left: 15rpx;
	color: #cecece;
	transform: rotate(90deg);
}
</style>
