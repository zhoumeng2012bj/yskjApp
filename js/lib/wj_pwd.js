//手机号码验证
function checkPhone(id){
   var phone = document.getElementById(id).value;
   if(!(/^1[345678]\d{9}$/.test(phone))){
   		mui.alert('请确认填写手机号是否正确', '提示', function(){});
   		return false;
   }else{
   		return true;
   }
 }
//手机号码验证
function checkPhone1(id){
   var phone = document.getElementById(id).value;
   if(!(/^1[345678]\d{9}$/.test(phone))){
// 		mui.alert('请确认填写手机号是否正确', '提示', function(){});
   		return false;
   }else{
   		return true;
   }
 }
//获取验证密码倒计时
var tag = true;
var countdown=60; 
function settime(obj) {
    if (countdown == 0) { 
    	tag = true;
        obj.html("获取验证码");
        countdown = 60; 
        return;
    } else { 
    	tag = false;
        obj.html("重新发送(" + countdown + ")"); 
        countdown--;
    } 
	setTimeout(function() { 
    	settime(obj) 
	},1000)
}
var yzmobj = $('.hqyzm');//获取验证码对象
var telnumber = '';//手机号
var yzm = '';//验证码
var phonenumber = '';
var pwd = '';
var pwd1 = '';
var user_new = {};
//用户注册页面交互
document.getElementById("tel").addEventListener('input',function(){
	if(this.value != ''){
		telnumber = this.value;
		$('.hqyzm').css({'color':'#2b70d8'});
		if(checkPhone1('tel')){
			$('.tip1').html('手机号输入合法');
			$('.tip1').addClass('tip_color');
		}else{
			$('.tip1').removeClass('tip_color');
			$('.tip1').html('手机号输入不合法')
		}
		btnzt();
	}else{
		$('.hqyzm').css({'color':'#c8c8c8'});
		telnumber = '';
		btnzt();
		$('.tip1').removeClass('tip_color');
		$('.tip1').html('');
	}
});
document.getElementById("hqyzm").addEventListener('input',function(){
	if(this.value != ''){
		yzm = this.value;
		btnzt();
	}else{
		yzm = '';
		btnzt();
		$('.tip2').removeClass('tip_color');
		$('.tip2').html('');
	}
});
document.getElementById("yinc").addEventListener('input',function(){
	if(this.value != ''){
		pwd = this.value;
		if(pwd.length>=6){
			$('.tip3').html('正确');
			$('.tip3').addClass('tip_color');
		}else{
			$('.tip3').removeClass('tip_color');
			$('.tip3').html('密码最少为6位');
		}
		btnzt();
	}else{
		pwd = '';
		btnzt();
		$('.tip3').removeClass('tip_color');
		$('.tip3').html('');
	}
});
document.getElementById("yinc1").addEventListener('input',function(){
	if(this.value != ''){
		if(this.value.length>=6){
		pwd1 = this.value;
		if(pwd == pwd1){
			$('.tip4').html('正确');
			$('.tip4').addClass('tip_color');
		}else{
			$('.tip4').removeClass('tip_color');
			$('.tip4').html('两次输入的密码不一致');
		}
		btnzt();
		}else{
			$('.tip4').removeClass('tip_color');
			$('.tip4').html('密码最少为6位');
			
		}
	}else{
		pwd1 = '';
		btnzt();
		$('.tip4').removeClass('tip_color');
		$('.tip4').html('');
	}
});
function btnzt(){
	if(telnumber != '' && yzm != '' && pwd != '' && pwd1 != ''){
		$('.btn').css({'background':'#2b70d8'});
	}else{
		$('.btn').css({'background':'#d2d2d2'});
	}
}
//发送验证码方法
function sendyzm(){
	createcookie();
	mui.ajax(url + '/yskjApp/appYskj/V1/getCode.do',{
		data:{
			"phone":telnumber,
			"cookie":JSON.parse(localStorage.getItem('cookxs'))
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				console.log('验证码发送成功！')
			}else{
				mui.toast(data.message,{ duration:'3000', type:'div' }) 
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//点击获取验证码
$('.hqyzm').click(function(){
	telnumber = $('#tel').val();
	if(telnumber != ''){
		if(checkPhone('tel') == true){			
			check_tel1();//调取验证系统有无此用户方法
		}
	}else{
		mui.alert('请填写手机号码', '提示', function(){});
	}
});
//生成cookie
function createcookie(){
	var cookxs = new Date;
	localStorage.setItem('cookxs', JSON.stringify(cookxs));
	return cookxs;
}
//生成用户注册登录cookie
function createcookie_yh(){
	var cookxs_yh = new Date;
	localStorage.setItem('cookxs_yh', JSON.stringify(cookxs_yh));
	return cookxs_yh;
}
//密码登陆时判断系统有无此用户信息
function check_tel1(){
	phonenumber = $('#tel').val();
	mui.ajax(url + '/yskjApp/appYskj/V1/compLog.do',{
		data:{"phone":telnumber},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				if(tag){
					tag = false;
					settime(yzmobj);//验证码倒计时
					sendyzm();//获取验证码
				}
			}else{
				mui.alert(data.message+'请先进行注册', '提示', function(){});
				return;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//校验验证码
function checkoutyzm(code){
	hqyh_id();//获取用户信息
	mui.ajax(url + '/yskjApp/appYskj/V1/compCode.do',{
		data:{
			"code":code,
			"cookie":JSON.parse(localStorage.getItem('cookxs'))
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				//提交接口
				zhmm();
				$('.tip2').html('验证码输入正确');
				$('.tip2').addClass('tip_color');
				console.log(data.message)
			}else{
				$('.tip2').removeClass('tip_color');
				$('.tip2').html('验证码输入有误');
				mui.toast('验证码输入有误',{ duration:'3000', type:'div' }) 
				return false;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//提交
$('#btn1').click(function(){
	if(telnumber !='' && yzm !='' && pwd != '' && pwd1 != ''){
		if(pwd.length<6||pwd1.length<6){
						mui.toast('密码至少输入6位',{ duration:'3000', type:'div' });
						return;
			}else{
					if(pwd == pwd1){
						checkoutyzm(yzm);
					}else{
						mui.toast('两次输入密码不一致',{ duration:'3000', type:'div' });
						return;
			        }
		}
		
		
	}else{
		mui.toast('请将信息填写完整',{ duration:'3000', type:'div' });
	}
})
function zhmm(){
	createcookie_yh();
	mui.ajax(url + '/yskjApp/appYskj/V1/remPass.do',{
		data:{
			"cookie":JSON.parse(localStorage.getItem('cookxs_yh')),
			"id":JSON.stringify(user_new.id),
			"pass":hex_md5(hex_sha1(pwd1))
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				mui.toast('找回成功，已登录',{ duration:'3000', type:'div' }) 
				mui.openWindow({
					url: '../wd.html', 
					id:'wd_yh'
				});
			}else{
//				mui.alert(data.message+'请先进行注册', '提示', function(){});
				return;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});
}
function hqyh_id(){
	mui.ajax(url + '/yskjApp/appYskj/V1/getInfo.do',{
		data:{
			"phone":telnumber
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				user_new = data.data;
			}else{
				return;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});
}
