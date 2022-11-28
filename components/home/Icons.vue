<template>
	<view class="icons">
		<view class="icons-item" v-for="(item,index) in iconList" :key="index">
			<image class="icons-img" :src="item.imgUrl" mode="widthFix"></image>
			<text class="f-color">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			iconList: Array
		}
	}
</script>

<style scoped>
	.icons {
		display: flex;
		flex-wrap: wrap;
	}
	.icons-item {
		width: 25%;
		text-align: center;
		padding-top: 20rpx;
	}
	.icons-img {
		width: 100rpx;
		margin: 0 auto;
		display: block;
	}
</style>