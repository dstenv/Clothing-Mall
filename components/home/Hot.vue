<template>
	<view class="hot">
		<Commodity :dataList="hotList" :isHot="true"></Commodity>
	</view>
</template>

<script>
	import Commodity from '@/components/common/Commodity.vue'
	export default {
		props: {
			hotList: Array
		},
		components: {
			Commodity
		}
	}
</script>

<style>
</style>