Ajax = $.ajax;
$.ajax = function(D) {
	D.complete = function(XMLHttpRequest, textStatus) {
		if (XMLHttpRequest.getResponseHeader("sessionstatus") == "loginout") {
			var str = parent.location.href.replace(parent.location.search, "");
			if (str != "login.html") {
				parent.location.href = "/login.html";
			}
		}
		/*
		 * if(XMLHttpRequest.getResponseHeader("sessionstatus") == "loginout") {
		 * var str = parent.location.href.replace(parent.location.search, "");
		 * if(str != "login.html") { parent.location.href = "/login.html"; } }
		 */
	}
	Ajax(D);
}
var base = {
	/*
	 * datePicker : window.laydate || function(opt) { laydate(opt); },
	 */
	gridHeight : 386,
	isNotEmpty : function(v) {
		if (v === undefined || v === null || $.trim(v) == "") {
			return false;
		}
		return true;
	},
	setData : function(el, data) {
		if (!el) {
			return null;
		}
		return jQuery(DBapp.getDom(el)).data("data", data);
	},
	getData : function(el) {
		if (!el) {
			return null;
		}
		return jQuery(DBapp.getDom(el)).data("data");
	},
	getToken : function() {
		if (DBapp.isBlank(DBapp.Cookies.get("token"))) {
			return "";
		}
		return DBapp.Cookies.get("token");
	},
	getCurrentUser : function() {
		if (DBapp.isBlank(DBapp.Cookies.get("user"))) {
			return "";
		}
		return DBapp.decode(DBapp.Cookies.get("user"));
	},
	start : function(data) {
		if (data) {
			if (data && data[0]) {
				DBapp.Cookies.set("token", data[0]);
			}
			if (data && data[1]) {
				base.user = data[1];
				DBapp.Cookies.set("user", DBapp.encode(base.user));
			}
		}
	},
	end : function() {
		DBapp.Cookies.set("token", "");
		DBapp.Cookies.set("user", "");
	},
	getAction : function(url) {
		// param = param || {};
		// param.token = base.getToken();
		// return "token=" + base.getToken();
		return setting.path + url + "?token=" + base.getToken();
	},
	getRootPath : function() {
		// 获取当前url，如： http://localhost:8080/dldh-cms/pages/index.html
		var url = window.document.location.href;
		// 获取主机地址之后的路径，如： dldh-cms/pages/index.html
		var path = window.document.location.pathname;
		var pos = url.indexOf(path);
		// 获取主机路径，如： http://localhost:8080
		var hostPort = url.substring(0, pos);
		// 获取带"/"的项目名，如：/dldh-cms
		var context = path.substring(0, path.substr(1).indexOf('/') + 1);
		return (hostPort + context);
	},
	uploadCallback : function(d) {
		d = $.trim(d);
		if (d !== "") {
			// d = DBapp.decode(d);
			if (d.success) {
				// DBapp.ui.Msg.Alert(Lang.ts, d.msg ? d.msg :
				// Lang.operateIsOk);
			} else {
				// DBapp.ui.Msg.Alert(Lang.ts, d.msg ? d.msg :
				// Lang.operateIsError);
			}
		}
		return d;
	},
	action : {},
	error : {},
	CONST : {
		SEPARATOR : " - ",
		FORMAT : "YYYY-MM-DD hh:mm:ss"
	},
	actionSuffix : "",// .do
	firstLink : null,
	format : function(date, format) {
		var o = {
			"M+" : date.getMonth() + 1, // month
			"D+" : date.getDate(), // day
			"h+" : date.getHours(), // hour
			"m+" : date.getMinutes(), // minute
			"s+" : date.getSeconds(), // second
			"q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
			"S" : date.getMilliseconds()
		// millisecond
		};
		if (/(Y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		}
		for ( var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	},
	showTime : function(start, end) {
		var D, H, M, S, dTime = end - start;
		if (dTime >= 0) {
			D = Math.floor(dTime / 86400000)
			dTime -= D * 86400000;
			H = Math.floor(dTime / 3600000)
			dTime -= H * 3600000;
			M = Math.floor(dTime / 60000)
			dTime -= M * 60000;
			S = Math.floor(dTime / 1000)
			/*
			 * if (H < 10) H = "0" + H; if (M < 10) M = "0" + M; if (S < 10) S =
			 * "0" + S;
			 */
			return {
				day : D,
				hour : H,
				minute : M,
				secode : S
			};
		} else {
			return {
				// day : 0,
				// hour : 0,
				// minute : 0,
				secode : 0
			};
		}
	},
	_showTime : function(estimated) {
		var D, H, M, S, dTime = parseInt(estimated, 10) * 1000;
		if (dTime >= 0) {
			D = Math.floor(dTime / 86400000)
			dTime -= D * 86400000;
			H = Math.floor(dTime / 3600000)
			dTime -= H * 3600000;
			M = Math.floor(dTime / 60000)
			dTime -= M * 60000;
			S = Math.floor(dTime / 1000)
			/*
			 * if (H < 10) H = "0" + H; if (M < 10) M = "0" + M; if (S < 10) S =
			 * "0" + S;
			 */
			return {
				day : D,
				hour : H,
				minute : M,
				secode : S
			};
		} else {
			return {
				// day : 0,
				// hour : 0,
				// minute : 0,
				secode : 0
			};
		}
	},
	transDate : function(time, format) {
		if (!time) {
			return "";
		}
		return base.format(new Date(time), format || base.CONST.FORMAT);
	},
	createLv : function(v) {
		var r = v.split(","), rs = [], g;
		if (!$.isArray(r)) {
			r = [ r ];
		}
		if (r.length >= 5) {
			return "全部级别";
		}
		for (var i = 0; i < r.length; i++) {
			g = base.tranLevel(r[i]);
			rs.push('<span style="color:' + g.color + ';margin-right: 10px;">'
					+ g.name + '</span>');
		}
		return rs.join("");
	},
	currentStatusData : [ {
		name : "其它异常",
		color : "#DA4453",
		value : 0
	}, {
		name : "未审核",
		// color : "#FFCE54",
		value : 1
	}, {
		// name : "审核通过",
		name : "扫描等待中",
		// color : "#A0D468",
		value : 2
	}, {
		name : "审核未通过",
		color : "#DA4453",
		value : 3
	}, {
		name : "等待中",
		// color : "#DA4453",
		value : 10
	}, {
		name : "执行中",
		// color : "#FFCE54",
		value : 11
	}, {
		name : "已完成",
		// color : "#A0D468",
		value : 12
	}, {
		name : "部分完成",
		// color : "#666666",
		value : 13
	}, {
		name : "超时",
		// color : "#666666",
		value : 14
	}, {
		name : "停止",
		// color : "#666666",
		value : 15
	}, {
		name : "暂停",
		// color : "#666666",
		value : 17
	}, {
		name : "延后",
		value : 18
	}, {
		name : "下载成功",
		// color : "#A0D468",
		value : 20
	}, {
		name : "报告下载中",
		// color : "#A0D468",
		value : 21
	}, {
		name : "扫描报告未导入",
		// color : "#666666",
		value : 30
	}, {
		name : "扫描报告导入等待解析",
		// color : "#DA4453",
		value : 31
	}, {
		name : "扫描报告解析完成",
		// color : "#FFCE54",
		value : 32
	}, {
		name : "扫描报告部分导入",
		// color : "#A0D468",
		value : 33
	}, {
		name : "已完成",
		// name : "扫描报告解析成功",
		// color : "#666666",
		value : 35
	}, {
		name : "重解析",
		// name : "扫描报告解析成功",
		// color : "#666666",
		value : 36
	}, {
		name : "执行失败",
		color : "#DA4453",
		value : 40
	}, {
		// name : "强制终止",
		name : "超时",
		color : "#DA4453",
		value : 41
	}, {
		name : "扫描报告导入失败",
		color : "#DA4453",
		value : 42
	}, {
		name : "扫描报告下载失败",
		color : "#DA4453",
		value : 43
	} ],
	tranCurrentStatusData : function(v) {
		v = parseInt(v, 10);
		for (var i = 0; i < base.currentStatusData.length; i++) {
			if (base.currentStatusData[i].value == v) {
				return base.currentStatusData[i];
			}
		}
		return null;
	},
	stateData : [ {
		name : "未修复",
		color : "#F2152B",
		value : 0
	}, {
		name : "修复中",
		color : "#F2A11E",
		value : 1
	}, {
		name : "已修复",
		color : "#1DAE0D",
		value : 2
	}, {
		name : "忽略",
		color : "#666666",
		value : 3
	} ],
	tranState : function(v) {
		v = parseInt(v, 10);
		for (var i = 0; i < base.stateData.length; i++) {
			if (base.stateData[i].value == v) {
				return base.stateData[i];
			}
		}
		return null;
	},
	sourceData : [ {
		name : "本平台",
		// color : "#DA4453",
		value : 1
	}, {
		name : "手工导入",
		// color : "#FFCE54",
		value : 2
	}, {
		name : "ITSM",
		// color : "#A0D468",
		value : 3
	} ],
	tranSource : function(v) {
		v = parseInt(v, 10);
		for (var i = 0; i < base.sourceData.length; i++) {
			if (base.sourceData[i].value == v) {
				return base.sourceData[i];
			}
		}
		return null;
	},
	newFixedStateData : [ {
		name : "未修复",
		color : "#F2152B",
		value : false
	}, {
		name : "已修复",
		color : "#1DAE0D",
		value : true
	} ],
	tranNewFixedState : function(v) {
		for (var i = 0; i < base.newFixedStateData.length; i++) {
			if (base.newFixedStateData[i].value == v) {
				return base.newFixedStateData[i];
			}
		}
		return null;
	},
	levelData : [ {
		name : "信息",
		color : "#5B980D",
		cls : 'info-color',
		value : 1
	}, {
		name : "低",
		color : "#FFC01C",
		cls : 'low-color',
		value : 2
	}, {
		name : "中",
		color : "#FF8932",
		cls : 'mid-color',
		value : 3
	}, {
		name : "高",
		color : "#FF0505",
		cls : 'high-color',
		value : 4
	}, {
		name : "紧急",
		color : "#B50F20",
		cls : 'urgent-color',
		value : 5
	} ],
	tranLevel : function(v) {
		v = parseInt(v, 10);
		for (var i = 0; i < base.levelData.length; i++) {
			if (base.levelData[i].value == v) {
				return base.levelData[i];
			}
		}
		return {
			name : "",
			color : "#333333",
			cls : "",
			value : ""
		};
	},
	addData : [ {
		name : "否",
		value : 0,
		color : "#333333"
	}, {
		name : "是",
		value : 1,
		color : "#285B83"
	} ],
	tranAdd : function(v) {
		v = parseInt(v, 10);
		for (var i = 0; i < base.addData.length; i++) {
			if (base.addData[i].value == v) {
				return base.addData[i];
			}
		}
		return {
			name : "",
			value : "",
			color : ""
		};
	},
	tranDelta : function(v, de) {
		de = parseInt(de, 10);
		if (de == 0) {
			return v;
		}
		var cls = "", str = "";
		if (de < 0) {
			cls = "mark1";
			str = Math.abs(de) + "-";
		} else if (de > 0) {
			cls = "mark2";
			str = de + "+";
		}
		return v + '<span class="' + cls + '" title="'+ str +'">' + str + '</span>';
	},
	checkPort : function(value) {
		if (!$.isNumeric(parseInt(value, 10)))
			return false;
		if (parseInt(value) > 65535 || parseInt(value) < 0)
			return false;
		return true;
	},
	collapse: false,
	layoutLeftCollapsed: function() {
		var bd = $(document.body);
		if(!bd.hasClass("layout-left-collapsed")) {
			bd.addClass("layout-left-collapsed");
		} else {
			bd.removeClass("layout-left-collapsed");
		}
		base.collapse = bd.hasClass("layout-left-collapsed");
	},
	initMenu : function(ds, F, L) {
		var left = $("#id-layout-left");
		left.append(
		'<div class="layout-left-ctrl"><a class="layout-left-ctrlIco"></a></div>'
		);
		left.find(".layout-left-ctrlIco").bind("click", function() {
			base.switchCtrl();
		});
		base.switchCtrl(true);
		base.appendLeftMenu(ds, left.get(0), F);
		if (F == undefined) {
			window.location.href = base.firstLink;
		}
		/*for(var i = 0; i < ds.length; i++) {
			if (setting.menu[ds[i].name]) {
				var url = "";
				if (setting.menu[ds[i].name].link) {
					url = setting.menu[ds[i].name].link;
				} else if (ds[i].menuList && ds[i].menuList.length > 0) {
					var firstMenu = base.findFirstMenu(ds[i], "menuList");
					if (firstMenu && firstMenu.name) {
						url = setting.menu[firstMenu.name].link ? setting.menu[firstMenu.name].link : "javascript:void(0);";
					} else {
						url = "javascript:void(0);";
					}
					if (!base.firstLink) {
						base.firstLink = url;
					}
				}
			}
		}*/
		/*if (L) {
			// L = DBapp.urlEncode(L);
		}
		for (var i = 0; i < ds.length; i++) {
			if (setting.menu[ds[i].name]) {
				var type = 0, url = "";
				if (setting.menu[ds[i].name].link) {
					path = setting.menu[ds[i].name].link;
					url = path;
					H = ds[i];
				} else if (ds[i].menuList && ds[i].menuList.length > 0) {
					var firstMenu = base.findFirstMenu(ds[i], "menuList");
					if (firstMenu && firstMenu.name) {
						url = setting.menu[firstMenu.name].link ? setting.menu[firstMenu.name].link : "javascript:void(0);";
					} else {
						url = "javascript:void(0);";
					}
					if (!base.firstLink) {
						base.firstLink = url;
					}
				} else {
					url = "javascript:void(0);";
				}
				hm.append('<li><a id="'
				+ setting.menu[ds[i].name].name
				+ '" class="cls-mainmenu" href="'
				+ url
				+ '" type="'
				+ (setting.menu[ds[i].name].type ? setting.menu[ds[i].name].type
						: 0)
				+ '" title="'
				+ (ds[i].desc ? ds[i].desc
						: setting.menu[ds[i].name].text)
				+ '" rel="' + url + '">'
				+ (ds[i].desc ? ds[i].desc
						: setting.menu[ds[i].name].text)
				+ '</a></li>');
				if (F == undefined) {
					window.location.href = url;
				}
				if (ds[i].name == F[0]) {
					if (ds[i].menuList && ds[i].menuList.length > 0) {
						base.initLeftMenu(ds[i], F);
					}
				}
			}
		}
		var text = [], dom, $o;
		if (F.length) {
			for (var j = 0; j < F.length; j++) {
				//$o = $(document.getElementById(F[j]) || document.getElementById("id-leftmenu-" + F[j]));
				//$o = $("#" + F[j]);
				dom = $(document.getElementById(F[j]));
				if(!dom) {
					dom = document.getElementById("id-leftmenu-" + F[j]);
					$o = $(dom);
				} else {
					$o = $(dom);
					$o.addClass("menuover");
				}
				if(j == 0) {
					$o = $("#" + F[j]).addClass("menuover");
				} else {
					$o = $("#id-leftmenu-" + F[j]);
				}
				text.push('<a href="' + ($o.attr("rel") || "javascript:;") + '">' + $o.attr("title") + '</a>');
			}
		}
		return text.join(" > ");*/
	},
	switchCtrl: function(isFirst) {
		var bd = $(document.body);
		if(isFirst) {
			if(setting["isCtrl"]) {
				bd.addClass("cls-layout-ctrl");
			} else {
				bd.removeClass("cls-layout-ctrl");
			}
		} else {
			bd.toggleClass("cls-layout-ctrl");
			setting["isCtrl"] = bd.hasClass("cls-layout-ctrl");
		}
	},
	findFirstMenu : function(menu, mark) {
		if (menu[mark] &&　menu[mark].length) {
			return base.findFirstMenu(menu[mark][0], mark);
		} else {
			return menu;
		}
	},
	expandLeftMenu : function(titleIco, menu, isOpen) {
		if (isOpen) {
			menu.slideDown();
			titleIco.html("-");
		} else {
			menu.slideUp();
			titleIco.html("+");
		}
	},
	appendLeftMenu : function(nodes, dom, F) {
		if (!nodes)
			return "";
		var li, ul = document.createElement("ul");
		ul.className = "submenu";
		dom.appendChild(ul);
		for (var i = 0, len = nodes.length; i < len; i++) {
			var isOpen = false, node = nodes[i], title = node.desc ? node.desc : setting.menu[node.name].text;
			li = document.createElement("li");
			li.id = "id-leftmenu-" + node.name;
			if (F && F.length) {
				for (var j = 0; j < F.length; j++) {
					if (node.name == F[j]) {
						li.className = "active";
						isOpen = true;
					}
				}
			}
			li.title = title;
			li.innerHTML = '<a href="javascript:;"><i class="fa fa-glass ' + node.name + '-ico"></i>' + title + '<span class="submenu-indicator"></span></a>';
			ul.appendChild(li);
			var A = $(li.firstChild);
			if (node.menuList && node.menuList.length) {
				var titleIco = $(li).find(".submenu-indicator");
				var menu = $(base.appendLeftMenu(node.menuList, li, F));
				A.bind("click", {
					menu : menu,
					titleIco : titleIco
				}, function(event) {
					var m = event.data.menu, ico = event.data.titleIco;
					base.expandLeftMenu(ico, m, m.css("display") == "none");
				});
				base.expandLeftMenu(titleIco, menu, isOpen);
				$(li).attr("rel", setting.menu[node.menuList[0].name] && setting.menu[node.menuList[0].name]["link"] ? setting.menu[node.menuList[0].name]["link"] : "");
			} else {
				if (setting.menu[node.name] && setting.menu[node.name].link) {
					A.attr("href", setting.menu[node.name].link);
					if(!base.firstLink) {
						base.firstLink = setting.menu[node.name].link;
					}
				}
			}
		}
		return ul;
	},
	initLeftMenu : function(ds, F) {
		base.appendLeftMenu(ds.menuList, $(".cls-accordion-menu").get(0), F);
	},
	req_getMenu : function(menu, isIndex) {
		$.ajax({
			type : "get",
 			dataType : "json",
 			contentType : "application/json",
 			url : base.getAction("user_menus.do"),
 			cache : false,
 			async : false,
			success : function(data) {
				//base.showUserInfo(base.getCurrentUser());
				if(!data || !data.user) {
					base.req_loginOut();
					return;
				}
				base.showUserInfo(data.user);
				$(".cls-current-text").html(base.initMenu(data.menus, menu));
				if (isIndex && base.firstLink) {
					parent.location.href = base.firstLink;
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				var data = DATA;
				//base.showUserInfo(base.getCurrentUser());
				if(!data || !data.user) {
					base.req_loginOut();
					return;
				}
				base.showUserInfo(data.user);
				$(".cls-current-text").html(base.initMenu(data.menus, menu));
				if (isIndex && base.firstLink) {
					parent.location.href = base.firstLink;
				}
				
			}
		});
	},
	showUserInfo : function(user) {
		if (!user) {
			var msg = document.getElementById("id-loginname-msg");
			msg.style.display = "none";
			msg = document.getElementById("id-loginname-text");
			msg.title = msg.innerHTML = "";
			document.getElementById("id-ext-msg").style.display = "block";
			return;
		}
		base.user = user;
		var msg = document.getElementById("id-loginname-msg");
		var $msg = $(msg);
		msg.style.display = "block";
		msg = document.getElementById("id-loginname-text");
		msg.title = msg.innerHTML = user.name ? "欢迎：" + user.name : "";
		if (user.lastlogin_time) {
			msg = document.getElementById("id-lastLogin-wrap");
			msg.style.display = "block";
			msg = document.getElementById("id-lastLogin-text");
			msg.title = msg.innerHTML = "上次登录时间：" + user.lastlogin_time;
		} else {
			msg = document.getElementById("id-lastLogin-wrap");
			msg.style.display = "none";
			msg = document.getElementById("id-lastLogin-text");
			msg.title = msg.innerHTML = "";
		}
		document.getElementById("id-ext-msg").style.display = "block";
		// var wrap =
		// document.getElementById("id-menu-ul").parentNode.parentNode;
		if ($msg) {
			$msg.bind("click", function() {
				base.showUser(user);
			});
		}
	},
	showUser : function(user) {
		if (!base.showUserDlg) {
			base.showUserDlg = new DBapp.ui.Dialog(
			null,
			{
				title : "用户信息",
				msg : '<div class="cls-tabs-content userDesc">'
						  + '<div class="cls-form">'
  				      + '<div class="bg-color">'
  			          + '<label class="cls-form-label label-ex lable-cm-two">用户名</label>'
    			        + '<div class="cls-form-input">'
    			          + '<div class="cls-form-text">'
    			            + '<select></select>'
    			          + '</div>'
    			        + '</div>'
    			      + '</div>'
    			    + '</div>'
    			    + '<div class="cls-form">'
    		      + '<div class="bg-color">'
    		        + '<label class="cls-form-label label-ex lable-cm-two">登录帐号</label>'
    		        + '<div class="cls-form-input">'
    		          + '<div class="cls-form-text">'
    		            + (user.userName || "")
    		          + '</div>'
    		        + '</div>'
    		      + '</div>'
    		    + '</div>'
    		    + '<div class="cls-form">'
    	        + '<div class="bg-color">'
    	          + '<label class="cls-form-label label-ex lable-cm-two">审核权限</label>'
    	          + '<div class="cls-form-input">'
    	            + '<div class="cls-form-text' + (user.verifier ? " auditIco" : " unauditIco") + '"></div>'
    	          + '</div>'
    	        + '</div>'
    	      + '</div>' 
					+ '</div>'
			});
			base.showUserDlg.setSize(500);
			base.showUserDlg.addButton([{
				text : "保存",
				cls : "blue",
				handle : function() {
					if(base.userCombo.getValue() == undefined) {
						DBapp.ui.error(base.userCombo.el, Lang.isNotnull);
						return;
					}
					var loading = DBapp.showMask(Lang.loading);
					$.ajax({
						type: 'post',
						dataType: 'json',
						url: base.getAction('login/switch_user') + "&bdId=" + base.userCombo.getValue(),
						contentType: "application/json",
						//data: {},
						success: function(data) {
							loading.hide();
							if(data.ret) {
								DBapp.ui.Msg.Alert(Lang.ts, data.message || Lang.operateIsOk);
								base.showUserDlg.hide();
							} else {
								DBapp.ui.Msg.Alert(Lang.ts, data.message || Lang.operateIsError);
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							loading.hide();
						}
					});
				}
			}, {
				text : "取消",
				cls : "del",
				handle : function() {
					base.showUserDlg.hide();
				}
			}]);
			if(!base.userCombo) {
				base.userCombo = new DBapp.ui.Combo(base.showUserDlg.$el.find("select"), {
					width: 120,
					listWidth : 560,
					//emptyText c: "性别...",
					//readOnly : false,
	        //data : json,
					valueField : "ubId",
			  	displayField : "userName",
					afterInitList : function() {
						if(!base.comGrid) {
							//this.list.innerHTML = '<div id="id-grid"></div><div id="id-grid-page"></div>';
							this.list.innerHTML = 
							'<div class="cls-combo-gridWrap">' +
								'<div class="ico-search-wrap">' +
								  '<input id="id-topUser-grid-searchText" class="cls-form-field text" type="text" placeholder="用户名"/>' +
								  '<a id="id-topUser-grid-add" class="btn searchBtn append" href="javascript:;" style="display: inline-block;">新增</a>' +
								'</div>' +
								'<div id="id-topUser-grid"></div><div id="id-topUser-grid-pageView"></div>' +
								'<div id="id-dlg" class="modal-box" style="visibility: hidden;">'+
									'<div class="inner">'+
										'<span class="title"></span>'+
										'<button class="close"></button>'+
										'<div class="content">'+
											'<div class="pretty">'+
												'<div style="margin-bottom: 10px;"><span style="float: left;width: 100px;">用户名</span><input id="id-name" class="cls-form-field" type="text"/></div>'+
												'<div class="button-wrap"></div>'+
												'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
							base.comGrid = new DBapp.ui.Grid({
								renderTo: "id-topUser-grid",
								isNumber: true,
								//isCheckbox: true,
								//exchange: true,
								onRowClick : function(e, target, opt) {
						  		var ds = this.getData(opt.row);
						  		base.userCombo.setValue(ds["ubId"], ds["userName"]);
						  		base.userCombo.collapse();
						    },
								pageView : {
							  	renderTo : "id-topUser-grid-pageView",
							  	/*onRowClick : function(e, target, opt) {
							  		//alert(111);
							  		//var ds = this.getData(opt.row);
							  		//console.log(ds);
							  	},*/
							  	param : {
								  	offset : 0,
									  limit : 10,
									  username : ""
								  },
							  	callback : function() {
							  		base.req_user_list(base.comGrid.viewPage.param, function(data) {
							  			var ds = data["dataList"] || [];
							  			base.comGrid.load(ds, parseInt(data["total"] || 0, 10));
							  			base.userCombo.data = ds;
							  			//base.userCombo.initFirstValue();
		  				 				base.comboRelGrid(base.userCombo, base.comGrid);
							  		});
							  	}
							  },
								cm: [{
									dataStore: "userName"
								}]
							});
							var searchText = $("#id-topUser-grid-searchText");
		  				searchText.bind("keyup", function(e) {
		  					if(e.keyCode == 13) {
			  					base.comGrid.viewPage.param.username = searchText.val();
			  					base.req_user_list(base.comGrid.viewPage.param, function(data) {
						  			var ds = data["dataList"] || [];
						 				base.comGrid.load(ds, parseInt(data["total"] || 0, 10));
						 				base.userCombo.data = ds;
						 				base.comboRelGrid(base.userCombo, base.comGrid);
						  		});
			  				}
		  				});
		  				$("#id-topUser-grid-add").bind("click", function() {
		  					
		  					if(!base.adduser_dlg) {	//假如这个窗口不存在
		  			  		base.adduser_dlg = new DBapp.ui.Dialog("id-dlg");	//则取new 这个新窗口
		  			  		base.adduser_dlg.setTitle("新增用户");	//setTitle，设置窗口标题
		  			  		base.adduser_dlg.addButton([{	//addButton,新增按钮（提交按钮）
		  			  			text : "保存",	//按钮名称
		  			  			cls : "save",	//按钮class
		  			  			emptyText: '',
		  			  			handle : function() { //方法
		  			  				var param = {
		  			  						userName: $.trim($("#id-name").val())
		  			  				};
		  			  				if(param.userName) {
		  			  					base.add_user(param);
		  			  					base.req_user_list(base.comGrid.viewPage.param, function(data) {
		  						  			var ds = data["dataList"] || [];
		  						 				base.comGrid.load(ds, parseInt(data["total"] || 0, 10));
		  						 				base.userCombo.data = ds;
		  						 				base.comboRelGrid(base.userCombo, base.comGrid);
		  						 				$("#id-name").val("");
		  						  		});
		  			  				}else {
		  			  					return false;
		  			  				}
		  			  			}
		  			  		}, {
		  			  			text : "取消",
		  			  			cls : "del",
		  			  			handle : function() {
		  			  				base.adduser_dlg.hide();	//取消隐藏改按钮
		  			  			}
		  			  		}]);
		  			  	}
		  					base.adduser_dlg.setSize(500);
		  					base.adduser_dlg.show();
		  					
		  					/*base.req_user_list(base.comGrid.viewPage.param, function(data) {
					  			var ds = data["dataList"] || [];
					 				base.comGrid.load(ds, parseInt(data["total"] || 0, 10));
					 				base.userCombo.data = ds;
					 				base.comboRelGrid(base.userCombo, base.comGrid);
					  		});*/
		  				});
						}
						base.req_user_list(base.comGrid.viewPage.param, function(data) {
			  			var ds = data["dataList"] || [], defult = data["entity"] || "";
			  			base.comGrid.load(ds, parseInt(data["total"] || 0, 10));
			  			base.userCombo.data = ds;
			  			//base.userCombo.setValue(defult['ubId'], defult['userName']);
			 				base.comboRelGrid(base.userCombo, base.comGrid);
			  		});
					}
				});
			}
			//base.userCombo.setValue(user["ubId"], user["userName"]);
			//base.req_user_list();
			/*base.comGrid.onRowClick = function(e, target, opt) {
	  		var ds = this.getData(opt.row);
	  		base.userCombo.setValue(ds["ubId"]);
	  		base.userCombo.collapse();
	    }*/
      //base.comGrid.load(json);
		}
		base.req_user_list(base.comGrid.viewPage.param, function(data) {
			var ds = data["dataList"] || [], defult = data["entity"] || "";
			base.comGrid.load(ds, parseInt(data["total"] || 0, 10));
			base.userCombo.data = ds;
			base.userCombo.setValue(defult['ubId'], defult['userName']);
			base.comboRelGrid(base.userCombo, base.comGrid);
		});
		base.showUserDlg.show();
	},
	req_user_list: function(param, fn) {
		$.ajax({
			type: 'get',
			dataType: 'json',
			contentType: 'application/json',
			url: base.getAction('login/search_user'),
			data: param,
			success: function(data) {
				fn && fn(data);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});
	},
	add_user: function(param) {
		$.ajax({
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			url: base.getAction('login/add_user'),
			data: DBapp.encode(param),
			success: function(data) {
				if(data && data.ret == true) {
					DBapp.ui.success("新增成功");
					base.adduser_dlg.hide();
				}else {
					DBapp.ui.fail(data.message);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});
	},
	validMark : function(value) {// 用户名仅含字母和数字且以字母开头
		var reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
		if (!reg.test(value)) {
			return false;
		}
		return true;
	},
	checkEmail : function (value){
		var regm = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if (value.match(regm)){
			return true;
		} 
		return false;
	},
	LoadMaskShow : function(msg, dom) {
		if (!base.loadmask) {
			/*
			 * base.loadmask = new DBapp.ui.Loading(document.body, { mode :
			 * "frame", msg : msg || Lang.loading });
			 */
		}
		if (dom) {
			DBapp.getDom(dom).appned(base.loadmask);
		}
		if (msg) {
			base.loadmask.setMsg(msg);
		}
		// base.loadmask.show();
	},
	LoadMaskHide : function() {
		if (base.loadmask) {
			base.loadmask.hide();
		}
	},
	loginOut : function() {
		DBapp.ui.Msg.Confirm(Lang.ts, "是否安全退出？", function(btn) {
			if (btn == "yes") {
				base.req_loginOut();
			}
		});
	},
	req_loginOut : function() {
		$.ajax({
			type : "get",
			url : base.getAction("exit.do"),
			dataType : "json",
			contentType : "application/json",
			data : {},
			success : function(data) {
				// if(data && data.action &&
				// base.error.IS_OK(data.action.result)) {
				base.end();
				window.location.href = "/login.html";
				// } else {
				// DBapp.ui.error(self.form.username, data.action.message ||
				// Lang.operateIsError);
				// }
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// window.location.href = "login.html";
				// top.DBapp.ui.Msg.Alert(Lang.ts, Lang.operateTimeout);
			}
		});
	},
  showProduceInfo: function() {
		var text1 = "";
		if (OEM.VERSION_STRING) {
			text1 += OEM.VERSION_STRING;
		} else {
			if (OEM.VERSION_MAJOR && !DBapp.isBlank(OEM.VERSION_MAJOR)) {
				text1 += OEM.VERSION_MAJOR;
			}
			if (OEM.VERSION_MIN1 && !DBapp.isBlank(OEM.VERSION_MIN1)) {
				text1 += "." + OEM.VERSION_MIN1;
			}
			if (OEM.VERSION_MIN2 && !DBapp.isBlank(OEM.VERSION_MIN2)) {
				text1 += "." + OEM.VERSION_MIN2;
			}
			if (OEM.VERSION_REV && !DBapp.isBlank(OEM.VERSION_REV)) {
				text1 += "." + OEM.VERSION_REV;
			}
			if (OEM.VERSION_BUILD && !DBapp.isBlank(OEM.VERSION_BUILD)) {
				text1 += "." + OEM.VERSION_BUILD;
			}
		}
		var producename = (OEM.PRODUCT_CN || "") + (OEM.TYPE || "");
		document.title = producename + text1;
		var produce = document.getElementById("id-produce-info");
		if(produce) {
			var text2 = "";
			if(OEM.COMPANY_NAME && !DBapp.isBlank(OEM.COMPANY_NAME)) {
				text2 += OEM.COMPANY_NAME;
			}
			if(OEM.COPY_RIGHT && !DBapp.isBlank(OEM.COPY_RIGHT)) {
				text2 += "<font>" + OEM.COPY_RIGHT + "</font>";
			}
			if(OEM.COMPANY_PHONE && !DBapp.isBlank(OEM.COMPANY_PHONE)) {
				text2 += "<font>" + OEM.COMPANY_PHONE + "</font>";
			}
			if(OEM.COMPANY_EMAIL && !DBapp.isBlank(OEM.COMPANY_EMAIL)) {
				text2 += "<font>Email：" + OEM.COMPANY_EMAIL + "</font>";
			}
			if(OEM.COMPANY_URL && !DBapp.isBlank(OEM.COMPANY_URL)) {
				text2 += "<a href=\"" + OEM.COMPANY_URL + "\" target=\"_blank\">" + OEM.COMPANY_URL + "</a>";
			}
			var header = document.getElementById("id-producename");
			if(header) {
				header.innerHTML = (OEM.PRODUCT_CN || "") + (OEM.TYPE || "");
			}
			produce.innerHTML = text2;
		}
		return {
			producename: producename,
			version: text1
		};
	},
	init : function(menu, isIndex) {
		// document.body.scroll="no";
		var obj = this.showProduceInfo();
		var producename = obj["producename"];
		var version = obj["version"];
		var top = document.getElementById("id-layout-top");
		if (top) {
			top.innerHTML = '<div class="layout-top-bg">'
			+ '<div class="system-title-wrap">'
			+ '<div class="system-title">'
			+ '<span class="system-title-inner">'
			+ '<font id="id-producename" class="cls-btext producename" title="' + (producename + version) + '">' + producename
			+ '</font>'
			+ '<font id="id-version" class="des-text cls-btext version" title="' + (producename + version) + '">' + version
			+ '</font>'
			+ '</span>'
			+ '</div>'
			+ '</div>'
			+ '<div class="user-info-wrap">'
			+ '<ul class="layout-top-ul">'
			+ '<li id="id-loginname-msg" class="user-wrap">'
			+ '<a class="user" href="javascript:void(0);">'
			+ '<span id="id-loginname-text" class="cls-btext user-text"></span>'
			+ '</a>'
			+ '</li>'
			+ '<li id="id-ext-msg" class="exit-wrap" title="' + Lang.exit + '" style="display: none;">'
			+ '<a class="exit" href="javascript:void(0);">'
			+ '<span id="id-login-out" class="cls-btext login-text"></span>'
			+ '</a>'
			+ '</li>'
			+ '</ul>'
			+ '</div>'
			+ '<div id="id-lastLogin-wrap" class="lastLogin-text">'
			+ '<ul class="lastLogin-content">'
			+ '<li id="id-lastLogin-text" class="cls-btext lastLogin-inner"></li>'
			+ '</ul>'
			+ '</div>'
			+ '<div class="menu-wrap">'
			+ '<ul id="id-menu-ul" class="layout-top-ul menu"></ul>'
			+ '</div>'
			+ '</div>'
			+ '<div class="cls-shadow-hwrap"></div>';
		}
		var exit = document.getElementById("id-ext-msg");
		if (exit) {
			$(exit).bind("click", base.loginOut);
		}
		base.req_getMenu(menu, isIndex);
	},
	accordion : function(o) {
		var p = o.parentNode.parentNode;
		var toggle = o.firstChild;
		p = $(p);
		toggle = $(toggle);
		var lit = p.find(".layout-accordion");
		if (lit.css("display") == "none") {
			// lit.css("display", "block");
			toggle.addClass("rotate");
			toggle.removeClass("notrotate");
			lit.slideDown(); // 展开
		} else {
			// lit.css("display", "none");
			toggle.removeClass("rotate");
			toggle.addClass("notrotate");
			lit.slideUp(); // 收起
		}
	},
	tab : function(n, tab, fn) {
		var tabs = $("#" + tab).find("li"), t;
		for (var i = 0; i < tabs.length; i++) {
			t = $(tabs[i]);
			if (i == n) {
				t.addClass("active");
				// document.getElementById(t.attr("rel")).style.visibility =
				// "visible";
				document.getElementById(t.attr("rel")).style.display = "block";
			} else {
				t.removeClass("active");
				// document.getElementById(t.attr("rel")).style.visibility =
				// "hidden";
				document.getElementById(t.attr("rel")).style.display = "none";
			}
		}
		fn && fn(n, tab);
	},
	getDate : function(shortcut) {
		var end = new Date(), start = false;
		if (shortcut == 'curWeek') {
			var nowDay = end.getDay();
			start = new Date(end.getFullYear(), end.getMonth(), end.getDate()
					- nowDay, 0, 0, 0);
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
					23, 59, 59);
		} else if (shortcut == 'curMonth') {
			start = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0);
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
					23, 59, 59);
		} else if (shortcut == 'curSeason') {
			var nowMon = end.getMonth() + 1, nowQuarter = 0;
			if (nowMon < 4) {
				nowQuarter = 1;
			} else if (nowMon > 3 && nowMon < 7) {
				nowQuarter = 4;
			} else if (nowMon > 6 && nowMon < 10) {
				nowQuarter = 7;
			} else if (nowMon > 9 && nowMon <= 12) {
				nowQuarter = 10;
			}
			start = new Date(end.getFullYear(), nowQuarter - 1, 1, 0, 0, 0);
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
					23, 59, 59);
		} else if (shortcut == 'nearMonth') {
			start = new Date(end.getTime() - 3600 * 1000 * 24 * 30);
			start = new Date(start.getFullYear(), start.getMonth(), start
					.getDate(), 0, 0, 0);
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
					23, 59, 59);
		} else if (shortcut == 'nearYear') {
			start = new Date(end.getTime() - 3600 * 1000 * 24 * 365);
			start = new Date(start.getFullYear(), start.getMonth(), start
					.getDate(), 0, 0, 0);
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
					23, 59, 59);
		} else if (shortcut == 'curYear') {
			start = new Date(end.getFullYear(), 0, 1, 0, 0, 0);
			end = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
					23, 59, 59);
		} else if (shortcut == 'lastYear') {
			start = new Date(end.getFullYear() - 1, 0, 1, 0, 0, 0);
			end = new Date(end.getFullYear() - 1, 11, 31, 23, 59, 59);
		}
		return [ start, end ];
	},
	switchTS : function(ico, ts, rel) {
		var T = document.getElementById(ts);
		if (rel) {
			rel = document.getElementById(rel);
		}
		// $("#id-tab0-more").bind("click", function() {
		if (T.style.display != "none") {
			T.style.display = "none";
			if (rel) {
				rel.style.display = "none";
			}
		} else {
			T.style.display = "block";
			if (rel) {
				rel.style.display = "block";
			}
		}
	},
	checkedTreeByUserdata : function(arr, treeData, tree, fn) {
		if (!arr || !arr.length) {
			return;
		}
		if (treeData && treeData.length) {
			for (var i = 0; i < treeData.length; i++) {
				var node = treeData[i];
				for (var j = 0; j < arr.length; j++) {
					if ((arr[j].entityType == 1 || arr[j].entityType == 2)
							&& arr[j].entityId == node["userdata"][0]["content"]) {
						tree.checkNode(node, true, true);
						continue;
					} else if (arr[j].entityType == 3) {
						fn && fn(arr[j]);
					}
				}
				if (node.isParent) {
					base.checkedTreeByUserdata(arr, node["children"], tree);
				}
			}
		}
	},
	getCheckedNoParentTreeId : function(r, treeData, config) {
		if(treeData && treeData.length) {
			for(var i = 0; i < treeData.length; i++) {
				if(treeData[i].checked) {
					if(treeData[i].isParent) {
						base.getCheckedNoParentTreeId(r, treeData[i][config && config["children"] ? config["children"] : "children"]);
					} else {
						//r["aIds"].push(treeData[i][config && config["id"] ? config["id"] : "id"]);
						r["ids"].push(treeData[i]["userdata"][0]["content"]);
						r["names"].push(treeData[i][config && config["name"] ? config["name"] : "name"]);
					}
				}
			}
		}
		return r;
	},
	_getCheckedNoParentTreeId : function(r, treeData, config) {
		if (treeData && treeData.length) {
			for (var i = 0; i < treeData.length; i++) {
				if (treeData[i].checked) {
					if (treeData[i].isParent) {
						base._getCheckedNoParentTreeId(r, treeData[i][config && config["children"] ? config["children"] : "children"]);
					} else {
						// r["aIds"].push(treeData[i][config && config["id"] ?
						// config["id"] : "id"]);
						for (var j = 0; j < treeData[i]["userdata"].length; j++) {
							r["ids"].push(treeData[i]["userdata"][j]["content"]);
						}
						r["names"].push(treeData[i][config && config["name"] ? config["name"] : "name"]);
					}
				}
			}
		}
		return r;
	},
	getOrganizeTreeData : function(r, treeData, config) {
		if (treeData && treeData.length) {
			for (var i = 0; i < treeData.length; i++) {
				if (treeData[i].check_Child_State == 1) {
					base.getOrganizeTreeData(r,
							treeData[i][config["children"]], config);
				} else if (treeData[i].check_Child_State == 2
						|| (treeData[i].check_Child_State == -1 && treeData[i].checked)) {
					var G = {};
					G[config["entityType"]] = treeData[i].isParent ? 2 : 1;
					// G[config["entityId"]] = treeData[i][config["id"]];
					G[config["entityId"]] = treeData[i]["userdata"][0]["content"];
					r.push(G);
					continue;
				}
			}
		}
		return r;
	},
	_getOrganizeTreeData : function(r, treeData, config) {
		if (treeData && treeData.length) {
			for (var i = 0; i < treeData.length; i++) {
				if (treeData[i].check_Child_State == 1) {
					base._getOrganizeTreeData(r,
							treeData[i][config["children"]], config);
				} else if (treeData[i].check_Child_State == 2
						|| (treeData[i].check_Child_State == -1 && treeData[i].checked)) {
					// var G = {};
					r["ids"].push(treeData[i]["userdata"][0]["content"]);
					r["names"].push(treeData[i]["name"]);
					// G[config["entityType"]] = treeData[i].isParent ? 2 : 1;
					// G[config["entityId"]] =
					// treeData[i]["userdata"][0]["content"];
					// r.push(G);
					continue;
				}
			}
		}
		return r;
	},
	more : function(o) {
		var L = $(o.parentNode.parentNode.parentNode).find(".moreList");
		if (L.css("display") != "none") {
			L.css("display", "none");
			o.innerHTML = "更多";
		} else {
			L.css("display", "block");
			o.innerHTML = "收起";
		}
	},
	afterClose : function(g, elem, v) {
		var s_v = elem.value;
		if ($.trim(s_v) != "") {
			document.getElementById(g).innerHTML = base.transDate(new Date(s_v
					.replace(/\-/g, "/")).getTime() + 3600 * 7000);
		}
	},
	changeTreeData : function(tree, section) {
		// home_task.audit_organizeId_tree
		// $("#id-tab1-organizeId-section_audit")
		var organizeId = {
			ids : [],
			names : []
		}, sd = tree.getNodes();
		if (sd && sd.length) {
			base._getOrganizeTreeData(organizeId, sd, {
				ids : "id",
				names : "name",
				children : "children"
			});
		}
		var section_audit_value = section.val();
		if (!DBapp.isBlank(section_audit_value)) {
			organizeId.names.push(section_audit_value);
		}
		home_task.audit_organizeId_combo.el.value = organizeId.names.join(",");
		return organizeId.names.join(",");
	},
	vaIP : function(value) {
		var regIp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
		if (!regIp.test(value))
			return false;
		return true;
	},
	checkScanOrganize : function(v, type, scannerType) {
		// ip验证
		// /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}(,(((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}))*$/
		// 域名验证
		// /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(,(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}))*$/
		// 验证逗号分号空格回车
		// /^(([a-zA-Z0-9]{1,})((\.|\/)[a-zA-Z0-9]{1,}){2,})(((,)|(;)|(\n)|(\s))(([a-zA-Z0-9]{1,})((\.|\/)[a-zA-Z0-9]{1,}){2,})){0,}$/
		var reg;
		if (type == "ip") {
			if (scannerType == 1) {// nessus
				reg = /^((((!)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)(\.((((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)|(\*)?)))|(([0-9]|[a-zA-Z]){0,4}(:(([0-9]|[a-zA-Z]){0,4})){4,6}))*)(((,)|(;)|(\n)|(\s))(((!)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)(\.((((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)|(\*)?)))|(([0-9]|[a-zA-Z]){0,4}(:(([0-9]|[a-zA-Z]){0,4})){4,6}))){0,}$/;
			} else if (scannerType == 2) {// webscan
				reg = /^((((!)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)(\.((((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)|(\*)?)))|(([0-9]|[a-zA-Z]){0,4}(:(([0-9]|[a-zA-Z]){0,4})){4,6}))*)(((,)|(;)|(\n)|(\s))(((!)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)(\.((((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)|(\*)?)))|(([0-9]|[a-zA-Z]){0,4}(:(([0-9]|[a-zA-Z]){0,4})){4,6}))){0,}$/;
			} else if (scannerType == 3) {// green
				reg = /^((((!)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)(\.((((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)|(\*)?)))|(([0-9]|[a-zA-Z]){0,4}(:(([0-9]|[a-zA-Z]){0,4})){4,6}))*)(((,)|(;)|(\n)|(\s))(((!)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)(\.((((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(((-)+|(\/)+)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))?)|(\*)?)))|(([0-9]|[a-zA-Z]){0,4}(:(([0-9]|[a-zA-Z]){0,4})){4,6}))){0,}$/;
			}
		} else if (type == "domain") {
			if (scannerType == 1) {// nessus
				reg = /^(([^\,]){2,})(((,)|(;)|(\n)|(\s))([^\,]{1,})){0,}$/;
			} else if (scannerType == 2) {// webscan
				reg = /^(([^\,]){2,})(((,)|(;)|(\n)|(\s))([^\,]{1,})){0,}$/;
			} else if (scannerType == 3) {// green
				reg = /^(([^\,]){2,})(((,)|(;)|(\n)|(\s))([^\,]{1,})){0,}$/;
			}
		}
		return reg.test(v);
	},
	gotoPage : function(path) {
		window.location.href = path;
	},
	saveLinkURL : function() {

	},
	getFileText : function(input, fn) {
		var rs = "";
		if (window.FileReader) {
			var file = input.files[0];
			filename = file.name.split(".")[0];
			var reader = new FileReader();
			reader.onload = function() {
				fn && fn(this.result);
			}
			reader.readAsText(file);
		} else if (typeof window.ActiveXObject != 'undefined') {
			var xmlDoc;
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.load(input.value);
			fn && fn(xmlDoc.xml);
		} else if (document.implementation
				&& document.implementation.createDocument) {
			var xmlDoc;
			xmlDoc = document.implementation.createDocument("", "", null);
			xmlDoc.async = false;
			xmlDoc.load(input.value);
			fn && fn(xmlDoc.xml);
		}
	},
	arrayObjectSort : function(d, F) {
    return function(a, b) {
      var n = 1;
      if(!F) {
        n = -n;
      }
      var e = a[d], f = b[d];
      return e > f ? n : (e < f ? -n : 0);
    }
  },
	comboRelGrid : function(combo, grid) {
		if (combo) {
			var rs = grid.getRows(), cv = combo.getValue();
			if (!$.isArray(cv)) {
				cv = [ cv ];
			}
			if (rs && rs.length) {
				for (var i = 0; i < rs.length; i++) {
					var v = false;
					for (var j = 0; j < cv.length; j++) {
						if (grid.getRowData(rs[i])[combo.valueField] == cv[j]) {
							v = true;
						}
					}
					grid.selectRows([ rs[i] ], v);
				}
			}
			grid.sethdCheckState(grid.getSelected().length == grid.data.length);
		}
	},
	setValueComboRelGrid : function(combo, grid) {
		var rs = grid.getRows();
		for (var i = 0; i < rs.length; i++) {
			if (grid.isSelected(rs[i])) {
				combo.addMult(grid.getData(rs[i]));
			} else {
				combo.removeMult(grid.getData(rs[i]));
			}
		}
	},
	reg_vali_name : function(reg, text) {
		var arr = text.split(",");
		for(var i = 0; i < arr.length; i++) {
			if(reg.test(arr[i])) {
				return true;
			}
		}
		return false;
	},
	filter : function(reg, items, tree) {
		if(items.length < 0) {
			return;
		}
		for(var i = 0; i < items.length; i++) {
			/*if(items[i].isParent && reg.test(items[i]["name"])) {
				//tree.getNodesByFilter(function() {return true;}, false, items[i])
				tree.showNodes(tree.getNodesByFilter(function() {return true;}, false, items[i]));
			} else */if(base.reg_vali_name(reg, items[i]["name"])) {
				tree.showNode(items[i]);
				tree.showNodes(tree.getNodesByFilter(function() {return true;}, false, items[i]));
				//tree.showNode(items[i]);
			} else {
				var arr = tree.getNodesByFilter(function(nd) {return base.reg_vali_name(reg, nd["name"]);}, false, items[i]);
				//console.log(arr);
				if(arr && arr.length) {
					tree.showNode(items[i]);
					if(items[i].isParent) {
						base.filter(reg, items[i]["children"], tree);
					}
				} else {
					tree.hideNode(items[i]);
				}
			}
		}
		/*if(items.length < 0) {
			return;
		}
		for(var i = 0; i < items.length; i++) {
			if(!items[i].isParent) {
			  if(reg.test(items[i]["name"])) {
			  	tree.showNode(items[i]);
			  	//items[i].isHidden = false;
			  } else {
			  	tree.hideNode(items[i]);
			  	//items[i].isHidden = true;
			  }
			} else {
				base.filter(reg, items[i]["children"], tree);
			}
		}
		var nds = tree.getNodes();
		console.log(nds);*/
	},
	initFilterTree: function(tree, text, all, unall) {
		text.bind("keyup", function(e) {
			if(e.keyCode != 13) {
				return false;
			}
			var re = new RegExp('^' + this.value.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1"), 'i');
			tree.expandAll(true);
			tree.checkAllNodes(false);
			//tree.hideNodes(nodes);
			base.filter(re, tree.getNodes(), tree);
			/*var ndList = tree.getNodesByFilter(function(nd) {
				return !nd.isHidden && nd["children"].length;
			});*/
			//console.log(ndList.length);
			return false;
		});
		all.bind("click", function() {
			tree.checkAllNodes(true);
		});
		unall.bind("click", function() {
			var nds = tree.getNodesByFilter(function(nd) {
				return !nd.isHidden && !nd.isParent && !nd.checked;
			});
			tree.checkAllNodes(false);
			for(var i = 0; i < nds.length; i++) {
				tree.checkNode(nds[i], true, true);
			}
			//tree.checkAllNodes(true);
		});
	},
	searchTree : function(filterValue, zTreeObj, tree) {
		// var filterValue = $("#id-search-text").val();
		// var tree = $("#id-left-tree");
		var _filter = function(nodes, attr, filterValue, tree,
				showFilterChildren, showFilterParent) {
			if (nodes && nodes.length > 0) {
				for (var i = 0; i < nodes.length; i++) {
					var _node = nodes[i];
					if (_node[attr]
//								&& _node[attr].toLowerCase().indexOf(filterValue) > -1) {
							&& _node[attr].toLowerCase().split("(")[0].trim().indexOf(filterValue) > -1) {
						var tempNode = _node, liNode = tree.find("#" + tempNode.tId);
						liNode.removeClass("tree-hide").addClass("tree-show");
						while (tempNode = tempNode.getParentNode()) {
							//tree.find("#" + tempNode.tId).show();
							tree.find("#" + tempNode.tId).removeClass("tree-hide").addClass("tree-show");
						}

						if (showFilterChildren !== false) {
							//liNode.find("ul").show().find("li").show();
							liNode.find("ul").show().find("li").removeClass("tree-hide").addClass("tree-show");
						}
						if (showFilterParent != false) {
							//liNode.parents("ul").show().parents("li").show();
							liNode.parents("ul").show().parents("li").removeClass("tree-hide").addClass("tree-show");
						}
						continue;
					}
					if (_node.children) {
						_filter(_node.children, attr, filterValue, tree,
								showFilterChildren, showFilterParent);
					}
				}
			}
		};
		// var filterValue = $("#id-search-text").val();
		filterValue = filterValue.toLowerCase();
		zTreeObj.expandAll(true);
		var tree = zTreeObj.setting.treeObj;
		//tree.find(".level0").show();
		//tree.find(".level1").show();
		//tree.find(".level2").show();
		//tree.find(".level3").show();
		tree.find("li").removeClass("tree-show").addClass("tree-hide");
		tree.find("ul").removeClass("tree-show").addClass("tree-hide");
		var allNodes = zTreeObj.getNodes();
		zTreeObj.checkAllNodes(false);
		_filter(allNodes, "name", filterValue, tree, true, true);
		
		
		
		
		//alert([tree.find(".tree-show").length, tree.find(".tree-hide").length]);
		tree.find(".tree-show").each(function() {
			var node = zTreeObj.getNodeByTId(this.id);
			if(node) {
				zTreeObj.setChkDisabled(node, false);
			}
		});
    tree.find(".tree-hide").each(function() {
    	var node = zTreeObj.getNodeByTId(this.id);
			if(node) {
				zTreeObj.setChkDisabled(node, true);
			}
		});
		
		//alert(1111);
//			zTreeObj.expandAll(true);
		// alert(JSON.encode(self.zTreeObj));
		// alert(value);
		// self.zTreeObj.hideNodes(self.zTreeObj.getNodes());
		// var nodes = self.zTreeObj.getNodesByParamFuzzy("name", "11", null);
		/*
		 * for (var i = 0, l = nodes.length; i < l; i++) { var reParent =
		 * function(tree, nd) { var p = nd.getParentNode(); //alert(p); if(p) {
		 * tree.showNode(p); tree.showNode(nd); } if(p.getParentNode()) {
		 * reParent(tree, p); } }; reParent(self.zTreeObj, nodes[i]);
		 * //self.zTreeObj.checkNode(nodes[i], true, true); }
		 */
		// self.zTreeObj.checkAllNodes(true);
		// self.zTreeObj.checkNode(node, true, true);
		// for (var i = 0, l = nodes.length; i < l; i++) {
		// self.zTreeObj.checkNode(nodes[i], true, true);
		// }
	}
};
// var CONTEXT_PATH = base.getRootPath();
// var CONTEXT_PATH = base.getRootPath();
// var SERVICE_PATH = "";//"/index.php"
// BLANK_HEAD_IMG = "images/s.gif";