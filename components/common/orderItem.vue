<template>
	<view class="info bg-default">
		<image class="info-img" :src="data.imgUrl" mode="widthFix"></image>
		<view class="info-center">
			<text class="info-name">{{data.name}}</text>
			<text class="info-label small">{{data.label}}</text>
			<text class="f-active-color small">7天无理由</text>
		</view>
		<view class="info-money">
			<text class="money-total">￥{{data.pprice}}</text>
			<view class="info-count">
				<view class="iconfont icon-chahao"></view>
				<text>{{data.count}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: Object
		}
	}
</script>

<style scoped>
.info {
	padding: 10rpx 20rpx;
	display: flex;
	justify-content: space-between;
}
.info-img {
	width: 200rpx;
	flex: none;
}
.info-center {
	flex: 1;
	padding: 10rpx 20rpx 0 15rpx;
}
.info-center text {
	display: block;
}
.info-center .info-name {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient:vertical;
	word-break: break-all;
	line-height: 1.5;
}
.info-center .small {
	font-size: 20rpx;
} 
.info-label {
	color: #939393;
}
.info-money {
	width: 100rpx;
	padding-top: 10rpx;
	flex: none;
}
.info-count {
	display: flex;
	width: 100%;
	justify-content: flex-end;
	color: #939393;
	align-items: center;
}
</style>