let fenceAddDate = {}
let arrAddCar = []
let arrAddCarName = []
//数组删除值为XXX的项
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
}
;(function (w) {
    //选择时间范围input
    laydate.render({
        elem: '#weilan_add'
        ,type: 'datetime'
        //,range: '~'
        //,format: 'M/d/H:m'
    });

    //起始时间
    laydate.render({
        elem: '#add_right_start'
        ,type: 'datetime'
    });
    laydate.render({
        elem: '#add_right_end'
        ,type: 'datetime'
    });
    laydate.render({
        elem: '#editAreaStartTime'
        ,type: 'datetime'
    });
    laydate.render({
        elem: '#editAreaEndTime'
        ,type: 'datetime'
    });

    //添加围栏>添加车辆表格
    let carlistPageNumber = 1 ; //当前页数
    let carlistPageSize = 2; //每页显示条数
    let carlistPages = 0; //总页数
    var getCarData = {
        //'state':Number($('select[name=add_fence_carlist_state]').val()),
        'page.number':carlistPageNumber,
        'page.size':carlistPageSize
    };
    //车辆列表翻页
    $('.add3_next>:nth-child(1)').on('click',function () {
        if(carlistPageNumber>1){
            $('.add3_next>:nth-child(2)').addClass('page_on').removeClass('page_on_not')
            carlistPageNumber--
            getCarData['page.number'] = carlistPageNumber
            getAjaxRequest("GET", interface_url+"vehicle/search", getCarData, getCarList, null);
            if(carlistPageNumber==1){
                $('.add3_next>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
            }
        }
    })
    $('.add3_next>:nth-child(2)').on('click',function () {
        if(carlistPageNumber<carlistPages){
            $('.add3_next>:nth-child(1)').addClass('page_on').removeClass('page_on_not')
            carlistPageNumber++
            getCarData['page.number'] = carlistPageNumber
            getAjaxRequest("GET", interface_url+"vehicle/search", getCarData, getCarList, null);
            if(carlistPageNumber==carlistPages){
                $('.add3_next>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
            }
        }
    })

    $('select[name=add_fence_carlist_state]').on('change',function () {
        getCarData.state = Number($('select[name=add_fence_carlist_state]').val())
        getAjaxRequest("GET", interface_url+"vehicle/search", getCarData, getCarList, null);
    })
    getAjaxRequest("GET", interface_url+"vehicle/search", getCarData, getCarList, null);

    function getCarList(json) {
        if(json.head.status.code == 200){
            let cars = json.body.list;
            carlistPages = json.body.pages;
            if(carlistPages<2){
                $('.add3_next>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
            }
            $('.add_fence_car_list').html(`<tr>
                                <th>选择</th>
                                <th>序号</th>
                                <th>车辆列表</th>
                                <th>车辆状态</th>
                                <th>单位部门</th>
                                <th>联系人</th>
                                <th>联系方式</th>
                            </tr>`)
            for (let i = 0; i < cars.length; i++) {
                $('.add_fence_car_list').append(`<tr>
                            <td>
                                <input class="add_fence_car_item" id=${cars[i].vehicle_id}+'' type="checkbox" 
                                       value=${cars[i].vehicle_id}  name=拖车${cars[i].plate_number}>
                                <label for=${cars[i].vehicle_id}+'' class="add_fence_car_label"></label>
                            </td>
                            <td>${cars[i].vehicle_id}</td>
                            <td>拖车${cars[i].plate_number}</td>
                            <td>${cars[i].state==2?"忙碌":cars[i].state==1?"空闲":"离线"}</td>
                            <td>XXX</td>
                            <td>李XX</td>
                            <td>13145613214</td>
                        </tr>`)
            }
            for(let i=0;i<arrAddCar.length;i++){
                $(`.add_fence_car_list input[value=${arrAddCar[i]}]`).prop("checked", true)
            }

            $('.add_fence_car_item').on('click',function () {
                if($(this).is(':checked')){
                    arrAddCar.push($(this).val())
                    arrAddCarName.push($(this).attr('name'))
                }else {
                    arrAddCar.remove($(this).val())
                    arrAddCarName.remove($(this).attr('name'))
                }
            })
        }else{
            alert(json.head.status.message);
            location.href="./login.html";
        }
    }
    var flag = true
    //添加围栏按钮
    $('.add_wei').on('click',function () {
        if(flag){
            $('.electronic_fence_list').css('display','none')
            $('.electronic_fence_add').css('display','block')
            $('.add_right').css('display','block')
            if($('.add_right').css('display')!=='none'){
                $('.step span:nth-child(1)').addClass('active')
            }
        }
        flag = false
    })
    //取消1
    $('.add_right1_quxiao').on('click',function () {
        $('.electronic_fence_list').css('display','table')
        $('.electronic_fence_add').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //保存并继续1
    $('.add_right1_next').on('click',function () {
        //18.11.5 ma
        fenceAddDate.areaName = $('input[name=add_fence_name]').val()
        fenceAddDate.startTime = $('#add_right_start').val()
        fenceAddDate.endTime = $('#add_right_end').val()
        fenceAddDate.areaType = $('select[name=fence_type]').val()
        fenceAddDate.memo = $('textarea[name=memo]').val()
        $.cookie('coordinate',null)
        if(!fenceAddDate.areaName){
            alert("请填写围栏名称...")
            return
        }
        if(!fenceAddDate.startTime){
            alert("请填写开始时间...")
            return
        }
        if(!fenceAddDate.endTime){
            alert("请填写结束时间...")
            return
        }
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
        $('.electronic_fence_list').css('display','table')
        $('.electronic_fence_add').css('display','none')
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
    //18.11.6 ma
    $(".add_right_2_next").on('click',function () {
        var getCoordinate = $.cookie('coordinate')
        if (!getCoordinate || getCoordinate == null || getCoordinate == "null") {
            alert("请先绘制围栏!!!");
            return false;
        }
        getCoordinate = JSON.parse(getCoordinate);
        if(getCoordinate.name == 'Circle'){
            fenceAddDate.shape = 1
        }else if(getCoordinate.name == 'Polygon'){
            fenceAddDate.shape = 2
        }
        //fenceAddDate.range = getCoordinate.data+''
        //console.log(getCoordinate.data)
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
        $('.electronic_fence_list').css('display','table')
        $('.electronic_fence_add').css('display','none')
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
    $('.add_right_3_next').on('click',function (){
        //给新增的围栏添加车辆  18.11.6  ma
        $('#add_car_message').empty()
        if(arrAddCar.length<1){
            alert('请选择车辆...')
            return
        }
        for(let i=0;i<arrAddCarName.length;i++){
            $('#add_car_message').append(`<p>${arrAddCarName[i]}</p>`)
        }
        fenceAddDate.vehicleId = arrAddCar
        //console.log(fenceAddDate)
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
        $('.electronic_fence_list').css('display','table')
        $('.electronic_fence_add').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right_3').css('display','none')
        $('.add_right_4').css('display','none')
        $('.step span').removeClass('active')
        flag = true
        location.reload()
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
        $('.electronic_fence_list').css('display','table')
        $('.electronic_fence_add').css('display','none')
        $('.add_right_2').css('display','none')
        $('.add_right').css('display','none')
        $('.add_right_4').css('display','none')
        $('.add_right_3').css('display','none')
        $('.step span').removeClass('active')
        flag = true
    })
    //拖动1
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
    //拖动2
    $('.fence_edit').mousedown(function (e) {
        _move($('.fence_edit'),e)
    })
    $(".fence_edit input,.fence_edit textarea").mousedown(function(event){
        event.stopPropagation();
    });
    function _move(dom,e) {
        dom.css("cursor","move");//改变鼠标指针的形状

        var offset = dom.offset();//DIV在页面的位置
        var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
        var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
        $(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
            dom.stop();//加上这个之后

            var _x = ev.pageX - x;//获得X轴方向移动的值
            var _y = ev.pageY - y;//获得Y轴方向移动的值
            if(_x<0){
                _x = 0
            }else if(_x > $(document).width() - (dom.width() + 4)){
                _x = $(document).width() - (dom.width() + 4)
            }
            if(_y<0){
                _y = 0
            }else if(_y > $(document).height() - (dom.height() + 4)){
                _y = $(document).height() - (dom.height() + 4)
            }
            dom.animate({left:_x+"px",top:_y+"px"},5);
        });
    }

    //获取电子围栏列表 getAjaxRequest(type, url, data, succFunc, errFunc)
    let fencePageNumber = 1  //当前页数
    let fencePageCount = 0   //总页数
    let areaId
    let getFenceListData = {
        'page.number':fencePageNumber,
        'page.size':6,
    }
    //围栏列表翻页
    $('.fence_list_footer>:nth-child(1)').on('click',function () {
        if(fencePageNumber>1){
            $('.fence_list_footer>:nth-child(2)').addClass('page_on').removeClass('page_on_not')
            fencePageNumber--
            getFenceListData['page.number'] = fencePageNumber
            getAjaxRequest("GET", interface_url+"electronic-fence/search", getFenceListData, succGetFenceList, null);
            if(fencePageNumber==1){
                $('.fence_list_footer>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
            }
        }
    })
    $('.fence_list_footer>:nth-child(2)').on('click',function () {
        if(fencePageNumber<fencePageCount){
            $('.fence_list_footer>:nth-child(1)').addClass('page_on').removeClass('page_on_not')
            fencePageNumber++
            getFenceListData['page.number'] = fencePageNumber
            getAsyncAjaxRequest("GET", interface_url+"electronic-fence/search", getFenceListData,
                        false, succGetFenceList, null);
            if(fencePageNumber==fencePageCount){
                $('.fence_list_footer>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
            }
        }
    })
    getAsyncAjaxRequest("GET", interface_url+'electronic-fence/search',
        getFenceListData, false, succGetFenceList, errorFunc)

    //按时间查询围栏
    $('.time_find').on('click',function () {
        let queryTime = $('#weilan_add').val()
        if(!queryTime){
            alert('请选择查询时间')
            return false
        }
        getFenceListData.validTime = queryTime

        getAjaxRequest("GET",interface_url+'electronic-fence/search',
            getFenceListData,succGetFenceList,errorFunc)

    })

    let editFenceData = {} //编辑围栏提交的参数
    editFenceData.vehicleId = []  //车辆id的数组


    function succGetFenceList(json) {
        if(json.head.status.code == 200){
            fencePageCount = Math.ceil(json.body.total/getFenceListData["page.size"])
            if(json.body.list<1){
                alert('没有围栏符合该时间...')
                return
            }
            if(fencePageCount<2){
                $('.fence_list_footer>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
                $('.fence_list_footer>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
            }else {
                $('.fence_list_footer>:nth-child(2)').removeClass('page_on_not').addClass('page_on')
            }
            //每页序号${i+1+getFenceListData["page.size"]*(json.body.number-1)}
            $('.electronic_fence_table').html(`<tr>
                        <th>围栏编号</th>
                        <th>围栏名称</th>
                        <th>有效性</th>
                        <th>起始时间</th>
                        <th>结束时间</th>
                        <th>围栏类型</th>
                        <th>操作</th>
                    </tr>`)
            for(let i=0;i<json.body.list.length;i++){
                $('.electronic_fence_table').append(`<tr>
                    <td>${json.body.list[i].area_id}</td>
                    <td>${json.body.list[i].area_name}</td>
                    <td>${json.body.list[i].state==1?'有效':'失效'}</td>
                    <td>${json.body.list[i].start_time}</td>
                    <td>${json.body.list[i].end_time}</td>
                    <td>${json.body.list[i].area_type==1?'可进不可出':json.body.list[i].area_type==2?'可出不可进':'不可进不可出'}</td>
                    <td>
                    <a class="update_fence" href="javascript:;" value=${json.body.list[i].area_id}>编辑</a>
                    <a class="del_fence" href="javascript:;" value=${json.body.list[i].area_id}>删除</a>
                    </td>
                </tr>`)
            }
        }
        //编辑围栏弹出框中的车辆列表
        let editCarlistPages = 0; //总页数
        let editGetCarData = {
            'page.number':1,
            'page.size':2
        };
        //围栏列表编辑按钮
        $('.update_fence').on('click',function () {
            $('.fence_edit').css('display','block')
            $('.editAreaCarFooter>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
            $('.editAreaCarFooter>:nth-child(2)').removeClass('page_on_not').addClass('page_on')
            $('.update_fence input[type="checkbox"]').attr("checked", false)
            editFenceData.vehicleId = []
            areaId = $(this).attr('value')
            getAsyncAjaxRequest("GET",interface_url+'electronic-fence/get',
                {areaId:areaId},false,getFence,errorFunc)
            //车辆翻页编辑窗口
            editGetCarData['page.number'] = 1 ; //当前页数
            getAjaxRequest("GET", interface_url+"vehicle/search", editGetCarData,
                editGetCarList, errorFunc)
            $('.editAreaCarFooter>:nth-child(1)').unbind()
            $('.editAreaCarFooter>:nth-child(2)').unbind()

            $('.editAreaCarFooter>:nth-child(1)').on('click',function () {
                if(editGetCarData['page.number']>1){
                    $('.editAreaCarFooter>:nth-child(2)').addClass('page_on').removeClass('page_on_not')
                    editGetCarData['page.number']--
                    getAjaxRequest("GET", interface_url+"vehicle/search", editGetCarData,
                        editGetCarList, errorFunc);
                    if(editGetCarData['page.number']==1){
                        $('.editAreaCarFooter>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
                        return
                    }

                }
            })
            $('.editAreaCarFooter>:nth-child(2)').on('click',function () {
                if(editGetCarData['page.number']<editCarlistPages){
                    $('.editAreaCarFooter>:nth-child(1)').addClass('page_on').removeClass('page_on_not')
                    editGetCarData['page.number']++
                    getAjaxRequest("GET", interface_url+"vehicle/search", editGetCarData,
                        editGetCarList, errorFunc);
                    if(editGetCarData['page.number']==editCarlistPages){
                        $('.editAreaCarFooter>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
                        return
                    }

                }
            })

        })
        function editGetCarList(json) {
            if(json.head.status.code == 200){
                let cars = json.body.list;
                editCarlistPages = json.body.pages;
                if(editCarlistPages<2){
                    $('.editAreaCarFooter>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
                    $('.editAreaCarFooter>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
                }
                $('.editCarList ul').html('')
                for (let i = 0; i < cars.length; i++) {
                    $('.editCarList ul').append(`<li>
                                <input id=${cars[i].vehicle_id}  class="editCarListLabelCheck"
                                value=${cars[i].vehicle_id} type="checkbox">
                                <label for=${cars[i].vehicle_id} class="editCarListLabel" 
                                            value=${cars[i].vehicle_id}></label>
                                <span>${cars[i].vehicle_id}</span>
                                <span>拖车${cars[i].plate_number}</span>
                                <span>${cars[i].state==1?"忙碌":cars[i].state==0?"空闲":"离线"}</span>
                            </li>`)
                }

                //增或删车辆
                $('.editCarListLabelCheck').on('click',function () {
                    if($(this).is(':checked')){
                        editFenceData.vehicleId.push($(this).val()*1)
                    }else {
                        editFenceData.vehicleId.remove($(this).val()*1)
                    }
                    //console.log(editFenceData.vehicleId)
                })
                //围栏的车辆回显
                if(editFenceData.vehicleId.length>0){
                    for(let i=0;i<editFenceData.vehicleId.length;i++){
                        let id = editFenceData.vehicleId[i]
                        $(`.fence_edit input[value=${id}]`).prop("checked", true)
                    }
                }

            }else{
                alert(json.head.status.message);
            }
        }

        //围栏列表删除按钮
        $('.del_fence').on('click',function () {
            var r = confirm("确定删除此围栏？");
            if (r == true){
                areaId = $(this).attr('value')
                getAjaxRequest("GET",interface_url+'electronic-fence/remove',
                    {areaId:areaId},succDelFence,errorFunc)
            }

        })
        function succDelFence(json){
            if(json.head.status.code == 200){
                alert('删除成功!')
                location.reload()
            }else {
                alert(`删除失败${json.head.status.message}`)
            }
        }

    }

    //编辑围栏弹出框取消按钮
    $('.editAreaFooter>:first-child').on('click',function () {
        $('.fence_edit').css('display','none')
    })

    //编辑围栏弹出框提交按钮  electronic-fence/edit
    $('.editAreaFooter>:last-child').on('click',function () {
        editFenceData = {
            areaId:areaId,
            areaName:$('input[name=editAreaName]').val(),
            startTime:$('#editAreaStartTime').val(),
            endTime:$('#editAreaEndTime').val(),
            areaType:$('#editAreaType').val(),
            memo:$('input[name=editAreaMemo]').val(),
            state:$('select[name=editAreaDisable]').val(),
            vehicleId:editFenceData.vehicleId
        }
        //console.log(editFenceData)
        getAjaxRequest('POST', interface_url+'electronic-fence/edit', editFenceData,
                        editFenceFunc, errorFunc)
    })

    function getFence (json){
        if(json.head.status.code == 200){
            $('.fence_edit input[name="editAreaName"]').val(json.body.area_name)
            $('#editAreaStartTime').val(json.body.start_time)
            $('#editAreaEndTime').val(json.body.end_time)
            $('#editAreaType').val(json.body.area_type)
            $('.fence_edit input[name="editAreaMemo"]').val(json.body.memo)
            $('select[name="editAreaDisable"]').val(json.body.state)
            for(let i=0;i<json.body.vehicles.length;i++){
                editFenceData.vehicleId.push(json.body.vehicles[i].vehicle_id)
            }
        }
    }

    function editFenceFunc(json) {
        if(json.head.status.code == 200){
            alert('修改围栏成功！')
            $('.fence_edit').css('display','none')
            location.reload()
        }else{
            alert(json.head.status.message);
        }
    }

    //所有请求失败的回调
    function errorFunc() {
        alert("请求失败,请检查您的网络是否通畅")
        console.log('file')
    }
})(window)

$(function () {
    var vector_this,source_res;
    //let fenceAddDate = {}
    $("input[name=huizhi]").click(function () {
        // console.log($(this).val());
        drawType = $(this).val();
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
    });
    /*var map_res = new ol.Map({
        layers: layers,
        target: 'map_res',
        view: new ol.View({
            center: pos,
            zoom: 16
        }),
        interactions: new ol.interaction.defaults({
            doubleClickZoom: false,
        })
    });*/

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
            //console.log(getCoordinate.data)
            let a = getCoordinate.data[0][0]
            let b = getCoordinate.data[0][1]
            let c = getCoordinate.data[1]
            let circle_d = '' + a + ' '+ b + ','+ c
            fenceAddDate.range = circle_d
        } else if (getCoordinate.name == 'Polygon') {
            var wkt = 'POLYGON((';
            getCoordinate.data[0].forEach((v, k) => {
                wkt += v[0] + " " + v[1];
                if (getCoordinate.data[0].length != k + 1) {
                    wkt += ", ";
                }
            });
            wkt += '))';
            let polygon_d = ''
            getCoordinate.data[0].forEach((v, k) => {
                polygon_d += v[0] + " " + v[1];
                if (getCoordinate.data[0].length != k + 1) {
                    polygon_d += ", ";
                }
                fenceAddDate.range = polygon_d
                //console.log(polygon_d)
            });

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

        //最后保存围栏  18.11.6  ma
        getAjaxRequest("POST", interface_url+"electronic-fence/add", fenceAddDate, commitFenceFun, null);

        function commitFenceFun (json){
            if(json.head.status.code == 200){
                alert('添加围栏成功！')
                window.location.reload()
            }
        }
    });

    $(".clearImg").click(function () {
        source.clear();
        $.cookie('coordinate', null);
        return false;
    });
});