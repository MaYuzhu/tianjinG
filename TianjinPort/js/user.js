
(function (w) {
    const url = 'http://192.168.20.18:8080'
    //let url = 'http://36.110.66.218:8080'
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
    //修改密码的取消按钮
    $('.psd_quxiao').on('click',function () {
        $('.update_psd input').val('')
    })

    //获取用户列表
    let pageNumber = 1
    let pageCount
    let username = $.cookie('username')
    let userId
    let getUserListData = {
        'page.number':pageNumber,
        'page.size':4,
        /*'username':username*/
    }
    getAsyncAjaxRequest("GET", interface_url+'/user/search', getUserListData,
        false, succFuncGetUserList, errorFunc)
    $('.footer2>:nth-child(1)').on('click',function () {
        if(pageNumber>1){
            $('.footer2>:nth-child(2)').addClass('page_on').removeClass('page_on_not')
            pageNumber --
            getUserListData['page.number'] = pageNumber
            getAsyncAjaxRequest("GET", interface_url+'/user/search', getUserListData,
                false, succFuncGetUserList, errorFunc)
            if(pageNumber==1){
                $('.footer2>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
            }
        }

    })
    $('.footer2>:nth-child(2)').on('click',function () {
        //console.log(pageCount)
        if(pageNumber<pageCount){
            $('.footer2>:nth-child(1)').addClass('page_on').removeClass('page_on_not')
            pageNumber ++
            getUserListData['page.number'] = pageNumber
            getAsyncAjaxRequest("GET", interface_url+'/user/search', getUserListData,
                false, succFuncGetUserList, errorFunc)
            if(pageNumber==pageCount){
                $('.footer2>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
            }
        }

    })

    //添加账户按钮
    const $_addUser = $('.content_footer_right3_top>:nth-child(3)')
    $_addUser.on('click',function () {
        $(".show").css('display','block')
    })
    //保存新添加的账户
    $('.adduser_commit').on('click',function () {
        let adduserData = {}
        adduserData.username = $("input[name='add_username']").val()
        adduserData.password = $("input[name='add_password']").val()
        adduserData.mobilePhone = $("input[name='add_mobilePhone']").val()
        adduserData.add_email = $("input[name='add_email']").val()
        adduserData.locked = $("#add_user_select1").val()
        adduserData.disable = $("#add_user_select2").val()
        adduserData.roleId = []
        $.each($('.check_juese:checked'),function (index) {
            adduserData.roleId.push($(this).val())
        })
        if(!adduserData.username){
            alert("请填写用户名...")
            return
        }
        if(!adduserData.password){
            alert("请填写密码...")
            return
        }
        if(adduserData.roleId.length<1){
            alert("请选择角色...")
            return
        }

        getAjaxRequest("POST", interface_url+"/user/add", adduserData, addUser, errorFunc)
        function addUser(json) {
            if(json.head.status.code==200){
                alert('新添加账户成功！')
                $('.adduser_quxiao').click()
                getAsyncAjaxRequest("GET", interface_url+'/user/search', getUserListData,
                    false, succFuncGetUserList, errorFunc)
            }else{
                alert("添加失败，"+json.head.status.message)
                $('.adduser_quxiao').click()
            }
        }

    })
    $('.adduser_quxiao').on('click',function () {
        $(".show").css('display','none')
    })

    //增加角色按钮
    $('.content_footer_right4_top div').on('click',function () {
        $('.tip_add_juese').css('display','block')
        $('.show2 input[type="checkbox"]').attr("checked", false)
    })
    $('.add_juese_quxiao').on('click',function () {
        $('.tip_add_juese').css('display','none')
    })

    //角色权限树结构
    $(function() {
        //新增角色的树
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
        //编辑角色的树
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

    function succFuncGetUserList(json){
        //console.log(json)
        pageCount = Math.ceil(json.body.total/getUserListData["page.size"])
        if(pageCount<2){
            $('.footer2>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
        }
        $('.user_list').html(`<tr>
                   <th>序号</th>
                    <th>用户名</th>
                    <th>工作职位</th>
                    <th>邮箱</th>
                    <th>所属单位</th>
                    <th>创建时间</th>
                    <th>联系电话</th>
                    <th>操作</th>
                </tr>`)
        for(let i=0;i<json.body.list.length;i++){
            $('.user_list').append(`<tr>
                    <td>${i+1+getUserListData["page.size"]*(json.body.number-1)}</td>
                    <td>${json.body.list[i].username}</td>
                    <td>xxx</td>
                    <td>${json.body.list[i].email}</td>
                    <td onclick="aaa()">XXX</td>
                    <td>2018.09.26</td>
                    <td>${json.body.list[i].mobile_phone}</td>
                    <td>
                        <a class="update_user" value=${json.body.list[i].user_id} href="javascript:;">编辑</a>
                        <a class="del_user" value=${json.body.list[i].user_id} href="javascript:;">删除</a>
                    </td>
                </tr>`)
        }
        //用户列表的编辑按钮
        $('.update_user').on('click',function () {
            $('.show1').css('display','block')
            userId = $(this).attr('value')
            $('.show1 input[type="checkbox"]').attr("checked", false)
            $.ajax({
                type:"GET",
                async: true,
                cache:true,
                url: url + '/user/get',
                data:{userId:userId},
                dataType: 'json',
                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success:function (json) {
                    //console.log(json)
                    $('.show1 input[name="update_username"]').val(json.body.username)
                    $('.show1 input[name="update_mobilePhone"]').val(json.body.mobile_phone)
                    $('.show1 input[name="update_email"]').val(json.body.email)
                    $('#update_user_select1').val(json.body.locked)
                    $('#update_user_select2').val(json.body.disable)
                    let arr_roles = json.body.roles
                    if(arr_roles.length>0){
                        for(let i=0;i<arr_roles.length;i++){
                            let id = arr_roles[i].role_id
                            $(`.show1 input[value=${id}]`).prop("checked", true)
                        }
                    }

                }
            })


        })
        //用户列表的删除按钮
        $('.del_user').on('click',function () {
            var r = confirm("确定删除此账户？");
            if (r == true){
                userId = $(this).attr('value')
                $.ajax({
                    type:"POST",
                    async: true,
                    cache:true,
                    url: url + '/user/disable',
                    data:{userId:userId},
                    dataType: 'json',
                    xhrFields:{
                        withCredentials:true
                    },
                    crossDomain: true,
                    success:function (json) {
                        if(json.head.status.code == 200){
                            alert('删除成功!')
                        }else {
                            alert(`${json.head.status.code}错误,删除失败`)
                        }

                    }
                })
            }

        })
    }

    //编辑用户提交按钮
    $('.update_user_commit').on('click',function () {
        let updateUserData = {}
        updateUserData.userId = userId
        updateUserData.username = $("input[name='update_username']").val()
        updateUserData.mobilePhone = $("input[name='update_mobilePhone']").val()
        updateUserData.email = $("input[name='update_email']").val()

        updateUserData.locked = $('#update_user_select1').val()
        updateUserData.disable = $('#update_user_select2').val()
        updateUserData.roleId = []
        $.each($('.check_juese:checked'),function () {
            updateUserData.roleId.push($(this).val())
        })
        if(!adduserData.username){
            alert("请填写用户名...")
            return
        }
        if(updateUserData.roleId.length<1){
            alert("请选择角色...")
            return
        }

        $.ajax({
            type:"POST",
            async: true,
            cache:true,
            traditional: true,
            url: url + '/user/edit',
            data:updateUserData,
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success:function (json) {
                console.log(json)
                if(json.head.status.code == 200){
                    alert('修改成功！')
                    $('.show1').css('display','none')
                    getAsyncAjaxRequest("GET", interface_url+'/user/search', getUserListData,
                        false, succFuncGetUserList, errorFunc)
                }else {
                    alert(`修改失败！${json.head.status.code}错误`)
                }
            },
            error:function () {
                alert('修改失败！')
            }

        })
    })
    $('.update_user_quxiao').on('click',function () {
        $('.show1').css('display','none')
    })

    //新增用户弹窗需要选择的角色
    getAjaxRequest("GET", interface_url+'role/search', {'page.size':100,}, userRoleList, errorFunc)
    function userRoleList(json){
        $(`.tip_add_user_right ul`).html('')
        for(let i=0;i<json.body.list.length;i++){
            $(`.tip_add_user_right ul`).append(`<li>
                                <label>
                                    <input value=${json.body.list[i].role_id} class="check_juese" type="checkbox">
                                    <span>${json.body.list[i].identity_name}</span>
                                </label>
                            </li>`)
        }
    }

    //获取角色列表
    let rolePageNumber = 1
    let rolePageCount
    let roleId
    let getRoleListData = {
        'page.number':rolePageNumber,
        'page.size':4,
        /*'username':username*/
    }
    getAjaxRequest("GET", interface_url+'role/search', getRoleListData, getRoleList, errorFunc)
    $('.juese_list_paging>:nth-child(1)').on('click',function () {
        if(rolePageNumber>1){
            $('.juese_list_paging>:nth-child(2)').addClass('page_on').removeClass('page_on_not')
            rolePageNumber--
            getRoleListData['page.number'] = rolePageNumber
            getAjaxRequest("GET", interface_url+'role/search', getRoleListData, getRoleList, errorFunc)
            if(rolePageNumber==1){
                $('.juese_list_paging>:nth-child(1)').removeClass('page_on').addClass('page_on_not')
            }
        }
    })
    $('.juese_list_paging>:nth-child(2)').on('click',function () {
        if(rolePageNumber<rolePageCount){
            $('.juese_list_paging>:nth-child(1)').addClass('page_on').removeClass('page_on_not')
            rolePageNumber++
            getRoleListData['page.number'] = rolePageNumber
            getAjaxRequest("GET", interface_url+'role/search', getRoleListData, getRoleList, errorFunc)
            if(rolePageNumber==rolePageCount){
                $('.juese_list_paging>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
            }
        }
    })

    function getRoleList(json) {
        rolePageCount = Math.ceil(json.body.total/getRoleListData["page.size"])
        if(rolePageCount<2){
            $('.juese_list_paging>:nth-child(2)').removeClass('page_on').addClass('page_on_not')
        }
        $('.juese_list').html(`<tr>
                    <th>序号</th>
                    <th>角色名称</th>
                    <th>状态</th>
                    <th>描述</th>
                    <th>操作</th>
                </tr>`)
        for(let i=0;i<json.body.list.length;i++){
            $('.juese_list').append(`<tr>
                    <td>${i+1+getRoleListData["page.size"]*(json.body.number-1)}</td>
                    <td>${json.body.list[i].identity_name}</td>
                    <td>${json.body.list[i].disable}</td>
                    <td>XXX</td>
                    <td>
                    <a class="update_role" href="javascript:;" value=${json.body.list[i].role_id}>编辑</a>
                    <a class="del_role" href="javascript:;" value=${json.body.list[i].role_id}>删除</a>
                    </td>
                </tr>`)
        }
        //编辑角色回显
        $('.update_role').on('click',function () {
            $('.show3').css('display','block')
            roleId = $(this).attr('value')
            $('.show3 input[type="checkbox"]').attr("checked", false)
            $.ajax({
                type:"GET",
                async: true,
                cache:true,
                url: url + '/role/get',
                data:{roleId:roleId},
                dataType: 'json',
                xhrFields:{
                    withCredentials:true
                },
                crossDomain: true,
                success:function (json) {
                    console.log(json)
                    $('.show3 input[name="updateIdentityName"]').val(json.body.identity_name)
                    $('.show3 input[name="updateRemarks"]').val(json.body.memo)
                    $('#update_juese_select2').val(json.body.disable)
                    let arr_resources = json.body.resources
                    if(arr_resources.length>0){
                        for(let i=0;i<arr_resources.length;i++){
                            let id = arr_resources[i].resource_id
                            $(`.show3 input[value=${id}]`).prop("checked", true)
                        }
                    }

                }
            })
        })
        //编辑角色后提交结果
        $('.update_juese_commit').on('click',function () {
            let updateRoleData = {}
            updateRoleData.roleId = roleId
            updateRoleData.identityName = $("input[name='updateIdentityName']").val()
            updateRoleData.disable = $('#update_juese_select2').val()
            updateRoleData.memo = $('input[name="updateRemarks"]').val()
            updateRoleData.resourceId = []
            $.each($('.update_role_lv3Checks:checked'),function (index) {
                //console.log(index + '个' + $(this).val())
                updateRoleData.resourceId.push($(this).val())
            })
            if(updateRoleData.resourceId<1){
                alert("请选择角色权限...")
                return
            }
            if(!updateRoleData.identityName){
                alert('请输入角色名称...')
                return
            }
            $.ajax({
                type:"POST",
                async: true,
                cache:true,
                url: url + '/role/edit',
                data:updateRoleData,
                dataType: 'json',
                xhrFields:{
                    withCredentials:true
                },
                traditional: true,
                crossDomain: true,
                success:function (json) {
                    console.log(json)
                    if(json.head.status.code == 200){
                        alert('修改成功！')
                        $('.show3').css('display','none')
                        getAjaxRequest("GET", interface_url+'role/search',
                            getRoleListData, getRoleList, errorFunc)
                    }else {
                        alert(`修改失败！${json.head.status.code}错误`)
                    }
                },
                error:function () {
                    alert('修改失败！')
                }

            })
        })
        $('.update_juese_quxiao').on('click',function () {
            $('.show3').css('display','none')
        })
        //角色列表删除按钮
        $('.del_role').on('click',function () {
            var r = confirm("确定删除此角色？");
            if (r == true){
                roleId = $(this).attr('value')
                $.ajax({
                    type:"POST",
                    async: true,
                    cache:true,
                    url: url + '/role/disable',
                    data:{roleId:roleId},
                    dataType: 'json',
                    xhrFields:{
                        withCredentials:true
                    },
                    crossDomain: true,
                    success:function (json) {
                        if(json.head.status.code == 200){
                            alert('删除成功！')
                            getAjaxRequest("GET", interface_url+'role/search',
                                getRoleListData, getRoleList, errorFunc)
                        }
                    }
                })
            }

        })

        /*$.ajax({
            type:"GET",
            async: true,
            cache:true,
            url: url + '/role/search',
            data:{'page.number':role_pageNumber,
                'page.size':10,
                /!*identityName:identityName*!/
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
                    <a class="update_role" href="javascript:;" value=${json.body.list[i].role_id}>编辑</a>
                    <a class="del_role" href="javascript:;" value=${json.body.list[i].role_id}>删除</a>
                    </td>
                </tr>`)
                }
                //编辑角色回显
                $('.update_role').on('click',function () {
                    $('.show3').css('display','block')
                    roleId = $(this).attr('value')
                    $('.show3 input[type="checkbox"]').attr("checked", false)
                    $.ajax({
                        type:"GET",
                        async: true,
                        cache:true,
                        url: url + '/role/get',
                        data:{roleId:roleId},
                        dataType: 'json',
                        xhrFields:{
                            withCredentials:true
                        },
                        crossDomain: true,
                        success:function (json) {
                            console.log(json)
                            $('.show3 input[name="updateIdentityName"]').val(json.body.identity_name)
                            $('.show3 input[name="updateRemarks"]').val(json.body.memo)
                            $('#update_juese_select2').val(json.body.disable)
                            let arr_resources = json.body.resources
                            if(arr_resources.length>0){
                                for(let i=0;i<arr_resources.length;i++){
                                    let id = arr_resources[i].resource_id
                                    $(`.show3 input[value=${id}]`).prop("checked", true)
                                }
                            }

                        }
                    })
                })
                //编辑角色后提交结果
                $('.update_juese_commit').on('click',function () {
                    let updateRoleData = {}
                    updateRoleData.roleId = roleId
                    updateRoleData.identityName = $("input[name='updateIdentityName']").val()
                    updateRoleData.disable = $('#update_juese_select2').val()
                    updateRoleData.memo = $('input[name="updateRemarks"]').val()

                    $.each($('.update_role_lv3Checks:checked'),function (index) {
                        //console.log(index + '个' + $(this).val())
                        updateRoleData[`resourceId[${[index]}]`] = $(this).val()
                    })
                    //console.log(addRoleData)
                    if(!updateRoleData.identityName){
                        alert('请输入角色名称')
                        return
                    }
                    $.ajax({
                        type:"POST",
                        async: true,
                        cache:true,
                        url: url + '/role/edit',
                        data:updateRoleData,
                        dataType: 'json',
                        xhrFields:{
                            withCredentials:true
                        },
                        crossDomain: true,
                        success:function (json) {
                            console.log(json)
                            if(json.head.status.code == 200){
                                alert('修改成功！')
                                $('.show3').css('display','none')
                                window.location.reload()
                            }else {
                                alert(`修改失败！${json.head.status.code}错误`)
                            }
                        },
                        error:function () {
                            alert('修改失败！')
                        }

                    })
                })
                $('.update_juese_quxiao').on('click',function () {
                    $('.show3').css('display','none')
                })
                //角色列表删除按钮
                $('.del_role').on('click',function () {
                    roleId = $(this).attr('value')
                    $.ajax({
                        type:"POST",
                        async: true,
                        cache:true,
                        url: url + '/role/disable',
                        data:{roleId:roleId},
                        dataType: 'json',
                        xhrFields:{
                            withCredentials:true
                        },
                        crossDomain: true,
                        success:function (json) {
                            console.log(json)
                        }
                    })
                })

            },
            error:function () {
                console.log('fail');
            }
        })*/
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
                            <input type="checkbox" class="secondCheck" id="secondCheck${i+1}" style="display:none; float: left; width: 15px; height: 15px;margin-top: 3px"/>
                            <li id="lv2L${i+1}" class="lv2L">
                                <label for="secondCheck${i+1}">${json.body[i].identity_name}</label>
                                <ul id="lv3U${i+1}" class="lv3U" style="clear: left;">
                                    
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
                addRoleData.resourceId = []
                $.each($('.lv3Checks:checked'),function () {
                    //console.log(index + '个' + $(this).val())
                    addRoleData.resourceId.push($(this).val())
                })
                //console.log(addRoleData)
                if(!addRoleData.identityName){
                    alert('请输入角色名称...')
                    return
                }
                if(addRoleData.resourceId.length<1){
                    alert('请选择角色权限...')
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
                    traditional: true,
                    crossDomain: true,
                    success:function (json) {
                        console.log(json)
                        if(json.head.status.code == 200){
                            alert('新增成功！')
                            $('.show2').css('display','none')
                            getAjaxRequest("GET", interface_url+'role/search', getRoleListData, getRoleList, errorFunc)
                        }else {
                            alert(`提交失败！${json.head.status.message}`)
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
                            <input type="checkbox" class="update_role_secondCheck" id="update_role_secondCheck${i+1}" style="display:none; float: left; width: 15px; height: 15px;margin-top: 3px"/>
                            <li id="update_role_lv2L${i+1}" class="update_role_lv2L">
                                <label for="update_role_secondCheck${i+1}">${json.body[i].identity_name}</label>
                                <ul id="update_role_lv3U${i+1}" class="update_role_lv3U" style="clear: left;">
                                    
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

    //所有请求失败的回调
    function errorFunc() {
        alert("请求失败,请检查您的网络是否通畅")
        console.log('file')
    }

})(window)


