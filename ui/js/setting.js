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
    "desc": "表格",
    "name": "grid",
    "menuList": []
  }, {
    "desc": "对话框",
    "name": "dialog",
    "menuList": []
  }, {
    "desc": "下拉框",
    "name": "combo",
    "menuList": []
  }, {
    "desc": "Loading",
    "name": "loading",
    "menuList": []
  }, {
    "desc": "瀑布流",
    "name": "waterfall",
    "menuList": []
  }, {
    "desc": "提示框",
    "name": "tip",
    "menuList": []
  }, {
    "desc": "工具类",
    "name": "util",
    "menuList": [{
    	"desc": "dragDrop(拖拽移动)",
      "name": "dragDrop",
      "menuList": []
    }, {
    	"desc": "resize(拖拽改变大小)",
      "name": "resize",
      "menuList": []
    }, {
    	"desc": "alignTo(对齐)",
      "name": "alignTo",
      "menuList": []
    }, {
    	"desc": "JSON工具类",
      "name": "json",
      "menuList": []
    }]
  }, {
  	"desc": "仿Mac效果",
    "name": "mac",
    "menuList": []
  }, {
  	"desc": "仿淘宝菜单",
    "name": "taobao",
    "menuList": []
  }, {
    "desc": "拓扑图",
    "name": "tp",
    "menuList": []
  }]
};
var setting = {
  "path": "",
  "isCtrl": false,
  "menu": {
  	"home": {
  		"name": "home",
  		"text": "首页",
  		"link": "home.html",
  		"fn": null
  	},
  	"grid": {
  		"name": "grid",
  		"text": "表格",
  		"link": "../doc/grid.html",
  		"fn": null
  	},
  	"dialog": {
  		"name": "dialog",
  		"text": "对话框",
  		"link": "../doc/dialog.html",
  		"fn": null
  	},
  	"combo": {
  		"name": "combo",
  		"text": "下拉框",
  		"link": "../doc/combo.html",
  		"fn": null
  	},
  	"loading": {
  		"name": "loading",
  		"text": "Loading",
  		"link": "../doc/loading.html",
  		"fn": null
  	},
  	"waterfall": {
  		"name": "waterfall",
  		"text": "waterfall",
  		"link": "../doc/waterfall.html",
  		"fn": null
  	},
  	"tip": {
  		"name": "tip",
  		"text": "提示框",
  		"link": "../doc/tip.html",
  		"fn": null
  	},
  	"util": {
  		"name": "util",
  		"text": "工具类",
  		//"link": "../doc/waterfall.html",
  		"fn": null
  	},
  	"dragDrop": {
  		"name": "dragDrop",
  		"text": "dragDrop(拖拽移动)",
  		"link": "../doc/dragDrop.html",
  		"fn": null
  	},
  	"resize": {
  		"name": "resize",
  		"text": "resize(拖拽改变大小)",
  		"link": "../doc/resize.html",
  		"fn": null
  	},
  	"alignTo": {
  		"name": "alignTo",
  		"text": "alignTo(对齐)",
  		"link": "../doc/alignTo.html",
  		"fn": null
  	},
  	"json": {
  		"name": "json",
  		"text": "JSON工具类",
  		"link": "../doc/json.html",
  		"fn": null
  	},
  	"mac": {
      "name": "mac",
      "text": "仿Mac效果",
      "link": "../doc/macDemo.html",
  		"fn": null
  	},
  	"taobao": {
      "name": "taobao",
      "text": "仿淘宝菜单",
      "link": "../doc/taobao.html",
  		"fn": null
  	},
    "tp": {
      "name": "tp",
      "text": "仿淘宝菜单",
      "link": "../doc/tools.html",
      "fn": null
    }
  }/*,
  action: {
  	LOGIN:						7001,
  	APPLY_RULE:					7002,
  	GET_AGENT_INFO:				7003,
  	USR_GET_USR_INFO:			7004,
  	CHANGE_PWD:					7005,
  	DEL_AGENT_LOG:				7006,
  	VIEW_AGENT_LOG:				7007,
  	LOGOUT:						7008,
  	DEL_AGENT:					7009,
  	DEL_USR:					7010,
  	ADD_USR:					7011,
  	VIEW_LOG:					7012,
  	DEL_LOG:					7013,
  	GET_PUSH_INFO:				7014,
  	//GET_OEM_INFO:				7015,
  	SYS_GET_USR_INFO:			7018,
  	CHANGE_USR_PWD:				7019,
  	SET_USR_INFO:				7020,
   	VIEW_PUSH_LOG:				7021,
  	DEL_ALL_AGENT_LOG:			7022,
  	DEL_ALL_SYS_LOG:			7023,
  	SYS_SET_HTTP_CONFIG:  		7024,
  	SYS_GET_HTTP_CONFIG:  		7025,
  	SYS_HTTP_RESTART:  			7026,
  	USER_SETINFO:  				7027,
  	SYS_SET_LICENSE:        	7028,
  	SYS_GET_LICENSE:        	7029,  
  	SYS_SET_EMAIL_CONFIG:   	7030,
  	SYS_GET_EMAIL_CONFIG:   	7031,
   	SYS_PUSH_GET_SNAPSHOT:      7032,
  	SYS_GET_FILERULES :      	7033,
  	SYS_PUSH_GET_DIRRULR:       7034,
  	SYS_ADD_SITE:           	7035,
  	SYS_EDIT_SITE:          	7036,
  	SYS_DEL_SITE:           	7037, 
  	SYS_EDIT_RULE:           	7038,
  	SYS_PUSH_EDIT_DIRRULR:      7039,
  	SYS_LIST_AGENT_LOGSTATIC:	7040,
  	SYS_SET_ALERT_CUSTOMCFG: 	7041,
  	SYS_GET_ALERT_CUSTOMCFG:	7042,
  	SYS_DEL_AGENT_CONFIG: 		7043,
  	SYS_RENAME_AGENT_CONFIG: 	7044,
  	SYS_SITE_BAK:           	7045,
  	SYS_SITE_RESTORE: 	        7046,
  	SYS_SITE_GET_SNAPSHOT: 		7047,	
  	DEL_SEL_AGENTLOG:           7048,
  	EDIT_ACCOUNT:               7049,
  	DEL_ACCOUNT:                7050,	
  	LIST_ACCOUNT:               7051,	
  	GET_ACCOUNT_INFO:           7052,
  	SYS_SET_SMS_CONFIG:         7053,
  	SYS_GET_SMS_CONFIG:         7054,
  	SYS_GET_LOG_CONFIG:   		7055, 
  	SYS_SET_LOG_CONFIG:     	7056, 
  	SYS_SITE_BAK_PACK:          7058,
  	SYS_SITE_PACK_DEL:          7059,
  	SYS_SITE_GET_PACK:          7060,
  	SYS_SITE_PACK_RESTORE:      7061,
  	SYS_SITE_PACK_LOAD:         7062,
  	SYS_AGENT_ENABLE_INJECT:    7064,
  	SYS_GET_ALLPUSHSERVER:      7065,
  	SYS_DEL_PUSHSERVER:         7066,
  	SYS_GET_PUSHSERVER:         7067,
  	SYS_EDIT_PUSHSERVER:        7068,
  	SYS_CHECKACC_PUSHSERVER:    7069,
  	SYS_GET_PUSHACCOUNT:        7070,
  	SYS_GET_PUSHDIRBYACCOUNT:   7071,
  	SYS_GET_PUSHIDBYACCOUNT:    7072,
  	SYS_SITE_GET_WEBRULES:		7073,
  	SYS_SITE_UPDATE_WEBRULES:	7074,
  	SYS_SITE_UPDATE_WEBRULE_BYRULEID:	7075,
  	SYS_SITE_GET_WEBRULE_BYRULEID:	    7076,
  	SYS_SITE_UPDATE_WEBLIST:            7077,
  	SYS_SITE_GET_WEBLIST:	    		7078,
  	SYS_SITE_GET_WEBLISTNAME:		    7079,
  	SYS_SITE_GET_ALLRULES:		        7080,
  	SYS_SITE_EDIT_ALLRULES:		        7081,
  	GET_STATE_BI:						7082,
  	GET_PUSHLOG_EXPORT:        			7083,
  	SYS_GET_WEBSTATE:           		7084,
  	SYS_GET_LIST_AGENTNAME:             7085,
  	SYS_GET_WEBSERVER_STATE:			7086,
  	SYS_GET_WEBSERVER_STATE_BYID:		7087,
  	SYS_EDIT_WEBSERVER_STATE:           7088,
  	SYS_SENDCMDTO_WEBSERVER:			7089,
  	SYS_SAVE_EDIT_WEBSERVER:			7090,
  	SYS_GET_ALLPUSH_INFO: 				7091,
  	SYS_GET_AGENTPINGPUSH_STATE:        7092,
  	GET_PUSH_RULES:                     7093,
      UPDATE_PUSHRULES:                   7094,
  	ADD_PUSH_DIR:						7095,
  	EDIT_PUSH_DIR:                      7096,
  	DEL_PUSH_DIR:                       7097,
  	PUAH_RULE_EFFECT:					7098,
  	USR_GET_AGENTUSR_INFO:				7099,
  	DEL_PUSH_LOG:						7100,
  	GET_SYSLOG_EXPORT:					7102,
  	GET_AGENTLOG_EXPORT:				7103,
  	GET_SERVERINFO:                     7104,
  	SYS_GET_ALL_RELATIVEPUSHSERVER:     7105,
  	SYS_UPDATE_PS_WORKMODE:             7106,
  	SYS_GET_PUSHTYPE_BY_ACCOUNT:        7107,
  	SYS_CHECKACC_USED_BY_SITE:			7108,
  	SYS_GET_PUSH_RELATIVEINFO_BYACCANDNAME:			7109,
  	AGENTLOG_TO_RULE:		            7110,
  	SYS_UPDATE_WEBLOG:		            7111,
  	SYS_GET_WEBLOG:		            	7112,
  	SYS_DOWN_WEBLOG:					7113,
  	SYS_GET_OVERFLOW_BYAGENT:           7114,
  	SYS_SET_SECURITY_POLICY:			7115,
  	SYS_GET_SECURITY_POLICY:			7116,
  	SYS_PS_RELITIVED_BY_SITE:		    7117,
  	SYS_PS_IMPORT_RULE:				 	7118,
  	SYS_PS_EXPORT_RULE:					7119,
  	USER_ACTION_GET_ALARM_SYSLOG_CONFIG:		7120,
  	USER_ACTION_SET_ALARM_SYSLOG_CONFIG:		7121,
  	USER_ACTION_GET_ALARM_SNMP_CONFIG:			7122,    
  	USER_ACTION_SET_ALARM_SNMP_CONFIG:			7123,
  	USER_ACTION_GET_LOGIN_SECURITY:				7130,    
  	USER_ACTION_SET_LOGIN_SECURITY:				7131,
  	USER_ACTION_SYS_EXPORT_CFGFILE:				7133,
  	USER_ACTION_SYS_IMPORT_CFGFILE:             7134,
  	USER_ACTION_SYS_UPDATE_SERVER:              7135,
  	USER_ACTION_SYS_UPDATE_PUSH:                7136,
  	USER_ACTION_SYS_UPDATE_AGENT:               7137,
  	USER_ACTION_VIEW_LOG:				7138,
  	USER_ACTION_SET_LOG_READED:         7139,
  	USER_ACTION_SYS_STATIC_LOG:			7141
  },
  error: {
  	EOK:				0xE0000000,
  	ELOGIN:				0xE0000001,
  	EPERM:				0xE0000002,
  	EFAIL:				0xE0000003,
  	EPARAM:				0xE0000004,
  	ELICENSE:   		0xE0000006,
  	ENOEXIST:   		0xE0000007,
  	ELOGIN_PASS:		0xE0000008,
  	ELOGIN_USER_LOCKED:	0xE0000009,
  	ELOGIN_NOTEXIST:	0xE000000A,
  	ELOGIN_IP_LOCKED:	0xE000000B,
  	ESERVER:			0xFFFFFFFE,
  	EUNKNOWN:			0xFFFFFFFF,

  	IS_CODE: function(code1, code2) {
  		if (code1 < 0) {
  			return ((0x100000000 + parseInt(code1, 10)) == code2);
  		} else {
  			return (parseInt(code1, 10) == code2);
  		}
   	},
  		
  	TO_CODE: function(code) {
  		return 0x100000000 + parseInt(code, 10);
  	},
  	
  	FROM_CODE: function(code) {
  		return parseInt(code, 10) - 0x100000000;
  	},
  		
  	IS_OK: function(code) {
  		return (this.IS_CODE(parseInt(code, 10), this.EOK) || code == this.EOK || code == 0);
  	}
  }*/
};