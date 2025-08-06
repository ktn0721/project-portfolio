// todo sql 语句留后面调用
module.exports = {
    user: {
        add: `insert into yinxing2 (ID,种属,坐标,名称,描述,名木古树) values(?,?,?,?,?,?)`,
        get: `select * from yinxing2 where ID =?`,
        create: `CREATE TABLE tree.yinxing (
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
          `,
          max:`select max(id) from tree.t20230824151213`,
          show:`show tables`
          
    },
};