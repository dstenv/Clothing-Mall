<template>
	<!-- 需要修改一下导航栏样式 -->
	<view class="detail">
		<swiper class="swiper-box" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item
				v-for="i in 3" :key="i"
			>
				<view class="swiper-item">
					<image class="item-img" :src="goodDetail.imgUrl" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>
		
		
		<view class="detail-good">
			<view class="pprice">
				{{goodDetail.pprice}}
			</view>
			<view class="oprice f-color">
				原价：{{goodDetail.oprice}}
			</view>
			<view class="name">
				{{goodDetail.name}}
			</view>
			<view class="good-imgs">
				<image class="img" :src="goodDetail.imgUrl" mode="widthFix"></image>
				<image class="img" :src="goodDetail.imgUrl" mode="widthFix"></image>
				<image class="img" :src="goodDetail.imgUrl" mode="widthFix"></image>
			</view>
		</view>
		<view @tap="goBrankDetail">
			<BrankInfo :logo="brank.logo" :count="brank.length" :name="brank.name"/>
		</view>
		
		<Card cardTitle="看了又看"></Card>
		<CommodList :dataList="goodsList"></CommodList>
		
		<view class="footer">
			<view class="iconfont icon-xiaoxi"></view>
			<view class="iconfont icon-gouwuche" @tap="goCart"></view>
			<view class="add" @tap="showPopup(false)">加入购物车</view>
			<view class="buy" @tap="showPopup(true)">立即购买</view>
		</view>
		
		<view class="popup" v-show="popupShow">
			<view class="mask" @tap="hidePopup" @touchmove.stop.prevent=""></view>
			<view class="popup-box" :animation="animationData" :class="{'popup-active': popupShow}">
				<view class="buy-head">
					<image class="buy-img" :src="goodDetail.imgUrl" mode="widthFix"></image>
					<view class="head-info">
						<text class="head-pprice f-active-color">￥{{goodDetail.pprice}}</text>
						<text>可购买999件</text>
						<text>{{colorIndex == -1? '请选择颜色':'已选："' + colorList[colorIndex] + '"'}}</text>
					</view>
				</view>
				<view class="buy-color">
					<text class="color-type">颜色分类</text>
					<view class="color-list">
						<text v-for="(item,index) in colorList" :key="index"
							:class="{'color-active': index == colorIndex}"
							@tap="changeColor(index)"
						>
							{{item}}
						</text>
					</view>
				</view>
				<view class="buy-count">
					<text>购买数量</text>
					<NumberBox :min="1" :value="count" @change="++count"></NumberBox>
				</view>
				<view class="buy-sub" @tap="submitGood">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import Card from '@/components/common/Card.vue'
	import CommodList from '@/components/common/CommodityList.vue'
	import BrankInfo from '@/components/common/brankInfo.vue'
	import NumberBox from '@/components/uni/uni-number-box/uni-number-box.vue'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				goodId: 0,
				goodDetail: {},
				brank: {},
				goodsList: [],
				popupShow: false,
				animationData: {},
				colorList: [
					'黑色',
					'白色',
					'蓝色',
					'紫色'
				],
				colorIndex: -1,
				count: 1,
				isBuy: false
			}
		},
		onBackPress() {
			if(this.popupShow){
				this.hidePopup()
				return true
			}
		},
		onNavigationBarButtonTap(event) {
			if(event.type === 'share') {
				// 分享
				uni.share({
					provider:'weixin',
					type:0,
					scene:'WXSceneSession',
					title:this.goodDetail.name,
					href:`http://192.168.41.44:8080/#/pages/detail/detail?id=${this.goodDetail.id}`,
					imageUrl: this.goodDetail.imageUrl,
					success:function(res) {
						console.log('share',res)
					},
					fail:function() {
						uni.showToast({
							title:'分享失败',
							icon:'error'
						})
					}
				})
			}
			else if(event.type === 'menu') {
				// 菜单
			}
		},
		onLoad(event) {
			this.goodId = event.id
			http.request({
				url: '/good/detail',
				data: {
					goodid: this.goodId
				}
			}).then(res => {
				const {good,brank} = res
				this.goodDetail = good
				this.brank = brank
				console.log(this.brank)
			}).catch(() => {
				uni.showToast({
					title:'网络错误',
					icon:'error'
				})
			})
			
			http.request({
				url: '/index_list/1/data'
			}).then(res => {
				this.goodsList = res[0].data
			})
		},
		components: {
			CommodList,
			Card,
			BrankInfo,
			NumberBox
		},
		computed: {
			...mapState({
				uid: state => state.user.userInfo.id,
				token: state => state.user.userInfo.token
			})
		},
		methods: {
			goBrankDetail() {
				uni.navigateTo({
					url:'/pages/brankDetail/brankDetail?id=' + this.brank.id
				})
			},
			showPopup(isBuy) {
				
				this.isBuy = isBuy
				let animate = uni.createAnimation({
					duration: 300
				})
				animate.translateY(300).step()
				this.animationData = animate.export()
				setTimeout(() => {
					animate.translateY(0).step()
					this.animationData = animate.export()
				}, 10)
				this.popupShow = true
				
				
			},
			hidePopup() {
				let animate = uni.createAnimation({
					duration: 300
				})
				animate.translateY(300).step()
				this.animationData = animate.export()
				setTimeout(() => {
					animate.translateY(0).step()
					this.popupShow = false
				}, 300)
			},
			changeColor(index) {
				if(index === this.colorIndex) {
					this.colorIndex = -1
					return
				}
				this.colorIndex = index
			},
			submitGood() {
				if(this.colorIndex != -1) {
					if(!this.isBuy) {
						http.request({
							url: '/cart/add',
							method: 'POST',
							header: {
								token: true
							},
							data: {
								uid: this.uid,
								id: this.goodDetail.id,
								count: this.count,
								price: this.goodDetail.pprice,
								color: this.colorList[this.colorIndex]
							}
						}).then(() => {
							uni.showToast({
								title:'添加成功'
							})
							this.popupShow = false
						})
					}else {
						console.log('购买')
					}
				}else {
					uni.showToast({
						title: '请选择颜色分类',
						icon:'error',
					})
				}
			},
			goCart() {
				if(!this.token) {
					return uni.navigateTo({
						url:'/pages/login/login',
						animationType:'slide-in-bottom'
					})
				}
				console.log('去购物车')
				uni.switchTab({
					url:'/pages/shopbag/shopbag'
				})
			}
		},
		
	}
</script>

<style scoped>
.detail {
	background-color: #f2f2f2;
	padding-bottom: 103rpx;
}
.swiper-box {
	width: 100%;
	height: 780rpx;
}
.item-img {
	width: 100%;
	display: block;
}
.detail-good {
	padding: 10rpx 40rpx;
}
.pprice,
.oprice,
.name {
	text-align: center;
	font-size: 36rpx;
} 
.oprice {
	text-decoration: line-through;
}
.good-imgs {
	margin-top: 40rpx;
	overflow: hidden;
}
.img {
	width: 100%;
	margin-bottom: 10rpx;
	display: block;
}
.footer {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	width: 100%;
	padding: 20rpx 0;
	background-color: #fff;
	left: 0;
	bottom: 0;
}
.footer .iconfont {
	text-align: center;
	line-height: 60rpx;
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: #000;
	color: #fff;
	margin-right: 30rpx;
}
.add,
.buy {
	padding: 10rpx 30rpx;
	color: #fff;
	border-radius: 999px;
	margin-left: 40rpx;
}
.add {
	background-color: #000;
}
.buy {
	background-color: #2b89fb;
}
.popup,
.mask{
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
}
.popup {
	z-index: 998;
}
.mask {
	background-color: rgba(0, 0, 0, .3);
}
.popup-box {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	padding: 0 30rpx;
	/* height: 600px; */
	background-color: #fff;
}
.buy-head {
	display: flex;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #ddd;
}
.buy-img {
	position: relative;
	top: -30rpx;
	width: 240rpx;
	outline: none;
}
.head-info {
	display: flex;
	flex-direction: column;
	padding-left: 20rpx;
}

.head-pprice {
	margin-top: 30rpx;
	font-size: 36rpx;
}
.buy-color {
	padding: 30rpx 0;
	border-bottom: 2rpx solid #ddd;
}
.color-type {
	font-size: 30rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 20rpx;
}
.color-list {
	display: flex;
	flex-wrap: wrap;
}
.color-list text {
	display: inline-block;
	padding: 4rpx 20rpx;
	background-color: #f2f2f2;
	border-radius: 999px;
	margin-right: 30rpx;
}
.color-list text:last-of-type {
	margin-right: 0;
}
.color-list .color-active {
	color: #fff;
	background-color: #42B7FB;
}
.buy-count {
	padding: 30rpx 0;
	display: flex;
	justify-content: space-between;
	border-bottom: 2rpx solid #ddd;
}
.buy-count text {
	font-weight: bold;
}
.buy-sub {
	width: 100%;
	margin: 40rpx 0 20rpx;
	padding: 20rpx 0;
	text-align: center;
	background-color: #42B7FB;
	color: #fff;
}
</style>
