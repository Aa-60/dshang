//sequelize连接数据库
//导入sequelize模块
let Sequelize=require('sequelize');
//导出连接
//连接淘贝数据库
module.exports=new Sequelize(config.mysqlOptions.database,config.mysqlOptions.username,config.mysqlOptions.password,{
    //链接地址
    host:config.mysqlOptions.host,
    //连接数据库类型
    dialect:config.mysqlOptions.dialect,
    //时区
    timezone:config.mysqlOptions.timezone,
    //数据库连接池
    pool:config.mysqlOptions.pool
});