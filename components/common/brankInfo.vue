<template>
	<view class="detail-brank">
		<view class="brank-left">
			<image class="logo" :src="logo" mode="widthFix"></image>
			<view class="brank-middle">
				<text class="middle-text">{{name}}</text>
				<text class="middle-text middle-length">在售商品{{count}}件</text>
			</view>
		</view>
		<view class="brank-right" :class="{'brank-detail': isbrankDetail}">
			<text class="right-btn">查看店铺</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			logo: String,
			name: String,
			count: Number,
			isbrankDetail: {
				type: Boolean,
				default: false,
				require: false
			}
		},
	}
</script>

<style scoped>
	.detail-brank {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #ddd;
		padding: 20rpx 0;
		margin: 0 40rpx;
	}
	.logo {
		width: 80rpx;
		outline: none;
		border-radius: 50%;
	}
	.brank-left {
		display: flex;
		align-items: center;
	}
	.brank-middle {
		padding-left: 20rpx;
	}
	.middle-text {
		display: block;
	}
	
	.middle-length {
		color: #7d7d7d;
		font-size: 24rpx;
	}
	.right-btn {
		display: inline-block;
		padding: 8rpx 30rpx;
		background-color: #000;
		color: #f2f2f2;
		border-radius: 999px;
	}
	.brank-detail {
		box-sizing: border-box;
		padding: 10rpx 0 10rpx 20rpx;
		border-left: 2rpx solid #ddd;
	}
</style>