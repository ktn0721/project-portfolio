<template>
    <div class="main">
        <div class="h">
            <span>种属:</span>
            <input type="text" v-model="species">
        </div>
        <div class="h h1">
            <span>坐标:</span>
            <input type="text" v-model="lng"><p style="display: none">{{ lng_z }}</p>
            <input type="text" v-model="lat"><p style="display: none">{{ lat_z }}</p>
        </div>
        <div class="h">
            <span>名称:</span>
            <input type="text" v-model="name">
        </div>
        <div class="h">
            <span>描述:</span>
            <input type="text" v-model="description">
        </div>
        <div class="h s">
            <span>名木古树:</span>
            <input type="radio" v-model="isfamous1" name="isfamous" value="true" class="check">是
            <input type="radio" v-model="isfamous2" name="isfamous" value="false" class="check">不是
        </div>
        <button @click="fn">添加</button>
        <button @click="fn2">重置</button>
        <div class="h s">
            <span>ID:</span>
            <input type="text" v-model="id">
        </div>
        <button @click="fn3" class="b">查询</button>
        <button @click="fn4" class="b">修改</button>
        <button @click="fn5" class="b">删除</button>
        <button @click="fn6" class="b">保存</button>
        <button @click="fn7" class="b">数据库</button>
        <database :viewer="viewer" v-show="control" :control="control" @close="control = false"/>
    </div>
</template>

<script>
import axios from 'axios'
import database from './database.vue'
export default {
    props: [
        'lists',
        'viewer',
    ],
    components:{
        database,
    },
    data() {
        return {
            species: '',
            lng: '',
            lat: '',
            name: '',
            description: '',
            isfamous1: '',
            isfamous2: '',
            id: '',
            derail: false,
            time: '',
            control:false
        }
    },
    methods: {
        fn() {
            let isfamous = null
            if (this.isfamous1) {
                isfamous = "true"
                this.isfamous1 = ''
            } else if (this.isfamous2) {
                isfamous = "false"
                this.isfamous2 = ''
            }
            if (String(this.species).trim() && String(this.lng).trim() && String(this.lat).trim() && String(this.name).trim() && String(this.description).trim() && String(isfamous).trim()) {
                axios.post('http://localhost:3000/trees', {
                    "species": String(this.species),
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            String(this.lng),
                            String(this.lat)
                        ]
                    },
                    "properties": {
                        "name": String(this.name),
                        "description": String(this.description),
                        "isfamous": String(isfamous)
                    },
                })
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                this.species = ''
                this.lng = '',
                this.lat = '',
                this.name = '',
                this.description = ''
                this.isfamous1 = ''
                this.isfamous2 = ''
            } else {
                alert('输入完整信息')
                this.species = ''
                this.lng = '',
                this.lat = '',
                this.name = '',
                this.description = ''
                this.isfamous1 = ''
                this.isfamous2 = ''
            }
        },

        fn2(){
            if(!this.derail){
                this.derail = true
            }else{
                this.derail = false
            }
            this.$emit('derail-updated', this.derail);
        },

        fn3() {
            if (String(this.id).trim()) {
                let get = 'http://localhost:3000/trees/'
                let newget = get + this.id
                axios.get(newget)
                    .then(response => {
                        console.log(response)
                        let i = ''
                        if (response.data.properties.isfamous == "true") {
                            i = '是'
                        } else {
                            i = '不是'
                        }
                        alert('种属:' + response.data.species + '\n' + '坐标:' + response.data.geometry.coordinates[0] + ',' + response.data.geometry.coordinates[1] + '\n' + '名称:' + response.data.properties.name + '\n' + '描述:' + response.data.properties.description + '\n' + i + '名木古树')
                    })
                    .catch(error => {
                        alert('无该对象')
                        console.log(error)
                    })
                this.id = ''
            } else {
                alert('输入ID')
            }
        },

        fn4(){
            if (String(this.id).trim()) {
                let get = 'http://localhost:3000/trees/'
                let newget = get + this.id
                axios.get(newget)
                    .then(response => {
                        let species = response.data.species
                        if(String(this.species).trim()){
                            species = String(this.species)
                        }
                        let lng = response.data.geometry.coordinates[0]
                        if(String(this.lng).trim()){
                            lng = String(this.lng)
                        }
                        let lat = response.data.geometry.coordinates[1]
                        if(String(this.lat).trim()){
                            lat = String(this.lat)
                        }
                        let name = response.data.properties.name
                        if(String(this.name).trim()){
                            name = String(this.name)
                        }
                        let description = response.data.properties.description
                        if(String(this.description).trim()){
                            description = String(this.description)
                        }
                        let isfamous = response.data.properties.isfamous
                        if (this.isfamous1) {
                            isfamous = "true"
                            this.isfamous1 = ''
                        } else if (this.isfamous2) {
                            isfamous = "false"
                            this.isfamous2 = ''
                        }
                        console.log(species)
                        axios.patch(newget, {
                            "species": species,
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    lng,
                                    lat
                                ]
                            },
                            "properties": {
                                "name": name,
                                "description": description,
                                "isfamous": isfamous
                            },
                        })
                            .then(response => {
                                console.log(response)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                        this.species = ''
                        this.lng = '',
                        this.lat = '',
                        this.name = '',
                        this.description = ''
                        this.isfamous1 = ''
                        this.isfamous2 = ''
                    })
                    .catch(error => {
                        alert('无该对象')
                        console.log(error)
                    })
                this.id = ''
            } else {
                alert('输入ID')
                this.species = ''
                this.lng = '',
                this.lat = '',
                this.name = '',
                this.description = ''
                this.isfamous1 = ''
                this.isfamous2 = ''
            }
        },

        fn5() {
            if (String(this.id).trim()) {
                let del = 'http://localhost:3000/trees/'
                let newdel = del + this.id
                axios.delete(newdel)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        alert('无该对象')
                        console.log(error)
                    })
                this.id = ''
            } else {
                alert('输入ID')
            }
        },

        async fn6() {
            this.showtime()
            let table = 't' + this.time
            axios
                .post("/api/user/createUser",{
                    table,
                })
                .then((res) => {
                    if (res.status == 200) {
                        console.log('已创建表格');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });


            fetch('http://localhost:3000/trees')
                .then(res => res.json())
                .then(async (res) => {
                    for (const [index, element] of res.entries()) {
                        console.log(index, element);
                        if (element.geometry.type == "Point") {
                            let id = index + 1;
                            let species = String(element.species);
                            let coordinates = String(element.geometry.coordinates);
                            let name = String(element.properties.name);
                            let description = String(element.properties.description);
                            let isfamous = String(element.properties.isfamous);
                            try {
                                const response = await axios.post("/api/user/addUser", {
                                    table,
                                    id,
                                    species,
                                    coordinates,
                                    name,
                                    description,
                                    isfamous,
                                });
                                if (response.status == 200) {
                                    console.log(response.data);
                                    // alert("录入成功");
                                }
                            } catch (error) {
                                console.error("Error:", error);
                            }
                        }
                    }
                    alert('保存完毕')
                });


            // try {
            //     const createResponse = await axios.post("/api/user/createUser",{
            //         table,
            //     });
            //     if (createResponse.status === 200) {
            //         console.log("已创建表格");

            //         fetch('http://localhost:3000/trees')
            //             .then(res => res.json())
            //             .then(async (res) => {
            //                 for (const [index, element] of res.entries()) {
            //                     console.log(index, element);
            //                     if (element.geometry.type == "Point") {
            //                         let id = index + 1;
            //                         let species = String(element.species);
            //                         let coordinates = String(element.geometry.coordinates);
            //                         let name = String(element.properties.name);
            //                         let description = String(element.properties.description);
            //                         let isfamous = String(element.properties.isfamous);
            //                         try {
            //                             console.log(table)
            //                             const response = await axios.post("/api/user/addUser", {
            //                                 table,
            //                                 id,
            //                                 species,
            //                                 coordinates,
            //                                 name,
            //                                 description,
            //                                 isfamous,
            //                             });
            //                             if (response.status == 200) {
            //                                 console.log(response.data);
            //                                 // alert("录入成功");
            //                             }
            //                         } catch (error) {
            //                             console.error("Error:", error);
            //                         }
            //                     }
            //                 }
            //                 alert('保存完毕');
            //             });
            //     }
            // } catch (error) {
            //     console.error("Error creating table:", error);
            // }
        },

        showtime() {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours()
            let minute = date.getMinutes()
            let second = date.getSeconds()
            this.time = year + addZero(month) + addZero(day) + addZero(hour) + addZero(minute) + addZero(second)
            function addZero(s) {
                return s < 10 ? ('0' + s) : s;
            }
        },

        fn7(){
            if(this.control == false){
                this.control = true
            }
        }
    },
    computed:{
        lng_z(){
            return this.lng = this.lists[0]
        },
        lat_z(){
            return this.lat = this.lists[1]
        },
    }
}
</script>

<style scoped>
.main{
    width: 430px;
    height: 315px;
    background-color: white;
    position: fixed;
    z-index: 100;
    top: 8%;
    left: 2%;
}

input{
    width: 160px;
}

button{
    margin: 0 0 0 125px;
}

.b{
    margin-left: 45px;
}
.h{
    width: 430px;
    height: 30px;
    background-color: white;
    margin: 10px 0;
}

.s{
    border-bottom: 1px solid black;
}
.check{
    width: 20px;
    margin-left: 75px;
}

</style>