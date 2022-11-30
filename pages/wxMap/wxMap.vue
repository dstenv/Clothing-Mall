<template>
	<view class="wx-map">
		<input type="text" placeholder="请输入搜索地址" class="address-inp"  @input="search">
		<view class="search-list" v-show="isSearch">
			<view class="search-item"
				v-for="item in searchPoint" :key="item.id"
				@tap="goPoint(item.location)"
			>
				<view class="search-top">
					<text class="name">{{item.name}}</text>
					<text class="search-distance">{{item.distance}}</text>
				</view>
				<text class="search-address">{{item.pname}}{{item.cityname}}{{item.adname}}{{item.address}}</text>
			</view>
		</view>
		<map id="map" class="map" style="width: 100%; height: 800rpx;" :latitude="latitude" :longitude="longitude" scale="20"
			:markers="covers" :enable-rotate="true"
			@tap="getTapPoint"
		></map>
		<view id="wx-map-container"></view>
		<view class="submit-address bg-color" @click="sendAddress">
			确定
		</view>
	</view>
</template>


<script>
	import AMap from '@/common/amap-wx.130.js'; 
	// let mapSearch = weex.requireModule('mapSearch')
	import http from '@/common/api/request.js'
	let map = null
	export default {
		data() {
			return {
				latitude: 0,
				longitude: 0,
				covers: [],
				coverId: 1,
				path_id: null,
				amapPlugin: null,  
				key: '9054f8e9a69bdbcad5df32cc01d46066',
				webKey: '4bff3f45361b3e51eed3b96365c8285c',
				addressName: '',
				mapContext: null,
				timer: null,
				searchPoint: [],
				isSearch: false
			}
		},
		onLoad(event) {
			this.path_id = event.path_id
			this.amapPlugin = new AMap.AMapWX({key: this.key});  
			this.mapContext = uni.createMapContext('map', this)
			const self = this
			uni.getLocation({
				type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				isHighAccuracy: true,
				success: function (res) {
					console.log(res)
					self.latitude = res.latitude;
					self.longitude = res.longitude;
					self.addMarker()
					self.myGetRegeo()
				}
			});
		},
		methods: {
			myGetRegeo() {  
				uni.showLoading({
					title: '获取信息中'  
				});  
				this.amapPlugin.getRegeo({  
					location: `${this.longitude},${this.latitude}`,
					success: (data) => {  
						console.log(data,data[0].name)
						// console.log('经纬度',this.latitude,this.longitude)
						this.addressName = data[0].name;  
						uni.hideLoading();  
						this.setCallout()
					},
					fail: (err) => {
						console.log('获取位置信息错误',err)
					}
				});  
			},
			// 修改定位的气泡
			setCallout() {
				// console.log(this.addressName)
				this.covers = this.covers.map(c => {
					if(c.id === 1) {
						return {
							...c,
							callout: {
								content: this.addressName,
								color: '#fff',
								bgColor: '#6099d9',
								borderRadius: 999,
								padding: '10rpx,20rpx',
								display: 'ALWAYS'
							}
						}
					}
					return c
				})
			},
			// 在地图上添加标注
			addMarker() {
				this.covers.push({
					id: this.coverId,
					latitude: this.latitude,
					longitude: this.longitude,
					// title: '当前位置',
					iconPath: '/static/imgs/address-icon.png',
					width: 30,
					height: 30
				})
				this.coverId++
			},
			// 点击时触发
			getTapPoint(event) {
				console.log('点击了',event)
				const { detail } = event
				this.updataPosition(detail.latitude,detail.longitude)
			},
			// 更新点坐标并移动
			updataPosition(lat,lng) {
				this.latitude = lat
				this.longitude = lng
				this.movePoint()
				this.myGetRegeo()
			},
			// 移动点
			movePoint() {
				this.mapContext.translateMarker({
					markerId: 1,
					destination: {
						latitude: this.latitude,
						longitude: this.longitude
					},
					duration: 500
				})
			},
			// 搜索列表点击时触发
			goPoint(position) {
				this.isSearch = false
				this.searchPoint = []
				position = position.split(',')
				const [lng,lat] = position
				this.updataPosition(lat,lng)
			},
			sendAddress() {
				uni.redirectTo({
					url:'/pages/addAddress/addAddress?address=' + this.addressName + '&id=' + this.path_id
				})
			},
			// 搜索
			search(event) {
				if(this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					if(event.target.value.trim() === '') {
						this.isSearch = false
						uni.showToast({
							title:'输入为空',
							icon:'none'
						})
					}else {
						this.isSearch = true
						this.amapPlugin.getPoiAround({
							location: `${this.longitude},${this.latitude}`,
							key: this.webKey,	
							querykeywords: event.target.value.trim(),
							success: (res) => {
								console.log('搜索',res)
								this.searchPoint = res.poisData.map(d => ({
									...d,
									distance: parseInt(d.distance)/1000 + 'km'
								}))
								if(this.searchPoint.length === 0) {
									uni.showToast({
										title:'您周边暂无此地点',
										icon:'none'
									})
								}
							},
							fail: (err) => {
								console.log('搜索错误',err)
							}
						})
					}
				},500)
			}
		}
	}
</script>

<style scoped>
.wx-map {
	overflow: hidden;
	position: relative;
}
.address-inp {
	display: block;
	outline: none;
	border: 2rpx solid #ddd;
	width: 650rpx;
	box-sizing: border-box;
	padding-left: 30rpx;
	margin: 20rpx auto;
	height: 80rpx;
	border-radius: 999px;
}
.submit-address {
	width: 500rpx;
	margin: 0 auto;
	margin-top: 50rpx;
	text-align: center;
	border-radius: 999px;
	color: #fff;
	padding: 20rpx 0;
}

.search-list {
	position: absolute;
	left: 0;
	width: calc(100% - 50rpx);
	padding-left: 50rpx;
	top: 120rpx;
	background-color: #fff;
	max-height: 600rpx;
	overflow: auto;
	z-index: 99;
}
.search-item {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx 10rpx 20rpx 0;
}
.search-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: baseline;
}
.name {
	width: 500rpx;
	display: inline-block;
	font-size: 34rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.search-distance {
	font-size: 24rpx;
	color: #8f8f8f;
}
.search-address {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 24rpx;
	color: #8f8f8f;
}
</style>
