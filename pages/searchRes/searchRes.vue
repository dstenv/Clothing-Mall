<template>
	<view class="search-res">
		<goodList :keyword="value"/>
	</view>
</template>

<script>
	import goodList from '@/components/common/goodList.vue'
	export default {
		data() {
			return {
				value: ''
			}
		},
		onLoad(event) {
			this.value = event.keyword
			console.log(this.value)
			// 动态更新导航栏上的input的text文本
			// #ifdef APP-PLUS  
			var webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewSearchInputText(event.keyword)  
			// #endif
			
			// 开始网络请求根据搜索关键词查找
		},
		components: {
			goodList
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
