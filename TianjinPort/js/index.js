//version=1.0.0所有请求公用参数

let pageNumber = 1 ; //当前页数
let pageSize = 8; //每页显示条数
let pages = 0; //总页数

(function (w) {
    //判断用户是否登录 请求数据接口已经判断过了
    /*const customerId = sessionStorage.customerId
    if(!customerId){
        alert('您尚未登录，请登录')
        location.href="./login.html"
    }*/

    //时间范围选择
    //日期
    /*laydate.render({
        elem: '#one_guiji'
        , type: 'datetime'
        //, format: 'M/d/H:m'
    })
    laydate.render({
        elem: '#one_guiji1'
        , type: 'datetime'
    })*/
    /*laydate.render({
        elem: '#test16'
        ,type: 'datetime'
        ,range: '到'
        ,format: 'yyyy年M月d日H时m分s秒'
    });*/
    //开始时间
    var start
    var end
    start = laydate.render({
        elem: '#one_guiji',
        type: 'datetime',
        btns: ['confirm'],
        min: '1900-1-1 00:00:00',
        //max: 'nowTime',
        max:getNowFormatDate(),

    trigger: 'click', //采用click弹出
        done: function (value, date, endDate) {
            //console.log(value)
            if(value !== ''){
                end.config.min = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                };//开始日选好后，重置结束日的最小日期
                end.config.value = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                }; //将结束日的初始值设定为开始日
                //console.log(value)
                end.config.max = getDateArray(date)
            }else {
                end.config.max.year = '';
                end.config.max.month = '';
                end.config.max.date = '';
            }

        }
    });
    //结束时间
    end = laydate.render({
        elem: '#one_guiji1',
        type: 'datetime',
        btns: ['confirm'],
        min: '1900-1-1 00:00:00',
        max: getNowFormatDate(),
        trigger: 'click', //采用click弹出
        done: function (value, date, endDate) {
            if(value !== ''){
                start.config.max = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                }; //结束日选好后，重置开始日的最大日期
                start.config.min = getDateArrayBefore(date)
            }else {
                start.config.min.year = '';
                start.config.min.month = '';
                start.config.min.date = '';
            }

        }
    });
    function getDateArray(date){//获取时间数组
        var darray = {};
        darray.year = date.year;
        darray.month = date.month - 1;
        var day = date.date;
        /*if(date.hours == 0 && date.minutes == 0 && date.seconds == 0){
            day = day + 1;
        }else{
            darray.hours = date.hours;
            darray.minutes = date.minutes;
            darray.seconds = date.seconds;
        }*/
        darray.date = day + 1;
        darray.hours = date.hours;
        darray.minutes = date.minutes;
        darray.seconds = date.seconds;
        var darrayMsS = `${darray.year}/${darray.month+1}/${darray.date} ${darray.hours}:${darray.minutes}:${darray.seconds}`
        var darrayMs = (new Date(darrayMsS)).getTime();
        if(darrayMs>new Date().getTime()){
            darray = {
                year:new Date().getFullYear(),
                month:new Date().getMonth(),
                date:new Date().getDate(),
                hours:new Date().getHours(),
                minutes:new Date().getMinutes(),
                seconds:new Date().getSeconds()
            }
        }
        return darray;
    }
    function getDateArrayBefore(date){//获取时间数组
        var darray = {};
        darray.year = date.year;
        darray.month = date.month - 1;
        var day = date.date;
        darray.date = day - 1;
        if(day==1){
            darray.month = date.month - 2;
            if(darray.month==3||darray.month==7||darray.month==8||darray.month==10){
                darray.date = 30;
            }else if(darray.month==1){
                darray.year%4==0?darray.date = 29:darray.date = 28
            }else {
                darray.date = 31;
            }

        }
        darray.hours = date.hours;
        darray.minutes = date.minutes;
        darray.seconds = date.seconds;
        return darray;
    }
    $('.button_dao').on("click",function(){
        $('#one_guiji,#one_guiji1').prop("value","");
        start.config.max = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            date: new Date().getDate(),
            hours: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds : new Date().getSeconds()
        }
        end.config.max = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            date: new Date().getDate(),
            hours: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds : new Date().getSeconds()
        }
        start.config.min = {}
        end.config.min = {}
        mintime = 0
        $ball.css('transform',`translate(0px,-6px)`)
        speed = 60
        $('#delete_mark').click()
    })

    //在线监测与轨迹切换
    let $tab = $('.right_content>:nth-child(1)>p')
    $tab.on('click', function () {
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
                        map.removeLayer(lineLayer1)
                    },300)
                }else {
                    map.removeLayer(carLayer)
                    map.removeLayer(lineLayer)
                    map.removeLayer(lineLayer1)
                }
                $('.play').css('display','none')
                $('.play_text').css('display','none')
            }
	    })

    // 获取车辆实时状态
    var data = {'state': 2, 'page.number':pageNumber, 'page.size':pageSize,'v':new Date().getTime()}
    getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null)

    // 获取车辆实时位置信息
    var vehiclesId = []
    getAjaxRequest("GET", interface_url+"vehicle/search", {state:2}, getVehicleBusy, null)
    function  getVehicleBusy (json){
        if(json.head.status.code == 200){
            var vehicleList = json.body.results
            for(var i=0;i<vehicleList.length;i++){
                vehiclesId.push(vehicleList[i].vehicle_id)
            }
        }
        var data = {'vehiclesId':vehiclesId};
        getAjaxRequest("GET", interface_url+"location/realtime", data, realTimeCarData, null);
    }

   
    //获取部门添加到select里
    let getVehicleData = {
        'page.number':1,
        'page.size':6,
        pages:0,
        departmentId:2
    }
    getAjaxRequest("GET", interface_url+"department/search", null, getDepartment, null);
    function getDepartment (json) {
        if(json.head.status.code == 200){
            $('#a2').empty()
            for(let i=0;i<json.body.list.length;i++){
                $('#a2').append(`<option value=${json.body.list[i].department_id}>
                                    ${json.body.list[i].identity_name}</option>`)
            }
        }

    }

    //轨迹查询选择车辆列表
    getAjaxRequest("GET", interface_url+"vehicle/search", getVehicleData, getVehicleList, null)
    //按部门查找
    $('#a2').on('change',function () {
        $('.next_wrap3>:last-child').addClass('page_on').removeClass('page_on_not')
        getVehicleData.departmentId = $('#a2').val()
        getAjaxRequest("GET", interface_url+"vehicle/search", getVehicleData, getVehicleList, null)
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

    function getVehicleList (json) {
        //console.log(json)
        if(json.head.status.code == 200){
            getVehicleData.pages = json.body.pages
            if(getVehicleData.pages<2){
                $('.next_wrap3>:last-child').removeClass('page_on').addClass('page_on_not')
                $('.next_wrap3>:first-child').removeClass('page_on').addClass('page_on_not')
            }else {
                $('.next_wrap3>:last-child').removeClass('page_on_not').addClass('page_on')
                $('.next_wrap3>:first-child').removeClass('page_on').addClass('page_on_not')
            }
            $('.list_che2').empty()
            for (let i = 0; i < json.body.results.length; i++) {
                $('.list_che2').append(`<li>
                                <input name="vehicle_radio" type="radio" 
                                    value=${json.body.results[i].vehicle_id} id="myCheck2${i}" class="myCheck">
                                <label for="myCheck2${i}" class="vehicle_radio_label"></label>
                                <p>${json.body.results[i].plate_number}</p>
                                <div class=${json.body.results[i].state==2?'red_ball':
                                json.body.results[i].state==1?'green_ball':'gray_ball'}></div>
                            </li>`)
            }
            //$('input[name="vehicle_radio"][value="1"]').attr('checked',true)
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
    //textTip($('#play_1'),'0.5X播放')
    //textTip($('#play_2'),'播放')
    //textTip($('#play_3'),'2X播放')
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
    $('.lst').addClass('page_on').removeClass('page_on_not')
    $('.fst').addClass('page_on_not').removeClass('page_on')
    var vehicleData = {state: $("#state_car").val(), 'page.number':1, 'page.size':pageSize} ;
	getAjaxRequest("GET", interface_url+"vehicle/search", vehicleData, rltCarState, null);
	if($("#state_car").val()!=2){
	    $('.button_gen').hide()
    }else {
        $('.button_gen').show()
    }
});

//车辆列表展示， 成功回调函数
function rltCarState(json){
	if(json.head.status.code == 200){
		$('.list_che').empty();
		var cars = json.body.results;
		pages = json.body.pages;
		if(pages < 2){
            $('.lst').addClass('page_on_not').removeClass('page_on')
        }
		for (var i = 0; i < cars.length; i++) {
			 $('.list_che').append(`<li>
                     <input type="checkbox" value=${cars[i].vehicle_id} id="myCheck2+${i}" class="myCheck">
                     <label for="myCheck2+${i}"></label>
                     <p class="itemCar" value=${cars[i].vehicle_id}>${cars[i].plate_number}</p>
                     <div class=${cars[i].state==2?'red_ball':
                            cars[i].state==1?'green_ball':'gray_ball'}></div>
                 </li>`)   
	    }
	    //地图平移到车的位置，还未实现
	    $('.itemCar').on('click',function () {
            let getCarData = {
                vehiclesId:$(this).attr('value')
            }
            getAjaxRequest("GET", interface_url+"location/realtime", getCarData, thisCarState, null);
            function thisCarState (json){
                if(json.head.status.code == 200){
                    let lon = json.body[0].data[0].data.longitude
                    let lat = json.body[0].data[0].data.latitude
                    //setMapView(13110795.607205058,4719031.500290665)
                    console.log(lon*100000,lat*100000)
                    //setMapView(13110895.607205058,4719131.500290665)
                }
            }
        })
	}else{
        new $Msg({
            content:json.head.status.message,
            type:"success",
            cancle:function(){
                location.href="./login.html";
            },
            confirm:function(){
                location.href="./login.html";
            }
        })
		//alert(json.head.status.message);
        //location.href="./login.html";
	}
}

//上一页事件处理
$('.fst').click(function () {
	if(pageNumber > 1){
        $('.lst').addClass('page_on').removeClass('page_on_not')
		pageNumber--;
		var data = {state: $("#state_car").val(), 'page.number':pageNumber, 'page.size':pageSize} ;
		getAjaxRequest("GET", interface_url+"vehicle/search", data, rltCarState, null);
        if(pageNumber == 1){
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
    data.vehiclesId = []
    $.each($('.list_che .myCheck:checked'),function () {
        data.vehiclesId.push($(this).val())
    })
    if(data.vehiclesId.length<1){
        //alert('请选择车辆...')
        new $Msg({
            content:"请选择车辆...",
            type:"success",
            cancle:function(){
                /*let cancle = new $Msg({
                    content:"我是取消后的回调"
                })*/
            },
            confirm:function(){
                //new $Msg({content:"我是确定后的回调"})
            }
        })
        return false
    }
	if(bool){
		bool = false;
		tmp = setInterval(getCurData, 500);
		$('.button_gen').html('<p>暂&nbsp;&nbsp;&nbsp;&nbsp;停</p>');
	}else{
		bool = true;
		clearInterval(tmp);
        $('.button_gen').html('<p>跟&nbsp;&nbsp;&nbsp;&nbsp;踪</p>');
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
		var curDatas = json.body
		for (var i = 0; i < curDatas.length; i++) {
			var vid = curDatas[i].vehicle_id
			var vdata = curDatas[i].data[0].values
			var vtime = curDatas[i].data[0].time
			insertMapPoint(features, vdata, vid)
	    }
	    //console.log(curDatas[0].packet_data[0].values.direction)
		//增加新的坐标点，并更新地图
		source.addFeatures(features)
	    map.updateSize()
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
//默认显示围栏
fence_show()
$(".dianzi").click(function () {
    fence_show()
});
function fence_show() {
    if(flag_fence){
            if(fenceLayer){
                map.removeLayer(fenceLayer);
            }
            var data = {
                'page.size':100,
                validTime:getNowFormatDate()
            };
            getAjaxRequest("GET", interface_url+"electronic-fence/search", data, eleFenceData, null);
        flag_fence = false;
    }else {
        map.removeLayer(fenceLayer);
        flag_fence = true

    }
}




function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}
//地图上加载电子围栏数据
function eleFenceData(json){
    fenceFeatures = []
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
		            color: 'rgba(0, 0, 255, 0.2)'
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
		//alert(json.head.status.message);
	}
}

$(function () {
    //查询历史轨迹时间选择点击
    /*$('#one_guiji').on('click',function () {
        $(".play").css({ display: 'none' })
    })*/
    $(".button_cha").click(function () {
        if(!$('.play').is(':hidden')){
            return false
        }
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
            clearTimeout(setTimeoutEve)
            clearTimeout(timer)
            run_carMove = true
            carMove()
            //speedBarMove()
            TimeTextChange()
        } else if (run_carMove) {
            $('#play_2>span').css({
                'background': 'url("./images/play_but.png") no-repeat left top',
                'margin': '11px 15px'
            })
            run_carMove = false
        }
    })
    $('#play_1').on('click',function () {
        if(run_carMove){
            if(setTimeoutFlag){
                clearTimeout(setTimeoutEve);
            }
            speed = speed * 2
            run_carMove = true
            carMove()
            if(speed > 240){
                speed = 240
                $('.tip_window').text(`最小${60/speed}倍播放`)
                $('.tip_window').addClass('show_flash')
            }else {
                $('.tip_window').text(`当前${60/speed}倍播放`)
                $('.tip_window').addClass('show_flash')
            }

            setTimeout(function () {
                $('.tip_window').text('')
                $('.tip_window').removeClass('show_flash')
            },1800)
        }

    })
    $('#play_3').on('click',function () {
        if(run_carMove){
            if(setTimeoutFlag){
                clearTimeout(setTimeoutEve);
            }
            speed = speed / 2
            run_carMove = true
            carMove()
            if(speed < 7.5){
                speed = 7.5
                $('.tip_window').text(`最大${60/speed}倍播放`)
                $('.tip_window').addClass('show_flash')
            }else {
                $('.tip_window').text(`当前${60/speed}倍播放`)
                $('.tip_window').addClass('show_flash')
            }

            setTimeout(function () {
                $('.tip_window').text('')
                $('.tip_window').removeClass('show_flash')
            },1800)
        }

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
        TimeTextChange()
        $('#play_2>span').css({
            'background': 'url("./images/zanting.png") no-repeat left top',
            'background-size': '100% 100%',
            'margin': '11px 10px'
        })
    })

    //删除轨迹按钮
    $('#delete_mark').on('click',function () {
        if(run_carMove){
            $('#play_2').click()
            setTimeout(function () {
                map.removeLayer(carLayer)
                map.removeLayer(lineLayer)
                map.removeLayer(lineLayer1)
                $('.time_real').empty()
            },300)
        }else {
            map.removeLayer(carLayer)
            map.removeLayer(lineLayer)
            map.removeLayer(lineLayer1)
            $('.time_real').empty()
        }
        $('.play').css('display','none')
        $('.play_text').css('display','none')
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
//自定义弹窗
$('.alert_c').on("click",()=>{
    new $Msg({
        content:"我的自定义弹窗好了",
        type:"success",
        cancle:function(){
            let cancle = new $Msg({
                content:"我是取消后的回调"
            })
        },
        confirm:function(){
            new $Msg({content:"我是确定后的回调"})
        }
    })
})