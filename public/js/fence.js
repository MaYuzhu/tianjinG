(function (w) {
    //选择时间范围input
    laydate.render({
        elem: '#weilan_add'
        ,type: 'datetime'
        ,range: '~'
        ,format: 'M/d/H:m'
    });

    //起始时间
    laydate.render({
    elem: '#add_right_start'
    });
    laydate.render({
    elem: '#add_right_end'
    });

    //翻页三角
    $('footer').on('click',function (ev) {
        var $target = $(ev.target);
        if($target.prop("nodeName") == "DIV"){
            $('footer>div').removeClass('on4')
            $target.addClass("on4");
        }
    })
    //翻页三角2
    $('.add3_next').on('click',function (ev) {
        var $target = $(ev.target);
        if($target.prop("nodeName") == "DIV"){
            $('.add3_next>div').removeClass('on5')
            $target.addClass("on5");
        }
    })
    //添加围栏>添加车辆表格
    for(let i=0;i<8;i++){
        $('.table2').append(`<tr>
                            <td><input id="table2_${i}" type="checkbox"><label for="table2_${i}"></label></td>
                            <td>1</td>
                            <td>拖车A13451</td>
                            <td>空闲</td>
                            <td>XXX</td>
                            <td>李XX</td>
                            <td>13145613214</td>
                        </tr>`)
    }

    var flag = true
    //添加围栏按钮
    $('.add_wei').on('click',function () {
        if(flag){
            $('.table1').css('display','none')
            $('.add_1').css('display','flex')
            $('.add_right').css('display','block')
            if($('.add_right').css('display')!=='none'){
                $('.step span:nth-child(1)').addClass('active')
            }
        }
        flag = false
    })
    //取消1
    $('.add_right1_quxiao').on('click',function () {
        $('.table1').css('display','table')
        $('.add_1').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //保存并继续1
    $('.add_right1_next').on('click',function () {
        $('.add_right').css('display','none')
        $('.add_right_2').css('display','block')
        $('.add_right_4').css('display','none')
        $('.add_right_3').css('display','none')
        if($('.add_right_2').css('display')!=='none'){
            $('.step span').removeClass('active')
            $('.step span:nth-child(2)').addClass('active')
        }
    })
    //取消2
    $('.add_right_2_quxiao').on('click',function () {
        $('.table1').css('display','table')
        $('.add_1').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //上一步2
    $('.add_right_2_prev').on('click',function () {
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.add_right').css('display','block')
        $('.step span').removeClass('active')
        $('.step span:nth-child(1)').addClass('active')
    })
    //保存继续2
    $('.add_right_2_next').on('click',function () {
        var getCoordinate = $.cookie('coordinate');
        if (!getCoordinate || getCoordinate == null || getCoordinate == "null") {
            alert("请先绘制围栏。");
            return false;
        }
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        $('.add_right_2').css('display','none')
        $('.add_right').css('display','none')
        $('.add_right_4').css('display','none')
        $('.add_right_3').css('display','block')
        if($('.add_right_3').css('display')!=='none'){
            $('.step span').removeClass('active')
            $('.step span:nth-child(3)').addClass('active')
        }
    })
    //取消3
    $('.add_right_3_quxiao').on('click',function () {
        $('.table1').css('display','table')
        $('.add_1').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //上一步3
    $('.add_right_3_prev').on('click',function () {
        $('.add_right_2').css('display','block')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.add_right').css('display','none')
        $('.step span').removeClass('active')
        $('.step span:nth-child(2)').addClass('active')
    })
    //保存继续3
    $('.add_right_3_next').on('click',function () {
        $('.add_right_2').css('display','none')
        $('.add_right').css('display','none')
        $('.add_right_4').css('display','block')
        $('.add_right_3').css('display','none')
        if($('.add_right_4').css('display')!=='none'){
            $('.step span').removeClass('active')
            $('.step span:nth-child(4)').addClass('active')
        }
    })
    //取消4
    $('.add_right_4_quxiao').on('click',function () {
        $('.table1').css('display','table')
        $('.add_1').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //上一步4
    $('.add_right_4_prev').on('click',function () {
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','block')
        $('.add_right_4').css('display','none')
        $('.add_right').css('display','none')
        $('.step span').removeClass('active')
        $('.step span:nth-child(3)').addClass('active')
    })
    //保存继续4
    $('.add_right_4_next').on('click',function () {
        $('.table1').css('display','table')
        $('.add_1').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right').css('display','none')
        $('.add_right_4').css('display','none')
        $('.add_right_3').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //拖动
    $(".show").mousedown(function(e){ //e鼠标事件
        $(this).css("cursor","move");//改变鼠标指针的形状

        var offset = $(this).offset();//DIV在页面的位置
        var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
        var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
        $(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
            $(".show").stop();//加上这个之后

            var _x = ev.pageX - x;//获得X轴方向移动的值
            var _y = ev.pageY - y;//获得Y轴方向移动的值
            if(_x<0){
                _x = 0
            }else if(_x > $(document).width() - ($('.show').width() + 4)){
                _x = $(document).width() - ($('.show').width() + 4)
            }
            if(_y<0){
                _y = 0
            }else if(_y > $(document).height() - ($('.show').height() + 4)){
                _y = $(document).height() - ($('.show').height() + 4)
            }
            $(".show").animate({left:_x+"px",top:_y+"px"},5);
        });
    });
    $(document).mouseup(function(){
        //$(".show").css("cursor","default");
        $(".show").css("cursor","move");
        $(this).unbind("mousemove");
    });
    //绘制形状图标移入文字提示mouseover
    $("#myTip").mouseover(function(event){
        var tooltipHtml = "<div id='tooltip' class='tooltip'>绘制多边形</div>";
        $(this).append(tooltipHtml);
        $("#tooltip").css({
            "top": (event.pageY)-($('#myTip').offset().top)+24 + "px",
            "left": (event.pageX)-($('#myTip').offset().left) + "px"
        }).show("fast");
    }).mouseout(function(){
        $("#tooltip").remove();
    })
    $("#myTip2").mouseover(function(event){
        var tooltipHtml = "<div id='tooltip' class='tooltip2'>绘制圆形</div>";
        $(this).append(tooltipHtml);
        $("#tooltip").css({
            "top": (event.pageY)-($('#myTip2').offset().top)+24 + "px",
            "left": (event.pageX)-($('#myTip2').offset().left) + "px"
        }).show("fast");
    }).mouseout(function(){
        $("#tooltip").remove();
    })
    $("#myTip3").mouseover(function(event){
        var tooltipHtml = "<div id='tooltip' class='tooltip3'>清除</div>";
        $(this).append(tooltipHtml);
        $("#tooltip").css({
            "top": (event.pageY)-($('#myTip3').offset().top)+24 + "px",
            "left": (event.pageX)-($('#myTip3').offset().left) + "px"
        }).show("fast");
    }).mouseout(function(){
        $("#tooltip").remove();
    })
})(window)
$(function () {
    var vector_this,source_res;
    $("input[name=huizhi]").click(function () {
        // console.log($(this).val());
        drawType = $(this).val();
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
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
    $(".add_right1_next").click(function () {
        map.updateSize();
        addInteractions();
        map_res.removeLayer(vector_this);
        map_res.updateSize();
    });


    $(".add_right_3_next").click(function () {
        var getCoordinate = $.cookie('coordinate');

        getCoordinate = JSON.parse(getCoordinate);

        if (getCoordinate.name == 'Circle') {
            var feature = new ol.Feature({
                geometry: new ol.geom.Circle(getCoordinate.data[0], getCoordinate.data[1])
            })
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
            var feature = format.readFeature(wkt);
        }

        var source = new ol.source.Vector({
            features: [feature]
        });
        source_res = source;

        vector_this = new ol.layer.Vector({
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
        map_res.addLayer(vector_this);
        map_res.updateSize();

    });

    $(".add_right_4_next").click(function () {
        var db = $.cookie('db');
        if (!db || db == "null") {
            db = {};
        } else {
            db = JSON.parse(db);
        }

        if (!db.coordinate) {
            db.coordinate = [];
        }
        db.coordinate.push({
            name: Math.random(),
            coordinate: JSON.parse($.cookie('coordinate'))
        })
        $.cookie('db', JSON.stringify(db));

        $.cookie('coordinate', null);

        // location.reload();
        source.clear();
        source_res.clear();
    });

    $(".clearImg").click(function () {
        source.clear();
        $.cookie('coordinate', null);
        return false;
    });
});