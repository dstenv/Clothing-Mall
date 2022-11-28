<template>
	<view>
		<image class="sky" src="../../static/imgs/sky.png" mode="widthFix"></image>
		<view class="detail">
			<brankInfo :isbrankDetail="true" :logo="brank.logo" :count="goods.length" :name="brank.name"/>
			
			<view class="goods">
				<CommodList :dataList="goods"/>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import brankInfo from '@/components/common/brankInfo.vue'
	import CommodList from '@/components/common/CommodityList.vue'
	export default {
		data() {
			return {
				brankID: 0,
				brank: {},
				goods: []
			}
		},
		onLoad(event) {
			this.brankID = event.id
			http.request({
				url: '/brank/detail',
				data: {
					id: this.brankID
				}
			}).then(res => {
				this.brank = res.brank
				this.goods = res.goods
			}).catch(() => {
				uni.showToast({
					title:'网络错误',
					icon:'error'
				})
			})
		},
		components: {
			brankInfo,
			CommodList
		},
		methods: {
			
		}
	}
</script>

<style scoped>
.sky {
	width: 100%;
	display: block;
}
.detail {
	width: 100%;
	height: 600rpx;
	/* background-color: red; */
	background-color: #fff;
	position: relative;
	top: -200rpx;
	z-index: 10;
}
.goods {
	padding: 20rpx 40rpx;
}
</style>
