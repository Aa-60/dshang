class Utils {
    //格式化时间
    formatDate(value){
        let date=new Date(value);
        //获取年份
        let year=date.getFullYear();
        //获取月份
        let month=date.getMonth()+1;
        //月份大于等于10直接取月份  小于10补零 '0'+month
        month=month >=10 ? month:'0'+month;
        //获取月
        let d=date.getDate();
        d = d >=10 ? d:'0'+d;
        //获取时
        let hours = date.getHours();
        hours = hours >=10 ? hours:'0'+hours;
        //获取分
        let minutes = date.getMinutes();
        minutes = minutes >=10 ? minutes:'0'+minutes;
        //获取秒
        let seconds = date.getSeconds();
        seconds = seconds >=10 ? seconds:'0'+seconds;


        return `${year}-${month}-${d} ${hours}:${minutes}:${seconds}`;
    }
}