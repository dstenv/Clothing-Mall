<template>
	<view class="recommend bg-color">
		<view class="recommend-item" v-for="(item,index) in dataList" :key="index">
			<image class="item-big" :src="item.bigUrl" mode="widthFix"></image>
			<view class="item-small">
				<block v-for="(value,key) in item.data" :key="key">
					<image class="item-img" :src="value.imgUrl" mode="widthFix"></image>
				</block>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props : {
			dataList: Array
		}
	}
</script>

<style scoped>
	.recommend {
		padding: 20rpx;
	}
	.recommend-item {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		/* border: 2rpx solid #CCCCCC; */
		overflow: hidden;
		margin: 20rpx 0;
	}
	.item-big {
		width: 100%;
		display: block;
		/* height: 300rpx; */
	}
	.item-small {
		width: 100%;
		height: 240rpx;
	}
	.item-img {
		width: calc(100% / 3);
		outline: none;
		/* height: 240rpx; */
	}
</style>