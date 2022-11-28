<template>
	<view>
		<MyLine />
		
		<view class="list">
			
			<scroll-view scroll-y="true" class="labels" :style="{'height': `${dataClientHeight}px`}">
				<view class="label-item"
					v-for="item in labelList" :key="item.id"
					:class="{'label-item-active': item.id == labelId}"
					@tap="changeLabel(item.id)"
				>
					<text class="label-name">{{item.name}}</text>
				</view>
			</scroll-view>
			
			<scroll-view scroll-y="true" class="goods" :style="{'height': `${dataClientHeight}px`}">
				<view class="goods-item"
					v-for="item in goodList" :key="item.type"
				>
					<view class="goods-name">{{item.type}}</view>
					<view class="goods-list-box">
						<view class="goods-list"
							v-for="value in item.data" :key="value.id"
							@tap="goSearchRes(value.name)"
						>
							<image class="goods-list-img" :src="value.imgUrl" mode="widthFix"></image>
							<text>{{value.name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			
		</view>
		<Tabbar currentPage="list"></Tabbar>
	</view>
</template>

<script>
	import MyLine from '@/components/common/Line.vue'
	import http from '@/common/api/request.js'
	import Tabbar from '@/common/tabbar.vue'
	export default {
		data() {
			return {
				labelId: 0,
				labelList: [],
				goodList: [],
				dataClientHeight: 0
			}
		},
		components: {
			MyLine,
			Tabbar
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'/pages/search/search'
			})
		},
		onLoad() {
			this.labelId = 1
			http.request({
				url: '/goods/types'
			}).then(res => {
				this.labelList = res.data
			}).catch(() => {
				uni.showToast({
					title: '网络错误',
					icon:'error'
				})
			})
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			})
		},
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					console.log(res.windowHeight)
					// uni.upx2px(80) 80rpx转化为px
					this.dataClientHeight = res.windowHeight - this.getClientHeight()
					console.log('list',this.dataClientHeight)
				}
			})
		},
		watch: {
			labelId(newv) {
				// 做网络请求
				http.request({
					url: '/goods/goodByType',
					data: {
						typeid: newv
					}
				}).then(res => {
					this.goodList = res
					console.log(this.goodList)
				}).catch(() => {
					uni.showToast({
						title: '网络错误',
						icon:'error'
					})
				})
			}
		},
		methods: {
			changeLabel(id) {
				this.labelId = id
			},
			// 获取可视区域顶部高度(兼容)
			getClientHeight() {
				const res = uni.getSystemInfoSync()
				console.log('123',res.platform,res.statusBarHeight)
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
			goSearchRes(name) {
				console.log(name)
				uni.navigateTo({
					// 需要传参
					url:`/pages/searchRes/searchRes?keyword=${name}`
				})
			}
		}
	}
</script>

<style scoped>
.list {
	display: flex;
}
.labels {
	width: 200rpx;
	background-color: #f2f2f2;
}
.label-item {
	padding: 30rpx 0;
	background-color: #f2f2f2;
	border-bottom: 2rpx solid #fff;
	text-align: center;
	box-sizing: border-box;
}
.label-item-active {
	background-color: #fff;
	border-left: 8rpx solid #49BDFB;
}
.goods {
	box-sizing: border-box;
	padding: 30rpx 0 0 30rpx;
	flex: 1;
}
.goods-name {
	font-weight: bold;
	font-size: 28rpx;
	padding-bottom: 20rpx;
}
.goods-item {
	margin-bottom: 20rpx;
}
.goods-list-box {
	display: flex;
	flex-wrap: wrap;
	/* gap: 20rpx; */
}
.goods-list {
	width: calc(100% / 3 - 20rpx);
	margin-right: 20rpx;
	text-align: center;
}
.goods-list:last-of-type {
	margin-right: 0;
}
.goods-list-img {
	width: 100%;
	display: block;
}
</style>
