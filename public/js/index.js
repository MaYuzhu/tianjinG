//version=1.0.0所有请求公用参数
(function (w) {
    //在线监测与轨迹切换
    let $tab = $('.right_content>:nth-child(1)>p')
    $tab.on('click', (function () {
        var i = $(this).index();
        $(this).addClass('on').siblings().removeClass('on');
        $('.on img').css('display', 'block')
        $('.box_right>div').eq(i).show().siblings().hide();
    })
    );
    //js添加拖车li
    for (var i = 0; i < 12; i++) {
        $('.list_che').append(`<li>
                                <input type="checkbox" value="" id="myCheck+${i}" class="myCheck">
                                <label for="myCheck+${i}"></label>
                                <p>拖车A1233451</p>
                                <div></div>
                            </li>`)
    }
    for (let i = 0; i < 5; i++) {
        $('.list_che2').append(`<li>
                                <input type="checkbox" value="" id="myCheck2+${i}" class="myCheck">
                                <label for="myCheck2+${i}"></label>
                                <p>拖车A1233451</p>
                                <div></div>
                            </li>`)
    }
    //翻页三角
    $('.next_wrap').on('click', function (ev) {
        var $target = $(ev.target);
        if ($target.prop("nodeName") == "LI") {
            $('.next_wrap>li').removeClass('on2')
            $target.addClass("on2");
        }
    })
    $('.next_wrap3').on('click', function (ev) {
        var $target = $(ev.target);
        if ($target.prop("nodeName") == "LI") {
            $('.next_wrap3>li').removeClass('on3')
            $target.addClass("on3");
        }
    })
    //移入右侧显示
    $('.show_sanjiao').on('click', function () {
        $('.right_content').css('transform', 'translateX(0)')
    })
    //点击三角收回
    $('.right_hide').on('click', function () {
        $('.right_content').css('transform', 'translateX(230px)')
    })

    laydate.render({
        elem: '#one_guiji'
        , type: 'datetime'
        , range: '~'
        , format: 'M/d/H:m'
    });
    /*laydate.render({
        elem: '#test16'
        ,type: 'datetime'
        ,range: '到'
        ,format: 'yyyy年M月d日H时m分s秒'
    });*/
    //播放按钮
    var flag = true
    $('#play_2').on('click', function () {
        if (flag) {
            $('#play_2>span').css({
                'background': 'url("./images/zanting.png") no-repeat left top',
                'background-size': '100% 100%',
                'margin': '11px 10px'
            })
            flag = false
        } else if (!flag) {
            $('#play_2>span').css({
                'background': 'url("./images/play_but.png") no-repeat left top',
                'margin': '11px 15px'
            })
            flag = true
        }
    })
    //两个电子围栏同时选中 懒得改结构了
    $('.myCheck').on('click',function() {
        if (this.checked == true) {
            $('#dianziweilan1').prop('checked', true);
            $('#dianziweilan').prop('checked', true);
        }
        else {
            $('#dianziweilan1').prop('checked', false);
            $('#dianziweilan').prop('checked', false);
        }
    })
    //退出登录
    $('.avatar').on('click',function () {
        $.ajax({
            type: 'GET',
            async: true,
            cache:true,
            // url:'http://192.168.20.18:8080/user/get?userId=1',
            url:'http://192.168.20.18:8080/user/get',
            dataType: 'json',
            //jsonp: "callback",
            data:{userId:1},
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success: function(json){
                console.log(json);
            },
            error: function(){
                // alert('fail');
            }
        });
        var r = confirm("确定退出此次登陆吗？");
        if (r == true){

            //http://192.168.20.18:8080/authc/logout
            $.ajax({
                type: 'POST',
                async: false,
                cache:true,
                url:'http://192.168.20.18:8080/authc/logout',
                dataType: 'json',
                //jsonp: "callback",
                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success: function(json){
                    console.log(json);
                    location.href="./login.html";
                },
                error: function(){
                    // alert('fail');
                }
            });
        }

    })

})(window)

var features = [];
var feature;

$(".dianzi").click(function () {
    
    if($(".myCheck").is(':checked')){
        features.forEach((v,k) => {
            source.removeFeature(features[k]);
        });
        features = [];
        return true;
    }

    var wkt = 'POLYGON((';
    var db = $.cookie('db');
    db = JSON.parse(db);
    dbCoordinate = db.coordinate;
    dbCoordinate.forEach(t => {
        var getCoordinate = t.coordinate;
        if (getCoordinate.name == 'Circle') {
            feature = new ol.Feature({
                geometry: new ol.geom.Circle(getCoordinate.data[0], getCoordinate.data[1])
            });
            features.push(feature);
        } else if (getCoordinate.name == 'Polygon') {
            var wkt = 'POLYGON((';
            getCoordinate.data[0].forEach((v, k) => {
                wkt += v[0] + " " + v[1];
                if (getCoordinate.data[0].length != k + 1) {
                    wkt += ", ";
                }
            });
            wkt += '))';

            var format = new ol.format.WKT();
            feature = format.readFeature(wkt);
            features.push(feature);
        }
    });
    source.addFeatures(features)
    map.updateSize();
});
// source.removeFeature(feature);


$(function () {
    // $.cookie('db', null);
    $(".button_cha").click(function () {
        carTrack();
        setTimeout(function () {
            $(".play").css({ display: 'block' });
        }, 3000);
    });
    $("#play_2").click(function () {
        run_carMove = true;
        carMove();
    });
})

//跳转页面前判断用户是否登录
function jumpTo(p, url) {
    var customerId=sessionStorage.customerId;
    if (customerId == undefined) {
        alert('您尚未登录，请登录')
        p.attr("href", "./login.html");
    } else {
        p.attr("href", url);
    }
}
function infoJumpTo() {

    var $info = $("#info");
    jumpTo($info, "./user.html");
}
function starJumpTo() {
    var $star = $("#star");
    jumpTo($star, "http://localhost/page/MyAccount/myAccount.html");
}
