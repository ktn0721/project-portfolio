// 测试用 api 实例
var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();
var jsonWrite = (res, ret) => {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败',
        });
    } else {
        res.json(ret);
    }
};
// 增加用户接口
// POST 请求
router.post('/addUser', (req, res) => {
    let params = req.body;
    let sql = `insert into ${params.table} (ID,种属,坐标,名称,描述,名木古树) values(?,?,?,?,?,?)`;
    // let sql = $sql.user.add;
    console.log(params);
    // ! [params.username, params.age] 自动填充到之前 ？ 里面
    conn.query(sql, [params.id,params.species, params.coordinates, params.name, params.description, params.isfamous], (err, result) => {
        if (err) return console.log(err);
        if (result) {
            jsonWrite(res, result);
        }
    });
});


router.post('/getUser', (req, res) => {
    let params = req.body;
    // let sql = $sql.user.get;
    let sql = `select * from ${params.table} where ${params.choose} = '${params.avenue}' order by ID asc limit 0,10000`;
    console.log(params);
    
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});

 
router.post('/getAllUser', (req, res) => {
    let params = req.body;
    // let sql = $sql.user.get;
    let sql = `select * from ${params.table} order by ID asc limit 0,10000`;
    console.log(params);
    
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});



router.post('/createUser', (req, res) => {
    let params = req.body;
    // let sql = $sql.user.create;
    let sql = `CREATE TABLE tree.${params.table} (
        ID INT NOT NULL,
        种属 CHAR(225) NOT NULL,
        坐标 CHAR(225) NOT NULL,
        名称 CHAR(225) NOT NULL,
        描述 CHAR(225) NOT NULL,
        名木古树 CHAR(225) NOT NULL,
        PRIMARY KEY (ID)
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8
      COLLATE = utf8_bin;
      `;
    console.log(params);
    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
          }
        if(result) {
            jsonWrite(res, result);
        }
    });
});


router.post('/maxUser', (req, res) => {
    let params = req.body;
    // let sql = $sql.user.max;
    let sql = `select max(id) from ${params.item}`
    console.log(params);
    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
          }
        if(result) {
            jsonWrite(res, result);
        }
    });
});


router.post('/showUser', (req, res) => {
    let sql = $sql.user.show;
    let params = req.body;
    console.log(params);
    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
          }
        if(result) {
            jsonWrite(res, result);
        }
    });
});
module.exports = router;