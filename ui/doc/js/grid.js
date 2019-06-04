(function() {
	base.init(["grid"]);
	var grid;
	if(!grid) {
		grid = new DBapp.ui.Grid({
			renderTo: "id-grid",
			isNumber: true,
			isCheckbox: true,
			exchange: true,
			initRowCallback: function(row, ds) {
				/*var $row = $(row);
				$row.append('<div class="list" style="padding: 10px;border: 1px solid red;">' + new Date() + '</div>');
				var list = $row.find('.list');
				$row.click(function() {
					if(list.css('display') != 'none') {
						list.css('display', 'none');
					} else {
						list.css('display', 'block');
					}
				});*/
			},
			pageView: {
				renderTo: "id-grid-pageView",
				param: {
					offset: 0,
					limit: 10
				},
				callback: function() {
					getList();
				}
			},
			cm: [{
				header: "时间",
				width: 248,
				align: "left",
				dataStore: "time",
				hidden: true,
				renderFn: function(v, ds) {
					return '<span>' + new Date(parseInt(v, 10)).toLocaleString() + '</span>';//自定义列显示，因为配置了dataStore，所以进行了xss处理
				}
			}, {
				header: "日志等级",
				width: 90,
				align: "left",
				//dataStore: "level",
				renderFn: function(v, ds) {
					var cu = +new Date();
					if(cu - ds['time'] > 30 * 3600) {
						return '<span style="color: red;">' + ds['level'] + '</span>'
					} else {
						return '<span style="color: blue;">' + ds['level'] + '</span>'
					}
				}
			}, {
				header: "用户",
				width: 90,
				align: "left",
				editType: "text",
				dataStore: "user"
			}, {
				header: "来源类型",
				width: 90,
				align: "left",
				dataStore: "type"
			}, {
				header: "来源",
				width: 90,
				align: "left",
				dataStore: "source"
			}, {
				header: "地址",
				width: 118,
				align: "left",
				dataStore: "userIp"
			}, {
				header: "内容",
				//width: 118,
				align: "left",
				dataStore: "content"
			}, {
				header: "动作",
				width: 90,
				align: "left",
				dataStore: "result"
			}, {
				header: "操作",
				width: 90,
				align: "center",
				//dataStore: "result",
				renderFn: function() {
					return '<a class="button del" style="float: none;">删除</a>';//自定义列显示，因为没有配置了dataStore，所以不会进行了xss处理
				}
			}]
		});
	}
	var getList = function() {
		$.ajax({
			type : "get",
			url : "",
			dataType : "json",
			contentType : "application/json",
			/*data : {
				token : DBapp.Cookies.get("token")
			},*/
			success : function(data) {
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				var json = {
				  "total": 4,
				  "ret": true,
				  "log": [{
				  	"id": "89b78e9f-4625-4f2e-82ba-7d3430abee14",
				  	"time": "1485338655",
				  	"level": "2",
				  	"deleted": 0,
				  	"timeStr": "2017-01-25 18:04:15",
				  	"levelStr": "一般消息",
				  	"type": "0",
				  	"source": "system",
				  	"user": "admin",
				  	"userIp": "127.0.0.1",
				  	"content": "用户登录",
				  	"result": "0",
				  	"resultStr": "成功",
				  	"typeStr": "服务端",
				  	"cvsString": "2017-01-25 18:04:15, 一般消息, 服务端, system, admin, 127.0.0.1, 用户登录,成功"
				  },{
				  	"id": "a2cc8685-0db0-48ad-847e-ee09c2a022c8",
				  	"time": "1485337175",
				  	"level": "2",
				  	"deleted": 0,
				  	"timeStr": "2017-01-25 17:39:35",
				  	"levelStr": "一般消息",
				  	"type": "0",
				  	"source": "system",
				  	"user": "admin",
				  	"userIp": "127.0.0.1",
				  	"content": "用户登录",
				  	"result": "0",
				  	"resultStr": "成功",
				  	"typeStr": "服务端",
				  	"cvsString": "2017-01-25 17:39:35, 一般消息, 服务端, system, admin, 127.0.0.1, 用户登录,成功"
				  },{
				  	"id": "fc0b903d-7937-4d7e-b214-6befb7bced44",
				  	"time": "1485270840",
				  	"level": "2",
				  	"deleted": 0,
				  	"timeStr": "2017-01-24 23:14:00",
				  	"levelStr": "一般消息",
				  	"type": "0",
				  	"source": "system",
				  	"user": "admin",
				  	"userIp": "127.0.0.1",
				  	"content": "用户登录",
				  	"result": "0",
				  	"resultStr": "成功",
				  	"typeStr": "服务端",
				  	"cvsString": "2017-01-24 23:14:00, 一般消息, 服务端, system, admin, 127.0.0.1, 用户登录,成功"
				  },{
				  	"id": "e586df5a-8a98-4edf-909c-f8b2f7dd039e",
				  	"time": "1485248721",
				  	"level": "2",
				  	"deleted": 0,
				  	"timeStr": "2017-01-24 17:05:21",
				  	"levelStr": "一般消息",
				  	"type": "0",
				  	"source": "system",
				  	"user": "admin",
				  	"userIp": "127.0.0.1",
				  	"content": "用户登录",
				  	"result": "0",
				  	"resultStr": "成功",
				  	"typeStr": "服务端",
				  	"cvsString": "2017-01-24 17:05:21, 一般消息, 服务端, system, admin, 127.0.0.1, 用户登录,成功"
				  }]
				};
				grid.load(json['log'] || [], json['total'] || 0);
			}
		});
	}
	getList();
})();