function moveVideoFrustumTo(newPosition, duration) {
    let start = Date.now();
    let initialPosition = this.startposition.slice(); // Create a copy of the current position

    function animate() {
        let now = Date.now();
        let elapsed = now - start;
        let progress = elapsed / duration;

        if (progress < 1) {
            // Interpolate the position based on the progress
            let interpolatedPosition = Cesium.Cartesian3.lerp(initialPosition, newPosition, progress, new Cesium.Cartesian3());

            // Convert Cartesian3 coordinates to latitude, longitude, and height
            var cartographic = Cesium.Cartographic.fromCartesian(interpolatedPosition);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;

            // Update the position of the video frustum
            this.videoFrustumUtil.update({
                viewer: this.viewer,
                fov: 46,
                near: 0.1,
                far: 40,
                aspectRatio: 1980 / 1080,
                longitude: longitude,
                latitude: latitude,
                // isClampToGround: 'false',
                hpr: {
                    heading: -1,
                    pitch: 180,
                    roll: 0
                },
            });

            console.log(latitude, longitude);

            // Continue the animation
            requestAnimationFrame(animate);
        } else {
            // If the duration is over, set the final position directly
            this.videoFrustumUtil.update({
                viewer: this.viewer,
                fov: 46,
                near: 0.1,
                far: 40,
                aspectRatio: 1980 / 1080,
                longitude: newPosition[0],
                latitude: newPosition[1],
                // isClampToGround: 'false',
                hpr: {
                    heading: -1,
                    pitch: 180,
                    roll: 0
                },
            });

            console.log(newPosition[1], newPosition[0]);
        }
    }

    // Start the animation
    animate();
}

// 调用函数，传入新的位置和动画时长（单位：毫秒）
let newPosition = [新的经度, 新的纬度, 新的高度];
let duration = 2000; // 2秒钟的动画时长
moveVideoFrustumTo(newPosition, duration);