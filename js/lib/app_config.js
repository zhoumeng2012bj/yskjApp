var url = 'http://116.62.68.26:8080';//测试地址
var Interface_url = 'http://116.62.68.26:8080';//接口的测试地址
var img_url = 'http://116.62.68.26/';//图片的地址
//var img_url = 'http://47.92.145.21:81/';//图片的地址
function denglu_zt(){
	mui.ajax(url + '/yskjApp/appYskj/V1/landState.do',{
		data:{
			"cookie":JSON.parse(localStorage.getItem('cookxs_yh')),
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				alert(data.success);
			}else{
				
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});
}