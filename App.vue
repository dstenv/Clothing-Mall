

<script>
	export default {
		onLaunch: function() {
			this.$store.commit('initUser')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onPageNotFound() {
			uni.navigateTo({
				url:'/pages/404/404'
			})
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("common/uni.css");
	@import url("common/iconfont.css");
	@import url("common/common.css");
	
</style>
