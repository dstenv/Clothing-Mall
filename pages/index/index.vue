<template>
	<view class="content">
		<!-- 开启只在小程序端显示的顶部导航栏，后期再完善 -->
		<!-- <view class="wx-nav">
			<view class="iconfont icon-dibudaohanglan-"></view>
			<view class="title">
				百年奥莱
			</view>
			<view class="iconfont icon-xiaoxi"></view>
		</view> -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="wx-nav">
			<view class="title">
				优衣服饰
			</view>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
		<!-- 开启只在小程序端显示的顶部导航栏，后期再完善 -->
		<view class="h5-nav">
			<view class="iconfont icon-dibudaohanglan-" @tap="goSearch"></view>
			<view class="title">
				优衣服饰
			</view>
			<view class="iconfont icon-xiaoxi"></view>
		</view>
		<Myline></Myline>
		<!-- #endif -->
		
		<!-- 顶部滑块 -->
		<scroll-view scroll-x="true"  class="top-scroll" :scroll-into-view="scrollText">
			<view class="scroll-item" :id="'top' + index"
				v-for="(item,index) in topBar" :key="item.name"
				@click="changeTab(index)"
			>
				<text class="f-color" :class="{'f-active-color': index === topBarIndex}">{{item.name}}</text>
			</view>
		</scroll-view>
		
		
		<swiper @change="onChangeTab" :duration="350" :current="topBarIndex" :style="{'height': `${dataClientHeight}px`}">
			<swiper-item
				v-for="(item,index) in newTopBar" :key="item.name"
			>
				<scroll-view scroll-y="true" :style="{'height': `${dataClientHeight}px`}" @scrolltolower="loadMore(index)">
					<block v-if="item.data.length > 0">
						<block v-for="(value,key) in item.data" :key="key">
							<SwiperComponent v-if="value.type == 'swiperList'" :dataList="value.data"></SwiperComponent>
							
							<template v-if="value.type == 'recommendList'">
								<HomeRecommend :dataList="value.data"></HomeRecommend>
								<Card cardTitle="猜你喜欢"></Card>
							</template>
							
							
							
							<Banner v-if="value.type == 'bannerList'" :img="value.imgUrl"></Banner>
							<template v-if="value.type == 'iconList'">
								<Icons :iconList="value.data"></Icons>
								<Card cardTitle="热销爆品"></Card>
							</template>
							
							<template v-if="value.type == 'hotList'">
								<Hot :hotList="value.data"></Hot>
								<Card cardTitle="推荐店铺"></Card>
							</template>
							
							<template v-if="value.type == 'shopList'"> 
								<Shop :shopList="value.data"></Shop>
								<Card cardTitle="为您推荐"></Card>
							</template>
							
							
							<CommodityList v-if="value.type == 'commodityList'" :dataList="value.data"></CommodityList>
						</block>
					</block>
					<view v-else>
						暂无数据...
					</view>
					<view class="load-text f-color">
						{{item.loadText}}
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<Tabbar currentPage="index"></Tabbar>
		
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import SwiperComponent from '@/components/swiper/SwiperComponent.vue'
	import HomeRecommend from '@/components/home/HomeRecommend.vue'
	import Card from '@/components/common/Card.vue'
	import CommodityList from '@/components/common/CommodityList.vue'
	import Banner from '@/components/home/Banner.vue'
	import Icons from '@/components/home/Icons.vue'
	import Hot from '@/components/home/Hot.vue'
	import Shop from '@/components/home/Shop.vue'
	import Tabbar from '@/common/tabbar.vue'
	import Myline from '@/components/common/Line.vue'
	export default {
		data() {
			return {
				//选中的索引
				topBarIndex:0,
				//顶栏数据
				topBar:[],
				newTopBar: [],
				// 内容块高度
				dataClientHeight: 0,
			}
		},
		components: {
			SwiperComponent,
			HomeRecommend,
			Card,
			CommodityList,
			Banner,
			Icons,
			Hot,
			Shop,
			Tabbar,
			Myline
		},
		onLoad() {
			this.__init()
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			})
		},
		// 标题栏被点击触发
		onNavigationBarButtonTap(event) {
			console.log(event)
			switch(event.index) {
				case 0:
					// 点击了搜索
					uni.navigateTo({
						url:'/pages/search/search'
					})
					break;
				case 1: 
					// 点击了消息
					break;
			}
		},
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					console.log(res.windowHeight)
					// uni.upx2px(80) 80rpx转化为px
					this.dataClientHeight = res.windowHeight - uni.upx2px(80) - this.getClientHeight()
					console.log(this.dataClientHeight)
				}
			})
		},
		computed: {
			scrollText() {
				return 'top' + this.topBarIndex
			}
		},
		methods: {
			__init() {
				http.request({
					url: '/index_list/data'
				}).then(res => {
					this.topBar = res.topBar
					this.newTopBar = this.initData(res)
				}).catch(() => {
					uni.showToast({
						title:'请求失败',
						icon:'error'
					})
				})
			},
			initData(res){
				let arr = []
				console.log(res)
				for (let i = 0; i < this.topBar.length; i++) {
					let obj = {
						data: [],
						load: "first",
						loadText: "上拉加载更多...",
						offset: 0
					}
					if(i == 0) {
						obj.data = res.data
					}
					arr.push(obj)
				}
				console.log(arr)
				return arr
			},
			changeTab(index) {
				this.topBarIndex = index	
				if(this.newTopBar[index].load === 'first') {
					this.addData()
				}
			},
			onChangeTab(value) {
				this.changeTab(value.detail.current)
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
					return 48 + res.statusBarHeight
				}else {
					return 48.5
				}
			},
			loadMore(index) {
				this.newTopBar[index].loadText = '加载中...'
				this.addData(() => {
					this.newTopBar[index].loadText = '上拉加载更多...'
				})
			},
			addData(callback) {
				let index = this.topBarIndex
				let id = this.topBar[index].id
				this.newTopBar[index].offset++
				// console.log(this.newTopBar[index].offset)
				http.request({
					url: `/index_list/${id}/data`,
					data: {
						offset: this.newTopBar[index].offset
					}
				}).then(res => {
					console.log('数据',res)
					this.newTopBar[index].data = [...this.newTopBar[index].data,...res]
					if(typeof callback === 'function') {
						callback()
					}
				}).catch(() => {
					uni.showToast({
						title:'请求失败',
						icon:'error'
					})
				})
				this.newTopBar[index].load = "last"
			},
			goSearch() {
				uni.navigateTo({
					url:'/pages/search/search'
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
.content {
	overflow: hidden;
}
.wx-nav {
	margin: 50rpx 0 15rpx;
	width: 100%;
	line-height: 200rpx;
	text-align: center;
	display: enable-flex;
	justify-content: center;
	align-items: center;
}
.h5-nav {
	display: flex;
	/* margin: 50rpx 0 15rpx; */
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
	width: 100%;
	line-height: 200rpx;
	text-align: center;
	justify-content: space-between;
	align-items: center;
}
.h5-nav .iconfont {
	font-size: 38rpx;
}
.title {
	font-size: 36rpx;
}
.top-scroll {
	width: 100%;
	display: enable-flex;
	white-space: nowrap;
	padding: 0 0 10rpx;
	height: 80rpx;
}
.scroll-item {
	display: inline-block;
	padding: 10rpx 30rpx;
	font-size: 30rpx;
}
.f-active-color::after {
	content: '';
	display: block;
	width: 100%;
	animation: topTabChange .35s linear 1;
	height: 4rpx;
	background-color: #49BDFB;
}
.load-text {
	text-align: center;
	padding: 20rpx 0;
}
</style>
