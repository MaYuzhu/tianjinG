
$(function () {
    //添加车辆拖动
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
    //输入框可以拖动选择内容
    $(".show input,.show select,.show textarea").mousedown(function(event){
        event.stopPropagation();
    });
    //添加按钮
    $('.add_vehicle').on('click',function () {
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

    //获取车辆列表
    const getVehicleListPromise = (param) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: interface_url+'vehicle/search',
                data: null,
                dataType: 'json',
                xhrFields:{
                    withCredentials:true
                },
                traditional: true,
                crossDomain: true,
                cache:true,
                async: true,
                success:  json => {
                    resolve(json)
                },
                error: err => {
                    reject(err)
                }
            })
        })
    }

    let step1 = () => {
        getVehicleListPromise({

        }).then(json => {
            console.log(json);
            if(json.head.status.code == 200){
                $('.vehicleList').html(`<tr>
                <th>ID</th>
                <th>车辆编号</th>
                <th>品牌型号</th>
                <th>车载设备</th>
                <th>设备编号</th>
                <th>车辆状态</th>
                <th>单位部门</th>
                <th>联系人</th>
                <th>出厂时间</th>
                <th>操作</th>
            </tr>`)
                let vehicleList = json.body.list
                for(let i=0;i<vehicleList.length;i++){
                    $('.vehicleList').append(`<tr>
                <td>${vehicleList[i].vehicle_id}</td>
                <td>${vehicleList[i].plate_number}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${vehicleList[i].state==2?'忙碌':vehicleList[i].state==1?'空闲':'离线'}</td>
                <td>XXX</td>
                <td>未知</td>
                <td>xxxx年xx月</td>
                <td>
                    <a href="javascript:;" class="edit">修改</a>
                    <a href="javascript:;">禁用</a>
                    <a href="javascript:;">删除</a>
                </td>
            </tr>`)
                }
            }

        }).then(res => {
            $('.edit').on('click',function () {
                alert(123)
            })
        }).catch(err => {
            console.log("第一个请求失败");
        })
    }
    step1()
    /*getAjaxRequest("GET", interface_url+'vehicle/search', null, getVehicleList, errorFunc)

    function getVehicleList(json){
        console.log(json)


            if(json.head.status.code == 200){
                $('.vehicleList').html(`<tr>
                <th>ID</th>
                <th>车辆编号</th>
                <th>品牌型号</th>
                <th>车载设备</th>
                <th>设备编号</th>
                <th>车辆状态</th>
                <th>单位部门</th>
                <th>联系人</th>
                <th>出厂时间</th>
                <th>操作</th>
            </tr>`)
                let vehicleList = json.body.list
                for(let i=0;i<vehicleList.length;i++){
                    $('.vehicleList').append(`<tr>
                <td>${vehicleList[i].vehicle_id}</td>
                <td>${vehicleList[i].plate_number}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${vehicleList[i].state==2?'忙碌':vehicleList[i].state==1?'空闲':'离线'}</td>
                <td>XXX</td>
                <td>未知</td>
                <td>xxxx年xx月</td>
                <td>
                    <a href="javascript:;" class="edit">修改</a>
                    <a href="javascript:;">禁用</a>
                    <a href="javascript:;">删除</a>
                </td>
            </tr>`)
                }
            }

        /!*$('.edit').on('click',function () {
            alert(123)
        })*!/
    }*/


    //所有请求失败的回调
    function errorFunc() {
        alert("请求失败,请检查您的网络是否通畅...")
    }
})