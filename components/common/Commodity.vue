<template>
	<view class="commodity" :class="{'commodity-shop':isShop}">
		<view class="commodity-item" :class="[{'hot-item': isHot},{'shop-item':isShop}]"
			v-for="item in dataList" :key="item.id"
			@tap="goDetail(item.id)"
		>
			<image class="item-img" :src="item.imgUrl" mode="widthFix"></image>
			<view class="item-info">
				<text class="info-name" :class="{'info-name-shop':isShop}">
					{{item.name}}
				</text>
				<view>
					<text class="pprice">￥{{item.pprice}}</text>
					<text class="oprice">￥{{item.oprice}}</text>
				</view>
				<text class="discount">{{item.discount}}折</text>
			</view>
		</view>
	</view>
</template>

<script> 
export default {
	data() {
		return {
			
		}
	},
	props: {
		dataList: Array,
		isHot: {
			type: Boolean,
			require: false,
			default:false
		},
		isShop: {
			type: Boolean,
			require: false,
			default: false
		}
	},
	methods: {
		goDetail(id) {
			uni.navigateTo({
				url:`/pages/detail/detail?id=${id}`
			})
		}
	}
}
</script>

<style scoped>
	.commodity {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.commodity-shop {
		justify-content: flex-start;
		flex-wrap: nowrap;
		gap: 20rpx;
	}
	.commodity-item {
		width: calc(50% - 10rpx);
		padding-bottom: 20rpx;
	}
	.hot-item {
		width: calc(100%/3 - 10rpx);
	}
	.shop-item {
		width: 200rpx;
	}
	.item-img {
		width: 100%;
		/* height: 375rpx; */
	}
	.item-info {
		text-align: center;
	}
	.info-name {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #333333;
		word-break: break-all;
		padding: 6rpx 20rpx;
	}
	.info-name-shop {
		display: block;
		word-break: normal;
		font-size: 24rpx;
	}
	.oprice {
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999999;
	}
	.discount {
		border-radius: 4rpx;
		border: 1rpx solid #FF3333;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: #FF3333;
	}
</style>