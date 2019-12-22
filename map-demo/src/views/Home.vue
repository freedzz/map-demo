<template>
	<div class="home">
		<div class="container" id="amapContainer"></div>
		<div class="input-area">
			<div class="input-item" v-if="!seachPath">
				<input type="text" v-model="search_val" placeholder="查找地点/公交/地铁">
				<i class="fa fa-search"></i>
			</div>
			<div class="input-item" v-if="seachPath">
				<input type="text" v-model="search_val" placeholder="输入起点">
				<i class="fa fa-search"></i>
			</div>
			<div class="input-item" v-if="seachPath">
				<input type="text" v-model="search_val" placeholder="输入终点">
				<i class="fa fa-search"></i>
			</div>
			<div class="selectWay">
				<ul>
					<li @click="seachPath = true">
						<img src="../../public/img/gongjiaoche.png">
						<span class="text">公交车</span>
					</li>
					<li>
						<img src="../../public/img/jiache.png">
						<span class="text">驾车</span>
					</li>
					<li>
						<img src="../../public/img/buhang.png">
						<span class="text">步行</span>
					</li>
				</ul>
			</div>
			<div class="search-text" v-if="isEmpty">
				<ul>
					<li v-for="(item,index) in areaList" :key="item.index" @click="setMarker(item)">
						<i class="fa fa-map-marker" aria-hidden="true"></i> {{item.name}} <span class="text">{{item.district + item.address}}</span>
					</li>
				</ul>
			</div>
		</div>
		
		
	</div>
</template>

<script>
	import { lazyAMapApiLoaderInstance } from 'vue-amap';
	// @ is an alias to /src
	import HelloWorld from '@/components/HelloWorld.vue'

	export default {
		name: 'home',
		components: {
			HelloWorld
		},
		data() {
			return {
				map:Object,
				search_val: "",
				areaList:[],
				isEmpty:false,
				seachPath:false
			}
		},
		watch: {
			/* 监听用户是否输入信息 */
			search_val() {
				this.isEmpty = true
				this.searchPlace();
			}
		},
		methods: {
			getMap() {
				lazyAMapApiLoaderInstance.load().then(() => {
					const isThis = this
					 this.map = new AMap.Map('amapContainer', {
						zoom:[3,18],
						zoom:10
					});
					
					// 同时引入工具条插件，比例尺插件和鹰眼插件
					AMap.plugin([
					    'AMap.ToolBar',
					    'AMap.Scale',
					    'AMap.OverView',
					    // 'AMap.MapType',
					    'AMap.Geolocation',
					], function(){
					    // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
					    isThis.map.addControl(new AMap.ToolBar({
							locate:false,
							direction:false,
							autoPosition:true,
							offset: new AMap.Pixel(10, 60),
							position: 'LT'
						}));
					    // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
					    isThis.map.addControl(new AMap.Scale());
					    // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
					    // isThis.map.addControl(new AMap.OverView({isOpen:true}));
					    // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
					    isThis.map.addControl(new AMap.MapType());
					    // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
					    isThis.map.addControl(new AMap.Geolocation({
							// 是否使用高精度定位，默认：true
							enableHighAccuracy: true,
							// 设置定位超时时间，默认：无穷大
							timeout: 10000,
							// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
							buttonOffset: new AMap.Pixel(17, 18),
							//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
							zoomToAccuracy: true,     
							//  定位按钮的排放位置,  RB表示右下
							buttonPosition: 'LT'
						}))
					});
					
					
					
				});
			},
			searchPlace() {
				const self = this;

				//使用高德地图的api
				AMap.plugin("AMap.Autocomplete", function() {
					self.map.addControl(new AMap.Autocomplete());
					// 实例化Autocomplete
					var autoOptions = {
						//city 限定城市，默认全国
						// city: self.city
					};
					var autoComplete = new AMap.Autocomplete(autoOptions);
					autoComplete.search(self.search_val, function(status, result) {
						// 搜索成功时，result即是对应的匹配数据
						 console.log(result);
						self.areaList = result.tips;
					});
				});
			},
			setMarker(item){
				// 创建一个 Marker 实例
				if(item.location){
					var marker = new AMap.Marker({
						position: new AMap.LngLat(item.location.lng, item.location.lat),
						title: item.name,
						zoomToAccuracy: true, 
					});
					this.map.add(marker);
					this.map.setFitView();
					this.search_val = ""
				}
				
				
			}
		},
		created() {
			this.getMap();
		}
	}
</script>
<style scoped>
	html,
	body {
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
	}
	ul,li{
		padding: 0;
		margin: 0;
		list-style-type: none;
	}
	.home{
		width: 100%;
		height: 100%;
		/* position: relative; */
	}
	.container {
		width: 100%;
		height: 500px;
	}
	.input-area{
		z-index: 999;
		position: absolute;
		top:10px;
		right:100px;
		width: auto;
		height: auto;
	}
	.selectWay ul{
		display: flex;
		background: white;
		padding:  0 10px;
		padding-bottom: 10px;
	} 
	.selectWay ul li{
		width: 70px;
		height: auto;
		border: 1px solid #F1F1F1;
		padding: 5px 0;
	}
	.selectWay ul li:hover{
		cursor: pointer;
	}
	.selectWay ul li img{
		width: 25px;
		height: 25px;
		margin-left: 20px;
	}
	.selectWay ul li span{
		display: block;
		font:14px/16px "microsoft sans serif";
		text-align: center;
		width: 100%;
		height: auto;
	}
	.search-text{
		position: absolute;
		width: auto;
		height: auto;
	}
	.input-item{
		width: auto;
		height: auto;
		background: white;
		padding: 10px;
		position: relative;
	}
	.input-item input{
		padding-left: 25px;
		outline-style: none ;
		border: 0px;
		font: 16px/26px "microsoft sans serif";
		border:1px solid #F1EFEE;
		border-radius: 5px;
	}
	.input-item i{
		position: absolute;
		left: 15px;
		top:16px
	}
	.input-item input:focus{
	    border-color: #66afe9;
	    outline: 0;
	    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
	    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
	}
	.search-text ul{
		font-size: 0px;
		background-color: white;
		padding: 10px;
		border: 1px solid #F1F1F1;
		padding-top: 0;
	}
	.search-text ul li{
		font: 14px/16px "microsoft sans serif";
		padding: 5px 0;
		padding-left: 10px;
		background: white;
		border-top: 1px solid #F1F1F1;
	}
	.search-text ul li:hover{
		cursor: pointer;
	}
	.search-text ul li .text{
		font: 12px/14px "microsoft sans serif";
		color: #F1EFEE;
	}
</style>
