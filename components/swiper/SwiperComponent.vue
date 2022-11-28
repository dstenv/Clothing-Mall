<template>
	<swiper class="swiper-box" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<swiper-item v-for="(item,index) in dataList" :key="index">
			<view class="swiper-item">
				<image class="swiper-img" :src="item.imgUrl" mode="widthFix"></image>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		props : {
			dataList: Array
		}
	}
</script>

<style scoped>
.swiper-box {
	width: 100%;
}
.swiper-img {
	width: 100%;
	display: block;
}
</style>