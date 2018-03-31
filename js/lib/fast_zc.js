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
//用户注册页面交互
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
document.getElementById("yinc").addEventListener('input',function(){
	if(this.value != ''){
		pwd = this.value;
		btnzt1();
	}else{
		pwd = '';
		btnzt1();
	}
});
document.getElementById("yinc1").addEventListener('input',function(){
	if(this.value != ''){
		pwd1 = this.value;
		btnzt1();
	}else{
		pwd1 = '';
		btnzt1();
	}
});
function btnzt1(){
	if(pwd != '' && pwd1 != ''){
		$('.btn1').css({'background':'#2b70d8'});
	}else{
		$('.btn1').css({'background':'#d2d2d2'});
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
			check_telzc();//调取验证系统有无此用户方法
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
//用户注册手机号判断手机号是否注册过
function check_telzc(){
	telnumber = $('#tel').val();
	mui.ajax(url + '/yskjApp/appYskj/V1/comReg.do',{
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
				mui.alert(data.message, '提示', function(){});
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
				$('.box_i').css('display','block');
				$('.box_i1').css('display','none');
				console.log(data.message)
			}else{
				mui.toast('验证码输入有误',{ duration:'3000', type:'div' }) 
				return false;
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//点击下一步
$('#btn').click(function(){
	clk();
})
function clk(){
	//按钮点击判断
	if(telnumber != '' && yzm != ''){
		checkoutyzm(yzm);
	}else{
		if(telnumber == ''){
			mui.toast('手机号不能为空',{ duration:'2000', type:'div' });
			return;
		}
		if(yzm == ''){
			mui.toast('请填写验证码',{ duration:'2000', type:'div' });
			return;
		}
	}		
}
//注册并登录
//var btn = document.getElementById('btn');
//var clicktag = 0;
//btn.onclick = function () {
//	if (clicktag == 0) {
//     clicktag = 1;
//     setTimeout(function () { clicktag = 0; }, 5000);
//     
//	}else{
//		mui.toast('点击过于频繁！',{ duration:'2000', type:'div' });
//		return;
//	}
//};
var clicktag = 0;
$('#btn1').click(function(){
	if(clicktag == 0){
		clicktag = 1;
		if(pwd != '' && pwd1 != ''){
			if(pwd.length<6||pwd1.length<6){
				mui.toast('密码至少输入6位',{ duration:'3000', type:'div' });
				return;
			}else{
			if(pwd == pwd1){
				//注册方法	
				zhuce();
			}else{
				mui.toast('两次密码输入不一致',{ duration:'3000', type:'div' });
				return;
			}
			}
		}else{
			mui.toast('请将密码填写完整',{ duration:'3000', type:'div' });
		}
    	setTimeout(function () { clicktag = 0; }, 5000);
	}else{
		mui.toast('点击过于频繁！',{ duration:'2000', type:'div' });
		return;
	}
})
//$('#btn1').click(function(){
//	if(pwd != '' && pwd1 != ''){
//		if(pwd.length<6||pwd1.length<6){
//			mui.toast('密码至少输入6位',{ duration:'3000', type:'div' });
//			return;
//		}else{
//		if(pwd == pwd1){
//			//注册方法	
//			zhuce();
//		}else{
//			mui.toast('两次密码输入不一致',{ duration:'3000', type:'div' });
//			return;
//		}
//		}
//	}else{
//		mui.toast('请将密码填写完整',{ duration:'3000', type:'div' });
//	}
//})
//注册接口调用
function zhuce(){
	createcookie_yh();
	mui.ajax(url + '/yskjApp/appYskj/V1/register.do',{
		data:{
			"phone":telnumber,
			"cookie":JSON.parse(localStorage.getItem('cookxs_yh')),
			"pass":hex_md5(hex_sha1(pwd))
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				mui.toast('注册成功已登陆',{ duration:'2000', type:'div' }) 
				console.log(data.message)	
				//登陆成功后跳转'我的'页面
				var target = plus.webview.getWebviewById('login');
			    // 执行相应的事件
			    mui.fire(target, 'login_back', {
			    	'login_b':1
			    });
				mui.back();
//				mui.openWindow({
//					url: '../wd.html', 
//					id:'wd'
//				});
				return;
			}else{
				
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
