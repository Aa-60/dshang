//user模型

//导入sequelize
let Sequelize = require('sequelize');

//获取模型类
let Model = Sequelize.Model;

//创建user模型，同时继承Model
class Product extends Model { }

//定义模型结构，映射为数据表结构
Product.init({
  //定义数据表字段，表结构

  //表id
  id: {
    //数据类型, INTEGER: 整型, UNSIGNED: 无符号
    type: Sequelize.INTEGER.UNSIGNED,

    //是否允许为null
    allowNull: false,

    //主键
    primaryKey: true,

    //自动递增
    autoIncrement: true,

    //备注
    comment: '表id'
  },

  //商品id
  pid: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: '',
    comment: '商品id'
  },
   //用户id
  userId: {
    type: Sequelize.STRING(30),
    allowNull: false,
    defaultValue: '',
    comment: '用户id'
  },
//商品名称
  pname: {
    type: Sequelize.STRING(20),//长度不超过50个字符
    allowNull: false,
    defaultValue: '',
    comment: '商品名称'
  },
  //商品类型id
  typeId: {
    type: Sequelize.STRING(30),
    allowNull: false,
    defaultValue: '',
    comment: '商品类型id'
  },
//价格 
  price: {
    type: Sequelize.DECIMAL.UNSIGNED,          //DECIMAL可以保留小数  UNSIGNED无符号，没有负数
    allowNull: false,
    defaultValue:0,
    comment: '商品价格'
  },
 
  count: {
    type: Sequelize.INTEGER.UNSIGNED,//密码加密
    allowNull: false,
    //默认用户头像
    defaultValue:0,
    comment: '库存'
  },
 pimg: {
    type: Sequelize.STRING(120),//密码加密
    allowNull: false,
    //默认用户头像
    defaultValue:'',
    comment: '商品图片'
  },
  pdimg: {
    type: Sequelize.STRING(120),//密码加密
    allowNull: false,
    //默认用户头像
    defaultValue:'',
    comment: '详情图片'
  },
  status: {
    type: Sequelize.BOOLEAN,               //BOOLEAN只有0和1这两个值
    allowNull: false,
    //默认用户头像
    defaultValue:1,//默认值为1
    comment: '商品状态,1上架,2下架'
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false,
    //默认用户头像
    defaultValue:'',
    comment: '商品描述'
  }

}, {
  //配置
  // 默认为类的名称，即在这种情况下为`User`。 这将控制自动生成的`foreignKey`（外键）的名称和关联命名
  modelName: 'product',

  //是否添加时间戳属性 (updatedAt, createdAt)
  timestamps: true,

  //是否开启假删除(逻辑删除), 真删除(物理删除)
  //不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
//paranoid: true,

  //自动设置字段为蛇型（以_方式命名）命名规则
  underscored: true,

  //是否禁止修改表名
  //默认情况下，sequelize 会自动将所有传递的模型名称转换为复数形式。
  freezeTableName: true,

  //连接实例
  sequelize
})

//force: true, 如果存在该表，则先删除该表，再创建新表，否则直接创建新表
//force: false, 如果存在该表，则不创建新表，否则创建新表
Product.sync({ force:false});

//导出模型
module.exports = Product;