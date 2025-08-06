
export default class LoadData {
  constructor(arg) {
    this.viewer = arg.viewer;
    this.dataList = {};
  }
  //D:/study_home/CesiumData/ChengduBuilding/tileset.json
  Load3DTile(option) {
    var $this = this;
    let url = option.url;
    let offset  = option.offset || {x:0, y:0, z:0}
    let thisTileset = new Cesium.Cesium3DTileset({
      url: url,
      //控制切片视角显示的数量，可调整性能
      maximumNumberOfLoadedTiles: 5,
      maximumScreenSpaceError: option.maximumScreenSpaceError || 16, //默认值16 用于提高细节细化级别的最大屏幕空间错误
      // skipLevelOfDetail : true,
      // baseScreenSpaceError : 1024,
      // skipScreenSpaceErrorFactor : 16,
      // skipLevels : 1,
      // immediatelyLoadDesiredLevelOfDetail : false,
      // loadSiblings : false,
      // cullWithChildrenBounds : true,
      // dynamicScreenSpaceError : true,
      // dynamicScreenSpaceErrorDensity : 0.00278,
      // dynamicScreenSpaceErrorFactor : 4.0,
      // dynamicScreenSpaceErrorHeightFalloff : 0.25,
      // maximumScreenSpaceError: 256,
      // maximumNumberOfLoadedTiles: 20000,
      //clampToGround: true,
      //debugColorizeTiles : true //随机颜色
    });
    $this.viewer.scene.primitives.add(thisTileset);
    thisTileset.readyPromise.then(function (palaceTileset) {
      console.log("加载完成");
      console.log(palaceTileset);

      //模型中心坐标
      const boundingSphere = palaceTileset.boundingSphere;
      const cartographic = Cesium.Cartographic.fromCartesian(
        boundingSphere.center
      );
      console.log(boundingSphere, cartographic, boundingSphere.center);
      //获取3dtile中心，添加局部坐标系
      //模型位置偏移
       
      //平移 --写死
      // cartographic.height = 14
      // var position1 = Cesium.Cartographic.toCartesian(cartographic)
      // position1.x += 54.5
      // position1.y += 5
      // var m = Cesium.Transforms.eastNorthUpToFixedFrame(position1);
      //平移 --传参
      console.log("传参检查，",offset.x || 0,offset.y || 0,offset.z || 0);
      cartographic.height += offset.z || 0
      let position1 = Cesium.Cartographic.toCartesian(cartographic)
      position1.x += offset.x || 0
      position1.y += offset.y || 0
      let m = Cesium.Transforms.eastNorthUpToFixedFrame(position1);
      //旋转
      // var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
      // var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
      // var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(24))
      // var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      // var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      // var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
      //旋转、平移矩阵相乘
      // Cesium.Matrix4.multiply(m, rotationX, m);
      // Cesium.Matrix4.multiply(m, rotationY, m);
      // Cesium.Matrix4.multiply(m, rotationZ, m);

      // thisTileset._root.transform = m;

      $this.flyTo(thisTileset)
    });
  }
  flyTo(thisTileset){
    this.viewer.flyTo(thisTileset, {
      offset: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90),
        range: 0,
      },
    });
  }
}
