<template>
	<view class="commodity-list">
		<Commodity :dataList="dataList"></Commodity>
	</view>
</template>

<script>
import Commodity from './Commodity.vue'
export default {
	data() {
		return {
			
		}
	},
	props: {
		dataList: Array
	},
	components: {
		Commodity
	}
}
</script>

<style scoped>
</style>