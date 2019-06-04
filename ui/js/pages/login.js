$(document).ready(function(){
	var page = {
		/*loading : new DBapp.ui.Loading({
			msg : Lang.loading
		}),*/
	  init : function() {
	  	var self = this;
	  	base.showProduceInfo();
	  	self.form = document.getElementById("id-form");
	  	self.form.$submit = $(self.form.submit);
	  	self.form.username.value = "";
	  	self.form.password.value = "";
	  	self.form.onsubmit = function() {
	  		var username = $.trim(self.form.username.value);
		  	var password = $.trim(self.form.password.value);
		  	if(DBapp.isBlank(username)) {
		  		DBapp.ui.error(self.form.username, "用户名不能为空");
		  		return false;
		  	}
		  	if(DBapp.isBlank(password)) {
		  		DBapp.ui.error(self.form.password, "密码不能为空");
		  		//DBapp.ui.error(self.form.password, "用户名或密码错误");
		  		self.form.password.focus();
		  		return false;
		  	}
	  		DBapp.showProcessing(self.form.$submit);
	  		setTimeout(function() {
	  			self.req_login({
	  				name : username,
	  				//password : password
	  				password : hex_md5(password)
		  		});
	      }, 500);
	  		return false;
	  	};
	  	self.form.username.focus();
	  },
	  req_login : function(param) {
	  	//self.loading.show();
	  	//param.Action = setting.action.LOGIN;
	  	var self = this;
	  	$.ajax({
	 			type : "post",
	 			url : base.getAction("login.do"),
	 			dataType : "json",
	 			//contentType : "application/json",
	 			//data : Dldh.Cookies.get(sys.SESSION_USER),
	 			data : param,
	 			success : function(data) {
	 				//self.loading.hide();
	 				DBapp.hideProcessing(self.form.$submit);
	 				if(data && data.ret) {
	 					base.start(data.dataList);
	 					window.location.href = "index.html";
	 					//base.init(data.menu);
	 				} else {
	 					DBapp.ui.error(self.form.username, data.msg || "用户名或密码错误");
	 				}
	 			},
	 			error : function(XMLHttpRequest, textStatus, errorThrown) {
	 				//self.loading.hide();
	 				DBapp.hideProcessing(self.form.$submit);
	 				//DBapp.ui.error(self.form.username, Lang.operateTimeout);
	 				window.location.href = "doc/grid.html";
	 			}
	 		});
	  }
	};
	page.init();
});