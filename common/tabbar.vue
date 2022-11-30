<template>
	<view class="tabbar">
		<view class="tab"
			v-for="(item,index) in list" :key="index"
			@tap="changeTab(item.pagePath)"
		>
			<image v-if="item.pagePath == currentPage" :src="item.selectedIconPath" mode="widthFix"></image>
			<image v-else :src="item.iconPath" mode="widthFix"></image>
			<text>{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			currentPage: {
				type: String,
				default: 'index'
			}
		},
		
		data() {
			return {
				list: [
					{
						"pagePath": "index",
						"iconPath": "/static/tabbar/home.png",
						"selectedIconPath": "/static/tabbar/home-active.png",
						"text": "首页"
					},
					{
						"pagePath": "list",
						"iconPath": "/static/tabbar/select.png",
						"selectedIconPath": "/static/tabbar/select-active.png",
						"text": "分类"
					},
					{
						"pagePath": "shopbag",
						"iconPath": "/static/tabbar/shopbag.png",
						"selectedIconPath": "/static/tabbar/shopbag-active.png",
						"text": "购物车"
					},
					{
						"pagePath": "my",
						"iconPath": "/static/tabbar/my.png",
						"selectedIconPath": "/static/tabbar/my-active.png",
						"text": "我的"
					}
				],
				pathWhite: [
					'shopbag',
					'my'
				]
			}
		},
		methods: {
			changeTab(path) {
				if(this.pathWhite.includes(path)) {
					// 需要验证
					// console.log('验证')
					this.navTo({
						url:`../../pages/${path}/${path}`
					})
				}else {
					// console.log('跳转')
					// uni.redirectTo({
					// 	url:`../../pages/${path}/${path}`
					// })
					uni.switchTab({
						url:`../../pages/${path}/${path}`
					})
				}
			}
		}
	}
</script>

<style scoped>
.tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 120rpx;
	display: flex;
	align-items: center;
	background-color: #fff;
	z-index: 9999;
	border-top: 2rpx solid #a2a2a2;
}
.tab {
	flex: 1;
	text-align: center;
}
image {
	width: 40rpx;
	margin: 0 auto;
	display: block;
}
text {
	font-size: 24rpx;
}
</style>


