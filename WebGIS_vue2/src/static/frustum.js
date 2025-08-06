

export default class CreateFrustum {
    constructor(options) {
        const { viewer, position, orientation, fov, near, far, aspectRatio } = options;
        this.viewer = viewer;
        this.Cesium = Cesium;
        this.position = position;
        this.orientation = orientation;
        this.fov = fov || 30;
        this.near = near || 10;
        this.far = far || 100;
        this.aspectRatio = aspectRatio;
        this.frustumPrimitive = null; // 添加一个属性用于存储视锥体的primitive
        this.outlinePrimitive = null; // 添加一个属性用于存储视锥体轮廓线的primitive
        this.add(); // 在构造函数中调用add()方法
    }

    // 添加视锥体和轮廓线
    add() {
        this.clear();
        this.addFrustum();
        this.addOutline();
    }

    // 清除视锥体和轮廓线
    clear() {
        this.clearFrustum();
        this.clearOutline();
    }
    // 创建视锥体
    addFrustum() {
        let frustum = new this.Cesium.PerspectiveFrustum({
            // 查看的视场角，绕Z轴旋转，以弧度方式输入
            // fov: Cesium.Math.PI_OVER_THREE,
            fov: this.Cesium.Math.toRadians(this.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.aspectRatio,
            // 近面距视点的距离
            near: this.near,
            // 远面距视点的距离
            far: this.far,
        });
        let geometry = new this.Cesium.FrustumGeometry({
            frustum: frustum,
            origin: this.position,
            orientation: this.orientation,
            vertexFormat: this.Cesium.VertexFormat.POSITION_ONLY,
        });
        let instance = new this.Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: this.Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new this.Cesium.Color(0.933, 0.698, 0.08, 0.2)
                ),
            },
        });
        let primitive = new this.Cesium.Primitive({
            geometryInstances: instance,
            appearance: new this.Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true,
            }),
            asynchronous: false,
        });
        this.frustumPrimitive = this.viewer.scene.primitives.add(primitive);
    }
    // 创建轮廓线
    addOutline() {
        let frustum = new this.Cesium.PerspectiveFrustum({
            // 查看的视场角度，绕Z轴旋转，以弧度方式输入
            // The angle of the field of view (FOV), in radians. 
            // This angle will be used as the horizontal FOV if the width is greater than the height, otherwise it will be the vertical FOV.
            fov: this.Cesium.Math.toRadians(this.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.aspectRatio,
            // 近面距视点的距离
            near: this.near,
            // 远面距视点的距离
            far: this.far,
        });
        let geometry = new this.Cesium.FrustumOutlineGeometry({
            frustum: frustum,
            origin: this.position,
            orientation: this.orientation,
            vertexFormat: this.Cesium.VertexFormat.POSITION_ONLY,
        });
        let instance = new this.Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: this.Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new this.Cesium.Color(0.933, 0.698, 0.08, 1.0)
                ),
            },
        });
        let primitive = new this.Cesium.Primitive({
            geometryInstances: instance,
            appearance: new this.Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true,
            }),
            asynchronous: false,
        });
        this.outlinePrimitive = this.viewer.scene.primitives.add(primitive);
    }
    // 清除视锥体
    clearFrustum() {
        if (this.frustumPrimitive) {
            this.viewer.scene.primitives.remove(this.frustumPrimitive);
            this.frustumPrimitive = null;
        }
    }

    // 清除轮廓线
    clearOutline() {
        if (this.outlinePrimitive) {
            this.viewer.scene.primitives.remove(this.outlinePrimitive);
            this.outlinePrimitive = null;
        }
    }

    // 更新视锥体的姿态
    update(position, orientation) {
        this.position = position;
        this.orientation = orientation;
        this.add(); // 在更新时重新添加视锥体和轮廓线
    }

}