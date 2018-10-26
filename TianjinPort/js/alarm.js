(function (w) {
    //翻页三角
    $('footer').on('click',function (ev) {
        var $target = $(ev.target);
        if($target.prop("nodeName") == "DIV"){
            $('footer>div').removeClass('alarm_on')
            $target.addClass("alarm_on");
        }
    })

    laydate.render({
        elem: '#alarm_time'
    });
    laydate.render({
        elem: '#chuli_time'
    });
    //编辑弹窗

    for(let i=1;i<12;i++){
        $('.table1').append(`<tr>
                    <td>${i}</td>
                    <td>苏${i}E367287</td>
                    <td>XXX</td>
                    <td>2018-9-9</td>
                    <td>偏离轨道报警</td>
                    <td>未处置</td>
                    <td>2018-9-9</td>
                    <td>
                        <a href="javascript:;" onclick="_alarm(${i})">编辑</a>
                    </td>
                </tr>`)
    }

    /*$('.table1 a').on('click',function () {
        $('.show').css('display','block')
    })*/
    $('.alarm_quxiao').on('click',function () {
        $('.show').css('display','none')
    })

    //提交
    $('.add_car_tijiao').on('click',function () {
        var i = tr_index
        var alarm_car = $('.tip_add_truck .alarm_car').val()
        var alarm_time = $('.tip_add_truck #alarm_time').val()
        var alarm_reason = $('.tip_add_truck .alarm_reason').val()
        var chuli_time = $('.tip_add_truck #chuli_time').val()
        var alarm_bumen = $('.tip_add_truck .alarm_bumen').val()
        var alarm_chuzhi = $('.tip_add_truck .alarm_chuzhi').val()

        $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(2)`).text(alarm_car)
        $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(4)`).text(alarm_time)
        $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(5)`).text(alarm_reason)
        $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(7)`).text(chuli_time)
        $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(3)`).text(alarm_bumen)
        $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(6)`).text(alarm_chuzhi)
        $('.show').css('display','none')
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
    $(".show input,.show select,.show textarea").mousedown(function(event){
        event.stopPropagation();
    });
})(window)
var tr_index = 0
function _alarm(i) {
    $('.show').css('display','block')
    var alarm_car = $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(2)`).text()
    var alarm_time = $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(4)`).text()
    var alarm_reason = $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(5)`).text()
    var chuli_time = $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(7)`).text()
    var alarm_bumen = $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(3)`).text()
    var alarm_chuzhi = $(`.table1>:nth-child(1)>:nth-child(${i+1})>:nth-child(6)`).text()
    //console.log(alarm_bumen)
    $('.tip_add_truck .alarm_car').val(alarm_car)
    $('.tip_add_truck #alarm_time').val(alarm_time)
    $('.tip_add_truck .alarm_reason').val(alarm_reason)
    $('.tip_add_truck #chuli_time').val(chuli_time)
    $('.tip_add_truck .alarm_bumen').val('1')
    $('.tip_add_truck .alarm_chuzhi').val('2')
    tr_index = i
}