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
	        if(i == 1){
	            map.removeLayer(vector)
            }else if(i == 0){
                map.addLayer(vector)
                if(run_carMove){
                    $('#play_2').click()
                    setTimeout(function () {
                        map.removeLayer(carLayer)
                        map.removeLayer(lineLayer)
                    },300)
                }else {
                    map.removeLayer(carLayer)
                    map.removeLayer(lineLayer)
                }
                $('.play').css('display','none')
            }
	    })
    );
    
    // 获取车辆实时状态
    var data = {'state': 2, 'page.number':pageNumber, 'page.size':pageSize} ;
    getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
    
    // 获取车辆实时位置信息
    var data = {'vehiclesId':[1,2]};
    getAjaxRequest("GET", interface_url+"location/realtime", data, realTimeCarData, null);
   
    //获取部门添加到select里
    let getVehicleData = {
        'page.number':1,
        'page.size':3,
        pages:0,
        departmentId:1
    }
    getAjaxRequest("GET", interface_url+"department/search", null, getDepartment, null);
    function getDepartment (json) {
        if(json.head.status.code == 200){
            $('#a2').empty()
            for(let i=0;i<json.body.list.length;i++){
                $('#a2').append(`<option value=${json.body.list[i].department_id}>
                                    ${json.body.list[i].identity_name}</option>`)
            }
            //轨迹查询选择车辆列表
            getAjaxRequest("GET", interface_url+"vehicle/search", getVehicleData, getVehicleList, null);
            //按部门查找
            $('#a2').on('change',function () {
                getVehicleData.departmentId = $('#a2').val()
                getAjaxRequest("GET", interface_url+"vehicle/search", getVehicleData, getVehicleList, null);
            })
            //翻页
            $('.next_wrap3>:first-child').on('click', function () {
                if(getVehicleData['page.number']>1){
                    $('.next_wrap3>:last-child').addClass('page_on').removeClass('page_on_not')
                    getVehicleData['page.number']--
                    getAjaxRequest("GET", interface_url+"vehicle/search", getVehicleData, getVehicleList, null);
                    if(getVehicleData['page.number']==1){
                        $('.next_wrap3>:first-child').removeClass('page_on').addClass('page_on_not')
                    }
                }
            })
            $('.next_wrap3>:last-child').on('click', function () {
                if(getVehicleData['page.number']<getVehicleData.pages){
                    $('.next_wrap3>:first-child').addClass('page_on').removeClass('page_on_not')
                    getVehicleData['page.number']++
                    getAsyncAjaxRequest("GET", interface_url+"vehicle/search", getVehicleData, false, getVehicleList, null);
                    if(getVehicleData['page.number']==getVehicleData.pages){
                        $('.next_wrap3>:last-child').removeClass('page_on').addClass('page_on_not')
                    }
                }
            })
        }

    }

    function getVehicleList (json) {
        //console.log(json)
        if(json.head.status.code == 200){
            getVehicleData.pages = json.body.pages
            if(getVehicleData.pages<2){
                $('.next_wrap3>:last-child').removeClass('page_on').addClass('page_on_not')
                $('.next_wrap3>:first-child').removeClass('page_on').addClass('page_on_not')
            }else {
                $('.next_wrap3>:last-child').removeClass('page_on_not').addClass('page_on')
            }
            $('.list_che2').empty()
            for (let i = 0; i < json.body.list.length; i++) {
                $('.list_che2').append(`<li>
                                <input name="vehicle_radio" type="radio" 
                                    value=${json.body.list[i].vehicle_id} id="myCheck2${i}" class="myCheck">
                                <label for="myCheck2${i}" class="vehicle_radio_label"></label>
                                <p>拖车${json.body.list[i].plate_number}</p>
                                <div class=${json.body.list[i].state==2?'red_ball':
                                json.body.list[i].state==1?'green_ball':'gray_ball'}></div>
                            </li>`)
            }
            $('input[name="vehicle_radio"][value="1"]').attr('checked',true)
        }
    }

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
        //, format: 'M/d/H:m'
    });
    /*laydate.render({
        elem: '#test16'
        ,type: 'datetime'
        ,range: '到'
        ,format: 'yyyy年M月d日H时m分s秒'
    });*/

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
    //播放一些按钮移入文字提示mouseover
    textTip($('#play_1'),'0.5X播放')
    textTip($('#play_2'),'播放')
    textTip($('#play_3'),'2X播放')
    textTip($('#replay'),'重新播放')
    textTip($('#delete_mark'),'删除轨迹')
    function textTip(dom,string) {
	    dom.mouseover(function(event){
		    var tooltipHtml = `<div id='tooltip' class='tooltip'>${string}</div>`;
		    $(this).append(tooltipHtml);
		    $("#tooltip").css({
			    "opacity": .8,
			    "top": (event.pageY)-(dom.offset().top) + 20 + "px",
			    "left": (event.pageX)-(dom.offset().left) - 20 + "px"
		    }).show("fast");
	    }).mouseout(function(){
		    $("#tooltip").remove();
	    })
    }


})(window)


$("#state_car").change(function () {
    var vehicleData = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
	getAjaxRequest("GET", interface_url+"vehicle/search", vehicleData, rltCarState, null);
});

//车辆列表展示， 成功回调函数
function rltCarState(json){
	if(json.head.status.code == 200){
		$('.list_che').empty();
		var cars = json.body.list;
		pages = json.body.pages;
		if(pages < 2){
            $('.lst,.fst').addClass('page_on_not').removeClass('page_on')
        }
		for (var i = 0; i < cars.length; i++) {
			 $('.list_che').append(`<li>
                     <input type="checkbox" value=${cars[i].vehicle_id} id="myCheck2+${i}" class="myCheck">
                     <label for="myCheck2+${i}"></label>
                     <p class="itemCar" value=${cars[i].vehicle_id}>${cars[i].plate_number}</p>
                     <div class=${json.body.list[i].state==2?'red_ball':
                        json.body.list[i].state==1?'green_ball':'gray_ball'}></div>
                 </li>`)   
	    }
	    $('.itemCar').on('click',function () {
            let getCarData = {
                vehiclesId:$(this).attr('value')
            }
            getAjaxRequest("GET", interface_url+"location/realtime", getCarData, thisCarState, null);
            function thisCarState (json){
                if(json.head.status.code == 200){
                    let lon = json.body[0].packet_data[0].data.longitude
                    let lat = json.body[0].packet_data[0].data.latitude
                    //setMapView(13110795.607205058,4719031.500290665)
                    console.log(lon*100000,lat*100000)
                    //setMapView(13110895.607205058,4719131.500290665)
                }
            }
        })
	}else{
		alert(json.head.status.message);
        location.href="./login.html";
	}
}

//上一页事件处理
$('.fst').click(function () {
	if(pageNumber > 1){
        $('.lst').addClass('page_on').removeClass('page_on_not')
		pageNumber--;
		var data = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
		getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
        if(pageNumber = 1){
            $('.fst').addClass('page_on_not').removeClass('page_on')
        }
	}
});

//下一页事件处理
$('.lst').click(function () {
	if(pageNumber < pages){
        $('.fst').addClass('page_on').removeClass('page_on_not')
		pageNumber++;
		var data = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
		getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
		if(pageNumber == pages){
            $('.lst').addClass('page_on_not').removeClass('page_on')
        }

	}
});

//跟踪按钮-事件处理
var bool = true;
var tmp ;
var data = {};
$('.button_gen').click(btnFlush);
function btnFlush() {
    data.vehicleIds = []
    $.each($('.list_che .myCheck:checked'),function () {
        data.vehiclesId.push($(this).val())
    })
    if(data.vehiclesId.length<1){
        alert('请选择车辆...')
        return false
    }
	if(bool){
		bool = false;
		tmp = setInterval(getCurData, 1000);
	}else{
		bool = true;
		clearInterval(tmp);
	}
}
function getCurData(){
	//var data = {'vehicleId':[1,2]};

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
		//alert(json.head.status.message);
        console.log(json.head.status.message)
	}
}

//電子圍欄顯示
var fenceFeature;
var fenceFeatures = [];
var fenceSource;
var fenceLayer;
var flag_fence = true;
$(".dianzi").click(function () {
    if(flag_fence){
        if($(".myCheck").is(':checked')){
            if(fenceLayer){
                map.removeLayer(fenceLayer);
            }
            var data = {'page.size':100};
            getAjaxRequest("GET", interface_url+"electronic-fence/search", data, eleFenceData, null);
        }
        flag_fence = false;
    }else {
        map.removeLayer(fenceLayer);
        flag_fence = true
    }

});


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
	    	var lonlat = db[i].range.split(",");
	    	if(db[i].shape == "1" ){ //Circle
	    		fenceFeature = new ol.Feature({
	                geometry: new ol.geom.Circle([lonlat[0].split(" ")[0]*1, lonlat[0].split(" ")[1]*1], lonlat[1]*1)
	            });
	    		fenceFeatures.push(fenceFeature);
	    	}
	    	if(db[i].shape == "2"){ //Polygon
                wkt = 'POLYGON((';
	    		 for(let j=0; j<lonlat.length; j++){
	    			 wkt += lonlat[j];
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
	    fenceLayer = new ol.layer.Vector({
	    	source: fenceSource,
		    style: new ol.style.Style({
		        fill: new ol.style.Fill({
		            color: 'rgba(217, 220, 0, 0.3)'
		        }),
		        stroke: new ol.style.Stroke({
		            color: '#fff',
		            width: 2
		        }),
		        image: new ol.style.Circle({
		            radius: 7,
		            fill: new ol.style.Fill({
		                color: '#ffcc33'
		            })
		        })
		    })
		});
	    map.addLayer(fenceLayer);
	}else{
		alert(json.head.status.message);
	}
}


$(function () {
    $(".button_cha").click(function () {
        selectVehTrack();
        /*setTimeout(function () {
            $(".play").css({ display: 'block' });
        }, 3000);*/

    });
    //播放按钮
    /*$("#play_2").click(function () {
        run_carMove = true;
        carMove();
    });*/
    $('#play_2').on('click', function () {
        if (!run_carMove) {
            $('#play_2>span').css({
                'background': 'url("./images/zanting.png") no-repeat left top',
                'background-size': '100% 100%',
                'margin': '11px 10px'
            })
            run_carMove = true
            carMove()

            $('#play_1').on('click',function () {
                if(setTimeoutFlag){
                    clearTimeout(setTimeoutEve);
                }
                speed = 120
                run_carMove = true
                carMove()
            })
            $('#play_3').on('click',function () {
                if(setTimeoutFlag){
                    clearTimeout(setTimeoutEve);
                }
                speed = 30
                run_carMove = true
                carMove()
            })
            $('#replay').off('click').on('click',function (){
                if(setTimeoutFlag){
                    clearTimeout(setTimeoutEve);
                }
                setTimeoutFlag = true
                run_carMove = true
                speed = 60
                index = 0
                carMove()
            })
        } else if (run_carMove) {
            $('#play_2>span').css({
                'background': 'url("./images/play_but.png") no-repeat left top',
                'margin': '11px 15px'
            })
            run_carMove = false
        }
    })
    //删除轨迹按钮
    $('#delete_mark').on('click',function () {
        if(run_carMove){
            $('#play_2').click()
            setTimeout(function () {
                map.removeLayer(carLayer)
                map.removeLayer(lineLayer)
            },300)
        }else {
            map.removeLayer(carLayer)
            map.removeLayer(lineLayer)
        }
        $('.play').css('display','none')
    })
})


//跳转页面前判断用户是否登录
$("#info").on('click',function () {
    infoJumpTo()
})
function jumpTo(p, url) {
    var customerId = sessionStorage.customerId;
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

