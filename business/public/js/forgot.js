$(function () {

    //创建表单验证实例
    let validForm = new ValidForm();
  
    //重新获取验证码时间
    let time = 60;
  
    //获取邮箱验证码
    $('#getCode').on('click', function () {
  
      //获取邮箱
      let email = $('#email').val();
  
      //验证邮箱格式是否正确
      if (!validForm.isEmail(email)) {
        //!:取反，邮箱格式不正确，返回
        $('#email').next().show().attr('name', 1);
        return;
      }
  
      $(this).text(time + 's后重新发送').prop('disabled', true);
  
      let timer = setInterval(() => {
  
        if (time == 0) {
          clearInterval(timer);
          $(this).text('获取邮箱验证码').prop('disabled', false);
          time = 60;
        } else {
          time--;
          $(this).text(time + 's后重新发送');
        }
  
      }, 1000)
  
    
  //发起获取邮箱验证码的请求
  $.ajax({
    type:'POST',
    data:{
      email,
    },
    url:'http://localhost:10000/code',
    success(result){
      console.log('result==>',result)
    }
  
  })
  })
  
    //验证表单控件
    function valid(fnName) {
      let value = $(this).val();
      console.log('value ==> ', value);
  
      if (!validForm[fnName](value)) {
        $(this).next().show().attr('name', 1);
      } else {
        $(this).next().hide().removeAttr('name');
      }
    }
  
    //验证邮箱
    $('#email').on('change', function () {
      //获取邮箱
      valid.call(this, 'isEmail');
  
    })
  
    //验证昵称
    $('#nickname').on('change', function () {
      //获取昵称
      valid.call(this, 'isNickname');
      
    })
  
    //验证密码
    $('#password').on('change', function () {
      valid.call(this, 'isPassword');
    })
  
    //验证验证码
    $('#code').on('change', function () {
      valid.call(this, 'isCode');
    })
  
    //注册
    $('#forgot-btn').on('click', function () {
  
      //是否为空
      let isEmpty = false;
  
      //检查表单是否填写完整
      $('.form-control').each(function () {
        //获取元素的值
        let value = $(this).val();
        console.log('value ==> ', value);
        if (value == '') {
          isEmpty = true;
          $(this).next().show().attr('name', 1);
          // alert('请完善表单信息');
  
          //打断终止
          return false;
        }
      })
  
      if (isEmpty) {
        return;
      }
  
     //验证表单是否存在错误信息
     let isHasError = $('.error-msg[name="1"]').length > 0;
     console.log('isHasError ==> ', isHasError);
  
     if (!isHasError) {
  
      //获取表单信息
      let userInfo = {};
      $('.form-control').each(function () {
        //获取id
        let id = $(this).attr('id');
        userInfo[id] = $(this).val();
      })
  
      console.log('userInfo ==> ', userInfo);
  
      //发起注册请求
      console.log('发起注册请求');
      $.ajax({
        //请求方式
        type: 'POST',
  
        //请求路径
        url: 'http://localhost:10000/forgot',
  
        //请求参数
        data: userInfo,
  
        //成功后执行
        success: function (result) {
          console.log('result ==> ', result);
          if(result.code==1180){
            if(result.result[0]==1){
                location.href='/login';
            }
            
          }
        }
  
      })
  
     }
  
  
    })
    //跳转到index页面
    //login方法
   $('#login').on('click',function(){
    location.href='/index';
   })
  
  })