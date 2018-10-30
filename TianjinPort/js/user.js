(function (w) {
    let url = 'http://192.168.20.18:8080'
    //let url = 'http://36.110.66.318:8080'
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
    $('.show').mousedown(function (e) {
        _move($('.show'),e)
    })
    $('.show1').mousedown(function (e) {
        _move($('.show1'),e)
    })
    $('.show2').mousedown(function (e) {
        _move($('.show2'),e)
    })
    $('.show3').mousedown(function (e) {
        _move($('.show3'),e)
    })
    /*$(".show").mousedown(function(e){ //e鼠标事件
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
    });*/
    $(document).mouseup(function(){
        //$(".show").css("cursor","default");
        $(".show").css("cursor","move");
        $(".show1").css("cursor","move");
        $(".show2").css("cursor","move");
        $(".show3").css("cursor","move");
        $(this).unbind("mousemove");
    });

    //输入框可以拖动选择内容
    $(".show input,.show select,.show textarea").mousedown(function(event){
        event.stopPropagation();
    });
    $(".show1 input,.show1 select,.show1 textarea").mousedown(function(event){
        event.stopPropagation();
    });
    $(".show2 input,.show2 select,.show2 textarea").mousedown(function(event){
        event.stopPropagation();
    });
    $(".show3 input,.show3 select,.show3 textarea").mousedown(function(event){
        event.stopPropagation();
    });
    //添加账户按钮
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
    //增加角色按钮
    $('.content_footer_right4_top div').on('click',function () {
        $('.tip_add_juese').css('display','block')
    })
    $('.add_juese_quxiao').on('click',function () {
        $('.tip_add_juese').css('display','none')
    })

    //角色权限树结构
    $(function() {
        //新增角色
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
        //编辑角色
        $("#update_role_lv1M").click(function() {
            if($("#update_role_lv2U").is(":visible")) {
                //                      alert("隐藏内容");
                $("#update_role_lv1M").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#update_role_lv1M").attr("src", "./images/user/minus_alt.png");
            }
            $("#update_role_lv2U").slideToggle(300);
        });
        //在树结构生成后绑定事件
        /*$("#lv2M2").click(function() {
            if($("#lv3U2").is(":visible")) {
                //                      alert("隐藏内容");
                $("#lv2M2").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#lv2M2").attr("src", "./images/user/minus_alt.png");
            }
            $("#lv3U2").slideToggle(500);
        });*/

        /*$("#lv2M3").click(function() {
            if($("#lv3U3").is(":visible")) {
                //                      alert("隐藏内容");
                $("#lv2M3").attr("src", "./images/user/plus_alt.png");
            } else {
                //                      alert("显示内容");
                $("#lv2M3").attr("src", "./images/user/minus_alt.png");
            }
            $("#lv3U3").slideToggle(400);
        });*/

        $("#allCheck").click(function(){
            $("#tree input[type=checkbox]").prop("checked",$("#allCheck").prop("checked"));
        });
        $("#update_role_all_check").click(function(){
            $("#update_role_tree input[type=checkbox]").prop("checked",$("#update_role_all_check").prop("checked"));
        });
        /*$("#secondCheck1").click(function(){
            $("input[name=lv3_1Check]").prop("checked",$("#secondCheck1").prop("checked"));
        });

        $("#secondCheck2").click(function(){
            $("input[name=lv3_2Check]").prop("checked",$("#secondCheck2").prop("checked"));
        });

        $("#secondCheck3").click(function(){
            $("input[name=lv3_3Check]").prop("checked",$("#secondCheck3").prop("checked"));
        });*/
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
            url: url + '/user/search',
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
                //console.log(json)
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
                            url: url + '/user/edit',
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
    //新增用户弹窗需要选择的角色
    let userRolePage = 1
    userRoleList()
    $('.tip_add_user_paging>:nth-child(1)').on('click',function () {
        //$('.tip_add_user_paging>:nth-child(2)').css('background' ,'red')
        if(userRolePage>1){
            userRolePage--
            userRoleList(userRolePage)
            $('.tip_add_user_paging>:nth-child(2)').addClass('on7')
            if(userRolePage==1){
                $('.tip_add_user_paging>:nth-child(1)').removeClass('on7')
            }
        }else {
            alert('已经是第一页了')
        }
    })
    $('.tip_add_user_paging>:nth-child(2)').on('click',function () {
        if(userRolePage<3){
            userRolePage++
            userRoleList(userRolePage)
            $('.tip_add_user_paging>:nth-child(1)').addClass('on7')
            if(userRolePage==3){
                $('.tip_add_user_paging>:nth-child(2)').removeClass('on7')
            }
        }else {
            alert('已经是最后一页了')
        }
    })
    function userRoleList(userRolePage){
        $.ajax({
            type:"GET",
            async: true,
            cache:true,
            url: url + '/role/search',
            data:{'page.number':userRolePage,
                'page.size':2,
            },
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success:function (json) {
                //console.log(json)
                $(`.tip_add_user_right ul`).html('')
                for(let i=0;i<json.body.list.length;i++){
                    $(`.tip_add_user_right ul`).append(`<li>
                                        <label>
                                            <input class="check_juese" type="checkbox">
                                            <span>${json.body.list[i].identity_name}</span>
                                        </label>
                                    </li>`)
                }

            },
            error:function () {
                console.log('fail');
            }
        })
    }

    //获取角色列表
    let role_pageNumber = 1
    getRoleList()
    $('.juese_list_paging>:nth-child(1)').on('click',function () {
        if(role_pageNumber>1){
            role_pageNumber--
            getRoleList(role_pageNumber)
            $('.juese_list_paging>:nth-child(2)').addClass('on6')
            if(role_pageNumber==1){
                $('.juese_list_paging>:nth-child(1)').removeClass('on6')
            }
        }else {
            alert('已经是第一页了')
        }
    })
    $('.juese_list_paging>:nth-child(2)').on('click',function () {
        if(role_pageNumber<3){
            role_pageNumber++
            getRoleList(role_pageNumber)
            $('.juese_list_paging>:nth-child(1)').addClass('on6')
            if(role_pageNumber==3){
                $('.juese_list_paging>:nth-child(2)').removeClass('on6')
            }
        }else {
            alert('已经是最后一页了')
        }
    })

    function getRoleList(role_pageNumber) {
        $.ajax({
            type:"GET",
            async: true,
            cache:true,
            url: url + '/role/search',
            data:{'page.number':role_pageNumber,
                'page.size':2,
            },
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success:function (json) {
                //console.log(json)
                $('.juese_list').html(`<tr>
                            <th>角色ID</th>
                            <th>角色名称</th>
                            <th>状态</th>
                            <th>描述</th>
                            <th>操作</th>
                        </tr>`)
                for(let i=0;i<json.body.list.length;i++){
                    $('.juese_list').append(`<tr>
                            <td>${json.body.list[i].role_id}</td>
                            <td>${json.body.list[i].identity_name}</td>
                            <td>${json.body.list[i].disable}</td>
                            <td>XXX</td>
                            <td>
                            <a class="bianji" href="javascript:;" value=${json.body.list[i].role_id}>编辑</a>
                            <a class="del" href="javascript:;">删除</a>
                            </td>
                        </tr>`)
                }
                //编辑角色
                $('.bianji').on('click',function () {
                    $('.show3').css('display','block')
                    $('.show3 input[name="updateIdentityName"]').val($(this).parent().siblings()[1].innerHTML)
                    $('.show3 input[name="updateRemarks"]').val($(this).parent().siblings()[3].innerHTML)

                })
                $('.update_juese_quxiao').on('click',function () {
                    $('.show3').css('display','none')
                })

            },
            error:function () {
                console.log('fail');
            }
        })
    }

    //获取资源列表树结构
    $.ajax({
        type:"GET",
        async: true,
        cache:true,
        url: url + '/resource/list',
        data:{},
        dataType: 'json',
        xhrFields:{
            withCredentials:true
        },
        crossDomain: true,
        success:function (json) {
            //将结构树添加至新增角色弹窗
            $("#lv2U").html('')
            for(let i=0;i<json.body.length;i++){
                $("#lv2U").append(`<img src="./images/user/plus_alt.png" id="lv2M${i+1}" style="clear: left;"/>
                                    <input type="checkbox" id="secondCheck${i+1}" style="display:none; float: left; width: 15px; height: 15px;margin-top: 3px"/>
                                    <li id="lv2L${i+1}">
                                        <label for="secondCheck${i+1}">${json.body[i].identity_name}</label>
                                        <ul id="lv3U${i+1}" style="clear: left;">
                                            
                                        </ul>
                                    </li>
                                `)

                $(`#lv2M${i+1}`).click(function() {
                    if($(`#lv3U${i+1}`).is(":visible")) {
                        //                     alert("隐藏内容");
                        $(`#lv2M${i+1}`).attr("src", "./images/user/plus_alt.png");
                    } else {
                        //                      alert("显示内容");
                        $(`#lv2M${i+1}`).attr("src", "./images/user/minus_alt.png");
                    }
                    $(`#lv3U${i+1}`).slideToggle(300);
                });
                $(`#lv3U${i+1}`).html('')
                if(json.body[i].children){
                        for(let j=0;j<json.body[i].children.length;j++){
                            $(`#lv3U${i+1}`).append(`<input id="thirdCheck${i+1}_${j+1}" value="${json.body[i].children[j].resource_id}"
                                                    type="checkbox" name="lv3_${i+1}Check" class="lv3Checks"/>
                                            <label for="thirdCheck${i+1}_${j+1}">
                                                <li>${json.body[i].children[j].identity_name}</li>
                                            </label>`)
                            $(`#secondCheck${i+1}`).click(function(){
                                $(`input[name=lv3_${i+1}Check]`).prop("checked",$(`#secondCheck${i+1}`).prop("checked"));
                            })
                        }
                } else {
                    $(`#lv2M${i+1}`).css("visibility", "hidden");
                }
            }
            //保存新增角色
            $('.add_juese_commit').on('click',function () {
                let addRoleData = {}
                addRoleData.identityName = $("input[name='addIdentityName']").val()
                addRoleData.disable = $('#add_juese_select2').val()
                addRoleData.memo = $('input[name="remarks"]').val()

                $.each($('.lv3Checks:checked'),function (index) {
                    //console.log(index + '个' + $(this).val())
                    addRoleData[`resourceId[${[index]}]`] = $(this).val()
                })
                //console.log(addRoleData)
                if(!addRoleData.identityName){
                    alert('请输入角色名称')
                    return
                }
                $.ajax({
                    type:"POST",
                    async: true,
                    cache:true,
                    url: url + '/role/add',
                    data:addRoleData,
                    dataType: 'json',
                    xhrFields:{
                        withCredentials:true
                    },
                    crossDomain: true,
                    success:function (json) {
                        console.log(json)
                        if(json.head.status.code == 200){
                            alert('新增成功！')
                            $('.show2').css('display','none')
                        }else {
                            alert(`提交失败！${json.head.status.code}错误`)
                        }
                    },
                    error:function () {
                        alert('提交失败！')
                    }

                })
            })

            //将结构树添加至编辑角色弹窗
            $("#update_role_lv2U").html('')
            for(let i=0;i<json.body.length;i++){
                $("#update_role_lv2U").append(`<img src="./images/user/plus_alt.png" id="update_role_lv2M${i+1}" style="clear: left;"/>
                                    <input type="checkbox" id="update_role_secondCheck${i+1}" style="display:none; float: left; width: 15px; height: 15px;margin-top: 3px"/>
                                    <li id="update_role_lv2L${i+1}">
                                        <label for="update_role_secondCheck${i+1}">${json.body[i].identity_name}</label>
                                        <ul id="update_role_lv3U${i+1}" style="clear: left;">
                                            
                                        </ul>
                                    </li>
                                `)

                $(`#update_role_lv2M${i+1}`).click(function() {
                    if($(`#update_role_lv3U${i+1}`).is(":visible")) {
                        //                     alert("隐藏内容");
                        $(`#update_role_lv2M${i+1}`).attr("src", "./images/user/plus_alt.png");
                    } else {
                        //                      alert("显示内容");
                        $(`#update_role_lv2M${i+1}`).attr("src", "./images/user/minus_alt.png");
                    }
                    $(`#update_role_lv3U${i+1}`).slideToggle(300);
                });
                $(`#update_role_lv3U${i+1}`).html('')
                if(json.body[i].children){
                    for(let j=0;j<json.body[i].children.length;j++){
                        $(`#update_role_lv3U${i+1}`).append(`<input id="update_role_thirdCheck${i+1}_${j+1}" value="${json.body[i].children[j].resource_id}"
                                                    type="checkbox" name="update_role_lv3_${i+1}Check" class="update_role_lv3Checks"/>
                                            <label for="update_role_thirdCheck${i+1}_${j+1}">
                                                <li>${json.body[i].children[j].identity_name}</li>
                                            </label>`)
                        $(`#update_role_secondCheck${i+1}`).click(function(){
                            $(`input[name=update_role_lv3_${i+1}Check]`).prop("checked",$(`#update_role_secondCheck${i+1}`).prop("checked"));
                        })
                    }
                } else {
                    $(`#update_role_lv2M${i+1}`).css("visibility", "hidden");
                }
            }
        },
        error:function () {
            console.log('fail')
        }
    })

})(window)
