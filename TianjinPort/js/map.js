var url = 'http://192.168.1.150:6080/arcgis/services/port_jt/port_tianj/MapServer/WMSServer';
var pos = [13110795.607205058,4719031.500290665];
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

var drawType = "Polygon";

//点击兴趣点弹出框使用
const overlay = new ol.Overlay({
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

//var mousePositionControl = new ol.control.MousePosition({
//    //样式类名称
//    className: 'mosuePosition',
//    //投影坐标格式，显示小数点后边多少位
//    coordinateFormat: ol.coordinate.createStringXY(8),
//    //指定投影
//    projection: 'EPSG:4326',
//    //目标容器
//    target:document.getElementById('myposition')
//});
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
    	var data = {'vehicleId': feature.getId()} ;
    	getAjaxRequest("GET", interface_url+"vehicle/get", data, function(json){
    		if(json.head.status.code == 200){
    			var info = json.body;
    			console.log(info.vehicle_id)
    			console.log(info.plate_number)
    			console.log(info.department.identity_name)
    			msg = info.vehicle_id +"\n"+ info.plate_number +"\n"+ info.department.identity_name; 
    			console.log(msg)
    		}else{
    			alert(json.head.status.message);
    		}
    	}, null);
        //coodinate存放了点击时的坐标信息
        var coodinate = e.coordinate;
        //设置弹出框内容，可以HTML自定义
        content.innerHTML = msg;
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


var temp = {};
temp["start"] = { x: 117.77073383331297, y: 38.980696043880016 };
temp["start_difference"] = {};

//轨迹
var line = null;
var trackData = [];
// $(function () {
var carTrack = function () {
    $.ajax({
        type: "get",
        url: "http://192.168.20.23:8282/vehperpos/lbs/gettrack.shtml",
        data: {
            starttime: "2017-10-28 12:41:00",
            endtime: "2017-10-28 18:24:52",
            uuid: "MA200001164"
        },
        cache: true,
        dataType: "json"
    }).done(function (result, textStatus, jqXHR) {
        trackData = result;

        //- 折线
        var lineArray = [];
        trackData.forEach(function (element, k) {
            if (k == 0) {
                temp["start_difference"] = { x: temp["start"].x - element.x, y: temp["start"].y - element.y };
                // console.log(element);
                // console.log(temp);
                // return false;
            }
            element.x += temp["start_difference"].x;
            element.y += temp["start_difference"].y;

            lineArray.push(ol.proj.fromLonLat([element.x, element.y]));
        });
        if (line)
            line.clear()//清除

        line = new ol.source.Vector();
        line.addFeature(new ol.Feature({
            name: "折线",
            geometry: new ol.geom.LineString(lineArray)
        }));

        map.addLayer(new ol.layer.Vector({
            source: line,
            style: [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#0014ff',
                    width: 1
                })
            })]
        }));

        // run_carMove = false;
        n = 0;

        // run_carMove = true;
        if (run_carMove)
            carMove();
    });
}

var car1 = new ol.source.Vector();
//模拟轨迹
var saoguan = null;
var n = 0;
var run_carMove = false;
//- 速度
var speed = 60;

// 图标样式
var icon_1 = new ol.style.Style({
    image: new ol.style.Icon({
        color: "white",
        src: "/img/icon/1.png",
        rotation: 0
    })
});
var icon_Vector = null;

var carMove = function () {
    if (trackData.length < 1) {
        alert("没有检测轨迹，请重试")
        return;
    }
    //- 计算角度
    if (n > 0) {
        var ab = "A";
        var a90 = 0;
        var v = getAngle(trackData[n - 1], trackData[n])
        if (trackData[n - 1].x > trackData[n].x) {
            ab = "A";
            if (trackData[n - 1].y > trackData[n].y) {
                a90 = 90 * 2;
            } else {
                ab = "B";
                a90 = 90 * 3;
            }
        } else {
            ab = "B";
            if (trackData[n - 1].y > trackData[n].y) {
                a90 = 90 * 1;
            } else {
                ab = "A";
                a90 = 0;
            }
        }
        var Av = a90 + v[ab];
        if (v.A != 0 && v.B != 0) {
            icon_1 = new ol.style.Style({
                image: new ol.style.Icon({
                    color: "white",
                    src: "/img/icon/1.png",
                    rotation: Math.PI / 180 * Av
                })
            });
        }

        map.removeLayer(icon_Vector);
        icon_Vector = new ol.layer.Vector({
            name: "图标",
            source: car1,
            style: [icon_1]
        });
        map.addLayer(icon_Vector);

        if (saoguan)
            car1.removeFeature(saoguan);

        saoguan = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([trackData[n].x, trackData[n].y]))
        });
        saoguan.on('click', function (event) {
            // alert("头像");
        });
        car1.addFeature(saoguan);
    }


    n += 1;
    if (!trackData[n]) {
        n = 0;
    }

    if (run_carMove) {
        setTimeout(carMove, speed);
    }
}
// });


//func.js 亮点坐标计算
var getAngle = function (A, B) {
    var x1 = A.x;
    var y1 = A.y;
    var x2 = B.x;
    var y2 = B.y;

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