<template>
	<view>
		
		
		<template v-if="list.length > 0">
			<!-- #ifdef H5 -->
			<uniNavBar
				title="购物车" fixed="true" statusBar="true"
				:rightText="isFinish && '完成' || '编辑'"
				@clickRight="edit"
			/>
			<!-- #endif -->
			
			<!-- #ifdef APP-PLUS -->
			<uniNavBar
				title="购物车" fixed="true" statusBar="true"
				:rightText="isFinish && '完成' || '编辑'"
				@clickRight="edit"
			/>
			<!-- #endif -->
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="weixin-nav">
				<text @tap="edit">{{isFinish && '完成' || '编辑'}}</text>
				<text class="weixin-shopbag">购物车</text>
				<text style="width: 56rpx;"></text>
			</view>
			<!-- #endif -->
			
			<view class="shop-list" :style="{'height': `${dataClientHeight}px`}">
				
				<view class="shop-item"
					v-for="(item,index) in list" :key="item.id"
				>
					<label class="radio">
						<radio color="#FF3333" :checked="item.checked"
							@tap="selectItem(index)"
						/><text></text>
					</label>
					<image class="shop-img" :src="item.imgUrl" mode="widthFix"></image>
					<view class="shop-text">
						<view class="shop-name">
							{{item.name}}
						</view>
						<view class="shop-label f-color">
							{{item.label}}
						</view>
						<view class="shop-price">
							<text>￥{{item.pprice}}</text>
							<template v-if="!isFinish">
								<view class="shop-count">
									<view class="iconfont icon-chahao"></view>
									<view>{{item.count}}</view>
								</view>
							</template>
							<template v-else>
								<NumberBox :value="item.count" :min="1"
									@change="changeCount($event,index)"
								/>
							</template>
						</view>
					</view>
				</view>	
			</view>
			
			
			<view class="shop-footer" :style="{bottom: `${getClientHeight()}rpx`}">

				<label class="radio footer-radio" @tap="checkAll">
					<radio value="" color="#FF3333" :checked="isCheckAll"/><text>全选</text>
				</label>
				<view class="footer-control">
					<template v-if="!isFinish">
						<view class="footer-total f-active-color">
							<text class="total-text">合计:</text>
							￥<text class="total-price f-active-color">{{Math.round(controlData.total*100)/100}}</text>
						</view>
						<view class="footer-jiesuan bg-color" @tap="confirmBag">
							<text>结算(</text>
							<text>{{controlData.num}}</text>
							<text>)</text>
						</view>
					</template>
					<template v-else>
						<view class="footer-jiesuan" style="background-color: black;">
							<text class="total-text">移入收藏夹</text>
						</view>
						<view class="footer-jiesuan bg-color" @tap="deleteGoodAct">
							<text>删除</text>
						</view>
					</template>
				</view>
			</view>
		</template>
		
		<template v-else>
			<uni-nav-bar title="购物车" fixed="true" statusBar="true"/>
			<view class="empty">
				<image class="empty-img" src="@/static/imgs/no_stow_pic.png" mode="widthFix"></image>
			</view>
		</template>
		
		<Tabbar currentPage="shopbag"></Tabbar>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import uniNavBar from '@/components/uni/uni-nav-bar/uni-nav-bar.vue'
	import NumberBox from '@/components/uni/uni-number-box/uni-number-box.vue'
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
	import Tabbar from '@/common/tabbar.vue'
	export default {
		data() {
			return {
				isFinish: false,
				changeCountList:[],
				dataClientHeight: 0,
				isFirst: true
			}
		},
		components:{
			uniNavBar,
			NumberBox,
			Tabbar
		},
		computed: {
			...mapState({
				list: state => state.cart.list,
				selectedList: state => state.cart.selected,
				uid: state => state.user.userInfo.id
			}),
			...mapGetters(['isCheckAll','controlData'])
		},
		// activated() {
		// 	this.init()
		// 	this.deleteGood()
		// },
		onShow() {
			uni.hideTabBar({
				animation: false
			})
			console.log('更新数据')
			console.log(this.isFirst)
			if(!this.isFirst) {
				this.init()
				this.deleteGood()
			}
			
		},
		onLoad() {
			this.init()
			setTimeout(() => {
				this.isFirst = false
			},1000)
		},
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res.windowHeight)
					// uni.upx2px(80) 80rpx转化为px
					this.dataClientHeight = res.windowHeight - uni.upx2px(80) - this.getClientHeight()
					console.log(this.dataClientHeight)
				}
			})
		},
		methods: {
			...mapActions(['checkAll']),
			...mapMutations(['selectItem','changeListItem','setList','deleteGood','initOrder']),
			init() {
				http.request({
					url: '/cart/find',
					data: {
						uid: this.uid
					}
				}).then(res => {
					this.setList(res)
				}).catch(() => {
					uni.showToast({
						title:'网络错误',
						icon:'error'
					})
				})
			},
			edit() {
				if(this.isFinish && this.changeCountList.length>0) {
					http.request({
						url: '/cart/update/count',
						method: 'POST',
						data: {
							uid: this.uid,
							updateArr: JSON.stringify(this.changeCountList)
						}
					}).then(() => {
						uni.showToast({
							title:'修改成功',
						})
					}).catch(() => {
						uni.showToast({
							title:'修改失败',
							icon:'error'
						})
					})
				}
				this.isFinish = !this.isFinish
			},
			getClientHeight() {
				const res = uni.getSystemInfoSync()
				console.log('123',res.platform,res.statusBarHeight)
				const system = res.platform
				if(system === 'ios') {
					if(res.statusBarHeight == 0) {
						return 120
					}
					return 44 + res.statusBarHeight
				}else if(system === 'android') {
					return 96 + res.statusBarHeight
				}else if(system === 'devtools') {
					return 122
				}
				else {
					return 0
				}
			},
			changeCount(value,index) {
				this.changeListItem({
					index,
					key: 'count',
					value
				})
				if(this.changeCountList.length==0) {
					this.changeCountList.push({
						id: this.list[index].id,
						count: value
					})
				}
				else if(this.changeCountList.findIndex(v => v.id == this.list[index].id) == -1) {
					this.changeCountList.push({
						id: this.list[index].id,
						count: value
					})
				}else {
					let haveIndex = this.changeCountList.findIndex(v => v.id == this.list[index].id)
					this.changeCountList[index].count = value
				}
				console.log(this.changeCountList)
			},
			deleteGoodAct() {
				http.request({
					url: '/cart/delete',
					method: 'POST',
					data: {
						uid: this.uid,
						deleteArr: this.selectedList
					}
				}).then(res => {
					this.setList(res)
					this.deleteGood()
					uni.showToast({
						title:'删除成功',
					})
				}).catch(() => {
					uni.showToast({
						title:'删除失败',
						icon:'error'
					})
				})
			},
			confirmBag() {
				if(this.selectedList.length === 0) {
					uni.showToast({
						title:'请至少选择一件商品',
						icon:'none'
					})
				}else {
					// 生成订单
					const goodList = this.selectedList.map(id => {
						return this.list.filter(l => l.id == id )[0]
					})
					
					http.request({
						url: '/order/create',
						method: 'POST',
						header: {
							token: true
						},
						data: {
							goodList:JSON.stringify(goodList)
						}
					}).then(res => {
						this.initOrder(res.order_id)
						
						uni.navigateTo({
							url:`/pages/confirmOrder/confirmOrder?selId=${JSON.stringify(this.selectedList)}`
						})
					})
					
					
				}
			}
		}
	}
</script>

<style scoped>
.shop-list {
	padding-bottom: 40rpx;
	overflow-y: auto;
}
.shop-item {
	display: flex;
	padding: 20rpx;
	align-items: center;
	background-color: #f7f7f7;
	margin-bottom: 20rpx;
}
.shop-img {
	width: 200rpx;
	flex: none;
}
.shop-label {
	font-size: 24rpx;
}
.shop-price {
	height: 60rpx;
	display: flex;
	justify-content: space-between;
}
.shop-text {
	flex: 1;
	padding-left: 20rpx;
}
.shop-name {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical; 
}
.shop-count {
	display: flex;
}

.shop-footer {
	display: flex;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	border-top: 2rpx solid #ddd;
	background-color: #fff;
	justify-content: space-between;
	align-items: center;
}
.footer-radio {
	padding-left: 20rpx;
}
.footer-control {
	display: flex;
}
.footer-total {
	font-size: 20rpx;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
}
.footer-total text {
	font-size: 28rpx;
}
.footer-total .total-text {
	color: #000;
}
.footer-total .total-price{
	font-size: 40rpx;
	position: relative;
	top: -5rpx;
}
.footer-jiesuan {
	padding: 30rpx 60rpx;
	color: #fff;
}

.empty {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding-top: 100rpx;
	background-color: #f7f7f7;
	display: flex;
	align-items: center;
}
.empty-img {
	width: 50%;
	margin: 0 auto;
	display: block;
}

.weixin-nav {
	display: flex;
	padding: 50rpx 40rpx 20rpx;
	justify-content: space-between;
	align-items: center;
}
.weixin-shopbag {
	font-size: 38rpx;
}
</style>
