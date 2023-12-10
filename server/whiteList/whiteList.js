const { addType } = require("../routesController/routesController")

//需要验证验证码的请求路径
exports.codeList = [
  '/register',
  '/forgot'

]  //需要toeken验证的请求路径
//token认证
exports.tokenList=[
  '/userInfo',
  '/addType',
  '/findType',
  '/editType',
  '/disableType',
  '/enableType',
  '/removeType',
  '/count',
  '/typeAll',
  '/addProduct',
  '/searchProduct',
  '/proStatus',
  '/removepro',
  '/productById',
  '/editProduct',
  '/proCount',
  '/userImg',
  '/nickname',
  '/updatedPwd'
]