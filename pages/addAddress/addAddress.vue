<template>
	<view class="add">
		<view class="recievename">
			<view class="form-text">
				收件人
			</view>
			<input class="input" v-model="recieveName" type="text" placeholder="收件人姓名">
		</view>
		<view class="phone">
			<view class="form-text">
				手机号
			</view>
			<input class="input" v-model="phone" type="text" placeholder="手机号">
		</view>
		<!-- #ifdef H5 -->
		<view class="sel-address" @tap="goMap">
			<view class="form-text">
				选择地址
			</view>
			<text>{{selAddress}}</text>
			<view v-if="!selAddress" class="iconfont icon-shangjiantou"></view>
		</view>
		<!-- #endif --> 
		
		<!-- #ifdef APP-PLUS -->
		<view class="sel-address" @tap="showCityPiker">
			<view class="form-text">
				选择地区
			</view>
			<text>{{selAddress}}</text>
			<view v-if="!selAddress" class="iconfont icon-shangjiantou"></view>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="sel-address" @tap="goWxMap">
			<view class="form-text">
				选择地址
			</view>
			<text>{{selAddress}}</text>
			<view v-if="!selAddress" class="iconfont icon-shangjiantou"></view>
		</view>
		<!-- #endif -->
		
		<view class="detail-address">
			<view class="form-text detail-path">
				详细地址
			</view>
			<textarea v-model="detailPath" class="detail-area" cols="3" rows="3"></textarea>
		</view>
		<view class="set-default">
			<view class="default-text">
				设为默认地址
			</view>
			<label class="radio">
				<radio :checked="isDefault" @tap="changeDefault"/>
			</label>
		</view>
		<view class="add-path f-active-color" @tap="Add" v-show="path_id == 'undefined' || !path_id">
			添加地址
		</view>
		
		<view class="add-path f-active-color" @tap="Update" v-show="path_id != 'undefined' && path_id">
			保存地址
		</view>
		
		<cityPiker ref="mpvuePiker" :pickerValueDefault="pikerValue" @onConfirm="onConfirm"></cityPiker>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import cityPiker from '@/components/uni/mpvue-citypicker/mpvueCityPicker.vue'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				isDefault: false,
				recieveName: '',
				phone: '',
				selAddress: '',
				detailPath: '',
				pikerValue: [0,0,1],
				path_id: null,
				isUpdate: false
			}
		},
		components: {
			cityPiker
		},
		computed: {
			...mapState({
				uid: state => state.user.userInfo.id
			}),
		},
		onUnload() {
			// uni.removeStorageSync('formData')
			if(this.isUpdate) {
				uni.removeStorageSync('formData')
			}
		},
		onBackPress(event) {
			console.log(event)
			uni.removeStorageSync('formData')
		},
		onLoad(event) {
			this.path_id = event.id
			if(this.path_id != 'undefined' && this.path_id != undefined ) {
				// 说明是修改地址
				console.log('修改地址')
				uni.setNavigationBarTitle({
					title:'修改地址'
				})
				let storageAddress = ''
				const data = uni.getStorageSync('formData')
				console.log(data)
				storageAddress = data.address
				// console.log(storageAddress)
				if(!storageAddress) {
					http.request({
						url: '/address/find/one',
						data: {
							id: this.path_id
						}
					}).then(res => {
						this.recieveName = res.recievename
						this.phone = res.phone
						this.isDefault = res.isdefault == 1? true:false
						this.selAddress = res.address
						this.detailPath = res.detailaddress
						uni.setStorage({
							key:'formData',
							data: {
								recieveName: this.recieveName,
								phone: this.phone,
								detailPath: this.detailPath,
								address: this.selAddress,
								isDefault: this.isDefault
							}
						})
					}).catch(() => {
						uni.showToast({
							title:'网络错误',
							icon:'error'
						})
					})
				}
			}
			this.selAddress = event.address
			// console.log(this.selAddress)
			if(this.selAddress) {
			console.log('没有修改地址')
				uni.getStorage({
					key:'formData',
					success: (res) => {
						console.log(res)
						const { data } = res
						this.recieveName = data.recieveName
						this.phone = data.phone
						this.detailPath = data.detailPath
						this.isDefault = data.isDefault
					}
				})
			}
		},
		methods: {
			changeDefault() {
				this.isDefault = !this.isDefault
			},
			Add() {
				
				http.request({
					url: '/address/add',
					method:'POST',
					// uid,recieveName,phone,isdefault,address
					data: {
						uid: this.uid,
						recieveName: this.recieveName,
						phone: this.phone,
						isdefault: this.isDefault? 1:0,
						address: this.selAddress,
						detailPath: this.detailPath
					}
				}).then(() => {
					uni.showToast({
						title:'添加成功'
					})
					
					setTimeout(() => {
						uni.navigateBack()
					},300)
				})
			},
			Update() {
				http.request({
					url: '/address/update/one',
					method: 'POST',
					data: {
						id: this.path_id,
						recieveName: this.recieveName,
						phone: this.phone,
						isdefault: this.isDefault? 1:0,
						address: this.selAddress,
						detailPath: this.detailPath
					}
				}).then(() => {
					uni.showToast({
						title:'修改成功'
					})
					this.isUpdate = true
					
					setTimeout(() => {
						uni.redirectTo({
							url:'/pages/myAddress/myAddress'
						})
					},300)
				})
			},
			goMap(){
				
				uni.setStorageSync('formData',{
					recieveName: this.recieveName,
					phone: this.phone,
					detailPath: this.detailPath,
					address: this.selAddress,
					isDefault: this.isDefault
				})
				// console.log('报存storage',uni.getStorageSync('formData'))
				
				uni.redirectTo({
					url:'/pages/baiduMap/baiduMap?path_id=' + this.path_id
				})
			},
			goWxMap() {
				uni.setStorageSync('formData',{
					recieveName: this.recieveName,
					phone: this.phone,
					detailPath: this.detailPath,
					address: this.selAddress,
					isDefault: this.isDefault
				})
				// console.log('报存storage',uni.getStorageSync('formData'))
				uni.redirectTo({
					url:'/pages/wxMap/wxMap?path_id=' + this.path_id
				})
			},
			showCityPiker() {
				this.$refs.mpvuePiker.show()
			},
			onConfirm(event) {
				// console.log(event)
				this.selAddress = event.label
			}
		}
	}
</script>

<style scoped>
.add {
	padding: 0 20rpx 20rpx 20rpx;
}
.recievename,
.phone,
.detail-address,
.set-default {
	display: flex;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 2rpx solid #ddd;
}
.form-text {
	font-size: 34rpx;
	width: 150rpx;
	white-space: nowrap;
	text-align: justify;
	text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
	text-align-last: justify;
	flex: none;
}
.detail-path {
	align-self: flex-start;
}
.input {
	flex: 1;
	padding-left: 25rpx;
}
.detail-area {
	flex: 1;
	padding-left: 25rpx;
	height: 100rpx;
}
.set-default {
	display: flex;
	justify-content: space-between;
}
.default-text {
	font-size: 34rpx;
}
.add-path {
	width: 350rpx;
	border: 2rpx solid #49BDFB;
	text-align: center;
	margin: 30rpx auto 0;
	border-radius: 999px;
	padding: 8rpx 0;
}
.sel-address {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 2rpx solid #ddd;
}
.sel-address text {
	/* display: inline-block; */
	display: -webkit-box;
	width: 500rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	text-align: end;
}
	
.icon-shangjiantou {
	font-size: 38rpx;
	transform: rotate(90deg);
}
</style>
