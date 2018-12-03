var url = 'http://192.168.1.150:6080/arcgis/services/port_jt/port_tianj/MapServer/WMSServer';
var pos = [13110795.607205058,4719031.500290665];
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

//实例化 map
var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
        center: pos,
        zoom: 17
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
//map.addControl(mousePositionControl);

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
                //设置弹出框内容，可以HTML自定义
                $('#popup-content').html(`<p><span>车辆：</span><span>${info.plate_number}</span></p>
                                            <p><span>部门：</span><span>${info.department.identity_name}</span></p>
                                            <p><span>型号：</span><span>XXX</span></p>
                                            <p><span>时间：</span><span>${info.travel_time}</span></p>
                                            <p><span>平均速度：</span><span>${info.average_velocity}</span></p>
                                            <p><span>总里程：</span><span>${info.total_mileage}&nbsp;,</span>&nbsp;&nbsp;<span>当日里程：</span><span>${info.daily_mileage}</span></p>
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
    var startTime = $('#one_guiji').val().substr(0,19).trim()
    var endTime = $('#one_guiji').val().substr(21,40).trim()

    if(!$('#one_guiji').val()){
        alert('请选择时间范围...')
        return false
    }

    setTimeout(function () {
        $(".play").css({ display: 'block' });
    }, 4000);

	var data = {'vehiclesId':vehicleId, 'startTime':startTime , 'endTime':endTime};
	getAjaxRequest("GET", interface_url+"location/history", data, function(json){
		if(json.head.status.code == 200){
			trackData = json.body[0].packet_data;
			// 折线
	        var lineArray = [];
	        for(var i=0; i<trackData.length; i++){
	            lineArray.push(ol.proj.fromLonLat([trackData[i].data.longitude * 1, trackData[i].data.latitude * 1]));
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
		}else{
			alert(json.head.status.message);
		}
	}, null);
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
    if (trackData.length < 1) {
        alert("没有检测轨迹，请重试")
        return;
    }
	//- 计算角度
    if (index > 0) {
        var ab = "A";
        var a90 = 0;
        var v = getAngle(trackData[index-1].data, trackData[index].data)
        if (trackData[index-1].data.longitude > trackData[index].data.longitude) {
            ab = "A";
            if (trackData[index-1].data.latitude > trackData[index].data.latitude) {
                a90 = 90 * 2;
            } else {
                ab = "B";
                a90 = 90 * 3;
            }
        } else {
            ab = "B";
            if (trackData[index-1].data.latitude > trackData[index].data.latitude) {
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
            geometry: new ol.geom.Point(ol.proj.fromLonLat([trackData[index].data.longitude * 1, trackData[index].data.latitude * 1]))
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