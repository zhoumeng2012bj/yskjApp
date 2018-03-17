//检测网络环境是否链接
function networkLink(){
	if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		mui.toast("网络异常，请检查网络设置！");
	}else{
		window.onload();
	}
}

