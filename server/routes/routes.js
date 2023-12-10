//路由层

//导入路由控制器层
let routesController = require(__basename + '/routesController/routesController.js');

module.exports = (app) => {

  //路由

  //验证验证码
  app.use(routesController.validCode);

  //验证登录
  app.use(routesController.validLogin);

  //注册
  app.post('/register', routesController.register);

  //验证验证码
  app.post('/code', routesController.getCode);

  //登录
  app.post('/login', routesController.login);

  //获取用户信息
  app.post('/userInfo', routesController.getUserInfo);

  //添加商品类型
  app.post('/addType', routesController.addType);

  //查询商品类型数据
  app.get('/findType', routesController.findTypeData);

  //编辑商品类型
  app.post('/editType', routesController.editType);

  //禁用商品类型
  app.post('/disableType', routesController.disableType);

  //启用商品类型
  app.post('/enableType', routesController.enableType);

  //删除商品类型
  app.post('/removeType', routesController.removeType);
  //查询商品类型总数量
  app.get('/count', routesController.count);
  //查询所有商品类型
  app.get('/typeAll', routesController.getTypeAll);
  //发布商品
  app.post('/addProduct', routesController.addProduct);
  //搜索商品
  app.get('/searchProduct', routesController.searchproduct);
  //商家或者下架
  app.post('/proStatus', routesController.proStatus);
  //删除商品
  app.post('/removepro', routesController.removeProduct);
  //查看商品
  app.get('/productById', routesController.viewProduct);
  //编辑商品
  app.get('/editProduct', routesController.editproduct);
  //获取商品数目
  app.get('/proCount', routesController.getProductCount);
  //上传用户头像
  app.post('/userImg', routesController.uploaduserImg);
 //修改昵称
 app.post('/nickname', routesController.updateNickname);
 //修改密码
 app.post('/updatedPwd', routesController.updatePwd);
 //修改密码
 app.post('/forgot', routesController.forgot);

}