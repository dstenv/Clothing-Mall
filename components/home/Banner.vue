<template>
	<view class="banner">
		<image class="banner-img" :src="img" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		props : {
			img: String
		}
	}
</script>

<style scoped>
	.banner-img {
		width: 100%;
		display: block;
	}
</style>