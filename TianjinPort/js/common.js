/**
 * ajax 请求封装
 * @param type  请求类型
 * @param url   请求路径
 * @param data  请求参数
 * @param succFunc 成功回调
 * @param errFunc  失败回调
 * @returns
 */
function getAjaxRequest(type, url, data, succFunc, errFunc){
	$.ajax({
	    type: type,
	    url: url,
	    data: data,
	    dataType: 'json',
	    xhrFields:{
	        withCredentials:true
	    },
	    traditional: true,
	    crossDomain: true,
	    cache:true,
	    async: true,
	    success: function (json) {
	    	succFunc(json);
	    },
	    error: errFunc
	})
}

/**
 * 
 * @param features 几何数据集
 * @param lon 经度
 * @param lat 纬度
 * @param fid feature编号
 * @returns
 */
function insertMapPoint(features, lon, lat, fid){
	var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon,lat]))
    });
	feature.setId(fid);
	feature.setStyle(
		new ol.style.Style({
	       image:new ol.style.Icon({
	    	   color: "white",
	    	   src:'/img/icon/1.png'
	       })
		})
	)
    features.push(feature);
}