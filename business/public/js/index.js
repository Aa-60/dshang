$(function () {
    let utils = new Utils();
    //每次查询5条数据,每页显示数据数量
    let count = 5;
    //偏移量 从几开始查询
    let offset = 0;
    //从0开始可以查询2条数据，从一开始只能查询到一条数据


    //编辑和添加状态 true:添加  false：编辑
    let isEdit = false;
    //编辑商品类型id
    let typeId = '';
    //当前页码
    let currentPage=1;
    //总页码
    let totalPage=0;
    //调用
    getUserInfo();
    getTypeData('next');
   
    //获取用户信息
    function getUserInfo() {
        //获取token
        let token = sessionStorage.getItem('_tk');
        if (!token) {
            //如果token不存在，则跳转到登陆页面
            location.href = '/login';
            return;

        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:10000/userInfo',
            data: {
                token
            },
            success(result) {
                console.log('result==>', result);
                //成功：
                if (result.code == 400) {
                    //从result里面的url绑定到 'user-img'上
                    //绑定用户头像，昵称
                    $('#user-img').attr('src', result.result[0].url);
                    $('#nickname').text(result.result[0].nickname);
                }
            }
        })
    }
    //跳转商品列表页面
    //跳转商品列表页面
  $('#product-list').on('click', function () {
    location.href = '/products';
  })
    //添加商品类型或编辑商品类型---------
    //添加商品类型里的保存按钮的一个事件
    $('#save').on('click', function () {
        //获取商品类型名称
        let typeName = $('#typename').val();
        //trim()去除左右空格
        if (typeName.trim() == '') {
            //为空时
            console.log('类型不能为空')
            return;
        }
        //获取token
        let token = sessionStorage.getItem('_tk');
        if (!token) {
            //如果token不存在，则跳转到登录
            location.href = '/login';
            return;
        }
        if (isEdit) {
            //编辑商品类型
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10000/editType',
                data: {
                    typeName,
                    typeId,
                    token
                }, success(result) {
                    console.log('result==>', result)
                    if (result.code = 700) {
                        $('#' + typeId).find('.t-name').text(typeName);
                        //获得当前时间
                        let date = utils.formatDate(new Date())
                        $('#' + typeId).find('.update-time').text(date);
                        $('#exampleModal').modal('hide');
                    }
                }
            })
        }
        else {
            //不为空时
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10000/addType',
                data: {
                    typeName,
                    token
                },
                success(result) {
                    if(result.code==500){
                        location.reload();
                    }
                    console.log('result==>', result);

                     
                }

            })
        }
    })

    //获取商品类型数据
    function getTypeData() {
        //获取token
        let token = sessionStorage.getItem('_tk');
        if (!token) {
            //如果token不存在，则跳转到登陆页面
            location.href = '/login';
            return;

        }
        //请求参数
        let data = {
            token,
            count,
            offset
        }
        //获取搜索商品类型名称
        let typeName = $('#type-name').val();
        //为空时
        if (typeName.trim() != '') {
            data.typeName = typeName
        }
        console.log('data==>', data)

        $.ajax({
            type: 'GET',
            url: 'http://localhost:10000/findType',
            data,
            success(result) {

                //code=600,表示查询成功
                if (result.code == 600) {
                    //清空
                    $('tbody').empty();
                    //遍历
                    result.result.forEach((v, i) => {
                        v.created_at = utils.formatDate(v.created_at);
                        v.updated_at = utils.formatDate(v.updated_at)
                        let tr = $(`<tr id="${v.type_id}">
                <td class="num">${i + 1}</td>
                <td class="t-name">${v.type_name}</td>
<td class="t-status">${v.status == 1 ? '启用' : '禁用'}</td>
          <td>${v.created_at}</td>
                <td class="update-time">${v.updated_at}</td>
                <td>
                  <button type="button" class="btn btn-info btn-sm edit">编辑</button>
                  <button type="button" class="disable-btn btn btn-warning btn-sm ${v.status == 1 ? '' : 'hide'}">禁用</button>
                  <button type="button" class="enable-btn btn btn-secondary btn-sm ${v.status == 0 ? '' : 'hide'}">启用</button>
                  <button type="button" class="remove btn btn-danger btn-sm">删除</button>
                </td>
              </tr>`);

                        //追加
                        $('tbody').append(tr);
                    })
                    if(result.result.length>0){
                        $('#current-page').text(currentPage)
                    }
                }
                
                console.log('result==>', result);
            }

        })
    }
    //搜索按钮
    $('#search').on('click', function () {
        getTypeData();
    })
    //编辑按钮，编辑商品类型数据
    $('tbody').on('click', '.edit', function () {
        //弹出模态框
        $('#exampleModal').modal('show');
        $('#exampleModalLabel').text('编辑商品类型');
        //获取商品类型名称
        let typeName = $(this).parents('tr').find('.t-name').text();
        console.log("typeName==>", typeName);
        //把typeName赋值给输入框typename
        $('#typename').val(typeName);
        isEdit = true;
        //获取商品类型id
        //获取商品类型id
        typeId = $(this).parents('tr').attr('id');

        console.log('typeId ==> ', typeId);



    })
    //禁用商品类型
    $('tbody').on('click', '.disable-btn', function () {

        //获取token
        let token = sessionStorage.getItem('_tk');
    
        if (!token) {
          //如果token不存在，则跳转到登录
          location.href = '/login';
          return;
        }
    
        //获取父元素
        let tr = $(this).parents('tr');
        //获取商品类型id
        let typeId = tr.attr('id');
    
    
        //发起禁用商品类型请求
        $.ajax({
          type: 'POST',
          url: 'http://localhost:10000/disableType',
          data: {
            token,
            typeId
          },
          success: result => {
            console.log('result ==> ', result);
    
            if (result.code == 800) {
              //隐藏当前按钮
              $(this).hide();
              //显示启用按钮
              tr.find('.enable-btn').show();
    
              //修改商品类型状态
              tr.find('.t-status').text('禁用');
    
            } else {
              console.log(result.msg);
            }
            
          }
        })
    
        
    
      })
   //启用商品类型
   $('tbody').on('click', '.enable-btn', function () {
    //获取token
    let token = sessionStorage.getItem('_tk')
    
    if (!token) {
        //如果token不存在，则跳转到登录
        location.href = '/login';
        return;
    }

    //获取父元素
    let tr = $(this).parents('tr');
    //获取商品类型id
    let typeId = tr.attr('id');
    console.log('tr==>', tr)

    //发起禁用商品类型状态
    $.ajax({
        type: 'POST',
        url: 'http://localhost:10000/enableType',
        data: {
            token,
            typeId

        },
        success: result => {
            console.log('result ==> ', result);
            if (result.code == 900) {
                //隐藏当前按钮  禁用
                //当点击禁用按钮时，禁用按钮隐藏
                $(this).hide()
                //当点击禁用按钮时 ，禁用按钮隐藏，启用按钮显示
                tr.find('.disable-btn').show();
                //修改商品类型状态
                //当禁用按钮隐藏，启用按钮显示时，状体变为禁用状态
                tr.find('.t-status').text('启用')
            }else(
                console.log(result.msg)
            )

        }

    })

})
//删除商品类型
$('tbody').on('click','.remove',function(){
    //获取tr 
    let tr=$(this).parents('tr');
    //删除商品类型id 
    let typeId=tr.attr('id');
    //获取token
    let token=sessionStorage.getItem('_tk');
    if (!token) {
        //如果token不存在，则跳转到登录
        location.href = '/login';
        return;
    }
$.ajax({
    type:'POST',
    url:'http://localhost:10000/removeType',
    data:{
        token,
        typeId
    },
    success:result=>{
        if(result.code == 1000){
            location.reload();
            // //删除一行
            // tr.remove()
            // // 重置序号
            //  $('tbody').find('.num').each(function(i){
               
            //      $(this).text(i+1)
            //  })


        }else{
            console.log(result.msg)
        }
    }
})


    
})
getTypeCount();
//获取商品类型总数量
function getTypeCount(){
     //获取tr 
     let tr=$(this).parents('tr');
     //删除商品类型id 
     let typeId=tr.attr('id');
     //获取token
     let token=sessionStorage.getItem('_tk');
     if (!token) {
         //如果token不存在，则跳转到登录
         location.href = '/login';
         return;
     }
 $.ajax({
     type:'GET',
     url:'http://localhost:10000/count',
     data:{
         token,
        
     },
     success:result=>{
        //  console.log('result==>',result)
        if(result.code ==1010){
            //分页处理
            //保存总页码
            let totalPage=Math.ceil(result.result / count)//向上取整
            $('#total-page').text(totalPage)

        }
     }
 })
}
 //上下页切换
 $('#prev,#next').on('click', function () {

    let id = $(this).attr('id');

    //下一页
    if (id == 'next') {
      if (currentPage == totalPage) {
       alert('已经是最后一页');
        return;
      }
      offset +=count;
      currentPage++;
    } else {
      //上一页
      if (currentPage == 1) {
        alert('已经是第一页');
        return;
      }
      offset -= count;
      currentPage--;
    }

    getTypeData();

    // console.log('offset ==> ', offset);

  })
 
})