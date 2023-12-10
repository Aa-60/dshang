//收集所有模型
let User=require(__basename +'/db/model/user.js')
//验证码模型
let Code=require(__basename+'/db/model/code.js');
//商品模型
let Type=require(__basename+'/db/model/type.js');
//商品
let Product=require(__basename+'/db/model/product.js');

//导出模型
module.exports={
    User,Code,Type,Product
}