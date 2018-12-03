const interface_url = 'http://192.168.20.18:8080/';
//const interface_url = 'http://36.110.66.218:8080/';


//退出登录
$('.avatar').on('click',function () {
    var r = confirm("确定退出此次登陆吗？");
    if (r == true){
        getAjaxRequest("GET", interface_url+"authc/logout", null, returnToIndex, null)
        sessionStorage.customerId = null
    }
})

function returnToIndex(){
	location.href="./login.html";
}
