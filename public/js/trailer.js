(function (w) {
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
    //添加按钮
    $('.cha').on('click',function () {
        $('.show').css('display','block')
    })
    //取消
    $('.add_car_quxiao').on('click',function () {
        $('.show').css('display','none')
    })
    //出厂时间
    laydate.render({
        elem: '#chuchang_time'
    })
    //翻页三角
    $('footer').on('click',function (ev) {
        var $target = $(ev.target);
        if($target.prop("nodeName") == "DIV"){
            $('footer>div').removeClass('trailer_on')
            $target.addClass("trailer_on");
        }
    })
})(window)