<template>
    <div class="statistics">
        <div>
            <input type="text" placeholder="region:geojson or shp" v-model="url1" class="loadgeo">
            <button class="loadgeo2" @click="fn">区域</button>
            <button class="loadgeo2" @click="fn2">删除</button>
        </div>
        <div>
            <input type="text" placeholder="article:geojson or shp" v-model="url2" class="loadgeo">
            <button class="loadgeo2" @click="fn3">点位</button>
            <button class="loadgeo2" @click="fn4">密度</button>
            <button class="loadgeo2" @click="fn5">模型</button>
            <button class="loadgeo2" @click="fn6">柱状图</button>
        </div>
        <div class="reveal">
            <div class="geo1" v-show="content1">
                <ul>
                    <li v-for="item in lists" :key="item">{{ item }}</li>
                </ul>
            </div>
            <div class="geo2" v-show="content1">
                <ul>
                    <li v-for="item in areas" :key="item">面积为:{{ item }}m²</li>
                </ul>
            </div>
            <div class="geo3" v-show="content2">
                <ul>
                    <li v-for="item in lists2" :key="item">具有{{ item }}棵银杏树</li>
                </ul>
            </div>
            <div class="geo4" v-show="content2">
                <ul>
                    <li v-for="item in ratios" :key="item">约占面积{{ item }}%</li>
                </ul>
            </div>
        </div>
        <div class="reveal2" v-show="content3">
            <button class="loadgeo2" @click="fn7">关闭</button>
            <div id="cylinder1"></div>
            <div id="cylinder2"></div>
        </div>
    </div>
</template>

<script>
import * as shapefile from '../../public/shapefile/dist/shapefile'
import * as turf from '@turf/turf'
export default {
    props: [
        'viewer',
    ],
    data() {
        return {
            url1: 'http://localhost:7788/Data/cd_geojson.json',
            // url1: 'http://localhost:7788/Data/cd_shp/data.shp',
            // url2: 'http://localhost:7788/Data/dian.json',
            url2: 'http://localhost:3000/trees',
            content1: false,
            content2: false,
            content3: false,
            lists: [],
            positions1: [],
            positions2: [],
            areas: [],
            lists2:[],
            ratios:[],
        }
    },
    methods: {
        loadgeo(url) {
            // let promise = new Cesium.GeoJsonDataSource.load(url);
            // promise.then(datasource => {

            //     this.viewer.dataSources.add(datasource);
            //     console.log(datasource)
            //     datasource.entities.values.forEach(entity => {
            //         // console.log(entity);
            //         let name = entity.properties.name._value;
            //         // entity.name = name;
            //         entity.polygon.outlineColor = Cesium.Color.RED.withAlpha(1);
            //         entity.polygon.material = Cesium.Color.YELLOWGREEN.withAlpha(0.2);
            //         entity.polygon.height = 1000;
            //         entity.label = {
            //             text: name, // 使用 Entity 的名称作为 label 的文本内容
            //             font: '140px sans-serif', // 设置 label 文本的字体和大小
            //         };
            //         // entity.polygon.extrudedHeight = 1000;
            //         // entity.polygon.clampToGround = true;
            //         this.lists.push(name)
            //        console.log(entity);
            //     })
            //     // this.msg = info
            //     // viewer.zoomTo(datasource)
            //     // console.log(this.lists)
            // })

            fetch(url).then(res => res.json())
                .then((res) => {
                    console.log(res);
                    res.features.forEach(async (element, index) => {
                        console.log(index, element);
                        // console.log('3123123',element.geometry.coordinates[0])

                        if (element.geometry.type == "Polygon") {
                            let position = this.coordinatesToCartesain(element.geometry.coordinates[0])
                            // this.positions1.push(element.geometry.coordinates[0])
                            // position.forEach(element_2 => {
                            // console.log(element_2.x,element_2.y);
                            // })
                            console.log("加载前", new Cesium.PolygonHierarchy(position));
                            this.viewer.entities.add({
                                polygon: {
                                    hierarchy: new Cesium.PolygonHierarchy(position),
                                    clampToGround: true,
                                    // height: 1000,
                                    show: true,
                                    fill: true,
                                    material: Cesium.Color.fromRandom({
                                        minimumRed: 0.0,
                                        minimumGreen: 0.0,
                                        minimumBlue: 0.0,
                                        maximumRed: 1.0,
                                        maximumGreen: 1.0,
                                        maximumBlue: 1.0,
                                        // alpha: 0.5
                                    }).withAlpha(0.2),
                                    width: 3,
                                    outlineColor: Cesium.Color.RED,
                                    outlineWidth: 30,
                                    outline: true,
                                    label: {
                                        text: element.properties.name,
                                        font: '24px sans-serif',
                                    }
                                },
                                id: element.id,
                                name: element.properties.name
                            })
                            console.log(element.id,);
                            console.log("加载后", element.properties.name);
                            // await new Promise(resolve => setTimeout(() => {
                            // 
                            // }, 5));
                            this.positions1.push(element.geometry.coordinates[0])
                            this.lists.push(element.properties.name)

                        } else if (element.geometry.type == "MultiPolygon") {
                            let entities = new Cesium.EntityCollection()
                            this.viewer.entities.add(entities)
                            console.log(element.geometry.coordinates);
                            element.geometry.coordinates.forEach((cor, index) => {
                                let position = this.coordinatesToCartesain(cor[0])
                                this.positions1.push(cor[0])
                                this.viewer.entities.add({
                                    polygon: {
                                        hierarchy: new Cesium.PolygonHierarchy(position),
                                        // hierarchy: position,
                                        clampToGround: true,
                                        // height: 1000,
                                        show: true,
                                        fill: true,
                                        material: Cesium.Color.fromRandom({
                                            minimumRed: 0.0,
                                            minimumGreen: 0.0,
                                            minimumBlue: 0.0,
                                            maximumRed: 1.0,
                                            maximumGreen: 1.0,
                                            maximumBlue: 1.0,
                                            // alpha: 0.5
                                        }).withAlpha(0.2),
                                        width: 30,
                                        outlineColor: Cesium.Color.RED,
                                        outlineWidth: 30,
                                        outline: true,
                                    },
                                    id: element.id + "_" + index,
                                    name: element.properties.name
                                })
                            })
                            this.lists.push(element.properties.name+'1')
                            this.lists.push(element.properties.name+'2')
                        }
                    });
                    console.log(this.viewer.entities);
                    this.area()
                })
        },

        coordinatesToCartesain(Arr) {
            //数组
            let newArr = []
            Arr.forEach(ele => {
                newArr.push(ele[0], ele[1])
            })
            return Cesium.Cartesian3.fromDegreesArray(newArr)
        },

        loadshp() {
            let VectorTileImageryProvider = Cesium.VectorTileImageryProvider;
            // let imageryProviderViewModels = this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
            // this.viewer.baseLayerPicker.viewModel.selectedImagery = imageryProviderViewModels[imageryProviderViewModels.length - 1];
            let $this = this;

            let worldLayer = null;
            let worldProvider = new VectorTileImageryProvider({
                source: "http://localhost:7788/Data/cd_shp/data.shp",
                defaultStyle: {
                    outlineColor: "#02a9ff",
                    lineWidth: 1,
                    fill: false,
                    tileCacheSize: 200,
                    showMaker: false,
                    showCenterLabel: true,
                    fontColor: "#02a9ff",
                    labelOffsetX: -10,
                    labelOffsetY: -5,
                    fontSize: 13,
                    fontFamily: "黑体",
                    centerLabelPropertyName: "NAME"
                },
                maximumLevel: 20,
                minimumLevel: 1,
                simplify: false
            });
            worldProvider.readyPromise.then(function () {
                worldLayer = $this.viewer.imageryLayers.addImageryProvider(worldProvider);
            });

            // let provinceLayer = null;
            //   let provinceProvider = new VectorTileImageryProvider({
            //       source: 'http://localhost:7788/Data/cd_geojson.json',
            //       defaultStyle: {
            //           outlineColor: "rgb(255,255,255)",
            //           lineWidth: 2,
            //           fill: false,
            //           tileCacheSize: 200
            //       },
            //       maximumLevel: 20,
            //       minimumLevel: 1,
            //       simplify: false
            //   });
            //   provinceProvider.readyPromise.then(function () {
            //       provinceLayer = this.viewer.imageryLayers.addImageryProvider(provinceProvider);
            //   });



        },

        createAndLoad(shpData, dbfData, options) {
            const $this = this;
            let myFeatures = [];
            shapefile
                .open(shpData, dbfData, options)
                .then((source) =>
                    source.read().then(function log(result) {
                        if (result.done) {
                            let _mGeoJson = {
                                type: "FeatureCollection",
                                features: myFeatures,
                            };
                            console.log(_mGeoJson)
                            // let layer = $this.viewer.dataSources.add(
                            //     Cesium.GeoJsonDataSource.load(_mGeoJson, {
                            //         clampToGround: false,
                            //         stroke: Cesium.Color.fromCssColorString("#02a9ff"), //new Cesium.Color(0/255, 0/255, 0/255, 0),
                            //         fill: new Cesium.Color(222 / 255, 216 / 255, 192 / 255, 0.3),
                            //     })
                            // );
                            $this.loadgeo(_mGeoJson)
                            return;
                        } else {
                            let _result = result.value;
                            let _curFeature = {
                                type: _result.type,
                                geometry: {
                                    type: _result.geometry.type,
                                    coordinates: _result.geometry.coordinates,
                                },
                                properties: _result.properties,
                            };
                            myFeatures.push(_curFeature);
                            return source.read().then(log);
                        }
                    })
                )
                .catch((error) => console.error(error.stack));
        },

        area() {
            for (let i = 0; i < this.positions1.length; i++) {
                let polygon = turf.polygon([this.positions1[i]])
                this.areas.push(turf.area(polygon))
            }
        },

        loadpoints(url) {
            fetch(url).then(res => res.json())
                .then((res) => {
                    console.log(res);
                    // res.features.forEach(async (element, index) => {
                    res.forEach(async (element, index) => {
                        console.log(index, element);
                        // console.log('3123123',element.geometry.coordinates[0])

                        if (element.geometry.type == "Point") {
                            this.positions2.push([element.geometry.coordinates,element.id])
                        }
                    })
                })
        },

        isOverlap() {
            for (let j = 0; j < this.positions1.length; j++) {
                let k = 0
                for (let i = 0; i < this.positions2.length; i++) {
                    let pt = turf.point(this.positions2[i][0]);
                    let poly = turf.polygon([this.positions1[j]]);
                    if (turf.booleanPointInPolygon(pt, poly)) {
                        k++
                    } 
                }
                this.lists2.push(k)
            }
            console.log(this.lists2)
            for(let i=0;i<this.positions1.length;i++){
                let item =Math.floor((this.lists2[i]*1000/this.areas[i])*1000)/1000*100
                this.ratios.push(item)
            }
            console.log(this.ratios)
        },

        createcylinder1() {
            let areas = []
            for(let i=0;i<this.areas.length;i++){
                areas.push(Math.floor(this.areas[i]/10000))
            }
            let myChart = echarts.init(document.getElementById('cylinder1'),null,{width:1200,height:295})
            let option = {

                title: {
                    text: '成都市各区县'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' }
                },
                legend: {},
                xAxis: {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: this.lists
                },
                yAxis: {
                    type: 'value',
                    name: '面积',
                    min: 0,
                    max: 120000,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} 万m²'
                    }
                },
                series: [
                    {
                        name: '面积',
                        type: 'bar',
                        color:['rgb(48, 207, 90)'],
                        yAxisIndex: 0,
                        data: areas,
                        label: {
                            show: true,
                            position: 'top' 
                        },
                        animationDelay: function (idx) {
                            return idx * 100; 
                        }
                    }
                ],
                animationEasing: 'elasticOut', 
                animationDuration: 1500 
            };
            myChart.setOption(option);
        },

        createcylinder2() {
            let myChart = echarts.init(document.getElementById('cylinder2'),null,{width:1200,height:295});
            let option = {
                title: {
                    text: '银杏树'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' }
                },
                legend: {},
                xAxis: {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: this.lists
                },
                yAxis: [
                {
                    type: 'value',
                    name: '棵数',
                    min: 0,
                    max: 1700,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                },
                {
                    type: 'value',
                    name: '各区域占比',
                    min: 0,
                    max: 2,
                    position: 'right',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
                ],
                series: [
                    {
                        name: '棵数',
                        type: 'bar',
                        color:['rgb(157, 57, 159)'],
                        yAxisIndex: 0,
                        data: this.lists2,
                        label: {
                            show: true,
                            position: 'top' 
                        },
                        animationDelay: function (idx) {
                            return idx * 100; 
                        }
                    },
                    {
                        name: '各区域占比',
                        type: 'line',
                        color:['rgb(233, 228, 93)'],
                        yAxisIndex: 1,
                        data: this.ratios,
                        label: {
                            show: true,
                            position: 'right' 
                        },
                        animationDelay: function (idx) {
                            return idx * 100; 
                        }
                    }
                ],
                animationEasing: 'quadraticOut', 
                animationDuration: 1000 
            };
            myChart.setOption(option);
        },

        fn() {
            if(!this.content1){
                this.content1 = true
            }
            this.lists = []
            this.positions1 = []
            this.areas = []
            // console.log(this.url.split('').slice(-3).join(''))
            if (this.url1.split('').slice(-4).join('') == 'json') {
                this.loadgeo(this.url1)
                console.log("执行完毕");
            } else if (this.url1.split('').slice(-3).join('') == 'shp') {
                const urlArr = this.url1.split('.shp')
                const dbfUrl = urlArr[0] + '.dbf'
                this.createAndLoad(this.url1, dbfUrl, { encoding: "utf-8" });
            } else {
                alert('输入的数据类型错误')
            }
        },

        fn2() {
            this.viewer.entities.removeAll();
            this.content1 = false;
            this.content2 = false
            this.content3 = false
        },

        fn3(){
            this.positions2 = []
            this.loadpoints(this.url2)
        },

        fn4(){
            if(this.content2 == false){
                this.content2 = true
            }
            this.lists2 = []
            this.ratios = []
            this.isOverlap()
            this.red2()
        },

        fn5() {
            let $this = this
            for (let i = 0; i < this.positions2.length; i++) {
                let longitude = this.positions2[i][0][0]
                let latitude = this.positions2[i][0][1]
                let height = null
                let id = this.positions2[i][1]
                let position = Cesium.Cartographic.fromDegrees(longitude, latitude)
                // let position = Cesium.Cartographic.fromDegrees(104.07964175342093, 30.577081631148726)
                let promise = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, [position]).then(function (updatedPositions) {
                    height = updatedPositions[0].height;
                    let positions = Cesium.Cartesian3.fromDegrees(longitude, latitude,height)
                    let entity = $this.viewer.entities.add({
                        position:positions,
                        model:{
                            uri:'http://localhost:7788/Data/tree.gltf',
                            scale:1,
                        },
                        label: {
                            text: String(id), 
                            font: '1px sans-serif',
                            pixelOffset: new Cesium.Cartesian2(10, 10), 
                        }
                    })
                })

                // const vehicleEntity = viewer.entities.add({
                // position: position,
                // orientation: new Cesium.VelocityOrientationProperty(position),
                // model: {
                //     uri: "./GLTF/dairy_van.glb",
                //     scale: 0.5,
                // },
                // })
                // 将经纬度坐标转换为屏幕坐标
            }
        },

        fn6(){
            if(!this.content3){
                this.content3 = true
            }
            this.createcylinder1()
            this.createcylinder2()
        },

        fn7(){
            if(this.content3){
                this.content3 = false
            }
        },

        renew() {
            this.fn2()
            this.fn()
            this.fn3()
            setTimeout(() => {
                this.fn4()
                this.fn5()
            }, 1000); 
        },

        // 创建热力图
        createHeatMap(max, data) {
            // 创建元素
            let heatDoc = document.createElement("div");
            heatDoc.setAttribute("style", "width:1000px;height:1000px;margin: 0px;display: none;");
            document.body.appendChild(heatDoc);
            // 创建热力图对象
            let heatmap = h337.create({
                container: heatDoc,
                radius: 20,
                maxOpacity: .5,
                minOpacity: 0,
                blur: .75,
                gradient: {
                    '0.9': 'red',
                    '0.8': 'orange',
                    '0.7': 'yellow',
                    '0.5': 'blue',
                    '0.3': 'green',
                },
            });
            // 添加数据
            heatmap.setData({
                max: max,
                data: data
            });
            return heatmap;
        },

        // 创建正方形 绑定热力图 
        createRectangle(viewer, coordinate, heatMap) {
            viewer.entities.add({
                name: 'Rotating rectangle with rotating texture coordinate',
                show: true,
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(coordinate[0], coordinate[1], coordinate[2], coordinate[3]),
                    material: heatMap._renderer.canvas // 核心语句，填充热力图
                }
            });
        },

        // 生成len个随机数据
        getData(len) {
            //构建一些随机数据点
            let points = [];
            let max = 0;
            let width = 1000;
            let height = 1000;
            while (len--) {
                let val = Math.floor(Math.random() * 1000);
                max = Math.max(max, val);
                let point = {
                    x: Math.floor(Math.random() * width),
                    y: Math.floor(Math.random() * height),
                    value: val
                };
                points.push(point);
            }
            console.log(max)
            console.log(points)
            return { max: max, data: points }
        },

        getData2(){
            let $this = this
            let points = [];
            let max = 0;
            for (let i = 0; i < this.positions2.length; i++) {
                let longitude = this.positions2[i][0][0]
                let latitude = this.positions2[i][0][1]
                let position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
                let screenPosition = new Cesium.Cartesian2();
                let success = Cesium.SceneTransforms.wgs84ToWindowCoordinates($this.viewer.scene, position, screenPosition);
                let val = Math.floor(Math.random() * 100);
                max = Math.max(max, val);
                let point = {
                    x: longitude,
                    y: latitude,
                    value: val
                };
                points.push(point);
            }
            console.log(max,points)
            return { max: max, data: points }
        },

        red1() {
            let $this = this
            let coordinate3 = [-180 , -90, 180 , 90];
            let heatMap3 = this.createHeatMap(this.getData2().max, this.getData2().data);
            // let heatMap3 = this.createHeatMap(this.getData(10).max, this.getData(10).data);
            this.createRectangle($this.viewer, coordinate3, heatMap3);
        },

        red2() {
            // let szPoint = [
            //     {
            //         "x": 120.668435,
            //         "y": 31.374082,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.686138,
            //         "y": 31.383773,
            //         "value": 57
            //     },
            //     {
            //         "x": 120.688073,
            //         "y": 31.388262,
            //         "value": 58
            //     },
            //     {
            //         "x": 120.697757,
            //         "y": 31.392517,
            //         "value": 60
            //     },
            //     {
            //         "x": 120.700801,
            //         "y": 31.393463,
            //         "value": 53
            //     },
            //     {
            //         "x": 120.705782,
            //         "y": 31.396772,
            //         "value": 7
            //     },
            //     {
            //         "x": 120.710763,
            //         "y": 31.398663,
            //         "value": 37
            //     },
            //     {
            //         "x": 120.714361,
            //         "y": 31.392283,
            //         "value": 13
            //     },
            //     {
            //         "x": 120.707998,
            //         "y": 31.378816,
            //         "value": 19
            //     },
            //     {
            //         "x": 120.706128,
            //         "y": 31.377039,
            //         "value": 83
            //     },
            //     {
            //         "x": 120.706959,
            //         "y": 31.373496,
            //         "value": 30
            //     },
            //     {
            //         "x": 120.706889,
            //         "y": 31.371754,
            //         "value": 88
            //     },
            //     {
            //         "x": 120.711039,
            //         "y": 31.364196,
            //         "value": 36
            //     },
            //     {
            //         "x": 120.714082,
            //         "y": 31.36396,
            //         "value": 26
            //     },
            //     {
            //         "x": 120.717402,
            //         "y": 31.362543,
            //         "value": 9
            //     },
            //     {
            //         "x": 120.722658,
            //         "y": 31.359944,
            //         "value": 83
            //     },
            //     {
            //         "x": 120.732062,
            //         "y": 31.354984,
            //         "value": 69
            //     },
            //     {
            //         "x": 120.738148,
            //         "y": 31.352385,
            //         "value": 46
            //     },
            //     {
            //         "x": 120.741742,
            //         "y": 31.346243,
            //         "value": 49
            //     },
            //     {
            //         "x": 120.743677,
            //         "y": 31.337739,
            //         "value": 11
            //     },
            //     {
            //         "x": 120.75446,
            //         "y": 31.316947,
            //         "value": 9
            //     },
            //     {
            //         "x": 120.754183,
            //         "y": 31.316239,
            //         "value": 61
            //     },
            //     {
            //         "x": 120.75916,
            //         "y": 31.306721,
            //         "value": 2
            //     },
            //     {
            //         "x": 120.759989,
            //         "y": 31.297031,
            //         "value": 72
            //     },
            //     {
            //         "x": 120.75031,
            //         "y": 31.2968,
            //         "value": 98
            //     },
            //     {
            //         "x": 120.729571,
            //         "y": 31.297987,
            //         "value": 48
            //     },
            //     {
            //         "x": 120.714641,
            //         "y": 31.303423,
            //         "value": 10
            //     },
            //     {
            //         "x": 120.713257,
            //         "y": 31.309094,
            //         "value": 18
            //     },
            //     {
            //         "x": 120.726805,
            //         "y": 31.314291,
            //         "value": 15
            //     },
            //     {
            //         "x": 120.714915,
            //         "y": 31.319253,
            //         "value": 9
            //     },
            //     {
            //         "x": 120.702482,
            //         "y": 31.327047,
            //         "value": 80
            //     },
            //     {
            //         "x": 120.701097,
            //         "y": 31.338858,
            //         "value": 77
            //     },
            //     {
            //         "x": 120.707635,
            //         "y": 31.34932,
            //         "value": 65
            //     },
            //     {
            //         "x": 120.713997,
            //         "y": 31.335148,
            //         "value": 72
            //     },
            //     {
            //         "x": 120.713445,
            //         "y": 31.326645,
            //         "value": 17
            //     },
            //     {
            //         "x": 120.700175,
            //         "y": 31.314833,
            //         "value": 95
            //     },
            //     {
            //         "x": 120.688565,
            //         "y": 31.308925,
            //         "value": 56
            //     },
            //     {
            //         "x": 120.681381,
            //         "y": 31.298291,
            //         "value": 70
            //     },
            //     {
            //         "x": 120.682487,
            //         "y": 31.297347,
            //         "value": 96
            //     },
            //     {
            //         "x": 120.712897,
            //         "y": 31.290264,
            //         "value": 5
            //     },
            //     {
            //         "x": 120.718426,
            //         "y": 31.2905,
            //         "value": 91
            //     },
            //     {
            //         "x": 120.729761,
            //         "y": 31.296642,
            //         "value": 38
            //     },
            //     {
            //         "x": 120.743585,
            //         "y": 31.297348,
            //         "value": 19
            //     },
            //     {
            //         "x": 120.744692,
            //         "y": 31.300183,
            //         "value": 32
            //     },
            //     {
            //         "x": 120.745521,
            //         "y": 31.301836,
            //         "value": 79
            //     },
            //     {
            //         "x": 120.748299,
            //         "y": 31.306119,
            //         "value": 64
            //     },
            //     {
            //         "x": 120.748853,
            //         "y": 31.308481,
            //         "value": 56
            //     },
            //     {
            //         "x": 120.74913,
            //         "y": 31.31297,
            //         "value": 30
            //     },
            //     {
            //         "x": 120.74111,
            //         "y": 31.315335,
            //         "value": 79
            //     },
            //     {
            //         "x": 120.72839,
            //         "y": 31.317463,
            //         "value": 26
            //     },
            //     {
            //         "x": 120.726454,
            //         "y": 31.319353,
            //         "value": 99
            //     },
            //     {
            //         "x": 120.714287,
            //         "y": 31.325494,
            //         "value": 32
            //     },
            //     {
            //         "x": 120.71401,
            //         "y": 31.325731,
            //         "value": 92
            //     },
            //     {
            //         "x": 120.738015,
            //         "y": 31.32767,
            //         "value": 82
            //     },
            //     {
            //         "x": 120.744185,
            //         "y": 31.317248,
            //         "value": 3
            //     },
            //     {
            //         "x": 120.725062,
            //         "y": 31.307079,
            //         "value": 65
            //     },
            //     {
            //         "x": 120.710421,
            //         "y": 31.308218,
            //         "value": 68
            //     },
            //     {
            //         "x": 120.710104,
            //         "y": 31.299549,
            //         "value": 59
            //     },
            //     {
            //         "x": 120.717484,
            //         "y": 31.29713,
            //         "value": 32
            //     },
            //     {
            //         "x": 120.722824,
            //         "y": 31.296944,
            //         "value": 73
            //     },
            //     {
            //         "x": 120.723274,
            //         "y": 31.290495,
            //         "value": 58
            //     },
            //     {
            //         "x": 120.727456,
            //         "y": 31.287032,
            //         "value": 28
            //     },
            //     {
            //         "x": 120.69478,
            //         "y": 31.283772,
            //         "value": 60
            //     },
            //     {
            //         "x": 120.676413,
            //         "y": 31.283046,
            //         "value": 77
            //     },
            //     {
            //         "x": 120.675549,
            //         "y": 31.282865,
            //         "value": 31
            //     },
            //     {
            //         "x": 120.680282,
            //         "y": 31.276796,
            //         "value": 4
            //     },
            //     {
            //         "x": 120.698247,
            //         "y": 31.273269,
            //         "value": 34
            //     },
            //     {
            //         "x": 120.723374,
            //         "y": 31.272218,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.736585,
            //         "y": 31.275035,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.745777,
            //         "y": 31.279471,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.751088,
            //         "y": 31.282693,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.757373,
            //         "y": 31.287752,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.758732,
            //         "y": 31.30273,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.758945,
            //         "y": 31.316499,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.761492,
            //         "y": 31.344917,
            //         "value": 3
            //     },
            //     {
            //         "x": 120.76694,
            //         "y": 31.382806,
            //         "value": 83
            //     },
            //     {
            //         "x": 120.76589,
            //         "y": 31.387562,
            //         "value": 35
            //     },
            //     {
            //         "x": 120.758214,
            //         "y": 31.394899,
            //         "value": 91
            //     },
            //     {
            //         "x": 120.730968,
            //         "y": 31.403159,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.711442,
            //         "y": 31.404812,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.690595,
            //         "y": 31.401832,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.679832,
            //         "y": 31.393932,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.670814,
            //         "y": 31.381412,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.672233,
            //         "y": 31.368546,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.673351,
            //         "y": 31.353035,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.684359,
            //         "y": 31.372061,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.695252,
            //         "y": 31.368108,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.690044,
            //         "y": 31.355587,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.689004,
            //         "y": 31.347558,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.689228,
            //         "y": 31.34297,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.690055,
            //         "y": 31.335568,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.691422,
            //         "y": 31.335963,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.697691,
            //         "y": 31.342086,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.704069,
            //         "y": 31.347567,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.705733,
            //         "y": 31.346608,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.706342,
            //         "y": 31.342177,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.703215,
            //         "y": 31.334653,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.697903,
            //         "y": 31.338251,
            //         "value": 100
            //     },
            //     {
            //         "x": 120.697903,
            //         "y": 31.338251,
            //         "value": 83
            //     },
            //     {
            //         "x": 120.702118,
            //         "y": 31.306084,
            //         "value": 91
            //     }
            // ]
            //苏州矩形坐标
            // let bounds = {
            //     west: 120.65290308330879,
            //     south: 31.273633917763892,
            //     east: 120.79146729222676,
            //     north: 31.410010681404547
            // };
            let bounds = {
                west: 103.67744698150172,
                south: 30.246879187737154,
                east: 104.53494175342868,
                north: 30.94762789631494
            };
            let heatMap = CesiumHeatmap.create(
                window.viewer, // 视图层
                bounds, // 矩形坐标
                { // heatmap相应参数
                    backgroundColor: "rgba(0,0,0,0)",
                    radius: 1,
                    maxOpacity: .5,
                    minOpacity: 0,
                    blur: .75,
                    gradient: {
                        0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "red", 1.0: "rgb(255,0,0)"
                    }
                }
            );

            heatMap.setWGS84Data(0, 100, this.getData2().data);
            viewer.camera.flyTo({ destination: Cesium.Rectangle.fromDegrees(103.67744698150172, 30.246879187737154, 104.53494175342868, 30.94762789631494) });
        },
    },

    mounted() {
        // let pt = turf.point([-77, 44]);
        // let poly = turf.polygon([[
        //     [104.0662956112571 , 30.555575397283686], // 注意：polygon首尾坐标要一致
        //     [104.06628142789289, 30.555733798538416],
        //     [104.06651077190358 , 30.555729049320245],
        //     [104.06651109987837 , 30.55558109272213],
        //     [104.0662956112571 , 30.555575397283686]
        // ]]);
        // alert(turf.area(poly))
        // turf.booleanPointInPolygon(pt, poly);
    },

}
</script>

<style scoped>
.statistics {
    width: 80%;
    height: 80%;
    background-color: white;
    position: fixed;
    z-index: 100;
    top: 10%;
    left: 10%;
}

.reveal2 {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0%;
    background-color: white;
}

#cylinder1{
    position: relative;
    width: 96%;
    height: 45%;
    left: 2%;
    top: 2%;
    margin-bottom: 10px;
    background-color: white;
}

#cylinder2{
    position: relative;
    width: 96%;
    height: 45%;
    left: 2%;
    top: 2%;
    background-color: white;
}

.loadgeo {
    width: 260px;
    margin: 20px 0 0 20px;
    text-align: center;
}

.loadgeo2 {
    width: 45px;
    margin-left: 20px;
}

.reveal {
    position: relative;
    width: 96%;
    height: 84%;
    left: 2%;
    top: 2%;
    /* background-color: black; */
    display: flex;
    justify-content: start;
    /* justify-content: space-between; */
    overflow: auto;
}

.geo1 {
    background-color: rgb(161, 239, 157);
    width: 20%;
    height: 500px;
    margin: 0 20px 0 0;
}

.geo2 {
    width: 28%;
    height: 500px;
    background-color: aqua;
    margin: 0 20px 0 0;
}

.geo3 {
    width: 17%;
    height: 500px;
    background-color: rgb(214, 125, 173);
    margin: 0 20px 0 0;
}

.geo4 {
    width: 28%;
    height: 500px;
    background-color: rgb(208, 214, 125);
}

.geo1 li {
    margin: 10px 0;
    list-style: none;
}

.geo2 li {
    margin: 10px 0;
    list-style: none;
}

.geo3 li {
    margin: 10px 0;
    list-style: none;
}

.geo4 li {
    margin: 10px 0;
    list-style: none;
}
</style>