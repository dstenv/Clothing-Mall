<template>
	<view class="search">
		<MyLine></MyLine>
		
		<view class="box momment-search">
			<view class="title moment-top">
				<text class="f-color">最近搜索</text>
				<view class="iconfont icon-lajitong" @tap="clearHistory"></view>
			</view>
			<view v-if="haveSearch.length > 0">
				<text class="name f-color"
					v-for="(item,index) in haveSearch" :key="index"
					@tap="search(item)"
				>{{item}}</text>
			</view>
			<view class="no-search f-color" v-else>
				暂无最近搜索记录
			</view>
		</view>
		<view class="box ">
			<view class="title hot-top">
				<text class="f-color">热门搜索</text>
			</view>
			<view class="hot-search">
				<text class="name f-color"
					v-for="item in hotKeys" :key="item.keyId"
					@tap="search(item.keyword)"
				>{{item.keyword}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import MyLine from '@/components/common/Line.vue'
	export default {
		data() {
			return {
				hotKeys: [],
				keywords: '',
				// 最近搜索的搜索词
				haveSearch: [],
				
			}
		},
		components: {
			MyLine
		},
		onNavigationBarButtonTap(event) {
			if(event.float === 'right') {
				this.search(this.keywords)
			}
		},
		onNavigationBarSearchInputConfirmed(event) {
			if(event.target.id === "1") {
				this.search(this.keywords)
			}
		},
		onNavigationBarSearchInputChanged(event) {
			if(event.text.trim() != '') {
				this.keywords = event.text
			}
		},
		onLoad() {
			uni.getStorage({
				key:"searchData",
				success: (res) => {
					this.haveSearch = JSON.parse(res.data)
				}
			})
		},
		onReady() {
			http.request({
				url: '/search/hot'
			}).then(res => {
				console.log(res)
				this.hotKeys = res.data
			}).catch(() => {
				uni.showToast({
					title:'网络错误',
				})
			})
		},
		methods: {
			search(keyword) {
				if(keyword.trim() != '') {
					uni.navigateTo({
						// 需要传参
						url:`/pages/searchRes/searchRes?keyword=${keyword.trim()}`
					})
					// 记录最近搜索
					this.addSearchKeyword(keyword.trim())
				}else {
					uni.showToast({
						title:'请输入搜索关键词',
						icon:'none'
					})
				}
				// 兼容苹果 苹果点击搜索之后默认不隐藏软键盘
				uni.hideKeyboard()
				
			},
			addSearchKeyword(keyword) {
				let haveIndex = this.haveSearch.indexOf(keyword)
				if(haveIndex !== -1) {
					this.haveSearch.splice(haveIndex,1)
				}
				this.haveSearch.unshift(keyword)
				
				uni.setStorage({
					key:"searchData",
					data:JSON.stringify(this.haveSearch)
				})
			},
			beginSearch(text) {
				
			},
			clearHistory() {
				uni,uni.showModal({
					title: '重要提示',
					content: '是否清空搜索记录',
					showCancel: false,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if(res.confirm) {
							uni.removeStorage({
								key:"searchData"
							})
							this.haveSearch = []
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style scoped>
.box {
	padding: 20rpx;
}
.title {
	display: flex;
}
.moment-top {
	justify-content: space-between;
}
.hot-search {
	
}
.name {
	padding: 4rpx 24rpx;
	background-color: #E1E1E1;
	display: inline-block;
	border-radius: 999px;
	margin: 10rpx;
}
.no-search {
	text-align: center;
	padding: 10rpx;
	letter-spacing: 2rpx;
}
</style>
