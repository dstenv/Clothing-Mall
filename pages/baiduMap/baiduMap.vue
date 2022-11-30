<template>
	<view class="mapPage">
		<input v-model="searchText" type="text" placeholder="请输入搜索地址" class="search" @input="searchAddress">
		<view class="address-list" v-show="isSearch">
			<view class="list-item"
				v-for="(item,index) in addressList" :key="index"
				@tap="getLatLngByAddress(item.address)"
			>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view v-if="system == 'ios' && this.systemHeight == 0" id="myMapditu" class="map"></view>
		<map v-if="system === 'android'" style="width: 100%; height: 400px;" id="gaodemap" :latitude="latitude" :longitude="longitude" :markers="markers"></map>
		<view class="submit-address bg-color" @click="sendAddress">
			确定
		</view>
	</view>
</template>

<script>
	import {mymap} from '@/common/map.js'
	var bmap = null
	export default {
		data() {
			return {
				ak: '5rXsow7CemWRLSPVdzgdnslItkTSy2fC',
				lat: 0,
				lng: 0,
				address: '',
				searchText: '',
				timer: null,
				addressList: [],
				isSearch: false,
				latitude: 23.58546,
				longitude: 113.509446,
				markers: [],
				system: '',
				systemHeight: 0,
				_mapContext: null,
				path_id: null
			}
		},
		onLoad(event) {
			this.path_id = event.path_id
		},
		onReady() {
			const res = uni.getSystemInfoSync()
			console.log('123',res.platform,res.statusBarHeight)
			this.system = res.platform
			this.systemHeight = res.statusBarHeight
			if(this.system === 'ios') {
				if(this.systemHeight == 0) {
					// 是web浏览器
					this.webMap()
				}else {
					// 是苹果手机
				}
			}else {
				// 是安卓手机
				this.androidMap()
			}
		},
		onBackPress(event) {
			console.log(event,'百度')
			this.sendAddress()
		},
		methods: {
			// web创建地图
			webMap() {
				mymap(this.ak).then( (BaiDumap) => {
					// 创建百度地图实例
					bmap = new BMapGL.Map("myMapditu");
					// console.log(bmap)
					let geolocation = new BMapGL.Geolocation();
					const self = this
					geolocation.getCurrentPosition(function(r) {
						if (this.getStatus() == BMAP_STATUS_SUCCESS) {
							var mk = new BMapGL.Marker(r.point);
							bmap.addOverlay(mk);
							bmap.panTo(r.point);
							self.lat = r.point.lat
							self.lng = r.point.lng
							console.log(self.lat, self.lng)
							let point = new BMapGL.Point(self.lng,self.lat);
							console.log(point)
							self.getAddress(point)
							
							// //添加谷歌marker和label
							// var markergg = new BMapGL.Marker(point);
							// bmap.addOverlay(markergg); //添加谷歌marker
							// //坐标转换完之后的回调函数
							// let translateCallback = function (data){
							// 	console.log(data);
							// 	if(data.status === 0) {
							// 		var marker = new BMapGL.Marker(data.points[0]);
							// 		bmap.addOverlay(marker);
							// 		// bmap.setCenter(data.points[0]);
							// 		bmap.centerAndZoom(data.points[0], 20);// 设置缩放级别
							// 		bmap.enableScrollWheelZoom(true);
							// 		bmap.setHeading(-20);
							// 		bmap.setTilt(45);
							// 	}
							// }
							// setTimeout(function(){
							// 	var convertor = new BMapGL.Convertor();
							// 	var pointArr = [];
							// 	pointArr.push(point);
							// 	convertor.translate(pointArr, COORDINATES_GCJ02, COORDINATES_BD09, translateCallback)
							// }, 1000);
							
							bmap.centerAndZoom(point, 20);// 设置缩放级别
							bmap.enableScrollWheelZoom(true);
							bmap.setHeading(-20);
							bmap.setTilt(45);
							
							
							bmap.addEventListener('click',(event) => {
								// console.log(event)
								let clickPoint = event.latlng
								console.log(clickPoint)
								let new_point = new BMapGL.Point(clickPoint.lng,clickPoint.lat)
								self.movePoint(new_point)
								// bmap.clearOverlays() // 清除之前的标注
								// let new_point = new BMapGL.Point(clickPoint.lng,clickPoint.lat)
								// let marker = new BMapGL.Marker(new_point) // 设置标注
								// bmap.addOverlay(marker) // 添加标注到地图
								// bmap.panTo(new_point) // 移动点
								// bmap.setHeading(-20);
								// bmap.setTilt(45);
								self.getAddress(clickPoint)
								
								
							})
						} 
					});
					
				});
			},
			// uniapp自带高德地图
			androidMap() {
				// 定位到美国 暂没解决 先用三级联动代替
				// console.log(uni.getAppAuthorizeSetting())
				// uni.getLocation({
				// 	success: (res) => {
				// 		console.log(res)
				// 	}
				// })
				
			},
			// 地址逆解析
			getAddress(clickPoint) {
				let geoc = new BMapGL.Geocoder();
				// console.log(geoc)
				const self = this
				geoc.getLocation(clickPoint, function(rs){
					let addComp = rs.addressComponents;
					self.address = `${addComp.province} ${addComp.city} ${addComp.district} ${addComp.street} ${addComp.streetNumber}`
					console.log(self.address)
					self.createWIndow(self.address,clickPoint)
				})
			},
			// 创建窗口
			createWIndow(address,point) {
				console.log('window')
				let options = {
					width: 200,
					height: 60,
					title: '地址'
				}
				let infoWindow = new BMapGL.InfoWindow(`${address}`,options)
				bmap.openInfoWindow(infoWindow,point)
			},
			// 移动地图上的点
			movePoint(newPoint){
				bmap.clearOverlays() // 清除之前的标注
				let marker = new BMapGL.Marker(newPoint) // 设置标注
				bmap.addOverlay(marker) // 添加标注到地图
				bmap.panTo(newPoint) // 移动点
				bmap.setHeading(-20);
				bmap.setTilt(45);
			},
			// 地址解析成经纬度
			getLatLngByAddress(address) {
				this.isSearch = false
				// console.log(address)
				//创建地址解析器实例
				var myGeo = new BMapGL.Geocoder()
				const self = this
				// 将地址解析结果显示在地图上，并调整地图视野
				myGeo.getPoint(address, function(point){
					if(point){
						// console.log(point)
						let new_point = new BMapGL.Point(point.lng,point.lat)
						self.movePoint(new_point)
						
						self.createWIndow(address,new_point)
					}
				})
			},
			sendAddress() {
				uni.redirectTo({
					url:'/pages/addAddress/addAddress?address=' + this.address + '&id=' + this.path_id
				})
			},
			searchAddress(){
				if(this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					this.isSearch = true
					let options = {
						onSearchComplete: (results) => {
							// 判断状态是否正确
							if (local.getStatus() == BMAP_STATUS_SUCCESS){
								console.log('搜索成功')
								this.addressList = []
								for (var i = 0; i < results.getCurrentNumPois(); i ++){
									this.addressList.push({
										name: results.getPoi(i).title,
										address: results.getPoi(i).address
									});
								}
								console.log(this.addressList)
							}
						}
					}
					let local = new BMapGL.LocalSearch(bmap,options)
					local.search(this.searchText)
				},500)
			}
		}
	}
</script>


<style scoped>
.map {
	width: 100%;
	height: 800rpx;
}
.search {
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-bottom: 2rpx solid #ddd;
}
.mapPage {
	position: relative;
}
.address-list {
	position: absolute;
	top: 88rpx;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	padding-left: 20rpx;
	z-index: 100;
	background-color: #fff;
	max-height: 600rpx;
	overflow: auto;
}
.list-item {
	padding: 20rpx 0;
	
}
.list-item text {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
</style>
