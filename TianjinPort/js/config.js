// const interface_url = 'http://192.168.20.18:8080/';
//const interface_url = 'http://36.110.66.218:8080/';
//const interface_url = 'http://192.168.10.7:8080/';
const interface_url = 'http://36.110.66.216:50002/';


//退出登录
$('.avatar').on('click',function () {
    /*var r = confirm("确定退出此次登陆吗？");
    if (r == true){
        getAjaxRequest("GET", interface_url+"authc/logout", null, returnToIndex, null)
        sessionStorage.customerId = null
    }*/

    new $Msg({
        content:"确定退出此次登陆吗？",
        type:"success",
        cancle:function(){

        },
        confirm:function(){
            getAjaxRequest("GET", interface_url+"authc/logout", null, returnToIndex, null)
            sessionStorage.customerId = null
        }
    })
})

function returnToIndex(){
	location.href="./login.html";
}


