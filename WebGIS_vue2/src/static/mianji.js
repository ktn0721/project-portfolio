export class mianji {
    constructor(options) {
        this.viewer = options.viewer
    }
    calculateSurfaceAreaNew(positions) {
        let totalArea = 0;
        let i0, i1, i2;
        let cartographic;
        let bottomP1, bottomP2, bottomP3;
        let granularity = Math.PI / Math.pow(2, 11);
        granularity = granularity / 64;
        const polygonGeometry = Cesium.PolygonGeometry.fromPositions({
            positions: positions,
            vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity: granularity,
        });
        const scratchCartesian1 = new Cesium.Cartesian3();
        const scratchCartesian2 = new Cesium.Cartesian3();
        const scratchCartesian3 = new Cesium.Cartesian3();
        let subTrianglePositions;
        const geom = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
        for (let i = 0; i < geom.indices.length; i += 3) {
            i0 = geom?.indices[i];
            i1 = geom?.indices[i + 1];
            i2 = geom?.indices[i + 2];

            subTrianglePositions = geom?.attributes.position.values;
            if (subTrianglePositions) {
                scratchCartesian1.x = subTrianglePositions[i0 * 3];
                scratchCartesian1.y = subTrianglePositions[i0 * 3 + 1];
                scratchCartesian1.z = subTrianglePositions[i0 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian1);
            const height = this.viewer.scene.globe.getHeight(cartographic);
            bottomP1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);

            if (subTrianglePositions) {
                scratchCartesian2.x = subTrianglePositions[i1 * 3];
                scratchCartesian2.y = subTrianglePositions[i1 * 3 + 1];
                scratchCartesian2.z = subTrianglePositions[i1 * 3 + 2];
            }
            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian2);
            const height1 = this.viewer.scene.globe.getHeight(cartographic);
            bottomP2 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height1);

            if (subTrianglePositions) {
                scratchCartesian3.x = subTrianglePositions[i2 * 3];
                scratchCartesian3.y = subTrianglePositions[i2 * 3 + 1];
                scratchCartesian3.z = subTrianglePositions[i2 * 3 + 2];
            }
            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian3);
            const height2 = this.viewer.scene.globe.getHeight(cartographic);
            bottomP3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height2);

            totalArea += this.computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
        }
        return totalArea;
    }

    computeAreaOfTriangle(pos1, pos2, pos3) {
        const a = Cesium.Cartesian3.distance(pos1, pos2);
        const b = Cesium.Cartesian3.distance(pos2, pos3);
        const c = Cesium.Cartesian3.distance(pos3, pos1);

        const s = (a + b + c) / 2;

        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
}