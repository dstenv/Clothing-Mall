<template>
	<view class="shop">
		<view class="shop-item" v-for="(item,index) in shopList" :key="index">
			<image :src="item.bigUrl" mode="widthFix" class="shop-bg" @tap="goBrankDetail(item.id)"></image>
			<scroll-view scroll-x="true" class="scroll-content">
				<view class="scroll-item">
					<Commodity :dataList="item.data" :isShop="true"></Commodity>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Commodity from '@/components/common/Commodity.vue'
	export default {
		props: {
			shopList: Array
		},
		components: {
			Commodity
		},
		methods: {
			goBrankDetail(id) {
				console.log(id)
				uni.navigateTo({
					url:'/pages/brankDetail/brankDetail?id=' + id
				})
			}
		}
	}
</script>

<style scoped>
	::-webkit-scrollbar {  
	    display: none;  
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	.shop-bg {
		width: 100%;
		display: block;
	}
	.scroll-content {
		padding-top: 20rpx;
		width: 100%;
		white-space: nowrap;
	}
	.scroll-item {
		display: inline-block;
	}
</style>