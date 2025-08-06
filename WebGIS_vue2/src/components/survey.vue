<template>
    <div class="survey">
        <div class="main">
            <p>测量:</p>
            <button class="btn" @click="MeasureLine">长度</button>
            <button class="btn" @click="MeasureArea">面积</button>
            <button class="btn" @click="MeasureTriangles">距离</button>
        </div>
        <input type="text" placeholder="objId" v-model="objId"><p style="display: none">{{ updateId }}</p>
        <input type="radio" v-model="ment1" name="ment" value="true" class="check">显示
        <input type="radio" v-model="ment2" name="ment" value="false" class="check">不显示
        <div class="main">
            <p>观察:</p>
            <button class="btn" @click="fn1">展示</button>
            <button class="btn" @click="fn2">定位</button>
        </div>
        <div class="main">
            <p>删除:</p>
            <button class="btn" @click="fn3">删除</button>
        </div>
    </div>
</template>

<script>
import {Measure} from '../static/Measure'
import {mianji} from '../static/mianji'
export default {
    props: [
        'viewer'
    ],
    data() {
        return {
            mianjiTool: '',
            measureTool: '',
            objId: '',
            ment1: '',
            ment2: '',
            Idlists: [],
        }
    },
    methods: {
        getMeasureTool() {
            if (!this.measureTool) {
                this.measureTool = new Measure({
                    viewer: this.viewer,
                });
            }
        },

        MeasureLine() {
            this.getMeasureTool();
            return new Promise((resolve, reject) => {
                this.measureTool.drawLineMeasureGraphics({
                    clampToGround: "clampToGround",
                    callback: (objId, result, positionsArr) => {
                        console.log(positionsArr, result, objId);
                        this.Idlists.push(objId)
                        resolve({ objId: objId, result: result, positionsArr: positionsArr });
                    },
                });
            });
        },

        MeasureArea() {
            this.getMeasureTool();
            return new Promise((resolve, reject) => {
                this.measureTool.drawAreaMeasureGraphics({
                    clampToGround: "clampToGround",
                    callback: (objId, result, positionsArr) => {
                        console.log(positionsArr, result, objId);
                        this.Idlists.push(objId)
                        resolve({ objId: objId, result: result, positionsArr: positionsArr });
                    },
                });
            });
            // let measure = new Cesium.Measure(this.viewer)
            // measure.drawAreaMeasureGraphics({ clampToGround: "clampToGround", callback: () => { } });
        },

        MeasureTriangles() {
            this.getMeasureTool();
            return new Promise((resolve, reject) => {
                this.measureTool.drawTrianglesMeasureGraphics({
                    clampToGround: "clampToGround",
                    callback: (objId, result, positionsArr) => {
                        console.log(positionsArr, result, objId);
                        this.Idlists.push(objId)
                        resolve({ objId: objId, result: result, positionsArr: positionsArr });
                    },
                });
            });
        },

        MeasureShow(objId, type) {
            this.getMeasureTool();
            this.measureTool.show(objId, type);
        },

        MeasureDeleteByObjId(objId) {
            this.getMeasureTool();
            this.measureTool.deleteByObjID(objId);
        },

        MeasureflyTo(objId) {
            this.getMeasureTool();
            this.measureTool.flyToByObjID(objId);
        },

        fn1() {
            let ment = null
            if (this.ment1) {
                ment = true
                this.ment1 = ''
            } else if (this.ment2) {
                ment = false
                this.ment2 = ''
            }
            this.MeasureShow(this.objId, ment)
        },

        fn2() {
            this.MeasureflyTo(this.objId)
        },

        fn3() {
            if (this.objId) {
                this.MeasureDeleteByObjId(this.objId)
                this.objId = ''
            } else {
                let result = confirm("是否删除所有测量数据?");
                if (result) {
                    for (let i = 0; i < this.Idlists.length; i++) {
                        this.MeasureDeleteByObjId(this.Idlists[i])
                    }
                    this.Idlists = []
                }
            }
        },
    },

    computed:{
        updateId(){
            this.objId = this.Idlists[this.Idlists.length - 1]
        }
    }
}
</script>

<style scoped>
.survey {
    width: 250px;
    height: 136px;
    background-color: white;
    /* opacity: 0.5; */
    position: fixed;
    z-index: 100;
    top: 8%;
    left: 2%;
}

input{
    width: 125px;
    text-align: center;
}

.check{
    width: 20px;
}
.btn {
    width: 45px;
    margin-left: 20px;
}
.main{
    display: flex;
    margin: 10px 0;
}
</style>