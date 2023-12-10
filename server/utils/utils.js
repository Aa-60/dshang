//工具库
//导入加密模块
let crypto = require('crypto');
//导入jsonwebtoken模块
let jsonwebtoken = require('jsonwebtoken')

//导入文件系统模块，nodejs核心模块，不需要额外安装
let fs = require('fs');
//导入发邮件模块
let nodemailer = require('nodemailer')
// const { options } = require('../db/model/user')
//创建发邮件配置
let transport = nodemailer.createTransport({
	//主机
	host: 'smtp.163.com',
	//端口
	post: 465,
	//当端口为465，secure为true，25端口在阿里云服务器时禁用的
	secure: true,
	//身份授权
	auth: {
		//发件地址
		user: 'm19878515720@163.com',
		//授权码
		//PKARTKIYXALGZMOE
		pass: 'CMUZDUKAJZOTMMND'
	}
});
class Uitls {

	//加密字符串
	//方法
	encodeString(value) {
		//以md5加密
		let md5 = crypto.createHash('md5') //createHash方法
		return md5.update(value).digest('hex') //md5以hex方式输出
	}
	//发邮件
	sendEmail(emails, code, fn) {
		//fn:回调函数
		transport.sendMail({
			//发件地址
			from: 'm19878515720@163.com',
			//接收地址
			to: emails,
			//主题
			subject: '邮箱验证码.',
			//邮件内容
			text: `邮箱验证码为:${code},5分针内有效！`
		}, fn)
	}
	//生成token
	signToken(value, expires) {
		//value:被加密的字符串，生成token的字符串
		//data:被签名的字符串
		//expires:过期时间
		// config.saltOptions.tokenSal:加盐
		return jsonwebtoken.sign({
			data: value
		}, config.saltOptions.tokenSalt, {
			//expiresIn:过期的时间写法
			//60==>'60s'
			//'100'==>'100ms'
			//'2 days'==>'2天'
			//'10h'==>'10小时'
			//'7d'==>'7t=天‘
			expiresIn: expires
		});
	}
	//解析token
	verifyToken(value, fn) {
		//value: token字符串
		//fn: 回调函数, (err, decode)
		jsonwebtoken.verify(value, config.saltOptions.tokenSalt, fn);
	}

	//上传图片
	uploadImg(file) {
    //file.type: 文件类型
    //file.base64: 图片base64
    return new Promise((resolve, reject) => {
      //将base64转换程二进制文件
      let buffer = Buffer.from(file.base64, 'base64');

      //文件名
      let filename = '_p' + Math.random().toString().slice(2) + '.' + file.type;

      //将文件写入服务器
      fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
        //如果上传失败
        if (err) {
          reject({msg: '上传文件失败', code: 1021});
        } else {
          resolve({
            msg: '上传文件成功',
            code: 1020,
            filename
          })
        }
      })

    })
    



  }

}
//导出
module.exports = new Uitls()