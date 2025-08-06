/**
 * Author:dxs
 * date:2023-05-25
 * 依赖于Cesium.JS 0.96
 */
class changeFrustum{
  constructor(options){
    //是否更新geometry标签
    this.isUpdate = false //是否出发update更新
    this.created = true//初始化
    this.changeFrustum_show = options.changeFrustum_show || true
    //具体参数
    this.viewer = options.viewer
    this.startPosition = options.startPosition//视锥体起点
    this.fov = options.fov || 60; //视场角
    this.near = options.near || 0.01; //近截面距离
    this.far = options.far || 1000; //远截面距离
    this.aspectRatio = options.aspectRatio || 0.5; //纵横比  高度/宽度 默认1/2
    this.hpr = { }
    if (options.hpr.pitch==undefined) {
      this.hpr.pitch = Cesium.Math.PI_OVER_TWO
    }else{
      this.hpr.pitch = options.hpr.pitch
    }
    if (!options.hpr.heading==undefined) {
      this.hpr.heading = 0
    }else{
      this.hpr.heading = options.hpr.heading
    }
    if (!options.hpr.roll==undefined) {
      this.hpr.roll = 0
    }else{
      this.hpr.roll = options.hpr.roll
    }
    this.farPlanePoints = [new Cesium.Cartesian3(0,1,0),new Cesium.Cartesian3(1,0,1),new Cesium.Cartesian3(0,0,1),new Cesium.Cartesian3(0,1,1)]
  }

}
changeFrustum.prototype.getGeometry = function () {
  let frustumGeometry = new Cesium.PerspectiveFrustum({
    // 查看的视场角度，绕Z轴旋转，以弧度方式输入
    // fov: Cesium.Math.toRadians(this.fov),
    fov: this.fov,
    // 视锥体的宽度/高度
    aspectRatio: this.aspectRatio,
    // 近面距视点的距离
    near: this.near,
    // 远面距视点的距离
    far: this.far,
  });
  console.log();
  let quaternion = Cesium.Transforms.headingPitchRollQuaternion(
    this.startPosition, // 当前点为原点
    new Cesium.HeadingPitchRoll(
      this.hpr.heading, 
      this.hpr.pitch, 
      this.hpr.roll)
  );
  // this.orientation = quaternion
  let geometry = new Cesium.FrustumOutlineGeometry({
    frustum: frustumGeometry,
    origin: this.startPosition,
    orientation: quaternion,
    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
  });
  let frustumOutlineGeometry = Cesium.FrustumOutlineGeometry.createGeometry(geometry);
  let positions = frustumOutlineGeometry.attributes.position.values;
  this.farPlanePoints[0] = new Cesium.Cartesian3(positions[12], positions[13], positions[14]) //右下
  this.farPlanePoints[1] = new Cesium.Cartesian3(positions[15], positions[16], positions[17]) //右上
  this.farPlanePoints[2] = new Cesium.Cartesian3(positions[18], positions[19], positions[20]) //左上
  this.farPlanePoints[3] = new Cesium.Cartesian3(positions[21], positions[22], positions[23]) //左下
  // this.farPlanePoints[0] = new Cesium.Cartesian3(positions[0], positions[1], positions[2]) //右下
  // this.farPlanePoints[1] = new Cesium.Cartesian3(positions[3], positions[4], positions[5]) //右上
  // this.farPlanePoints[2] = new Cesium.Cartesian3(positions[12], positions[13], positions[14]) //左上
  // this.farPlanePoints[3] = new Cesium.Cartesian3(positions[15], positions[16], positions[17]) //左下
  // this.farPlanePoints[0] = new Cesium.Cartesian3(positions[6], positions[7], positions[8]) //右下
  // this.farPlanePoints[1] = new Cesium.Cartesian3(positions[9], positions[10], positions[11]) //右上
  // this.farPlanePoints[2] = new Cesium.Cartesian3(positions[18], positions[19], positions[20]) //左上
  // this.farPlanePoints[3] = new Cesium.Cartesian3(positions[21], positions[22], positions[23]) //左下
  return frustumOutlineGeometry
}
changeFrustum.prototype.update = function (context, frameState, commandList) {
  if (this.created || this.isUpdate) {
    //console.log("isUpdate || iscreated");
    if (this._primitive) {
      this._primitive.destroy()
    }
    let geometry = this.getGeometry()
    let instance = new Cesium.GeometryInstance({
      geometry: geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          new Cesium.Color(1.0, 1.0, 0.0, 1.0)
        ),
      },
      show:this.changeFrustum_show,
    })
    this._primitive = new Cesium.Primitive({
      geometryInstances: instance,
      appearance: new Cesium.PerInstanceColorAppearance({
        closed: true,
        flat: true,
      }),
      asynchronous: false,
      releaseGeometryInstances: false,//图元构建成功后，不清理geometryInstances
      show:this.changeFrustum_show,
      // allowPicking: false, //是否可以被拾取
    });
    this.created = false
    this.isUpdate = false
    //console.log("end");
  }
  let primitive1 = this._primitive
  primitive1.update(context, frameState, commandList);
};

class videoPolygon{
  constructor(options){
    //是否更新geometry标签
    this.isUpdate = false //是否出发update更新
    this.created = true//初始化

    this.material = options.material || new Cesium.Color.RED //视频材质
    this.heading = options.heading || 0 //航向角，被stRotation所依赖
    this.stRotation = options.stRotation || 0//视频旋转角，根据heading计算
    this.isClampToGround = options.isClampToGround || 'true'//视频是否贴地，默认为是
    this.videoPolygonPositions = options.videoPolygonPositions || [new Cesium.Cartesian3(0,1,0),new Cesium.Cartesian3(1,0,1),new Cesium.Cartesian3(0,0,1),new Cesium.Cartesian3(0,1,1)]//视频四个点坐标

  }
}
videoPolygon.prototype.getGeometry = function () {
  //计算旋转角
  this.stRotation = this.heading
  // if ( this.stRotation < -2 * Cesium.Math.PI ) {
  //   this.stRotation = this.heading + 2 * Cesium.Math.PI 
  // }
  // console.log("this.stRotation",this.heading,this.stRotation);
  return new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(this.videoPolygonPositions),
    stRotation: this.stRotation,
    perPositionHeight: true
  });
}
videoPolygon.prototype.update = function (context, frameState, commandList) {
  if (this.created || this.isUpdate) {
    //console.log("isUpdate || iscreated");
    let geometry = this.getGeometry()
    if (this._primitive) {
      this._primitive.destroy()
    }
    if (this.isClampToGround === 'true') {
      //console.log("贴地");
      this._primitive = new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
        }),
        appearance: new Cesium.MaterialAppearance({
          material:this.material,
          closed:false
        }),
        classificationType: Cesium.ClassificationType.BOTH,
        show:true,
        asynchronous: false,
        releaseGeometryInstances: false,//图元构建成功后，不清理geometryInstances
        // allowPicking: false
      });
    }else{
      //console.log("butiedi");
      this._primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
        }),
        appearance: new Cesium.MaterialAppearance({
          material:this.material,
          closed:false
        }),
        show:true,
        asynchronous: false,
        releaseGeometryInstances: false,//图元构建成功后，不清理geometryInstances    
        // allowPicking: false   
      })
    }
    this.created = false
    this.isUpdate = false
  }
  let primitive = this._primitive
  primitive.update(context, frameState, commandList);
};

export class videoFrustum {
  constructor(options) {
    if (!options.viewer) throw new Error("Not found Cesium.viewer!");
    this.viewer = options.viewer; //必传
    this.startPosition = null; //摄像头位置
    this.startPosition_Degree = null; //摄像头位置 --经纬度
    /**
     * {longitude:x,latitude:y,height:z}
     */
    this.endPosition = null; //摄像头视线终点（射线中心）
    this.orientation = null; //初始化时默认射线方向（为方便动态调整，做记录）
    this.hpr = {}
    if (options.hpr) {
      if (options.hpr.pitch==undefined) {
        this.hpr.pitch = Cesium.Math.PI_OVER_TWO
      }else{
        this.hpr.pitch = Cesium.Math.toRadians(options.hpr.pitch)
      }
      if (!options.hpr.heading==undefined) {
        this.hpr.heading = 0
      }else{
        this.hpr.heading = Cesium.Math.toRadians(options.hpr.heading)
      }
      if (!options.hpr.roll==undefined) {
        this.hpr.roll = 0
      }else{
        this.hpr.roll = Cesium.Math.toRadians(options.hpr.roll)
      }
      console.log(this.hpr);
      // this.hpr = {
      //   heading:options.hpr.heading==undefined?Cesium.Math.toRadians(options.hpr.heading):0,
      //   pitch:options.hpr.pitch==undefined?Cesium.Math.toRadians(options.hpr.pitch):Cesium.Math.PI_OVER_TWO,
      //   // pitch:options.hpr.pitch==undefined?Cesium.Math.toRadians(options.hpr.pitch):2,
      //   roll:options.hpr.roll==undefined?Cesium.Math.toRadians(options.hpr.roll):0,
      // }
      console.log(this.hpr.pitch);
    }else{
      console.log("走默认");
      this.hpr = {
        heading:0,
        pitch:180,
        roll:0,
      }
    }
    this.fov = options.fov || 60; //视场角
    this.near = options.near || 0.01; //近截面距离
    this.far = options.far || 1000; //远截面距离
    this.aspectRatio = options.aspectRatio || 0.5; //纵横比  高度/宽度 默认1/2
    this.videoMaterial = options.material || Cesium.Color.RED//投影材质
    this.material = null //shader材质
    this.isClampToGround = options.isClampToGround || 'true'//是否贴地
    this.stRotation = null //投影材质的旋转方向
    this.videoPolygonPositions = []; //投影面的四个点坐标--投影贴地
    this.videoPolygonPositions_origin = []; //投影面的四个点坐标--原始
    this.VideoId = Number(new Date().getTime() + "" + Number(Math.random() * 1000).toFixed(0));
    this.frustumLineId = this.VideoId + 1;
    this.farPlanePoints = [0,0,0,0]//初始化
    this.frustumLine = null; //视锥体线框    

    this.frustumGeometryInstance = null
    this.videoGeometryInstance = null

    this.tipLable = null; //提示框
    this.tipPosition = null;
    this.tipText = "请选择相机位置！";
    this.clickPositions = [];

    this.originFrame = null; //初始化加载后的默认Frame
    this.originHpr = null;
    this.itemPositonMatrix = null

    this.primitiveCollection = new Cesium.PrimitiveCollection()
    this.viewer.scene.primitives.add(this.primitiveCollection);

    this.changeFrustum = null
    this.changeVideo = null
    this.changeFrustum_show = true
  }

  createByHandler() {
    var $this = this;
    return new Promise((resolve, reject) => {
      $this.get2PositionByHandler().then(() => {
        $this.orientation = $this.#getQuaFromPointsTest($this.startPosition, $this.endPosition);
        $this.#createFrustumLine(); //创建frustum
        resolve();
      });
    });
  }

  /**
   * 
   * @param {*} startPosition [longitude, latitude, height]||[x,y,z]
   * @param {*} type 默认-degree 经纬度坐标||cartographic 弧度坐标||cartesian 世界坐标
   * @returns 
   */
  createByPosition(startPosition,type){
    if (!startPosition instanceof Array) {
      throw new TypeError("startPosition 必须是数组")
    }else if (startPosition.length < 2) {
      throw new Error("startPosition长度必须大于等于2")
    }
    var $this = this
    return new Promise((resolve, reject) => {
      if (!startPosition || startPosition=="") {
        reject({msg:"起点不能为空"})
      }else{
        if (type == "cartseian") {
          $this.startPosition = startPosition
          $this.startPosition_Degree = $this.#degreesFromCartesian(new Cesium.Cesium.Cartesian3(startPosition[0], startPosition[1] , startPosition.length >= 3? startPosition[2]:0 ))
        }else if (type == "cartographic") {
          $this.startPosition = Cesium.Cartographic.toCartesian(startPosition)
          $this.startPosition_Degree = this.#degreesFromCartographic(new Cesium.Cartographic(startPosition[0], startPosition[1] , startPosition.length >= 3? startPosition[2]:0 ))
        }else{
          $this.startPosition = $this.#degreesToCartesian({longitude: startPosition[0], latitude: startPosition[1], height: startPosition.length >= 3? startPosition[2]:0})
          $this.startPosition_Degree = {longitude: startPosition[0], latitude: startPosition[1], height: startPosition.length >= 3? startPosition[2]:0}
        }
        $this.#createFrustumLine(); //创建frustum
        resolve({
          videoId:$this.VideoId,
          frustumLineId:$this.frustumLineId,
          fov: this.fov,
          near: this.near,
          far: this.far,
          aspectRatio: this.aspectRatio,
        })
      }
    })
  }

  //byhandler使用
  //根据鼠标事件获取摄像头起点和终点this.startPosition  this.endPosition
  get2PositionByHandler() {
    var $this = this;
    let handler = get_Handler($this.viewer);
    return new Promise((resolve, reject) => {
      handler.setInputAction(function (evt) {
        //单机开始绘制
        let cartesian = $this.#getCatesian3FromPX(evt.position);
        if ($this.clickPositions.length == 0) {
          $this.clickPositions.push(cartesian.clone());
          $this.startPosition = cartesian.clone();
          //startPosition_degree
        } else if ($this.clickPositions.length == 2) {
          if (Cesium.defined($this.tipLable)) {
            $this.viewer.entities.remove($this.tipLable);
          }
          $this.clickPositions.pop();
          $this.clickPositions.push(cartesian);
          $this.endPosition = cartesian.clone();
          handler.destroy();
          HandlerArr.pop();
          resolve();
        }
        $this.clickPositions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(function (evt) {
        let cartesian = $this.#getCatesian3FromPX(evt.endPosition);
        $this.tipPosition = cartesian;
        //创建lable
        if (!Cesium.defined($this.tipLable)) {
          $this.tipLable = $this.viewer.entities.add({
            position: new Cesium.CallbackProperty(() => {
              return $this.tipPosition;
            }, false), // 位置
            label: {
              text: new Cesium.CallbackProperty(() => {
                return $this.tipText;
              }, false), // 位置,
              font: "16px sans-serif", // 字体大小
              style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 字体样式
              fillColor: new Cesium.Color.fromCssColorString("#ff88ff"), // 字体填充色
              outlineWidth: 1, // 字体外圈线宽度（同样也有颜色可设置）
              outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直位置
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              pixelOffset: new Cesium.Cartesian2(0, 15), // 中心位置
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
          });
        } else if ($this.clickPositions.length > 0) {
          // //console.log("label", $this.tipLable);
          $this.clickPositions.pop();
          $this.clickPositions.push(cartesian);
          $this.tipText = "请选择摄像头方向点";
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    });
  }
  //创建frustum线框 + videoPloygon面
  #createFrustumLine() {
    console.log("传参测试：",this.hpr);
    var frustumChange = new changeFrustum({
      startPosition: this.startPosition,
      fov: this.fov,
      near: this.near,
      far: this.far,
      aspectRatio: this.aspectRatio,
      hpr:this.hpr,
      viewer:this.viewer,      
    })
    console.log(frustumChange);
    this.changeFrustum = this.viewer.scene.primitives.add(frustumChange)
    // 初始化-获取投影面四个点
    // console.log(this.startPosition, this.changeFrustum.farPlanePoints);
    let videoPolygonPoint_1 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[1])//右上
    let videoPolygonPoint_2 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[2])//左上
    let videoPolygonPoint_3 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[3])//左下角
    let videoPolygonPoint_0 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[0])//右下角
    this.videoPolygonPositions[0] = videoPolygonPoint_0
    this.videoPolygonPositions[3] = videoPolygonPoint_3
    this.videoPolygonPositions[1] = videoPolygonPoint_1
    this.videoPolygonPositions[2] = videoPolygonPoint_2
    var videochange = new videoPolygon({
      material: this.#getMaterial(),
      heading: this.hpr.heading,
      videoPolygonPositions: this.videoPolygonPositions,
      isClampToGround: this.isClampToGround
    })
    this.changeVideo = this.viewer.scene.primitives.add(videochange)
    this.#getVideoPositions()
    this.changeVideo.videoPolygonPositions = this.videoPolygonPositions
    this.changeVideo.isUpdate = true
  }
  // 绘制局部坐标系 传入原点坐标
  #createFrame(p) {
    //默认x 轴指向当地的东方向（右红）。 y 轴指向当地的北方向（上绿）。z 轴指向通过该位置的椭球面法线方向（蓝色）
    // X轴：红色，Y轴：绿色，Z轴：蓝色
    let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(p);
    this.viewer.scene.primitives.add(
      new Cesium.DebugModelMatrixPrimitive({
        modelMatrix: modelMatrix,
        length: 30000.0,
        width: 3.0,
      })
    );
  }
  // 绘制本地正北坐标系
  #createOriginFrame() {
    this.originFrame = Cesium.Transforms.headingPitchRollToFixedFrame(
      this.startPosition,
      this.originHpr,
      Cesium.Ellipsoid.WGS84,
      Cesium.Transforms.eastNorthUpToFixedFrame
      //默认x 轴指向当地的东方向（右红）。 y 轴指向当地的北方向（上绿）。z 轴指向通过该位置的椭球面法线方向（蓝色）
    );
    this.viewer.scene.primitives.add(
      new Cesium.DebugModelMatrixPrimitive({
        modelMatrix: this.originFrame,
        length: 30000.0,
        width: 3.0,
      })
    );
  }
  //创建点
  #createPoint(p) {
    return this.viewer.entities.add({
      position: p,
      point: {
        pixelSize: 20,
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
      },
    });
  }

  //获取点击坐标
  #getCatesian3FromPX(px) {
    let cartesian;
    let picks = this.viewer.scene.drillPick(px);
    this.viewer.render();
    let isOn3dtiles = true;
    for (let i = 0; i < picks.length; i++) {
      if (
        (picks[i] && picks[i].primitive) ||
        picks[i] instanceof Cesium.Cesium3DTileFeature
      ) {
        //模型上拾取
        isOn3dtiles = true;
      }
    }
    if (isOn3dtiles) {
      cartesian = this.viewer.scene.pickPosition(px);
    } else {
      let ray = this.viewer.camera.getPickRay(px);
      if (!ray) return null;
      cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    }
    return cartesian;
  }
  /**
   * {未使用}
   * 计算两个世界坐标的heading角度
   * 顺时针旋转为正角
   * @param {起点世界坐标} oldCartesian
   * @param {终点世界坐标} newCartesian
   */
  #getHeadingAngle(oldCartesian, newCartesian) {
    //以起点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
    let localToWorld_Matrix =
      Cesium.Transforms.eastNorthUpToFixedFrame(oldCartesian);
    //坐标向量
    const vector = Cesium.Cartesian3.subtract(
      newCartesian,
      oldCartesian,
      new Cesium.Cartesian3()
    );
    //方向向量
    let direction = Cesium.Matrix4.multiplyByPointAsVector(
      Cesium.Matrix4.inverse(localToWorld_Matrix, localToWorld_Matrix),
      vector,
      vector
    );
    Cesium.Cartesian3.normalize(direction, direction);
    //因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
    // return Cesium.Math.PI_OVER_TWO - Cesium.Math.acosClamped(direction.z);
    let newAngle = Cesium.Math.toDegrees(
      -1 * Math.atan2(direction.y, direction.x)
    );
    if (newAngle < 0) {
      newAngle = 360 + newAngle;
    }
    //console.log("新方法计算的heading角度", newAngle);
    return newAngle;
  }

  //每次更新时获取投影面四个点的坐标
  #getVideoPositions(){
    if (this.isClampToGround == "false") {
      this.videoPolygonPositions[0] = this.changeFrustum.farPlanePoints[0]
      this.videoPolygonPositions[3] = this.changeFrustum.farPlanePoints[3]
      this.videoPolygonPositions[1] = this.changeFrustum.farPlanePoints[1]
      this.videoPolygonPositions[2] = this.changeFrustum.farPlanePoints[2]
    }else{
      let videoPolygonPoint_1 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[1])//右上
      let videoPolygonPoint_2 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[2])//左上
      let videoPolygonPoint_3 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[3])//左下角
      let videoPolygonPoint_0 = this.#getPointFromRay(this.startPosition,this.changeFrustum.farPlanePoints[0])//右下角
      this.videoPolygonPositions[0] = videoPolygonPoint_0
      this.videoPolygonPositions[3] = videoPolygonPoint_3
      this.videoPolygonPositions[1] = videoPolygonPoint_1
      this.videoPolygonPositions[2] = videoPolygonPoint_2
    }
    
  }

  /**
   * 正在使用
   * 根据两个世界坐标 获取Quatation
   * 根据两点位置获取朝向的quatation
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  #getQuaFromPointsTest(a, b) {
    let m = this.#getModelMatrix(a, b);
    let hpr = this.#getHeadingPitchRoll(m);
    hpr.pitch = hpr.pitch + (Cesium.Math.PI * 3) / 2;
    // //console.log(
    //   "处理后的hpr",
    //   Cesium.Math.toDegrees(hpr.heading),
    //   Cesium.Math.toDegrees(hpr.pitch),
    //   Cesium.Math.toDegrees(hpr.roll),
    //   "heading初始度数",
    //   hpr.heading
    // );
    this.originHpr = hpr;
    this.hpr = hpr

    //新增
    this.hpr.heading = 0
    this.hpr.pitch = 90
    this.hpr.roll = 0
    return Cesium.Transforms.headingPitchRollQuaternion(a, hpr);
  }
  #getModelMatrix(a, b) {
    const vector2 = Cesium.Cartesian3.subtract(b, a, new Cesium.Cartesian3());
    //归一化
    const normal = Cesium.Cartesian3.normalize(
      vector2,
      new Cesium.Cartesian3()
    );
    const rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity( a,normal,Cesium.Ellipsoid.WGS84);
    const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation( rotationMatrix3, a);
    return modelMatrix4;
  }
  #getHeadingPitchRoll(m) {
    var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Matrix4.getTranslation(m, new Cesium.Cartesian3()),
      Cesium.Ellipsoid.WGS84,
      new Cesium.Matrix4()
    );
    var m3 = Cesium.Matrix4.multiply(
      Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
      m,
      new Cesium.Matrix4()
    );
    var mat3 = Cesium.Matrix4.getMatrix3(m3, new Cesium.Matrix3());
    var q = Cesium.Quaternion.fromRotationMatrix(mat3);
    let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
    // //console.log(
    //   "新的计算方法计算的hpr",
    //   Cesium.Math.toDegrees(hpr.heading),
    //   Cesium.Math.toDegrees(hpr.pitch),
    //   Cesium.Math.toDegrees(hpr.roll)
    // );
    return hpr;
  }

  //创建射线 获取射线与模型的交点
  //要求必须有3dtiles，否则不能融合
  #getPointFromRay(start, end){
    const direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(end, start, new Cesium.Cartesian3()),new Cesium.Cartesian3())
    const ray = new Cesium.Ray(start, direction)
    let intersection = null
    let result = this.viewer.scene.drillPickFromRay(ray)
    for (let i = 0; i < result.length; i++) {
      if (result[i].object && result[i].object.primitive.isCesium3DTileset) {
        intersection = result[i].position
        break
      }
    }
    if (!intersection) {
      intersection = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    }
    return intersection || end
  }

  //创建模型
  createModle(position, orientation){
    var $this = this
    $this.viewer.entities.add({
          position: position,
          orientation: orientation,
          model: {
            uri: "./Api_Modle/Air_Plane.glb",
            scale: 2.0,
            // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
  }

  #getMaterial(){
    let shaderSource = `
      uniform vec4 color_2;uniform vec2 repeat_1;uniform sampler2D image_0;czm_material czm_getMaterial(czm_materialInput materialInput)
      {
      
      czm_material material = czm_getDefaultMaterial(materialInput);
      float d = length(materialInput.st);
      float c = length(vec2(1.0,1.0))/2.0;
      material.diffuse = czm_gammaCorrect(texture2D(image_0, fract(repeat_1 * materialInput.st)).rgb * color_2.rgb);



      if((0.2<materialInput.st.s && materialInput.st.s<0.8) &&(0.015<materialInput.st.t && materialInput.st.t<0.47)) {
        material.alpha =color_2.a*(1.4 - length(materialInput.st - vec2(0.5,0.5))/.7071);
      }else{
        material.alpha = 0.0;
      }

      return material;
      }
      `
    let material = new Cesium.Material.fromType("Image")
    material.uniforms.image  = this.videoMaterial
    material.uniforms.color.alpha = 1.0
    material.shaderSource = shaderSource
    // material.shaderSource = videoShader
    this.material = material
    return this.material
  }

  /**
   * 更新参数（暂不添加旋转角）
   * @param {传入ID} options 
   */
  update(options){
    if (!options) return
    this.fov = options.fov || this.fov; //视场角
    this.near = options.near || this.near; //近截面距离
    this.far = options.far || this.far; //远截面距离
    this.aspectRatio = options.aspectRatio || this.aspectRatio; //纵横比  高度/宽度 默认1/2

    this.videoMaterial = options.material || this.videoMaterial//投影材质
    this.isClampToGround = options.isClampToGround || this.isClampToGround//是否贴地


    //更新value   
    if (options.material) {
      this.videoMaterial = options.material
      this.#getMaterial()
      this.changeVideo.material = this.material
    }
    if (options.longitude) {
      this.startPosition_Degree.longitude = options.longitude
    }
    if (options.latitude) {
      this.startPosition_Degree.latitude = options.latitude
    }
    if (options.height) {
      this.startPosition_Degree.height = options.height
    }
    this.startPosition = this.#degreesToCartesian(this.startPosition_Degree)
    this.changeFrustum.startPosition = options.startPosition || this.startPosition

    if (options.heading) {
      this.changeFrustum.hpr.heading = Cesium.Math.toRadians(options.heading)
      this.changeVideo.heading = Cesium.Math.toRadians(options.heading)
    }
    if (options.pitch) {
      this.changeFrustum.hpr.pitch = Cesium.Math.toRadians(options.pitch)
    }
    if (options.roll) {
      this.changeFrustum.hpr.roll = Cesium.Math.toRadians(options.roll)
    }
    if (options.fov || options.near || options.far || options.aspectRatio) {
      this.changeFrustum.fov = this.fov
      this.changeFrustum.near = this.near
      this.changeFrustum.far = this.far
      this.changeFrustum.aspectRatio = this.aspectRatio
    }
    this.changeFrustum.isUpdate = true
    this.#getVideoPositions()
    this.changeVideo.videoPolygonPositions = this.videoPolygonPositions      
    this.changeVideo.isUpdate = true
    return
  }

  showFrustum(){
    console.log("控制显示隐藏", this.changeFrustum_show);
    this.changeFrustum_show = true
    this.changeFrustum.changeFrustum_show = true
    this.changeFrustum._primitive.show = true
  }
  hideFrustum(){
    console.log("控制显示隐藏", this.changeFrustum_show);
    this.changeFrustum_show = false
    this.changeFrustum.changeFrustum_show = false
    this.changeFrustum._primitive.show = false
  }
  // deleteFrustum() {
  //   this.changeFrustum._primitive.destroy()
  //   this.changeVideo.material = null
  // }
  /**
  * @description: 经纬度（度）转世界坐标
  * @param {Degrees} degrees.longitude 经度 degrees.latitude 纬度 degrees.height高度
  * @return {Cartesian3} 世界坐标
  */
  #degreesToCartesian(degrees) {
      return Cesium.Cartesian3.fromDegrees(degrees.longitude || 0, degrees.latitude || 0, degrees.height || 0)
  }
  #degreesFromCartesian(cartesian) {
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    return this.#degreesFromCartographic(cartographic);
  }
  #degreesFromCartographic(cartographic) {
    cartographic.longitude = Cesium.Math.toDegrees(cartographic.longitude);
    cartographic.latitude = Cesium.Math.toDegrees(cartographic.latitude);
    return cartographic;
}
}


/**
 * 新增视频投影面的判断，如果存在没有的交点，即不更新
 */