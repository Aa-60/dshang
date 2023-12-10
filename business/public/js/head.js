$(function(){
    $('#logout').on('click',function(){
       
        //清除token
        sessionStorage.removeItem('_tk');
        location.href = '/login';
    })
    //上传头像
    $('.user-file').on('change', function () {
		//获取上传文件的信息
		let file = $(this)[0].files[0]
		// console.log('file==>',file)
		//获取图片base64

		//创建文件阅读对象   new一个对象
		let fileReader = new FileReader();

		//监听是否读取文件完毕
		fileReader.onload = function () {
			//获取图片base64
			let base64 = this.result;
            console.log('base64==>',base64)
			// console.log('base64==>',base64)
			//绑定图片 ,把上传的图片绑定到页面中
			$('#pro-img').attr('src', base64);
            //获取token
            let token=sessionStorage.getItem('_tk')
			//发起修改头像请求
            $.ajax({
                type:'POST',
                url:'http://localhost:10000/userImg',
                data:{
                    token,
                    base64
                }, 
                success(result){
                    console.log('result===>', result);
                    if (result.code == 303) {
                        location.href = '/login';
                      } else if (result.code == 1100) {
                        if (result.result[0] == 1) {
                          //上传成功
                          //把新用户头像绑定到前端页面中，也就是src中
                          $('#user-img').attr('src', result.url);
                        } else {
                          console.log(result.msg);
                        }
                      } else {
                        console.log(result.msg);
                      }
                }
            })
		}
		//读取文件
		if (file) {
			fileReader.readAsDataURL(file)
		}
	})
    //修改昵称
    $('#commit-nickname').on('click', function () {

        //获取昵称
        var nickname = $('#new-nickname').val();
        console.log('nickname ==> ', nickname);
    
        //获取token
        let token = sessionStorage.getItem('_tk');
    
        if (!token) {
          //如果token不存在，则跳转到登录
          location.href = '/login';
          return;
        }
    
        //发起修改昵称请求
        $.ajax({
          type: 'POST',
          url: 'http://localhost:10000/nickname',
          data: {
            token,
            nickname
          },
          success(result) {
            console.log('result ==> ', result);
            if (result.code == 303) {
              location.href = '/login';
            } else if (result.code == 1120) {
              if (result.result[0] == 1) {
                //修改昵称成功
                //关闭模态框
                $('#nickname-box').modal('hide');
    
                //修改昵称文本
                $('#nickname').text(nickname);
    
                //清除输入昵称内容
                $('#new-nickname').val('');
              } else {
                console.log(result.msg);
              }
            } else {
              console.log(result.msg);
            }
          }
        })
    
      })
      //修改密码
    $('#commit-pwd').on('click',function(){
      //获取旧密码
      var oldpwd=$('#oldpassword').val();
      //获取新密码
      var newpwd=$('#newpassword').val()
      console.log('oldpwd==>',oldpwd)
      console.log('newpwd==>',newpwd)
        //获取token
        let token = sessionStorage.getItem('_tk');
    
        if (!token) {
          //如果token不存在，则跳转到登录
          location.href = '/login';
          return;
        }
    
        //发起修改昵称请求
        $.ajax({
          type: 'POST',
          url: 'http://localhost:10000/updatedPassword',
          data: {
            token,
            oldpwd,
            newpwd
          },
          success(result) {
            console.log('result ==> ', result);
            if (result.code == 303) {
              location.href = '/login';
            } else if (result.code == 1104) {
              if (result.result[0] == 1) {
                //修改昵称成功
                //关闭模态框
                $('#password-box').modal('hide');
    
               
    
                  //回到登录页面
            location.href = '/login';
              } else {
                console.log(result.msg);
              }
            } else {
              console.log(result.msg);
            }
          }
        })
    })

})