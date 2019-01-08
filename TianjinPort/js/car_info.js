
(function (window, document) {
    function car_info(json){
        if(json.head.status.code == 200){
            var info = json.body;

            //console.log(info)
            //设置弹出框内容，可以HTML自定义 //<p><span>型号：</span><span>${info.model_number}</span></p>
            $('#popup-content').html(`<p><span>车辆：</span><span>${info.plate_number}</span></p>
                                            <p><span>部门：</span><span>${info.department.identity_name}</span></p>
                                            
                                            <p><span>时间：</span><span>${info.gather_time}</span></p>
                                            <p><span>当前速度：</span><span>${info.velocity}km/h</span></p>
                                            <p><span>总里程：</span><span>${info.total_mileage}km&nbsp;,</span>&nbsp;&nbsp;<span>当日里程：</span><span>${info.daily_mileage}km</span></p>
                                            <p><span>状态：</span><span>${info.state==1?'空闲':info.state==2?'忙碌':'离线'}</span></p>`)
        }else{
            //alert(json.head.status.message);
            new $Msg({
                content:json.head.status.message,
                type:"success",
            })
        }
    }

    window.car_info = car_info;
})(window, document)