//var url = 'http://192.168.1.150:6080/arcgis/services/port_jt/port_tianj/MapServer/WMSServer';

/*var url = 'https://geohey.com/s/dataviz/6c2d884bc36d5940300caa58a762167f/' +
    '{z}/{x}/{y}.png?ak=OGJkMGQwNTVlNzYzNDA0NmIwNDYxZDY4YjQwYmJlYzc&retina=@2x';*/
var url = 'https://geohey.com/s/dataviz/cca1897d38bb3b2c8523d48e5def0a69/' +
    '{z}/{x}/{y}.png?ak=OGJkMGQwNTVlNzYzNDA0NmIwNDYxZDY4YjQwYmJlYzc&retina=@2x';

//var pos = [13110795.607205058,4719031.500290665];
var pos = ol.proj.transform([117.78688073,38.98251417], 'EPSG:4326', 'EPSG:3857');
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

var drawType = "Polygon";

var features = []

//点击兴趣点弹出框使用
var overlay = new ol.Overlay({
    element: container,//设置弹出框的容器
    autoPan: true, //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    autoPanAnimation: {
        duration: 250
    }
});

//地图layer配置， 可以多个layer
var layers = [
    new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            params: {
                'LAYERS': '0,1,2,3,4,5,6,7,8,9',
                'TILED': false
            },
            url: url,
            projection: 'EPSG:3857',
            serverType: 'mapserver'
        })
    })
];

//ma 18.12.20
var layers = [
    //谷歌卫星底图
    new ol.layer.Tile({
        source: new ol.source.XYZ({
            url:'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'//谷歌卫星地图 混合
        }),
        projection: 'EPSG:3857'
    }),

    //极海
    new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: url,//添加GeoHey地图
            tilePixelRatio: 2,//表示加载高清图显示
            crossOrigin:null
        })
    }),
];
//end

//实例化 map
var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
        center: pos,
        zoom: 16
    }),
    overlays: [
        overlay
    ],
    interactions: new ol.interaction.defaults({
        doubleClickZoom: false,
    })
});
var map_res = new ol.Map({
    layers: layers,
    target: 'map_res',
    view: new ol.View({
        center: pos,
        zoom: 16
    }),
    interactions: new ol.interaction.defaults({
        doubleClickZoom: false,
    })
});

var mousePositionControl = new ol.control.MousePosition({
    //样式类名称
    className: 'mosuePosition',
    //投影坐标格式，显示小数点后边多少位
    coordinateFormat: ol.coordinate.createStringXY(8),
    //指定投影
    projection: 'EPSG:4326',
    //目标容器
    target:document.getElementById('myposition')
});
//map.addControl(mousePositionControl);//鼠标点的经纬度

// map 比例尺
var scaleLineControl = new ol.control.ScaleLine({
    //设置度量单位为米
    units: 'metric',
    target: 'scalebar',
    className: 'ol-scale-line'
});
map.addControl(scaleLineControl);

//定义保存动态GIS数据 矢量容器
var source = new ol.source.Vector({
    features: features
});

//动态生成矢量层
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(217, 220, 0, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: '#000',
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
map.addLayer(vector);
// source.clear();

//矢量图层鼠标点击事件
map.on('click', function(e) {
    //在点击时获取像素区域
    var pixel = map.getEventPixel(e.originalEvent);
    var msg ;
    map.forEachFeatureAtPixel(pixel, function(feature) {
    	if(feature.getId() == null){
    		return;
    	}
    	var data = {'vehicleId': feature.getId()} ;
    	getAjaxRequest("GET", interface_url+"vehicle/get", data, function(json){
    		if(json.head.status.code == 200){
    			var info = json.body;
    			/*console.log(info.vehicle_id)
    			console.log(info.plate_number)
    			console.log(info.department.identity_name)*/
    			msg = info.vehicle_id +"\n"+ info.plate_number +"\n"+ info.department.identity_name; 
    			//console.log(info)
                //设置弹出框内容，可以HTML自定义 //<p><span>型号：</span><span>${info.model_number}</span></p>
                $('#popup-content').html(`<p><span>车辆：</span><span>${info.plate_number}</span></p>
                                            <p><span>部门：</span><span>${info.department.identity_name}</span></p>
                                            
                                            <p><span>时间：</span><span>${info.gather_time}</span></p>
                                            <p><span>当前速度：</span><span>${info.velocity}km/h</span></p>
                                            <p><span>总里程：</span><span>${info.total_mileage}km&nbsp;,</span>&nbsp;&nbsp;<span>当日里程：</span><span>${info.daily_mileage}km</span></p>
                                            <p><span>状态：</span><span>${info.state==1?'空闲':info.state==2?'忙碌':'离线'}</span></p>`)
    		}else{
    			alert(json.head.status.message);
    		}
    	}, null);
        //coodinate存放了点击时的坐标信息
        var coodinate = e.coordinate;

        //设置overlay的显示位置
        overlay.setPosition(coodinate);
        //显示overlay
        map.addOverlay(overlay);
    });
});

//popup关闭事件
closer.addEventListener('click', function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
});

////为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
//map.on('pointermove', function (e) {
//    var pixel = map.getEventPixel(e.originalEvent);
//    var hit = map.hasFeatureAtPixel(pixel);
//    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
//})

var draw, snap;
var temp;
function addInteractions() {
    draw = new ol.interaction.Draw({
        geometryName: "draw01",
        source: source,
        type: drawType
    });

    map.addInteraction(draw);

    draw.on("drawend", function (e) {
        var graphical = {};
        if (e.feature.getGeometry().getType() == "Circle") {
            graphical = {
                name: "Circle",
                data: [e.feature.getGeometry().getCenter(), e.feature.getGeometry().getRadius()]
            }
        } else {
            graphical = {
                name: "Polygon",
                data: e.feature.getGeometry().getCoordinates()
            }
        }
        //temp = e.feature.getGeometry();
        $.cookie('coordinate', JSON.stringify(graphical));
    });
    snap = new ol.interaction.Snap({ source: source });
    map.addInteraction(snap);

    var modify = new ol.interaction.Modify({
        source: source,
    });
    map.addInteraction(modify);
    modify.on("modifyend", function (e) {
        var graphical = {};
        if (e.feature.getGeometry().getType() == "Circle") {
            graphical = {
                name: "Circle",
                data: [e.feature.getGeometry().getFirstCoordinate(), e.feature.getGeometry().getRadius()]
            }
        } else {
            graphical = {
                name: "Polygon",
                data: e.feature.getGeometry().getCoordinates()
            }
        }
        console.log(JSON.stringify(graphical));
        $.cookie('coordinate', JSON.stringify(graphical));
    })
}
//- draw.T
$(".addrail").click(function () {
    addInteractions();
});
$(".outrail").click(function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
});


//轨迹
var lineSources = null;
var lineLayer = null;
var trackData = [];

//车辆轨迹查询事件
function selectVehTrack(){
    var vehicleId = $('input[name="vehicle_radio"]:checked').val()
    /*var startTime = '2018-11-06 14:30:01'
    var endTime = '2018-11-06 14:40:01'*/
    var startTime = $('#one_guiji').val()//.substr(0,19).trim()
    var endTime = $('#one_guiji1').val()//.substr(21,40).trim()

    if(!vehicleId){
        alert('请选择车辆...')
        return false
    }
    if(!$('#one_guiji').val()){
        alert('请选择起始时间...')
        return false
    }
    if(!$('#one_guiji1').val()){
        alert('请选择结束时间...')
        return false
    }

    $(".play_text").text('正在查询，请稍后......')
    $(".play_text").css({ display: 'block' })

    /*setTimeout(function () {
        $(".play").css({ display: 'block' });
    }, 4000);*/
    speedBar(startTime,endTime)
	var data = {'vehiclesId':vehicleId, 'startTime':startTime , 'endTime':endTime};
	getAjaxRequest("GET", interface_url+"location/history", data, function(json){
		if(json.head.status.code == 200){
		    if(json.body[0].data.length < 1){
		        alert('当前时间范围内没有数据')
                $(".play_text").text('')
                return false
            }
            $(".play").css({ display: 'block' })
            $(".play_text").text('模拟轨迹')
            $(".play_text").css({ display: 'block' })
			trackData = json.body[0].data.reverse();
			// 折线
	        var lineArray = [];
	        for(var i=0; i<trackData.length; i++){
	            lineArray.push(ol.proj.fromLonLat([trackData[i].values.longitude * 1, trackData[i].values.latitude * 1]));
	        }
	        if (lineSources){
	        	lineSources.clear()//清除
	        }
	        lineSources = new ol.source.Vector();
	        lineSources.addFeature(new ol.Feature({
	            name: "line",
	            geometry: new ol.geom.LineString(lineArray)
	        }));
	        lineLayer = new ol.layer.Vector({
	            source: lineSources,
	            style: [new ol.style.Style({
	                stroke: new ol.style.Stroke({
	                    color: '#0014ff',
	                    width: 2
	                })
	            })]
	        });
	        map.addLayer(lineLayer);
            //点 测试
            /*var lineSources1
            if (lineSources1){
                lineSources1.clear()//清除
            }

            lineSources1 = new ol.source.Vector();
            for(var i=0; i<trackData.length; i++){
                //lineArray.push(ol.proj.fromLonLat([trackData[i].values.longitude * 1, trackData[i].values.latitude * 1]));
                lineSources1.addFeature(new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([trackData[i].values.longitude * 1, trackData[i].values.latitude * 1]))
                }));
            }


            lineLayer1 = new ol.layer.Vector({
                source: lineSources1,
                style: [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius:2,
                        stroke:new ol.style.Stroke({
                            color:'red',
                            width:2
                        })
                    })
                })]
            });
            map.addLayer(lineLayer1);*/


		}else{
			alert(json.head.status.message);
		}
	}, null);
}

//进度条组件
var time_slot  = 30*1000 //时间范围 最后删值
var timer  //定时器
var $ball = $('.speed_box>:nth-child(2)>img') //进度条小球
var bar_w = $('.speed_box>:nth-child(2)').width() - 16 //进度条长

var mintime = 0
var maxtime = 30 //测试 最后删值
var ball_speed = 5.13333333334 //测试 最后删值

var time_interval = 1000
//显示总时长
function speedBar(start,end) {
    var date = new Date(start.replace(/-/g, '/'))
    var start_time = Date.parse(date)
    var date_end = new Date(end.replace(/-/g, '/'))
    var end_time = Date.parse(date_end)
    time_slot = end_time - start_time
    var result = formatDuring(time_slot/1000)
    $('.speed_box>:last-child').text(result)
    maxtime = time_slot / 1000
    ball_speed = bar_w / maxtime //测试 最后删
}

//前后时间及进度条变化
function speedBarMove(){
    //console.log(maxtime)
    function CountDown() {
         if (maxtime >= 0) {
             var ball_distance = Math.round(ball_speed * mintime)
             $ball.css('transform',`translate(${ball_distance}px,-6px)`)
             let msg = formatDuring(maxtime)
             maxtime--

             $('.speed_box>:last-child').text(msg)
             let msg_before = formatDuring(mintime)
             mintime++

             $('.speed_box>:first-child').text(msg_before)
         }else{
               clearInterval(timer)
               $ball.css('transform',`translate(0px,-6px)`)
               //alert("时间到!")
               mintime = 0
               maxtime = time_slot / 1000
               let msg = formatDuring(maxtime)
               $('.speed_box>:last-child').text(msg)
               let msg_before = formatDuring(mintime)
               $('.speed_box>:first-child').text(msg_before)
               run_carMove = false
               index = 0
               $('#play_2>span').css({
                 'background': 'url("./images/play_but.png") no-repeat left top',
                 'margin': '11px 15px'
                 })
               }
         }
    timer = setInterval(CountDown, time_interval)
}
//进度条拖动
$(function () {
    var tag = false,ox = 0, left = 0
    $ball.mousedown(function(e) {
        e.preventDefault()
        left = $ball.css("transform").replace(/[^0-9\-,]/g,'').split(',')[4] *1
        ox = e.pageX - left
        tag = true
    })
    $(document).mouseup(function() {
        tag = false
    })
    $('.speed_box').mousemove(function(e) {
        var maxtime_fixed = time_slot / 1000
        if (tag) {
            e.preventDefault()
            left = e.pageX - ox
            if (left <= 0) {
                left = 0
            }else if (left > bar_w) {
                left = bar_w
            }
            $ball.css('transform',`translate(${left}px,-6px)`)
            var maxtime_change = Math.round((bar_w-left) * maxtime_fixed / bar_w)
            maxtime = maxtime_change
            var msg = formatDuring(maxtime_change)
            $('.speed_box>:last-child').text(msg)
            var mintime_change = Math.round(left * maxtime_fixed / bar_w)
            mintime = mintime_change
            var msg_before = formatDuring(mintime_change)
            $('.speed_box>:first-child').text(msg_before)
        }
    })

})
//秒转成时间格式
function formatDuring(mss) {
    //var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = Math.floor(mss / 60 / 60);
    var minutes = Math.floor(mss / 60 % 60);
    var seconds = Math.floor(mss % 60);
    if(hours<10){
        hours = '0' + hours
    }
    if(minutes<10){
        minutes = '0' + minutes
    }
    if(seconds<10){
        seconds = '0' + seconds
    }
    return hours + ":" + minutes + ":" + seconds;
    //return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
}
//模拟轨迹
var carLayer = null;
var carSource = new ol.source.Vector();
//图标样式
var carStyle = new ol.style.Style({
    image: new ol.style.Icon({
        color: "white",
        src: "/img/icon/1.png",
        rotation: 45
    })
});

var pos = null;
var run_carMove = false;
//- 速度
var speed = 60;
var index = 0;
var setTimeoutFlag = false;
var setTimeoutEve
var carMove = function () {
    $('.time_real').text(trackData[index].time.substring(0,16))
    if (trackData.length < 1) {
        //alert("没有检测轨迹，请重试")
        return;
    }
	//- 计算角度
    if (index > 0) {
        var ab = "A";
        var a90 = 0;
        var v = getAngle(trackData[index-1].values, trackData[index].values)
        if (trackData[index-1].values.longitude > trackData[index].values.longitude) {
            ab = "A";
            if (trackData[index-1].values.latitude > trackData[index].values.latitude) {
                a90 = 90 * 2;
            } else {
                ab = "B";
                a90 = 90 * 3;
            }
        } else {
            ab = "B";
            if (trackData[index-1].values.latitude > trackData[index].values.latitude) {
                a90 = 90 * 1;
            } else {
                ab = "A";
                a90 = 0;
            }
        }
        var Av = a90 + v[ab];
        if (v.A != 0 && v.B != 0) {
        	carStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    color: "white",
                    src: "/img/icon/1.png",
                    rotation: Math.PI / 180 * Av
                })
            });
        }
        map.removeLayer(carLayer);
        carLayer = new ol.layer.Vector({
            name: "图标",
            source: carSource,
            style: [carStyle]
        });
        map.addLayer(carLayer);

        if (pos)
        	carSource.removeFeature(pos);

        pos = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([trackData[index].values.longitude * 1, trackData[index].values.latitude * 1]))
        });
        carSource.addFeature(pos);
    }
    index += 1 ;
    if (!trackData[index]) {
    	index = 0;
    }
    if (run_carMove) {
        setTimeoutEve = setTimeout(carMove, speed);
        setTimeoutFlag = true
    }
}

//func.js 亮点坐标计算
var getAngle = function (A, B) {
    var x1 = A.longitude;
    var y1 = A.latitude;
    var x2 = B.longitude;
    var y2 = B.latitude;

    var a = Math.abs(x1 - x2);
    var b = Math.abs(y1 - y2);
    if (a === 0 || b === 0) {
        return {
            A: 0,
            B: 0,
            C: 0,
            ab: { A, B }
        }
    }
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    var randianToAngle = function (scale) {
        var radian = Math.acos(scale);
        var angle = 180 / Math.PI * radian;
        return Math.round(angle);
    }
    var angleA = randianToAngle(b / c);
    var angleB = randianToAngle(a / c);
    return {
        A: angleA,
        B: angleB,
        C: 90,
        ab: { A, B }
    }
}