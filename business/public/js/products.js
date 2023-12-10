$(function () {

  let utils = new Utils();

  //每次查询2条数据, 每页显示数据量 2 条
  let count = 5;
  let offset = 0;

  //当前页码
  let currentPage = 1;

  //总页码
  let totalPage = 0;

  //是否添加商品
  let isNew = true;

  //编辑商品时, 备份商品数据, 以便对比用户修改商品的数据
  let copyProductData = {};

  //获取用户信息
  getUserInfo();

  //获取用户信息
  function getUserInfo() {

    //获取token
    let token = sessionStorage.getItem('_tk');

    if (!token) {
      //如果token不存在，则跳转到登录
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
        // console.log('result ==> ', result);
        if (result.code == 400) {
          $('#user-img').attr('src', result.result[0].url);
          $('#nickname').text(result.result[0].nickname);
        }
      }
    })

  }

  //获取搜索商品类型
  getTypeAll();

  //切换发布商品页面
  $('#post-pro').on('click', function () {

    isNew = true;

    $('#pro-box').removeClass('hide');
    $('#pro-list').addClass('hide');
    
    $('.p-name').each(function () {
      if ($(this).data('name') == 'typeId') {
        $(this).val('default');
      } else {
        $(this).val('');
      }

      $(this).prop('disabled', false);
      
    })

    //去除上架下架状态
    $('#r1,#r2').prop('disabled', false);
    $('#r1').prop('checked', true);

    //隐藏dis-box
    $('.dis-box').addClass('hide');

    //去除预览图
    $('#pro-img,#pro-detail-img').attr('src', '');

    $('#commit').removeClass('hide');

  })

  //返回商品列表页面
  $('#back').on('click', function () {
    $('#pro-box').addClass('hide');
    $('#pro-list').removeClass('hide');
  })

  //获取商品类型
  function getTypeAll() {
    //获取token
    let token = sessionStorage.getItem('_tk');

    if (!token) {
      //如果token不存在，则跳转到登录
      location.href = '/login';
      return;
    }

    //发起获取商品类型请求
    $.ajax({
      type: 'GET',
      url: 'http://localhost:10000/typeAll',
      data: {
        token
      },
      success(result) {
        console.log('result ==> ', result);
        if (result.code == 303) {
          location.href = '/login';
        } else if (result.code == 600) {
          //生成下拉菜单
          result.result.forEach(v => {
            //创建option
            let option = $(`<option value="${v.typeId}">${v.typeName}</option>`);

            //克隆option
            let cloneOption = option.clone();

            //将option添加到select
            $('#search-type').append(option);
            $('#type-box').append(cloneOption);
          })
        }
      }
    })
  }

  //商品的数据
  let data = {};

  //上传商品图片
  $('#file-pro').on('change', function () {
    //获取上传文件的信息
    let file = $(this)[0].files[0];
    console.log('file ==> ', file);

    //创建文件阅读对象
    let fileReader = new FileReader();

    //监听是否读取完毕文件
    fileReader.onload = function () {
      //获取图片base64
      let base64 = this.result;
      // console.log('base64 ==> ', base64);
      $('#pro-img').attr('src', base64);
      data.pimg = base64;
    }

    //读取文件
    if (file) {
      fileReader.readAsDataURL(file);
    }
  })


  //上传详情图片
  $('#file-detail').on('change', function () {
    //获取上传文件的信息
    let file = $(this)[0].files[0];
    console.log('file ==> ', file);

    //创建文件阅读对象
    let fileReader = new FileReader();

    //监听是否读取完毕文件
    fileReader.onload = function () {
      //获取图片base64
      let base64 = this.result;
      // console.log('base64 ==> ', base64);
      $('#pro-detail-img').attr('src', base64);

      data.pdimg = base64;
    }

    //读取文件
    if (file) {
      fileReader.readAsDataURL(file);
    }
  })

  //确定发布
  $('#commit').on('click', function () {


   
    let pnames = $('.p-name');
    pnames.each(function () {
      let value = $(this).val();
      let dataName = $(this).data('name');
      data[dataName] = value;
    })

    //获取商品状态
    data.status = $('.form-check-input:checked').val();

    console.log('data ==> ', data);

    //发起请求
    //获取token
    let token = sessionStorage.getItem('_tk');

    if (!token) {
      //如果token不存在，则跳转到登录
      location.href = '/login';
      return;
    }

    data.token = token;

    if (isNew) {
      //添加商品
      $.ajax({
        type: 'POST',
        url: 'http://localhost:10000/addProduct',
        data,
        success(result) {
          console.log('result ==> ', result);
          $('#pro-box').addClass('hide');
      $('#pro-list').removeClass('hide');
          
        }
        
      })
      

    } else {

      console.log('copyProductData ==> ', copyProductData);

      //编辑商品的数据
      var pdata = {
        pid: copyProductData.pid
      };

      //获取用户编辑商品的数据
      for (let key in data) {
        //编辑过的数据
        if (data[key] != copyProductData[key]) {
          pdata[key] = data[key];
        }
      }

      console.log('pdata ==> ', pdata);

      //发起请求
      $.ajax({
        type: 'POST',
        url: 'http://localhost:10000/editProduct',
        data: pdata,
        success(result) {
          console.log('edit result ==> ', result);
          if (result.code == 303) {
            location.href = '/login';
          } else if (result.code == 1080) {
            if (result.result[0] == 1) {
              location.reload();
            } else {
              console.log(result.msg);
            }
          } else {
            console.log(result.msg);
          }
        }
      })

    }

  })


  //跳转商品类型
  $('#ptype').on('click', function () {
    location.href = '/index';
  })

  //搜索
  $('#search').on('click', function () {
    //重置offset, currentPage
    offset = 0;
    currentPage = 1;

    getProductCount();

    searchProduct();
  })

  //搜索商品
  searchProduct();
  function searchProduct() {
    //获取token
    let token = sessionStorage.getItem('_tk');

    if (!token) {
      //如果token不存在，则跳转到登录
      location.href = '/login';
      return;
    }

    //获取搜索条件
    let searchItems = $('.search-item');
    let searchCondition = {
      token,
      offset,
      count
    };
    searchItems.each(function () {
      let value = $(this).val();
      let dataTitle = $(this).data('title');
      searchCondition[dataTitle] = value == 'default' ? '' : value;
      // console.log('value ==> ', value);
    })

    console.log('searchCondition ==> ', searchCondition);

    //发起获取商品类型请求
    $.ajax({
      type: 'GET',
      url: 'http://localhost:10000/searchProduct',
      data: searchCondition,
      success(result) {
        console.log('result ==> ', result);
        if (result.code == 303) {
          location.href = '/login';
        } else if (result.code == 1040) {
          $('#product-list').empty();
          //生成商品列表数据
          result.result.forEach((v, i) => {

            v.updatedAt = utils.formatDate(v.updatedAt).split(' ')[0];

            let tr = $(`<tr id="${v.pid}">
                <td class="num">${i + 1}</td>
                <td class="t-name">${v.pname}</td>
                <td>${v.typeName}</td>
                <td class="status">${v.status == 1 ? '上架' : '下架'}</td>
                <td class="update-time">${v.updatedAt}</td>
                <td>
                  <button type="button" class="btn btn-success btn-sm view">查看</button>
                  <button type="button" class="btn btn-info btn-sm edit">编辑</button>
                  <button type="button" class="disbale-btn btn btn-warning btn-sm btn-status ${v.status == 1 ? '' : 'hide'}" data-status="0">下架</button>
                  <button type="button" class="enable-btn btn btn-secondary btn-sm btn-status ${v.status == 0 ? '' : 'hide'}" data-status="1">上架</button>
                  <button type="button" class="remove btn btn-danger btn-sm">删除</button>
                </td>
              </tr>`);

            $('#product-list').append(tr);
          })

          //设置设置当前页码
          $('#current-page').text(currentPage);

        } else {
          console.log(result.msg);
        }

      }
    })
  }

  //上架或者下架
  //这种绑定事件方式可以为未来创建节点绑定事件
  $('#product-list').on('click', '.btn-status', function () {
    //获取data-status
    let status = $(this).data('status');
    console.log('status ==> ', status);

    //获取商品pid
    let $tr = $(this).parents('tr');
    let pid = $tr.attr('id');

    //获取token
    let token = sessionStorage.getItem('_tk');

    if (!token) {
      //如果token不存在，则跳转到登录
      location.href = '/login';
      return;
    }

    //发起获取商品类型请求
    $.ajax({
      type: 'POST',
      url: 'http://localhost:10000/proStatus',
      data: {
        token,
        status,
        pid
      },
      success(result) {
        console.log('result ==> ', result);
        if (result.code == 303) {
          location.href = '/login';
        } else if (result.code == 1500) {
          if (result.result[0] == 1) {
            $tr.find('.status').text(status == 1 ? '上架' : '下架');

           if (status == 1) {
             $tr.find('.disbale-btn').removeClass('hide');
             $tr.find('.enable-btn').addClass('hide');
           } else {
            $tr.find('.disbale-btn').addClass('hide');
            $tr.find('.enable-btn').removeClass('hide');
           }

          }
        } else {
          console.log(result.msg);
        }
      }
    })

  })


  //删除商品
  $('#product-list').on('click', '.remove', function () {
    //获取商品pid
    let pid = $(this).parents('tr').attr('id');
    console.log('pid ==> ', pid);

     //获取token
     let token = sessionStorage.getItem('_tk');

     if (!token) {
       //如果token不存在，则跳转到登录
       location.href = '/login';
       return;
     }
 
     //发起获取商品类型请求
     $.ajax({
       type: 'POST',
       url: 'http://localhost:10000/removepro',
       data: {
         token,
         pid
       },
       success(result) {
         console.log('result ==> ', result);
         if (result.code == 303) {
           location.href = '/login';
         } else if (result.code == 1600) {
           if (result.result == 1) {
             location.reload();
           } else {
            console.log(result.msg);
           }
         } else {
           console.log(result.msg);
         }

       }
     })

  })


  //查看商品
  $('#product-list').on('click', '.view', function () {
    console.log('查看商品');
    //获取商品id
    let pid = $(this).parents('tr').attr('id');
    console.log('pid ==> ', pid);

    //发起请求
     //获取token
     let token = sessionStorage.getItem('_tk');

     if (!token) {
       //如果token不存在，则跳转到登录
       location.href = '/login';
       return;
     }
 
     //发起获取商品类型请求
     $.ajax({
       type: 'GET',
       url: 'http://localhost:10000/productById',
       data: {
         token,
         pid
       },
       success(result) {
         console.log('商品数据 result ==> ', result);
         if (result.code == 303) {
           location.href = '/login';
         } else if (result.code == 1700) {
          $('#pro-box').removeClass('hide');
          $('#pro-list').addClass('hide');
          //隐藏确认发布按钮
          $('#commit').addClass('hide');

          //获取p-name标签
          $('.p-name').each(function () {

            //获取当前标签的data-name
            let dataName = $(this).data('name');
            console.log('dataName ==> ', dataName);

            $(this).val(result.result[0][dataName]);

            //禁用
            $(this).prop('disabled', true);

          })

          //设置商品图片
          $('#pro-img').attr('src', result.result[0].pimg);
          $('#pro-detail-img').attr('src', result.result[0].pdimg);
          $('.dis-box').removeClass('hide');

          //设置商品上下架
          $('[value="' + Number(result.result[0].status) + '"]').prop('checked', true);
          $('#r1,#r2').prop('disabled', true);

         } else {
           console.log(result.code);
         }

       }
     })

  })


  //编辑
  $('#product-list').on('click', '.edit', function () {
    isNew = false;
    //获取商品id
    let pid = $(this).parents('tr').attr('id');
    console.log('pid ==> ', pid);

    //发起请求
     //获取token
     let token = sessionStorage.getItem('_tk');

     if (!token) {
       //如果token不存在，则跳转到登录
       location.href = '/login';
       return;
     }
 
     //发起获取商品类型请求
     $.ajax({
       type: 'GET',
       url: 'http://localhost:10000/productById',
       data: {
         token,
         pid
       },
       success(result) {
         console.log('商品数据 result ==> ', result);
         if (result.code == 303) {
           location.href = '/login';
         } else if (result.code == 1700) {

          //备份商品数据
          copyProductData = {
            pid: result.result[0].pid,
            pname: result.result[0].pname,
            typeId: result.result[0].typeId,
            price: result.result[0].price,
            count: result.result[0].count,
            pimg: result.result[0].pimg,
            pdimg: result.result[0].pdimg,
            status: Number(result.result[0].status),
            desc: result.result[0].desc
          };

          $('#pro-box').removeClass('hide');
          $('#pro-list').addClass('hide');
          
          //获取p-name标签
          $('.p-name').each(function () {

            //获取当前标签的data-name
            let dataName = $(this).data('name');
            console.log('dataName ==> ', dataName);

            $(this).val(result.result[0][dataName]);

            //取消禁用
            $(this).prop('disabled', false);

          })

          //设置商品图片
          $('#pro-img').attr('src', result.result[0].pimg);
          $('#pro-detail-img').attr('src', result.result[0].pdimg);
          $('.dis-box').addClass('hide');

          //设置商品上下架
          $('[value="' + Number(result.result[0].status) + '"]').prop('checked', true);
          $('#r1,#r2').prop('disabled', false);

         } else {
           console.log(result.code);
         }

       }
     })

  })


  //获取商品数目
  getProductCount();
  function getProductCount() {
    //获取token
    let token = sessionStorage.getItem('_tk');

    if (!token) {
      //如果token不存在，则跳转到登录
      location.href = '/login';
      return;
    }

    //获取搜索筛选条件
    var searchCondition = {
      token
    };
    $('.search-item').each(function () {
      let value = $(this).val();
      
      if (value != '' && value != 'default') {
        let dataTitle = $(this).data('title');
        searchCondition[dataTitle] = value;
      }
      // console.log('value ==> ', value);
    })

    console.log('searchCondition ==> ', searchCondition);

    //发起获取商品类型请求
    $.ajax({
      type: 'GET',
      url: 'http://localhost:10000/proCount',
      data: searchCondition,
      success(result) {
        console.log('result ==> ', result);

        if (result.code == 303) {
          location.href = '/login';
        } else if (result.code == 1090) {
          //设置总页码
          totalPage = Math.ceil(result.result / count);

          $('#total-page').text(totalPage);

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
        console.log('已经是最后一页');
        return;
      }
      offset +=count;
      currentPage++;
    } else {
      //上一页
      if (currentPage == 1) {
        console.log('已经是第一页');
        return;
      }
      offset -= count;
      currentPage--;
    }

    console.log('offset ==> ', offset);
    console.log('currentPage ==> ', currentPage);

    //获取分页商品数据
    searchProduct();

    

  })

})