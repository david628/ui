var setting = {
  "path": "../",
  "menu": {
  	"home": {
  		"name": "home",
  		"text": "首页",
  		"link": "home.html",
  		"fn": null
  	},
  	"api": {
  		"name": "api",
  		"text": "风险感知",
  		"link": "api.html",
  		"fn": null
  	},
  	"grid": {
  		"name": "grid",
  		"text": "表格",
  		"link": "grid.html",
  		"fn": null
  	},
  	"grid_api": {
  		"name": "grid_api",
  		"text": "扫描任务",
  		"link": "api.html",
  		"fn": null
  	},
  	"grid_demo": {
  		"name": "grid_demo",
  		"text": "扫描分析",
  		"link": "grid_demo.html",
  		"fn": null
  	},
  	"component": {
  		"name": "component",
  		"text": "组件",
  		"link": "component.html",
  		"fn": null
  	}
  }
};
var DATA = {
"user": {
  "userId": 1,
  "name": "帐户",
  "roleId": 1001,
  "source": 1,
  "userName": "admin",
  "verifier": 0
},
"menus": [{
  "id": "0",
  "desc": "首页",
  "name": "home",
  "parentId": "-1",
  "menuList": []
}, {
  "id": "1",
  "desc": "API",
  "name": "api",
  "parentId": "-1",
  "menuList": [{
    "id": "10010",
    "desc": "列表",
    "name": "_grid",
    "parentId": "1",
    "menuList": [{
      "id": "10012",
	    "desc": "API",
	    "name": "grid_api",
	    "parentId": "10010",
	    "menuList": []
    }, {
      "id": "10013",
	    "desc": "Demo",
	    "name": "grid_demo",
	    "parentId": "10010",
	    "menuList": []
    }]
  }, {
    "id": "10020",
    "desc": "表格",
    "name": "grid",
    "parentId": "1",
    "menuList": []
  }]
}, {
  "id": "2",
  "desc": "组件",
  "name": "component",
  "parentId": "-1",
  "menuList": []
  }]
};