<template>
	<view class="address">
		<view class="path-list">
			<view class="path-item f-color"
				v-for="item in addressList" :key="item.id"
				@tap="changeAddress(item.id,item)"
			>
				<view :class="{'info-path': isEdit}">
					<view>
						<text class="recievename">{{item.recievename}}</text>
						<text>{{item.phone}}</text>
					</view>
					<view class="address-name">
						<text v-if="item.isdefault == 1" class="default bg-color">默认</text>
						<view class="path">
							{{item.address}} {{item.detailaddress}}
						</view>
					</view>
				</view>
				<view class="delete-path" :class="{'delete-btn':isEdit}" @tap.stop.prevent="deleteAddress(item.id)">
					<text :class="{'btn-text':!isEdit}">删除</text>
				</view>
			</view>
		</view>
		<view class="add-path f-active-color" @tap="goAdd">
			新增地址
		</view>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				addressList: [],
				isEdit: false,
				isFromConfirm: false
			}
		},
		onNavigationBarButtonTap(event) {
			console.log(event)
			if(event.text === '编辑') {
				this.isEdit = !this.isEdit
			}
		},
		activated() {
			http.request({
				url: '/address/find',
				data: {
					uid: this.uid
				}
			}).then(res => {
				this.addressList = res
			})
		},
		onLoad(event) {
			if(event.type === 'confirm') {
				this.isFromConfirm = true
				console.log(this.isFromConfirm)
			}
			http.request({
				url: '/address/find',
				data: {
					uid: this.uid
				}
			}).then(res => {
				this.addressList = res
			})
		},
		computed: {
			...mapState({
				uid: state => state.user.userInfo.id
			}),
		},
		methods: {
			goAdd(){
				uni.navigateTo({
					url: '/pages/addAddress/addAddress'
				})
			},
			changeAddress(id,data) {
				if(!this.isFromConfirm) {
					uni.redirectTo({
						url: '/pages/addAddress/addAddress?id=' + id
					})
				}else {
					uni.$emit('sendSelAddress',data)
					uni.navigateBack()
				}
			},
			deleteAddress(id) {
				console.log(id)
				http.request({
					url: '/address/delete/one',
					data: {
						id
					}
				}).then(() => {
					uni.showToast({
						title:'删除成功'
					})
					this.addressList.splice(this.addressList.findIndex(a => a.id == id),1)
				})
			}
		}
	}
</script>

<style scoped>
.address {
	overflow: hidden;
}
.add-path {
	width: 350rpx;
	border: 2rpx solid #49BDFB;
	text-align: center;
	margin: 30rpx auto 0;
	border-radius: 999px;
	padding: 8rpx 0;
}
.path-item {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0 10rpx 20rpx;
	border-bottom: 2rpx solid #CCCCCC;
}
.info-path {
	width: calc(100% - 160rpx);
}
.delete-path {
	width: 0;
	transition: width .2s ease-in-out;
	color: #fff;
	background-color: red;
	display: flex;
	align-items: center;
	justify-content: center;
} 
.delete-btn {
	width: 150rpx;
	letter-spacing: 3rpx;
	/* font-size: 34rpx; */
}
.btn-text{
	visibility: hidden;
}
.recievename {
	margin-right: 20rpx;
}
.address-name {
	display: flex;
	padding-top: 10rpx;
}
.default {
	color: #fff;
	padding: 2rpx 30rpx;
	border-radius: 999px;
	transform: scale(.8);
	position: relative;
	left: -10rpx;
}
.path {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

</style>
