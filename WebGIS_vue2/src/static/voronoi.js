import * as turf from '@turf/turf'

export class voronoi {
  constructor(options) {
    this.viewer = options.viewer
  }
  calculateSurfaceArea(positions) {
    let result = 0;
    const bounds = this.getBounds(positions);
    const points = turf.randomPoint(50, { bbox: [bounds[0], bounds[1], bounds[2], bounds[3]] });
    const mainPoly = this.Cartesian2turfPolygon(positions);
    console.log(mainPoly)
    const voronoiPolygons = turf.voronoi(points, { bbox: [bounds[0], bounds[1], bounds[2], bounds[3]] });
    voronoiPolygons.features.forEach(element => {
      const intersectPoints = this.intersect(mainPoly, element)
        // if(intersectPoints.length != 0){
          result += this.calculateDetailSurfaceArea(intersectPoints);
        // }
    });
    return result;
  }


  calculateDetailSurfaceArea(positions) {
    let worldPositions = [];
    positions.forEach(element => {
      worldPositions.push(this.pickCartesian(this.viewer, element).cartesian);
  });
    return this.getArea(worldPositions);
  }

  getArea(positions) {
    const x = [0];
    const y = [0];
    const geodesic = new Cesium.EllipsoidGeodesic();
    const radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
    //数组x,y分别按顺序存储各点的横、纵坐标值
    for (let i = 0; i < positions.length - 1; i++) {
      const p1 = positions[i];
      const p2 = positions[i + 1];
      const point1cartographic = Cesium.Cartographic.fromCartesian(p1);
      const point2cartographic = Cesium.Cartographic.fromCartesian(p2);
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      const s = Math.sqrt(Math.pow(geodesic.surfaceDistance, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2));
      // console.log(s, p2.y - p1.y, p2.x - p1.x)
      const lat1 = point2cartographic.latitude * radiansPerDegree;
      const lon1 = point2cartographic.longitude * radiansPerDegree;
      const lat2 = point1cartographic.latitude * radiansPerDegree;
      const lon2 = point1cartographic.longitude * radiansPerDegree;
      let angle = -Math.atan2(
        Math.sin(lon1 - lon2) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
      if (angle < 0) {
        angle += Math.PI * 2.0;
      }
      console.log('角度：' + (angle * 180) / Math.PI);

      y.push(Math.sin(angle) * s + y[i]);
      x.push(Math.cos(angle) * s + x[i]);
    }

    let sum = 0;
    for (let i = 0; i < x.length - 1; i++) {
      sum += x[i] * y[i + 1] - x[i + 1] * y[i];
    }
    // console.log(x, y)

    return Math.abs(sum + x[x.length - 1] * y[0] - x[0] * y[y.length - 1]) / 2;
  }

  pickCartesian(viewer, windowPosition) {
    //根据窗口坐标，从场景的深度缓冲区中拾取相应的位置，返回笛卡尔坐标。
    const cartesianModel = viewer.scene.pickPosition(windowPosition);
    //场景相机向指定的鼠标位置（屏幕坐标）发射射线
    const ray = viewer.camera.getPickRay(windowPosition);
    //获取射线与三维球相交的点（即该鼠标位置对应的三维球坐标点，因为模型不属于球面的物体，所以无法捕捉模型表面）
    const cartesianTerrain = viewer.scene.globe.pick(ray, viewer.scene);

    const result = new PickResult();
    if (typeof (cartesianModel) !== 'undefined' && typeof (cartesianTerrain) !== 'undefined') {
      result.cartesian = cartesianModel || cartesianTerrain;
      result.CartesianModel = cartesianModel;
      result.cartesianTerrain = cartesianTerrain;
      result.windowCoordinates = windowPosition.clone();
      //坐标不一致，证明是模型，采用绝对高度。否则是地形，用贴地模式。
      result.altitudeMode = cartesianModel.z.toFixed(0) !== cartesianTerrain.z.toFixed(0) ? Cesium.HeightReference.NONE : Cesium.HeightReference.CLAMP_TO_GROUND;
    }
    return result;
  }

  getBounds(points) {
    let bounds = [];
    let left = Number.MAX_VALUE;
    let right = Number.MIN_VALUE;
    let top = Number.MAX_VALUE;
    let bottom = Number.MIN_VALUE;
    points.forEach(element => {
      left = Math.min(left, element.x);
      right = Math.max(right, element.x);
      top = Math.min(top, element.y);
      bottom = Math.max(bottom, element.y);
    });
    bounds.push(left);
    bounds.push(top);
    bounds.push(right);
    bounds.push(bottom);
    return bounds;
  }


  Cartesian2turfPolygon(positions) {
    var coordinates = [[]];
    positions.forEach(element => {
      coordinates[0].push([element.x, element.y]);
    });
    const polygon = turf.polygon(coordinates);
    return polygon.geometry;
  }

  intersect(poly1, poly2) {
    var intersection = turf.intersect(poly1, poly2);
    console.log(intersection)
    if (intersection?.geometry !== undefined) {
      return this.turfPloygon2CartesianArr(intersection?.geometry);
    } else {
      return [];
    }
  }


  // turfPloygon2CartesianArr(polygon) {
  //   const cartesianArr = [];
  //   if (polygon.coordinates.length > 0) {
  //     const outerRing = polygon.coordinates[0];
  //     for (const coord of outerRing) {
  //       const cartesian = new Cesium.Cartesian2(coord[0], coord[1]);
  //       cartesianArr.push(cartesian);
  //     }
  //   }
  //   return cartesianArr;
  // }


  turfPloygon2CartesianArr(geometry){
    const positionArr = [];
    geometry.coordinates.forEach((pointArr) => {
      pointArr.forEach(point => {
        positionArr.push(new Cesium.Cartesian2(point[0],point[1]));
      });
    });
    positionArr.push(new Cesium.Cartesian2(geometry.coordinates[0][0][0],geometry.coordinates[0][0][1]));
    return positionArr;
  }


}

export class PickResult {
  constructor() {
    this.cartesian = null;
    this.cartesianTerrain = null;
    this.CartesianModel = null;
    this.windowCoordinates = null;
    this.altitudeMode = Cesium.HeightReference.NONE;
  }
}
