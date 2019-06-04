var DBapp = {};
(function() {
	DBapp = {
		ui : {},
		zIndex : 16000,
		zindex : 1000,
		MsgId : "____id-msg-box",
		getKbURL: function(s) {
      return s.replace(/([0-9A-Fa-f]{2})/g, function() {
        return String.fromCharCode(parseInt(arguments[1], 16));
      });
    },
		getZIndex : function() {
    	return ++DBapp.zindex;
    },
		template : function (str, config) {
		  return str.replace(/\{([\w-]+)\}/g, function(c, d) {
		    return config[d] !== undefined ? config[d] : "";
		  });
		},
		htmlEncode : function(value) {
	    return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	  },
	  htmlDecode : function(value) {
	    return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
	  },
	  trim : function(str) {
			return ((str || "") + "").replace(/(^\s*)|(\s*$)/g, "");
		},
	  isBlank : function(v) {
	  	if(v === undefined || v === null) {
	  		return true;
	  	}
	  	if(v + "" == "0") {
	  		return false;
	  	}
	  	return this.trim(v) == "";
	  },
	  indexOf : function(arr, C) {
	  	if(!arr) return -1;
			for (var B = 0, A = arr.length; B < A; B++) {
				if (arr[B] == C) {
					return B;
				}
			}
			return -1;
		},
		remove : function(arr, B) {
			var A = this.indexOf(arr, B);
			if (A != -1) {
				arr.splice(A, 1);
			}
		},
		unique : function(arr) {
		  var rs = [];
		  var is = {};
		  for (var i = 0; i < arr.length; i++) {
		    if (!is[arr[i]]) {
		      rs.push(arr[i]);
		      is[arr[i]] = true;
		    }
		  }
		  return rs;
		},
		Cookies : {
			set : function(c, e) {
				var a = arguments;
				var i = arguments.length;
				var b = (i > 2) ? a[2] : null;
				var h = (i > 3) ? a[3] : "/";
				var d = (i > 4) ? a[4] : null;
				var g = (i > 5) ? a[5] : false;
				document.cookie = c + "=" + escape(e)
				+ ((b === null) ? "" : ("; expires=" + b.toGMTString()))
				+ ((h === null) ? "" : ("; path=" + h))
				+ ((d === null) ? "" : ("; domain=" + d))
				+ ((g === true) ? "; secure" : "")
			},
			get : function(d) {
				var b = d + "=";
				var g = b.length;
				var a = document.cookie.length;
				var e = 0;
				var c = 0;
				while (e < a) {
					c = e + g;
					if (document.cookie.substring(e, c) == b) {
						return DBapp.Cookies.getCookieVal(c)
					}
					e = document.cookie.indexOf(" ", e) + 1;
					if (e === 0) {
						break
					}
				}
				return null
			},
			clear : function(a) {
				if (DBapp.Cookies.get(a)) {
					document.cookie = a + "=; expires=Thu, 01-Jan-70 00:00:01 GMT"
				}
			},
			getCookieVal : function(b) {
				var a = document.cookie.indexOf(";", b);
				if (a == -1) {
					a = document.cookie.length
				}
				return unescape(document.cookie.substring(b, a))
			}
		},
		urlEncode : function(o) {
			if (!o) {
				return "";
			}
			var buf = [];
			for (var key in o) {
				var ov = o[key], k = encodeURIComponent(key);
				var type = typeof ov;
				if (type == "undefined") {
					buf.push(k, "=&");
				} else {
					if (type != "function" && type != "object") {
						buf.push(k, "=", encodeURIComponent(ov), "&");
					} else {
						if (ov instanceof Array) {
							if (ov.length) {
								for (var i = 0, len = ov.length; i < len; i++) {
									buf.push(k, "=", encodeURIComponent(ov[i] === undefined ? "" : ov[i]), "&");
								}
							} else {
								buf.push(k, "=&");
							}
						}
					}
				}
			}
			buf.pop();
			return buf.join("");
		},
		urlDecode : function(string, overwrite) {
			if (!string || !string.length) {
				return {};
			}
			var obj = {};
			var pairs = string.split("&");
			var pair, name, value;
			for (var i = 0, len = pairs.length; i < len; i++) {
				pair = pairs[i].split("=");
				name = decodeURIComponent(pair[0]);
				value = decodeURIComponent(pair[1]);
				if (overwrite !== true) {
					if (typeof obj[name] == "undefined") {
						obj[name] = value;
					} else {
						if (typeof obj[name] == "string") {
							obj[name] = [obj[name]];
							obj[name].push(value);
						} else {
							obj[name].push(value);
						}
					}
				} else {
					obj[name] = value;
				}
			}
			return obj;
		},
		inputNumber: function(event, o, max) {
			var k = event.keyCode;
			if((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8)) {
				return true;
			} else {
				return false;
			}
		},
		afterInputNumber : function(event, o, max) {
			//if(max) {
				if(!$.isNumeric(o.value) || o.value < 1 || o.value > max) {
					o.value = "";
				}
			//}
		},
		_inputNumber: function(event, o, max) {
			var k = event.keyCode;
			if((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8)) {
				return true;
			} else {
				return false;
			}
		},
		_afterInputNumber : function(event, o, max) {
			//if(max) {
				if(!$.isNumeric(o.value) || o.value < 0 || o.value > max) {
					o.value = "";
				}
			//}
		},
		/*getOrganizeTreeData : function(r, treeData, config) {
		if (treeData && treeData.length) {
			for (var i = 0; i < treeData.length; i++) {
				if (treeData[i].check_Child_State == 1) {
					base.getOrganizeTreeData(r, treeData[i][config["children"]], config);
				} else if (treeData[i].check_Child_State == 2 || (treeData[i].check_Child_State == -1 && treeData[i].checked)) {
					var G = {};
					//G[config["entityType"]] = treeData[i].isParent ? 2 : 1;
					// G[config["entityId"]] = treeData[i][config["id"]];
					//G[config["entityId"]] = treeData[i]["userdata"][0]["content"];
				  //G[config["type"]] = treeData[i].isParent ? 2 : 1;
					G[config["id"]] = treeData[i][config["id"]];
					G[config["name"]] = treeData[i][config["name"]];
					r.push(G);
					continue;
				}
			}
		}
		return r;
	},*/
	reg_vali_name : function(value, text) {
		if(text.toLowerCase().indexOf(value.toLowerCase()) > -1) {
			return true;
		}
		return false;
	},
	showNodes: function(tree, nodes) {
		if(nodes && nodes.length) {
			for(var i = 0; i < nodes.length; i++) {
				$("#" + nodes[i]['tId']).show();
			}
		}
	},
	hideNodes: function(tree, nodes) {
		if(nodes && nodes.length) {
			for(var i = 0; i < nodes.length; i++) {
				$("#" + nodes[i]['tId']).hide();
			}
		}
	},
	filter : function(value, items, tree, isContains) {
		if(items === undefined || items.length < 0) {
			return 0;
		}
    var showCnt = 0;
		for(var i = 0; i < items.length; i++) {
      var curItem = items[i];
      var curNode = $("#" + curItem['tId']);
      var isHidden = curNode.css("display") == "none";
      var childShowCnt = 0;
      if(curItem.isParent) {
        childShowCnt = DBapp.filter(value, curItem["children"], tree, isContains);
      }
      if(isContains && isHidden) {
        continue;
      }
      showCnt += childShowCnt;
			if(childShowCnt > 0 || DBapp.reg_vali_name(value, curItem["name"])) {
        if(isHidden){
          curNode.show();
        }
        ++showCnt;
      } else {
        if(!isHidden) {
          curNode.hide();
        }
      }
		}

    return showCnt;
	},
	initFilterTree: function(tree, text, all, unall) {
    var delay = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();
		text.bind("keyup", function(e) {
      var btn = $(this);
      delay(function(){
        var isContains = false;
        var value = btn.val();
        if(typeof btn.attr("oldKey") != "undefined") {
            isContains = value.indexOf(btn.attr("oldKey")) >= 0;
        }
        btn.attr("oldKey", value);

        var showCnt = DBapp.filter(value, tree.getNodes(), tree, isContains);
        if(showCnt < 100) {
            tree.expandAll(true);
        } else {
            tree.expandAll(false);
        }
        return false;
      }, 200);
		});
		if(all) {
			all.bind("click", function() {
				tree.checkAllNodes(true);
			});
		}
		if(unall) {
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
		}
	},
	Event: {
		bind: function(dom, eventName, fn, scope, capture) {
			var hd = function(e) {
				fn.call(scope || dom, e);
			}
			fn.hd = hd;
	  	if(window.addEventListener) {
	  		dom.addEventListener(eventName, hd, !!capture || false);
	  	} else if(window.attachEvent) {
	  		dom.attachEvent("on" + eventName, hd);
	  	}
	  },
	  unbind: function(dom, eventName, fn, scope, capture) {
	  	if(window.removeEventListener) {
	  		dom.removeEventListener(eventName, fn.hd, !!capture || false);
	  	} else if(window.detachEvent) {
	  		dom.detachEvent("on" + eventName, fn.hd);
	    }
	  	delete fn.hd;
	  }
	}/*,
	searchTree : function(filterValue, zTreeObj, tree) {
		var _filter = function(nodes, attr, filterValue, tree, showFilterChildren, showFilterParent) {
			if (nodes && nodes.length > 0) {
				for (var i = 0; i < nodes.length; i++) {
					var _node = nodes[i];
					if (_node[attr]
//							&& _node[attr].toLowerCase().indexOf(filterValue) > -1) {
							&& _node[attr].toLowerCase().split("(")[0].trim().indexOf(filterValue) > -1) {
						var tempNode = _node, liNode = tree.find("#" + tempNode.tId);
						liNode.removeClass("tree-hide").addClass("tree-show");
						while (tempNode = tempNode.getParentNode()) {
							//tree.find("#" + tempNode.tId).show();
							tree.find("#" + tempNode.tId).removeClass("tree-hide").addClass("tree-show");
						}
						if (showFilterChildren !== false) {
							liNode.find("ul").show().find("li").removeClass("tree-hide").addClass("tree-show");
						}
						if (showFilterParent != false) {
							liNode.parents("ul").show().parents("li").removeClass("tree-hide").addClass("tree-show");
						}
						continue;
					}
					if (_node.children) {
						_filter(_node.children, attr, filterValue, tree, showFilterChildren, showFilterParent);
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
	}*/
};
	var JSON = new (function() {
		var useHasOwn = !!{}.hasOwnProperty;
		var pad = function(n) {
			return n < 10 ? "0" + n : n;
		};
		var m = {
			"\b" : '\\b',
			"\t" : '\\t',
			"\n" : '\\n',
			"\f" : '\\f',
			"\r" : '\\r',
			'"' : '\\"',
			"\\" : '\\\\'
		};
		var encodeString = function(s) {
			if (/["\\\x00-\x1f]/.test(s)) {
				return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
					var c = m[b];
					if (c) {
						return c;
					}
					c = b.charCodeAt();
					return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}) + '"';
			}
			return '"' + s + '"';
		};
		var encodeArray = function(o) {
			var a = ["["], b, i, l = o.length, v;
			for (i = 0; i < l; i += 1) {
				v = o[i];
				switch (typeof v) {
					case "undefined" :
					case "function" :
					case "unknown" :
						break;
					default :
						if (b) {
							a.push(',');
						}
						a.push(v === null ? "null" : JSON.encode(v));
						b = true;
				}
			}
			a.push("]");
			return a.join("");
		};
		this.encodeDate = function(o) {
			return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
		};
		this.encode = function(o) {
			if (typeof o == "undefined" || o === null) {
				return "null";
			} else if (Object.prototype.toString.apply(o) === "[object Array]") {
				return encodeArray(o);
			} else if (Object.prototype.toString.apply(o) === "[object Date]") {
				return JSON.encodeDate(o);
			} else if (typeof o == "string") {
				return encodeString(o);
			} else if (typeof o == "number") {
				return isFinite(o) ? String(o) : "null";
			} else if (typeof o == "boolean") {
				return String(o);
			} else {
				var a = ["{"], b, i, v;
				for (i in o) {
					if (!useHasOwn || o.hasOwnProperty(i)) {
						v = o[i];
						switch (typeof v) {
							case "undefined" :
							case "function" :
							case "unknown" :
								break;
							default :
								if (b) {
									a.push(',');
								}
								a.push(this.encode(i), ":", v === null ? "null" : this.encode(v));
								b = true;
						}
					}
				}
				a.push("}");
				return a.join("");
			}
		};
		this.decode = function(json) {
			return eval("(" + json + ')');
		};
	})();
	DBapp.encode = JSON.encode;
	DBapp.decode = JSON.decode;
})();
(function() {
	var Dialog = function(el, config) {
		this.init(el, config);
	}
	Dialog.prototype = {
		openAnimationDuration : 500,
		closeAnimationDuration : 500,
		openAnimationEffect : 'default-in',
		closeAnimationEffect : 'default-out',
		//openAnimationEffect : 'rollIn',
		//closeAnimationEffect : 'rollOut',
		//openAnimationEffect : "fadeInLeft",
		//closeAnimationEffect : "fadeOutRight",
		setTimeout : null,
		autoClose : false,
		defaultWidth : 560,
		autoCloseDelay : 3000,
    closeText : "&times;",
    buttonAlign : "center",
		template :
	  '<div class="modal-box" style="display: none;">'+
			'<div class="inner"><span class="title"></span><button class="close"></button>'+
			  '<div class="content"></div>'+
			  //'<div class="button-wrap">'+
			  '</div>'+
			'</div>'+
		'</div>',
	  init : function(el, config) {
	  	jQuery.extend(this, config);
	  	var self = this;
      var id;
      if(typeof el == "string") {
        id = el;
      }
	  	self.el = el && el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
	  	if(!self.el) {
	  		self.$el = jQuery(self.template);
        self.el = self.$el.get(0);
        if(id) {
          self.el.id = id;
        }
        jQuery('body').append(self.$el);
	  	} else {
        self.$el = jQuery(self.el);
      }
	  	self.$close = self.$el.find(".close");
	  	if(self.$close) {
	  		self.close = self.$close.get(0);
	  		if(self.close) {
	  			self.close.innerHTML = self.closeText;
	  		}
	      self.$close.bind("click", function(e) {
		  		self.hide();
		  	});
	  	}
	  	self.$inner = self.$el.find(".inner");
	  	self.inner = self.$inner.get(0);
	  	self.$titleWrap = self.$el.find(".title");
	  	self.titleWrap = self.$titleWrap.get(0);
	  	self.$content = self.$el.find(".content");
	  	self.content = self.$content.get(0);
	  	if(self.title) {
	  		self.setTitle(self.title);
	  	}
      if(self.msg) {
        self.setContent(self.msg);
      }
      //self.setSize(self.width, self.height);
      if(!self.mask) {
      	self.mask = document.createElement("div");
      	self.mask.className = "modal-box-mask";
      	//document.body.appendChild(self.mask);
      	self.el.parentNode.appendChild(self.mask);
      	self.$mask = jQuery(self.mask);
      	self.$mask.hide();
      }
	  	self.$mask.bind("keydown", function(e) {
				if (e.keyCode == 27) {
					self.$close.trigger("click");
				}
			});
	  	self.$mask.click(function(e) {
				if (jQuery(e.target).closest(".inner").length) {//也可用阻止冒泡
					return;
				}
				self.$close.trigger("click");
			});
	  	self.transitionDuration(self.$el, self.openAnimationDuration);
	  	self.animationDuration(jQuery(".inner", self.$el), self.openAnimationDuration);
	  },
	  createButtonWrap : function() {
	  	this.$buttonWrap = this.$el.find(".button-wrap");
	  	this.buttonWrap = this.$buttonWrap.get(0);
	  	if(!this.buttonWrap) {
	  		this.buttonWrap = document.createElement('div');
	  		this.buttonWrap.className = "button-wrap";
	  		this.inner.appendChild(this.buttonWrap);
	  		this.$buttonWrap = jQuery(this.buttonWrap);
	  		this.setButtonAlign(this.buttonAlign);
	  	}
	  },
    setButtonAlign : function(pos) {
      if(this.buttonWrap) {
        this.buttonWrap.className = "button-wrap" + (pos ? " " + pos : "");
        //this.buttonAlign = pos;
        //this.$buttonWrap.addClass(this.buttonAlign);
      }
    },
    setWidth : function(width) {
    	if(width) {
        this.width = width;
        this.$el.css("width", this.width);
      }
    },
    setHeight : function(height) {
    	if(height) {
        this.height = height;
        this.$content.css("height", this.height);
      }
    },
    setSize : function(width, height) {
      this.setWidth(width);
      this.setHeight(height);
    },
	  setTitle : function(title) {
	  	if(this.titleWrap) {
	  		this.title = title || "";
		  	this.titleWrap.innerHTML = this.title || "";
	  	}
	  },
	  setContent : function(html) {
	  	if(this.content) {
	  		this.html = html || "";
		  	this.content.innerHTML = this.html;
	  	}
	  },
	  clearButton : function() {
	  	if(this.buttonWrap) {
	  		this.$buttonWrap.html("");
    	}
	  },
    addButton : function(btns) {
    	this.createButtonWrap();
    	if(this.buttonWrap) {
    		for(var i=0;i<btns.length;i++) {
          var btn = jQuery('<a class="button" href="javascript:;">' + btns[i].text + '</a>');
          this.$buttonWrap.append(btn);
          if(btns[i].cls) {
            btn.addClass(btns[i].cls);
          }
          if((btns[i].handle && Object.prototype.toString.apply(btns[i].handle) === '[object Function]') || (btns[i].handdle && Object.prototype.toString.apply(btns[i].handdle) === '[object Function]')) {
	          btn.bind("click", {scope : this, config : btns[i]}, this._handleClick);
	        }
  			}
    	}
	  },
    _handleClick : function(e) {
	    var opt = e.data;
	    if(opt && opt.scope) {
	      var fn = (opt.config.handle || opt.config.handdle);
	      fn.apply(opt.config.scope ? opt.config.scope : opt.scope, arguments || []);
	    }
	  },
	  isVisible : function() {
      return this.$el.css("visibility") != "hidden";
	  	//return this.hasClass(this.el, "active");
	  },
	  hasClass : function(el, className) {
	  	return className && (' ' + el.className + ' ').indexOf(' ' + className + ' ') != -1;
	  },
	  show : function() {
	  	var self = this;
	  	self.$mask.css("zIndex", DBapp.getZIndex());
	  	self.$el.css("zIndex", DBapp.getZIndex());
	  	if(self.setTimeout) {
	  		self.clearTimeout(self.setTimeout);
	  	}
	  	/*if(self.isVisible()) {
	  		self.hide();
	  		return;
	  	}*/
	  	self.$el.css("visibility", "visible");
	  	self.$el.show();
	  	self.$mask.show();
	  	DBapp.Css.center(self.el);
	  	//DBapp.Css.center(self.inner);
	  	self.transitionDuration(self.$el, self.openAnimationDuration);
	  	self.animationDuration(jQuery(".inner", self.$el), self.openAnimationDuration);
			self.animate(self.openAnimationEffect, function() {
				//self.$close.focus();
				return;
			});
	  	if (self.autoClose) {
	  		self.setTimeout = setTimeout(function() {
	  			self.hide();
	  		}, self.autoCloseDelay);
	  	}
	  },
	  hide : function() {
	  	var self = this;
	  	if(self.setTimeout) {
	  		self.clearTimeout(self.setTimeout);
	  	}
	  	//self.$el.removeClass("active");
      self.$el.css("visibility", "hidden");
      self.$mask.hide();
      self.hideFn && self.hideFn()
	  	self.transitionDuration(self.$el, self.closeAnimationDuration);
	  	self.animationDuration(jQuery(".inner", self.$el), this.closeAnimationDuration);
	  	self.animate(self.closeAnimationEffect, function() {
	  		return;
			});
	  },
	  animate : function(effect, callback) {
			jQuery(".inner", this.$el).addClass(effect + " animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
				jQuery(this).removeClass(effect);
				if (typeof callback != "undefined") {
					callback.call(this);
				}
			});
		},
		animationDuration : function(el, duration) {
			el.css({
				"animation-duration" : duration + "ms"
			});
		},
		transitionDuration : function(el, duration) {
			el.css({
				"transition-duration" : duration + "ms"
			});
		}
	};
	var Msg = function() {
		var dlg, opt;
		return {
			getDialog : function(config) {
				if(!dlg) {
					dlg = new DBapp.ui.Dialog("____id-msg-box", {

					});
				}
				return dlg;
			},
			isVisible : function() {
	      return dlg && dlg.isVisible();
	    },
	    hide : function() {
	      if(this.isVisible()) {
	        dlg.hide();
	      }
	    },
	    setMsg : function(msg) {
	      return '<div class="cls-dlg-msg">' + msg + '</div>';
	    },
	    buttonText : {
	      ok : "确定",
	      cancel : "关闭",
	      yes : "是",
	      no : "否"
	    },
	    show : function(config) {
	    	if(this.isVisible()) {
	        this.hide();
	      }
	      var dialog = this.getDialog();
        //dialog.openAnimationEffect = "default-in";
        //dialog.closeAnimationEffect = "default-out";
        dialog.setSize(360);
        dialog.setButtonAlign("center");
	      dialog.setTitle(config.title || "");
	      dialog.setContent(config.msg || "");
	      if(config.button || config.button.length > 0) {
	        dialog.clearButton();
	        dialog.addButton(config.button);
	        dialog.$close.unbind("click");
		      dialog.$close.bind("click", function(e) {
		      	$(dialog.buttonWrap.childNodes[config.button.length - 1]).trigger("click");
			  	});
	      }
	      dialog.show();
	      return this;
	    },
	    Alert : function(title, msg, handle, scope) {
	      this.show({
	        title : title,
	        msg : this.setMsg(msg),
	        button : [{
	          text : this.buttonText.ok,
            cls : 'ah-btn ah-btn-blue',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("yes");
	            }
	          }
	        }],
	        handle : handle,
	        scope : scope
	      });
	      this.getDialog().beforeCloseClick = function() {
	        if(handle) {
	          handle("yes");
	        }
	      }
	      return this;
	    },
	    Confirm : function(title, msg, handle, scope) {
	      this.show({
	        title : title,
	        msg : this.setMsg(msg),
	        button : [{
	          //text : this.buttonText.yes,
	          text : this.buttonText.yes,
            cls : 'ah-btn ah-btn-blue',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("yes");
	            }
	          }
	        }, {
	          text : this.buttonText.no,
            cls : 'ah-btn ah-btn-white',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("no");
	            }
	          }
	        }],
	        handle : handle,
	        scope : scope
	      });
	      this.getDialog().beforeCloseClick = function() {}
	      return this;
	    },
	    Cancel : function(title, msg, handle, scope) {
	      this.show({
	        title : title,
	        msg : this.setMsg(msg),
	        button : [{
	          text : this.buttonText.yes,
	          cls : 'submit',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("yes");
	            }
	          }
	        }, {
	          text : this.buttonText.no,
	          cls : 'noSubmit',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("no");
	            }
	          }
	        }, {
	          text : this.buttonText.cancel,
	          cls : 'cancel',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("cancel");
	            }
	          }
	        }],
	        handle : handle,
	        scope : scope
	      });
	      this.getDialog().beforeCloseClick = function() {}
	      return this;
	    }
		};
	}();
	/*var Dialog = function(el, action, options) {
		this.init(el, action, options);
	}
	Dialog.prototype = {
		openAnimationDuration : 500,
		closeAnimationDuration : 500,
		//openAnimationEffect : 'default-in',
		//closeAnimationEffect : 'default-out',
		openAnimationEffect : 'rotateIn',
		closeAnimationEffect : 'rotateOut',
		closeOnEscape : true,
		autoClose : false,
		autoCloseDelay : 3000,
		clearButton : function() {
			this.$buttonWrap.html("");
		},
		addButton : function(arr) {
			for(var i=0;i<arr.length;i++) {
				this.$buttonWrap.append(arr[i]);
			}
		},
	  init : function(el, action, config) {
	  	var self = this;
	  	self.el = el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
	  	self.$el = jQuery(el);
	  	self.$buttonWrap = self.$el.find(".buttonWrap");
	  	if(config.button && config.button.length) {
	  		self.addButton(config.button);
	  	}
	  	self.$body = jQuery("body");
	  	jQuery.extend(self, config);
			self.scrollbarWidth = self.measureScrollBar();
			var target = self.$el.data().modalBox;
			if (typeof target == 'undefined') {
				self.$el.find(".close").click(function() {
		  		self.hide();
				});
		  	if (self.closeOnEscape) {
		  		self.$el.bind("keydown", function(e) {
						if (e.keyCode == 27)
							self.hide();
					});
				}
		  	self.$el.click(function(e) {
					if (jQuery(e.target).closest(".inner").length)
						return;
					self.hide();
				});
		  	self.originalBodyPad = "";
				if (!jQuery(".modal-box.active"))
					self.originalBodyPad = self.$body.css("padding-right") || "";
				self.$el.data("modalBox", self);
			} else {
				self = target;
			}
			if (action == "open") {
				self.show();
				if (self.autoClose)
					setTimeout(self.hide, self.autoCloseDelay);
			} else if (action == "close") {
				self.hide();
			}
	  },
	  show : function() {
	  	var self = this;
	  	self.$el.trigger("modalBox:beforeOpen", self);
			if (jQuery(">.inner", self.$el).outerHeight(true) > jQuery(window).height()) {
				self.$body.addClass("modal-box-open");
				self.setScrollBar();
			}
			// SET TAB INDEX
			self.$el.attr("tabindex", self.getTabIndex());
			// SET Z-INDEX
			self.$el.css("z-index", self.getZIndex());
			self.$el.addClass("active");
			self.transitionDuration(self.$el, self.openAnimationDuration);
			self.animationDuration($(".inner", self.$el), self.openAnimationDuration);
			self.animate(self.openAnimationEffect, function() {
				self.$el.trigger("modalBox:afterOpen", self);
				self.$el.focus();
			});
			self.$el.show();
		},
		hide : function() {
			var self = this;
			self.$el.trigger("modalBox:beforeClose", self);
			self.$el.removeClass("active");
			self.transitionDuration(self.$el, self.closeAnimationDuration);
			self.animationDuration(jQuery(".inner", self.$el), self.closeAnimationDuration);
			self.animate(self.closeAnimationEffect, function() {
				self.resetScrollBar();
				self.$body.removeClass("modal-box-open");
				self.$el.trigger("modalBox:afterClose", self);
			});
		},
		animate : function(effect, callback) {
			jQuery(".inner", this.$el).addClass(effect + " animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
				jQuery(this).removeClass(effect);
				if (typeof callback != "undefined")
					callback.call(this);
			});
		},
		animationDuration : function(el, duration) {
			el.css({
				"animation-duration" : duration + "ms"
			});
		},
		transitionDuration : function(el, duration) {
			el.css({
				"transition-duration" : duration + "ms"
			});
		},
		setScrollBar : function() {
			var bodyPad = parseInt(this.originalBodyPad, 10);
			this.$body.css("padding-right", bodyPad + this.scrollbarWidth);
		},
		resetScrollBar : function() {
			this.$body.css("padding-right", this.originalBodyPad);
		},
		measureScrollBar : function() {
			var scroll = $('<div class="modal-box-scroll-bar">');
			this.$body.append(scroll);
			var width = scroll[0].offsetWidth - scroll[0].clientWidth;
			scroll.remove();
			return width;
		},
		getTabIndex : function() {
			var tabIndex = 1;
			jQuery("div.modal-box[tabindex]").each(function() {
				if (jQuery(this).attr("tabindex") > tabIndex) {
					tabIndex = Number(jQuery(this).attr("tabindex"));
				}
			});
			return tabIndex + 1;
		},
		getZIndex : function() {
			var zIndex = 999;
			jQuery("div.modal-box").each(function() {
				if (jQuery(this).css("z-index") > zIndex) {
					zIndex = Number(jQuery(this).css("z-index"));
				}
			});
			return zIndex + 1;
		}
	};*/
	DBapp.ui.Dialog = Dialog;
	DBapp.ui.Msg = Msg;
})();
(function() {
	var IFocus = function(D) {
	  this.init(D);
	}
	IFocus.prototype = {
		width : 560,
		height : 354,
		imgWidth : 410,
	  imgHeight : 354,
	  opHeight: 35,
	  btnWidth : 91,
	  btnHeight : 57,
		atuokey : false,
		time : 5000,
		type : 0,
		point : 0,
		border: 2,
		moveElement : function(elementID, final_x, final_y, interval) {
			if(!document.getElementById) return false;
		  if(!document.getElementById(elementID)) return false;
		  var elem = document.getElementById(elementID);
		  if(elem.movement) {
		    clearTimeout(elem.movement);
		  }
		  if(!elem.style.left) {
		    elem.style.left = "0px";
		  }
		  if(!elem.style.top) {
		    elem.style.top = "0px";
		  }
		  var xpos = parseInt(elem.style.left);
		  var ypos = parseInt(elem.style.top);
		  if(xpos == final_x && ypos == final_y) {
				return true;
		  }
		  if(xpos < final_x) {
		    var dist = Math.ceil((final_x - xpos)/10);
		    xpos = xpos + dist;
		  }
		  if(xpos > final_x) {
		    var dist = Math.ceil((xpos - final_x)/10);
		    xpos = xpos - dist;
		  }
		  if(ypos < final_y) {
		    var dist = Math.ceil((final_y - ypos)/10);
		    ypos = ypos + dist;
		  }
		  if(ypos > final_y) {
		    var dist = Math.ceil((ypos - final_y)/10);
		    ypos = ypos - dist;
		  }
		  elem.style.left = xpos + "px";
		  elem.style.top = ypos + "px";
		  var o = this;
		  elem.movement = setTimeout(function() {
			  o.moveElement(elementID, final_x, final_y, interval);
			}, interval);
		},
	  classNormal : function(iFocusBtnID, iFocusTxID) {
	  	var iFocusBtns= iFocusBtnID.childNodes;
	  	var iFocusTxs = iFocusTxID.getElementsByTagName('li');
	  	for(var i=0;i<iFocusBtns.length;i++) {
	  		iFocusBtns[i].className = 'normal';
	  		iFocusTxs[i].className = 'normal';
	  	}
	  },
	  classCurrent : function(iFocusBtnID, iFocusTxID, n) {
	  	var iFocusBtns = iFocusBtnID.childNodes;
	  	var iFocusTxs = iFocusTxID.getElementsByTagName('li');
	  	iFocusBtns[n].className = 'current';
	  	iFocusTxs[n].className = 'current';
	  },
	  autoiFocus : function() {
	  	if(!this.el) return false;
	  	if(this.atuokey) return false;
	  	focusBtnList = this.btn.childNodes;
	  	var listLength = focusBtnList.length;
	  	for(var i=0;i<listLength;i++) {
	  		if(focusBtnList[i].className == 'current') {
	  			this.switchImg(i + 1, this);
	    		break;
	    	}
	  	}
	  },
	  iFocusChange : function() {
	  	var o = this;
	  	if(!o.el) return false;
	  	o.el.onmouseover = function(){o.atuokey = true};
	  	o.el.onmouseout = function(){o.atuokey = false};
	  	var iFocusBtns = o.btn.childNodes;
	  	var listLength = iFocusBtns.length;
	  	if(listLength > 0) {
	  		for(var i=0;i<listLength;i++) {
	  			iFocusBtns[i].data = i;
	  			iFocusBtns[i].onmouseover = function() {
	  				o.switchImg(this.data, o);
	  	  	}
	      }
	    }
	  },
	  switchImg : function(n, o) {
	  	if(n >= o.btn.childNodes.length) {
				n = 0;
	    } else if(n < 0) {
	    	n = o.btn.childNodes.length - 1;
	    }
	    if(o.type == 0) {
	    	o.moveElement(o.piclist.id, 0, o.imgHeight * -n, 5);
	  		o.classNormal(o.btn, o.tx);
	  		o.classCurrent(o.btn, o.tx, n);
	    } else if(o.type == 1) {
	    	o.moveElement(o.piclist.id, o.width * -n, 0, 5);
	  		o.classNormal(o.btn, o.tx);
	  		o.classCurrent(o.btn, o.tx, n);
	    }
	    this.point = n;
	  },
	  init : function(D) {
	    this.config = D || {};
	    if(!D.renderTo) {
	      return;
	    }
	    D.type && (this.type = D.type);
	    D.data && (this.data = D.data);
	    D.width && (this.width = D.width);
	    D.height && (this.height = D.height);
	    D.imgWidth && (this.imgWidth = D.imgWidth);
	    D.imgHeight && (this.imgHeight = D.imgHeight);
	    D.opHeight && (this.opHeight = D.opHeight);
	    D.btnWidth && (this.btnWidth = D.btnWidth);
	    D.btnHeight && (this.btnHeight = D.btnHeight);
	    D.time && (this.time = D.time);
	    typeof D.renderTo == "string" ? this.el = document.getElementById(D.renderTo) : this.el = D.renderTo;
	    //style="width: 525px;height: 245px;"
	    this.el.className = "cls-ifocus";
	    this.el.innerHTML = '<div class="cls-ifocus_pic">' +
														'<div id="' + D.renderTo + '_piclist" class="cls-ifocus_piclist" style="left:0;top:0;"></div>' +
														'<div class="cls-ifocus_opdiv"></div>' +
														'<div class="cls-ifocus_tx"><ul></ul></div>' +
													'</div>' +
													'<div class="cls-ifocus_btn"></div>' +
													'<a href="javascript:void(0);" class="cls-ifocus_pre" style="top: 0;display: none;"></a>' +
			                    '<a href="javascript:void(0);" class="cls-ifocus_next" style="top: 0;display: none;"></a>';
		  this.pic = this.el.childNodes[0];
		  this.btn = this.el.childNodes[1];
		  this.pre = this.el.childNodes[2];
		  this.next = this.el.childNodes[3];
		  this.piclist = this.pic.childNodes[0];
		  this.opdiv = this.pic.childNodes[1];
		  this.tx = this.pic.childNodes[2];
	    this.initSize();
	    return this;
	  },
	  load : function(data) {
	  	data && (this.data = data);
	  	var a = [], b = [], c = [];
	  	if(this.type == 0) {
	    	this.load0(a, b, c);
	    } else if(this.type == 1) {
	    	this.load1(a, b, c);
	    }
	  	this.piclist.innerHTML = a.join("");
	  	this.tx.firstChild.innerHTML = b.join("");
	  	this.btn.innerHTML = c.join("");
	  	this.btn.style.left = (this.width - this.btn.offsetWidth) / 2 + "px";
	    var o = this;
	    setInterval(function(){
	    	o.autoiFocus();
	    }, this.time);
	  	this.atuokey = false;
	  	this.point = 0;
	  	this.iFocusChange();
	  	return this;
	  },
	  load0 : function(a, b, c) {
	  	for(var i=0;i<this.data.length;i++) {
	    	a.push('<div style="width:' + this.imgWidth + 'px;height:' + this.imgHeight + 'px;"><a href="' + this.data[i].link + '" target="_blank"><img style="width:' + this.imgWidth + 'px;height:' + this.imgHeight + 'px;" src="' + this.data[i].img + '" alt="' + this.data[i].desc + '" /></a></div>');
	    	b.push('<li class="' + (i == 0 ? "current" : "normal") + '">' + this.data[i].desc + '</li>');
	    	c.push('<div class="' + (i == 0 ? "current" : "normal") + '" style="width:' + (this.width - this.imgWidth) + 'px;height:' + Math.floor(this.height / this.data.length) + 'px;"><a href="' + this.data[i].link + '" target="_blank"><img style="width: ' + (this.width - this.border - this.imgWidth) + 'px;height: ' + Math.floor((this.height - this.border)/this.data.length) + 'px;" src="' + this.data[i].img + '" alt="" /></a></div>');
	    }
	  },
	  load1 : function(a, b, c) {
	  	var scope = this;
	  	this.piclist.onmouseover = function() {
	  		scope.pre.style.display = "block";
	  		scope.next.style.display = "block";
	  	}
	  	this.piclist.onmouseout = function() {
	  		scope.pre.style.display = "none";
	  		scope.next.style.display = "none";
	  	}
	  	this.pre.onmouseover = function() {
	  		scope.pre.style.display = "block";
	  		scope.next.style.display = "block";
	  	}
	  	this.pre.onmouseout = function() {
	  		scope.pre.style.display = "none";
	  		scope.next.style.display = "none";
	  	}
	  	this.next.onmouseover = function() {
	  		scope.pre.style.display = "block";
	  		scope.next.style.display = "block";
	  	}
	  	this.next.onmouseout = function() {
	  		scope.pre.style.display = "none";
	  		scope.next.style.display = "none";
	  	}
	  	for(var i=0;i<this.data.length;i++) {
	    	a.push('<div class="cls-ifocus-fl" style="width:' + this.width + 'px;height:' + this.imgHeight + 'px;float:left;"><a href="' + this.data[i].link + '" target="_blank"><img style="width:' + this.width + 'px;height:' + this.imgHeight + 'px;" src="' + this.data[i].img + '" alt="' + this.data[i].desc + '" /></a></div>');
	    	b.push('<li class="' + (i == 0 ? "current" : "normal") + '">' + this.data[i].desc + '</li>');
	    	//c.push('<span class="' + (i == 0 ? "current" : "normal") + '"><a href="' + this.data[i].link + '" target="_blank"><img src="' + this.data[i].img + '" alt="" /></a></span>');
	    	c.push('<span class="' + (i == 0 ? "current" : "normal") + '"></span>');
	    }
	  	this.piclist.style.width = this.width * this.data.length + "px";
	  	var o = this;
	  	//this.pre.style.display = "block";
	    this.pre.style.top = this.next.style.top = Math.floor((this.imgHeight - this.pre.offsetHeight) / 2) + "px";
	  	this.pre.onclick = function() {
				o.switchImg(o.point-1, o);
	  	}
	    //this.next.style.display = "block";
	  	this.next.onclick = function() {
				o.switchImg(o.point+1, o);
	  	}
	  },
	  initSize : function() {
	    if(this.type == 0) {
	    	this.el.style.width = this.width + "px";
	      this.el.style.height = this.height + "px";
	      this.pic.style.width = this.imgWidth + "px";
	      this.pic.style.height = this.imgHeight + "px";
	      this.opdiv.style.width = this.imgWidth + "px";
	      this.opdiv.style.height = this.opHeight + "px";
	      //this.btn.style.width = this.btnWidth + "px";
	    } else if(this.type == 1) {
	    	this.el.style.width = this.width + "px";
	      this.el.style.height = this.height + "px";
	      this.pic.style.width = this.width + "px";
	      this.pic.style.height = this.imgHeight + "px";
	      this.opdiv.style.width = this.width + "px";
	      this.opdiv.style.height = this.opHeight + "px";
	    }
	  }
	}
	DBapp.ui.IFocus = IFocus;
})();
//var DBApp = {};
//Dldh = {};
(function() {
	var Dldh = {
		idSeed : 0,
	  id : function(e, t) {
			t = t || "dldh-gen", e = Dldh.getDom(e);
			var n = t + ++Dldh.idSeed;
			return e ? e.id ? e.id : e.id = n : n
		},
		isOpera : navigator.userAgent.toLowerCase().indexOf("opera") > -1,
		isSafari : (/webkit|khtml/).test(navigator.userAgent.toLowerCase()),
	  isGecko : !(/webkit|khtml/).test(navigator.userAgent.toLowerCase()) && navigator.userAgent.toLowerCase().indexOf("gecko") > -1,
	  isAir : (/adobeair/).test(navigator.userAgent.toLowerCase()),
	  isIE : navigator.userAgent.toLowerCase().indexOf("msie") > -1,
	  template : function (str, config) {
		  return str.replace(/\{([\w-]+)\}/g, function(c, d) {
		    return config[d] !== undefined ? config[d] : "";
		  });
		},
	  expando: "eghjhjkrfdgghgj" + new Date(),
	  setData : function(el, data) {
	    if (!el) {
	      return null;
	    }
	    return jQuery(Dldh.getDom(el)).data("data", data);
	  },
	  getData : function(el) {
	    if (!el) {
	      return null;
	    }
	    return jQuery(Dldh.getDom(el)).data("data");
	  },
	  getDom : function(el) {
	  	if(!el) return null;
	  	return el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
	  },
	  preanim : function(a, i) {
	    return !a[i] ? false : (typeof a[i] == "object" ? a[i] : {
	      duration : a[i + 1],
	      callback : a[i + 2],
	      easing : a[i + 3]
	    });
	  },
	  addUnits : function(v, defaultUnit) {
	    if (v === "" || v == "auto") {
	      return v;
	    }
	    if (v === undefined) {
	      return '';
	    }
	    if (typeof v == "number" || !/\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i.test(v)) {
	      return v + (defaultUnit || 'px');
	    }
	    return v;
	  },
	  inputNumber : function(e, o, max) {
			var k = e.keyCode;
			if((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8)) {
				return true;
			} else {
				return false;
			}
		},
		afterInputNumber : function(e, o, max, min) {
			if(o.value < (min || 1) || o.value > max) {
				o.value = "";
			}
		},
		/**
	   * F = true 正序
	   * F = false(默认) 倒序
	   */
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
	  stopEvent : function(e) {
	  	Dldh.preventDefault(e);
	  	Dldh.stopPropagation(e);
	  },
	  preventDefault : function(e) {
			if(e.preventDefault) {
	      e.preventDefault();
	    } else {
	      e.returnValue = false;
	    }
	  },
	  stopPropagation : function(e) {
	  	if(e.type == 'mousedown') {
	  		return true;
	  	}
	  	if(e.stopPropagation) {
	      e.stopPropagation();
	    } else {
	      e.cancelBubble = true;
	    }
	  },
	  htmlEncode : function(value) {
      return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },
    htmlDecode : function(value) {
      return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    },
    Css : {
    	unselectable : function(el) {
    		jQuery(el).addClass("cls-unselectable");
    	},
    	hasClass : function(el, className) {
  	    el = Dldh.getDom(el);
  	    return className && (' ' + el.className + ' ').indexOf(' ' + className + ' ') != -1;
  	  },
    	addStyles : function(el, sides, styles) {
  	    var val = 0, v, w;
  	    el = jQuery(Dldh.getDom(el));
  	    for (var i = 0, len = sides.length; i < len; i++) {
  	      v = el.css(styles[sides.charAt(i)]);
  	      if (v) {
  	        w = parseInt(v, 10);
  	        if (w) {
  	          val += w;
  	        }
  	      }
  	    }
  	    return val;
  	  },
    	getBorderWidth : function(el, side) {
  	    return Dldh.Css.addStyles(el, side, {
  		    l : "border-left-width",
  		    r : "border-right-width",
  		    t : "border-top-width",
  		    b : "border-bottom-width"
  		  });
  	  },
  	  getPadding : function(el, side) {
  	    return Dldh.Css.addStyles(el, side, {
  		    l : "padding-left",
  		    r : "padding-right",
  		    t : "padding-top",
  		    b : "padding-bottom"
  		  });
  	  },
  	  getMargins : function(el, side) {
  	    if (!side) {
  	    	el = jQuery(Dldh.getDom(el));
  	      return {
  	        top : parseInt(el.css("margin-top"), 10) || 0,
  	        left : parseInt(el.css("margin-left"), 10) || 0,
  	        bottom : parseInt(el.css("margin-bottom"), 10) || 0,
  	        right : parseInt(el.css("margin-right"), 10) || 0
  	      };
  	    } else {
  	      return Dldh.Css.addStyles(el, side, {
  	  	    l : "margin-left",
  	  	    r : "margin-right",
  	  	    t : "margin-top",
  	  	    b : "margin-bottom"
  	  	  });
  	    }
  	  },
    	adjustWidth : function(el, width) {
  	    if (typeof width == "number") {
  	      width -= (Dldh.Css.getBorderWidth(el, "lr") + Dldh.Css.getPadding(el, "lr"));
  	      if (width < 0) {
  	        width = 0;
  	      }
  	    }
  	    return width;
  	  },
  	  adjustHeight : function(el, height) {
  	    if (typeof height == "number") {
  	      height -= (Dldh.Css.getBorderWidth(el, "tb") + Dldh.Css.getPadding(el, "tb"));
  	      if (height < 0) {
  	        height = 0;
  	      }
  	    }
  	    return height;
  	  },
  	  isVisible : function(el, deep) {
  	  	el = jQuery(Dldh.getDom(el));
  	    var vis = !(el.css("visibility") == "hidden" || el.css("display") == "none");
  	    if (deep !== true || !vis) {
  	      return vis;
  	    }
  	    return true;
  	  },
  	  setBounds : function(el, x, y, width, height, animate, time, cb) {
        el = Dldh.getDom(el);
        if(!animate) {
          Dldh.Css.setSize(el, width, height);
          Dldh.Css.setXY(el, [x, y]);
        } else {
          width = Dldh.Css.adjustWidth(el, width);
          height = Dldh.Css.adjustHeight(el, height);
          Dldh.lib.Anim.motion(el, {
  	        points : {
              to : [x, y]
            },
            width : {
              to : width
            },
            height : {
              to : height
            }
  	      } , time ? time : 0.35, "motion", cb);
        }
        return el;
      },
  	  getBox : function(el, contentBox, local) {
  	    var xy, el_jq;
  	    el = Dldh.getDom(el);
  	    el_jq = jQuery(el);
  	    if (!local) {
  	      xy = Dldh.Css.getXY(el);
  	    } else {
  	      var left = parseInt(el_jq.css("left"), 10) || 0;
  	      var top = parseInt(el_jq.css("top"), 10) || 0;
  	      xy = [left, top];
  	    }
  	    var w = el.offsetWidth, h = el.offsetHeight, bx;
  	    if (!contentBox) {
  	      bx = {
  	        x : xy[0],
  	        y : xy[1],
  	        0 : xy[0],
  	        1 : xy[1],
  	        width : w,
  	        height : h
  	      };
  	    } else {
  	      var l = Dldh.Css.getBorderWidth(el, "l") + Dldh.Css.getPadding(el, "l");
  	      var r = Dldh.Css.getBorderWidth(el, "r") + Dldh.Css.getPadding(el, "r");
  	      var t = Dldh.Css.getBorderWidth(el, "t") + Dldh.Css.getPadding(el, "t");
  	      var b = Dldh.Css.getBorderWidth(el, "b") + Dldh.Css.getPadding(el, "b");
  	      bx = {
  	        x : xy[0] + l,
  	        y : xy[1] + t,
  	        0 : xy[0] + l,
  	        1 : xy[1] + t,
  	        width : w - (l + r),
  	        height : h - (t + b)
  	      };
  	    }
  	    bx.right = bx.x + bx.width;
  	    bx.bottom = bx.y + bx.height;
  	    return bx;
  	  },
  	  getViewWidth : function(full) {
  	    return full ? Dldh.Css.getDocumentWidth() : Dldh.Css.getViewportWidth();
  	  },
  	  getViewHeight : function(full) {
  	    return full ? Dldh.Css.getDocumentHeight() : Dldh.Css.getViewportHeight();
  	  },
  	  getDocumentHeight : function() {
  	    var E = (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight;
  	    if(Dldh.isSafari) {
  	      E = document.body.scrollHeight;
  	    }
  	    return Math.max(E, Dldh.Css.getViewportHeight());
  	  },
  	  getDocumentWidth : function() {
  	    var E = (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth;
  	    if(Dldh.isSafari) {
  	      E = document.body.scrollWidth;
  	    }
  	    return Math.max(E, Dldh.Css.getViewportWidth());
  	  },
  	  getViewportHeight : function() {
  	    var E = self.innerHeight;
  	    var F = document.compatMode;
  	    if ((F || Dldh.isIE) && !Dldh.isOpera) {
  	      E = (F == "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
  	    }
  	    return E;
  	  },
  	  getViewportWidth : function() {
  	    var E = self.innerWidth;
  	    var F = document.compatMode;
  	    if (F || Dldh.isIE) {
  	      E = (F == "CSS1Compat") ? document.documentElement.clientWidth : document.body.clientWidth;
  	    }
  	    return E;
  	  },
    	getScroll : function(el) {
  	    el = Dldh.getDom(el);
  	    if (el == document || el == document.body) {
  	      var l = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  	      var t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	      return {
  	        left : l,
  	        top : t
  	      };
  	    } else {
  	      return {
  	        left : el.scrollLeft,
  	        top : el.scrollTop
  	      };
  	    }
  	  },
  	  getY : function(el) {
  			return Dldh.Css.getXY(el)[1];
  		},
  		getX : function(el) {
  			return Dldh.Css.getXY(el)[0];
  		},
    	getXY : function(el) {
    		var p,
    		pe,
    		b,
    		bt,
    		bl,
    		dbd,
    		x = 0,
    		y = 0,
    		scroll,
    		hasAbsolute,
    		bd = (document.body || document.documentElement),
    		ret = [0, 0];
    		el = Dldh.getDom(el);
    		if (el != bd) {
  				if (el.getBoundingClientRect) {
  					b = el.getBoundingClientRect();
  					scroll = Dldh.Css.getScroll(document);
  					ret = [Math.round(b.left + scroll.left), Math.round(b.top + scroll.top)];
  				} else {
  					p = el;
  					hasAbsolute = jQuery(el).css("position") == "absolute";
  					while (p) {
  						pe = jQuery(p);
  						x += p.offsetLeft;
  						y += p.offsetTop;
  						hasAbsolute = hasAbsolute || pe.css("position") == "absolute";
  						if (Dldh.isGecko) {
  							y += bt = parseInt(pe.css("borderTopWidth"), 10) || 0;
  							x += bl = parseInt(pe.css("borderLeftWidth"), 10) || 0;
  							if (p != el && !pe.css('overflow') == 'visible') {
  								x += bl;
  								y += bt;
  							}
  						}
  						p = p.offsetParent;
  					}
  					if (Dldh.isSafari && hasAbsolute) {
  						x -= bd.offsetLeft;
  						y -= bd.offsetTop;
  					}
  					if (Dldh.isGecko && !hasAbsolute) {
  						dbd = jQuery(bd);
  						x += parseInt(dbd.css("borderLeftWidth"), 10) || 0;
  						y += parseInt(dbd.css("borderTopWidth"), 10) || 0;
  					}
  					p = el.parentNode;
  					while (p && p != bd) {
  						if (!Dldh.isOpera || (p.tagName != 'TR' && !jQuery(p).css("display") == "inline")) {
  							x -= p.scrollLeft;
  							y -= p.scrollTop;
  						}
  						p = p.parentNode;
  					}
  					ret = [x, y];
  				}
  			}
    		return ret;
    	},
    	setXY : function(el, xy) {
    		el = Dldh.getDom(el);
    		Dldh.Css.position(el);
  			var pts = Dldh.Css.translatePoints(el, xy), style = el.style, pos;
  			for (pos in pts) {
  				if (!isNaN(pts[pos])) {
  					style[pos] = pts[pos] + "px";
  				}
  			}
  		},
  		setX : function(el, x) {
  			Dldh.Css.setXY(el, [x, false]);
  		},
  		setY : function(el, y) {
  			Dldh.Css.setXY(el, [false, y]);
  		},
  		translatePoints : function(el, x, y) {
  	    el = Dldh.getDom(el);
  	    var el_jq = jQuery(el);
  	    if (typeof x == 'object' || x instanceof Array) {
  	      y = x[1];
  	      x = x[0];
  	    }
  	    var p = el_jq.css('position');
  	    var o = Dldh.Css.getXY(el);
  	    var l = parseInt(el_jq.css('left'), 10);
  	    var t = parseInt(el_jq.css('top'), 10);
  	    if (isNaN(l)) {
  	      l = (p == "relative") ? 0 : el.offsetLeft;
  	    }
  	    if (isNaN(t)) {
  	      t = (p == "relative") ? 0 : el.offsetTop;
  	    }
  	    return {
  	      left : (x - o[0] + l),
  	      top : (y - o[1] + t)
  	    };
  	  },
  		position : function(el, pos, zIndex, x, y) {
  	    el = Dldh.getDom(el);
  	    var el_jq = jQuery(el);
  	    if (!pos) {
  	      if (el_jq.css('position') == 'static') {
  	      	el_jq.css('position', 'relative');
  	      }
  	    } else {
  	    	el_jq.css("position", pos);
  	    }
  	    if (zIndex) {
  	    	el_jq.css("zIndex", zIndex);
  	    }
  	    if (x !== undefined && y !== undefined) {
  	      Dldh.Css.setXY(el, [x, y]);
  	    } else if (x !== undefined) {
  	      Dldh.Css.setX(el, x);
  	    } else if (y !== undefined) {
  	      Dldh.Css.setY(el, y);
  	    }
  	  },
  	  getAnchorXY : function(el, anchor, local, s) {
  	    var w, h, vp = false;
  	    el = Dldh.getDom(el);
  	    if (!s) {
  	      if (el == document.body || el == document) {
  	        vp = true;
  	        w = Dldh.Css.getViewWidth();
  	        h = Dldh.Css.getViewHeight();
  	      } else {
  	        w = Dldh.Css.getWidth(el);
  	        h = Dldh.Css.getHeight(el);
  	      }
  	    } else {
  	      w = s.width;
  	      h = s.height;
  	    }
  	    var x = 0, y = 0, r = Math.round;
  	    switch ((anchor || "tl").toLowerCase()) {
  	      case "c" :
  	        x = r(w * .5);
  	        y = r(h * .5);
  	        break;
  	      case "t" :
  	        x = r(w * .5);
  	        y = 0;
  	        break;
  	      case "l" :
  	        x = 0;
  	        y = r(h * .5);
  	        break;
  	      case "r" :
  	        x = w;
  	        y = r(h * .5);
  	        break;
  	      case "b" :
  	        x = r(w * .5);
  	        y = h;
  	        break;
  	      case "tl" :
  	        x = 0;
  	        y = 0;
  	        break;
  	      case "bl" :
  	        x = 0;
  	        y = h;
  	        break;
  	      case "br" :
  	        x = w;
  	        y = h;
  	        break;
  	      case "tr" :
  	        x = w;
  	        y = 0;
  	        break;
  	    }
  	    if (local === true) {
  	      return [x, y];
  	    }
  	    if (vp) {
  	      var sc = Dldh.Css.getScroll(el);
  	      return [x + sc.left, y + sc.top];
  	    }
  	    var o = Dldh.Css.getXY(el);
  	    return [x + o[0], y + o[1]];
  	  },
  	  getAlignToXY : function(el, pel, p, o) {
        pel = Dldh.getDom(pel);
  	    if (!pel) {
  	      throw "Element.alignTo with an element that doesn't exist";
  	    }
  	    var c = false, p1 = "", p2 = "";
  	    el = Dldh.getDom(el);
  	    o = o || [0, 0];
  	    if (!p) {
  	      p = "tl-bl";
  	    } else if (p == "?") {
  	      p = "tl-bl?";
  	    } else if (p.indexOf("-") == -1) {
  	      p = "tl-" + p;
  	    }
  	    p = p.toLowerCase();
  	    var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
  	    if (!m) {
  	      throw "Element.alignTo with an invalid alignment " + p;
  	    }
  	    p1 = m[1];
  	    p2 = m[2];
  	    c = !!m[3];
  	    var a1 = Dldh.Css.getAnchorXY(el, p1, true);
  	    var a2 = Dldh.Css.getAnchorXY(pel, p2, false);
  	    var x = a2[0] - a1[0] + o[0];
  	    var y = a2[1] - a1[1] + o[1];
  	    if (c) {
  	      var w = Dldh.Css.getWidth(el), h = Dldh.Css.getHeight(el), r = Dldh.lib.Region.getRegion(pel);
  	      var dw = Dldh.Css.getViewWidth() - 5, dh = Dldh.Css.getViewHeight() - 5;
  	      var p1y = p1.charAt(0), p1x = p1.charAt(p1.length - 1);
  	      var p2y = p2.charAt(0), p2x = p2.charAt(p2.length - 1);
  	      var swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
  	      var swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));
  	      var scrollX = (document.documentElement.scrollLeft || document.body.scrollLeft || 0) + 5;
  	      var scrollY = (document.documentElement.scrollTop || document.body.scrollTop || 0) + 5;
  	      if ((x + w) > dw + scrollX) {
  	        x = swapX ? r.left - w : dw + scrollX - w;
  	      }
  	      if (x < scrollX) {
  	        x = swapX ? r.right : scrollX;
  	      }
  	      if ((y + h) > dh + scrollY) {
  	        y = swapY ? r.top - h : dh + scrollY - h;
  	      }
  	      if (y < scrollY) {
  	        y = swapY ? r.bottom : scrollY;
  	      }
  	    }
  	    return [x, y];
  	  },
  	  getCenterXY : function(el) {
  	    return Dldh.Css.getAlignToXY(el, document, 'c-c');
  	  },
  	  alignTo : function(el, element, position, offsets, animate) {
  	    var xy = Dldh.Css.getAlignToXY(el, element, position, offsets);
  	    return Dldh.Css.setXY(el, xy, Dldh.preanim(arguments, 3));
  	  },
  	  center : function(el, centerIn) {
  	    return Dldh.Css.alignTo(el, centerIn || document, 'c-c');
  	  },
  	  setSize : function(el, width, height, animate) {
        el = Dldh.getDom(el);
        if(typeof width == 'object') {
          width = width.width;
          height = width.height;
        }
        width = Dldh.Css.adjustWidth(el, width);
        height = Dldh.Css.adjustHeight(el, height);
        if(!animate) {
          el.style.width = Dldh.addUnits(width);
          el.style.height = Dldh.addUnits(height);
        } else {
          /*el.anim({
            width : {
              to : width
            },
            height : {
              to : height
            }
          }, Dldh.preanim(arguments, 2));*/
        }
        return el;
      },
      getHeight : function(el, contentHeight) {
  	    el = Dldh.getDom(el);
  	    var h = el.offsetHeight || 0;
  	    return contentHeight !== true ? h : h - Dldh.Css.getBorderWidth(el, "tb") - Dldh.Css.getPadding(el, "tb");
  	  },
  	  getWidth : function(el, contentWidth) {
  	    el = Dldh.getDom(el);
  	    var w = el.offsetWidth || 0;
  	    return contentWidth !== true ? w : w - Dldh.Css.getBorderWidth(el, "lr") - Dldh.Css.getPadding(el, "lr");
  	  },
  	  setWidth : function(el, width, animate) {
  	    el = Dldh.getDom(el);
  	    width = Dldh.Css.adjustWidth(el, width);
  	    if (!animate) {
  	      el.style.width = Dldh.addUnits(width);
  	    } else {
  	      /*Dldh.lib.Anim.motion(el, {
  	        "width" : {
  	          "to" : 498
  	        },
  	        "height" : {
  	          "to" : 298
  	        }
  	      } , 0.35, "easeOut");*/
  	    }
  	  },
  	  setHeight : function(el, height, animate) {
  	    el = Dldh.getDom(el);
  	    height = Dldh.Css.adjustHeight(el, height);
  	    if (!animate) {
  	      el.style.height = Dldh.addUnits(height);
  	    } else {
  	      /*this.anim({
  	        height : {
  	          to : height
  	        }
  	      }, this.preanim(arguments, 1));*/
  	    }
  	    return this;
  	  },
      getLeft : function(el, local) {
      	el = Dldh.getDom(el);
        if (!local) {
          return Dldh.Css.getX(el);
        } else {
          return parseInt(jQuery(el).css("left"), 10) || 0;
        }
      },
      getRight : function(el, local) {
        if (!local) {
          return Dldh.Css.getX(el) + Dldh.Css.getWidth(el);
        } else {
          return (Dldh.Css.getLeft(el, true) + Dldh.Css.getWidth(el)) || 0;
        }
      },
      getTop : function(el, local) {
      	el = Dldh.getDom(el);
        if (!local) {
          return Dldh.Css.getY(el);
        } else {
          return parseInt(jQuery(el).css("top"), 10) || 0;
        }
      },
      getBottom : function(el, local) {
        if (!local) {
          return Dldh.Css.getY(el) + Dldh.Css.getHeight(el);
        } else {
          return (Dldh.Css.getTop(el, true) + Dldh.Css.getHeight(el)) || 0;
        }
      },
      setLeftTop : function(el, left, top) {
        el = Dldh.getDom(el);
        el.style.left = Dldh.addUnits(left);
        el.style.top = Dldh.addUnits(top);
        return el;
      },
  	  setLeft : function(el, left) {
  	  	el = jQuery(Dldh.getDom(el));
  	    return el.css("left", Dldh.addUnits(left));
  	  },
  	  setTop : function(el, top) {
  	  	el = jQuery(Dldh.getDom(el));
  	    return el.css("top", Dldh.addUnits(top));
  	  },
  	  setRight : function(el, right) {
  	  	el = jQuery(Dldh.getDom(el));
  	    return el.css("right", Dldh.addUnits(right));
  	  },
  	  setBottom : function(el, bottom) {
  	  	el = jQuery(Dldh.getDom(el));
  	    return el.css("bottom", Dldh.addUnits(bottom));
  	  }
    },
    lib : {}
    //util : {}
    //ui : {}
	};
	Dldh.lib.Region = function(G, H, E, F) {
	  this.top = G;
	  this[1] = G;
	  this.right = H;
	  this.bottom = E;
	  this.left = F;
	  this[0] = F;
	};
	Dldh.lib.Region.prototype = {
	  contains : function(E) {
	    return (E.left >= this.left && E.right <= this.right && E.top >= this.top && E.bottom <= this.bottom);
	  },
	  getArea : function() {
	    return ((this.bottom - this.top) * (this.right - this.left));
	  },
	  intersect : function(I) {
	    var G = Math.max(this.top, I.top);
	    var H = Math.min(this.right, I.right);
	    var E = Math.min(this.bottom, I.bottom);
	    var F = Math.max(this.left, I.left);
	    if (E >= G && H >= F) {
	      return new Dldh.lib.Region(G, H, E, F);
	    } else {
	      return null;
	    }
	  },
	  union : function(I) {
	    var G = Math.min(this.top, I.top);
	    var H = Math.max(this.right, I.right);
	    var E = Math.max(this.bottom, I.bottom);
	    var F = Math.min(this.left, I.left);
	    return new Dldh.lib.Region(G, H, E, F);
	  },
	  adjust : function(G, F, E, H) {
	    this.top += G;
	    this.left += F;
	    this.right += H;
	    this.bottom += E;
	    return this;
	  }
	};
	Dldh.lib.Region.getRegion = function(el) {
	  el = Dldh.getDom(el);
	  var J = Dldh.Css.getXY(el);
	  var G = J[1];
	  var I = J[0] + el.offsetWidth;
	  var E = J[1] + el.offsetHeight;
	  var F = J[0];
	  return new Dldh.lib.Region(G, I, E, F);
	}
	Dldh.lib.Point = function(E, F) {
	  if (E instanceof Array) {
	    F = E[1];
	    E = E[0]
	  }
	  this.x = this.right = this.left = this[0] = E;
	  this.y = this.top = this.bottom = this[1] = F
	};
	Dldh.lib.Point.prototype = new Dldh.lib.Region();
	Dldh.DragDrop = function(el, config) {
		if(el) {
	    this.init(el, config);
	  }
	}
	Dldh.DragDrop.prototype = {
		deltaX : 0,
	  deltaY : 0,
	  increaseX : 0,
	  increaseY : 0,
	  startX : 0,
	  startY : 0,
	  startPageX : 0,
	  startPageY : 0,
	  endPageX : 0,
	  endPageY : 0,
	  minX : 0,
	  minY : 0,
	  maxX : 0,
	  maxY : 0,
	  lockX : false,
	  lockY : false,
	  preventDefault : true,
	  stopPropagation : true,
	  clickTimeThresh : 350,
	  clickTimeout : null,
	  locked : false,
	  lock : function() {
	    this.locked = true;
	  },
	  unlock : function() {
	    this.locked = false;
	  },
	  isLocked : function() {
	    return this.locked;
	  },
	  getEl : function() {
	    return this.el;
	  },
	  setEl : function(el) {
	    this.el = Dldh.getDom(el);
	  },
	  getDrag : function() {
	    return this.drag;
	  },
	   setDrag : function(drag) {
	    this.drag = Dldh.getDom(drag);
	  },
	  getHandle : function() {
	    return this.handle;
	  },
	  setHandle : function(handle) {
	  	if(typeof handle == "string" || handle.length === undefined) {
	  		handle = Dldh.getDom(handle);
		    if(!handle) {
		      return;
		    }
	  	}
	    this.removeHandle();
	    if(handle.length) {
	      var r = [], h;
	      for(var i = 0; i < handle.length; i++) {
	        h = Dldh.getDom(handle[i]);
	        r.push(h);
	        jQuery(h).bind("mousedown", {scope : this}, this._handleMouseDown);
	      }
	      return this.handle = r.length == 1 ? r[0] : r;
	    } else {
	    	jQuery(handle).bind("mousedown", {scope : this}, this._handleMouseDown);
	      return this.handle = handle;
	    }
	  },
	  addHandle : function(handle) {
	  	handle = Dldh.getDom(handle);
	  	if(!handle) {
	      return;
	    }
	  	var hs, h;
	  	if(Object.prototype.toString.apply(this.getHandle()) === '[object Array]') {
	  		hs = this.getHandle();
	  	} else {
	  		hs = [this.getHandle()];
	  	}
	  	if(handle.length) {
	  		for(var i = 0; i < handle.length; i++) {
	  			h = Dldh.getDom(handle[i]);
	  			hs.push(h);
	  			jQuery(h).bind("mousedown", {scope : this}, this._handleMouseDown);
	  		}
	    } else {
	    	hs.push(handle);
	      jQuery(handle).bind("mousedown", {scope : this}, this._handleMouseDown);
	    }
	  	return this.handle = hs.length == 1 ? hs[0] : hs;
	  },
	  removeHandle : function() {
	    var handle = this.getHandle();
	    if(handle.length) {
	      for(var i = 0; i < handle.length; i++) {
	      	jQuery(handle[i]).unbind("mousedown", this._handleMouseDown);
	      }
	    } else {
	    	jQuery(handle).unbind("mousedown", this._handleMouseDown);
	    }
	  },
	  setDelta : function(iDeltaX, iDeltaY) {
	    this.deltaX = iDeltaX;
	    this.deltaY = iDeltaY;
	  },
	  proxyId : "ddddddddproxy",
	  resizeProxy : true,
	  createProxy : function(proxy) {
	    var body = document.body;
	    if(typeof proxy === "string") {
	      this.proxyId = proxy;
	    }
	    this.proxy = Dldh.getDom(proxy);
	    if(this.proxy === null || this.proxy === true) {
	      this.proxy = document.createElement("div");
	      this.proxy.id = this.proxyId;
	      this.proxy.className = "cls-dragDrop-proxy";
	      body.insertBefore(this.proxy, body.firstChild);
	    }
	    if(this.resizeProxy) {
	      Dldh.Css.setSize(this.proxy, this.getEl().offsetWidth, this.getEl().offsetHeight);
	    }
	    return this.proxy;
	  },
	  init : function(el, config) {
	  	jQuery.extend(this, config);
	    this.scope = this.scope || this;
	    this.setEl(el);
	    this.setDrag((!!this.proxy) ? this.createProxy(this.proxy) : el);
	    this.setHandle(this.handle ? this.handle : el);
	    this.isTarget = (this.isTarget !== false);
	    if(this.constrain !== false) {
	      this.setConstrain(this.constrain ? this.constrain : document.body);
	    }
	  },
	  setConstrain : function(constain) {
	    this.constain = Dldh.getDom(constain);
	    var b = Dldh.Css.getBox(this.getEl()),
	    xy = Dldh.Css.getXY(this.constain), c;
	    if(this.constain == document.body) {
	      var s = Dldh.Css.getScroll(document.body);
	      c = {
	        x : xy[0],
	        y : xy[1],
	        width : Dldh.Css.getViewWidth(true),
	        height : Dldh.Css.getViewHeight(true)
	      };
	    } else {
	      c = {
	        x : xy[0],
	        y : xy[1],
	        width : this.constain.clientWidth,
	        height : this.constain.clientHeight
	      };
	    }
	    this.minX = c.x + Dldh.Css.getBorderWidth(this.constain, "l");
	    this.minY = c.y + Dldh.Css.getBorderWidth(this.constain, "t");
	    this.maxX = this.minX + c.width - b.width;
	    this.maxY = this.minY + c.height - b.height;
	  },
	  setStartPos : function(pos) {
	    var p = pos || Dldh.Css.getXY(this.getEl());
	    this.startPageX = this.endPageX = p[0];
	    this.startPageY = this.endPageY = p[1];
	    this.setDragPos([this.startPageX, this.startPageY]);
	  },
	  setDragPos : function(pos) {
	    Dldh.Css.setXY(this.getDrag(), pos);
	  },
	  setElPos : function(pos) {
	    Dldh.Css.setXY(this.getEl(), pos);
	  },
	  showDrag : function() {
	    this.getDrag().style.visibility = "visible";
	  },
	  hideDrag : function() {
	    this.getDrag().style.visibility = "hidden";
	  },
	  onMouseDown : function(e) {
	  },
	  onMouseMove : function(e) {
	  },
	  onMouseUp : function(e) {
	  },
	  _handleMouseDown : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.handleMouseDown(e, e.target, {dom : this});
	  	}
	  },
	  _handleMouseMove : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.handleMouseMove(e, e.target, {dom : this});
	  	}
	  },
	  _handleMouseUp : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.handleMouseUp(e, e.target, {dom : this});
	  	}
	  },
	  handleMouseDown : function(e, target, opt) {
	    if(e.button != 0 && e.button != 1) {
	      return;
	    }
	    this.currentHandle = opt.dom;
	    this.setStartPos();
	    this.startX = e.pageX;
	    this.startY = e.pageY;
	    //this.startX = e.pageX || e.getPageX();
	    //this.startY = e.pageY || e.getPageY();
	    this.increaseX = this.startX - this.startPageX;
	    this.increaseY = this.startY - this.startPageY;
	    this.unlock();
	    jQuery(document).bind("mousemove", {scope : this}, this._handleMouseMove);
	    jQuery(document).bind("mouseup", {scope : this}, this._handleMouseUp);
	    var self = this;
	    //this.clickTimeout = setTimeout(function() {
	      //clearTimeout(self.clickTimeout);
	      self.showDrag();
	    //}, this.clickTimeThresh);
	    this.onMouseDown(e, target, opt);
	    this.stopEvent(e);
	  },
	  handleMouseMove : function(e) {
	    if(this.isLocked()) {
	      return;
	    }
	    this.showDrag();
	    this.endX = e.pageX;
	    this.endY = e.pageY;
	    //this.endX = e.pageX || e.getPageX();
	    //this.endY = e.pageY || e.getPageY();
	    this.endPageX = this.endX - this.increaseX;
	    this.endPageY = this.endY - this.increaseY;
	    if(this.constrain !== false) {
	      if(this.endPageX < this.minX) {
	        this.endPageX = this.minX;
	      }
	      if(this.endPageX > this.maxX) {
	        this.endPageX = this.maxX;
	      }
	      if(this.endPageY < this.minY) {
	        this.endPageY = this.minY;
	      }
	      if(this.endPageY > this.maxY) {
	        this.endPageY = this.maxY;
	      }
	    }
	    if(this.lockX) {
	      this.endPageX = this.startPageX;
	    }
	    if(this.lockY) {
	      this.endPageY = this.startPageY;
	    }
	    this.setDragPos([this.endPageX, this.endPageY]);
	    this.onMouseMove(e);
	    this.stopEvent(e);
	  },
	  handleMouseUp : function(e) {
	    clearTimeout(this.clickTimeout);
	    this.lock();
	    if(this.proxy) {
	    	this.hideDrag();
	    }
	    this.setElPos([this.endPageX, this.endPageY]);
	    jQuery(document).unbind("mousemove", this._handleMouseMove);
	    jQuery(document).unbind("mouseup", this._handleMouseUp);
	    this.onMouseUp(e);
	    this.stopEvent(e);
	  },
	  stopEvent : function(e) {
	    if(this.stopPropagation) {
	    	Dldh.stopPropagation(e);
	    }
	    if(this.preventDefault) {
	    	Dldh.preventDefault(e);
	    }
	  }
	};
	Dldh.Resizable = function(el, config) {
	  if(el) {
	    this.init(el, config);
	  }
	}
	Dldh.Resizable.prototype = {
	  shadow: null,
	  proxyBorder : [0, 0],
	  //adjustments : [0, 0],
	  //animate : false,
	  disableTrackOver : false,
	  //draggable : false,
	  //duration : 0.35,
	  //dynamic : false,
	  //easing : "easeOutStrong",
	  enabled : true,
	  handles : false,
	  multiDirectional : false,
	  height : null,
	  width : null,
	  heightIncrement : 0,
	  widthIncrement : 0,
	  minHeight : 5,
	  minWidth : 5,
	  maxHeight : 10000,
	  maxWidth : 10000,
	  minX : 0,
	  minY : 0,
	  pinned : false,
	  preserveRatio : false,
	  resizeChild : false,
	  transparent : false,
	  init : function(el, config) {
	    if(!el) {
	    	return;
	    }
	    jQuery.extend(this, config);
	    el = Dldh.getDom(el);
	    this.el = el;
	    this.$el = jQuery(el);
	    this.shadow = config.shadow;
	    if (this.wrap) {
	    	this.resizeChild = this.el;
	    	this.wrap = document.createElement("div");
	      this.wrap.className = "xresizable-wrap";
	      this.el.parentNode.insertBefore(this.wrap, this.el);
	      this.wrap.appendChild(this.el);
	      this.el.id = this.resizeChild.id + "-rzwrap";
	      this.el.style.overflow = "hidden";
	    }
	    this.proxy = document.createElement("div");
	    this.proxy.id = this.el.id + "-rzproxy";
	    this.proxy.className = "cls-resizable-proxy";
	    this.proxyBorder = [Dldh.Css.getBorderWidth(this.proxy, "lr"), Dldh.Css.getBorderWidth(this.proxy, "tb")];
	    Dldh.Css.unselectable(this.proxy);
	    this.proxy.style.display = "none";
	    document.body.appendChild(this.proxy);
	    this.$proxy = jQuery(this.proxy);
	    if (this.pinned) {
	      this.disableTrackOver = true;
	      this.$el.addClass("cls-resizable-pinned");
	    }
	    var pos = this.$el.css("position");
	    if (pos != "absolute" && pos != "fixed") {
	      this.$el.css("position", "relative");
	    }
	    if (!this.handles) {
	      this.handles = "s,e,se";
	      if (this.multiDirectional) {
	        this.handles += ",n,w";
	      }
	    }
	    if (this.handles == "all") {
	      this.handles = "n s e w ne nw se sw";
	    }
	    var o = this.handles.split(/\s*?[,;]\s*?| /);
	    var c = Dldh.Resizable.positions;
	    for (var j = 0, l = o.length; j < l; j++) {
	      if (o[j] && c[o[j]]) {
	        var n = c[o[j]];
	        this[n] = new Dldh.Resizable.Handle(this, n, this.disableTrackOver, this.transparent, this.handleCls);
	      }
	    }
	    this.corner = this.southeast;
	    if (this.handles.indexOf("n") != -1 || this.handles.indexOf("w") != -1) {
	      this.updateBox = true;
	    }
	    this.activeHandle = null;
	    if (this.width !== null && this.height !== null) {
	      this.resizeTo(this.width, this.height);
	    } else {
	      //this.updateChildSize();
	    }
	    if (Dldh.isIE) {
	      this.el.style.zoom = 1;
	    }
	  },
	  constrain : function(b, c, a, d) {
	    if (b - c < a) {
	      c = b - a;
	    } else {
	      if (b - c > d) {
	        c = b - d;
	      }
	    }
	    return c;
	  },
	  snap : function(c, e, b) {
	    if (!e || !c) {
	      return c
	    }
	    var d = c;
	    var a = c % e;
	    if (a > 0) {
	      if (a > (e / 2)) {
	        d = c + (e - a)
	      } else {
	        d = c - a
	      }
	    }
	    return Math.max(b, d)
	  },
	  resizeElement : function() {
	    var a = Dldh.Css.getBox(this.proxy);
	    if (this.updateBox) {
	      this.$el.css({
		      left : a.x,
		      top : a.y,
		      width : a.width,
		      height : a.height
		    });
	    }
	    if(this.shadow) {
	      this.shadow.realign(Dldh.Css.getX(this.el), Dldh.Css.getY(this.el), Dldh.Css.getWidth(this.el), Dldh.Css.getHeight(this.el));
	    }
	    //this.updateChildSize();
	    if (!this.dynamic) {
	      this.$proxy.hide()
	    }
	    return a;
	  },
	  resizeMove : function(e) {
	    if(this.resizing) {
	      if (this.enabled && this.activeHandle) {
	        try {
	          if (this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
	            return;
	          }
	          var t = this.curSize || this.startBox,
	          l = this.startBox.x,
	          k = this.startBox.y,
	          c = l,
	          b = k,
	          m = t.width,
	          u = t.height,
	          d = m,
	          o = u,
	          n = this.minWidth,
	          A = this.minHeight,
	          s = this.maxWidth,
	          D = this.maxHeight,
	          i = this.widthIncrement,
	          a = this.heightIncrement,
	          B = [e.pageX, e.pageY],
	          r = -(this.startPoint[0] - Math.max(this.minX, B[0])),
	          p = -(this.startPoint[1] - Math.max(this.minY, B[1])),
	          j = this.activeHandle.position, E, g;
	          switch (j) {
	            case "east" :
	              m += r;
	              m = Math.min(Math.max(n, m), s);
	              break;
	            case "south" :
	              u += p;
	              u = Math.min(Math.max(A, u), D);
	              break;
	            case "southeast" :
	              m += r;
	              u += p;
	              m = Math.min(Math.max(n, m), s);
	              u = Math.min(Math.max(A, u), D);
	              break;
	            case "north" :
	              p = this.constrain(u, p, A, D);
	              k += p;
	              u -= p;
	              break;
	            case "west" :
	              r = this.constrain(m, r, n, s);
	              l += r;
	              m -= r;
	              break;
	            case "northeast" :
	              m += r;
	              m = Math.min(Math.max(n, m), s);
	              p = this.constrain(u, p, A, D);
	              k += p;
	              u -= p;
	              break;
	            case "northwest" :
	              r = this.constrain(m, r, n, s);
	              p = this.constrain(u, p, A, D);
	              k += p;
	              u -= p;
	              l += r;
	              m -= r;
	              break;
	            case "southwest" :
	              r = this.constrain(m, r, n, s);
	              u += p;
	              u = Math.min(Math.max(A, u), D);
	              l += r;
	              m -= r;
	              break
	          }
	          var q = this.snap(m, i, n);
	          var C = this.snap(u, a, A);
	          if (q != m || C != u) {
	            switch (j) {
	              case "northeast" :
	                k -= C - u;
	                break;
	              case "north" :
	                k -= C - u;
	                break;
	              case "southwest" :
	                l -= q - m;
	                break;
	              case "west" :
	                l -= q - m;
	                break;
	              case "northwest" :
	                l -= q - m;
	                k -= C - u;
	                break
	            }
	            m = q;
	            u = C
	          }
	          if (this.preserveRatio) {
	            switch (j) {
	              case "southeast" :
	              case "east" :
	                u = o * (m / d);
	                u = Math.min(Math.max(A, u), D);
	                m = d * (u / o);
	                break;
	              case "south" :
	                m = d * (u / o);
	                m = Math.min(Math.max(n, m), s);
	                u = o * (m / d);
	                break;
	              case "northeast" :
	                m = d * (u / o);
	                m = Math.min(Math.max(n, m), s);
	                u = o * (m / d);
	                break;
	              case "north" :
	                E = m;
	                m = d * (u / o);
	                m = Math.min(Math.max(n, m), s);
	                u = o * (m / d);
	                l += (E - m) / 2;
	                break;
	              case "southwest" :
	                u = o * (m / d);
	                u = Math.min(Math.max(A, u), D);
	                E = m;
	                m = d * (u / o);
	                l += E - m;
	                break;
	              case "west" :
	                g = u;
	                u = o * (m / d);
	                u = Math.min(Math.max(A, u), D);
	                k += (g - u) / 2;
	                E = m;
	                m = d * (u / o);
	                l += E - m;
	                break;
	              case "northwest" :
	                E = m;
	                g = u;
	                u = o * (m / d);
	                u = Math.min(Math.max(A, u), D);
	                m = d * (u / o);
	                k += g - u;
	                l += E - m;
	                break
	            }
	          }
	          this.$proxy.width(m - this.proxyBorder[0]);
	          this.$proxy.height(u - this.proxyBorder[1]);
	          Dldh.Css.setXY(this.proxy, [l, k]);
	        } catch (v) {}
	      }
	    }
	  },
	  handleOut : function() {
	    if (!this.resizing) {
	      this.$el.removeClass("cls-resizable-over");
	    }
	    this.afterHandleOut();
	  }
  };
	Dldh.Resizable.positions = {
	  n : "north",
	  s : "south",
	  e : "east",
	  w : "west",
	  se : "southeast",
	  sw : "southwest",
	  nw : "northwest",
	  ne : "northeast"
	};
	Dldh.Resizable.Handle = function(d, g, c, e, a) {
	  this.init(d, g, c, e, a);
	}
	Dldh.Resizable.Handle.prototype = {
	  init : function(rz, pos, c, e, a) {
	    this.position = pos;
	    this.rz = rz;
	    this.el = document.createElement("div");
	    this.el.className = "cls-resizable-handle cls-resizable-handle-" + this.position;
	    rz.el.appendChild(this.el);
	    this.$el = jQuery(this.el);
	    Dldh.Css.unselectable(this.el);
	    if (e) {
	      this.$el.css("opacity", 0);
	    }
	    if (!(a === null || a === undefined || ((a instanceof Array && !a.length)) || (a === ""))) {
	      this.$el.addClass(a);
	    }
	    this.$el.bind("mousedown", {scope: rz, HandleObj: this}, this.onMouseDown);
	  },
	  onMouseDown : function(event) {
	    event.stopPropagation();
	    var o = event.data.scope;
	    o.activeHandle = event.data.HandleObj;
	    if (o.enabled) {
	      if (!o.overlay) {
	      	o.overlay = document.createElement("div");
	      	o.overlay.className = "cls-resizable-overlay";
	      	o.overlay.innerHtml = "&#160;";
	      	document.body.appendChild(o.overlay);
	        Dldh.Css.unselectable(o.overlay);
	      	o.$overlay = jQuery(o.overlay);
	        o.$overlay.css("display", "block");
	        o.$overlay.bind("mousemove", {scope: o}, function(event) {
		        var obj = event.data.scope;
		        obj.resizeMove(event);
		      });
		      o.$overlay.bind("mouseup", {scope: o}, function(event) {
		        var obj = event.data.scope;
		        var a = obj.resizeElement();
		        obj.resizing = false;
		        obj.handleOut();
		        obj.$overlay.css("display", "none");
		        obj.proxy.style.display = "none";
		      });
	      }
	      o.$overlay.css("cursor", o.$el.css("cursor"));
	      o.$overlay.css({
	        display : "block",
	        cursor : o.$el.css("cursor")
	      });
	      o.resizing = true;
	      var oxy = Dldh.Css.getXY(o.el);
	      o.startBox = {
	        x : oxy[0],
	        y : oxy[1],
	        width : Dldh.Css.getWidth(o.el, false),
	        height : Dldh.Css.getHeight(o.el, false)
	      };
	      o.startPoint = [event.pageX, event.pageY];
	      o.$overlay.width(Dldh.Css.getViewWidth(true));
	      o.$overlay.height(Dldh.Css.getViewHeight(true));
	      o.$proxy.css({
	        left : o.startBox.x,
	        top : o.startBox.y,
	        width : o.startBox.width - o.proxyBorder[0],
	        height : o.startBox.height - o.proxyBorder[1],
	        display : "block"
	      });
	    }
	  }
	};
	var Combo = function(el, config) {
	  if(el) {
	    this.init(el, config);
	  }
	}
	Combo.prototype = {
		squ : "",
	  readOnly : true,
	  disabled : false,
	  valueField : "id",
	  displayField : "name",
	  emptyText : "",
	  listEmptyText : "",
	  mode : "local",
	  /*tip : {
	    key : "",
	    value : ""
	  },*/
	  shadowMode : 'frame',
	  shadowOffset : 4,
	  listAlign : 'tl-bl?',
	  height :  250,
	  maxHeight : 250,
	  minHeight : 90,
	  focusClass : "cls-combo-open",
	  loadingText : "Loading...",
	  noDataText : "暂无数据",
	  isClear : false,
	  request : null,
	  isInit : true,
	  isInitList : true,
	  isFirst : true,
	  isFirstExpand : true,
	  isContainMsg : false,
	  isCollapse : function(e, target) {
	  	return true;
	  },
	  init : function(el, config) {
	    this._el = Dldh.getDom(el);
	    if(!this._el) {
	      return;
	    }
	    jQuery.extend(this, config);
	    this.view = [];
	    this.multValue = [];
	    if(!this.wrap) {
	      this.wrap = document.createElement("div");
	      this.wrap.className = "cls-combo-wrap" + (this.disabled ? " disabled" : "");
	      this._el.parentNode.insertBefore(this.wrap, this._el);
	      this.wrap.appendChild(this._el);
	      this.option = document.createElement("option");
	      this.option.text = "";
	      this.option.value = "";
	      this._el.appendChild(this.option);
	      this.$wrap = jQuery(this.wrap);
	    }
	    if(!this.el) {
	      var el = document.createElement("input");
	      if(this.disabled) {
	      	el.disabled = this.disabled;
	      }
	      if(this.readOnly) {
	      	el.readOnly = this.readOnly;
	      }
	      el.type = "text";
	      el.className = "cls-form-field cls-combo";
	      this.wrap.insertBefore(el, this._el);
	      this.setEl(el);

	      this.tl = document.createElement("div");
	      this.tl.className = "cls-combo-tl";
	      this.wrap.insertBefore(this.tl, this._el);
	    }
	    this._el.style.display = "none";
	    var el_jq = jQuery(this.getEl());
	    el_jq.addClass("cls-form-field cls-combo");
	    this.setWidth(this.width);
	    if(!this.trigger) {
	      this.trigger = document.createElement("a");
	      this.trigger.className = "cls-combo-trigger";
	      this.trigger.href = "javascript:;";
	      this.trigger.innerHTML = '<i class="cls-combo-trigger-ico"></i>';
	      this.wrap.appendChild(this.trigger);
	      this.$trigger = jQuery(this.trigger);
	    }
	    if(this.isClear) {
	    	if(!this.clearBtn) {
		      this.clearBtn = document.createElement("a");
		      this.clearBtn.className = "cls-combo-clearBtn";
		      this.clearBtn.href = "javascript:;";
		      this.clearBtn.innerHTML = '×';
		      this.wrap.appendChild(this.clearBtn);
		      var self = this;
		      jQuery(this.clearBtn).bind("click", function() {
		      	self.clearAllMult();
		      });
		    }
	    }
	    /*if(!this.shadow) {
	      this.shadow = new Dldh.Shadow({
	        mode : this.shadowMode,
	        offset : this.shadowOffset
	      });
	    }*/
	    //jQuery(this.trigger).bind("click", {scope : this}, this._onTriggerClick);
	    //jQuery(this.trigger).bind("click", {scope : this}, this._initList);
	    jQuery(this.trigger).bind("click", {scope : this}, this._initList);
	    el_jq.bind("click", {scope : this}, this._initList);
	    //el_jq.bind("blur", {scope : this}, this._onBlur);
	    /*if(!this.enableKeyEvents) {
	    	el_jq.bind("keyup", {scope : this}, this._onKeyUp);
	    }*/
	    /*this.keyNav = new Dldh.KeyNav(this.getEl(), {
	      "up" : function(e) {
	        this.inKeyMode = true;
	        this.selectPrev();
	      },
	      "down" : function(e) {
	        if (!this.isExpanded()) {
	          this.onTriggerClick();
	        } else {
	          this.inKeyMode = true;
	          this.selectNext();
	        }
	      },
	      "enter" : function(e) {
	        this.onViewClick();
	      },
	      "esc" : function(e) {
	        this.collapse();
	      },
	      "tab" : function(e) {
	        this.onViewClick(false);
	        return true;
	      },
	      scope : this,
	      doRelay : function(foo, bar, hname) {
	        if (hname == 'down' || this.scope.isExpanded()) {
	          return Dldh.KeyNav.prototype.doRelay.apply(this, arguments);
	        }
	        return true;
	      },
	      forceKeyDown : true
	    });*/
	    if(!this.mult) {
	    	this.mult = document.createElement("ul");
	    	this.mult.className = "cls-combo-mult";
	    	this.wrap.appendChild(this.mult);
	    	this.$mult = jQuery(this.mult);
	    }
	    if(this.isInitList) {
	    	this.initList();
	    	if(this.list) {
	    		this.list.style.visibility = "hidden";
	    	}
	    }
	    if(this.emptyText.length > 0) {
	      this.showEmptyText();
	    }
	  },
	  clearAllMult : function() {
	  	if(this.multSelect) {
	  		this.multValue = [];
	  		this.mult.innerHTML = "";
	  	} else {
	  		this.setValue("", "");
	  	}
    	if(this.mult) {
    		this.resetMultSize(true);
    	}
	  },
	  initFirstValue : function(fn) {
	  	this.hideMask();
	  	if(!this.isFirst) {
	  		return;
	  	}
	  	this.hideMask();
	  	this.hideNoData();
	  	if(this.data && this.data.length) {
			  this.setValue(this.data[0][this.valueField]);
			} else {
				this.clearAllView();
				this.setValue("", "");
			}
	  	this.isFirst = false;
	  	fn && fn();
	  },
	  setWidth : function(width) {
	  	this.width = width;
	  	Dldh.Css.setWidth(this.wrap, this.width);
	    Dldh.Css.setWidth(this.getEl(), this.width);
	    if(this.list) {
	    	Dldh.Css.setWidth(this.list, this.width);
	    }
	  },
	  _onTriggerClick : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.onTriggerClick(e, e.target);
	  	}
	  },
	  _initList : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.initList(e, e.target);
	  	}
	  },
	  _onBlur : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.onBlur(e, e.target);
	  	}
	  },
	  _onKeyUp : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.onKeyUp(e, e.target);
	  	}
	  },
	  getText : function() {
	  	return this.getRawValue(this.getValue());
	  },
	  getTextByValue : function(value) {
	  	if(this.data) {
	  		var len = this.data.length;
	  		if(len) {
	  			if(this.tip) {
	  				if(value + "" === this.tip.key + "") {
	    				return this.tip.value;
	    			}
	  			}
	  			for(var i=0;i<len;i++) {
	    			if(value + "" === this.data[i][this.valueField] + "") {
	    				return this.data[i][this.displayField] + (this.displayField1 ? this.squ + this.data[i][this.displayField1] : "") || "";
	    			}
	    		}
	  		}
	  	}
	  	return "";
	  },
	  getDataByValue : function(value) {
	  	if(this.data) {
	  		var len = this.data.length;
	  		if(len) {
	  			for(var i=0;i<len;i++) {
	    			if(value + "" === this.data[i][this.valueField] + "") {
	    				return this.data[i];
	    			}
	    		}
	  		}
	  	}
	  	return null;
	  },
	  setEl : function(el) {
	    this.el = Dldh.getDom(el);
	  },
	  getEl : function() {
	    return this.el;
	  },
	  getValue : function() {
	    //return this._el ? this._el.value : null;
	  	if(this.multSelect) {
	  		var r = [];
	  		for(var i = 0; i < this.multValue.length; i++) {
	  			r.push(this.multValue[i][this.valueField]);
	  		}
	  		return r;
	  	}
	    return this._el ? Dldh.getData(this._el) : null;
	  },
	  highSelected : function(value) {
	  	var A = $(this.list).find(".cls-menu-item");
	  	if(A) {
	  		var len = A.length;
	  		if(len) {
	  			for(var i=0;i<len;i++) {
	    			if(value + "" === Dldh.getData(A[i])[this.valueField] + "") {
	    				$(A[i]).addClass("cls-menu-item-active");
	    			}
	    		}
	  		}
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
	  _setValue : function(value, text) {
	  	if(this.multSelect) {
	  		var obj = {};
	  		obj[this.valueField] = value;
	  		obj[this.displayField] = text;
	  		this.addMult(obj);
	  	} else {
	  		if(text === undefined) {
		  		text = this.getTextByValue(value);
		  	}
		    if(this._el) {
		      if(this.option) {
		        this.option.value = value;
		        this.option.text = text;
		      }
		      this._el.value = value;
		      Dldh.setData(this._el, value);
		    }
		    this.setRawValue(text === undefined ? "" : text);
		    this.highSelected(value);
	  	}
	  },
	  setValue : function(value, text, isClick) {
	  	if(this.multSelect) {
	  		var obj = {};
	  		obj[this.valueField] = value;
	  		obj[this.displayField] = text;
	  		this.addMult(obj);
	  	} else {
	  		if(text === undefined) {
		  		text = this.getTextByValue(value);
		  	}
		    if(this._el) {
		      if(this.option) {
		        this.option.value = value;
		        this.option.text = text;
		      }
		      this._el.value = value;
		      Dldh.setData(this._el, value);
		    }
		    this.setRawValue(text === undefined ? "" : text);
		    this.highSelected(value);
		    this.afterSetValue(value, text, isClick);
	  	}
	  },
	  afterSetValue : function(value, text, isClick) {},
	  getRawValue : function() {
	    return this.getEl().value;
	  },
	  setRawValue : function(value) {
	    this.getEl().value = value;
	  },
	  initView : function(data) {
	    if(!data) {
	      return;
	    }
	    this.clearAllView();
	    if(this.tip) {
	      var D = {};
	      D[this.displayField] = this.tip.key;
	      D[this.valueField] = this.tip.value;
	      this.addView(D);
	      this.addLine();
	    }
	    for(var i = 0, len = data.length; i < len; i++) {
	      this.addView(data[i]);
	    }
	  },
	  checkValue : function(v) {
	  	var vs = this.getValue();
	  	if(this.multSelect) {
	  		for(var i = 0; i < vs.length; i++) {
		  		if(v == vs[i]) {
		  			return true;
		  		}
		  	}
	  	} else {
	  		if(v == vs) {
	  			return true;
	  		}
	  	}
	  	return false;
	  },
	  addView : function(data, line) {
	    var item = document.createElement("li");
	    item.className = "cls-menu-list-item";
	    this.inner.appendChild(item);
	    var a = document.createElement("a");
	    a.className = "cls-menu-item cls-menu-check-item" + (this.checkValue(data[this.valueField]) ? " cls-menu-item-active" : "");
	    a.href = "javascript:;";
	    a.title = data[this.displayField] + (this.displayField1 ? this.squ + data[this.displayField1] : "");
	    a.innerHTML = '<span>' + (jQuery.trim(data[this.displayField] + (this.displayField1 ? this.squ + data[this.displayField1] : "")) == "" ? "&#160;" : jQuery.trim(data[this.displayField] + (this.displayField1 ? this.squ + data[this.displayField1] : ""))) + '</span>';
	    item.appendChild(a);
	    Dldh.setData(a, data);
	    jQuery(a).bind("click", {scope : this, item : a}, this._onViewClick);
	  },
	  addLine : function(item) {
	    var sep = document.createElement("li");
	    sep.className = "cls-menu-list-item cls-menu-sep-li";
	    sep.innerHTML = '<span class="cls-menu-sep">&#160;</span>';
	    this.inner.appendChild(sep);
	  },
	  clearAllView : function() {
	    this.inner.innerHTML = "";
	  },
	  _onViewClick : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.onViewClick(e, opt.item);
	  	}
	  },
	  checkMultValue : function(multSelect) {
	  	for(var i = 0; i < this.multValue.length; i++) {
	  		if(this.multValue[i][this.valueField] == multSelect[this.valueField]) {
	  			return true;
	  		}
	  	}
	  	return false;
	  },
	  removeMultValue : function(multSelect) {
	  	var rs = [];
	  	for(var i = 0; i < this.multValue.length; i++) {
	  		if(this.multValue[i][this.valueField] != multSelect[this.valueField]) {
	  			rs.push(this.multValue[i]);
	  		}
	  	}
	  	this.multValue = rs;
	  },
	  removeMult : function(multSelect) {
	  	var multTexts = this.$mult.find(".cls-combo-mult-text");
	  	if(multTexts && multTexts.length) {
	  		for(var i = 0; i < multTexts.length; i++) {
		  		if(multSelect[this.valueField] == jQuery(multTexts[i]).data("data")) {
		  			this.closeMult(multSelect, multTexts[i].parentNode);
		  		}
		  	}
	  	}
	  },
	  addMult : function(multSelect) {
	  	if(this.checkMultValue(multSelect)) {
	  		return;
	  	}
	  	var select = document.createElement("li");
	  	select.className = "cls-combo-multli";
	  	select.title = multSelect[this.displayField] + (this.displayField1 ? this.squ + multSelect[this.displayField1] : "");
	  	this.mult.appendChild(select);
	  	var close = document.createElement("span");
	  	close.className = "cls-combo-mult-close";
	  	close.innerHTML = "×";
	  	select.appendChild(close);
	  	jQuery(close).bind("click", {scope : this, mult : multSelect}, this._handleClose);
	  	var text = document.createElement("span");
	  	text.className = "cls-combo-mult-text";
	  	select.appendChild(text);
	  	text = jQuery(text);
	  	text.text(multSelect[this.displayField] + (this.displayField1 ? this.squ + multSelect[this.displayField1] : ""));
	  	text.data("data", multSelect[this.valueField]);
	  	this.multValue.push(multSelect);
	  	this.resetMultSize();
	  },
	  resetMultSize : function(isReset) {
	  	if(isReset) {
	  		this.wrap.style.height = "auto";
		  	this.el.style.height = "16px";
	  	} else {
	  		this.wrap.style.height = (this.mult.offsetHeight + 4) + "px";
		  	this.el.style.height = this.mult.offsetHeight - 11 + "px";
	  	}
	  },
	  _handleClose : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.dom = this;
    		opt.scope.handleClose(e, e.target, opt);
    	}
    	return false;
    },
    handleClose : function(e, target, opt) {
    	this.closeMult(opt.mult, opt.dom.parentNode);
    },
    closeMult : function(mult, dom) {
    	this.removeMultValue(mult);
    	jQuery(dom).remove();
    	this.resetMultSize();
    },
    getSelectedData : function() {
    	var sd = [], rows = this.$list.find(".cls-menu-item-active");
    	for(var i = 0; i < rows.length; i++) {
    	  sd.push(Dldh.getData(rows[i]));
    	}
    	return sd;
    },
	  onViewClick : function(e, item) {
	  	var D = Dldh.getData(item);
	  	if(this.multSelect) {
	  		/*var G = {};
	  		if(this.displayField1) {
	  			G[this.displayField1] = D[this.displayField1];
	  		}
	  		G[this.displayField] = D[this.displayField];
	  		G[this.valueField] = D[this.valueField];
	  		this.addMult(G);*/
	  		if(Dldh.Css.hasClass(item, "cls-menu-item-active")) {
	  			jQuery(item).removeClass("cls-menu-item-active");
	  		} else {
	  			jQuery(item).addClass("cls-menu-item-active");
	  		}
	  		this.clearAllMult();
	  		var sd = this.getSelectedData();
	  		if(sd && sd.length) {
	  			for(var i = 0; i < sd.length; i++) {
	  				this.addMult(sd[i]);
	  			}
	  		}
	  	} else {
	  		jQuery(item).addClass("cls-menu-item-active");
		    this.setValue(D[this.valueField], D[this.displayField] + (this.displayField1 ? this.squ + D[this.displayField1] : ""), true);
		    this.collapse();
	  	}
	  },
	  onViewOver : function() {
	    jQuery(this).addClass("cls-menu-item-active");
	  },
	  onViewOut : function() {
	  	jQuery(this).removeClass("cls-menu-item-active");
	  },
	  onBlur : function() {
	    if(this.getRawValue() == "") {
	      this.setRawValue(this.emptyText);
	      jQuery(this.getEl()).addClass("cls-form-emptyfield");
	    } else {
	    	jQuery(this.getEl()).removeClass("cls-form-emptyfield");
	    }
	    this.collapse();
	  },
	  showEmptyText : function(D) {
	    /*if(this.getRawValue() == "") {
	      this.setRawValue(this.emptyText);
	      jQuery(this.getEl()).addClass("cls-form-emptyfield");
	    } else {
	    	jQuery(this.getEl()).removeClass("cls-form-emptyfield");
	    }*/
	  	this.getEl().placeholder = this.emptyText;
	  },
	  hideEmptyText : function() {
	    if(this.getRawValue() == this.emptyText) {
	      this.setRawValue("");
	      jQuery(this.getEl()).removeClass("cls-form-emptyfield");
	    }
	  },
	  initList : function() {
	  	if(this.el.disabled || this.disabled) {
	  		return;
	  	}
	  	this.showMask();
	  	this.beforeInitList();
	    this.hideEmptyText();
	    if(this.isExpanded()) {
	      this.collapse();
	    } else {
	    	if(!this.list) {
		      this.list = document.createElement("div");
		      this.list.className = "cls-menu";
		      this.list.style.visibility = "hidden";
		      document.body.appendChild(this.list);
		      this.$list = jQuery(this.list);
		      if(this.isSearch) {
		      	this.searchWrap = document.createElement("div");
			      this.searchWrap.className = "cls-searchWrap";
			      this.list.appendChild(this.searchWrap);
			      this.search = document.createElement("input");
			      this.search.className = "cls-form-field cls-search";
			      this.searchWrap.appendChild(this.search);
			      $(this.search).bind("keyup", {scope : this}, this._onSearch);
		      }
		      if(!this.input) {
		      	this.inputWrap = document.createElement("div");
			      this.inputWrap.className = "cls-menu-inputWrap";
			      this.list.appendChild(this.inputWrap);
			      this.input = document.createElement("input");
			      this.input.className = "cls-form-field cls-menu-input";
			      this.input.placeholder = "Search";
			      this.inputWrap.appendChild(this.input);
			      if(!this.enableKeyEvents) {
				    	$(this.input).bind("keyup", {scope : this}, this._onKeyUp);
				    }
		      }
		      this.mask = document.createElement("div");
		      this.mask.className = "loading-mask";
		      //this.mask.innerHTML = this.loadingText;
		      this.mask.style.display = "none";
		      this.list.appendChild(this.mask);
		      this.noData = document.createElement("div");
		      this.noData.className = "loading-indicator";
		      this.noData.innerHTML = this.noDataText;
		      this.noData.style.display = "none";
		      this.list.appendChild(this.noData);
		      this.inner = document.createElement("ul");
		      this.inner.className = "cls-menu-list scroll";
		      this.list.appendChild(this.inner);
		      Dldh.Css.setWidth(this.list, this.width);
		      if(this.pageView) {
		      	this.pageView.renderTo = document.createElement("div");
		      	this.list.appendChild(this.pageView.renderTo);
		      	this.pageView.param = this.pageView.param || this.param;
		      	this.viewPage = new ViewPage(this.pageView);
		      	this.viewPage.limit.style.display = "none";
		      }
		      if(this.listWidth) {
		      	Dldh.Css.setWidth(this.list, this.listWidth);
		      }
		      this.showMask();
		    }
	    	this.doQuery(this.input ? this.input.value : "");
	      this.afterInitList();
	      if(this.data && this.data.length) {
  				this.hideMask();
  			}
	      //this.doQuery("");
	    }
	    this.isInit = false;
	  },
	  beforeInitList : function() {},
	  afterInitList : function() {},
	  _onSearch : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.onSearch(e, e.target);
	  	}
	  },
	  onSearch : function(e, target) {
	  	if(e.keyCode == 13) {
	  		this.pageView.callback();
	  	}
	  },
	  showMask : function() {
	  	if(this.mask) {
	  		this.mask.style.display = "block";
	  	}
	    /*if(this.mask) {
	      this.mask.style.display = "block";
	      this.expand();
	      this.list.style.height = "";
	      this.inner.style.display = "none";
	      Dldh.Css.alignTo(this.list, this.getEl(), this.listAlign);
	      if(this.shadow) {
	        this.shadow.show(this.list);
	      }
	    }*/
	  },
	  hideMask : function() {
	    if(this.mask) {
	      this.mask.style.display = "none";
	      //this.inner.style.display = "";
	    }
	  },
	  showNoData : function() {
	  	if(this.noData) {
	  		this.noData.style.display = "block";
	  	}
	    /*if(this.mask) {
	      this.mask.style.display = "block";
	      this.expand();
	      this.list.style.height = "";
	      this.inner.style.display = "none";
	      Dldh.Css.alignTo(this.list, this.getEl(), this.listAlign);
	      if(this.shadow) {
	        this.shadow.show(this.list);
	      }
	    }*/
	  },
	  hideNoData : function() {
	    if(this.noData) {
	      this.noData.style.display = "none";
	      //this.inner.style.display = "";
	    }
	  },
	  isExpanded : function() {
	    return this.list && Dldh.Css.isVisible(this.list);
	  },
	  onKeyUp : function(e) {
	    var k = e.keyCode, isSpecialKey = function() {
	      return (e.type == 'keypress' && (e.ctrlKey || e.metaKey)) || k == 9 || k == 13  || k == 40 || k == 27 || (k == 16) || (k == 17) || (k >= 18 && k <= 20) || (k >= 33 && k <= 35) || (k >= 36 && k <= 39) || (k >= 44 && k <= 45);
	    };
	    if(this.editable != false && /*this.readOnly !== true && */(k == 8 || !isSpecialKey(e))) {
	      //this.doQuery(this.getRawValue());
	    	this.doQuery(this.input.value);
	    }
	  },
	  onTriggerClick : function() {
	    if(this.disabled) {
	      return;
	    }
	    /*if(this.isExpanded()) {
	      this.collapse();
	    } else {
	      this.initList();
	      this.doQuery("");
	    }*/
	    this.getEl().focus();
	  },
	  doQuery : function(value, isDisplay) {
	  	/*if(!this.data) {
	  		return;
	  	}*/
	  	if(this.data === undefined) {
	  		this.hideMask();
	  		this.showNoData();
	  		this.onLoad();
	  		return;
	  	}
	  	if(this.data && this.data.length) {
	  		this.hideNoData();
	  	}
	  	//this.hideNoData();
	    //if(this.data) {
	      var g = [];
	      for(var i = 0, len = this.data.length; i < len; i++) {
	        if((this.data[i][this.displayField] + (this.displayField1 ? this.squ + this.data[i][this.displayField1] : "")).toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	          g.push(this.data[i]);
	        }
	      }
	      this.initView(g);
	      //if(g.length > 0) {
	        this.onLoad();
	        if(isDisplay && g.length) {
	        	this.setValue(g[0][this.displayField] + (this.displayField1 ? this.squ + g[0][this.displayField1] : ""));
	        }
	      //} else {
	        //this.collapse();
	      //}
	    //}
	  },
	  onLoad : function() {
	    //if(this.data.length || this.listEmptyText) {
	      this.expand();
	      this.restrictHeight();
	    //} else {
	      //this.collapse();
	    //}
	  },
	  restrictHeight : function(D) {
	    /*this.inner.style.height = "";
	    var pad = Dldh.Css.getPadding(this.list, "tb") + Dldh.Css.getBorderWidth(this.list, "tb"),
	    h = Math.max(this.inner.clientHeight, this.inner.offsetHeight, this.inner.scrollHeight),
	    ha = Dldh.Css.getY(this.getEl()) - Dldh.Css.getScroll(document).top,
	    hb = Dldh.Css.getViewHeight() - ha - Dldh.Css.getHeight(this.getEl()),
	    space = Math.max(ha, hb, this.minHeight || 0) - this.shadowOffset - pad - 5;
	    h = Math.min(h, space, this.maxHeight);
	    Dldh.Css.setHeight(this.inner, h);
	    Dldh.Css.setHeight(this.list, h + pad);
	    Dldh.Css.alignTo(this.list, this.getEl(), this.listAlign);
	    if(this.shadow) {
	      this.shadow.show(this.list);
	    }*/
	  	//Dldh.Css.setHeight(this.list, this.height || Dldh.Css.getHeight(this.list));
	  	if(this.height) {
      	//Dldh.Css.setHeight(this.inner, Math.max(this.inner.clientHeight, this.height));
	  		//if(this.inner.offsetHeight >= this.height) {
	  			//Dldh.Css.setHeight(this.inner, this.height);
	  		//}
	  		this.inner.style.maxHeight = this.height + "px";
      }
	  	if(!this.listWidth) {
	  		this.list.style.width = this.wrap.offsetWidth + "px";
	  	}
	  	Dldh.Css.alignTo(this.list, this.tl, this.listAlign);
	  },
	  expand : function() {
	    if(this.isExpanded() || this._state) {
	      return;
	    }
	    this.beforeExpand();
	    this.list.style.visibility = "visible";
	    /*this.$trigger.removeClass("notrotate");
	    this.$trigger.removeClass("rotate");
	    this.$trigger.addClass("rotate");*/
	    jQuery(document).bind("mousedown", {scope : this}, this._collapseIf);
	    //jQuery(document).bind("mousewheel DOMMouseScroll", {scope : this}, this._collapseIf);
	    if(this.isFirstExpand) {
	    	this.isFirstExpand = false;
	    } else {
	    	if(this.input && this.readOnly) {
		    	this.input.focus();
		    } else {
		    	this.getEl().focus();
		    }
	    }
	    this.afterExpand();
	  },
	  getFirstValue: function() {
	  	return this.data && this.data.length ? this.data[0][this.valueField] : "";
	  },
	  load: function(data) {
	  	this.hideMask();
	  	this.data = data || [];
	  	this._state = true;//为了保持状态，不触发expant
	  	this.doQuery(this.input ? this.input.value : "");
	  	this._state = false;//清除
	  },
	  beforeExpand: function() {},
	  afterExpand: function() {},
	  collapse : function() {
	    if(!this.isExpanded()) {
	      return;
	    }
	    this.list.style.visibility = "hidden";
	    /*this.$trigger.removeClass("rotate");
	    this.$trigger.removeClass("notrotate");
	    this.$trigger.addClass("notrotate");*/
	    if(this.shadow) {
	      this.shadow.hide();
	    }
	    jQuery(document).unbind("mousedown", this._collapseIf);
	    jQuery(document).unbind("mousewheel DOMMouseScroll", this._collapseIf);
	  },
	  _collapseIf : function(e) {
	  	var opt = e.data;
	  	if(opt && opt.scope) {
	  		opt.scope.collapseIf(e, e.target);
	  	}
	  },
	  collapseIf : function(e, target) {
	    if(!this.wrap.contains(target) && !this.list.contains(target) && this.isCollapse(e, target) && this.verifyIsContainMsg(target)) {
	      this.collapse();
	    }
	  },
	  verifyIsContainMsg: function(target) {
	  	if(!this.isContainMsg) {
	  		return true;
	  	}
	  	var arr = $(".modal-box");
	  	if(arr && arr.length) {
	  		for(var i = 0; i < arr.length; i++) {
	  			if(arr[i].contains(target)) {
	  				return false;
	  			}
	  		}
	  	}
	  	return true;
		}
	};
	var ViewPage = function(config) {
	  if(config) {
	    this.init(config);
	  }
	}
	ViewPage.prototype = {
    first : null,
    prev : null,
    next : null,
    last : null,
    totalPageText : null,
    searchText : null,
    searchBtn : null,
    //request : null,
    isDisplayLimit : true,
    innerCls : "cls-navbar cls-grid-pageView",
    limits : [5, 10, 15, 20, 30, 50],
    listAlign : "tl-bl?",
    tp :
    '<div class="cls-nav-contain clearfix">' +
    '<span class="right">' +
    '<span class="total"></span>' +
    '<a href="javascript:void(0);" class="btn limit"><i class="ico"></i></a>' +
    '<a href="javascript:void(0);" class="btn first"><i class="ico"></i></a>' +
    '<a href="javascript:void(0);" class="btn prev"><i class="ico"></i></a>' +
    //'<input class="searchText"/><span class="totelPageText"></span>' +
    '<a href="javascript:void(0);" class="btn next"><i class="ico"></i></a>' +
    '<a href="javascript:void(0);" class="btn last"><i class="ico"></i></a>' +
    '<span class="searchPage"><input class="searchText"/><span class="totelPageText"></span></span>' +
    '<a href="javascript:void(0);" class="btn searchBtn"><i class="ico"></i></a>' +
    '</span>' +
    '</div>',
    key: {
    	offset: 'offset',
    	limit: 'limit'
    },
    init : function(config) {
      jQuery.extend(this, config);
      var self = this;
      self.param[self.key.offset] = self.param[self.key.offset] || 0;
      self.param[self.key.limit] = self.param[self.key.limit] || 20;
      self.currentPage = self.currentPage || 1;
      self.totalPage = self.totalPage || 0;
      self.wrap = Dldh.getDom(self.renderTo);
      var wrap_jp = jQuery(self.wrap);
      self.inner = document.createElement("div");
      self.inner.className = self.innerCls;
      self.wrap.appendChild(self.inner);
      self.inner.innerHTML = self.tp;
      if(!self.limit) {
        self.limit = wrap_jp.find(".limit");
        self.limit.bind("click", {scope : this}, self._handleLimitMenu);
        self.limit = self.limit.get(0);
        if(!this.limitMenu) {
          this.limitMenu = document.createElement("div");
          this.limitMenu.className = "cls-menu cls-menu-bg cls-pageView-menu";
          this.limitMenu.style.visibility = "hidden";
          document.body.appendChild(this.limitMenu);
          this.limitMenuInner = document.createElement("ul");
          this.limitMenuInner.className = "cls-menu-list";
          this.limitMenu.appendChild(this.limitMenuInner);
          this.limitMenuInner.innerHTML = "";
          for(var i = 0, len = this.limits.length; i < len; i++) {
            var item = document.createElement("li");
            item.className = "cls-menu-list-item";
            this.limitMenuInner.appendChild(item);
            var a = document.createElement("a");
            a.className = "cls-menu-item cls-menu-check-item";
            a.href = "javascript:;";
            a.title = jQuery.trim(this.limits[i]);
            Dldh.setData(a, this.limits[i]);
            a.innerHTML = '<span>' + (jQuery.trim(this.limits[i]) == "" ? "&#160;" : jQuery.trim(this.limits[i])) + '</span>';
            item.appendChild(a);
            jQuery(a).bind("click", {scope : this, item : a}, this._onLimitMenuClick);
          }
        }
      }
      if(!self.isDisplayLimit) {
        $(self.limit).unbind("click", self._handleLimitMenu);
        self.limit.style.display = "none";
      }
      if(!self.first) {
        self.first = wrap_jp.find(".first");
        self.first.bind("click", function() {
          self.initPage("first", this, self);
        });
        self.first = self.first.get(0);
      }
      if(!self.prev) {
        self.prev = wrap_jp.find(".prev");
        self.prev.bind("click", function() {
          self.initPage("prev", this, self);
        });
        self.prev = self.prev.get(0);
      }
      if(!self.next) {
        self.next = wrap_jp.find(".next");
        self.next.bind("click", function() {
          self.initPage("next", this, self);
        });
        self.next = self.next.get(0);
      }
      if(!self.last) {
        self.last = wrap_jp.find(".last");
        self.last.bind("click", function() {
          self.initPage("last", this, self);
        });
        self.last = self.last.get(0);
      }
      if(!self.totalPageText) {
        self.totalPageText = wrap_jp.find(".totelPageText");
        self.totalPageText = self.totalPageText.get(0);
      }
      if(!self.searchText) {
        self.searchText = wrap_jp.find(".searchText");
    		/*self.searchText.bind("click", function() {
    		 self.initPage("searchText", this, self);
    		 });*/
        self.searchText.bind("keydown", function(e) {
          if(e.keyCode == 13) {
            self.initPage("search", self.searchBtn, self);
          }
          //return false;
        });
    		/*self.searchText.bind("keyup", function(e) {
    		 Dldh.afterInputNumber(e, this, self.totalPage);
    		 });
    		 self.searchText.bind("blur", function(e) {
    		 Dldh.afterInputNumber(e, this, self.totalPage);
    		 });*/
        self.searchText = self.searchText.get(0);
      }
      if(!self.searchBtn) {
        self.searchBtn = wrap_jp.find(".searchBtn");
        self.searchBtn.bind("click", function() {
          self.initPage("search", this, self);
        });
        self.searchBtn = self.searchBtn.get(0);
      }
      if(!self.total) {
        self.total = wrap_jp.find(".total").get(0);
      }
      this.setLimit(self.param[self.key.limit]);
    },
    _handleLimitMenu : function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.scope.handleLimitMenu(e, e.target);
      }
    },
    handleLimitMenu : function(e, target) {
      this.showLimitMenu(target);
      this.stopEvent(e);
    },
    showLimitMenu : function(target) {
      this.limitMenu.style.visibility = "visible";
      Dldh.Css.alignTo(this.limitMenu, target, this.listAlign);
      jQuery(document).bind("mousedown", {scope : this}, this._collapseIf);
    },
    hideLimitMenu : function() {
      if(this.limitMenu) {
        this.limitMenu.style.visibility = "hidden";
      }
    },
    _collapseIf : function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.scope.collapseIf(e, e.target);
      }
    },
    collapseIf : function(e, target) {
      if(!this.limitMenu.contains(target)) {
        this.hideLimitMenu();
        jQuery(document).unbind("mousedown", this._collapseIf);
      }
    },
    _onLimitMenuClick : function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.scope.onLimitMenuClick(e, e.target, opt);
      }
    },
    onLimitMenuClick : function(e, target, opt) {
      this.setLimit(Dldh.getData(opt.item));
      this.searchText.value = 1;
      this.initPage("search", this.searchBtn, this);
      this.hideLimitMenu();
      this.stopEvent(e);
    },
    stopEvent : function(e) {
      if(this.stopPropagation) {
        Dldh.stopPropagation(e);
      }
      if(this.preventDefault) {
        Dldh.preventDefault(e);
      }
    },
    setLimit : function(n) {
    	this.param[this.key.offset] = 0;
    	this.param[this.key.limit] = n;
      this.limit.innerHTML = "<span class='limitText'>" + n + "条／页</span>";
      if(this.limitMenu) {
        var m = jQuery(this.limitMenu).find(".cls-menu-item");
        for(var i = 0, len = m.length; i < len; i++) {
          if(Dldh.getData(m[i]) == n) {
            jQuery(m[i]).addClass("cls-menu-item-active");
          } else {
            jQuery(m[i]).removeClass("cls-menu-item-active");
          }
        }
      }
    },
    initPage : function(type, target, scope) {
      if(Dldh.Css.hasClass(target, "disabled") || target.disabled) {
        return;
      }
      var is = false, self = scope || this;
      switch (type.toLowerCase()) {
        case "search" :
          var n = self.searchText.value;
          n = parseInt(n, 10);
          if((typeof n === "number" && isFinite(n)) && n > 0 && n <= self.totalPage) {
            self.currentPage = n;
            is = true;
          }
          break;
        case "first" :
          if(self.currentPage > 1) {
            self.currentPage = 1;
            is = true;
          }
          break;
        case "prev" :
          if(self.currentPage > 1) {
            self.currentPage--;
            is = true;
          }
          break;
        case "next" :
          if(self.currentPage < self.totalPage) {
            self.currentPage++;
            is = true;
          }
          break;
        case "last" :
          if(self.currentPage < self.totalPage) {
            self.currentPage = self.totalPage;
            is = true;
          }
          break;
      }
      if(is) {
      	self.param[self.key.offset] = (self.currentPage - 1) * self.param[self.key.limit];
      	self.param[self.key.limit] = self.param[self.key.limit];
    		/*if(scope.mask) {
    		 scope.mask.style.display = "block";
    		 }*/
        self._param = self.param;
        self.callback();
      }
    },
    switchState : function(btn, F) {
      if(!F) {
        btn.disabled = true;
        jQuery(btn).addClass("disabled");
      } else {
        btn.disabled = false;
        jQuery(btn).removeClass("disabled");
      }
    },
    hightPage : function(totalPage) {
      totalPage = parseInt(totalPage, 10);
      if(totalPage <= 0) {
        this.currentPage = 1;
        this.totalPage = 0;
      } else {
        if(this.param[this.key.offset] <= 0) {
          this.currentPage = 1;
        }
        this.totalPage = Math.ceil(totalPage / this.param[this.key.limit]);
      }
      if(this.totalPage <= 1) {
        this.switchState(this.first);
        this.switchState(this.prev);
        this.switchState(this.next);
        this.switchState(this.last);
      } else if(this.currentPage <= 1) {
        this.switchState(this.first);
        this.switchState(this.prev);
        this.switchState(this.next, true);
        this.switchState(this.last, true);
      } else if(this.currentPage >= this.totalPage) {
        this.switchState(this.first, true);
        this.switchState(this.prev, true);
        this.switchState(this.next);
        this.switchState(this.last);
      } else {
        this.switchState(this.first, true);
        this.switchState(this.prev, true);
        this.switchState(this.next, true);
        this.switchState(this.last, true);
      }
      //jQuery(this.searchText).data("data", this.param.offset);
      this._offset = this.param[this.key.offset];
      this.setLimit(this.param[this.key.limit]);
      this.searchText.value = this.currentPage;
      this.totalPageText.innerHTML = " / " + this.totalPage;
      this.total.innerHTML = "共" + totalPage + "记录";
    }
  };
	var Grid = function(config) {
	  if(config) {
	    this.init(config);
	  }
	}
	Grid.prototype = {
	  param : {},
    shadowMode : 'sides',
    shadowOffset : 5,
    listAlign : 'tl-bl?',
    hdCls : 'cls-grid-hd',
    cellCls : 'cls-grid-cell',
    cellOverCls : 'cls-grid-cell-over',
    fisrtCellCls : 'cls-grid-cell-first',
    lastCellCls : 'cls-grid-cell-last',
    RowCls : 'cls-grid-row',
    RowChildCls : 'cls-grid-row-child',
    allSelectCls : "cls-grid-hd-selected",
    rowSelectedCls : "cls-grid-row-selected",
    fisrtRowCls : 'cls-grid-row-first',
    lastRowCls : 'cls-grid-row-last',
    rowOverCls : 'cls-grid-row-over',
    tdCls : 'cls-grid-td',
    checkCls : 'cls-grid-td-checker',
    numberCls : 'cls-grid-td-numberer',
    treeCls : 'cls-grid-td-tree',
    itemCheckedCls : 'cls-menu-item-checked',
    sortClasses : ['cls-grid-sort-asc', 'cls-grid-sort-desc'],
    hdTree : null,
    hdNumber : null,
    hdCheck : null,
    hdTreeWidth : 26,
    hdNumberWidth : 30,
    hdCheckWidth : 30,
    defaultWidth : '',
    scrollOffsetWidth : 20,
    borderWidth : 2,
    isNumber : true,
    number : 0,
    isCheckbox : false,
    exchange : false,
    enableHdMenu : true,
    cmOffsetWidth : 38,
    splitHandleWidth : 5,
    preventDefault : true,
    stopPropagation : true,
    cellRE : /(?:.*?)cls-grid-(?:hd|cell|csplit)-(?:[\d]+)-([\d]+)(?:.*?)/,
  	findRE : /\s?(?:cls-grid-hd|cls-grid-col|cls-grid-csplit)\s/,
  	rowRE : /\s?(?:cls-grid-row)\s/,
  	locked : false,
  	isTree : false,
    lock : function() {
      this.locked = true;
    },
    unlock : function() {
      this.locked = false;
    },
    isLocked : function() {
      return this.locked;
    },
    initRowCallback : function(row) {},
    init : function(config) {
    	jQuery.extend(this, config);
      this.el = Dldh.getDom(this.renderTo);
      var templates = this.templates || {};
      templates.hcell =
        '<div {tooltip} {attr} class="cls-grid-hd-inner cls-grid-hd-{id}" style="{style}">'+
          (this.enableHdMenu ? '<a class="cls-grid-hd-btn" href="javascript:void(0);"></a>' : '') +
          '<a class="cls-grid-hd-custombtn" href="javascript:void(0);"></a>' +
          //'<a class="cls-grid-hd-line" href="javascript:void(0);"></a>' +
          '{value}<span class="cls-grid-sort-icon"></span>' +
        '</div>';
        templates.row =
        '<table class="cls-grid-row-table" border="0" cellpadding="0" cellspacing="0" style="{style}">' +
          '<tbody>' +
            '<tr>' +
            (this.isTree ?
              '<td class="cls-grid-cell ' + this.treeCls + '" style="width: ' + this.hdTreeWidth + 'px;" tabindex="0">' +
    		        '<div class="cls-grid-cell-inner cls-grid-col-tree">&nbsp;</div>' +
    		      '</td>' : '') +
            (this.isNumber ?
              '<td class="cls-grid-cell ' + this.numberCls + '" style="width: ' + this.hdNumberWidth + 'px;" tabindex="0">' +
    		        '<div class="cls-grid-cell-inner cls-grid-col-numberer">{number}</div>' +
    		      '</td>' : '') +
            (this.isCheckbox ?
             '<td class="cls-grid-cell ' + this.checkCls + '" style="width: ' + this.hdCheckWidth + 'px;" tabindex="0">' +
    		        '<div class="cls-grid-cell-inner cls-grid-hd-checker" style="">&nbsp;</div>' +
    		      '</td>' : '') + '{cell}' +
            '</tr>' +
          '</tbody>' +
        '</table><div class="' + this.RowChildCls + ' clearfix">{RowChild}</div>';
        templates.cell =
        '<td class="cls-grid-col cls-grid-cell ' + this.tdCls +  '-{id} {css}" tabIndex="0" title="{title}" {cellAttr} style="{style}">' +
          //'<div class="cls-grid-cell-inner cls-grid-col-{id}" {attr}><pre>{value}</pre></div>' +
          '<div class="cls-grid-cell-inner cls-grid-col-{id}" {attr}>{value}</div>' +
        '</td>';
        templates.master =
        '<div class="cls-grid" hidefocus="true">' +
          '<div class="cls-grid-viewport">' +
            '<div class="cls-grid-header">' +
              '<div class="cls-grid-header-inner">' +
                '<div class="cls-grid-header-offset">' +
                  '<table border="0" cellspacing="0" cellpadding="0">' +
                    '<thead>' +
                      '<tr class="cls-grid-hd-row">' +
                      (this.isTree ?
                        '<td class="cls-grid-cell ' + this.treeCls + '" style="width: ' + this.hdTreeWidth + 'px;">' +
    							        '<div class="cls-grid-hd-inner cls-grid-hd-numberer" style="">&nbsp;</div>' +
    							      '</td>' : '') +
                      (this.isNumber ?
                        '<td class="cls-grid-cell ' + this.numberCls + '" style="width: ' + this.hdNumberWidth + 'px;">' +
    							        '<div class="cls-grid-hd-inner cls-grid-hd-numberer" style="">&nbsp;</div>' +
    							      '</td>' : '') +
                      (this.isCheckbox ?
                        '<td class="cls-grid-cell ' + this.checkCls + '" style="width: ' + this.hdCheckWidth + 'px;">' +
    							        '<div class="cls-grid-hd-inner cls-grid-hd-checker" style="">&nbsp;</div>' +
    							      '</td>' : '') +
                      '</tr>' +
                    '</thead>' +
                  '</table>' +
                '</div>' +
              '</div>' +
              '<div class="cls-clear"></div>' +
            '</div>' +
            '<div class="cls-grid-scroller">' +
              '<div class="cls-grid-body"></div>' +
              '<a href="#" class="cls-grid-focus" tabIndex="-1"></a>' +
              '<div class="cls-grid-loading"></div>' +
            '</div>' +
          '</div>' +
          '<div class="cls-grid-resize-marker">&#160;</div>' +
          '<div class="cls-grid-resize-proxy">&#160;</div>' +
        '</div>';
      this.templates = templates;
      this.el.innerHTML = this.templates.master;
      this.main = this.el.firstChild;
      var A = this.main.childNodes;
      this.mainWrap = A[0];
      this.mask = A[1];
      this.resizeProxy = A[2];
      this.mainHd = this.mainWrap.firstChild;
      this.innerHd = this.mainHd.firstChild;
      this.offsetHd = this.innerHd.firstChild;
      this.tableHd = this.offsetHd.firstChild;
      this.trHd = this.tableHd.firstChild.firstChild;
      this.scroller = this.mainWrap.childNodes[1];
      this.mainBody = this.scroller.firstChild;
      this.renderHeaders();
      this.edit = {};
      this.setSize(this.width, this.height);
      if(this.pageView) {
      	this.pageView.param = this.pageView.param || this.param;
      	this.viewPage = new ViewPage(this.pageView);
      }
      //this.showNoData();
    },
    getColumnCount : function(visibleOnly) {
      var c = 0, length = this.cm.length;
      if (visibleOnly === true) {
        for (var i = 0; i < length; i++) {
          if (!this.isHidden(i)) {
            c++;
          }
        }
        return c;
      }
      return length;
    },
    getIndexById : function(id) {
      for (var i = 0, len = this.cm.length; i < len; i++) {
        if (this.config[i].id == id) {
          return i;
        }
      }
      return -1;
    },
    getColumnId : function(index) {
      return this.cm[index].id;
    },
    getColumnHeader : function(index) {
      return this.cm[index].header;
    },
    getColumnStyle : function(index, isHeader) {
      var style = isHeader ? '' : this.cm[index].css || '', align = this.cm[index].align;
      style += "width:" + Dldh.addUnits(this.getColumnWidth(index)) + ";";
      if (this.isHidden(index)) {
        style += 'display: none; ';
      }
      if (align) {
        style += "text-align:" + align;
      }
      return style;
    },
    setColumnStyle : function(index, style) {
      var align = this.cm[index].align;
      if(this.getColumnWidth(index) !== this.defaultWidth) {
      	style.width = this.getColumnWidth(index) + "px";
      }
      if (this.isHidden(index)) {
        style.display = "none";
      }
      if (align) {
        style.textAlign = align;
      }
      return style;
    },
    isHidden : function(index) {
      return !!this.cm[index].hidden;
    },
    setColumnHidden : function(index, isHidden) {
    	this.cm[index].hidden = isHidden;
    },
    getColumnWidth : function(index) {
      var width = this.cm[index].width;
      if (typeof width != 'number') {
        width = this.defaultWidth;
      }
      return width;
    },
    setColumnWidth : function(index, width) {
    	this.totalWidth = null;
      this.cm[index].width = typeof width != 'number' ? this.defaultWidth : width;
    },
    getColumnTooltip : function(index) {
      return this.cm[index].tooltip;
    },
    getOffsetWidth : function(includeHidden) {
    	return this.getTotalWidth(includeHidden) + this.scrollOffsetWidth;
    },
    getTotalWidth : function(includeHidden) {
    	//if(!this.totalWidth) {
    		this.totalWidth = 0;
    		for(var i = 0, len = this.cm.length; i < len; i++) {
    			if(includeHidden || !this.isHidden(i)) {
    				this.totalWidth += (this.getColumnWidth(i) + Dldh.Css.getBorderWidth(this.getCellByColumnIndex(i), "lr") + Dldh.Css.getPadding(this.getCellByColumnIndex(i), "lr"));
    			}
    		}
    	//}
  		if(this.hdTree) {
    		this.totalWidth += (this.hdTreeWidth + Dldh.Css.getBorderWidth(this.hdTree, "lr") + Dldh.Css.getPadding(this.hdTree, "lr"));
    	}
    	if(this.hdNumber) {
    		this.totalWidth += (this.hdNumberWidth + Dldh.Css.getBorderWidth(this.hdNumber, "lr") + Dldh.Css.getPadding(this.hdNumber, "lr"));
    	}
    	if(this.hdCheck) {
    		this.totalWidth += (this.hdCheckWidth + Dldh.Css.getBorderWidth(this.hdCheck, "lr") + Dldh.Css.getPadding(this.hdCheck, "lr"));
    	}
    	return this.totalWidth;
    },
    setCellColumn : function(hdCell, cm) {
    	hdCell["cm"] = cm;
    },
    getCellColumn : function(hdCell) {
    	return hdCell["cm"];
    },
    getHeaderCell : function(cellIndex) {
    	return this.trHd.childNodes[cellIndex];
    },
    getHeader : function() {
    	return this.trHd.childNodes;
    },
    getCellIndex : function(cell, tds) {
    	var child = tds || this.getHeader();
    	for(var i = 0, len = child.length; i < len; i++) {
    		if(cell == child[i]) {
    			return i;
    		}
    	}
    	return -1;
    },
    getColumnByCellIndex : function(cellIndex) {
    	return this.getCellColumn(this.getHeader()[cellIndex])
    },
    findCellIndex : function(node) {
    	while(node && node != this.mainWrap) {
    		if(this.findRE.test(node.className)) {
    			return this.getCellIndex(node, node.parentNode.childNodes);
    		}
    		node = node.parentNode;
    	}
    	return false;
    },
    getCellByColumnIndex : function(index) {
    	var rs = [], child = this.getHeader();
    	for (var i = 0, len = child.length; i < len; i++) {
    		if(this.findRE.test(child[i].className)) {
    			rs.push(child[i]);
    		}
      }
      return rs[index];
    },
    getColumnIndex : function(hdCell) {
    	var child = this.getHeader();
    	for (var i = 0, index = 0, len = child.length; i < len; i++) {
    		if(this.findRE.test(child[i].className)) {
    			if(child[i] == hdCell) {
    				return index;
    			}
    			index++;
    		}
      }
      return -1;
    },
    updateColumn : function() {
    	var cm = [], child = this.getHeader();
    	for (var i = 0, len = child.length; i < len; i++) {
    		if(this.findRE.test(child[i].className)) {
    			cm.push(this.getCellColumn(child[i]));
    		}
      }
    	if(cm && cm.length) {
    		this.cm = cm;
    	}
      return this.cm;
    },
    replaceDom : function(table, sCellIndex, tCellIdex, isHeadCell) {
  		var d = tCellIdex - sCellIndex,
  		p = table.rows[0],
  		s = p.childNodes[sCellIndex],
  		t = p.childNodes[tCellIdex];
  		if(d < 0) {
        p.insertBefore(s, t);
      } else if(d > 0) {
        if (p.lastChild == t) {
          p.appendChild(s);
        } else {
          p.insertBefore(s, t.nextSibling);
        }
      }
  		if(isHeadCell) {
  			this.updateColumn();
  		}
  	},
  	isResizable : function(hdCell) {
      return this.getCellColumn(hdCell).resizable !== false;
    },
    renderHeaders : function() {
    	//this.tableHd.style.width = this.getTotalWidth() + "px";
      //this.offsetHd.style.width = this.getOffsetWidth() + "px";
    	jQuery(this.trHd).find("." + this.hdCls).remove();
    	var child = this.getHeader(), childCount = child.length;
    	if(childCount) {
    		for(var n = 0; n < childCount; n++) {
    			if(Dldh.Css.hasClass(child[n], this.checkCls)) {
    				if(!this.hdCheck) {
    					this.hdCheck = child[n];
    					jQuery(this.hdCheck).bind("click", {scope : this}, this._onHdCheckbox);
    				}
    			} else if(Dldh.Css.hasClass(child[n], this.numberCls)) {
    				if(!this.hdNumber) {
    					this.hdNumber = child[n];
    				}
    			}
    		}
    	}
      var cm = this.cm, len = cm.length, last = len - 1, cssCls = this.hdCls + ' ' + this.cellCls, cls = cssCls, cell, split = [];
      for(var i = 0; i < len; i++) {
        /*if (i == 0) {
         cls = cssCls + ' ' + this.fisrtCellCls;
        } else {
          cls = (i == last ? cssCls + ' ' + this.lastCellCls : cssCls);
        }*/
        cell = document.createElement("td");
        cell.className = cls + ' ' + this.tdCls + '-' + (this.cm[i]['id'] || '');
        this.setColumnStyle(i, cell.style);
        cell.innerHTML = Dldh.template(this.templates.hcell, {
          id : this.getColumnId(i),
          value : this.getColumnHeader(i) || '&#160;',
          style : '',
          tooltip : '',
          attr : ''
        });
        this.trHd.appendChild(cell);
        this.setCellColumn(cell, this.cm[i]);
        //this.setColumnIndex(cell, i);
        var cell_jq = jQuery(cell);
        cell_jq.bind("mouseover", {scope : this}, this._handleHdOver);
        cell_jq.bind("mousemove", {scope : this}, this._handleHdMove);
        cell_jq.bind("mouseout", {scope : this}, this._handleHdOut);
        cell_jq.bind("mousedown", {scope : this}, this._handleHdDown);
        cell_jq.bind("click", {scope : this}, this._handleHdClick);
        jQuery(cell.firstChild.firstChild).bind("click", {scope : this}, this._handleColumnMenu);
      }
      jQuery(this.scroller).bind("scroll", {scope : this}, this._syncScroll);
      //this.tableHd.style.width = this.getTotalWidth() + "px";
      //this.offsetHd.style.width = this.getOffsetWidth() + "px";
    },
    _handleHdClick : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.cell = this;
    		opt.scope.handleHdClick(e, e.target, opt);
    	}
    },
    handleHdClick : function(e, target, opt) {
    	var cell = opt.cell;
    	if(this.headersDisabled) {
    		return;
    	}
    	this.updateSortIcon(cell);
    },
    updateSortIcon : function(cell) {
    	var column = this.getCellColumn(cell);
    	if(!column.sort) {
    		return;
    	}
    	var is = Dldh.Css.hasClass(cell, this.sortClasses[0]);
    	this.clearHeaderSortState();
    	if(!is) {
    		this.load(this.data.sort(Dldh.arrayObjectSort(column.dataStore, true)));
    		jQuery(cell).addClass(this.sortClasses[0]);
    		jQuery(cell).removeClass(this.sortClasses[1]);
    	} else {
    		this.load(this.data.sort(Dldh.arrayObjectSort(column.dataStore, false)));
    		jQuery(cell).addClass(this.sortClasses[1]);
    		jQuery(cell).removeClass(this.sortClasses[0]);
    	}
    },
    clearHeaderSortState : function() {
    	var hCells = this.getHeader();
    	for(var i = 0; i < hCells.length; i++) {
    		jQuery(hCells[i]).removeClass(this.sortClasses[0]);
    		jQuery(hCells[i]).removeClass(this.sortClasses[1]);
    	}
    },
    updateColumnHidden : function(index, hidden) {
    	var dispaly = "", cell = this.getCellByColumnIndex(index), childIndex = this.getCellIndex(cell), tw = this.getTotalWidth();
    	if(hidden) {
    		dispaly = "none";
    	}
      //this.offsetHd.style.width = this.getOffsetWidth() + "px";
      //this.tableHd.style.width = tw + "px";
      //this.mainBody.style.width = tw + "px";
      cell.style.display = dispaly;
      var rows = this.getRows(), len = rows.length;
    	if(len) {
    		for(var i = 0; i < len; i++) {
    			//rows[i].style.width = tw + "px";
    			if(rows[i].firstChild) {
    				//rows[i].firstChild.style.width = tw + "px";
    				rows[i].firstChild.rows[0].childNodes[childIndex].style.display = dispaly;
    			}
    		}
    	}
    },
    findRow : function(node) {
  		while(node && node != this.mainWrap) {
    		if(this.rowRE.test(node.className)) {
    			return node;
    		}
    		node = node.parentNode;
    	}
    	return false;
  	},
  	showColumnMenu : function(target) {
      if(!this.columnMenu) {
        this.columnMenu = document.createElement("div");
        this.columnMenu.className = "cls-menu cls-menu-bg";
        this.columnMenu.style.visibility = "hidden";
        document.body.appendChild(this.columnMenu);
        this.columnMenuInner = document.createElement("ul");
        this.columnMenuInner.className = "cls-menu-list";
        this.columnMenu.appendChild(this.columnMenuInner);
      }
      this.columnMenuInner.innerHTML = "";
      for(var i = 0, len = this.cm.length; i < len; i++) {
      	if(this.cm[i].width) {
      		var item = document.createElement("li");
          item.className = "cls-menu-list-item" + (this.isHidden(i) ? "" : " " + this.itemCheckedCls);
          this.columnMenuInner.appendChild(item);
          var a = document.createElement("a");
          a.className = "cls-menu-item cls-menu-check-item";
          a.href = "javascript:;";
          a.title = jQuery.trim(this.cm[i].header);
          a.innerHTML = '<div class="cls-menu-item-icon"></div><span>' + (jQuery.trim(this.cm[i].header) == "" ? "&#160;" : jQuery.trim(this.cm[i].header)) + '</span>';
          item.appendChild(a);
          jQuery(a).bind("click", {scope : this, index : i, item : item}, this._onColumnMenuClick);
      	}
      }
      if(!this.columnMenu.shadow) {
      	/*this.columnMenu.shadow = new Dldh.Shadow({
          mode : this.shadowMode,
          offset : this.shadowOffset
        });*/
      }
      this.columnMenu.style.visibility = "visible";
      Dldh.Css.alignTo(this.columnMenu, target, this.listAlign);
      if(this.columnMenu.shadow) {
      	this.columnMenu.shadow.show(this.columnMenu);
      }
      jQuery(document).bind("mousedown", {scope : this}, this._collapseIf);
    },
    hideColumnMenu : function() {
    	if(this.columnMenu) {
    		this.columnMenu.style.visibility = "hidden";
      	if(this.columnMenu.shadow) {
      		this.columnMenu.shadow.hide();
      	}
    	}
    },
    _collapseIf : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.scope.collapseIf(e, e.target);
    	}
    },
    collapseIf : function(e, target) {
      if(!this.columnMenu.contains(target)) {
      	this.hideColumnMenu();
      	jQuery(document).unbind("mousedown", this._collapseIf);
      }
    },
    _onColumnMenuClick : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.scope.onColumnMenuClick(e, e.target, opt);
    	}
    },
    onColumnMenuClick : function(e, target, opt) {
    	var index = opt.index, item = opt.item, isHidden = !this.isHidden(index);
    	if(this.getColumnCount(true) <= 1 && isHidden) {
  			return;
  		}
    	var cell = this.getCellByColumnIndex(index);
    	this.setColumnHidden(index, isHidden);
    	isHidden = this.isHidden(index);
    	if(isHidden) {
    		jQuery(item).removeClass(this.itemCheckedCls);
    	} else {
    		jQuery(item).addClass(this.itemCheckedCls);
    	}
    	this.updateColumnHidden(index, isHidden);
      this.stopEvent(e);
    },
    _handleColumnMenu : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.scope.handleColumnMenu(e, e.target);
    	}
    },
    handleColumnMenu : function(e, target) {
    	this.showColumnMenu(target);
      this.stopEvent(e);
    },
    _onHdCheckbox : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.scope.onHdCheckbox(e, e.target);
    	}
    },
    sethdCheckState : function(is) {
    	if(is) {
    		jQuery(this.hdCheck).addClass(this.allSelectCls);
      } else {
      	jQuery(this.hdCheck).removeClass(this.allSelectCls);
      }
    },
    onHdCheckbox : function(e) {
      var has = Dldh.Css.hasClass(this.hdCheck, this.allSelectCls);
      if(has) {
        jQuery(this.hdCheck).removeClass(this.allSelectCls);
      } else {
      	jQuery(this.hdCheck).addClass(this.allSelectCls);
      }
      this.selectRows(this.getRows(), !has);
      this.stopEvent(e);
      this.beforeOnHdCheckbox(e);
    },
    beforeOnHdCheckbox : function(e) {},
    isRowSelect : function(row) {
    	return Dldh.Css.hasClass(row, this.rowSelectedCls);
    },
    selectRows : function(rows, isSelect) {
      for(var i = 0; i < rows.length; i++) {
        if(isSelect) {
        	jQuery(rows[i]).addClass(this.rowSelectedCls);
        } else {
        	jQuery(rows[i]).removeClass(this.rowSelectedCls);
        }
      }
      if(this.selectRowsFn&&typeof this.selectRowsFn=="function"){
        this.selectRowsFn(this.getSelectedData())
      }
    },
    _handleHdDown : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.cell = this;
    		opt.scope.handleHdDown(e, e.target, opt);
    	}
    },
    _handleHdOver : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.cell = this;
    		opt.scope.handleHdOver(e, e.target, opt);
    	}
    },
    _handleHdOut : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.cell = this;
    		opt.scope.handleHdOut(e, e.target, opt);
    	}
    },
    _handleHdMove : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.cell = this;
    		opt.scope.handleHdMove(e, e.target, opt);
    	}
    },
    handleHdDown : function(e, target, opt) {
      //this.headDrageZone.onMouseDown(e, target, opt);
      //var cell = opt.cell;
      //var hw = this.splitHandleWidth || 5, box = Dldh.Css.getBox(cell), right = box.x + box.width, x = e.getPageX();
    },
    handleHdOver : function(e, target, opt) {
      var cell = opt.cell;
      jQuery(cell).addClass("cls-grid-hd-over");
      var cellInfo = cell.firstChild
      var btn = cellInfo.firstChild;
      btn.style.height = (cellInfo.offsetHeight - 1) + "px";
      this.hoverCell = cell;
    },
    handleHdOut : function(e, target, opt) {
      var cell = opt.cell;
      jQuery(cell).removeClass("cls-grid-hd-over");
      delete this.hoverCell;
    },
    handleHdMove : function(e, target, opt) {
    	if(this.isLocked()) {
    		return;
    	}
    	var cell = opt.cell, self = this;
    	var hw = this.splitHandleWidth,
    	box = Dldh.Css.getBox(cell),
      right = box.x + box.width,
      x = e.pageX,
      cur = "";
    	if(right - x <= hw) {
    		cur = "col-resize";
    		if(!this.resizeProxyDD) {
    			this.resizeProxyDD = new Dldh.DragDrop(this.resizeProxy, {
    				lockY : true,
    				handle : cell,
    				onMouseDown : function(e) {
    					self.headersDisabled = true;
    					self.lock();
    				},
    				onMouseMove : function(e) {
    					self.headersDisabled = true;
    				},
    				onMouseUp : function(e) {
    					self.unlock();
    					self.endSplitMove(this.getHandle(), this.endPageX - this.startPageX);
    					this.hideDrag();
    					setTimeout(function() {
  	        		self.headersDisabled = false;
  						}, 50);
    				}
    			});
    		}
    		this.resizeProxyDD.setHandle(cell);
    		this.resizeProxyDD.setStartPos([right, box.y]);
    		this.resizeProxyDD.minX = box.x + this.cmOffsetWidth;
    		this.resizeProxyDD.getDrag().style.height = Dldh.Css.getHeight(this.el, true) + "px";
    	} else {
    		if(this.getCellColumn(cell)["isMove"] == false) {
    			return;
    		}
    		if(this.resizeProxyDD) {
    			this.resizeProxyDD.removeHandle();
    		}
    		if(x >= box.x && x <= right - Dldh.getDom(jQuery(cell).find(".cls-grid-hd-btn")).offsetWidth - this.splitHandleWidth) {
    			if(!this.columnDragZone) {
    				var proxy = document.createElement("div");
            proxy.className = "cls-dd-drag-proxy";
  	        proxy.innerHTML = '<div class="cls-dd-drop-icon"></div><div class="cls-dd-drag-ghost"></div>';
  	        document.body.appendChild(proxy);
    				this.columnDragZone = new Dldh.DragDrop(proxy, {
  	          //constrain : false,
  	          resizeProxy : false,
  	          proxy : proxy,
  	          //scope : this,
  	          handle : cell,
  	          onMouseDown : function(e, target, opt) {
  	          	if(!this.ghost) {
  			          this.ghost = this.proxy.childNodes[1];
  	          	}
                /*if(!this.shadow) {
  		          	this.shadow = new Dldh.Shadow({
  		          		//mode : "frame",
  		          		offset : 2
  		          	});
  		          }*/
  	          	var clone = this.currentHandle.cloneNode(true);
  	          	this.ghost.innerHTML = clone.innerHTML;
  	          	var xy = [e.pageX, e.pageY];
  	          	var w = Dldh.Css.getViewWidth();
  	          	if((xy[0] + this.getDrag().offsetWidth + 10) >= w) {
  	          		xy[0] = xy[0] - 20 - this.getDrag().offsetWidth;
  	          	}
  		          this.setStartPos([xy[0] + 10, xy[1]]);
  		          this.startX = xy[0];
  		          this.startY = xy[1];
  		          this.increaseX = this.startX - this.startPageX;
  		          this.increaseY = this.startY - this.startPageY;
  		          this.hideDrag();
  		        },
  		        onMouseMove : function(e) {
  		        	var w = Dldh.Css.getViewWidth();
  		        	if((this.endPageX + this.getDrag().offsetWidth + 10) >= w) {
  		        		this.endPageX = this.endPageX - 20 - this.getDrag().offsetWidth;
  		        	}
  		        	this.setStartPos([this.endPageX + 10, this.endPageY]);
  		          self.headersDisabled = true;
  		        	if(this.shadow) {
  		        		this.shadow.show(this.getDrag());
  		        	}
  		        	var drag_jq = jQuery(this.getDrag());
  		        	this.cellIndex = self.findCellIndex(e.target);
  		        	if(this.cellIndex) {
  		        		drag_jq.addClass("cls-dd-drop-ok");
  		        		drag_jq.removeClass("cls-dd-drop-no");
  		        	} else {
  		        		drag_jq.addClass("cls-dd-drop-no");
  		        		drag_jq.removeClass("cls-dd-drop-ok");
  		        	}
  		        },
  		        onMouseUp : function(e) {
  		        	if(this.cellIndex == undefined) {
  		        		return;
  		        	}
  		        	if(this.cellIndex) {
  		        		var sCellIndex = self.findCellIndex(this.currentHandle),
  		        		rows = self.getRows(),
  		        		len = rows.length;
  		        		self.replaceDom(self.tableHd, sCellIndex, this.cellIndex, true);
  		        		if(len) {
  		        			for(var i = 0; i < len; i++) {
  		        				self.replaceDom(rows[i].firstChild, sCellIndex, this.cellIndex);
  			        		}
  		        		}
                  this.hideDrag();
  		        	} else {
  		        		this.showDrag();
  		        		var me = this;
  		        		var xy = Dldh.Css.getXY(this.currentHandle);
  		        		jQuery(this.getDrag()).animate({
  		        			left : xy[0],
  		        			top : xy[1]
  		        		}, 0.35 * 1000, undefined, function() {
  		        			me.hideDrag();
  		        		});
  		        	}
  		        	if(this.shadow) {
  		        		this.shadow.hide();
  		        	}
  		        	delete this.cellIndex;
  		        	setTimeout(function() {
  		        		self.headersDisabled = false;
  							}, 50);
  		        }
  	        });
    			}
    			this.columnDragZone.setHandle(cell);
    		}
    	}
    	cell.style.cursor = cur;
    },
    endSplitMove : function(cell, dx) {
    	var cellIndex = this.getCellIndex(cell);
  		var index = this.getColumnIndex(cell);
      this.setColumnWidth(index, this.getColumnWidth(index) + dx);
      var width = this.getColumnWidth(index);
      if(!width) {
      	return;
      }
      width = Dldh.addUnits(width);
      this.getHeaderCell(cellIndex).style.width = width;
    	var tableWidth = parseInt(this.tableHd.style.width, 10) + dx;
      var offsetWidth = parseInt(this.offsetHd.style.width, 10) + dx;
      //this.tableHd.style.width = tableWidth + "px";
      //this.offsetHd.style.width = offsetWidth + "px";
      var rows = this.getRows();
      for(var i = 0; i < rows.length; i++) {
        //rows[i].style.width = tableWidth + "px";
        //rows[i].firstChild.style.width = tableWidth + "px";
        rows[i].firstChild.rows[0].childNodes[cellIndex].style.width = width;
      }
    },
    setSize : function(width, height) {
      //Dldh.Css.setWidth(this.main, width);
      Dldh.Css.setWidth(this.innerHd, width);
      Dldh.Css.setWidth(this.scroller, width);
      if(typeof height === 'number' && isFinite(height)) {
        //Dldh.Css.setHeight(this.main, height);
        //Dldh.Css.setHeight(this.scroller, height - Dldh.Css.getHeight(this.mainHd));
      	this.scroller.style.maxHeight = (this.scroller, height - Dldh.Css.getHeight(this.mainHd)) + "px";
      }
    },
    createRowChild : function(rowChild, row, ds, cm) {
    	return rowChild.join("");
    },
    doRender : function(data) {
    	if(data && data.length > 0) {
    		this.hideNoData();
    		var totalWidth = this.getTotalWidth(), len = data.length, last = len - 1, count = this.cm.length, cls = this.RowCls, row, cell, valueStr, rowChild;
        for(var i = 0; i < len; i++) {
          row = document.createElement("div");
          row.className = cls;
          cell = [];
          rowChild = [];
          for(var j = 0; j < count; j++) {
          	if(this.cm[j].dataStore) {
          		valueStr = Dldh.htmlEncode(this.cm[j].renderFn ? this.cm[j].renderFn(data[i][this.cm[j].dataStore], data[i], this.groupId + "-row-" + (i + 1), this.cm[j]) : (data[i][this.cm[j].dataStore] === null || data[i][this.cm[j].dataStore] === undefined ? "" : data[i][this.cm[j].dataStore]));
          	} else {
          		valueStr = this.cm[j].renderFn ? this.cm[j].renderFn(data[i][this.cm[j].dataStore], data[i], this.groupId + "-row-" + (i + 1), this.cm[j]) : (data[i][this.cm[j].dataStore] === null || data[i][this.cm[j].dataStore] === undefined ? "" : data[i][this.cm[j].dataStore]);
          	}
            cell.push(Dldh.template(this.templates.cell, {
              id : this.cm[j].id,
              //css : j === 0 ? 'cls-grid-cell-first ' : (j == last ? 'cls-grid-cell-last ' : ''),
              attr : '',
              title : Dldh.htmlEncode(this.cm[j].dataStore ? this.cm[j].renderFn ? valueStr : data[i][this.cm[j].dataStore] : ""),
              cellAttr : '',
              style : this.getColumnStyle(j),
              value : valueStr
            }));
            //if(this.cm[j].type == undefined && this.cm[j].type !== "oper") {
            	//rowChild.push('<div class="cls-form"><label class="cls-form-label">' + this.cm[j].header + '：</label><div class="cls-form-text cls-grid-rowChild-' + this.cm[j].dataStore + '" style="text-align: left;">' + valueStr + '</div></div>');
            //}
          }
          row.innerHTML = Dldh.template(this.templates.row, {
            number : this.getNumber(),
            //style : "width:" + totalWidth + "px",
            RowChild : this.createRowChild(rowChild, this.cm[j], row, data[i]),
            cell : cell.join('')
          });
          this.mainBody.appendChild(row);
          //row.style.width = totalWidth + "px";
          this.initRow(row, data[i]);
          if(this.hdCheck) {
          	jQuery(this.hdCheck).removeClass(this.allSelectCls);
        		//this.selectRows([row], Dldh.Css.hasClass(this.hdCheck, this.allSelectCls));
        	}
          this.initRowCallback(row, data[i]);
        }
    	} else {
    		this.showNoData();
    	}
      if(this.mainBody.offsetHeight == 0 && data.length * 37 > parseInt(this.scroller.style.maxHeight, 10)) {
      	jQuery(this.innerHd).addClass("cls-grid-hd-scrolloffset");
      } else if(this.mainBody.offsetHeight > this.scroller.offsetHeight) {
      	jQuery(this.innerHd).addClass("cls-grid-hd-scrolloffset");
      } else {
      	jQuery(this.innerHd).removeClass("cls-grid-hd-scrolloffset");
      }
    },
    showNoData : function() {
    	this.mainBody.innerHTML = '<div class="cls-grid-empty"><img class="cls-grid-empty-ico"/><span class="cls-grid-empty-text">暂无数据</span></div>';
    },
    hideNoData : function() {
    	$(this.mainBody).find('.cls-grid-empty').remove();
    },
    _onTreeClick : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.dom = this;
    		opt.scope.onTreeClick(e, e.target, opt);
    	}
    },
    onTreeClick : function(e, target, opt) {
    	var isOpen = Dldh.Css.hasClass(target, "cls-menu-item-active");
    	if(isOpen) {
    		jQuery(target).removeClass("cls-menu-item-active");
    		jQuery(opt.row).find("." + this.RowChildCls).css("display", "none");
    	} else {
    		jQuery(target).addClass("cls-menu-item-active");
    		jQuery(opt.row).find("." + this.RowChildCls).css("display", "block");
    	}
    	if(this.mainBody.offsetHeight == 0 && data.length * 37 > parseInt(this.scroller.style.maxHeight, 10)) {
      	jQuery(this.innerHd).addClass("cls-grid-hd-scrolloffset");
      } else if(this.mainBody.offsetHeight > this.scroller.offsetHeight) {
      	jQuery(this.innerHd).addClass("cls-grid-hd-scrolloffset");
      } else {
      	jQuery(this.innerHd).removeClass("cls-grid-hd-scrolloffset");
      }
    	this.afterOnTreeClick(e, target, opt, isOpen);
    	this.stopEvent(e);
    },
    afterOnTreeClick : function(e, target, opt, isOpen) {},
    initRow : function(row, data) {
      Dldh.setData(row, data);
      var row_jq = jQuery(row);
      row_jq.bind("mouseover", {scope : this}, this._onRowOver);
      row_jq.bind("mouseout", {scope : this}, this._onRowOut);
      row_jq.bind("click", {scope : this, row : row}, this._onRowClick);
      row_jq.bind("dblclick", {scope : this, row : row}, this._onRowDblClick);
      if(this.isTree) {
      	//var
      	row_jq.find("." + this.treeCls).bind("click", {scope : this, row : row, data : data}, this._onTreeClick);
      }
      if(this.exchange) {
      	if(!this.rowDragZone) {
  				var self = this, proxy = document.createElement("div");
          proxy.className = "cls-dd-drag-proxy";
          proxy.innerHTML = '<div class="cls-dd-drop-icon"></div><div class="cls-dd-drag-ghost"></div>';
          document.body.appendChild(proxy);
  				this.rowDragZone = new Dldh.DragDrop(proxy, {
            constrain : false,
            resizeProxy : false,
            proxy : proxy,
            //scope : this,
            handle : row,
            onMouseDown : function(e, target, opt) {
            	if(!this.ghost) {
  		          this.ghost = this.proxy.childNodes[1];
            	}
              /*if(!this.shadow) {
  	          	this.shadow = new Dldh.Shadow({
  	          		//mode : "frame",
  	          		offset : 2
  	          	});
  	          }*/
            	var clone = this.currentHandle.cloneNode(true);
            	this.ghost.innerHTML = '<div class="cls-grid-row" style="height: 30px;">' + clone.innerHTML + '</div>';
            	var xy = [e.pageX, e.pageY];
  	          this.setStartPos([xy[0] + 10, xy[1]]);
  	          this.startX = xy[0];
  	          this.startY = xy[1];
  	          this.increaseX = this.startX - this.startPageX;
  	          this.increaseY = this.startY - this.startPageY;
  	          this.hideDrag();
  	        },
  	        onMouseMove : function(e) {
  	        	if(this.shadow) {
  	        		this.shadow.show(this.getDrag());
  	        	}
  	        	var drag_jq = jQuery(this.getDrag());
  	        	this.target = self.findRow(e.target);
  	        	if(this.target) {
  	        		drag_jq.addClass("cls-dd-drop-ok");
  	        		drag_jq.removeClass("cls-dd-drop-no");
  	        	} else {
  	        		drag_jq.addClass("cls-dd-drop-no");
  	        		drag_jq.removeClass("cls-dd-drop-ok");
  	        	}
  	        },
  	        onMouseUp : function(e) {
  	        	if(this.target == undefined) {
  	        		return;
  	        	}
  	        	if(this.target) {
  	        		var d = this.endPageY - this.startPageY,
          			p = this.target.parentNode,
          			s = this.currentHandle,
          			t = this.target;
          			if(d < 0) {
                  p.insertBefore(s, t);
                } else if(d > 0) {
                  if (p.lastChild == t) {
                    p.appendChild(s);
                  } else {
                    p.insertBefore(s, t.nextSibling);
                  }
                }
  	        	} else {
  	        		this.showDrag();
  	        		var me = this;
  	        		var xy = Dldh.Css.getXY(this.currentHandle);
  	        		jQuery(this.getDrag()).animate({
		        			left : xy[0],
		        			top : xy[1]
		        		}, 0.35 * 1000, undefined, function() {
		        			me.hideDrag();
		        		});
  	        	}
  	        	if(this.shadow) {
  	        		this.shadow.hide();
  	        	}
  	        	delete this.target;
  	        }
          });
      	} else {
      		this.rowDragZone.addHandle(row);
      	}
      }
      var tb = row.firstChild, cells = tb.rows[0].childNodes;
      for(var i = 0; i < cells.length; i++) {
      	jQuery(cells[i]).bind("click", {scope : this, row : row}, this._onCellClick);
      }
    },
    getRowData : function(row) {
    	return Dldh.getData(row);
    },
    _editCollapseIf : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.scope.editCollapseIf(e, e.target, opt);
    	}
    },
    editCollapseIf : function(e, target, opt) {
    	if(!this.currentEdit) {
    		return;
    	}
    	if(!this.currentEdit.wrap.contains(target) && !(this.currentEdit.list && this.currentEdit.list.contains(target))) {
    		this.stopEditing();
    		jQuery(document).unbind("mousedown", this._editCollapseIf);
    	}
    },
    stopEditing : function() {
    	for(var n in this.edit) {
    		if(this.edit[n]) {
    			this.edit[n]._hide();
    		}
    	}
    	if(this.currentEdit) {
    		var value = this.currentEdit.getValue();
    		if(this.currentEdit.column.valiFn) {
    			if(!this.currentEdit.column.valiFn(value, this.currentEdit.innerDiv, jQuery(this.currentEdit.row))) {
    				return;
    			}
    		}
    		var value = this.currentEdit.getValue();
    		this.getRowData(this.currentEdit.row)[this.currentEdit.column.dataStore] = value;
    		this.currentEdit.innerDiv.innerHTML = this.currentEdit.getTextByValue(value);
    	}
    },
    setEdit : function(id, el) {
    	this.edit[id] = el;
    },
    getEdit : function(id) {
    	return this.edit[id];
    },
    _onCellClick : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.cell = this;
    		opt.scope.onCellClick(e, e.target, opt);
    	}
    },
    onCellClick : function(e, target, opt) {
      var row = opt.row, cell = opt.cell;
      if(Dldh.Css.hasClass(cell, this.numberCls)) {
        return;
      } else if(Dldh.Css.hasClass(cell, this.checkCls)) {
        this.selectRows([row], !Dldh.Css.hasClass(row, this.rowSelectedCls));
        this.beforeOnHdCheckbox(e);
      } else {
      	var cellIndex = this.getCellIndex(cell, row.firstChild.firstChild.firstChild.childNodes),
      	hCell = this.getHeaderCell(cellIndex),
        currentCm = this.getCellColumn(hCell);
        if(currentCm && currentCm.editType) {
        	var el = this.getEdit(currentCm.dataStore), wrap, type = currentCm.editType.toLowerCase();
        	if(!el) {
        		if(type == "text") {
          		wrap = document.createElement("div");
            	wrap.className = "cls-grid-edit";
            	wrap.style.position = "absolute";
            	this.scroller.appendChild(wrap);
            	el = document.createElement("input");
            	el.className = "cls-form-field";
            	el.type = "text";
          		wrap.appendChild(el);
          		el.el = el;
          		el.wrap = wrap;
          		el.setWidth = function(width) {
          			Dldh.Css.setSize(el, width);
          		}
            	el.setValue = function(value) {
            		el.value = value;
            	}
            	el.getValue = function() {
            		return el.value;
            	}
            	el.getTextByValue = function(value) {
            		return el.value;
            	}
            	el._show = function(config) {
            		wrap.style.display = "block";
            		if(config) {
            			if(config.value === undefined) {
            				this.setValue("");
            			} else {
            				this.setValue(config.value);
            			}
            			if(config.width) {
            				el.setWidth(config.width);
            			}
            			if(config.xy) {
            				Dldh.Css.setXY(wrap, config.xy);
            			}
            		}
            		el.focus();
            	}
            	el._hide = function() {
            		wrap.style.display = "none";
            	}
            	el.collapse = function() {}
          	} else if(type == "combo") {
          		el = document.createElement("select");
            	this.scroller.appendChild(el);
            	el = new Combo(el, {
            		width : cell.offsetWidth,
            		data : currentCm.editData,
            		valueField : 0,
            		displayField : 1,
            		_show : function(config) {
            			this.wrap.style.display = "";
            			if(config) {
              			if(config.value === undefined) {
              				this.setValue("");
              			} else {
              				this.setValue(config.value);
              			}
              			if(config.width) {
              				this.setWidth(config.width);
              			}
              			if(config.xy) {
              				Dldh.Css.setXY(this.wrap, config.xy);
              			}
              			this.list.style.width = "auto";
              		}
              		this.el.focus();
            		},
            		_hide : function() {
            			this.collapse();
            			this.wrap.style.display = "none";
            		}
            	});
            	wrap = el.wrap;
            	wrap.className += " cls-grid-edit";
            	wrap.style.position = "absolute";
            	el.el.readOnly = true;
          	}
          	this.setEdit(currentCm.dataStore, el);
        	}
        	jQuery(document).bind("mousedown", {scope : this}, this._editCollapseIf);
        	el._show({
        		value : Dldh.getData(row)[currentCm.dataStore],
        		width : cell.offsetWidth,
        		xy : Dldh.Css.getXY(cell)
        	});
        	this.currentEdit = el;
        	this.currentEdit.column = currentCm;
        	this.currentEdit.row = row;
        	this.currentEdit.cell = cell;
        	this.currentEdit.innerDiv = cell.firstChild;
        }
        this.afterOnCellClick(e, currentCm, this.getData(row), opt);
      }
      //this.stopEvent(e);
    },
    afterOnCellClick: function(e, cm, ds, opt) {},
    /*onRowCheckbox : function(e, target, opt) {
      var row = opt.dom;
      this.selectRows([row], Dldh.Css.hasClass(row, "cls-grid-row-selected"));
    },*/
    _onRowDblClick : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.row = this;
    		opt.scope.onRowDblClick(e, e.target, opt);
    	}
    },
    onRowDblClick : function(e, target, opt) {
    },
    _onRowClick : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.row = this;
    		opt.scope.onRowClick(e, e.target, opt);
    	}
    },
    onRowClick : function(e, target, opt) {
    },
    _onRowOver : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.row = this;
    		opt.scope.onRowOver(e, e.target, opt);
    	}
    },
    onRowOver : function(e, target, opt) {
      var row = opt.row;
      jQuery(row).addClass(this.rowOverCls);
      this.stopEvent(e);
    },
    _onRowOut : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.row = this;
    		opt.scope.onRowOut(e, e.target, opt);
    	}
    },
    onRowOut : function(e, target, opt) {
      var row = opt.row;
      jQuery(row).removeClass(this.rowOverCls);
      this.stopEvent(e);
    },
    getHoverRow : function() {
      return this.hoverRow;
    },
    getCurrentData : function() {
    	var sd = [], rows = this.getRows();
    	for(var i = 0; i < rows.length; i++) {
    		sd.push(Dldh.getData(rows[i]));
    	}
    	return sd;
    },
    getSelected : function() {
    	return jQuery(this.mainBody).find("." + this.rowSelectedCls);
    },
    isSelected : function(row) {
    	return Dldh.Css.hasClass(row, this.rowSelectedCls);
    },
    getSelectedData : function() {  //getSelectedData(),用来获取列表别选中行的数据
    	var sd = [], rows = this.getRows();
    	for(var i = 0; i < rows.length; i++) {
    		if(Dldh.Css.hasClass(rows[i], this.rowSelectedCls)) {
    			sd.push(Dldh.getData(rows[i]));
    		}
    	}
    	return sd;
    },
    getAllData : function() {  //getSelectedData(),用来获取列表别选中行的数据
    	var sd = [], rows = this.getRows();
    	for(var i = 0; i < rows.length; i++) {
    	  sd.push(Dldh.getData(rows[i]));
    	}
    	return sd;
    },
    setData : function(rows, data) {
	    Dldh.setData(rows, data);
	  },
	  getData : function(rows) {
	  	return Dldh.getData(rows);
	  },
    getNumber : function() {
    	return ++this.number;
    },
    resetNumber : function() {
    	this.number = 0;
    },
    clearData : function() {
    	this.resetNumber();
    	this.clearHeaderSortState();
    	this.mainBody.innerHTML = "";
    },
    load : function(data, totalPage) {
    	if(this.mask) {
    		this.mask.style.display = "none";
  		}
    	if(totalPage !== undefined && this.pageView) {
    		this.viewPage.hightPage(totalPage);
    	}
      if(data) {
        this.data = data;
      }
      this.clearData();
      this.doRender(this.data);
    },
    getRows : function() {
      return this.hasRows() ? this.mainBody.childNodes : [];
    },
    hasRows : function() {
      var A = this.mainBody.firstChild;
      return A && A.className != "cls-grid-empty";
    },
    addRow : function(rowData) {
    	var len = this.cm.length, value;
    	if(!rowData) {
    		rowData = {};
    		for(var i = 0; i < len; i++) {
      		rowData[this.cm[i].dataStore] = this.cm[i].insertValue || '';
      		//if(this.cm[i].renderFn) {
      			//this.cm[i].renderFn(rowData[this.cm[i].dataStore], rowData);
      		//}
      	}
    	}
    	this.doRender([rowData]);
    },
    deleteRow : function(row) {
    	var selectedRows;
    	if(row && !row.length) {
    	  selectedRows = [row];
    	} else {
    		selectedRows = jQuery(this.mainBody).find("." + this.rowSelectedCls);
    	}
    	for(var i = 0; i < selectedRows.length; i++) {
    		jQuery(selectedRows[i]).remove();
    	}
    	if(this.mainBody.offsetHeight == 0 && this.getRows().length * 37 > parseInt(this.scroller.style.maxHeight, 10)) {
      	jQuery(this.innerHd).addClass("cls-grid-hd-scrolloffset");
      } else if(this.mainBody.offsetHeight > this.scroller.offsetHeight) {
      	jQuery(this.innerHd).addClass("cls-grid-hd-scrolloffset");
      } else {
      	jQuery(this.innerHd).removeClass("cls-grid-hd-scrolloffset");
      }
    },
    _syncScroll : function(e) {
    	var opt = e.data;
    	if(opt && opt.scope) {
    		opt.scope.syncScroll(e, e.target);
    	}
    },
    syncScroll : function() {
      this.syncHeaderScroll();
    },
    syncHeaderScroll : function() {
      this.innerHd.scrollLeft = this.scroller.scrollLeft;
    },
    stopEvent : function(e) {
      if(this.stopPropagation) {
      	Dldh.stopPropagation(e);
      }
      if(this.preventDefault) {
      	Dldh.preventDefault(e);
      }
    }
	};
	if(DBapp) {
		jQuery.extend(DBapp, Dldh);
		DBapp.ui.Combo = Combo;
		DBapp.ui.ViewPage = ViewPage;
		DBapp.ui.Grid = Grid;
		//alert(DBapp.DragDrop);
		//DBapp = Dldh;
	}
})();
(function() {
	var Loading = function(config) {
		this.init(config);
	};
	Loading.prototype = {
	  init : function(config) {
	  	this.renderTo = document.body;
	  	jQuery.extend(this, config);
	  	if(!this.el) {
	  		this.el = document.createElement("div");
	  		this.el.className = "loading";
	  		this.el.innerHTML = '<div class="bar-wrap"><div class="bar"><div class="shadow"></div></div><div class="bar-text"></div></div>';
	  		this.renderTo.appendChild(this.el);
	  		this.bar = this.el.firstChild.firstChild;
	  		this.$bar = jQuery(this.bar);
	  	}
	  	this.content = $(this.el).find(".bar-text").get(0);
	  	this.setMsg(this.msg);
	  	this.hide(true);
	  },
	  setMsg : function(msg) {
	  	this.content.innerHTML = msg || "";
	  },
	  show : function() {
	  	this.clear();
	  	this.$bar.addClass("start");
	  	this.el.style.display = "block";
	  },
	  hide : function(D) {
	  	if(D) {
	  		this.el.style.display = "none";
	  	} else {
	  		this.$bar.addClass("end");
	  		var self = this;
	  		self.clickTimeout = setTimeout(function() {
	  			clearTimeout(self.clickTimeout);
	  			self.el.style.display = "none";
	      }, 1000);
	  	}
	  },
	  clear : function() {
	  	this.$bar.removeClass("start");
	  	this.$bar.removeClass("end");
	  }
	};
	DBapp.ui.Loading = Loading;
})();
(function() {
	var PageView = function(D) {
		this.init(D);
	}
	PageView.prototype = {
	  clearfixCls : "clearfix",
	  cls : "cls-pageView",
	  mainCls : "cls-pageView-main",
		max : 6,
	  curPage : 1,
	  limit : 20,
	  total : 0,
	  ellipse : 2,
	  ellipseText : "...",
	  prevText : "上一页",
	  nextText : "下一页",
	  load : function() {
	  	this.main.innerHTML = "";
			this.totalPage = Math.ceil(this.total / this.limit);
			var ne_half = Math.ceil(this.max / 2);
			var upper_limit = this.totalPage - this.max;
			var start = this.curPage > ne_half ? Math.max(Math.min(this.curPage - ne_half, upper_limit), 0) : 0;
			var end = this.curPage > ne_half ? Math.min(this.curPage + ne_half, this.totalPage) : Math.min(this.max, this.totalPage);
	    this.interval = [start, end];
			if(this.prevText) {
				this.add(this.curPage - 2,{
					scope : this,
					text : this.prevText,
					cls : "prev",
					isCurrent : this.curPage <= 0 ? true : false
			  });
			}
			if (this.interval[0] > 0 && this.ellipse > 0) {
				var end = Math.min(this.ellipse, this.interval[0]);
				for(var i=0;i<end;i++) {
					this.add(i, {scope : this});
				}
				if(this.ellipse < this.interval[0] && this.ellipseText) {
					var lnk = document.createElement("span");
					lnk.className = "ellipse";
					lnk.innerHTML = this.ellipseText;
					this.main.appendChild(lnk);
				}
			}
			for(var i=this.interval[0];i<this.interval[1];i++) {
				this.add(i, {scope : this});
			}
			if (this.interval[1] < this.totalPage && this.ellipse > 0) {
				if(this.totalPage - this.ellipse > this.interval[1] && this.ellipseText) {
					var lnk = document.createElement("span");
					lnk.innerHTML = this.ellipseText;
					this.main.appendChild(lnk);
				}
				var begin = Math.max(this.totalPage - this.ellipse, this.interval[1]);
				for(var i=begin;i<this.totalPage;i++) {
					this.add(i, {scope : this});
				}
			}
			if(this.nextText) {
				this.add(this.curPage, {
					scope : this,
					text : this.nextText,
					cls : "next",
					isCurrent : this.curPage >= this.totalPage ? true : false
				});
			}
		},
		init : function(config) {
	    if(!config) {
	    	return null;
	    }
	    jQuery.extend(this, config);
	    var F = this.renderTo.get ? this.renderTo.get(0) : (typeof this.renderTo == "string" ? document.getElementById(this.renderTo) : this.renderTo);
	    if(this.el) {
	      F.removeChild(this.el);
	    }
	  	this.el = document.createElement("div");
	  	this.el.className = this.cls;
	  	if(this.width) {
	  		this.el.style.width = this.width + "px";
	  	}
	  	F.appendChild(this.el);
	  	this.main = document.createElement("div");
	  	this.main.className = this.mainCls + " " + this.clearfixCls;
	  	this.el.appendChild(this.main);
	    //D.max && (this.max = D.max);
	    //D.curPage && (this.curPage = D.curPage);
	    //D.limit && (this.limit = D.limit);
	    //D.ellipse && (this.ellipse = D.ellipse);
	    //D.ellipseText && (this.ellipseText = D.ellipseText);
	    //D.prevText && (this.prevText = D.prevText);
	    //D.nextText && (this.nextText = D.nextText);
	    //this.load();
	  },
	  add : function(pageId, D) {
	  	var pageId = pageId < 0 ? 0 : (pageId < D.scope.totalPage ? pageId : D.scope.totalPage - 1);
	  	if(!D.text) {
	  		D.text = pageId + 1;
	    }
			if(pageId + 1 == D.scope.curPage || D.isCurrent) {
				var lnk = document.createElement("span");
				lnk.className = "current";
				lnk.innerHTML = D.text;
			} else {
				var lnk = document.createElement("a");
				lnk.href = "javascript:void(0)";
				lnk.innerHTML = D.text;
				lnk.onclick = function() {
					D.scope.curPage = pageId + 1;
					D.scope.pageSelected(D.scope.curPage, D.scope);
			  }
			}
			D.scope.main.appendChild(lnk);
	  },
	  callback : function(curPage, scope) {
	  	scope.load();
	  },
	  pageSelected : function(pageId, o) {
	  	o.curPage = pageId;
			o.init(o);
			o.callback(o.curPage, o);
		}
		/*
		pageSelected : function(pageId, o) {
	  	o.curPage = pageId;
			o.init(o);
			o.callback(o.curPage, o);
		},
		selectPage : function(pageId) {
	  	this.pageSelected(pageId, this);
	  },
	  prevPage : function() {
	  	if (this.curPage > 0) {
				pageSelected(this.curPage - 1, this);
				return true;
			} else {
				return false;
			}
	  },
	  nextPage : function() {
			if(this.curPage < this.totalPage - 1) {
				pageSelected(this.curPage + 1, this);
				return true;
			} else {
				return false;
			}
		}
		*/
	}
	DBapp.ui.PageView = PageView;
})();
(function() {
	var Tip = function(config) {
		this.init(config);
	};
	Tip.prototype = {
	  position : "top",
		distance : 10,
		msg : "",
    type: "tip", // 'tip'||box
		timeout : false,
	  init : function(config) {
	  	jQuery.extend(this, config);
	  	var self = this;
	    if(!this.obj) {
	    	this.obj = document.createElement("div");
	    	this.obj.className = "tip" + (config && config.type ? " tip-"+config.type : "");
	    	document.body.appendChild(this.obj);
	    	this.obj = jQuery(this.obj);
	    }
	    this.hide();
	  },
	  setMsg : function(msg) {
	  	if(msg) {
	  		this.msg = msg;
	  	}
	  	this.obj.html('<div class="con">' + this.msg + '</div><span class=" ' + this.position + '"></span>');
	  },
    setContent : function(el,msg) {
      if(msg) {
        this.msg = msg;
      }
      this.obj.html('<div class="con" tip="'+el+'">' + this.msg + '<div class="tip-btn-wrap">' +
        '<button class="ah-btn ah-btn-blue ah-btn-small tip-ok">确定</button>' +
        '<button class="ah-btn ah-btn-white ah-btn-small tip-cancle">取消</button>' +
        '</div></div><span class="' + this.position + '"></span>');
    },
    handle: function(el,callback){
      var self = this;
      self.el = $('.tip .con').attr('tip',el);
      self.el.find('.tip-ok').click(function(){
        self.hide();
        callback();
      })
      self.el.find('.tip-cancle').click(function(){
        self.hide();
        return false;
      })
    },
    hoverTip: function(el,config){
      var self = this;
      self.el = jQuery(el);
      self.el.hover(function(){
        self.show(el,config)
      },function(){
        self.hide()
      })
    },
    clickTip: function(el,config){
      var self = this;
      self.el = jQuery(el);
      self.el.click(function(){
        self.show(el,config)
      })
      $(document).click(function(e){
        self.hide();
        e.stopPropagation();
      })

    },
	  show : function(el, config) {
	  	var self = this;
	  	self.el = jQuery(el);
      self.position = config.position||'top';
      self.type = config.type || 'tip'
      switch(self.type){
        case 'tip':
          self.setMsg(config.msg);
          break;
        case 'box':
          self.setContent(el,config.msg);
          break;
      }
	  	self.setPosition();
	  	self.obj.css("display", "");
	  	/*if(self.timeout) {
	  		self.setTimeout = setTimeout(function() {
	  			clearTimeout(self.setTimeout);
	  			self.hide();
	  		}, self.timeout);
	  	}*/
	  },
	  hide : function() {
	  	this.obj.css("display", "none");
	  },
    confirm : function(el, config, fn) {
      this.show(el,config);
      this.handle(el,fn)
    },
	  setPosition : function() {
			var setPos = {};
			var pos = {
				x : this.el.offset().left,
				y : this.el.offset().top
			};
			var wh = {
				w : this.el.outerWidth(),
				h : this.el.outerHeight()
			};
			var rightTmp = (pos.x + wh.w / 2) + this.obj.outerWidth() / 2;
			var leftTmp = (pos.x + wh.w / 2) - this.obj.outerWidth() / 2;
			switch (this.position) {
				case 'top':
					if (rightTmp > $(window).width()) {
						setPos = {
							x : pos.x + wh.w - this.obj.outerWidth(),
							y : pos.y - this.obj.outerHeight() - this.distance
						};
						this.obj.find("." + this.position).css("left", this.obj.outerWidth() - wh.w / 2 + "px");
					} else if (leftTmp < 0) {
						setPos = {
							x : pos.x,
							y : pos.y - this.obj.outerHeight() - this.distance
						};
						this.obj.find("." + this.position).css("left", wh.w / 2 + "px");
					} else {
						setPos = {
							x : pos.x - (this.obj.outerWidth() - wh.w) / 2,
							y : pos.y - this.obj.outerHeight() - this.distance
						};
					}
					//this.obj.addClass('animated flipInTop');
					this.obj.addClass('animated moveTop');
					break;
				case 'bottom':
					if (rightTmp > $(window).width()) {
						setPos = {
							x : pos.x + wh.w - this.obj.outerWidth(),
							y : pos.y + wh.h + this.distance
						};
						this.obj.find("." + this.position).css("left", this.obj.outerWidth() - wh.w / 2 + "px");
					} else if (leftTmp < 0) {
						setPos = {
							x : pos.x,
							y : pos.y + wh.h + this.distance
						};
						this.obj.find("." + this.positon).css("left", wh.w / 2 + "px");
					} else {
						setPos = {
							x : pos.x - (this.obj.outerWidth() - wh.w) / 2,
							y : pos.y + wh.h + this.distance
						};
					}
					//this.obj.addClass('animated flipInBottom');
					this.obj.addClass('animated moveBottom');
					break;
				case 'left':
					setPos = {
						x : pos.x - this.obj.outerWidth() - this.distance,
						y : pos.y - (this.obj.outerHeight() - wh.h) / 2
					};
					//this.obj.addClass('animated flipInLeft');
					this.obj.addClass('animated moveLeft');
					break;
				case 'right':
					setPos = {
						x : pos.x + wh.w + this.distance,
						y : pos.y - (this.obj.outerHeight() - wh.h) / 2
					};
					//this.obj.addClass('animated flipInRight');
					this.obj.addClass('animated moveRight');
					break;
			}
			this.obj.css({
				"left" : setPos.x + "px",
				"top" : setPos.y + "px"
			});
			//this.obj.addClass('animated fadeIn');
		}
	};
	DBapp.ui.Tip = Tip;
	var msg = function(el, msg, config) {
		var el = jQuery(el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el));
		msg = msg || "";
		var position = config && config.position || "right";
  	var distance = config && config.distance || 10;
  	var timeout = config && config.timeout || 3000;
		var obj = document.createElement("div");
    obj.className = "tip" + (config && config.type ? " " + config.type : "");
    obj.innerHTML = '<div class="con">' + msg + '</div><span class="' + position + '"></span>';
    document.body.appendChild(obj);
    obj = jQuery(obj);
    var setPos = {},
  	pos = {
			x : el.offset().left,
			y : el.offset().top
		},
		wh = {
			w : el.outerWidth(),
			h : el.outerHeight()
		},
		rightTmp = (pos.x + wh.w / 2) + obj.outerWidth() / 2,
		leftTmp = (pos.x + wh.w / 2) - obj.outerWidth() / 2;
		switch (position) {
			case 'top':
				if (rightTmp > $(window).width()) {
					setPos = {
						x : pos.x + wh.w - obj.outerWidth(),
						y : pos.y - obj.outerHeight() - distance
					};
					obj.find("." + position).css("left", obj.outerWidth() - wh.w / 2 + "px");
				} else if (leftTmp < 0) {
					setPos = {
						x : pos.x,
						y : pos.y - obj.outerHeight() - distance
					};
					obj.find("." + position).css("left", wh.w / 2 + "px");
				} else {
					setPos = {
						x : pos.x - (obj.outerWidth() - wh.w) / 2,
						y : pos.y - obj.outerHeight() - distance
					};
				}
				//obj.addClass('animated flipInTop');
				obj.addClass('animated moveTop');
				break;
			case 'bottom':
				if (rightTmp > $(window).width()) {
					setPos = {
						x : pos.x + wh.w - obj.outerWidth(),
						y : pos.y + wh.h + distance
					};
					obj.find("." + position).css("left", obj.outerWidth() - wh.w / 2 + "px");
				} else if (leftTmp < 0) {
					setPos = {
						x : pos.x,
						y : pos.y + wh.h + distance
					};
					obj.find("." + positon).css("left", wh.w / 2 + "px");
				} else {
					setPos = {
						x : pos.x - (obj.outerWidth() - wh.w) / 2,
						y : pos.y + wh.h + distance
					};
				}
				//obj.addClass('animated flipInBottom');
				obj.addClass('animated moveBottom');
				break;
			case 'left':
				setPos = {
					x : pos.x - obj.outerWidth() - distance,
					y : pos.y - (obj.outerHeight() - wh.h) / 2
				};
				//obj.addClass('animated flipInLeft');
				obj.addClass('animated moveLeft');
				break;
			case 'right':
				setPos = {
					x : pos.x + wh.w + distance,
					y : pos.y - (obj.outerHeight() - wh.h) / 2
				};
				//obj.addClass('animated flipInRight');
				obj.addClass('animated moveRight');
				break;
		}
		obj.css({
			"left" : setPos.x + "px",
			"top" : setPos.y + "px"
		});
		//obj.addClass('animated fadeIn');
		setTimeout(function() {
			obj.remove();
		}, timeout);
		el.focus();
	};
	DBapp.ui.msg = msg;
	DBapp.ui.error = function(el, msg, config) {
		config = config || {};
		config.type = "error";
		DBapp.ui.msg(el, msg, config);
	};
	var noty = function(msg, config) {
    var type = config && config.type ? config.type : "success";
    if($('.notiser')&&$('.notiser').length){
      $('.notiser').remove()
    }
		var timeout = config && config.timeout ? config.timeout : 2000;
		var notiserElement = $(document.createElement('div')).addClass('notiser ' + type).append("<span>"+msg+"</span>");
		notiserElement.css("zIndex", ++DBapp.zIndex);
		notiserElement.prependTo($(document.body)).hide().slideDown();
		setTimeout(function() {
			notiserElement.fadeOut(function() {
				this.remove();
			});
		}, timeout);
	};
	DBapp.ui.success = noty;
	DBapp.ui.fail = function(msg, config) {
		config = config || {};
		config.type = "error";
		DBapp.ui.success(msg, config);
	};
	DBapp.ui.warn = function(msg, config) {
		config = config || {};
		config.type = "warning";
		DBapp.ui.success(msg, config);
	};
})();
(function() {
	var Waterfall = function(D) {
		this.init(D);
	}
	Waterfall.prototype = {
		wrapWidth : 960,
		width : 200,
		splitWidth : 0,
		paddingWidth : 0,
		borderWidth : 1,
		sum : 0,
		limit : 20,
		cm : [],
		data : [],
		cols : 1,
		rowSelectedClass : "cls-waterfall-selected",
		cls : "cls-waterfall",
		mainCls : "cls-waterfall-main",
		ulCls : "cls-waterfall-ul",
		liCls : "cls-waterfall-li",
		liOverCls : "cls-waterfall-li-over",
		picCls : "cls-waterfall-pic",
		titleCls : "cls-waterfall-title",
		descCls : "cls-waterfall-desc",
		btnCls : "cls-waterfall-btn",
		splitCls : "cls-waterfall-split",
		clearfixCls : "clearfix",
		loadBtnWrapCls : "cls-waterfall-loadBtnWrap",
		pageViewWrapCls : "cls-waterfall-pageViewWrap",
		loadBtnCls : "cls-waterfall-loadBtn",
		loadBtnDisableCls : "cls-waterfall-loadBtn-disable",
		loadBtnText : "加载更多",
		_loadBtnText : "没有数据...",
		cursor : 0,
		init : function(config) {
			if(!config || !config.renderTo) {
				return;
			}
			jQuery.extend(this, config);
			this.el = this.renderTo.get ? this.renderTo.get(0) : (typeof this.renderTo == "string" ? document.getElementById(this.renderTo) : this.renderTo);
			/*this.el = D.renderTo ? D.renderTo.dom ? D.renderTo.dom : typeof D.renderTo == "string" ? document.getElementById(D.renderTo) : D.renderTo : null;
			D.data && (this.data = D.data);
			D.limit && (this.limit = D.limit);
			D.wrapWidth && (this.wrapWidth = D.wrapWidth);
			D.cls && (this.cls = D.cls);
			D.ulCls && (this.ulCls = D.ulCls);
			D.liCls && (this.liCls = D.liCls);
			D.picCls && (this.picCls = D.picCls);
			D.titleCls && (this.titleCls = D.titleCls);
			D.descCls && (this.descCls = D.descCls);
			D.btnCls && (this.btnCls = D.btnCls);
			D.splitCls && (this.splitCls = D.splitCls);
			D.width && (this.width = D.width);
			D.height && (this.height = D.height);
			D.splitWidth && (this.splitWidth = D.splitWidth);
			D.paddingWidth && (this.paddingWidth = D.paddingWidth);*/
			this.el.className = this.cls;
			this.cm = [];
			this.cursor = 0;
			this.el.style.width = this.wrapWidth + "px";
			this.main = document.createElement("div");
			this.main.className = this.mainCls + " " + this.clearfixCls;
			this.el.appendChild(this.main);
			this.cols = Math.floor(this.wrapWidth / (this.width + (this.paddingWidth + this.splitWidth) * 2));
	    if(this.cols > 0) {
	    	for(var i=0;i<this.cols;i++) {
	      	var u = document.createElement("ul");
	      	u.className = this.ulCls;
	      	this.cm.push(u);
	      	this.main.appendChild(u);
	      }
	    }
	    if(this.loadBtn) {
	    	var loadBtnWrap = document.createElement("div");
	    	loadBtnWrap.className = this.loadBtnWrapCls;
	  		this.loadBtn = document.createElement("a");
	  		this.loadBtn.className = this.loadBtnCls;
	  		this.loadBtn.innerHTML = this.loadBtn.text ? this.loadBtn.text : this.loadBtnText;
	  		var g = this;
	  		if(this.loadBtn.handle) {
	  			this.loadBtn.onclick = function() {
		    	  this.loadBtn.handle.call(g);
	        };
	  		} else {
	  			this.loadBtn.onclick = function() {
		    	  g.load();
	        };
	  		}
	      loadBtnWrap.appendChild(this.loadBtn);
	    	this.el.appendChild(loadBtnWrap);
	    	this.loadBtn.style.display = "none";
	    }
	    if(this.pageView) {
	    	var pageView = document.createElement("div");
	      pageView.className = this.pageViewWrapCls;
	      this.el.appendChild(pageView);
	      var config = this.pageView;
	      config.renderTo = pageView;
	      this.pageView = new DBapp.ui.PageView(this.pageView);
	    }
		},
		layout : function() {
	  },
	  initClick : function(l) {
	  	l.toggleClass(this.rowSelectedClass);
	  },
	  select : function(cell) {
	  	var isHas = (this.rowSelectedClass && (' ' + cell.className + ' ').indexOf(' ' + this.rowSelectedClass + ' ') != -1);
	  	if(isHas) {
	  		$(cell).removeClass(this.rowSelectedClass);
	  	} else {
	  		$(cell).addClass(this.rowSelectedClass);
	  	}
	  },
	  selectAll : function() {
	  	var cells = $(this.el).find("." + this.liCls), len = cells.length;
	  	if(this.isSelectAll) {
	  		for(var i=0;i<len;i++) {
	  			$(cells[i]).removeClass(this.rowSelectedClass);
	    	}
	  		this.isSelectAll = false;
	  	} else {
	  		for(var i=0;i<len;i++) {
	  			$(cells[i]).addClass(this.rowSelectedClass);
	    	}
	  		this.isSelectAll = true;
	  	}
	  },
	  addData : function(D) {
	  	if(Object.prototype.toString.apply(D) === '[object Array]') {
	  		for(var j=0;j<D.length;j++) {
	  			this.addData(D[j]);
	  		}
	  	} else {
	  		this.data.push(D);
	  	}
	  },
	  removeData : function(D) {
	  	if(Object.prototype.toString.apply(D) === '[object Array]') {
	  		for(var j=0;j<D.length;j++) {
	  			this.removeData(D[j]);
	  		}
	  	} else {
	  		var rs = [];
	    	for(var i=0;i<this.data.length;i++) {
	    		if(D !== this.data[i]) {
	    			rs.push(this.data[i]);
	    		}
	    	}
	    	this.data = rs;
	  	}
	  	/*var rs = [];
	  	for(var i=0;i<this.data.length;i++) {
	  		if(D !== this.data[i]) {
	  			rs.push(this.data[i]);
	  		}
	  	}
	  	this.data = rs;*/
	  },
	  expando: "eghjhjkrfdgghgj" + new Date(),
	  setData : function(el, data) {
	    if (!el) {
	      return null;
	    }
	    return (el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el))[this.expando] = data;
	  },
	  getData : function(el) {
	    if (!el) {
	      return null;
	    }
	    return (el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el))[this.expando];
	  },
	  getSelectedData : function() {
	  	var e=[],t=$(this.el).find("." + this.rowSelectedClass);
	  	for(var n=0;n<t.length;n++)
	  		//e.push($(t[n]).data("data"));
	  		e.push(this.getData(t[n]));
	  	return e;
	  },
	  getTemplate : function(l, data) {
	  	l.innerHTML = '<div class="' + this.picCls + '">' +
										  '<span title="' + data.title + '">' +
											  '<img src="' + data.src + '" alt="" style="width:' + this.width + 'px;"/>' +
											'</span>' +
										'</div>';
	  },
		load : function(D, F) {
			this.isSelectAll = false;
			if(this.loadBtn) {
				this.loadBtn.style.display = "";
			}
	    if(D) {
	    	if(this.loadBtn) {
	    		this.loadBtn.className = this.loadBtnCls;
	    		this.loadBtn.innerHTML = this.loadBtnText;
	    	}
	    	this.sum = 0;
	    	this.data = D;
	    	if(this.pageView) {
	      	this.pageView.load();
	      }
	    }
	    if(F == false) {
	    	this.cursor = 0;
	      if(this.cm.length > 0) {
	      	for(var i=0;i<this.cm.length;i++) {
	          this.cm[i].innerHTML = "";
	        }
	      }
	    }
	    if(this.data.length > 0) {
	    	var len = Math.min(this.sum + this.limit, this.data.length);
	    	for(;this.sum<len;this.sum++) {
	      	var l = document.createElement("li");
	  			l.className = this.liCls;
	  			this.getTemplate(l, this.data[this.sum]);
				  this.cm[this.cursor].appendChild(l);
				  this.cursor >= this.cols - 1 ? this.cursor = 0 : this.cursor++;
				  var o = this;
				  this.setData(l, this.data[this.sum]);
				  //$(l).data("data", this.data[this.sum]);
				  /*$(l).css("opacity", 0).stop().animate({
		        "opacity" : 1
		      }, 999);*/
				  /*$(l).css("opacity", 0).stop().animate({
		        "opacity" : 1
		      }, 999).data("data", this.data[this.sum]);*/
	      }
	    	if(len >= this.data.length && this.loadBtn) {
	    		this.loadBtn.className = this.loadBtnDisableCls;
	    		this.loadBtn.innerHTML = this._loadBtnText;
	    	}
	    } else {
	    	if(this.loadBtn) {
	    		this.loadBtn.className = this.loadBtnDisableCls;
		  		this.loadBtn.innerHTML = this._loadBtnText;
	    	}
	    }
		}
	}
	DBapp.ui.Waterfall = Waterfall;
})();
(function() {
	/*var Mask = function(el, config) {
		this.init(el, config);
	}
	Mask.prototype = {
		openAnimationDuration : 500,
		closeAnimationDuration : 500,
		openAnimationEffect : '-in',
		closeAnimationEffect : '-out',
		//openAnimationEffect : 'fadeInDown',
		//closeAnimationEffect : 'fadeOutUp',
		template :
	  '<div class="mask-box" style="display: none;">'+
			'<div class="inner">'+
			  '<div class="content"></div>'+
			'</div>'+
		'</div>',
	  init : function(el, config) {
	  	jQuery.extend(this, config);
	  	var self = this;
      var id;
      if(typeof el == "string") {
        id = el;
      }
	  	self.el = el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
	  	if(!self.el) {
	  		self.$el = jQuery(self.template);
        self.el = self.$el.get(0);
        if(id) {
          self.el.id = id;
        }
        jQuery('body').append(self.$el);
	  	} else {
        self.$el = jQuery(self.el);
      }
	  	self.$inner = self.$el.find(".inner");
	  	self.inner = self.$inner.get(0);
	  	self.$content = self.$el.find(".content");
	  	self.content = self.$content.get(0);
      if(self.msg) {
        self.setContent(self.msg);
      }
	  	if(self.isHide) {
	  		self.$el.click(function(e) {
					if (jQuery(e.target).closest(".inner").length) {//也可用阻止冒泡
						return;
					}
					self.hide();
				});
	  	}
	  },
    setSize : function(width, height) {
      if(width) {
        this.width = width;
        this.$inner.css("width", this.width);
      }
      if(height) {
        this.height = height;
        this.$inner.css("height", this.height);
      }
    },
	  setContent : function(html) {
	  	if(this.content) {
	  		this.html = html || "";
		  	this.content.innerHTML = this.html;
	  	}
	  },
    _handleClick : function(e) {
	    var opt = e.data;
	    if(opt && opt.scope) {
	      var fn = (opt.config.handle || opt.config.handdle);
	      fn.apply(opt.config.scope ? opt.config.scope : opt.scope, arguments || []);
	    }
	  },
	  isVisible : function() {
      return this.$el.css("visibility") != "hidden";
	  },
	  hasClass : function(el, className) {
	  	return className && (' ' + el.className + ' ').indexOf(' ' + className + ' ') != -1;
	  },
	  show : function() {
	  	var self = this;
	  	self.$el.css("visibility", "visible");
			self.$el.show();
	  },
	  hide : function() {
	  	var self = this;
      self.$el.css("visibility", "hidden");
	  }
	};
	var LoadingMask = function() {
		var dlg, opt;
		return {
			getDialog : function(config) {
				if(!dlg) {
					dlg = new DBapp.ui.Mask("____id-mask-box", {
					});
				}
				return dlg;
			},
			isVisible : function() {
	      return dlg && dlg.isVisible();
	    },
	    hide : function() {
	      if(this.isVisible()) {
	        dlg.hide();
	      }
	    },
	    setMsg : function(msg) {
	      return '<span class="cls-dlg-msg">' + msg + '</span>';
	    },
	    show : function(config) {
	    	if(this.isVisible()) {
	        this.hide();
	      }
	      var dialog = this.getDialog();
	      dialog.setContent(config.msg || "");
	      dialog.show();
	      dialog.setSize(dialog.content.firstChild.offsetWidth + 60);
	      return this;
	    },
	    showMask : function(msg) {
	    	msg = msg || "Loading...";
	      this.show({
	        msg : this.setMsg(msg)
	      });
	      return this;
	    }
		};
	}();*/
	var Mask = function(config) {
		this.init(config);
	};
	Mask.prototype = {
		mode : true,
		noPos : false,
	  init : function(config) {
	  	jQuery.extend(this, config);
	  	if(config && config.renderTo) {
	  		this.renderTo = DBapp.getDom(config.renderTo);
	  	} else {
	  		this.renderTo = document.body;
	  	}
	  	this.$renderTo = $(this.renderTo);
			if(this.$renderTo.css("position") == "static") {
				this.noPos = true;
			}
	  	if(!this.el) {
	  		this.el = document.createElement("div");
	  		this.el.className = "cls-loading-msg";
	  		this.el.innerHTML = '<div class="cls-loading-text"></div>';
	  		this.renderTo.appendChild(this.el);
	  		this.$el = jQuery(this.el);
	  		this.$el.hide();
	  	}
	  	if(!this.mask) {
	  		this.mask = document.createElement("div");
	  		this.mask.className = "cls-loading";
	  		DBapp.getDom(this.renderTo).appendChild(this.mask);
	  		this.$mask = jQuery(this.mask);
	  		this.$mask.hide();
	  	}
	  	this.content = $(this.el).find(".cls-loading-text").get(0);
	  	this.setMsg(this.msg);
	  	//this.hide(true);
	  },
	  setMsg : function(msg) {
	  	this.content.innerHTML = msg || "";
	  },
	  show : function(msg) {
	  	if(msg) {
	  		this.setMsg(msg);
	  	}
	  	this.clear();
	  	if(this.mask && this.mode) {
	  		if(this.mask) {
	  			if(this.noPos) {
	  			  this.$renderTo.addClass("cls-loading-pos");
	  			}
	  			this.mask.style.height = this.renderTo.scrollHeight + "px";
	  			this.$mask.fadeIn();
	        //this.mask.style.display = "block";
	  		}
      }
	  	this.el.style.display = "block";
	  	//DBapp.Css.center(this.el);
	  	DBapp.Css.alignTo(this.el, this.renderTo, "c-c");
	  	this.el.style.display = "none";
	  	this.$el.fadeIn();
	  },
	  destroy : function() {
	  	this.$el.empty();
	  	this.$el.remove();
	  	if(this.mask) {
	  		this.$mask.empty();
	  		this.$mask.remove();
	  	}
	  	delete this;
	  },
	  hide : function(D) {
	  	var self = this;
	  	//self.clickTimeout = setTimeout(function() {
  			//clearTimeout(self.clickTimeout);
  			//self.$el.remove();
	  	  self.$el.hide();
  	  	if(self.mask && self.mode) {
  	  		if(this.noPos) {
	  			  this.$renderTo.removeClass("cls-loading-pos");
	  			}
  	  		//self.$mask.remove();
  	  		self.$mask.hide();
  	  	}
      //}, 100);
  	  self.destroy();
	  	return;
	  	if(D) {
	  		//this.el.style.display = "none";
	  		this.$el.fadeOut();
	  		if(this.mask) {
		  		//this.mask.style.display = "none";
	  			this.$mask.fadeOut();
		    }
	  	} else {
	  		var self = this;
	  		self.clickTimeout = setTimeout(function() {
	  			clearTimeout(self.clickTimeout);
	  			//self.el.style.display = "none";
	  			self.$el.fadeOut();
	  			if(self.mask) {
	  				//self.mask.style.display = "none";
	  				self.$mask.fadeOut();
	  	    }
	      }, 1000);
	  	}
	  },
	  clear : function() {
	  }
	};
	DBapp.ui.Mask = Mask;
	DBapp.showMask = function(msg, id) {
		//if(!DBapp.ui.LoadingMask) {
			var mask = new DBapp.ui.Mask({
				renderTo : id
			});
		//}
			mask.show(msg);
		return mask;
	}
	DBapp.hideMask = function(mask) {
		/*if(DBapp.ui.LoadingMask) {
			DBapp.ui.LoadingMask.hide(true);
		}*/
		if(mask && mask.hide) {
			mask.hide();
		}
	}
	DBapp.LOADING = function(msg, id, action) {
		return DBapp.ui.loader(msg, id, action);
	}
})();
(function() {
	DBapp.showProcessing = function(el) {
		if(!el) {
			return;
		}
		var g = (el.get ? el : (typeof el == "string" ? jQuery("#" + el) : jQuery(el)));
		g.addClass("processing");
		g.get(0).disabled = true;
	}
  DBapp.hideProcessing = function(el) {
  	if(!el) {
			return;
		}
  	var g = (el.get ? el : (typeof el == "string" ? jQuery("#" + el) : jQuery(el)));
  	g.removeClass("processing");
  	g.get(0).disabled = false;
	}
  DBapp.upload = function(url, file, uploadProgress, uploadSuccess, uploadFailed, uploadComplete, uploadCanceled) {
  	var xhr = new XMLHttpRequest();
		var fd = new FormData();
		xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.onreadystatechange = function() {
    	if(xhr.readyState == 4 && xhr.status == 200) {
    		uploadSuccess(xhr);
    	}
    }
    xhr.open("POST", url);
    if(file.length) {
    	for(var i = 0; i < file.length; i++) {
    		fd.append("file", file[i]);
    	}
    }
    fd.append("file", file);
    xhr.send(fd);
  }
  /*DBapp.Upload = function(config) {
  	if(!config) {
  		this.init(config);
  	}
  }
  DBapp.Upload.prototype = {
    init : function(config) {
    	jQuery.extend(this, config);
    	if(!this.url) {
    		return false;
    	}
    	var self = this;
    	var xhr = new XMLHttpRequest();
    	var fd = new FormData();
			xhr.upload.addEventListener("progress", uploadProgress, false);
			xhr.addEventListener("load", uploadComplete, false);
	    xhr.addEventListener("error", uploadFailed, false);
	    xhr.addEventListener("abort", uploadCanceled, false);
	    xhr.onreadystatechange = function() {
	    	if(xhr.readyState == 4 && xhr.status == 200) {
	    		//alert(xhr.responseText);
	    		self.success();
	    	} else {
	    		self.error();
	    	}
	    }
    },
    success : function(xhr) {},
    error : function(xhr) {},
    uploadProgress : function(e) {
			if (e.lengthComputable) {
        var percentComplete = Math.round(e.loaded * 100 / e.total);
        //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
      }
      else {
        //document.getElementById('progressNumber').innerHTML = 'unable to compute';
      }
		},
		uploadComplete : function(e) {
			//服务器端返回响应时候触发event事件
      //alert(e.target.responseText);
		}
		uploadFailed : function() {
			//alert("There was an error attempting to upload the file.");
		}
		uploadCanceled : function() {
			//alert("The upload has been canceled by the user or the browser dropped the connection.");
		},
		upload : function(xhr, fd) {
	    xhr.open("POST", url);
	    fd.append("file", file);
	    xhr.send(fd);
		}
  }*/
	DBapp.getDrop = function(el) {
		if(!el) return null;
  	return el.get ? el : (typeof el == "string" ? jQuery("#" + el) : jQuery(el));
	}
	jQuery(".cls-drop").bind("click", function(event) {
		var $this = jQuery(this);
		var drop = $this.data("drop");
		if(!drop) {
			drop = {
			  el : this,
			  afterShow : function() {},
			  afterHide : function() {}
			};
			drop.show = function() {
				//drop.list.style.visibility = "visible";
				drop.list.style.display = "block";
				DBapp.Css.alignTo(drop.list, drop.el, "tl-bl?");
	    	jQuery(document).bind("mousedown",  drop.collapse);
		    jQuery(document).bind("mousewheel DOMMouseScroll", drop.collapse);
		    drop.afterShow();
			}
			drop.hide = function() {
				//drop.list.style.visibility = "hidden";
				drop.list.style.display = "none";
			  jQuery(document).unbind("mousedown",  drop.collapse);
		    jQuery(document).unbind("mousewheel DOMMouseScroll", drop.collapse);
		    drop.afterHide();
			}
			drop.list = document.getElementById($this.attr("dropId"));
			drop.collapse = function(e) {
				if(!drop.list.contains(e.target)) {
					drop.hide();
		    }
			};
		}
    if($(drop.list).css("display") != "none") {
    	drop.hide();
    } else {
    	drop.show();
    }
    event.stopPropagation();
		event.preventDefault();
    return false;
	});
})();
(function() {
	var DataPick = function(config) {
		this.init(config);
	}
	DataPick.prototype = {
		defaultWidth: 300,
		defaultheight: 100,
		defaultCenterWidth: 36,
		unArray: [],
		init: function(config) {
		  $.extend(this, config);
		  this.sortArray || (this.sortArray = this.getUnData());
		  this.el = DBapp.getDom(config.renderTo);
		  this.$el = $(this.el);
			this.el.innerHTML = '<div class="x-data-pick"><ul><li class="x-data-pick-leftli"><div class="x-data-pick-ltitle">' + (config.leftTitle ? config.leftTitle : "&#160;") + "</div>" + '<div class="x-data-pick-left"></div>' + "</li>" + '<li><div class="x-data-pick-center"><div class="x-data-pick-trigger">&#160;</div></div></li>' + '<li class="x-data-pick-rightli">' + '<div class="x-data-pick-rtitle">' + (config.rightTitle ? config.rightTitle : "&#160;") + "</div>" + '<div class="x-data-pick-right"></div>' + "</li>" + "</ul>" + "</div>";
		  if(!this.left) {
		  	this.left = this.$el.find(".x-data-pick-left");
		  }
		  if(!this.right) {
		  	this.right = this.$el.find(".x-data-pick-right");
		  }
		  if(!this.center) {
		  	this.center = this.$el.find(".x-data-pick-center");
		  }
		  if(!this.trigger) {
		  	this.trigger = this.$el.find(".x-data-pick-trigger").get(0);
		  }
		  this.layout();
	  },
	  initEvent: function() {
	  	var self = this;
	  	self.center.hover(function(){
	  		self.right.css("display", "block");
	  	  },
	  	  function(){
	  	  	self.right.css("display", "none");
	  	  }
	  	),
	  	self.left.hover(
				function(){
					self.right.css("display", "block");
				},
				function(){
					self.right.css("display", "none");
				}
	  	),
	  	self.right.hover(
	    	function(){
	    		self.right.css("display", "block");
	    	},
	    	function(){
	    		self.right.css("display", "none");
	    	}
	    )
	  },
	  layout: function() {
	  	this.el.firstChild.style.width = this.width + "px";
	  	this.left.css({height: this.height});
	  	this.right.css({height: this.height});
	  },
	  getUnData: function() {
	  	var rs = [];
	  	for(var i = 0; i < this.baseData.length; i++) {
	  		rs.push(this.baseData[i][0]);
	  	}
	  	return rs;
	  },
	  tranData: function(v) {
	  	v += "";
	  	for(var i = 0; i < this.baseData.length; i++) {
	  		if(v == this.baseData[i][0] + "") {
	  			return this.baseData[i][1];
	  		}
	  	}
	  },
	  onHdClick: function(e) {
	  	var t = e.data.scope;
	  	var self = t[0], btn = t[1], isLeft = t[2];
	  	if(isLeft) {
	  		if(!self.isClear && self.left.length <= 1) {
					return;
				}
	  		DBapp.remove(self.data, parseInt(btn.value, 10));
	  		self.load(self.data);
	  	} else {
	  		self.data.push(parseInt(btn.value, 10));
	  		self.load(self.data);
	  	}
	  },
	  load: function(data) {
	  	this.data = data || [];
	  	this.left.html('');
	  	this.right.html('');
	  	var leftArr = this.sortArray.slice(), rightArr = this.sortArray.slice();
	  	if(this.data.length > 0) {
	  		for(var i = 0; i < this.data.length; i++) {
	  			DBapp.remove(leftArr, this.data[i]);
	  		}
	  	}
	  	for(var i = 0; i < leftArr.length; i++) {
	  		DBapp.remove(rightArr, leftArr[i]);
	  	}
	  	this.data = rightArr;
	  	var button;
	  	if(this.data.length > 0) {
	  		for(var i = 0; i < this.data.length; i++) {
	  			button = document.createElement('span');
	  			button.className = "button x-dataPick-lbtn";
	  			button.value = this.data[i];
	  			button.innerHTML = this.tranData(this.data[i]);
	  			this.left.get(0).appendChild(button);
	  			$(button).bind("click", {scope:[this, button, true]}, this.onHdClick);
	  		}
	  	}
	  	this._data = leftArr;
	  	if(leftArr.length > 0) {
	  		for(var i = 0; i < leftArr.length; i++) {
	  			button = document.createElement('span');
	  			button.className = "button x-dataPick-rbtn";
	  			button.value = leftArr[i];
	  			button.innerHTML = this.tranData(leftArr[i]);
	  			this.right.get(0).appendChild(button);
	  			$(button).bind("click", {scope:[this, button, false]}, this.onHdClick);
	  		}
	  	}
	  	var mHeight = Math.max(this.left.height(), this.right.height());
	  	//this.el.height() < mHeight && this.el.css("height", mHeight);
	  }
	}
	DBapp.ui.DataPick = DataPick;
})();
(function() {
  var ComboTree = function(el, opt, fn) {
    this.init(el, opt, fn);
  }
  ComboTree.prototype = {
		isAjaxFilter: false,
    splitStr: "/n",
    name: "",
    valueField: "name",
    displayField: "name",
    multValue: [],
    listWidth: 600,
    tp: '<div class="cls-cmb">' +
          '<span class="cls-cmb-inner">' +
            '<span class="cls-cmb-container">' +
              '<span class="cls-cmb-select">' +
                '<span class="cls-cmb-mult">' +
                  '<ul class="cls-cmb-ul">' +
                    '<span class="cls-cmb-clear">×</span>' +
                    '<span class="cls-cmb-multwrap"></span>' +
                    '<li class="cls-cmb-input-wrap">' +
                    	'<input class="cls-cmb-input" type="text">' +
                    	'<input class="cls-cmb-el" type="hidden">' +
                    '</li>' +
                  '</ul>' +
                '</span>' +
              '</span>' +
              '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
            '</span>' +
          '</span>' +
        '</div>',
    callback: function(data) {
    	this.createLvTree(data);
    },
    init: function(el, opt, fn) {
      $.extend(this, opt);
      var self = this;
      if(fn) {
      	self.fn = fn;
      }
      self.wrap = self.getDom(el);
      self.$wrap = $(self.wrap);
      if(!self.el) {
        self.$contain = $(self.tp);
        self.$wrap.append(self.$contain);
        self.contain = self.$contain.get(0);
        self.$input = self.$contain.find('.cls-cmb-input');
        self.$el = self.$contain.find('.cls-cmb-el');
        self.$el.attr("name", self.name);
        self.$container = self.$contain.find('.cls-cmb-container');
        self.container = self.$container.get(0);
        self.$multwrap = self.$contain.find('.cls-cmb-multwrap');
        self.multwrap = self.$multwrap.get(0);
        self.$clear = self.$contain.find(".cls-cmb-clear");
        self.clear = self.$clear.get(0);
        self.el = self.$input.get(0);
        self.container.style.width = self.width + "px";
        //self.container.style.height = self.height + "px";
        self.$clear.bind("click", function() {
          self.clearAllMult();

          self.tree.checkAllNodes(false);
          self.tree.expandAll(false);
          self.grid.load(self.multValue);
        });
        self.$wrap.bind("click", function() {
        	self.$input.focus();
        });
        self.$input.bind("focus", {scope : this}, this._initList);
        if(self.isAjaxFilter) {
        	self.$input.bind("keyup", {scope : this}, this._onKeyUp);
        }
      }
    },
    _initList: function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.scope.initList(e, e.target);
      }
    },
    _onKeyUp : function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.scope.onKeyUp(e, e.target);
      }
    },
    onKeyUp : function(e) {
      var k = e.keyCode, isSpecialKey = function() {
        return (e.type == 'keypress' && (e.ctrlKey || e.metaKey)) || k == 9 || k == 13  || k == 40 || k == 27 || (k == 16) || (k == 17) || (k >= 18 && k <= 20) || (k >= 33 && k <= 35) || (k >= 36 && k <= 39) || (k >= 44 && k <= 45);
      };
      this.doQuery(this.el.value);
    },
    isExpanded: function() {
      return this.list && DBapp.Css.isVisible(this.list);
    },
    _collapseIf : function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.scope.collapseIf(e, e.target);
      }
    },
    collapseIf : function(e, target) {
      if(!this.el.contains(target) && !this.list.contains(target)) {
        this.collapse();
      }
    },
    collapse: function() {
      if(!this.isExpanded()) {
        return;
      }
      this.list.style.visibility = "hidden";
      jQuery(document).unbind("mousedown", this._collapseIf);
      jQuery(document).unbind("mousewheel DOMMouseScroll", this._collapseIf);
    },
    expand: function() {
      if(this.isExpanded()) {
        return;
      }
      this.list.style.visibility = "visible";
      jQuery(document).bind("mousedown", {scope : this}, this._collapseIf);
      //jQuery(document).bind("mousewheel DOMMouseScroll", {scope : this}, this._collapseIf);
    },
    initList: function() {
			/*if(this.isExpanded()) {
			 this.collapse();
			 } else {*/
      if(!this.list) {
        //this.$list = $('<div class="cls-menu"><div cass="cls-menu-inner" class="ztree"></div></div>');
        this.$list = $(
          '<div class="cls-cmb-list">' +
        		'<div class="cls-menu-col-left">' +
  	          '<div class="cls-menu-col-inner"><ul cass="cls-menu-inner" class="ztree"></ul></div>' +
  		      '</div>' +
  		      '<div class="cls-menu-col-right">' +
  		        '<div class="cls-menu-col-inner"><div cass="cls-menu-inner-grid"></div><div cass="cls-menu-inner-grid-pageView"></div></div>' +
  		      '</div>' +
          '</div>'
        );
        $(document.body).append(this.$list);
        this.list = this.$list.get(0);
        this.list.style.visibility = "hidden";
        if(this.listWidth) {
          this.list.style.width = this.listWidth + "px";
        } else {
          this.list.style.width = this.wrap.offsetWidth + "px";
        }
        var fcs = this.list.childNodes;
        var left = fcs[0];
        var right = fcs[1];
        this.treeDom = left.firstChild.firstChild;
        this.$treeDom = $(this.treeDom);
        this.$treeDom.attr("id", "__dfw893423fsfsdiw22" + new Date().getTime());
        var dom = right.firstChild.childNodes;
        //this.inner = this.list.firstChild;
        //this.$inner = $(this.inner);
        //this.$treeDom = this.$list.find(".cls-menu-inner");
        //this.$gridDom = this.$list.find(".cls-menu-inner-grid");
        //this.$pageViewDom = this.$list.find(".cls-menu-inner-grid-pageView");
        if(!this.grid) {
        	this.grid = new DBapp.ui.Grid({
        		renderTo: dom[0],
            isNumber: false,
            //isCheckbox: true,
            height: 378,
            exchange: true,
            /*pageView: {
              renderTo: dom[1],
              param: {
                offset: 0,
                limit: 10
              },
              callback: function() {}
            },*/
            cm: [{
              header: "",
              width: 160,
              hidden: true,
              dataStore: this.valueField,
            }, {
              header: "已选",
              dataStore: this.displayField
            }]
        	});
        }
      }
      this.expand();
      this.doQuery(this.input ? this.input.value : "");
      //}
      //this.isInit = false;
    },
    doQuery: function(value) {
      var self = this;
			/*if(this.data === undefined) {
			 return;
			 }*/
			/*if(this.height) {
			 this.inner.style.maxHeight = this.height + "px";
			 }*/
            //this.inner.innerHTML = value;
      if(!self.isAjaxFilter && self.tree) {
      } else {
      	$.ajax({
          type : this.type || "get",
          dataType : this.dataType || "json",
          url : this.url || "loginAction",
          data : this.param || {},
          cache : this.cache || false,
          success : function(data) {
            self.callback(data);
          },
          error : function(XMLHttpRequest, textStatus, errorThrown) {

          	self.callback();
          }
        });
      }
      DBapp.Css.alignTo(this.list, this.contain, 'tl-bl?');
    },
		/*isCheckValue: function(v) {
		 var self = this;
		 var self.$multwrap.find(".cls-combo-item[value='" + v + "']");
		 },*/
    freshValue: function() {
      if(this.fn) {
      	this.fn();
      }
    },
    checkMultValue : function(multSelect) {
      for(var i = 0; i < this.multValue.length; i++) {
        if(this.multValue[i][this.valueField] == multSelect[this.valueField]) {
          return this.multValue[i];
        }
      }
      return false;
    },
    clearAllMult : function() {
      this.multValue = [];
      this.multwrap.innerHTML = "";
      this.freshValue();
    },
    removeMultValue : function(multSelect) {
      var rs = [];
      for(var i = 0; i < this.multValue.length; i++) {
        if(this.multValue[i][this.valueField] != multSelect[this.valueField]) {
          rs.push(this.multValue[i]);
        } else {
          this.$multwrap.find(".cls-combo-item[value='" + this.multValue[i][this.valueField] + "']").remove();
        }
      }
      this.multValue = rs;
    },
    clTreeData: function(nds) {
    	var self = this, item, check, nd;
    	for(var i = 0; i < nds.length; i++) {
    		nd = nds[i];
    		if(!nd.isHidden) {
    			check = self.checkMultValue(nd);
    			if(nd.checked) {
    				if(!nd.isParent) {
    					self.createMult(nd);
    				} else {
    					if(nd.isParent && nd.check_Child_State == 2 && !check) {
    						self.createMult(nd);
                continue;
      				}
    					if(nd.isParent && nd.check_Child_State != 2) {
      					self.clTreeData(nd.children);
      				}
    				}
    			} else {
    				if(!nd.checked && check) {
    					self.removeMultValue(check);
    				}
    			}
    		}
    	}
    },
    createMult: function(nd) {
    	var self = this;
    	/*self.multValue.push(nd);
			item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
      self.$multwrap.append(item);
      item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);*/
    	self.multValue.push(nd);
    	//this.grid.load(self.multValue);
    },
    treeOnCheck: function(event, treeId, treeNode) {
    	var self = this;
    	self.clearAllMult();
    	self.clTreeData(self.tree.getNodes());
      //var self = this, item, check;
      //var nodes = self.tree.getNodes();
      /*self.tree.getNodesByFilter(function(nd) {
      	if(!nd.isHidden) {
      		check = self.checkMultValue(nd);
      		if(nd.isParent && nd.check_Child_State == 2 && !check) {
      			self.multValue.push(nd);
            item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
            self.$multwrap.append(item);
            item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);
      		}
      	}
      	if(nd.check_Child_State == 2 && !nd.isHidden) {
      		check = self.checkMultValue(nd);
      		if(check) {
      			self.multValue.push(nd);
            item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
            self.$multwrap.append(item);
            item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);
      		}
      	}
      });*/
      /*self.tree.getNodesByFilter(function(nd) {
      	if(nd.isParent && !nd.isHidden) {
      		if(nd.check_Child_State == 1 && !check) {
            self.multValue.push(nd);
            item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
            self.$multwrap.append(item);
            item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);
          }
          if(!nd.checked && check) {
            self.removeMultValue(check);
          }
      	} else {
      		if(!nd.isParent && !nd.isHidden) {
            if(nd.checked && !check) {
              self.multValue.push(nd);
              item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
              self.$multwrap.append(item);
              item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);
            }
            if(!nd.checked && check) {
              self.removeMultValue(check);
            }
          }
      	}
      });*/
      self.freshValue();
    },
    ____treeOnCheck: function(event, treeId, treeNode) {
      //alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
      var self = this, item, check;
      self.tree.getNodesByFilter(function(nd) {
        //return nd.checked && !nd.getCheckStatus().half && !nd.isParent;
        if(!nd.isParent && !nd.isHidden) {
          check = self.checkMultValue(nd);
          if(nd.checked && !check) {
            self.multValue.push(nd);
            item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
            self.$multwrap.append(item);
            item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);
          }/* else {
            self.removeMultValue(check);
          }*/
          if(!nd.checked && check) {
            self.removeMultValue(check);
          }
        }
      });
      self.freshValue();
    },
    _handleClose: function(e) {
      var opt = e.data;
      if(opt && opt.scope) {
        opt.dom = this;
        opt.scope.handleClose(e, e.target, opt);
      }
      return false;
    },
    handleClose: function(e, target, opt) {
      this.closeMult(opt.mult, opt.dom.parentNode);
    },
    closeMult : function(mult, dom) {
      this.removeMultValue(mult);
      jQuery(dom).remove();
      this.freshValue();
    },
    checkedTreeByUserdata : function(arr, treeData) {
      if(!arr || !arr.length) {
        return;
      }
      if(treeData && treeData.length) {
        for(var i = 0; i < treeData.length; i++) {
          var node = treeData[i];
          for(var j = 0; j < arr.length; j++) {
            if(arr[j] == node[this.valueField]) {
              this.tree.checkNode(node, true, true);
              continue;
            }
          }
          if(node.isParent) {
            this.checkedTreeByUserdata(arr, node['children']);
          }
        }
      }
    },
    /*getTreeData : function(r, treeData, config) {
    	var key = config && config["id"] ? config["id"] : "id";
    	var name = config && config["name"] ? config["name"] : "name";
    	var children = config && config["children"] ? config["children"] : "children";
			if (treeData && treeData.length) {
				for (var i = 0; i < treeData.length; i++) {
					if (treeData[i].check_Child_State == 1) {
						this.getTreeData(r, treeData[i][children], config);
					} else if (treeData[i].check_Child_State == 2 || (treeData[i].check_Child_State == -1 && treeData[i].checked)) {
						var G = {};
						//G[config["entityType"]] = treeData[i].isParent ? 2 : 1;
						// G[config["entityId"]] = treeData[i][config["id"]];
						//G[config["entityId"]] = treeData[i]["userdata"][0]["content"];
					  //G[config["type"]] = treeData[i].isParent ? 2 : 1;
						G[key] = treeData[i][key];
						G[name] = treeData[i][name];
						r.push(G);
						continue;
					}
				}
			}
			return r;
		},*/
    initTree: function(store) {
    	var self = this;
    	self.tree = $.fn.zTree.init(self.$treeDom, {
        check: {
          enable: true
        },
        data: {
      	  key: {
      	  	children: "children",
      	  	name: "name",
      	  	title: "title",
      	  	url: "url"
      	  },
          simpleData: {
            enable: true
          }
        },
        callback: {
          onCheck: function(event, treeId, treeNode) {
          	self.treeOnCheck(event, treeId, treeNode);
          }
        }
      }, store);
    },
    createLvTree: function(store) {
      var self = this;
      if(self.isAjaxFilter) {
      	self.initTree(store);
      } else {
      	if(!self.tree) {
      		self.initTree(store);
        }
      }
      self.checkedTreeByUserdata(self.$el.val().split(self.splitStr), self.tree.getNodes());
      if(!self.isAjaxFilter) {
      	DBapp.initFilterTree(self.tree, self.$input);
      }
    },
    getDom: function(el) {
      if(!el) return null;
      return el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
    }
  };
  $.fn.appTree = function(opt) {
    return new ComboTree(this, opt, function() {
    	var r = [], type, obj;
      for(var i = 0; i < this.multValue.length; i++) {
        //r.push(this.multValue[i][this.valueField]);
      	if(this.multValue[i]["level"] == 0) {
      		type = "Category";
      	} else if(this.multValue[i]["level"] == 1) {
      		type = "Subcategory";
      	} else if(this.multValue[i]["level"] > 1) {
      		type = "Application";
      	}
      	obj = new Object();
      	obj[type] = this.multValue[i][this.valueField];
      	r.push(obj);
      	/*r.push({
      		type: this.multValue[i][this.displayField]
      		//type: this.multValue[i][this.valueField]
      		//this.displayField: this.multValue[i][this.displayField],
      		//this.valueField: this.multValue[i][this.valueField]
      	});*/
      }
      //this.$el.val(r.join(this.splitStr));
      //return r.join(this.splitStr);
      this.$el.val(DBapp.encode(r));
      this.grid.load(this.multValue);
    });
  }
  $.fn.userTree = function(opt) {
    return new ComboTree(this, opt, function() {
    	var r = [], type, obj, groupArr = [], getPath = function(arr, nd, mark) {
    	  arr.unshift(nd[mark]);
    	  if(nd.getParentNode) {
    	  	var pn = nd.getParentNode();
       	  if(pn) {
       	  	getPath(arr, pn, mark);
       	  }
    	  }
    	  return arr;
    	};
    	for(var i = 0; i < this.multValue.length; i++) {
    		groupArr = [];
  			getPath(groupArr, this.multValue[i], this.valueField);
    		if(!this.multValue[i]["isParent"]) {
    			//obj['user'] = this.multValue[i][this.valueField];
    			//console.log(groupArr);
    			groupArr.pop();
    			r.push({
    				'user': this.multValue[i][this.valueField],
    				'userGroup': "/" + groupArr.join("/")
    			});
    		} else {
    			r.push({
    				'userGroup': "/" + groupArr.join("/")
    			});
    		}
    	}
    	this.$el.val(DBapp.encode(r));
    	this.grid.load(this.multValue);
    	/*var r = [], type, obj;
      for(var i = 0; i < this.multValue.length; i++) {
      	console.log(this.multValue);
      	if(this.multValue[i]["level"] == 0) {
      		type = "Category";
      	} else if(this.multValue[i]["level"] == 1) {
      		type = "Subcategory";
      	} else if(this.multValue[i]["level"] > 1) {
      		type = "Application";
      	}
      	obj = new Object();
      	obj[type] = this.multValue[i][this.valueField];
      	r.push(obj);
      }
      this.$el.val(DBapp.encode(r));*/
    });
  }
})();
(function() {
	var Tree = function(el, opt, fn) {
    this.init(el, opt, fn);
  }
	Tree.prototype = {
		tp: '<div class="cls-tree">' +
		      '<input class="cls-cmb-el" type="hidden"/>' +
          '<div class="cls-tree-search-wrap"><input class="cls-form-field cls-tree-search" type="text"/></div>' +
          '<div class="cls-tree-list"><div class="cls-cmb-multwrap"></div><ul class="ztree"></ul></div>' +
        '</div>',
    key: {
    	id: 'id',
    	children: "children",
	  	name: "name",
	  	title: "title",
	  	url: "url"
    },
    isAjaxFilter: false,
		init: function(el, opt, fn) {
			$.extend(this, opt);
      var self = this;
      if(fn) {
      	self.fn = fn;
      }
      self.multValue = [];
      self.wrap = self.getDom(el);
      self.wrap.innerHTML = this.tp;
      self.$wrap = $(self.wrap);
      self.$input = self.$wrap.find('.cls-tree-search');
      self.$multwrap = self.$wrap.find('.cls-cmb-multwrap');
      self.multwrap = self.$multwrap.get(0);
      self.$el = self.$wrap.find('.cls-cmb-el');
      self.$el.attr("name", self.name);
      self.$treeDom = self.$wrap.find('.ztree');
      this.$treeDom.attr("id", "__dfw893423fsfsdiw22" + new Date().getTime());
		},
		load: function(data) {
			this.createLvTree(data);
		},
		setValue: function(values) {
			var self = this;
			//this.checkNode(this.tree.getNodes());
			self.tree.getNodesByFilter(function(nd) {
				//return base.reg_vali_name(reg, nd["name"]);
				if(DBapp.indexOf(values, nd[self.key.id]) != -1) {
					self.createMult(nd);
					self.tree.checkNode(nd, true, true);
				} else {
					self.tree.checkNode(nd, false, true);
				}
			}, false);
			self.treeOnCheck();
		},
		createLvTree: function(store) {
      var self = this;
      if(self.isAjaxFilter) {
      	self.initTree(store);
      } else {
      	//if(!self.tree) {
      		self.initTree(store);
        //}
      }
      //self.checkedTreeByUserdata(self.$el.val().split(self.splitStr), self.tree.getNodes());
      if(!self.isAjaxFilter) {
      	DBapp.initFilterTree(self.tree, self.$input);
      }
		},
		initTree: function(store) {
    	var self = this;
    	self.tree = $.fn.zTree.init(self.$treeDom, {
    		view: {
    			dblClickExpand: false,
    			showLine: false
    		},
        check: {
          enable: true
        },
        data: {
      	  key: self.key,
          simpleData: {
            enable: true
          }
        },
        callback: {
          onCheck: function(event, treeId, treeNode) {
          	self.treeOnCheck(event, treeId, treeNode);
          },
          onClick: function(e,treeId, treeNode) {
      			self.tree.expandNode(treeNode);
      		}
        }
      }, store);
    },
    treeOnCheck: function(event, treeId, treeNode) {
    	var self = this;
    	self.clearAllMult();
    	self.clTreeData(self.tree.getNodes());
      self.freshValue();
    },
    freshValue: function() {
      if(this.fn) {
      	this.fn();
      } else {
        this.$el.val(DBapp.encode(this.multValue));
      }
    },
    checkMultValue : function(multSelect) {
      for(var i = 0; i < this.multValue.length; i++) {
        if(this.multValue[i][this.valueField] == multSelect[this.valueField]) {
          return this.multValue[i];
        }
      }
      return false;
    },
    clearAllMult : function() {
      this.multValue = [];
      this.multwrap.innerHTML = "";
      this.freshValue();
    },
    removeMultValue : function(multSelect) {
      var rs = [];
      for(var i = 0; i < this.multValue.length; i++) {
        if(this.multValue[i][this.valueField] != multSelect[this.valueField]) {
          rs.push(this.multValue[i]);
        } else {
          this.$multwrap.find(".cls-combo-item[value='" + this.multValue[i][this.valueField] + "']").remove();
        }
      }
      this.multValue = rs;
    },
    clTreeData: function(nds) {
    	var self = this, item, check, nd;
    	for(var i = 0; i < nds.length; i++) {
    		nd = nds[i];
    		if(!nd.isHidden) {
    			check = self.checkMultValue(nd);
    			if(nd.checked) {
    				//console.log(!nd.isParent);
    				if(!nd.isParent) {
    					self.createMult(nd);
    				} else {
    					self.clTreeData(nd[self.key.children]);
    				}
    				/*if(!nd.isParent) {
    					self.createMult(nd);
    				} else {
    					if(nd.isParent && nd.check_Child_State == 2 && !check) {
    						self.createMult(nd);
                continue;
      				}
    					if(nd.isParent && nd.check_Child_State != 2) {
      					self.clTreeData(nd[self.key.children]);
      				}
    				}*/
    			}/* else {
    				if(!nd.checked && check) {
    					self.removeMultValue(check);
    				}
    			}*/
    		}
    	}
    },
    createMult: function(nd) {
    	var self = this;
    	/*self.multValue.push(nd);
			item = $('<li title="' + nd[self.valueField] + '" value="' + nd[self.valueField] + '" class="cls-combo-item"><span class="cls-combo-item-remove">×</span>' + nd[self.displayField] + '</li>');
      self.$multwrap.append(item);
      item.find(".cls-combo-item-remove").bind("click", {scope : self, mult : nd}, self._handleClose);*/
    	self.multValue.push(nd);
    	//this.grid.load(self.multValue);
    },
    createLvTree: function(store) {
      var self = this;
      if(self.isAjaxFilter) {
      	self.initTree(store);
      } else {
      	//if(!self.tree) {
      		self.initTree(store);
        //}
      }
      //self.checkedTreeByUserdata(self.$el.val().split(self.splitStr), self.tree.getNodes());
      if(!self.isAjaxFilter) {
      	DBapp.initFilterTree(self.tree, self.$input);
      }
    },
    getDom: function(el) {
      if(!el) return null;
      return el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
    }
	};
	DBapp.ui.Tree = function(el, opt, fn) {
		return new Tree(el, opt, fn);
	}
})();
(function() {
	var Multquery = function(el, opt) {
	  if(!el) {
	  	return null;
	  }
	  jQuery.extend(this, opt);
	  this.el = this.getDom(el);
	  this.$el = jQuery(this.el);
		this.init();
	}
  Multquery.prototype = {
  	KEYS: {
	    BACKSPACE: 8,
	    TAB: 9,
	    ENTER: 13,
	    SHIFT: 16,
	    CTRL: 17,
	    ALT: 18,
	    ESC: 27,
	    SPACE: 32,
	    PAGE_UP: 33,
	    PAGE_DOWN: 34,
	    END: 35,
	    HOME: 36,
	    LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40,
	    DELETE: 46
	  },
	  //valueField: "id",
	  //displayField: "name",
    tp: '<span class="cls-mltuquery">' +
          '<span class="cls-mltuquery-container">' +
            '<span class="cls-mltuquery-multiple">' +
              '<ul class="cls-mltuquery-ul">' +
                //'<li class="cls-mltuquery-li cls-mltuquery-choice">' +
                  //'<span class="cls-mltuquery-choice-remove">×</span>' +
                  //'Nevada' +
                //'</li>' +
                //'<li class="cls-mltuquery-li cls-mltuquery-choice">' +
                  //'<span class="cls-mltuquery-choice-remove">×</span>' +
                  //'Nevada' +
                //'</li>' +
                '<li class="cls-mltuquery-li cls-mltuquery-search">' +
                  '<input class="cls-mltuquery-field" type="text">' +
                '</li>' +
              '</ul>' +
              '<i class="cls-mltuquery-clear"></i>' +
            '</span>' +
          '</span>' +
          '<span class="dropdown-wrapper"></span>' +
          '<input class="cls-mltuquery-input" type="hidden" value="">' +
        '</span>',
    itemTp: '<li class="cls-mltuquery-li cls-mltuquery-choice clearfix">' +
          		'<input class="cls-mltuquery-choice-edit" type="text" value=""/>' +
              '<span class="cls-mltuquery-choice-text"></span>' +
              '<span class="cls-mltuquery-choice-remove fa fa-trash-o"></span>' +
            '</li>',
    init: function() {
    	this.el.innerHTML = this.tp;
    	this.$field = this.$el.find('.cls-mltuquery-field');
    	this.$search = this.$el.find('.cls-mltuquery-search');
    	this.$multiple = this.$el.find('.cls-mltuquery-multiple');
    	this.$multipleUl = this.$el.find('.cls-mltuquery-ul');
    	this.$clear = this.$el.find('.cls-mltuquery-clear');
    	this.input = this.$el.find('.cls-mltuquery-input').get(0);
    	this.input.value = JSON.stringify([]);
    	this.input.name = this.name || '';
    	this.$clear.bind('click', e => {
    	  this.clear();
    	});
    	this.$multiple.bind('click', e => {
    		if(e.target == this.$multipleUl.get(0)) {
    			this.$field.focus();
    		}
    	});
    	this.$el.bind('keydown', e => {
    		if(e.keyCode == this.KEYS.ENTER) {
    			this.$field.focus();
    		}
    	});
    	this.$field.bind('keydown', e => {
    		if(e.keyCode == this.KEYS.DELETE || e.keyCode == this.KEYS.BACKSPACE) {
    			this.backspace(e);
    		}
    	});
    	this.$field.bind('keydown', e => {
    		if(e.keyCode == this.KEYS.ENTER) {
    			this.autoAddItem();
    		}
    	});
    	this.$field.bind('blur', e => {
    		this.autoAddItem();
    	});
    },
    /*load: function(item) {
    	alert(item);
    },*/
    clear: function() {
    	this.$multipleUl.find('.cls-mltuquery-choice').remove();
    	this.input.value = JSON.stringify([]);
    },
    getValue: function() {
    	return this.input.value;
    },
    update: function() {
    	let rs = [];
    	let items = this.$multipleUl.find('.cls-mltuquery-choice-edit');
    	for(let i = 0; i < items.length; i++) {
    		rs.push(items[i].value);
    	}
    	this.input.value = JSON.stringify(rs);
    },
    autoAddItem: function() {
    	var v = $.trim(this.$field.val());
    	if(v !== '') {
    		this.addItems(v);
    		this.$field.val('');
    	} else {
    		this.update();
    	}
    },
    addItems: function(item) {
    	var items;
    	if(item instanceof Array) {
    		items = item || [];
    	} else {
    		items = [item]
    	}
    	if(items.length) {
    		//var $el, $edit, $text, $remove;
    		for(let i = 0; i < items.length; i++) {
    			let $el = $(this.itemTp);
    			$el.insertBefore(this.$search);
    			//el.data('data', items[i]);
    			/*el.bind('click', function() {
    				//self.showEdit(this);
    				self.startEdit(this);
    			});*/
    			let $edit = $el.find('.cls-mltuquery-choice-edit');
    			let $text = $el.find('.cls-mltuquery-choice-text');
    			let $remove = $el.find('.cls-mltuquery-choice-remove');
    			$edit.val(items[i]);
    			$text.text(items[i]);
    			$edit.val(items[i]);
    			$remove.bind('click', e => this.removeItem([$el]));
    			$text.bind('click', e => this.startEdit($el));
    			$edit.bind('blur', e => this.endEdit($el));
    			//$el.find('.cls-mltuquery-choice-edit').bind('focus', e => this.focusHandle($el.get(0)));
      	}
    	}
    	this.update();
    },
    removeItem: function(item) {
    	if(item.length) {
    		for(var i = 0; i < item.length; i++) {
    			item[i].remove();
    		}
    	}
    	this.update();
    },
    startEdit: function(item) {
    	this.setItemState(item, true);
    },
    endEdit: function(item) {
    	this.setItemState(item, false);
    },
    setItemState: function(item, isEdit) {
    	let $edit = item.find('.cls-mltuquery-choice-edit');
    	let $text = item.find('.cls-mltuquery-choice-text');
    	let $remove = item.find('.cls-mltuquery-choice-remove');
    	$edit.css('visibility', isEdit ? 'visible' : 'hidden');
    	$text.css('visibility', isEdit ? 'hidden' : 'visible');
    	$remove.css('visibility', isEdit ? 'hidden' : 'visible');
    	if(isEdit) {
    		$edit.css('visibility', 'visible');
      	$text.css('visibility', 'hidden');
      	$remove.css('visibility', 'hidden');
    		$edit.focus();
    	} else {
    		$edit.css('visibility', 'hidden');
      	$text.css('visibility', 'visible');
      	$remove.css('visibility', 'visible');
      	let v = $.trim($edit.val());
      	if(v !== '') {
      		$text.text(v);
      		$edit.val(v)
      	} else {
      		item.remove();
      	}
      	this.update();
    	}
    },
    backspace: function(e) {
    	var v = this.$field.val();
    	if(v.length <= 0) {
    		var items = this.getItems();
    		var len = items.length;
    		if(len) {
    			var item = items[len - 1];
    			this.$field.val($(item).find('.cls-mltuquery-choice-edit').val());
    			item.remove();
    			e.preventDefault();
    		}
    	}
    },
    getItems: function() {
    	return this.$multiple.find('.cls-mltuquery-choice');
    },
    htmlEncode : function(value) {
	    return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	  },
    getDom: function(el) {
      if(!el) return null;
      return el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
    }
  };
  DBapp.ui.Multquery = Multquery;
})();
(function() {
	window.DBapp = DBapp;
})();
