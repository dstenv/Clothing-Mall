<template>
	<view class="card">
		<view>-</view>
		<slot>
			<view class="card-name">
				{{cardTitle}}
			</view>
		</slot>
		<view>-</view>
	</view>
</template>

<script>
	export default {
		props: {
			cardTitle: String
		}
	}
</script>

<style scoped>
	.card {
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
		font-weight: bold;
		align-items: center;
	}
	.card-name {
		padding: 0 20rpx;
		font-size: 32rpx;
	}
</style>