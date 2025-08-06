<template>
    <div class="database">
        <span>数据库</span>
        <button class="btn1" @click="fn1">关闭</button>
        <div>
            <select v-model="sheet">
            <option v-for="item in datasheet" :key="item" :value=item>{{ item }}</option>
            </select>
            <button class="btn2" @click="fn2">查询</button>

            <select v-model="sheet2" class="se2">
            <option v-for="item in datasheet2" :key="item" :value=item>{{ item }}</option>
            </select>
            <input type="text" v-model="input">
            <button class="btn2" @click="fn3">查询</button>
        </div>
        <div class="main">
            <ul v-show="show1">
                <li v-for="item in lists" :key="item[0]">ID:{{ item[0] }} | 种属:{{ item[1] }} | 坐标:{{ item[2] }} | 名称:{{ item[3] }} | 描述:{{ item[4] }} | 是否为名木古树:{{ item[5] }}</li>
             </ul>
             <ul v-show="show2">
                <li v-for="item in lists2" :key="item[0]">ID:{{ item[0] }} | 种属:{{ item[1] }} | 坐标:{{ item[2] }} | 名称:{{ item[3] }} | 描述:{{ item[4] }} | 是否为名木古树:{{ item[5] }}</li>
             </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: [
        'viewer',
    ],
    data() {
        return {
            maxvalue: '',
            datasheet: [],
            datasheet2: ['ID','种属','坐标','名称','描述','名木古树'],
            sheet: '',
            sheet2: '',
            lists: [],
            lists2: [],
            show1: false,
            show2: false,
            input: '',
        }
    },
    methods: {
        fn0(){

        },

        fn1() {
            this.$emit('close')
        },

        fn2(){
            if(!this.sheet){
                alert('选择数据库')
            }else{
                this.show2 = false
                this.show1 = true
                this.lists = []
                this.max(this.sheet)
                this.query()
            }
        },

        fn3() {
            if (!this.sheet) {
                alert('选择数据库')
            } else {
                if (!this.sheet2 || !this.input) {
                    alert('输入需要查询的信息')
                } else {
                    this.show1 = false
                    this.show2 = true
                    this.lists2 = []
                    this.query2()
                }
            }
        },

        max(item) {
            axios
                .post("/api/user/maxUser",{
                    item,
                })
                .then((res) => {
                    if (res.status == 200) {
                        this.maxvalue = res.data[0]['max(id)']
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        show(){
            axios
                .post("/api/user/showUser")
                .then((res) => {
                    if (res.status == 200) {
                        for(let i =0;i<res.data.length;i++){
                            this.datasheet.push(res.data[i]['Tables_in_tree'])
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        query() {
            let table = String(this.sheet)
            // for (let id = 1; id < this.maxvalue + 1; id++) {
                axios
                    .post("/api/user/getAllUser", { table }, {})
                    .then((res) => {
                        if (res.status == 200) {
                            for(let i = 0;i<res.data.length;i++){
                                this.lists.push([res.data[i].ID,res.data[i].种属,res.data[i].坐标,res.data[i].名称,res.data[i].描述,res.data[i].名木古树])
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            // }
        },

        query2(){
            let table = String(this.sheet)
            let choose =String(this.sheet2)
            let avenue = String(this.input)
                axios
                    .post("/api/user/getUser", { table, choose, avenue }, {})
                    .then((res) => {
                        if (res.status == 200) {
                            for(let i = 0;i<res.data.length;i++){
                                this.lists2.push([res.data[i].ID,res.data[i].种属,res.data[i].坐标,res.data[i].名称,res.data[i].描述,res.data[i].名木古树])
                            }
                        }
                        if(this.lists2.length == 0){
                            alert('该数据不存在')
                            this.input = ''
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
        },

    },

    mounted(){
        this.show()
    },

}
</script>

<style scoped>
.database {
    width: 830px;
    height: 315px;
    background-color: white;
    position: fixed;
    top: 8%;
}
.main{
    width: 830px;
    background-color: white;
    height: 270px;
    overflow: auto;
}
.btn1 {
    width: 45px;
    margin-left: 88.7%;
}
.btn2 {
    width: 45px;
    margin-left: 10px;
}
li{
    border: 1px solid #000;
    list-style: none;
}
.se2{
    margin-left: 50px;
}
</style>