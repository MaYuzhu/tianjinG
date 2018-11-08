//version=1.0.0所有请求公用参数

let pageNumber = 1 ; //当前页数
let pageSize = 2; //每页显示条数
let pages = 0; //总页数

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
    
    // 获取车辆实时状态
    var data = {'state': 1, 'page.number':pageNumber, 'page.size':pageSize} ;
    getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
    
    // 获取车辆实时位置信息
    var data = {'vehicleId':[21,22]};
    getAjaxRequest("GET", interface_url+"location/realtime", data, realTimeCarData, null);
   

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
    $('.myCheck_dian').on('click',function() {
        if (this.checked == true) {
            $('#dianziweilan1').prop('checked', true);
            $('#dianziweilan').prop('checked', true);
        }
        else {
            $('#dianziweilan1').prop('checked', false);
            $('#dianziweilan').prop('checked', false);
        }
    })
})(window)


//车辆状态-下拉选择事件
$("#state_car").change(function () {
	var data = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
	getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
});

//车辆列表展示， 成功回调函数
function rltCarState(json){
	console.log(json);
	if(json.head.status.code == 200){
		$('.list_che').empty();
		var cars = json.body.list;
		pages = json.body.pages;
		for (var i = 0; i < cars.length; i++) {
			 $('.list_che').append(`<li>
                     <input type="checkbox" value="" id="myCheck2+${i}" class="myCheck">
                     <label for="myCheck2+${i}"></label>
                     <p>` + cars[i].plate_number + `</p>
                     <div></div>
                 </li>`)   
	    }
	}else{
		alert(json.head.status.message);
	}
}

//上一页事件处理
$('.fst').click(function () {
	if(pageNumber > 1){
		pageNumber--;
		var data = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
		getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
	}
});

//下一页事件处理
$('.lst').click(function () {
	if(pageNumber < pages){
		pageNumber++;
		var data = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
		getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
	}
});

//跟踪按钮-事件处理
var bool = true;
var tmp ;
$('.button_gen').click(btnFlush);
function btnFlush() {
	if(bool){
		bool = false;
		tmp = setInterval(getCurData, 1000);
	}else{
		bool = true;
		clearInterval(tmp);
	}
}
function getCurData(){
	var data = {'vehicleId':[21,22]};
	getAjaxRequest("GET", interface_url+"location/realtime", data, realTimeCarData, null);
}


var features = [];
//获取车辆实时-回调函数
function realTimeCarData(json){
	if(json.head.status.code == 200){
		//移除原来的坐标点
		if(features.length>0){
			source.clear();
			features = []
		}
		var curDatas = json.body;
		for (var i = 0; i < curDatas.length; i++) {
			var vid = curDatas[i].vehicle_id;
			var vdata = curDatas[i].packet_data[0].data;
			var vtime = curDatas[i].packet_data[0].time;
			insertMapPoint(features, vdata, vid);
	    }
		//增加新的坐标点，并更新地图
		source.addFeatures(features)
	    map.updateSize();
		//map.getView().fit(source.getExtent(), map.getSize());
	}else{
		alert(json.head.status.message);
	}
}

var fenceFeature;
var fenceFeatures = [];
var fenceSource;
var fenceLayer;
$(".dianzi").click(function () {
    if($(".myCheck").is(':checked')){
        if(fenceLayer){
        	map.removeLayer(fenceLayer);
        }
        return true;
    }
    var data = {'page.size':100};
	getAjaxRequest("GET", interface_url+"electronic-fence/search", data, eleFenceData, null);   
});

//地图上加载电子围栏数据
function eleFenceData(json){
	if(json.head.status.code == 200){
		var wkt = 'POLYGON((';
	    var db = json.body.list;
	    for(let i=0; i<db.length; i++){
	    	var lonlat = db.range.split(";");
	    	if(db[i].type == "0" ){ //Circle
	    		fenceFeature = new ol.Feature({
	                geometry: new ol.geom.Circle(lonlat[0].split(","), lonlat[1])
	            });
	    		fenceFeatures.push(fenceFeature);
	    	}
	    	if(db[i].type == "1"){ //Polygon
	    		 var wkt = 'POLYGON((';
	    		 for(let j=0; j<lonlat.length; j++){
	    			 wkt += lonlat[j].split(",")[0] + " " + lonlat[j].split(",")[1];
	    			 if (lonlat.length != j + 1) {
		                 wkt += ", ";
		             }
	    		 }
	    		 wkt += '))';
	    		 var format = new ol.format.WKT();
		         fenceFeature = format.readFeature(wkt);
		         fenceFeatures.push(fenceFeature);
	    	}
	    }
	    fenceSource = new ol.source.Vector({features: fenceFeatures});
	    fenceLayer = new ol.layer.Vector({ source: fenceSource });
	    map.addLayer(fenceLayer);
	}else{
		alert(json.head.status.message);
	}
}


$(function () {
    $(".button_cha").click(function () {
    	selectVehTrack();
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
$("#info").on('click',function () {
    infoJumpTo()
})
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
/*function starJumpTo() {
    var $star = $("#star");
    jumpTo($star, "http://localhost/page/MyAccount/myAccount.html");
}*/
