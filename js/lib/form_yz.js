//手机号码验证
function checkPhone(id){
   var phone = document.getElementById(id).value;
   if(!(/^1[34578]\d{9}$/.test(phone))){
   		mui.alert('请确认填写手机号是否正确', '提示', function(){});
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
//验证码登陆时判断及交互
document.getElementById("tel").addEventListener('input',function(){
	if(this.value != ''){
		telnumber = this.value;
		$('.hqyzm').css({'color':'#2b70d8'});
		btnzt();
	}else{
		$('.hqyzm').css({'color':'#c8c8c8'});
		telnumber = '';
		btnzt();
	}
});
document.getElementById("hqyzm").addEventListener('input',function(){
	if(this.value != ''){
		yzm = this.value;
		btnzt();
	}else{
		yzm = '';
		btnzt();
	}
});
function btnzt(){
	if(telnumber != '' && yzm != ''){
		$('.btn').css({'background':'#2b70d8'});
	}else{
		$('.btn').css({'background':'#d2d2d2'});
	}
}
//密码登录时判断及交互
document.getElementById("phone").addEventListener('input',function(){
	if(this.value != ''){
		phonenumber = this.value;
		btnzt1();
	}else{
		phonenumber = '';
		btnzt1();
	}
});
document.getElementById("yinc").addEventListener('input',function(){
	if(this.value != ''){
		pwd = this.value;
		btnzt1();
	}else{
		pwd = '';
		btnzt1();
	}
});
function btnzt1(){
	if(phonenumber != '' && pwd != ''){
		$('.btn1').css({'background':'#2b70d8'});
	}else{
		$('.btn1').css({'background':'#d2d2d2'});
	}
}
//判断系统有无此用户信息
function check_tel(){
	telnumber = $('#tel').val();
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
				mui.alert(data.message+'请点击屏幕下方"快速注册"进行注册', '提示', function(){});
				return;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
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
			check_tel();//调取验证系统有无此用户方法
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
//校验验证码
function checkoutyzm(code){
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
				signin();//登陆
				console.log(data.message)			
			}else{
				mui.toast('验证码输入有误',{ duration:'3000', type:'div' }) 
				return
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//验证码验证成功后进行'用户登陆'
function signin(){
	createcookie_yh();
	mui.ajax(url + '/yskjApp/appYskj/V1/logPhone.do',{
		data:{
			"phone":telnumber,
			"cookie":JSON.parse(localStorage.getItem('cookxs_yh'))
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				mui.toast('登陆成功',{ duration:'2000', type:'div' }) 
				console.log(data.message)	
				//登陆成功后跳转'我的'页面
				mui.openWindow({
					url: '../wd.html', 
					id:'wd1',
				});
				return;
			}else{
				alert(123)
				mui.toast(data.message,{ duration:'2000', type:'div' }) 
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});
}
//点击登陆
$('.btn').click(function(){
	if(telnumber!='' && yzm!=''){
		checkoutyzm(yzm);//验证码校验方法
	}else{
		if(telnumber == ''){
			mui.toast('手机号不能为空',{ duration:'2000', type:'div' }) 
			return;
		}
		if(yzm == ''){
			mui.toast('请输入手机验证码',{ duration:'2000', type:'div' })	
			return;
		}		
	}
});
//密码登陆时判断系统有无此用户信息
function check_tel1(){
	phonenumber = $('#phone').val();
	mui.ajax(url + '/yskjApp/appYskj/V1/compLog.do',{
		data:{"phone":phonenumber},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				denglu();//账号密码登陆
			}else{
				mui.alert(data.message+'请点击屏幕下方"快速注册"进行注册', '提示', function(){});
				return;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//账号密码登陆
function denglu(){
	createcookie_yh();//重新生成cookie
	mui.ajax(url + '/yskjApp/appYskj/V1/logAccount.do',{
		data:{
			"phone":phonenumber,
			"pass":hex_md5(hex_sha1(pwd)),
			"cookie":JSON.parse(localStorage.getItem('cookxs_yh'))
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				mui.toast('登陆成功',{ duration:'2000', type:'div' }) 
				console.log(data.message)	
				//登陆成功后跳转'我的'页面
				
				
//				detailPage = plus.webview.getLaunchWebview();
//				    mui.fire(detailPage,'newsId',{
//				            id:4
//				      });                                       
//				    var dqid = plus.webview.currentWebview().id;
//				    if(dqid != 'sy.html' && dqid != 'jxfy.html' && dqid != 'fwsc.html' && dqid != 'qyhl.html' && dqid != 'wd.html'){
//				        plus.webview.currentWebview().close()
//				    }
//				    plus.webview.currentWebview().hide();
//				    plus.webview.show('wd.html',"fade-in",300);
				mui.openWindow({
					url: '../wd.html', 
					id:'wd'
				});
				return;
			}else{
				mui.toast(data.message,{ duration:'2000', type:'div' }) 
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});
}
$('.btn1').click(function(){
	check_tel1();//账号密码验证及登陆
});