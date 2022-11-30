<template>
	<view>
		<view class="config-box">
			<view class="config-item" :class="{'config-title': item.isTitle}"
				v-for="(item,index) in configList" :key="index"
				@tap="Functions(item.eng)"
			>
				<view class="item-text">
					<text>{{item.text}}</text>
				</view>
				<view v-if="!item.isTitle" class="iconfont icon-shangjiantou"></view>
			</view>
		</view>
		
		<view class="exit bg-color" @tap="exitLogin">
			退出
		</view>
	</view>
</template>

<script>
	import { mapMutations,mapState } from 'vuex'
	export default {
		data() {
			return {
				configList: [
					{
						eng: 'address',
						text: '地址管理',
						isTitle: false
					}
				]
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus
			})
		},
		onShow() {
			uni.removeStorageSync('formData')
		},
		methods: {
			...mapMutations(['loginOut']),
			Functions(name) {
				switch(name) {
					case 'address': 
						this.selAddress()
						break;
					default:
						break;
				}
			},
			selAddress() {
				uni.navigateTo({
					url:'/pages/myAddress/myAddress'
				})
			},
			exitLogin() {
				if(!this.loginStatus) {
					uni.showToast({
						title:'暂无用户登录，无法退出',
						icon:'none'
					})
				}else {
					this.loginOut()
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
				
			}
		}
	}
</script>

<style scoped>
.config-box {
	margin-bottom: 20rpx;
}
.config-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 20rpx;
	border-bottom: 2rpx solid #CCCCCC;
}
.icon-shangjiantou {
	font-size: 40rpx;
	transform: rotate(90deg);
}
.exit {
	padding: 15rpx 0;
	text-align: center;
	color: #fff;
}
</style>
