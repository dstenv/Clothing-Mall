<template>
	<view class="good-list">
		<view class="good-title f-color">
			<view class="title-item"
				v-for="(item,index) in selList.list" :key="index"
				@tap="item.name != '品牌'? changeSel(index):changeBrank(index)"
			>
				<view :class="{'f-active-color': index == selList.currentIndex}">{{item.name}}</view>
				<view class="title-icon" v-if="item.name != '品牌'">
					<view class="iconfont icon-shangjiantou"
						:class="{'f-active-color':item.orderType == 1}"
					></view>
					<view class="iconfont icon-xiajiantou"
						:class="{'f-active-color':item.orderType == 2}"
					></view>
				</view>
				<view class="collect" v-if="item.name == '品牌'">
					<view class="iconfont icon-shuqian"
						:class="{'f-active-color':index == selList.currentIndex}"
					></view>
				</view>
			</view>
			
		</view>
		
		<MyLine />
		
		<view class="res-list" v-if="searchList.length > 0">
			<commodList :dataList="searchList"></commodList>
		</view>
		<view class="no-data" v-else>
			<image src="../../static/imgs/no_stow_pic.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import MyLine from '@/components/common/Line.vue'
	import commodList from '@/components/common/CommodityList.vue'
	import http from '@/common/api/request.js'
	export default {
		data() {
			return {
				selList: {
					currentIndex: 0,
					list: [
						{name: "价格",orderType: 1,type: 'pprice'},
						{name: "折扣",orderType: 0,type: 'discount'},
						{name: "品牌",orderType: 0,type: ''}
					]
				},
				searchList: [],
				type: '',
				orderType: ''
			}
		},
		props: {
			keyword: String
		},
		computed: {
			requestData() {
				return {
					keyword: this.keyword,
					type:this.type,
					orderType: this.orderType
				}
			}
		},
		watch: {
			requestData(newv) {
				this.search(newv)
			}
		},
		mounted() {
			this.type = this.selList.list[this.selList.currentIndex].type
			this.orderType = this.selList.list[this.selList.currentIndex].orderType == 1? 'asc':'desc'
		},
		methods: {
			changeSel(index){
				if(index != this.selList.currentIndex) {
					this.selList.list[this.selList.currentIndex].orderType = 0
					this.selList.currentIndex = index
					this.type = this.selList.list[index].type
					this.selList.list[index].orderType = 1
				}else {
					this.selList.list[index].orderType = this.selList.list[index].orderType % 2 + 1
				}
				this.orderType = this.selList.list[index].orderType == 1? 'asc':'desc'
			},
			changeBrank(index){
				this.selList.list[this.selList.currentIndex].orderType = 0
				this.selList.currentIndex = index
				console.log('点击了品牌')
				// 另作处理
			},
			search(data) {
				http.request({
					url: '/goods/search',
					data
				}).then(res => {
					this.searchList = res
				}).catch(() => {
					uni.showToast({
						title:'网络错误',
						icon:'error'
					})
				})
			}
		},
		components: {
			MyLine,
			commodList
		}
	}
</script>

<style scoped>
	.good-title {
		display: flex;
		padding-bottom: 10rpx;
	}
	.title-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.title-icon,
	.collect{
		position: relative;
		padding-left: 10rpx;
	}
	.title-icon {
		top: -16rpx;
	}
	.collect {
		top: -12rpx;
	}
	.iconfont {
		width: 16rpx;
		height: 8rpx;
		margin-bottom: 8rpx;
	}
	.res-list {
		padding: 20rpx;
	}
	.icon-shuqian {
		font-size: 24rpx;
	}
	
	.no-data {
		overflow: hidden;
	}
	.no-data image {
		width: 400rpx;
		display: block;
		margin: 150rpx auto 0;
	}
</style>