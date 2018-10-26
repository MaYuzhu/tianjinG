(function (w) {
    //table切换
    let $tab = $('.content_footer_left>li')
    $tab.on('click',(function() {
            var i = $(this).index();
            $(this).addClass('active1').siblings().removeClass('active1');
            $('.content_footer_right>div').eq(i).show().siblings().hide();
        })
    );
    //翻页三角
    $('.footer1').on('click',function (ev) {
        var $target = $(ev.target);
        if($target.prop("nodeName") == "DIV"){
            $('.footer1>div').removeClass('on4')
            $target.addClass("on4");
        }
    })
    $('.footer2').on('click',function (ev) {
        var $target = $(ev.target);
        if($target.prop("nodeName") == "DIV"){
            $('.footer2>div').removeClass('on5')
            $target.addClass("on5");
        }
    })

    //拖动
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
    $('.show2').mousedown(function (e) {
        _move($('.show2'),e)
    })
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
    //编辑用户拖动
    $(".show1").mousedown(function(e){ //e鼠标事件
        $(this).css("cursor","move");//改变鼠标指针的形状

        var offset = $(this).offset();//DIV在页面的位置
        var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
        var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
        $(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
            $(".show1").stop();//加上这个之后

            var _x = ev.pageX - x;//获得X轴方向移动的值
            var _y = ev.pageY - y;//获得Y轴方向移动的值
            if(_x<0){
                _x = 0
            }else if(_x > $(document).width() - ($('.show1').width() + 4)){
                _x = $(document).width() - ($('.show1').width() + 4)
            }
            if(_y<0){
                _y = 0
            }else if(_y > $(document).height() - ($('.show1').height() + 4)){
                _y = $(document).height() - ($('.show1').height() + 4)
            }
            $(".show1").animate({left:_x+"px",top:_y+"px"},5);
        });
    });
    $(document).mouseup(function(){
        $(".show1").css("cursor","move");
        $(this).unbind("mousemove");
    });
    $(".show1 input,.show1 select,.show1 textarea").mousedown(function(event){
        event.stopPropagation();
    });
    //添加子账户按钮
    var $_addUser = $('.content_footer_right3_top>:nth-child(3)')
    $_addUser.on('click',function () {
        $(".show").css('display','block')
    })
    $('.adduser_quxiao').on('click',function () {
        $(".show").css('display','none')
    })
    
    $('.psd_quxiao').on('click',function () {
        $('.update_psd input').val('')
    })
    //
    $('.tip_add_juese')
    //角色权限树结构
    $(function() {
        $("#lv1M").click(function() {
            if($("#lv2U").is(":visible")) {
                //                      alert("隐藏内容");
                $("#lv1M").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#lv1M").attr("src", "./images/user/minus_alt.png");
            }
            $("#lv2U").slideToggle(300);
        });

        $("#lv2M1").click(function() {
            if($("#lv3U1").is(":visible")) {
                //                      alert("隐藏内容");
                $("#lv2M1").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#lv2M1").attr("src", "./images/user/minus_alt.png");
            }
            $("#lv3U1").slideToggle(300);
        });

        $("#lv2M2").click(function() {
            if($("#lv3U2").is(":visible")) {
                //                      alert("隐藏内容");
                $("#lv2M2").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#lv2M2").attr("src", "./images/user/minus_alt.png");
            }
            $("#lv3U2").slideToggle(500);
        });

        $("#lv2M3").click(function() {
            if($("#lv3U3").is(":visible")) {
                //                      alert("隐藏内容");
                $("#lv2M3").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#lv2M3").attr("src", "./images/user/minus_alt.png");
            }
            $("#lv3U3").slideToggle(400);
        });

        $("#allCheck").click(function(){
            $("input[type=checkbox]").prop("checked",$("#allCheck").prop("checked"));
        });

        $("#secondCheck1").click(function(){
            $("input[name=lv3_1Check]").prop("checked",$("#secondCheck1").prop("checked"));
        });

        $("#secondCheck2").click(function(){
            $("input[name=lv3_2Check]").prop("checked",$("#secondCheck2").prop("checked"));
        });

        $("#secondCheck3").click(function(){
            $("input[name=lv3_3Check]").prop("checked",$("#secondCheck3").prop("checked"));
        });
    });

    //获取用户列表
    let pageNumber = 1
    let username = $.cookie('username')
    $('.footer2>:nth-child(2)').on('click',function () {
        pageNumber ++
        getUserList(pageNumber)
    })
    getUserList(pageNumber)
    function getUserList(pageNumber) {
        $.ajax({
            type:"GET",
            async: true,
            cache:true,
            url: 'http://192.168.20.18:8080/user/search',
            //?page.number=1&page.size=10&username=root
            data:{'page.number':pageNumber,
                  'page.size':10,
                  /*'username':username*/},
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success:function (json) {
                console.log(json)
                $('.user_list').html(`<tr>
                           <th>序号</th>
                            <th>用户名</th>
                            <th>工作职位</th>
                            <th>邮箱</th>
                            <th>所属单位</th>
                            <th>创建时间</th>
                            <th>联系电话</th>
                            <th>权限</th>
                            <th>操作</th>
                        </tr>`)
                for(let i=0;i<json.body.list.length;i++){
                    $('.user_list').append(`<tr>
                            <td>${i+1}</td>
                            <td>${json.body.list[i].username}</td>
                            <td>xxx</td>
                            <td>${json.body.list[i].email}</td>
                            <td>XXX</td>
                            <td>2018.09.26</td>
                            <td>${json.body.list[i].mobile_phone}</td>
                            <td>中级管理员</td>
                            <td><a class="${json.body.list[i].user_id} a" href="javascript:;">编辑</a>
                            <a class="del" href="javascript:;">删除</a></td>
                        </tr>`)
                }
                //编辑按钮
                $(`.a`).on('click',function () {
                    $('.show1').css('display','block')
                    $('.show1 input[name="username"]').val($(this).parent().siblings()[1].innerHTML)
                    $('.show1 input[name="mobilePhone"]').val($(this).parent().siblings()[6].innerHTML)
                    $('.show1 input[name="email"]').val($(this).parent().siblings()[3].innerHTML)
                    let commit_id = $(this)[0].className.substr(0,2).trim()
                    //console.log(commit_id)//.substr(0,2)
                    $('.update_user_tijiao').attr('id',commit_id)
                    //提交按钮
                    $(`#${commit_id}`).unbind()
                    $(`#${commit_id}`).on('click',function () {
                        alert($(this).attr('id'))
                        let user_id = $(this).attr('id')
                        let username = $('.show1 input[name="username"]').val()
                        let mobilePhone = $('.show1 input[name="mobilePhone"]').val()
                        let email = $('.show1 input[name="email"]').val()
                        let locked = Number($('#update_user_select1').val())
                        let disable = Number($('#update_user_select2').val())
                        console.log(email)
                        $.ajax({
                            type:"POST",
                            async: true,
                            cache:true,
                            url: 'http://192.168.20.18:8080/user/edit',
                            //id=1&mobilePhone=13830305894
                            data:{id:user_id,
                                  username:username,
                                  mobilePhone:mobilePhone,
                                  email:email,
                                  locked:locked,
                                  disable:disable,
                            },
                            dataType: 'json',
                            xhrFields:{
                                withCredentials:true
                            },
                            crossDomain: true,
                            success:function (json) {
                                if(json.head.status.code==200){
                                    console.log(json)
                                    alert('提交成功')
                                }

                            },
                            error:function () {
                                alert('编辑失败')
                            }
                        })
                    })
                })
                $('.update_user_quxiao').on('click',function () {
                    $('.show1').css('display','none')
                })

            },
            error:function () {
                console.log('fail');
            }
        })
    }
})(window)
