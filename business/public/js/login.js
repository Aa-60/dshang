$(function () {
    //创建表单验证实例
    let validForm = new ValidForm();
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
    //验证密码
    $('#password').on('change', function () {
        valid.call(this, 'isPassword');
    })

    //登录--------------------------------------------------------------------------
    $('#login').on('click', function () {

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
            ///发起登录请求
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10000/login',
                data: userInfo,
                success(result) {
                    console.log('result==>', result);
                    if (result.code == 300) {
                        //sessionStorage:会话存储
                        //_tk:把token赋值到_tk上，并存储到sessionStorage里面。可在浏览器后台Application中查看
                        //第二次登录时，会携带token到后台登录
                        sessionStorage.setItem('_tk', result.token);
                        //登陆成功跳转到index页面
                        location.href = "/index"
                        alert('登录成功')

                    }else if(result.code == 302){
                        alert('密码不正确')
                    }
                }

            })
        }

    })
    $('#register').on('click', function () {
        location.href = '/';
        //register注册页面属于跟页面，直接写 '/'就好了
       
    })
     //跳转到忘记密码页面
     $('#forgot').on('click', function () {
        location.href = '/forgot'
    })
})