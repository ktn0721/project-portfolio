<template>
  <div class="cesium-container" ref="cesiumContainer">
    <button @click="ding" class="control">定位</button>
    <button class="control s" @click="boundary_control1">视频</button>
    <button @click="boundary_control2" class="control b">统计</button>
    <button @click="boundary_control3" class="control h">数据</button>
    <button @click="boundary_control4" class="control e">测量</button>
    <page v-show="boundary1" :viewer="viewer" :lists="lists" :lists2="lists2"/>
    <statistics v-show="boundary2" :viewer="viewer" ref="statistics"/>
    <add v-show="boundary3" :viewer="viewer" :lists="lists" @derail-updated="derailupdate"/>
    <!-- <handle/> -->
    <survey v-show="boundary4" :viewer="viewer"/>
  </div>
</template>


<script>
// import * as Cesium from 'cesium/Cesium'
// import CreateFrustum from './static/frustum'
import LoadData from './static/loaddata'
import page from './components/page.vue'
import Statistics from './components/statistics.vue'
import add from './components/add.vue'
// import handle from './components/handle.vue'
import survey from './components/survey.vue'
export default {
  name: 'HelloWorld',
  components:{
    page,
    Statistics,
    add,
    // handle,
    survey,
  },
  data() {
    return {
      viewer: null,
      loadDataInstance: null,
      boundary1: false,
      boundary2: false,
      boundary3: false,
      boundary4: false,
      lists: [],
      lists2: [],
    }
  },
  methods: {
    ding() {
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(104.064246602633, 30.60047228675553, 4000.0)
      });
    },
    boundary_control1(){
      if(!this.boundary1){
        this.boundary1 = true
        this.boundary2 = false
        this.boundary3 = false
        this.boundary4 = false
      }else{
        this.boundary1 = false
      }
    },
    boundary_control2(){
      if(!this.boundary2){
        this.boundary2 = true
        this.boundary1 = false
        this.boundary3 = false
        this.boundary4 = false
      }else{
        this.boundary2 = false
      }
    },
    boundary_control3(){
      if(!this.boundary3){
        this.boundary3 = true
        this.boundary1 = false
        this.boundary2 = false
        this.boundary4 = false
      }else{
        this.boundary3 = false
      }
    },
    boundary_control4(){
      if(!this.boundary4){
        this.boundary4 = true
        this.boundary1 = false
        this.boundary2 = false
        this.boundary3 = false
      }else{
        this.boundary4 = false
      }
    },

    //显示坐标
    displayCoordinates() {
      this.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
        let pick = this.viewer.scene.pickPosition(clickEvent.position);
        let pickModel = this.viewer.scene.pick(clickEvent.position);
        if (pickModel && pick && !pickModel.id) {                            //模型经纬度
          let height = Cesium.Cartographic.fromCartesian(pick).height;
          let lat = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).latitude);
          let lng = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).longitude);
          let cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, height);
          console.log("经度", lng, "纬度", lat, "高度(米)", height)
          this.lists = [];
          this.lists.push(lng, lat, height);
        } else {                                                                //地形经纬度
          let ray1 = this.viewer.camera.getPickRay(clickEvent.position);
          let cartesian = this.viewer.scene.globe.pick(ray1, this.viewer.scene);
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let lng_1 = Cesium.Math.toDegrees(cartographic.longitude);//经度
          let lat_1 = Cesium.Math.toDegrees(cartographic.latitude);//纬度
          console.log("经度", lng_1, "纬度", lat_1, "高度(米)", cartographic.height);
          this.lists = [];
          this.lists.push(lng_1, lat_1, cartographic.height);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
        let pick = this.viewer.scene.pickPosition(clickEvent.position);
        let pickModel = this.viewer.scene.pick(clickEvent.position);
        if (pickModel && pick && !pickModel.id) {                            //模型经纬度
          let height = Cesium.Cartographic.fromCartesian(pick).height;
          let lat = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).latitude);
          let lng = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).longitude);
          let cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, height);
          // console.log("经度", lng, "纬度", lat, "高度(米)", height)
          this.lists2 = [];
          this.lists2.push(lng, lat, height);
        } else {                                                                //地形经纬度
          let ray1 = this.viewer.camera.getPickRay(clickEvent.position);
          let cartesian = this.viewer.scene.globe.pick(ray1, this.viewer.scene);
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let lng_1 = Cesium.Math.toDegrees(cartographic.longitude);//经度
          let lat_1 = Cesium.Math.toDegrees(cartographic.latitude);//纬度
          // console.log("经度", lng_1, "纬度", lat_1, "高度(米)", cartographic.height);
          this.lists2 = [];
          this.lists2.push(lng_1, lat_1, cartographic.height);
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },



    // createPopupDescription(properties) {
    //   let description = "";
    //   for (const key in properties) {
    //     if (properties.hasOwnProperty(key)) {
    //       description += `<b>${key}:</b> ${properties[key]}<br>`;
    //     }
    //   }
    //   return description;
    // },




    test() {
      // 创建视点
      let origin = Cesium.Cartesian3.fromDegrees(104.06577585298956, 30.57873587051702, 535);
      this.createPoint(origin);

      // 创建XYZ局部坐标轴
      this.createFrame(origin);

      // 视角定位
      // viewer.camera.flyTo({
      //     destination: origin,
      // });

      // 确定相对于视点的旋转矩阵
      let enu = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
      let rotation = Cesium.Matrix3.getRotation(enu, new Cesium.Matrix3());
      let orientation = Cesium.Quaternion.fromRotationMatrix(rotation);


    },

    // 创建视点
    createPoint(p) {
      return this.viewer.entities.add({
        position: p,
        point: {
          pixelSize: 10,
          color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        },
      });
    },

    // 创建坐标系
    createFrame(p) {
      // X轴：红色，Y轴：绿色，Z轴：蓝色
      let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(p);
      this.viewer.scene.primitives.add(
        new Cesium.DebugModelMatrixPrimitive({
          modelMatrix: modelMatrix,
          length: 30000.0,
          width: 3.0,
        })
      );
    },

    derailupdate(updatedData) {
      this.childData = updatedData;
      this.$refs.statistics.renew()
    }
  },
  mounted() {
    //注册的token有问题
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDEyNmJhNi1jYTZmLTRiZjMtYWNhZi0zNDZmNjQwODk4NmYiLCJpZCI6MTIwNzYzLCJpYXQiOjE2NzMyNjgzNTh9.SFLKh4nIsrEotCvFblvXYobAOuvFNIEarSlF3T2SXrA'

    const worldTerrain = Cesium.createWorldTerrain({
      requestWaterMask: true, // 添加水面波浪效果
      requestVertexNormals: true // 添加地形光照
    })

    // 初始化Cesium Viewer实例
    this.viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
      //地形
      terrainProvider: worldTerrain

      //地形2
      // terrainProvider: new Cesium.CesiumTerrainProvider({
      //   url: Cesium.IonResource.fromAssetId(1)
      // }),
      // homeButton: false,
      // sceneModePicker: false,
      // baseLayerPicker: false, // 影像切换
      // animation: false, // 是否显示动画控件
      // infoBox: false, // 是否显示点击要素之后显示的信息
      // selectionIndicator: false, // 要素选中框
      // geocoder: false, // 是否显示地名查找控件
      // timeline: false, // 是否显示时间线控件
      // fullscreenButton: false,
      // shouldAnimate: false,
      // navigationHelpButton: true // 是否显示帮助信息控件
    })
    this.viewer.scene.debugShowFramesPerSecond = true; //调试。显示每秒的帧数和帧之间的时间。FPS
    this.viewer.scene.globe.enableLighting = false
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    window.viewer = this.viewer
    // // 添加默认图层
    // const imageryProvider = this.$Cesium.createWorldImagery()
    // viewer.imageryLayers.addImageryProvider(imageryProvider)

    // // 设置相机视角
    // viewer.camera.flyTo({
    //   destination: this.$Cesium.Cartesian3.fromDegrees(116.3974, 39.9092, 15000000.0)
    // })



      //显示坐标
    this.displayCoordinates()
      


    //创建视锥体
    // console.log(CreateFrustum)
    // 创建CreateFrustum实例，传入Cesium Viewer和视锥体的属性
    // this.frustumInstance = new CreateFrustum({
    //   viewer: this.viewer,
    //   position: Cesium.Cartesian3.fromDegrees(104.14893580238383, 30.679328793337657, 474.95640893980163), // 视锥体位置
    //   orientation: Cesium.Transforms.headingPitchRollQuaternion(
    //     Cesium.Cartesian3.fromDegrees(104.14893580238383, 30.679328793337657, 474.95640893980163),
    //     new Cesium.HeadingPitchRoll(0, Cesium.Math.toRadians(0), 0)
    //   ),
    //   fov: 30, // 视锥体视场角
    //   near: 475.95640893980163, // 视锥体近面距离
    //   far: 476.95640893980163, // 视锥体远面距离
    //   aspectRatio: 1.5, // 视锥体宽高比
    // });
    // 调用update方法更新视锥体的位置和姿态
    // this.frustumInstance.update(newPosition, newOrientation);


    //载入模型
    this.loadDataInstance = new LoadData({
      viewer:this.viewer,
    });
    this.loadDataInstance.Load3DTile({
      url:'http://localhost:7788/Data/TianFu/tileset.json'
    });



    // this.test()
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cesium-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
}
.control{
  position: fixed;
  width: 50px;
  top: 3%;
  left: 2%;
  background-color: rgba(255,255,255,0.3);
  z-index: 100;
  text-align: center;
}
.s{
  left: 8%;
}
.b{
  left: 14%;
}

.h{
  left: 20%;
}

.e{
  left: 26%;
}
</style>


