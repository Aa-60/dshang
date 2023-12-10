let express= require('express');
//导入ejs模块
let ejs=require('ejs');
//导入path路径处理模块
let path=require('path');
let app=express();
//设置模板路径
app.set('views',path.resolve(__dirname,'views'));
//设置模板引擎类型为html,需要执行app.engine()设置
app.set('view engine','html');
//ejs模板引擎解析.html文件
app.engine('.html',ejs.__express);
//设置静态目录
app.use(express.static(path.resolve(__dirname,'public')));
//路由配置
app.get('/',(req,res)=>{
   //渲染页面
   res.render('register');
})
app.get('/index',(req,res)=>{
    //渲染页面
    res.render('index');
 })
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/forgot',(req,res)=>{
    res.render('forgot')
})
app.get('/products',(req,res)=>{
    res.render('products')
})
app.listen(5001,()=>{
    console.log('the server running at http://localhost:5001')
})