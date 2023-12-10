// 1.获取元素
var eye = document.getElementById('eye');
var password = document.getElementById('password');
// 2.注册事件 处理程序
var flag = 0;
eye.onclick = function () {
    // 点击一次之后，flag一定要变化
    if (flag == 0) {
        password.type = 'text';
        eye.src='/images/睁眼 (1).png';
        flag = 1; //赋值操作
    } else {
        password.type = 'password';
        eye.src = '/images/闭眼睛.png';
        flag = 0;
    }
}