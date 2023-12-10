//路由控制器

//导入处理时间模块 monent
let moment = require('moment');

//导入sequelize
let Sequelize = require('sequelize');
const {count} = require('../api/api');

//导入API
let api = require(__basename + '/api/api.js');

//导入工具模块
let utils = require(__basename + '/utils/utils.js');

//导入白名单
let whiteList = require(__basename + '/whiteList/whiteList.js');

//获取操作符引用
let Op = Sequelize.Op;

class RoutesController {

	//验证验证码
	validCode(req, res, next) {
		//获取请求路径
		let url = req.url;
		if(whiteList.codeList.indexOf(url) > -1) {
			//需要验证验证码
			//获取邮箱和验证码
			let email = req.body.email;
			let code = req.body.code;
			console.log('email ==> ', email);
			console.log('code ==> ', code);

			//获取当前时间  HH: 24小时制, hh: 12小时制
			let time = new Date().getTime() - 5 * 60 * 1000;
			let date = moment(time).format('YYYY-MM-DD HH:mm:ss');
			console.log('date ==> ', date);

			//查询数据
			//调用api.js中的findData方法
			api.findData('Code', {
				email,
				code,
				createdAt: {
					[Op.gte]: date
				}
			}).then(result => {
				console.log('result ==> ', result);

				if(result.length == 0) {
					res.send({
						msg: '验证不正确',
						code: 102
					});
				} else {
					//验证通过，传递给下一个中间或者路由
					next();
				}
			}).catch(err => {
				console.log('err ==> ', err);
				res.send({
					msg: '注册失败',
					code: 101
				});
			})

		} else {
			//传递给下一个中间件或者路由
			next();
		}

	}
	//登录验证
	validLogin(req, res, next) {
		console.log('req.url==>', req.url);
		let url = req.url.split('?')[0];
		if(whiteList.tokenList.indexOf(url) > -1) {

			//截取token
			let token = req.body.token ? req.body.token : req.query.token;
			console.log('token==>', token)
			//需要验证token
			utils.verifyToken(token, (err, decode) => {
				if(err) {
					res.send({
						msg: '请先登录',
						code: 303
					});
				} else {
					console.log('decode ==> ', decode);
					req.userId = decode.data;

					next();
				}
			})

		} else {
			next();
		}
	}
	//注册
	register(req, res) {
		console.log('req.body ==> ', req.body);

		//加密密码
		let password = utils.encodeString(req.body.password);
		console.log('password ==> ', password);

		//生成用户id
		let userId = '_u' + new Date().getTime();

		//用户数据
		let o = {
			userId,
			password,
			nickname: req.body.nickname,
			email: req.body.email
		};

		//检查邮箱是否已经被注册
		api.findData('User', {
			email: req.body.email
		}, ['userId']).then(result => {
			console.log('result ==> ', result);
			if(result.length === 0) {
				//该用户没有注册
				//将用户数据写入mysql数据库中
				api.createData('User', o).then(result => {
					res.send({
						msg: '注册成功',
						code: 100,
						result
					});
				}).catch(err => {
					console.log('err ==> ', err);
					res.send({
						msg: '注册失败',
						code: 101
					});
				})

			} else {
				//邮箱已经注册
				res.send({
					msg: '邮箱已经被注册',
					code: 102
				});
			}

		}).catch(err => {
			console.log('err ==> ', err);
			res.send({
				msg: '注册失败',
				code: 101
			})
		})

	}

	//获取邮箱验证码
	getCode(req, res) {
		let email = req.body.email;
		let code = '';
		for(var i = 0; i < 6; i++) {
			code += parseInt(Math.random() * 10);
		}
		// console.log('code ==> ', code);

		//存储验证码，以便注册验证
		api.createData('Code', {
			email,
			code
		}).then(() => {
			//发邮件
			utils.sendEmail(email, code, (err, data) => {
				if(err) {
					res.send({msg: '获取邮箱验证码失败',code: 201});
				} else {
					console.log('data ==> ', data);
					res.send({msg: '验证发至您的邮箱',code: 200
					});
				}
			})
		}).catch(err => {
			console.log('err => ', err);
			res.send({
				msg: '获取邮箱验证码失败',
				code: 201
			});
		})

	}
	//登录
	login(req, res) {
		console.log('req.body==>', req.body);

		//查询user是否有该用户，验证一下
		api.findData('User', {
			email: req.body.email
		}, ['userId', 'password']).then(result => {
			console.log('result==>', result)
			if(result.length == 0) {
				res.send({
					msg: '邮箱没有被注册',
					code: 301
				})
			} else {
				//邮箱存在进行密码匹配
				//密码加密
				// console.log('password ==> ', password);
				// console.log('result[0].dataValues.password ==> ', password);
				let password = utils.encodeString(req.body.password);
				if(password == result[0].dataValues.password) {
					//登录成功

					//生成token
					//使用userId生成token
					let token = utils.signToken(result[0].dataValues.userId, '1d');
					res.send({
						msg: '登陆成功',
						code: 300,
						token
					});
				} else {
					res.send({
						msg: '密码不正确',
						code: 302
					});
				}
			}

		}).catch(err => {
			//查询有误时，输出错误
			console.log('err==>', err);
			res.send({
				msg: '登录失败',
				code: 301
			})
		})
	}
	//获取用户信息
	getUserInfo(req, res) {
		//查询用户信息
		api.findData('User', {
			userId: req.userId
		}, ['nickname', 'url']).then(result => {
			res.send({
				msg: '查询用户信息成功',
				code: 400,
				result
			});
		}).catch(err => {
			console.log('err==>', err);
			res.send({
				msg: '查询用户信息失败',
				code: 401
			})
		})
	}
	//把添加商品类型那里输入框的数据保存到type表里面
	//添加商品类型
	addType(req, res) {
		let typeId = '_t' + new Date().getTime();
		api.createData('Type', {
			userId: req.userId,
			typeId,
			typeName: req.body.typeName
		}).then(result => {
			res.send({
				msg: '添加商品类型成功',
				code: 500,
				result
			})
		}).catch(err => {
			console.log('err==>', err);
			res.send({
				msg: '添加商品类型失败',
				code: 501
			})
		})
	}
	//查询商品类型数据
	findTypeData(req, res) {
		//limit；限制条件
		//req.query.typeName:输入框输入的值
		let sql = " SELECT * FROM `type` WHERE `user_id` = :userId";
		if(req.query.typeName) {
			sql += " AND `type_name` LIKE '%" + req.query.typeName + "%'"
		}
		sql += " LIMIT :offset,:count";
		console.log('sql==>', sql)

		api.query(sql, {
			userId: req.userId,
			offset: Number(req.query.offset),
			count: Number(req.query.count)
		}).then(result => {
			res.send({
				msg: '查询商品类型数据成功',
				code: 600,
				result
			});
		}).catch(err => {
			console.log('err ==> ', err);
			res.send({
				msg: '查询商品类型数据失败',
				code: 601
			});
		})
	}
	//编辑商品类型
	editType(req, res) {
		api.updateData('Type', {
			typeName: req.body.typeName

		}, {
			typeId: req.body.typeId
		}).then(result => {
			res.send({
				msg: "编辑商品类型成功",
				code: 700,
				result
			});

		}).catch(err => {
			console.log('err==>', err);
			res.send({
				msg: '编辑商品类型失败',
				code: 701
			})
		})
	}
	//禁用商品类型
	//改变后台status状态
	disableType(req, res) {
		//更新数据
		api.updateData('Type', {
			status: 0

		}, {
			typeId: req.body.typeId,
			//经过token认证，传递userId
			userId: req.userId

		}).then(result => {
			res.send({
				msg: '禁用商品类型成功',
				code: 800,
				result
			})
		}).catch(err => {
			console.log('err==>', err)
			res.send({
				msg: '禁用商品类型失败',
				code: 801
			})
		})
	}
	//启用商品类型
	//改变后台status状态
	enableType(req, res) {
		//更新数据
		api.updateData('Type', {
			status: 1

		}, {
			//查询条件
			typeId: req.body.typeId,
			//经过token认证，传递userId
			userId: req.userId

		}).then(result => {
			res.send({
				msg: '禁用商品类型成功',
				code: 900,
				result
			})
		}).catch(err => {
			console.log('err==>', err)
			res.send({
				msg: '禁用商品类型失败',
				code: 901
			})
		})
	}
	//删除商品类型
	//删除商品类型
	removeType(req, res) {
		api.removeData('Type', {
			typeId: req.body.typeId,
			userId: req.userId
		}).then(result => {
			res.send({
				msg: '删除商品类型成功',
				code: 1000,
				result
			});
		}).catch(err => {
			console.log('err ==> ', err);
			res.send({
				msg: '删除商品类型失败',
				code: 1001
			});
		})
	}
	//查询商品类型总数量
	count(req, res) {
		// res.send('count ok')//测试接口能不能用
		api.count('Type', {
			//根据userId来查询
			userId: req.userId
		}).then(result => {
			res.send({
				msg: '查询商品类型总数量成功',
				code: 1010,
				result
			});
		}).catch(err => {
			console.log('err==>', err);
			res.send({
				msg: '查询商品类型总数量失败',
				code: 1011
			});

		})
	}
	//查询所有商品类型
	getTypeAll(req, res) {
		api.findData('Type', {
			userId: req.userId,
			status: 1
		}).then(result => {
			res.send({
				msg: '查询商品类型成功',
				code: 600,
				result
			})
		}).catch(err => {
			console.log('err==>', err)
			res.send({
				msg: '查询商品类型失败',
				code: 601
			})
		})
	}

	  //发布商品, 添加商品
	  addProduct(req, res) {

		//获取商品信息
		// console.log('req.body ==> ', req.body);
	
		//获取商品图片
		let pimgBase64 = req.body.pimg.replace(/data:image\/[a-z]+;base64,/, '').replace(/ /g, '+');
		// console.log('pimgBase64 ==> ', pimgBase64);
	
		let pimgType = req.body.pimg.split(';')[0].split('/')[1];
		// console.log('pimgType ==> ', pimgType);
	
		//获取详情图片
		let pdimgBase64 = req.body.pdimg.replace(/data:image\/[a-z]+;base64,/, '').replace(/ /g, '+');
		// console.log('pdimgBase64 ==> ', pdimgBase64);
	
		let pdimgType = req.body.pdimg.split(';')[0].split('/')[1];
		// console.log('pdimgType ==> ', pdimgType);
	
	
		//等待上传完毕所有图片之后，再将商品数据写入mysql数据库
		Promise.all([
		  //任务1: 上传商品图片
		  utils.uploadImg({
			base64: pimgBase64,
			type: pimgType
		  }),
		  //任务2: 上传详情图片
		  utils.uploadImg({
			base64: pdimgBase64,
			type: pdimgType
		  })
		]).then(result => {
		  console.log('result ==> ', result);
		 // 等待上传完毕所有图片之后，再将商品数据写入mysql数据库
		 req.body.pimg = config.serverOptions.host + ':' + config.serverOptions.port + '/' + result[0].filename;
	
		 req.body.pdimg = config.serverOptions.host + ':' + config.serverOptions.port + '/' + result[1].filename;
	
		 //移除token属性
		 delete req.body.token;
	
		 req.body.price = Number(req.body.price);
		 req.body.count = Number(req.body.count);
		 req.body.status = Number(req.body.status);
	
		 //生成商品的pid
		 req.body.pid = '_p' + new Date().getTime();
	
		 req.body.userId = req.userId;
	
		//  console.log('product req.body ==> ', req.body);
	
		 //将商品数据写入Product
		 api.createData('Product', req.body).then(result => {
		   res.send({msg: '发布商品成功', code: 1300, result});
		 }).catch(err => {
		   console.log('err ==> ', err);
		   res.send({msg: '发布商品失败', code: 1301, result});
		 })
		 
		}).catch(err => {
		  console.log('err => ', err);
		  res.send({msg: '发布商品失败', code: 1031});
	
		})
	
	
	
	  }
	//获取商品信息
	//	console.log('req.body==>',req.body)
	//req就是请求体也就是data  data就是商品数据
	//把商品数据写入数据库

	///搜索商品
	searchproduct(req, res) {
		console.log('req.query==>', req.query)
		//sql替换内容
		let replacements={
			userId:req.userId,
			offset:Number(req.query.offset),
			count:Number(req.query.count)
		};
		 let sql = "SELECT `p`.`pid`, `p`.`pname`, `p`.`status`, `p`.`updated_at` AS `updatedAt`, `t`.`type_name` AS `typeName` FROM `product` AS `p` INNER JOIN `type` AS `t` ON `p`.`user_id` = :userId AND `p`.`type_id` = `t`.`type_id`";

	//如果存在搜索商品名称，则需要按照关键字进行模糊查询，比如 like '% 电%'
//如果指定类型查询
    if (req.query.pname) {
      sql += " AND `p`.`pname` LIKE :pname";
      replacements.pname = `%${req.query.pname}%`;
    }

    //如果指定类型查询
    if (req.query.typeId) {
      sql += " AND `p`.`type_id` = :typeId";
      replacements.typeId = req.query.typeId;
    }

    //如果存在商品状态
    if (req.query.status) {
      sql += " AND `p`.`status` = :status";
      replacements.status = Number(req.query.status);
    }

    //如果存在上架日期
    if (req.query.updatedAt) {
      sql += " AND `p`.`updated_at` >= :start AND `p`.`updated_at` <= :end";
      replacements.start = req.query.updatedAt + ' 00:00:00';
      replacements.end = req.query.updatedAt + ' 23:59:59';
    }

    sql += " ORDER BY `p`.`updated_at` DESC LIMIT :offset, :count";

    api.query(sql, replacements).then(result => {
      res.send({msg: '搜索商品成功', code: 1040, result});
    }).catch(err => {
      console.log('err ==> ', err);
      res.send({msg: '搜索商品失败', code: 1041});
    })
	}
	//上架或者下架
	 proStatus(req, res) {
	 	console.log('req.body==>',req.body)
    api.updateData('Product', {
      status: Number(req.body.status)
    }, {
      pid: req.body.pid
    }).then(result => {
      res.send({msg: '商品状态更改成功', code: 1050, result});
    }).catch(err => {
      console.log('err ==> ', err);
      res.send({msg: '商品状态更改失败', code: 1051});
    })
  }
//删除商品
removeProduct(req,res){
	api.removeData('Product',{
		pid:req.body.pid
	}).then(result=>{
		res.send({msg:'删除商品成功',code:1060,result})
	}).catch(err=>{
		console.log('err==>',err)
		res.send({msg:'删除商品失败',code:1061})
	})
}
//查看商品
viewProduct(req, res) {
    api.findData('Product', {
      pid: req.query.pid
    }).then(result => {
      res.send({msg: '查询商品信息成功', code: 1070, result});
    }).catch(err => {
      console.log('err ==> ', err);
      res.send({msg: '查询商品信息失败', code: 1071});
    })
  }
  //编辑
  editproduct(req,res){
	 //上传图片的promise
	var imgs=[];
	 //保存图片类型
	 var imgsType = [];
   // 判断是否修改商品的图片
   //没有修改商品图片时
   if(req.body.pimg){  
	imgsType.push('pimg');
	//获取商品图片
	let pimgBase64 = req.body.pimg.replace(/data:image\/[a-z]+;base64,/, '').replace(/ /g, '+');
	// console.log('pimgBase64 ==> ', pimgBase64);

	let pimgType = req.body.pimg.split(';')[0].split('/')[1];
	//保存商品图片的promise
	imgs.push(
		utils.uploadImg({
		    base64: pimgBase64,
		    type: pimgType
	}))
   }
      //没有修改详情图片时
    if(req.body.pdimg){
		imgsType.push('pdimg');
		//获取详情图片
		let pdimgBase64 = req.body.pdimg.replace(/data:image\/[a-z]+;base64,/, '').replace(/ /g, '+');
	
		let pdimgType = req.body.pdimg.split(';')[0].split('/')[1];
		imgs.push(
			utils.uploadImg({
				base64: pdimgBase64,
				type: pdimgType
		}))
	}
	//更新商品数据
	function updateProduct(){
		var pid=req.body.pid;
		delete req.body.pid;
		api.updateData('Product',req.body,{
		  pid
		  //Product 要更新的模型名称
		  //req.body   更新的数据
		  //pid  更新的条件  根据pid 来查询
		}).then(result=>{
		  res.send({msg:'编辑商品成功',code:1080,result})
		}).catch(err=>{
		  res.send({msg:'编辑商品失败',code:1081})
		})
	}
	//判断是否存在上传的图片
	if(imgs.length> 0){
      //等待上传图片的promise都完成后，再将商品数据写入数据库中
	  Promise.all(imgs).then(result=>{
		console.log('result==>',result)
		imgsType.forEach((v, i) => {
			req.body[v] = config.serverOptions.host + ':' + config.serverOptions.port + '/' + result[i].filename;
		  })
		  
	 
		  //移除token属性
		  delete req.body.token;
  
		  console.log('req.body ==> ', req.body);
          //调用更新数据
		  updateProduct()
		
	  }).catch(err=>{
		console.log('err==>',err)
		res.send({msg:'编辑失败',code:1081})
	  })
	}else{
		//如果不存在修改图片，直接将商品数据写入数据库中
		//调用更新数据
		updateProduct()
		
	}

  }
  //分页 
  getProductCount(req, res) {
//object.assign合并一个对象
    var condition = Object.assign({}, req.query);

    condition.userId = req.userId;

    //如果存在商品，则需要进行模糊查询
    if (req.query.pname) {
      condition.pname = {
        [Op.like]: `%${req.query.pname}%`
      }
    }

    if (req.query.updatedAt) {
      condition.updatedAt = {
        [Op.and]: {
			//Op.and并且的关系
          [Op.gte]: req.query.updatedAt + ' 00:00:00',     ///大于等于
          [Op.lte]: req.query.updatedAt + ' 23:59:59'		//小于等于
        }
      }
    }

    // console.log('condition ==> ', condition);

    delete condition.token;
	//要删除这个token，要不然就会用这个token查询了，查不到会报错的

    api.count('Product', condition).then(result => {
      res.send({msg: '获取商品数目成功', code: 1090, result});
    }).catch(err => {
      res.send({msg: '获取商品数目失败', code: 1091});
    })
  }
    //上传用户头像
	uploaduserImg(req,res){
		//获取用户头像
	let base64 = req.body.base64.replace(/data:image\/[a-z]+;base64,/, '').replace(/ /g, '+');
	console.log('base64 ==> ', base64);
		//图片类型
	let type = req.body.base64.split(';')[0].split('/')[1];
	//上传头像
	utils.uploadImg({
		base64,
		type
	}).then(result=>{
		console.log('result==>',result)
		//生成图片路径
	var url=config.serverOptions.host + ':' + config.serverOptions.port + '/' + result.filename;
	//将数据写入数据库
	api.updateData('User',{
		url

	},{
		userId:req.userId
	}).then(result=>{
		res.send({msg:'上传用户头像成功',code:1100,result,url})
	}).catch(err=>{
		res.send({msg:'上传用户头像失败',code:1101})
	})

	}).catch(err=>{
		console.log('err==>',err)
		res.send({msg:'上传用户头像失败',code:1101})
	})
	}
	//修改昵称
    updateNickname(req, res) {
    
		api.updateData('User', {
		  nickname: req.body.nickname
		}, {
		  userId: req.userId
		}).then(result => {
		  res.send({msg: '修改昵称成功', code: 1120, result});
		}).catch(err => {
		  console.log('err ==> ', err);
		  res.send({msg: '修改昵称失败', code: 1121});
		})
	
	  }
	  //修改密码
	  updatePwd(req,res){
	
		
		//查询用户密码
		api.findData('User',{
			userId:req.userId   //查询条件
		},['password']).then(result=>{
			console.log('result==>',result)
			if(result.length>0){
				//验证旧密码是否正确
				//加密旧密码
		let password = utils.encodeString(req.body.oldpwd);
		// console.log('password ==> ', password);
		if(password == result[0].dataValues.password){
			//加密新密码
		let newpassword = utils.encodeString(req.body.newpwd);
			//验证旧密码
			//修改密码
			api.updateData('User',{
				password:newpassword
			},{
				userId:req.userId
			}).then(result=>{
				
				res.send({msg:'修改密码成功',code:1104,result})
			}).catch(err=>{
				console.log('err==>',err)
				res.send({msg:'修改密码失败',code:1141})
			})
		} else {
			alert('旧密码错误,请重新输入');
		  }
				
			}else{
				res.send({msg:'修改密码失败',code:1131})
			}
			
		}).catch(err=>{
			console.log('err==>',err)
			res.send({msg:'修改密码失败',code:1131})
		})
	  }
	//找回密码
	forgot(req, res) {
		//加密新密码
		let password = utils.encodeString(req.body.password);
		api.updateData('User', {
		  password
		}, {
		  email: req.body.email
		}).then(result => {
		  res.send({msg: '找回密码成功', code: 1180, result});
		}).catch(err => {
		  console.log('err ==> ', err);
		  res.send({msg: '找回密码失败', code: 1181});
		})
	
	  }
}

//导出实例
module.exports = new RoutesController();