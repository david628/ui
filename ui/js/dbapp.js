var DBapp = {};
(function() {
	DBapp = {
		ui : {},
		zIndex : 16000,
		zindex : 9000,
		MsgId : "____id-msg-box",
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
			var A = base.indexOf(B);
			if (A != -1) {
				arr.splice(A, 1);
			}
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
		}
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
		//openAnimationEffect : 'default-in',
		//closeAnimationEffect : 'default-out',
		//openAnimationEffect : 'rollIn',
		//closeAnimationEffect : 'rollOut',
		openAnimationEffect : "fadeInRight",
		closeAnimationEffect : "fadeOutRight",
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
			  '<div class="button-wrap">'+
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
	  	self.$bottonWrap = self.$el.find(".button-wrap");
	  	self.bottonWrap = self.$bottonWrap.get(0);
      self.setTitle(self.title);
      if(self.msg) {
        self.setContent(self.msg);
      }
      self.setButtonAlign(this.buttonAlign);
      //self.setSize(self.width, self.height);
      if(!self.mask) {
      	self.mask = document.createElement("div");
      	self.mask.className = "modal-box-mask";
      	document.body.appendChild(self.mask);
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
    setButtonAlign : function(pos) {
      if(this.bottonWrap) {
        this.bottonWrap.className = "button-wrap" + (pos ? " " + pos : "");
        //this.buttonAlign = pos;
        //this.$bottonWrap.addClass(this.buttonAlign);
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
	  	if(this.bottonWrap) {
	  		this.$bottonWrap.html("");
    	}
	  },
    addButton : function(btns) {
    	if(this.bottonWrap) {
    		for(var i=0;i<btns.length;i++) {
          var btn = jQuery('<a class="button" href="javascript:;">' + btns[i].text + '</a>');
          this.$bottonWrap.append(btn);
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
		      	$(dialog.bottonWrap.childNodes[config.button.length - 1]).trigger("click");
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
            cls : 'submit',
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
            cls : 'submit',
	          handle : function(event) {
	            this.hide();
	            if(handle) {
	              handle("yes");
	            }
	          }
	        }, {
	          text : this.buttonText.no,
            cls : 'cancel',
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
			this.$bottonWrap.html("");
		},
		addButton : function(arr) {
			for(var i=0;i<arr.length;i++) {
				this.$bottonWrap.append(arr[i]);
			}
		},
	  init : function(el, action, config) {
	  	var self = this;
	  	self.el = el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
	  	self.$el = jQuery(el);
	  	self.$bottonWrap = self.$el.find(".bottonWrap");
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
      '<span class="left total"></span>' +
      '<span class="right">' +
        '<a href="javascript:void(0);" class="btn limit"><i class="ico"></i></a>' +
        '<a href="javascript:void(0);" class="btn first"><i class="ico"></i></a>' +
        '<a href="javascript:void(0);" class="btn prev"><i class="ico"></i></a>' +
        '<a href="javascript:void(0);" class="btn next"><i class="ico"></i></a>' +
        '<a href="javascript:void(0);" class="btn last"><i class="ico"></i></a>' +
        '<input class="searchText"/><span class="totelPageText"></span>' +
        '<a href="javascript:void(0);" class="btn searchBtn"><i class="ico"></i></a>' +
      '</span>' +
    '</div>',
  	init : function(config) {
  		jQuery.extend(this, config);
  		var self = this;
  		self.param.offset = self.param.offset || 0;
  		self.param.limit = self.param.limit || 20;
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
    			return Dldh.inputNumber(e, this);
      	});
    		self.searchText.bind("keyup", function(e) {
    			Dldh.afterInputNumber(e, this, self.totalPage);
      	});
    		self.searchText.bind("blur", function(e) {
    			Dldh.afterInputNumber(e, this, self.totalPage);
      	});
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
    	this.setLimit(self.param.limit);
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
  		this.param.offset = 0;
  		this.param.limit = n;
  		this.limit.innerHTML = "每页" + n + "条";
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
				self.param.offset = (self.currentPage - 1) * self.param.limit;
				self.param.limit = self.param.limit;
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
				if(this.param.offset <= 0) {
					this.currentPage = 1;
				}
				this.totalPage = Math.ceil(totalPage / this.param.limit);
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
			this._offset = this.param.offset;
			this.setLimit(this.param.limit);
			this.searchText.value = this.currentPage;
			this.totalPageText.innerHTML = " / " + this.totalPage;
			this.total.innerHTML = "共计：" + totalPage + "条";
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
    checkCls : 'cls-grid-td-checker',
    numberCls : 'cls-grid-td-numberer',
    treeCls : 'cls-grid-td-tree',
    itemCheckedCls : 'cls-menu-item-checked',
    sortClasses : ['cls-grid-sort-asc', 'cls-grid-sort-desc'],
    hdTree : null,
    hdNumber : null,
    hdCheck : null,
    hdTreeWidth : 34,
    hdNumberWidth : 34,
    hdCheckWidth : 34,
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
        '<td class="cls-grid-col cls-grid-cell cls-grid-td-{id} {css}" tabIndex="0" title="{title}" {cellAttr} style="{style}">' +
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
      this.renderHeaders(this.cm);
      this.setSize(this.width, this.height);
      if(this.pageView) {
      	this.pageView.param = this.pageView.param || this.param;
      	this.viewPage = new ViewPage(this.pageView);
      }
      this.showNoData();
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
    renderHeaders : function(cm) {
    	//this.tableHd.style.width = this.getTotalWidth() + "px";
      //this.offsetHd.style.width = this.getOffsetWidth() + "px";
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
      var len = cm.length, last = len - 1, cssCls = this.hdCls + ' ' + this.cellCls, cls = cssCls, cell, split = [];
      for(var i = 0; i < len; i++) {
        /*if (i == 0) {
         cls = cssCls + ' ' + this.fisrtCellCls;
        } else {
          cls = (i == last ? cssCls + ' ' + this.lastCellCls : cssCls);
        }*/
        cell = document.createElement("td");
        cell.className = cls;
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
  	          	clone = this.currentHandle.cloneNode(true);
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
            /*if(this.cm[j].id !== "oper") {
            	rowChild.push('<div class="cls-form"><label class="cls-form-label">' + this.cm[j].header + '：</label><div class="cls-form-text cls-grid-rowChild-' + this.cm[j].dataStore + '">' + valueStr + '</div></div>');
            }*/
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
    afterOnTreeClick : function(e, target, opt) {},
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
            	clone = this.currentHandle.cloneNode(true);
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
    edit : {},
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
      }
      //this.stopEvent(e);
    },
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
    addRow : function() {
    	var row = {}, len = this.cm.length, value;
    	for(var i = 0;i < len; i++) {
    		//if(this.cm[i].renderFn) {
    			//value = this.cm[i].renderFn(this.cm[i].insertValue);
    		//} else {
    			value = this.cm[i].insertValue;
    		//}
    		row[this.cm[i].dataStore] = value;
    	}
    	this.doRender([row]);
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
    	if(this.mainBody.offsetHeight == 0 && data.length * 37 > parseInt(this.scroller.style.maxHeight, 10)) {
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
		timeout : false,
	  init : function(config) {
	  	jQuery.extend(this, config);
	    if(!this.obj) {
	    	this.obj = document.createElement("div");
	    	this.obj.className = "tip";
	    	document.body.appendChild(this.obj);
	    	this.obj = jQuery(this.obj);
	    }
	    this.hide();
	  },
	  setMsg : function(msg) {
	  	if(msg) {
	  		this.msg = msg;
	  	}
	  	this.obj.html('<div class="con">' + this.msg + '</div><span class="' + this.position + '"></span>');
	  },
	  show : function(el, msg, pos) {
	  	var self = this;
	  	self.el = jQuery(el);
	  	if(pos) {
	  		self.position = pos;
	  	}
	  	self.setMsg(msg);
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
		var timeout = config && config.timeout ? config.timeout : 3000;
		var notiserElement = $(document.createElement('div')).addClass('notiser ' + type).append(msg);
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
	/*!
	 * Select2 4.0.3
	 * https://select2.github.io
	 *
	 * Released under the MIT license
	 * https://github.com/select2/select2/blob/master/LICENSE.md
	 */
	(function (factory) {
	  if (typeof define === 'function' && define.amd) {
	    // AMD. Register as an anonymous module.
	    define(['jquery'], factory);
	  } else if (typeof exports === 'object') {
	    // Node/CommonJS
	    factory(require('jquery'));
	  } else {
	    // Browser globals
	    factory(jQuery);
	  }
	}(function (jQuery) {
	  // This is needed so we can catch the AMD loader configuration and use it
	  // The inner file should be wrapped (by `banner.start.js`) in a function that
	  // returns the AMD loader references.
	  var S2 =
	(function () {
	  // Restore the Select2 AMD loader so it can be used
	  // Needed mostly in the language files, where the loader is not inserted
	  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
	    var S2 = jQuery.fn.select2.amd;
	  }
	var S2;(function () { if (!S2 || !S2.requirejs) {
	if (!S2) { S2 = {}; } else { require = S2; }
	/**
	 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
	 * Available via the MIT or new BSD license.
	 * see: http://github.com/jrburke/almond for details
	 */
	//Going sloppy to avoid 'use strict' string cost, but strict practices should
	//be followed.
	/*jslint sloppy: true */
	/*global setTimeout: false */

	var requirejs, require, define;
	(function (undef) {
	    var main, req, makeMap, handlers,
	        defined = {},
	        waiting = {},
	        config = {},
	        defining = {},
	        hasOwn = Object.prototype.hasOwnProperty,
	        aps = [].slice,
	        jsSuffixRegExp = /\.js$/;

	    function hasProp(obj, prop) {
	        return hasOwn.call(obj, prop);
	    }

	    /**
	     * Given a relative module name, like ./something, normalize it to
	     * a real name that can be mapped to a path.
	     * @param {String} name the relative name
	     * @param {String} baseName a real name that the name arg is relative
	     * to.
	     * @returns {String} normalized name
	     */
	    function normalize(name, baseName) {
	        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
	            foundI, foundStarMap, starI, i, j, part,
	            baseParts = baseName && baseName.split("/"),
	            map = config.map,
	            starMap = (map && map['*']) || {};

	        //Adjust any relative paths.
	        if (name && name.charAt(0) === ".") {
	            //If have a base name, try to normalize against it,
	            //otherwise, assume it is a top-level require that will
	            //be relative to baseUrl in the end.
	            if (baseName) {
	                name = name.split('/');
	                lastIndex = name.length - 1;

	                // Node .js allowance:
	                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
	                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
	                }

	                //Lop off the last part of baseParts, so that . matches the
	                //"directory" and not name of the baseName's module. For instance,
	                //baseName of "one/two/three", maps to "one/two/three.js", but we
	                //want the directory, "one/two" for this normalization.
	                name = baseParts.slice(0, baseParts.length - 1).concat(name);

	                //start trimDots
	                for (i = 0; i < name.length; i += 1) {
	                    part = name[i];
	                    if (part === ".") {
	                        name.splice(i, 1);
	                        i -= 1;
	                    } else if (part === "..") {
	                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
	                            //End of the line. Keep at least one non-dot
	                            //path segment at the front so it can be mapped
	                            //correctly to disk. Otherwise, there is likely
	                            //no path mapping for a path starting with '..'.
	                            //This can still fail, but catches the most reasonable
	                            //uses of ..
	                            break;
	                        } else if (i > 0) {
	                            name.splice(i - 1, 2);
	                            i -= 2;
	                        }
	                    }
	                }
	                //end trimDots

	                name = name.join("/");
	            } else if (name.indexOf('./') === 0) {
	                // No baseName, so this is ID is resolved relative
	                // to baseUrl, pull off the leading dot.
	                name = name.substring(2);
	            }
	        }

	        //Apply map config if available.
	        if ((baseParts || starMap) && map) {
	            nameParts = name.split('/');

	            for (i = nameParts.length; i > 0; i -= 1) {
	                nameSegment = nameParts.slice(0, i).join("/");

	                if (baseParts) {
	                    //Find the longest baseName segment match in the config.
	                    //So, do joins on the biggest to smallest lengths of baseParts.
	                    for (j = baseParts.length; j > 0; j -= 1) {
	                        mapValue = map[baseParts.slice(0, j).join('/')];

	                        //baseName segment has  config, find if it has one for
	                        //this name.
	                        if (mapValue) {
	                            mapValue = mapValue[nameSegment];
	                            if (mapValue) {
	                                //Match, update name to the new value.
	                                foundMap = mapValue;
	                                foundI = i;
	                                break;
	                            }
	                        }
	                    }
	                }

	                if (foundMap) {
	                    break;
	                }

	                //Check for a star map match, but just hold on to it,
	                //if there is a shorter segment match later in a matching
	                //config, then favor over this star map.
	                if (!foundStarMap && starMap && starMap[nameSegment]) {
	                    foundStarMap = starMap[nameSegment];
	                    starI = i;
	                }
	            }

	            if (!foundMap && foundStarMap) {
	                foundMap = foundStarMap;
	                foundI = starI;
	            }

	            if (foundMap) {
	                nameParts.splice(0, foundI, foundMap);
	                name = nameParts.join('/');
	            }
	        }

	        return name;
	    }

	    function makeRequire(relName, forceSync) {
	        return function () {
	            //A version of a require function that passes a moduleName
	            //value for items that may need to
	            //look up paths relative to the moduleName
	            var args = aps.call(arguments, 0);

	            //If first arg is not require('string'), and there is only
	            //one arg, it is the array form without a callback. Insert
	            //a null so that the following concat is correct.
	            if (typeof args[0] !== 'string' && args.length === 1) {
	                args.push(null);
	            }
	            return req.apply(undef, args.concat([relName, forceSync]));
	        };
	    }

	    function makeNormalize(relName) {
	        return function (name) {
	            return normalize(name, relName);
	        };
	    }

	    function makeLoad(depName) {
	        return function (value) {
	            defined[depName] = value;
	        };
	    }

	    function callDep(name) {
	        if (hasProp(waiting, name)) {
	            var args = waiting[name];
	            delete waiting[name];
	            defining[name] = true;
	            main.apply(undef, args);
	        }

	        if (!hasProp(defined, name) && !hasProp(defining, name)) {
	            throw new Error('No ' + name);
	        }
	        return defined[name];
	    }

	    //Turns a plugin!resource to [plugin, resource]
	    //with the plugin being undefined if the name
	    //did not have a plugin prefix.
	    function splitPrefix(name) {
	        var prefix,
	            index = name ? name.indexOf('!') : -1;
	        if (index > -1) {
	            prefix = name.substring(0, index);
	            name = name.substring(index + 1, name.length);
	        }
	        return [prefix, name];
	    }

	    /**
	     * Makes a name map, normalizing the name, and using a plugin
	     * for normalization if necessary. Grabs a ref to plugin
	     * too, as an optimization.
	     */
	    makeMap = function (name, relName) {
	        var plugin,
	            parts = splitPrefix(name),
	            prefix = parts[0];

	        name = parts[1];

	        if (prefix) {
	            prefix = normalize(prefix, relName);
	            plugin = callDep(prefix);
	        }

	        //Normalize according
	        if (prefix) {
	            if (plugin && plugin.normalize) {
	                name = plugin.normalize(name, makeNormalize(relName));
	            } else {
	                name = normalize(name, relName);
	            }
	        } else {
	            name = normalize(name, relName);
	            parts = splitPrefix(name);
	            prefix = parts[0];
	            name = parts[1];
	            if (prefix) {
	                plugin = callDep(prefix);
	            }
	        }

	        //Using ridiculous property names for space reasons
	        return {
	            f: prefix ? prefix + '!' + name : name, //fullName
	            n: name,
	            pr: prefix,
	            p: plugin
	        };
	    };

	    function makeConfig(name) {
	        return function () {
	            return (config && config.config && config.config[name]) || {};
	        };
	    }

	    handlers = {
	        require: function (name) {
	            return makeRequire(name);
	        },
	        exports: function (name) {
	            var e = defined[name];
	            if (typeof e !== 'undefined') {
	                return e;
	            } else {
	                return (defined[name] = {});
	            }
	        },
	        module: function (name) {
	            return {
	                id: name,
	                uri: '',
	                exports: defined[name],
	                config: makeConfig(name)
	            };
	        }
	    };

	    main = function (name, deps, callback, relName) {
	        var cjsModule, depName, ret, map, i,
	            args = [],
	            callbackType = typeof callback,
	            usingExports;

	        //Use name if no relName
	        relName = relName || name;

	        //Call the callback to define the module, if necessary.
	        if (callbackType === 'undefined' || callbackType === 'function') {
	            //Pull out the defined dependencies and pass the ordered
	            //values to the callback.
	            //Default to [require, exports, module] if no deps
	            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
	            for (i = 0; i < deps.length; i += 1) {
	                map = makeMap(deps[i], relName);
	                depName = map.f;

	                //Fast path CommonJS standard dependencies.
	                if (depName === "require") {
	                    args[i] = handlers.require(name);
	                } else if (depName === "exports") {
	                    //CommonJS module spec 1.1
	                    args[i] = handlers.exports(name);
	                    usingExports = true;
	                } else if (depName === "module") {
	                    //CommonJS module spec 1.1
	                    cjsModule = args[i] = handlers.module(name);
	                } else if (hasProp(defined, depName) ||
	                           hasProp(waiting, depName) ||
	                           hasProp(defining, depName)) {
	                    args[i] = callDep(depName);
	                } else if (map.p) {
	                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
	                    args[i] = defined[depName];
	                } else {
	                    throw new Error(name + ' missing ' + depName);
	                }
	            }

	            ret = callback ? callback.apply(defined[name], args) : undefined;

	            if (name) {
	                //If setting exports via "module" is in play,
	                //favor that over return value and exports. After that,
	                //favor a non-undefined return value over exports use.
	                if (cjsModule && cjsModule.exports !== undef &&
	                        cjsModule.exports !== defined[name]) {
	                    defined[name] = cjsModule.exports;
	                } else if (ret !== undef || !usingExports) {
	                    //Use the return value from the function.
	                    defined[name] = ret;
	                }
	            }
	        } else if (name) {
	            //May just be an object definition for the module. Only
	            //worry about defining if have a module name.
	            defined[name] = callback;
	        }
	    };

	    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
	        if (typeof deps === "string") {
	            if (handlers[deps]) {
	                //callback in this case is really relName
	                return handlers[deps](callback);
	            }
	            //Just return the module wanted. In this scenario, the
	            //deps arg is the module name, and second arg (if passed)
	            //is just the relName.
	            //Normalize module name, if it contains . or ..
	            return callDep(makeMap(deps, callback).f);
	        } else if (!deps.splice) {
	            //deps is a config object, not an array.
	            config = deps;
	            if (config.deps) {
	                req(config.deps, config.callback);
	            }
	            if (!callback) {
	                return;
	            }

	            if (callback.splice) {
	                //callback is an array, which means it is a dependency list.
	                //Adjust args if there are dependencies
	                deps = callback;
	                callback = relName;
	                relName = null;
	            } else {
	                deps = undef;
	            }
	        }

	        //Support require(['a'])
	        callback = callback || function () {};

	        //If relName is a function, it is an errback handler,
	        //so remove it.
	        if (typeof relName === 'function') {
	            relName = forceSync;
	            forceSync = alt;
	        }

	        //Simulate async callback;
	        if (forceSync) {
	            main(undef, deps, callback, relName);
	        } else {
	            //Using a non-zero value because of concern for what old browsers
	            //do, and latest browsers "upgrade" to 4 if lower value is used:
	            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
	            //If want a value immediately, use require('id') instead -- something
	            //that works in almond on the global level, but not guaranteed and
	            //unlikely to work in other AMD implementations.
	            setTimeout(function () {
	                main(undef, deps, callback, relName);
	            }, 4);
	        }

	        return req;
	    };

	    /**
	     * Just drops the config on the floor, but returns req in case
	     * the config return value is used.
	     */
	    req.config = function (cfg) {
	        return req(cfg);
	    };

	    /**
	     * Expose module registry for debugging and tooling
	     */
	    requirejs._defined = defined;

	    define = function (name, deps, callback) {
	        if (typeof name !== 'string') {
	            throw new Error('See almond README: incorrect module build, no module name');
	        }

	        //This module may not have dependencies
	        if (!deps.splice) {
	            //deps is not an array, so probably means
	            //an object literal or factory function for
	            //the value. Adjust args.
	            callback = deps;
	            deps = [];
	        }

	        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
	            waiting[name] = [name, deps, callback];
	        }
	    };

	    define.amd = {
	        jQuery: true
	    };
	}());

	S2.requirejs = requirejs;S2.require = require;S2.define = define;
	}
	}());
	S2.define("almond", function(){});

	/* global jQuery:false, $:false */
	S2.define('jquery',[],function () {
	  var _$ = jQuery || $;

	  if (_$ == null && console && console.error) {
	    console.error(
	      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
	      'found. Make sure that you are including jQuery before Select2 on your ' +
	      'web page.'
	    );
	  }

	  return _$;
	});

	S2.define('select2/utils',[
	  'jquery'
	], function ($) {
	  var Utils = {};

	  Utils.Extend = function (ChildClass, SuperClass) {
	    var __hasProp = {}.hasOwnProperty;

	    function BaseConstructor () {
	      this.constructor = ChildClass;
	    }

	    for (var key in SuperClass) {
	      if (__hasProp.call(SuperClass, key)) {
	        ChildClass[key] = SuperClass[key];
	      }
	    }

	    BaseConstructor.prototype = SuperClass.prototype;
	    ChildClass.prototype = new BaseConstructor();
	    ChildClass.__super__ = SuperClass.prototype;

	    return ChildClass;
	  };

	  function getMethods (theClass) {
	    var proto = theClass.prototype;

	    var methods = [];

	    for (var methodName in proto) {
	      var m = proto[methodName];

	      if (typeof m !== 'function') {
	        continue;
	      }

	      if (methodName === 'constructor') {
	        continue;
	      }

	      methods.push(methodName);
	    }

	    return methods;
	  }

	  Utils.Decorate = function (SuperClass, DecoratorClass) {
	    var decoratedMethods = getMethods(DecoratorClass);
	    var superMethods = getMethods(SuperClass);

	    function DecoratedClass () {
	      var unshift = Array.prototype.unshift;

	      var argCount = DecoratorClass.prototype.constructor.length;

	      var calledConstructor = SuperClass.prototype.constructor;

	      if (argCount > 0) {
	        unshift.call(arguments, SuperClass.prototype.constructor);

	        calledConstructor = DecoratorClass.prototype.constructor;
	      }

	      calledConstructor.apply(this, arguments);
	    }

	    DecoratorClass.displayName = SuperClass.displayName;

	    function ctr () {
	      this.constructor = DecoratedClass;
	    }

	    DecoratedClass.prototype = new ctr();

	    for (var m = 0; m < superMethods.length; m++) {
	        var superMethod = superMethods[m];

	        DecoratedClass.prototype[superMethod] =
	          SuperClass.prototype[superMethod];
	    }

	    var calledMethod = function (methodName) {
	      // Stub out the original method if it's not decorating an actual method
	      var originalMethod = function () {};

	      if (methodName in DecoratedClass.prototype) {
	        originalMethod = DecoratedClass.prototype[methodName];
	      }

	      var decoratedMethod = DecoratorClass.prototype[methodName];

	      return function () {
	        var unshift = Array.prototype.unshift;

	        unshift.call(arguments, originalMethod);

	        return decoratedMethod.apply(this, arguments);
	      };
	    };

	    for (var d = 0; d < decoratedMethods.length; d++) {
	      var decoratedMethod = decoratedMethods[d];

	      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
	    }

	    return DecoratedClass;
	  };

	  var Observable = function () {
	    this.listeners = {};
	  };

	  Observable.prototype.on = function (event, callback) {
	    this.listeners = this.listeners || {};

	    if (event in this.listeners) {
	      this.listeners[event].push(callback);
	    } else {
	      this.listeners[event] = [callback];
	    }
	  };

	  Observable.prototype.trigger = function (event) {
	    var slice = Array.prototype.slice;
	    var params = slice.call(arguments, 1);

	    this.listeners = this.listeners || {};

	    // Params should always come in as an array
	    if (params == null) {
	      params = [];
	    }

	    // If there are no arguments to the event, use a temporary object
	    if (params.length === 0) {
	      params.push({});
	    }

	    // Set the `_type` of the first object to the event
	    params[0]._type = event;

	    if (event in this.listeners) {
	      this.invoke(this.listeners[event], slice.call(arguments, 1));
	    }

	    if ('*' in this.listeners) {
	      this.invoke(this.listeners['*'], arguments);
	    }
	  };

	  Observable.prototype.invoke = function (listeners, params) {
	    for (var i = 0, len = listeners.length; i < len; i++) {
	      listeners[i].apply(this, params);
	    }
	  };

	  Utils.Observable = Observable;

	  Utils.generateChars = function (length) {
	    var chars = '';

	    for (var i = 0; i < length; i++) {
	      var randomChar = Math.floor(Math.random() * 36);
	      chars += randomChar.toString(36);
	    }

	    return chars;
	  };

	  Utils.bind = function (func, context) {
	    return function () {
	      func.apply(context, arguments);
	    };
	  };

	  Utils._convertData = function (data) {
	    for (var originalKey in data) {
	      var keys = originalKey.split('-');

	      var dataLevel = data;

	      if (keys.length === 1) {
	        continue;
	      }

	      for (var k = 0; k < keys.length; k++) {
	        var key = keys[k];

	        // Lowercase the first letter
	        // By default, dash-separated becomes camelCase
	        key = key.substring(0, 1).toLowerCase() + key.substring(1);

	        if (!(key in dataLevel)) {
	          dataLevel[key] = {};
	        }

	        if (k == keys.length - 1) {
	          dataLevel[key] = data[originalKey];
	        }

	        dataLevel = dataLevel[key];
	      }

	      delete data[originalKey];
	    }

	    return data;
	  };

	  Utils.hasScroll = function (index, el) {
	    // Adapted from the function created by @ShadowScripter
	    // and adapted by @BillBarry on the Stack Exchange Code Review website.
	    // The original code can be found at
	    // http://codereview.stackexchange.com/q/13338
	    // and was designed to be used with the Sizzle selector engine.

	    var $el = $(el);
	    var overflowX = el.style.overflowX;
	    var overflowY = el.style.overflowY;

	    //Check both x and y declarations
	    if (overflowX === overflowY &&
	        (overflowY === 'hidden' || overflowY === 'visible')) {
	      return false;
	    }

	    if (overflowX === 'scroll' || overflowY === 'scroll') {
	      return true;
	    }

	    return ($el.innerHeight() < el.scrollHeight ||
	      $el.innerWidth() < el.scrollWidth);
	  };

	  Utils.escapeMarkup = function (markup) {
	    var replaceMap = {
	      '\\': '&#92;',
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '"': '&quot;',
	      '\'': '&#39;',
	      '/': '&#47;'
	    };

	    // Do not try to escape the markup if it's not a string
	    if (typeof markup !== 'string') {
	      return markup;
	    }

	    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
	      return replaceMap[match];
	    });
	  };

	  // Append an array of jQuery nodes to a given element.
	  Utils.appendMany = function ($element, $nodes) {
	    // jQuery 1.7.x does not support $.fn.append() with an array
	    // Fall back to a jQuery object collection using $.fn.add()
	    if ($.fn.jquery.substr(0, 3) === '1.7') {
	      var $jqNodes = $();

	      $.map($nodes, function (node) {
	        $jqNodes = $jqNodes.add(node);
	      });

	      $nodes = $jqNodes;
	    }

	    $element.append($nodes);
	  };

	  return Utils;
	});

	S2.define('select2/results',[
	  'jquery',
	  './utils'
	], function ($, Utils) {
	  function Results ($element, options, dataAdapter) {
	    this.$element = $element;
	    this.data = dataAdapter;
	    this.options = options;

	    Results.__super__.constructor.call(this);
	  }

	  Utils.Extend(Results, Utils.Observable);

	  Results.prototype.render = function () {
	    var $results = $(
	      '<ul class="select2-results__options" role="tree"></ul>'
	    );

	    if (this.options.get('multiple')) {
	      $results.attr('aria-multiselectable', 'true');
	    }

	    this.$results = $results;

	    return $results;
	  };

	  Results.prototype.clear = function () {
	    this.$results.empty();
	  };

	  Results.prototype.displayMessage = function (params) {
	    var escapeMarkup = this.options.get('escapeMarkup');

	    this.clear();
	    this.hideLoading();

	    var $message = $(
	      '<li role="treeitem" aria-live="assertive"' +
	      ' class="select2-results__option"></li>'
	    );

	    var message = this.options.get('translations').get(params.message);

	    $message.append(
	      escapeMarkup(
	        message(params.args)
	      )
	    );

	    $message[0].className += ' select2-results__message';

	    this.$results.append($message);
	  };

	  Results.prototype.hideMessages = function () {
	    this.$results.find('.select2-results__message').remove();
	  };

	  Results.prototype.append = function (data) {
	    this.hideLoading();

	    var $options = [];

	    if (data.results == null || data.results.length === 0) {
	      if (this.$results.children().length === 0) {
	        this.trigger('results:message', {
	          message: 'noResults'
	        });
	      }

	      return;
	    }

	    data.results = this.sort(data.results);

	    for (var d = 0; d < data.results.length; d++) {
	      var item = data.results[d];

	      var $option = this.option(item);

	      $options.push($option);
	    }

	    this.$results.append($options);
	  };

	  Results.prototype.position = function ($results, $dropdown) {
	    var $resultsContainer = $dropdown.find('.select2-results');
	    $resultsContainer.append($results);
	  };

	  Results.prototype.sort = function (data) {
	    var sorter = this.options.get('sorter');

	    return sorter(data);
	  };

	  Results.prototype.highlightFirstItem = function () {
	    var $options = this.$results
	      .find('.select2-results__option[aria-selected]');

	    var $selected = $options.filter('[aria-selected=true]');

	    // Check if there are any selected options
	    if ($selected.length > 0) {
	      // If there are selected options, highlight the first
	      $selected.first().trigger('mouseenter');
	    } else {
	      // If there are no selected options, highlight the first option
	      // in the dropdown
	      $options.first().trigger('mouseenter');
	    }

	    this.ensureHighlightVisible();
	  };

	  Results.prototype.setClasses = function () {
	    var self = this;

	    this.data.current(function (selected) {
	      var selectedIds = $.map(selected, function (s) {
	        return s.id.toString();
	      });

	      var $options = self.$results
	        .find('.select2-results__option[aria-selected]');

	      $options.each(function () {
	        var $option = $(this);

	        var item = $.data(this, 'data');

	        // id needs to be converted to a string when comparing
	        var id = '' + item.id;

	        if ((item.element != null && item.element.selected) ||
	            (item.element == null && $.inArray(id, selectedIds) > -1)) {
	          $option.attr('aria-selected', 'true');
	        } else {
	          $option.attr('aria-selected', 'false');
	        }
	      });

	    });
	  };

	  Results.prototype.showLoading = function (params) {
	    this.hideLoading();

	    var loadingMore = this.options.get('translations').get('searching');

	    var loading = {
	      disabled: true,
	      loading: true,
	      text: loadingMore(params)
	    };
	    var $loading = this.option(loading);
	    $loading.className += ' loading-results';

	    this.$results.prepend($loading);
	  };

	  Results.prototype.hideLoading = function () {
	    this.$results.find('.loading-results').remove();
	  };

	  Results.prototype.option = function (data) {
	    var option = document.createElement('li');
	    option.className = 'select2-results__option';

	    var attrs = {
	      'role': 'treeitem',
	      'aria-selected': 'false'
	    };

	    if (data.disabled) {
	      delete attrs['aria-selected'];
	      attrs['aria-disabled'] = 'true';
	    }

	    if (data.id == null) {
	      delete attrs['aria-selected'];
	    }

	    if (data._resultId != null) {
	      option.id = data._resultId;
	    }

	    if (data.title) {
	      option.title = data.title;
	    }

	    if (data.children) {
	      attrs.role = 'group';
	      attrs['aria-label'] = data.text;
	      delete attrs['aria-selected'];
	    }

	    for (var attr in attrs) {
	      var val = attrs[attr];

	      option.setAttribute(attr, val);
	    }

	    if (data.children) {
	      var $option = $(option);

	      var label = document.createElement('strong');
	      label.className = 'select2-results__group';

	      var $label = $(label);
	      this.template(data, label);

	      var $children = [];

	      for (var c = 0; c < data.children.length; c++) {
	        var child = data.children[c];

	        var $child = this.option(child);

	        $children.push($child);
	      }

	      var $childrenContainer = $('<ul></ul>', {
	        'class': 'select2-results__options select2-results__options--nested'
	      });

	      $childrenContainer.append($children);

	      $option.append(label);
	      $option.append($childrenContainer);
	    } else {
	      this.template(data, option);
	    }

	    $.data(option, 'data', data);

	    return option;
	  };

	  Results.prototype.bind = function (container, $container) {
	    var self = this;

	    var id = container.id + '-results';

	    this.$results.attr('id', id);

	    container.on('results:all', function (params) {
	      self.clear();
	      self.append(params.data);

	      if (container.isOpen()) {
	        self.setClasses();
	        self.highlightFirstItem();
	      }
	    });

	    container.on('results:append', function (params) {
	      self.append(params.data);

	      if (container.isOpen()) {
	        self.setClasses();
	      }
	    });

	    container.on('query', function (params) {
	      self.hideMessages();
	      self.showLoading(params);
	    });

	    container.on('select', function () {
	      if (!container.isOpen()) {
	        return;
	      }
	      self.setClasses();
	      self.highlightFirstItem();
	    });

	    container.on('unselect', function () {
	      if (!container.isOpen()) {
	        return;
	      }

	      self.setClasses();
	      self.highlightFirstItem();
	    });

	    container.on('open', function () {
	      // When the dropdown is open, aria-expended="true"
	      self.$results.attr('aria-expanded', 'true');
	      self.$results.attr('aria-hidden', 'false');

	      self.setClasses();
	      self.ensureHighlightVisible();
	    });

	    container.on('close', function () {
	      // When the dropdown is closed, aria-expended="false"
	      self.$results.attr('aria-expanded', 'false');
	      self.$results.attr('aria-hidden', 'true');
	      self.$results.removeAttr('aria-activedescendant');
	    });

	    container.on('results:toggle', function () {
	      var $highlighted = self.getHighlightedResults();

	      if ($highlighted.length === 0) {
	        return;
	      }

	      $highlighted.trigger('mouseup');
	    });

	    container.on('results:select', function () {
	      var $highlighted = self.getHighlightedResults();
	      if ($highlighted.length === 0) {
	        return;
	      }

	      var data = $highlighted.data('data');
	      if ($highlighted.attr('aria-selected') == 'true') {
	        self.trigger('close', {});
	      } else {
	        self.trigger('select', {
	          data: data
	        });
	      }
	    });

	    container.on('results:previous', function () {
	      var $highlighted = self.getHighlightedResults();

	      var $options = self.$results.find('[aria-selected]');

	      var currentIndex = $options.index($highlighted);

	      // If we are already at te top, don't move further
	      if (currentIndex === 0) {
	        return;
	      }

	      var nextIndex = currentIndex - 1;

	      // If none are highlighted, highlight the first
	      if ($highlighted.length === 0) {
	        nextIndex = 0;
	      }

	      var $next = $options.eq(nextIndex);

	      $next.trigger('mouseenter');

	      var currentOffset = self.$results.offset().top;
	      var nextTop = $next.offset().top;
	      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

	      if (nextIndex === 0) {
	        self.$results.scrollTop(0);
	      } else if (nextTop - currentOffset < 0) {
	        self.$results.scrollTop(nextOffset);
	      }
	    });

	    container.on('results:next', function () {
	      var $highlighted = self.getHighlightedResults();

	      var $options = self.$results.find('[aria-selected]');

	      var currentIndex = $options.index($highlighted);

	      var nextIndex = currentIndex + 1;

	      // If we are at the last option, stay there
	      if (nextIndex >= $options.length) {
	        return;
	      }

	      var $next = $options.eq(nextIndex);

	      $next.trigger('mouseenter');

	      var currentOffset = self.$results.offset().top +
	        self.$results.outerHeight(false);
	      var nextBottom = $next.offset().top + $next.outerHeight(false);
	      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

	      if (nextIndex === 0) {
	        self.$results.scrollTop(0);
	      } else if (nextBottom > currentOffset) {
	        self.$results.scrollTop(nextOffset);
	      }
	    });

	    container.on('results:focus', function (params) {
	      params.element.addClass('select2-results__option--highlighted');
	    });

	    container.on('results:message', function (params) {
	      self.displayMessage(params);
	    });

	    if ($.fn.mousewheel) {
	      this.$results.on('mousewheel', function (e) {
	        var top = self.$results.scrollTop();

	        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

	        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
	        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

	        if (isAtTop) {
	          self.$results.scrollTop(0);

	          e.preventDefault();
	          e.stopPropagation();
	        } else if (isAtBottom) {
	          self.$results.scrollTop(
	            self.$results.get(0).scrollHeight - self.$results.height()
	          );

	          e.preventDefault();
	          e.stopPropagation();
	        }
	      });
	    }

	    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
	      function (evt) {
	      var $this = $(this);

	      var data = $this.data('data');

	      if ($this.attr('aria-selected') === 'true') {
	        if (self.options.get('multiple')) {
	          self.trigger('unselect', {
	            originalEvent: evt,
	            data: data
	          });
	        } else {
	          self.trigger('close', {});
	        }

	        return;
	      }

	      self.trigger('select', {
	        originalEvent: evt,
	        data: data
	      });
	    });

	    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
	      function (evt) {
	      var data = $(this).data('data');

	      self.getHighlightedResults()
	          .removeClass('select2-results__option--highlighted');

	      self.trigger('results:focus', {
	        data: data,
	        element: $(this)
	      });
	    });
	  };

	  Results.prototype.getHighlightedResults = function () {
	    var $highlighted = this.$results
	    .find('.select2-results__option--highlighted');

	    return $highlighted;
	  };

	  Results.prototype.destroy = function () {
	    this.$results.remove();
	  };

	  Results.prototype.ensureHighlightVisible = function () {
	    var $highlighted = this.getHighlightedResults();

	    if ($highlighted.length === 0) {
	      return;
	    }

	    var $options = this.$results.find('[aria-selected]');

	    var currentIndex = $options.index($highlighted);

	    var currentOffset = this.$results.offset().top;
	    var nextTop = $highlighted.offset().top;
	    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

	    var offsetDelta = nextTop - currentOffset;
	    nextOffset -= $highlighted.outerHeight(false) * 2;

	    if (currentIndex <= 2) {
	      this.$results.scrollTop(0);
	    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
	      this.$results.scrollTop(nextOffset);
	    }
	  };

	  Results.prototype.template = function (result, container) {
	    var template = this.options.get('templateResult');
	    var escapeMarkup = this.options.get('escapeMarkup');

	    var content = template(result, container);

	    if (content == null) {
	      container.style.display = 'none';
	    } else if (typeof content === 'string') {
	      container.innerHTML = escapeMarkup(content);
	    } else {
	      $(container).append(content);
	    }
	  };

	  return Results;
	});

	S2.define('select2/keys',[

	], function () {
	  var KEYS = {
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
	  };

	  return KEYS;
	});

	S2.define('select2/selection/base',[
	  'jquery',
	  '../utils',
	  '../keys'
	], function ($, Utils, KEYS) {
	  function BaseSelection ($element, options) {
	    this.$element = $element;
	    this.options = options;

	    BaseSelection.__super__.constructor.call(this);
	  }

	  Utils.Extend(BaseSelection, Utils.Observable);

	  BaseSelection.prototype.render = function () {
	    var $selection = $(
	      '<span class="select2-selection" role="combobox" ' +
	      ' aria-haspopup="true" aria-expanded="false">' +
	      '</span>'
	    );

	    this._tabindex = 0;

	    if (this.$element.data('old-tabindex') != null) {
	      this._tabindex = this.$element.data('old-tabindex');
	    } else if (this.$element.attr('tabindex') != null) {
	      this._tabindex = this.$element.attr('tabindex');
	    }

	    $selection.attr('title', this.$element.attr('title'));
	    $selection.attr('tabindex', this._tabindex);

	    this.$selection = $selection;

	    return $selection;
	  };

	  BaseSelection.prototype.bind = function (container, $container) {
	    var self = this;

	    var id = container.id + '-container';
	    var resultsId = container.id + '-results';

	    this.container = container;

	    this.$selection.on('focus', function (evt) {
	      self.trigger('focus', evt);
	    });

	    this.$selection.on('blur', function (evt) {
	      self._handleBlur(evt);
	    });

	    this.$selection.on('keydown', function (evt) {
	      self.trigger('keypress', evt);

	      if (evt.which === KEYS.SPACE) {
	        evt.preventDefault();
	      }
	    });

	    container.on('results:focus', function (params) {
	      self.$selection.attr('aria-activedescendant', params.data._resultId);
	    });

	    container.on('selection:update', function (params) {
	      self.update(params.data);
	    });

	    container.on('open', function () {
	      // When the dropdown is open, aria-expanded="true"
	      self.$selection.attr('aria-expanded', 'true');
	      self.$selection.attr('aria-owns', resultsId);

	      self._attachCloseHandler(container);
	    });

	    container.on('close', function () {
	      // When the dropdown is closed, aria-expanded="false"
	      self.$selection.attr('aria-expanded', 'false');
	      self.$selection.removeAttr('aria-activedescendant');
	      self.$selection.removeAttr('aria-owns');

	      self.$selection.focus();

	      self._detachCloseHandler(container);
	    });

	    container.on('enable', function () {
	      self.$selection.attr('tabindex', self._tabindex);
	    });

	    container.on('disable', function () {
	      self.$selection.attr('tabindex', '-1');
	    });
	  };

	  BaseSelection.prototype._handleBlur = function (evt) {
	    var self = this;

	    // This needs to be delayed as the active element is the body when the tab
	    // key is pressed, possibly along with others.
	    window.setTimeout(function () {
	      // Don't trigger `blur` if the focus is still in the selection
	      if (
	        (document.activeElement == self.$selection[0]) ||
	        ($.contains(self.$selection[0], document.activeElement))
	      ) {
	        return;
	      }

	      self.trigger('blur', evt);
	    }, 1);
	  };

	  BaseSelection.prototype._attachCloseHandler = function (container) {
	    var self = this;

	    $(document.body).on('mousedown.select2.' + container.id, function (e) {
	      var $target = $(e.target);

	      var $select = $target.closest('.select2');

	      var $all = $('.select2.select2-container--open');

	      $all.each(function () {
	        var $this = $(this);

	        if (this == $select[0]) {
	          return;
	        }

	        var $element = $this.data('element');

	        $element.select2('close');
	      });
	    });
	  };

	  BaseSelection.prototype._detachCloseHandler = function (container) {
	    $(document.body).off('mousedown.select2.' + container.id);
	  };

	  BaseSelection.prototype.position = function ($selection, $container) {
	    var $selectionContainer = $container.find('.selection');
	    $selectionContainer.append($selection);
	  };

	  BaseSelection.prototype.destroy = function () {
	    this._detachCloseHandler(this.container);
	  };

	  BaseSelection.prototype.update = function (data) {
	    throw new Error('The `update` method must be defined in child classes.');
	  };

	  return BaseSelection;
	});

	S2.define('select2/selection/single',[
	  'jquery',
	  './base',
	  '../utils',
	  '../keys'
	], function ($, BaseSelection, Utils, KEYS) {
	  function SingleSelection () {
	    SingleSelection.__super__.constructor.apply(this, arguments);
	  }

	  Utils.Extend(SingleSelection, BaseSelection);

	  SingleSelection.prototype.render = function () {
	    var $selection = SingleSelection.__super__.render.call(this);

	    $selection.addClass('select2-selection--single');

	    $selection.html(
	      '<span class="select2-selection__rendered"></span>' +
	      '<span class="select2-selection__arrow" role="presentation">' +
	        '<b role="presentation"></b>' +
	      '</span>'
	    );

	    return $selection;
	  };

	  SingleSelection.prototype.bind = function (container, $container) {
	    var self = this;

	    SingleSelection.__super__.bind.apply(this, arguments);

	    var id = container.id + '-container';

	    this.$selection.find('.select2-selection__rendered').attr('id', id);
	    this.$selection.attr('aria-labelledby', id);

	    this.$selection.on('mousedown', function (evt) {
	      // Only respond to left clicks
	      if (evt.which !== 1) {
	        return;
	      }

	      self.trigger('toggle', {
	        originalEvent: evt
	      });
	    });

	    this.$selection.on('focus', function (evt) {
	      // User focuses on the container
	    });

	    this.$selection.on('blur', function (evt) {
	      // User exits the container
	    });

	    container.on('focus', function (evt) {
	      if (!container.isOpen()) {
	        self.$selection.focus();
	      }
	    });

	    container.on('selection:update', function (params) {
	      self.update(params.data);
	    });
	  };

	  SingleSelection.prototype.clear = function () {
	    this.$selection.find('.select2-selection__rendered').empty();
	  };

	  SingleSelection.prototype.display = function (data, container) {
	    var template = this.options.get('templateSelection');
	    var escapeMarkup = this.options.get('escapeMarkup');

	    return escapeMarkup(template(data, container));
	  };

	  SingleSelection.prototype.selectionContainer = function () {
	    return $('<span></span>');
	  };

	  SingleSelection.prototype.update = function (data) {
	    if (data.length === 0) {
	      this.clear();
	      return;
	    }

	    var selection = data[0];

	    var $rendered = this.$selection.find('.select2-selection__rendered');
	    var formatted = this.display(selection, $rendered);

	    $rendered.empty().append(formatted);
	    $rendered.prop('title', selection.title || selection.text);
	  };

	  return SingleSelection;
	});

	S2.define('select2/selection/multiple',[
	  'jquery',
	  './base',
	  '../utils'
	], function ($, BaseSelection, Utils) {
	  function MultipleSelection ($element, options) {
	    MultipleSelection.__super__.constructor.apply(this, arguments);
	  }

	  Utils.Extend(MultipleSelection, BaseSelection);

	  MultipleSelection.prototype.render = function () {
	    var $selection = MultipleSelection.__super__.render.call(this);

	    $selection.addClass('select2-selection--multiple');

	    $selection.html(
	      '<ul class="select2-selection__rendered"></ul>'
	    );

	    return $selection;
	  };

	  MultipleSelection.prototype.bind = function (container, $container) {
	    var self = this;

	    MultipleSelection.__super__.bind.apply(this, arguments);

	    this.$selection.on('click', function (evt) {
	      self.trigger('toggle', {
	        originalEvent: evt
	      });
	    });

	    this.$selection.on(
	      'click',
	      '.select2-selection__choice__remove',
	      function (evt) {
	        // Ignore the event if it is disabled
	        if (self.options.get('disabled')) {
	          return;
	        }

	        var $remove = $(this);
	        var $selection = $remove.parent();

	        var data = $selection.data('data');

	        self.trigger('unselect', {
	          originalEvent: evt,
	          data: data
	        });
	      }
	    );
	  };

	  MultipleSelection.prototype.clear = function () {
	    this.$selection.find('.select2-selection__rendered').empty();
	  };

	  MultipleSelection.prototype.display = function (data, container) {
	    var template = this.options.get('templateSelection');
	    var escapeMarkup = this.options.get('escapeMarkup');

	    return escapeMarkup(template(data, container));
	  };

	  MultipleSelection.prototype.selectionContainer = function () {
	    var $container = $(
	      '<li class="select2-selection__choice">' +
	        '<span class="select2-selection__choice__remove" role="presentation">' +
	          '&times;' +
	        '</span>' +
	      '</li>'
	    );

	    return $container;
	  };

	  MultipleSelection.prototype.update = function (data) {
	    this.clear();

	    if (data.length === 0) {
	      return;
	    }

	    var $selections = [];

	    for (var d = 0; d < data.length; d++) {
	      var selection = data[d];

	      var $selection = this.selectionContainer();
	      var formatted = this.display(selection, $selection);

	      $selection.append(formatted);
	      $selection.prop('title', selection.title || selection.text);

	      $selection.data('data', selection);

	      $selections.push($selection);
	    }

	    var $rendered = this.$selection.find('.select2-selection__rendered');

	    Utils.appendMany($rendered, $selections);
	  };

	  return MultipleSelection;
	});

	S2.define('select2/selection/placeholder',[
	  '../utils'
	], function (Utils) {
	  function Placeholder (decorated, $element, options) {
	    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

	    decorated.call(this, $element, options);
	  }

	  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
	    if (typeof placeholder === 'string') {
	      placeholder = {
	        id: '',
	        text: placeholder
	      };
	    }

	    return placeholder;
	  };

	  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
	    var $placeholder = this.selectionContainer();

	    $placeholder.html(this.display(placeholder));
	    $placeholder.addClass('select2-selection__placeholder')
	                .removeClass('select2-selection__choice');

	    return $placeholder;
	  };

	  Placeholder.prototype.update = function (decorated, data) {
	    var singlePlaceholder = (
	      data.length == 1 && data[0].id != this.placeholder.id
	    );
	    var multipleSelections = data.length > 1;

	    if (multipleSelections || singlePlaceholder) {
	      return decorated.call(this, data);
	    }

	    this.clear();

	    var $placeholder = this.createPlaceholder(this.placeholder);

	    this.$selection.find('.select2-selection__rendered').append($placeholder);
	  };

	  return Placeholder;
	});

	S2.define('select2/selection/allowClear',[
	  'jquery',
	  '../keys'
	], function ($, KEYS) {
	  function AllowClear () { }

	  AllowClear.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    decorated.call(this, container, $container);

	    if (this.placeholder == null) {
	      if (this.options.get('debug') && window.console && console.error) {
	        console.error(
	          'Select2: The `allowClear` option should be used in combination ' +
	          'with the `placeholder` option.'
	        );
	      }
	    }

	    this.$selection.on('mousedown', '.select2-selection__clear',
	      function (evt) {
	        self._handleClear(evt);
	    });

	    container.on('keypress', function (evt) {
	      self._handleKeyboardClear(evt, container);
	    });
	  };

	  AllowClear.prototype._handleClear = function (_, evt) {
	    // Ignore the event if it is disabled
	    if (this.options.get('disabled')) {
	      return;
	    }

	    var $clear = this.$selection.find('.select2-selection__clear');

	    // Ignore the event if nothing has been selected
	    if ($clear.length === 0) {
	      return;
	    }

	    evt.stopPropagation();

	    var data = $clear.data('data');

	    for (var d = 0; d < data.length; d++) {
	      var unselectData = {
	        data: data[d]
	      };

	      // Trigger the `unselect` event, so people can prevent it from being
	      // cleared.
	      this.trigger('unselect', unselectData);

	      // If the event was prevented, don't clear it out.
	      if (unselectData.prevented) {
	        return;
	      }
	    }

	    this.$element.val(this.placeholder.id).trigger('change');

	    this.trigger('toggle', {});
	  };

	  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
	    if (container.isOpen()) {
	      return;
	    }

	    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
	      this._handleClear(evt);
	    }
	  };

	  AllowClear.prototype.update = function (decorated, data) {
	    decorated.call(this, data);

	    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
	        data.length === 0) {
	      return;
	    }

	    var $remove = $(
	      '<span class="select2-selection__clear">' +
	        '&times;' +
	      '</span>'
	    );
	    $remove.data('data', data);

	    this.$selection.find('.select2-selection__rendered').prepend($remove);
	  };

	  return AllowClear;
	});

	S2.define('select2/selection/search',[
	  'jquery',
	  '../utils',
	  '../keys'
	], function ($, Utils, KEYS) {
	  function Search (decorated, $element, options) {
	    decorated.call(this, $element, options);
	  }

	  Search.prototype.render = function (decorated) {
	    var $search = $(
	      '<li class="select2-search select2-search--inline">' +
	        '<input class="select2-search__field" type="search" tabindex="-1"' +
	        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
	        ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
	      '</li>'
	    );

	    this.$searchContainer = $search;
	    this.$search = $search.find('input');

	    var $rendered = decorated.call(this);

	    this._transferTabIndex();

	    return $rendered;
	  };

	  Search.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    decorated.call(this, container, $container);

	    container.on('open', function () {
	      self.$search.trigger('focus');
	    });

	    container.on('close', function () {
	      self.$search.val('');
	      self.$search.removeAttr('aria-activedescendant');
	      self.$search.trigger('focus');
	    });

	    container.on('enable', function () {
	      self.$search.prop('disabled', false);

	      self._transferTabIndex();
	    });

	    container.on('disable', function () {
	      self.$search.prop('disabled', true);
	    });

	    container.on('focus', function (evt) {
	      self.$search.trigger('focus');
	    });

	    container.on('results:focus', function (params) {
	      self.$search.attr('aria-activedescendant', params.id);
	    });

	    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
	      self.trigger('focus', evt);
	    });

	    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
	      self._handleBlur(evt);
	    });

	    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
	      evt.stopPropagation();

	      self.trigger('keypress', evt);

	      self._keyUpPrevented = evt.isDefaultPrevented();

	      var key = evt.which;

	      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
	        var $previousChoice = self.$searchContainer
	          .prev('.select2-selection__choice');

	        if ($previousChoice.length > 0) {
	          var item = $previousChoice.data('data');

	          self.searchRemoveChoice(item);

	          evt.preventDefault();
	        }
	      }
	    });

	    // Try to detect the IE version should the `documentMode` property that
	    // is stored on the document. This is only implemented in IE and is
	    // slightly cleaner than doing a user agent check.
	    // This property is not available in Edge, but Edge also doesn't have
	    // this bug.
	    var msie = document.documentMode;
	    var disableInputEvents = msie && msie <= 11;

	    // Workaround for browsers which do not support the `input` event
	    // This will prevent double-triggering of events for browsers which support
	    // both the `keyup` and `input` events.
	    this.$selection.on(
	      'input.searchcheck',
	      '.select2-search--inline',
	      function (evt) {
	        // IE will trigger the `input` event when a placeholder is used on a
	        // search box. To get around this issue, we are forced to ignore all
	        // `input` events in IE and keep using `keyup`.
	        if (disableInputEvents) {
	          self.$selection.off('input.search input.searchcheck');
	          return;
	        }

	        // Unbind the duplicated `keyup` event
	        self.$selection.off('keyup.search');
	      }
	    );

	    this.$selection.on(
	      'keyup.search input.search',
	      '.select2-search--inline',
	      function (evt) {
	        // IE will trigger the `input` event when a placeholder is used on a
	        // search box. To get around this issue, we are forced to ignore all
	        // `input` events in IE and keep using `keyup`.
	        if (disableInputEvents && evt.type === 'input') {
	          self.$selection.off('input.search input.searchcheck');
	          return;
	        }

	        var key = evt.which;

	        // We can freely ignore events from modifier keys
	        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
	          return;
	        }

	        // Tabbing will be handled during the `keydown` phase
	        if (key == KEYS.TAB) {
	          return;
	        }

	        self.handleSearch(evt);
	      }
	    );
	  };

	  /**
	   * This method will transfer the tabindex attribute from the rendered
	   * selection to the search box. This allows for the search box to be used as
	   * the primary focus instead of the selection container.
	   *
	   * @private
	   */
	  Search.prototype._transferTabIndex = function (decorated) {
	    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
	    this.$selection.attr('tabindex', '-1');
	  };

	  Search.prototype.createPlaceholder = function (decorated, placeholder) {
	    this.$search.attr('placeholder', placeholder.text);
	  };

	  Search.prototype.update = function (decorated, data) {
	    var searchHadFocus = this.$search[0] == document.activeElement;

	    this.$search.attr('placeholder', '');

	    decorated.call(this, data);

	    this.$selection.find('.select2-selection__rendered')
	                   .append(this.$searchContainer);

	    this.resizeSearch();
	    if (searchHadFocus) {
	      this.$search.focus();
	    }
	  };

	  Search.prototype.handleSearch = function () {
	    this.resizeSearch();

	    if (!this._keyUpPrevented) {
	      var input = this.$search.val();

	      this.trigger('query', {
	        term: input
	      });
	    }

	    this._keyUpPrevented = false;
	  };

	  Search.prototype.searchRemoveChoice = function (decorated, item) {
	    this.trigger('unselect', {
	      data: item
	    });

	    this.$search.val(item.text);
	    this.handleSearch();
	  };

	  Search.prototype.resizeSearch = function () {
	    this.$search.css('width', '25px');

	    var width = '';

	    if (this.$search.attr('placeholder') !== '') {
	      width = this.$selection.find('.select2-selection__rendered').innerWidth();
	    } else {
	      var minimumWidth = this.$search.val().length + 1;

	      width = (minimumWidth * 0.75) + 'em';
	    }

	    this.$search.css('width', width);
	  };

	  return Search;
	});

	S2.define('select2/selection/eventRelay',[
	  'jquery'
	], function ($) {
	  function EventRelay () { }

	  EventRelay.prototype.bind = function (decorated, container, $container) {
	    var self = this;
	    var relayEvents = [
	      'open', 'opening',
	      'close', 'closing',
	      'select', 'selecting',
	      'unselect', 'unselecting'
	    ];

	    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

	    decorated.call(this, container, $container);

	    container.on('*', function (name, params) {
	      // Ignore events that should not be relayed
	      if ($.inArray(name, relayEvents) === -1) {
	        return;
	      }

	      // The parameters should always be an object
	      params = params || {};

	      // Generate the jQuery event for the Select2 event
	      var evt = $.Event('select2:' + name, {
	        params: params
	      });

	      self.$element.trigger(evt);

	      // Only handle preventable events if it was one
	      if ($.inArray(name, preventableEvents) === -1) {
	        return;
	      }

	      params.prevented = evt.isDefaultPrevented();
	    });
	  };

	  return EventRelay;
	});

	S2.define('select2/translation',[
	  'jquery',
	  'require'
	], function ($, require) {
	  function Translation (dict) {
	    this.dict = dict || {};
	  }

	  Translation.prototype.all = function () {
	    return this.dict;
	  };

	  Translation.prototype.get = function (key) {
	    return this.dict[key];
	  };

	  Translation.prototype.extend = function (translation) {
	    this.dict = $.extend({}, translation.all(), this.dict);
	  };

	  // Static functions

	  Translation._cache = {};

	  Translation.loadPath = function (path) {
	    if (!(path in Translation._cache)) {
	      var translations = require(path);

	      Translation._cache[path] = translations;
	    }

	    return new Translation(Translation._cache[path]);
	  };

	  return Translation;
	});

	S2.define('select2/diacritics',[

	], function () {
	  var diacritics = {
	    '\u24B6': 'A',
	    '\uFF21': 'A',
	    '\u00C0': 'A',
	    '\u00C1': 'A',
	    '\u00C2': 'A',
	    '\u1EA6': 'A',
	    '\u1EA4': 'A',
	    '\u1EAA': 'A',
	    '\u1EA8': 'A',
	    '\u00C3': 'A',
	    '\u0100': 'A',
	    '\u0102': 'A',
	    '\u1EB0': 'A',
	    '\u1EAE': 'A',
	    '\u1EB4': 'A',
	    '\u1EB2': 'A',
	    '\u0226': 'A',
	    '\u01E0': 'A',
	    '\u00C4': 'A',
	    '\u01DE': 'A',
	    '\u1EA2': 'A',
	    '\u00C5': 'A',
	    '\u01FA': 'A',
	    '\u01CD': 'A',
	    '\u0200': 'A',
	    '\u0202': 'A',
	    '\u1EA0': 'A',
	    '\u1EAC': 'A',
	    '\u1EB6': 'A',
	    '\u1E00': 'A',
	    '\u0104': 'A',
	    '\u023A': 'A',
	    '\u2C6F': 'A',
	    '\uA732': 'AA',
	    '\u00C6': 'AE',
	    '\u01FC': 'AE',
	    '\u01E2': 'AE',
	    '\uA734': 'AO',
	    '\uA736': 'AU',
	    '\uA738': 'AV',
	    '\uA73A': 'AV',
	    '\uA73C': 'AY',
	    '\u24B7': 'B',
	    '\uFF22': 'B',
	    '\u1E02': 'B',
	    '\u1E04': 'B',
	    '\u1E06': 'B',
	    '\u0243': 'B',
	    '\u0182': 'B',
	    '\u0181': 'B',
	    '\u24B8': 'C',
	    '\uFF23': 'C',
	    '\u0106': 'C',
	    '\u0108': 'C',
	    '\u010A': 'C',
	    '\u010C': 'C',
	    '\u00C7': 'C',
	    '\u1E08': 'C',
	    '\u0187': 'C',
	    '\u023B': 'C',
	    '\uA73E': 'C',
	    '\u24B9': 'D',
	    '\uFF24': 'D',
	    '\u1E0A': 'D',
	    '\u010E': 'D',
	    '\u1E0C': 'D',
	    '\u1E10': 'D',
	    '\u1E12': 'D',
	    '\u1E0E': 'D',
	    '\u0110': 'D',
	    '\u018B': 'D',
	    '\u018A': 'D',
	    '\u0189': 'D',
	    '\uA779': 'D',
	    '\u01F1': 'DZ',
	    '\u01C4': 'DZ',
	    '\u01F2': 'Dz',
	    '\u01C5': 'Dz',
	    '\u24BA': 'E',
	    '\uFF25': 'E',
	    '\u00C8': 'E',
	    '\u00C9': 'E',
	    '\u00CA': 'E',
	    '\u1EC0': 'E',
	    '\u1EBE': 'E',
	    '\u1EC4': 'E',
	    '\u1EC2': 'E',
	    '\u1EBC': 'E',
	    '\u0112': 'E',
	    '\u1E14': 'E',
	    '\u1E16': 'E',
	    '\u0114': 'E',
	    '\u0116': 'E',
	    '\u00CB': 'E',
	    '\u1EBA': 'E',
	    '\u011A': 'E',
	    '\u0204': 'E',
	    '\u0206': 'E',
	    '\u1EB8': 'E',
	    '\u1EC6': 'E',
	    '\u0228': 'E',
	    '\u1E1C': 'E',
	    '\u0118': 'E',
	    '\u1E18': 'E',
	    '\u1E1A': 'E',
	    '\u0190': 'E',
	    '\u018E': 'E',
	    '\u24BB': 'F',
	    '\uFF26': 'F',
	    '\u1E1E': 'F',
	    '\u0191': 'F',
	    '\uA77B': 'F',
	    '\u24BC': 'G',
	    '\uFF27': 'G',
	    '\u01F4': 'G',
	    '\u011C': 'G',
	    '\u1E20': 'G',
	    '\u011E': 'G',
	    '\u0120': 'G',
	    '\u01E6': 'G',
	    '\u0122': 'G',
	    '\u01E4': 'G',
	    '\u0193': 'G',
	    '\uA7A0': 'G',
	    '\uA77D': 'G',
	    '\uA77E': 'G',
	    '\u24BD': 'H',
	    '\uFF28': 'H',
	    '\u0124': 'H',
	    '\u1E22': 'H',
	    '\u1E26': 'H',
	    '\u021E': 'H',
	    '\u1E24': 'H',
	    '\u1E28': 'H',
	    '\u1E2A': 'H',
	    '\u0126': 'H',
	    '\u2C67': 'H',
	    '\u2C75': 'H',
	    '\uA78D': 'H',
	    '\u24BE': 'I',
	    '\uFF29': 'I',
	    '\u00CC': 'I',
	    '\u00CD': 'I',
	    '\u00CE': 'I',
	    '\u0128': 'I',
	    '\u012A': 'I',
	    '\u012C': 'I',
	    '\u0130': 'I',
	    '\u00CF': 'I',
	    '\u1E2E': 'I',
	    '\u1EC8': 'I',
	    '\u01CF': 'I',
	    '\u0208': 'I',
	    '\u020A': 'I',
	    '\u1ECA': 'I',
	    '\u012E': 'I',
	    '\u1E2C': 'I',
	    '\u0197': 'I',
	    '\u24BF': 'J',
	    '\uFF2A': 'J',
	    '\u0134': 'J',
	    '\u0248': 'J',
	    '\u24C0': 'K',
	    '\uFF2B': 'K',
	    '\u1E30': 'K',
	    '\u01E8': 'K',
	    '\u1E32': 'K',
	    '\u0136': 'K',
	    '\u1E34': 'K',
	    '\u0198': 'K',
	    '\u2C69': 'K',
	    '\uA740': 'K',
	    '\uA742': 'K',
	    '\uA744': 'K',
	    '\uA7A2': 'K',
	    '\u24C1': 'L',
	    '\uFF2C': 'L',
	    '\u013F': 'L',
	    '\u0139': 'L',
	    '\u013D': 'L',
	    '\u1E36': 'L',
	    '\u1E38': 'L',
	    '\u013B': 'L',
	    '\u1E3C': 'L',
	    '\u1E3A': 'L',
	    '\u0141': 'L',
	    '\u023D': 'L',
	    '\u2C62': 'L',
	    '\u2C60': 'L',
	    '\uA748': 'L',
	    '\uA746': 'L',
	    '\uA780': 'L',
	    '\u01C7': 'LJ',
	    '\u01C8': 'Lj',
	    '\u24C2': 'M',
	    '\uFF2D': 'M',
	    '\u1E3E': 'M',
	    '\u1E40': 'M',
	    '\u1E42': 'M',
	    '\u2C6E': 'M',
	    '\u019C': 'M',
	    '\u24C3': 'N',
	    '\uFF2E': 'N',
	    '\u01F8': 'N',
	    '\u0143': 'N',
	    '\u00D1': 'N',
	    '\u1E44': 'N',
	    '\u0147': 'N',
	    '\u1E46': 'N',
	    '\u0145': 'N',
	    '\u1E4A': 'N',
	    '\u1E48': 'N',
	    '\u0220': 'N',
	    '\u019D': 'N',
	    '\uA790': 'N',
	    '\uA7A4': 'N',
	    '\u01CA': 'NJ',
	    '\u01CB': 'Nj',
	    '\u24C4': 'O',
	    '\uFF2F': 'O',
	    '\u00D2': 'O',
	    '\u00D3': 'O',
	    '\u00D4': 'O',
	    '\u1ED2': 'O',
	    '\u1ED0': 'O',
	    '\u1ED6': 'O',
	    '\u1ED4': 'O',
	    '\u00D5': 'O',
	    '\u1E4C': 'O',
	    '\u022C': 'O',
	    '\u1E4E': 'O',
	    '\u014C': 'O',
	    '\u1E50': 'O',
	    '\u1E52': 'O',
	    '\u014E': 'O',
	    '\u022E': 'O',
	    '\u0230': 'O',
	    '\u00D6': 'O',
	    '\u022A': 'O',
	    '\u1ECE': 'O',
	    '\u0150': 'O',
	    '\u01D1': 'O',
	    '\u020C': 'O',
	    '\u020E': 'O',
	    '\u01A0': 'O',
	    '\u1EDC': 'O',
	    '\u1EDA': 'O',
	    '\u1EE0': 'O',
	    '\u1EDE': 'O',
	    '\u1EE2': 'O',
	    '\u1ECC': 'O',
	    '\u1ED8': 'O',
	    '\u01EA': 'O',
	    '\u01EC': 'O',
	    '\u00D8': 'O',
	    '\u01FE': 'O',
	    '\u0186': 'O',
	    '\u019F': 'O',
	    '\uA74A': 'O',
	    '\uA74C': 'O',
	    '\u01A2': 'OI',
	    '\uA74E': 'OO',
	    '\u0222': 'OU',
	    '\u24C5': 'P',
	    '\uFF30': 'P',
	    '\u1E54': 'P',
	    '\u1E56': 'P',
	    '\u01A4': 'P',
	    '\u2C63': 'P',
	    '\uA750': 'P',
	    '\uA752': 'P',
	    '\uA754': 'P',
	    '\u24C6': 'Q',
	    '\uFF31': 'Q',
	    '\uA756': 'Q',
	    '\uA758': 'Q',
	    '\u024A': 'Q',
	    '\u24C7': 'R',
	    '\uFF32': 'R',
	    '\u0154': 'R',
	    '\u1E58': 'R',
	    '\u0158': 'R',
	    '\u0210': 'R',
	    '\u0212': 'R',
	    '\u1E5A': 'R',
	    '\u1E5C': 'R',
	    '\u0156': 'R',
	    '\u1E5E': 'R',
	    '\u024C': 'R',
	    '\u2C64': 'R',
	    '\uA75A': 'R',
	    '\uA7A6': 'R',
	    '\uA782': 'R',
	    '\u24C8': 'S',
	    '\uFF33': 'S',
	    '\u1E9E': 'S',
	    '\u015A': 'S',
	    '\u1E64': 'S',
	    '\u015C': 'S',
	    '\u1E60': 'S',
	    '\u0160': 'S',
	    '\u1E66': 'S',
	    '\u1E62': 'S',
	    '\u1E68': 'S',
	    '\u0218': 'S',
	    '\u015E': 'S',
	    '\u2C7E': 'S',
	    '\uA7A8': 'S',
	    '\uA784': 'S',
	    '\u24C9': 'T',
	    '\uFF34': 'T',
	    '\u1E6A': 'T',
	    '\u0164': 'T',
	    '\u1E6C': 'T',
	    '\u021A': 'T',
	    '\u0162': 'T',
	    '\u1E70': 'T',
	    '\u1E6E': 'T',
	    '\u0166': 'T',
	    '\u01AC': 'T',
	    '\u01AE': 'T',
	    '\u023E': 'T',
	    '\uA786': 'T',
	    '\uA728': 'TZ',
	    '\u24CA': 'U',
	    '\uFF35': 'U',
	    '\u00D9': 'U',
	    '\u00DA': 'U',
	    '\u00DB': 'U',
	    '\u0168': 'U',
	    '\u1E78': 'U',
	    '\u016A': 'U',
	    '\u1E7A': 'U',
	    '\u016C': 'U',
	    '\u00DC': 'U',
	    '\u01DB': 'U',
	    '\u01D7': 'U',
	    '\u01D5': 'U',
	    '\u01D9': 'U',
	    '\u1EE6': 'U',
	    '\u016E': 'U',
	    '\u0170': 'U',
	    '\u01D3': 'U',
	    '\u0214': 'U',
	    '\u0216': 'U',
	    '\u01AF': 'U',
	    '\u1EEA': 'U',
	    '\u1EE8': 'U',
	    '\u1EEE': 'U',
	    '\u1EEC': 'U',
	    '\u1EF0': 'U',
	    '\u1EE4': 'U',
	    '\u1E72': 'U',
	    '\u0172': 'U',
	    '\u1E76': 'U',
	    '\u1E74': 'U',
	    '\u0244': 'U',
	    '\u24CB': 'V',
	    '\uFF36': 'V',
	    '\u1E7C': 'V',
	    '\u1E7E': 'V',
	    '\u01B2': 'V',
	    '\uA75E': 'V',
	    '\u0245': 'V',
	    '\uA760': 'VY',
	    '\u24CC': 'W',
	    '\uFF37': 'W',
	    '\u1E80': 'W',
	    '\u1E82': 'W',
	    '\u0174': 'W',
	    '\u1E86': 'W',
	    '\u1E84': 'W',
	    '\u1E88': 'W',
	    '\u2C72': 'W',
	    '\u24CD': 'X',
	    '\uFF38': 'X',
	    '\u1E8A': 'X',
	    '\u1E8C': 'X',
	    '\u24CE': 'Y',
	    '\uFF39': 'Y',
	    '\u1EF2': 'Y',
	    '\u00DD': 'Y',
	    '\u0176': 'Y',
	    '\u1EF8': 'Y',
	    '\u0232': 'Y',
	    '\u1E8E': 'Y',
	    '\u0178': 'Y',
	    '\u1EF6': 'Y',
	    '\u1EF4': 'Y',
	    '\u01B3': 'Y',
	    '\u024E': 'Y',
	    '\u1EFE': 'Y',
	    '\u24CF': 'Z',
	    '\uFF3A': 'Z',
	    '\u0179': 'Z',
	    '\u1E90': 'Z',
	    '\u017B': 'Z',
	    '\u017D': 'Z',
	    '\u1E92': 'Z',
	    '\u1E94': 'Z',
	    '\u01B5': 'Z',
	    '\u0224': 'Z',
	    '\u2C7F': 'Z',
	    '\u2C6B': 'Z',
	    '\uA762': 'Z',
	    '\u24D0': 'a',
	    '\uFF41': 'a',
	    '\u1E9A': 'a',
	    '\u00E0': 'a',
	    '\u00E1': 'a',
	    '\u00E2': 'a',
	    '\u1EA7': 'a',
	    '\u1EA5': 'a',
	    '\u1EAB': 'a',
	    '\u1EA9': 'a',
	    '\u00E3': 'a',
	    '\u0101': 'a',
	    '\u0103': 'a',
	    '\u1EB1': 'a',
	    '\u1EAF': 'a',
	    '\u1EB5': 'a',
	    '\u1EB3': 'a',
	    '\u0227': 'a',
	    '\u01E1': 'a',
	    '\u00E4': 'a',
	    '\u01DF': 'a',
	    '\u1EA3': 'a',
	    '\u00E5': 'a',
	    '\u01FB': 'a',
	    '\u01CE': 'a',
	    '\u0201': 'a',
	    '\u0203': 'a',
	    '\u1EA1': 'a',
	    '\u1EAD': 'a',
	    '\u1EB7': 'a',
	    '\u1E01': 'a',
	    '\u0105': 'a',
	    '\u2C65': 'a',
	    '\u0250': 'a',
	    '\uA733': 'aa',
	    '\u00E6': 'ae',
	    '\u01FD': 'ae',
	    '\u01E3': 'ae',
	    '\uA735': 'ao',
	    '\uA737': 'au',
	    '\uA739': 'av',
	    '\uA73B': 'av',
	    '\uA73D': 'ay',
	    '\u24D1': 'b',
	    '\uFF42': 'b',
	    '\u1E03': 'b',
	    '\u1E05': 'b',
	    '\u1E07': 'b',
	    '\u0180': 'b',
	    '\u0183': 'b',
	    '\u0253': 'b',
	    '\u24D2': 'c',
	    '\uFF43': 'c',
	    '\u0107': 'c',
	    '\u0109': 'c',
	    '\u010B': 'c',
	    '\u010D': 'c',
	    '\u00E7': 'c',
	    '\u1E09': 'c',
	    '\u0188': 'c',
	    '\u023C': 'c',
	    '\uA73F': 'c',
	    '\u2184': 'c',
	    '\u24D3': 'd',
	    '\uFF44': 'd',
	    '\u1E0B': 'd',
	    '\u010F': 'd',
	    '\u1E0D': 'd',
	    '\u1E11': 'd',
	    '\u1E13': 'd',
	    '\u1E0F': 'd',
	    '\u0111': 'd',
	    '\u018C': 'd',
	    '\u0256': 'd',
	    '\u0257': 'd',
	    '\uA77A': 'd',
	    '\u01F3': 'dz',
	    '\u01C6': 'dz',
	    '\u24D4': 'e',
	    '\uFF45': 'e',
	    '\u00E8': 'e',
	    '\u00E9': 'e',
	    '\u00EA': 'e',
	    '\u1EC1': 'e',
	    '\u1EBF': 'e',
	    '\u1EC5': 'e',
	    '\u1EC3': 'e',
	    '\u1EBD': 'e',
	    '\u0113': 'e',
	    '\u1E15': 'e',
	    '\u1E17': 'e',
	    '\u0115': 'e',
	    '\u0117': 'e',
	    '\u00EB': 'e',
	    '\u1EBB': 'e',
	    '\u011B': 'e',
	    '\u0205': 'e',
	    '\u0207': 'e',
	    '\u1EB9': 'e',
	    '\u1EC7': 'e',
	    '\u0229': 'e',
	    '\u1E1D': 'e',
	    '\u0119': 'e',
	    '\u1E19': 'e',
	    '\u1E1B': 'e',
	    '\u0247': 'e',
	    '\u025B': 'e',
	    '\u01DD': 'e',
	    '\u24D5': 'f',
	    '\uFF46': 'f',
	    '\u1E1F': 'f',
	    '\u0192': 'f',
	    '\uA77C': 'f',
	    '\u24D6': 'g',
	    '\uFF47': 'g',
	    '\u01F5': 'g',
	    '\u011D': 'g',
	    '\u1E21': 'g',
	    '\u011F': 'g',
	    '\u0121': 'g',
	    '\u01E7': 'g',
	    '\u0123': 'g',
	    '\u01E5': 'g',
	    '\u0260': 'g',
	    '\uA7A1': 'g',
	    '\u1D79': 'g',
	    '\uA77F': 'g',
	    '\u24D7': 'h',
	    '\uFF48': 'h',
	    '\u0125': 'h',
	    '\u1E23': 'h',
	    '\u1E27': 'h',
	    '\u021F': 'h',
	    '\u1E25': 'h',
	    '\u1E29': 'h',
	    '\u1E2B': 'h',
	    '\u1E96': 'h',
	    '\u0127': 'h',
	    '\u2C68': 'h',
	    '\u2C76': 'h',
	    '\u0265': 'h',
	    '\u0195': 'hv',
	    '\u24D8': 'i',
	    '\uFF49': 'i',
	    '\u00EC': 'i',
	    '\u00ED': 'i',
	    '\u00EE': 'i',
	    '\u0129': 'i',
	    '\u012B': 'i',
	    '\u012D': 'i',
	    '\u00EF': 'i',
	    '\u1E2F': 'i',
	    '\u1EC9': 'i',
	    '\u01D0': 'i',
	    '\u0209': 'i',
	    '\u020B': 'i',
	    '\u1ECB': 'i',
	    '\u012F': 'i',
	    '\u1E2D': 'i',
	    '\u0268': 'i',
	    '\u0131': 'i',
	    '\u24D9': 'j',
	    '\uFF4A': 'j',
	    '\u0135': 'j',
	    '\u01F0': 'j',
	    '\u0249': 'j',
	    '\u24DA': 'k',
	    '\uFF4B': 'k',
	    '\u1E31': 'k',
	    '\u01E9': 'k',
	    '\u1E33': 'k',
	    '\u0137': 'k',
	    '\u1E35': 'k',
	    '\u0199': 'k',
	    '\u2C6A': 'k',
	    '\uA741': 'k',
	    '\uA743': 'k',
	    '\uA745': 'k',
	    '\uA7A3': 'k',
	    '\u24DB': 'l',
	    '\uFF4C': 'l',
	    '\u0140': 'l',
	    '\u013A': 'l',
	    '\u013E': 'l',
	    '\u1E37': 'l',
	    '\u1E39': 'l',
	    '\u013C': 'l',
	    '\u1E3D': 'l',
	    '\u1E3B': 'l',
	    '\u017F': 'l',
	    '\u0142': 'l',
	    '\u019A': 'l',
	    '\u026B': 'l',
	    '\u2C61': 'l',
	    '\uA749': 'l',
	    '\uA781': 'l',
	    '\uA747': 'l',
	    '\u01C9': 'lj',
	    '\u24DC': 'm',
	    '\uFF4D': 'm',
	    '\u1E3F': 'm',
	    '\u1E41': 'm',
	    '\u1E43': 'm',
	    '\u0271': 'm',
	    '\u026F': 'm',
	    '\u24DD': 'n',
	    '\uFF4E': 'n',
	    '\u01F9': 'n',
	    '\u0144': 'n',
	    '\u00F1': 'n',
	    '\u1E45': 'n',
	    '\u0148': 'n',
	    '\u1E47': 'n',
	    '\u0146': 'n',
	    '\u1E4B': 'n',
	    '\u1E49': 'n',
	    '\u019E': 'n',
	    '\u0272': 'n',
	    '\u0149': 'n',
	    '\uA791': 'n',
	    '\uA7A5': 'n',
	    '\u01CC': 'nj',
	    '\u24DE': 'o',
	    '\uFF4F': 'o',
	    '\u00F2': 'o',
	    '\u00F3': 'o',
	    '\u00F4': 'o',
	    '\u1ED3': 'o',
	    '\u1ED1': 'o',
	    '\u1ED7': 'o',
	    '\u1ED5': 'o',
	    '\u00F5': 'o',
	    '\u1E4D': 'o',
	    '\u022D': 'o',
	    '\u1E4F': 'o',
	    '\u014D': 'o',
	    '\u1E51': 'o',
	    '\u1E53': 'o',
	    '\u014F': 'o',
	    '\u022F': 'o',
	    '\u0231': 'o',
	    '\u00F6': 'o',
	    '\u022B': 'o',
	    '\u1ECF': 'o',
	    '\u0151': 'o',
	    '\u01D2': 'o',
	    '\u020D': 'o',
	    '\u020F': 'o',
	    '\u01A1': 'o',
	    '\u1EDD': 'o',
	    '\u1EDB': 'o',
	    '\u1EE1': 'o',
	    '\u1EDF': 'o',
	    '\u1EE3': 'o',
	    '\u1ECD': 'o',
	    '\u1ED9': 'o',
	    '\u01EB': 'o',
	    '\u01ED': 'o',
	    '\u00F8': 'o',
	    '\u01FF': 'o',
	    '\u0254': 'o',
	    '\uA74B': 'o',
	    '\uA74D': 'o',
	    '\u0275': 'o',
	    '\u01A3': 'oi',
	    '\u0223': 'ou',
	    '\uA74F': 'oo',
	    '\u24DF': 'p',
	    '\uFF50': 'p',
	    '\u1E55': 'p',
	    '\u1E57': 'p',
	    '\u01A5': 'p',
	    '\u1D7D': 'p',
	    '\uA751': 'p',
	    '\uA753': 'p',
	    '\uA755': 'p',
	    '\u24E0': 'q',
	    '\uFF51': 'q',
	    '\u024B': 'q',
	    '\uA757': 'q',
	    '\uA759': 'q',
	    '\u24E1': 'r',
	    '\uFF52': 'r',
	    '\u0155': 'r',
	    '\u1E59': 'r',
	    '\u0159': 'r',
	    '\u0211': 'r',
	    '\u0213': 'r',
	    '\u1E5B': 'r',
	    '\u1E5D': 'r',
	    '\u0157': 'r',
	    '\u1E5F': 'r',
	    '\u024D': 'r',
	    '\u027D': 'r',
	    '\uA75B': 'r',
	    '\uA7A7': 'r',
	    '\uA783': 'r',
	    '\u24E2': 's',
	    '\uFF53': 's',
	    '\u00DF': 's',
	    '\u015B': 's',
	    '\u1E65': 's',
	    '\u015D': 's',
	    '\u1E61': 's',
	    '\u0161': 's',
	    '\u1E67': 's',
	    '\u1E63': 's',
	    '\u1E69': 's',
	    '\u0219': 's',
	    '\u015F': 's',
	    '\u023F': 's',
	    '\uA7A9': 's',
	    '\uA785': 's',
	    '\u1E9B': 's',
	    '\u24E3': 't',
	    '\uFF54': 't',
	    '\u1E6B': 't',
	    '\u1E97': 't',
	    '\u0165': 't',
	    '\u1E6D': 't',
	    '\u021B': 't',
	    '\u0163': 't',
	    '\u1E71': 't',
	    '\u1E6F': 't',
	    '\u0167': 't',
	    '\u01AD': 't',
	    '\u0288': 't',
	    '\u2C66': 't',
	    '\uA787': 't',
	    '\uA729': 'tz',
	    '\u24E4': 'u',
	    '\uFF55': 'u',
	    '\u00F9': 'u',
	    '\u00FA': 'u',
	    '\u00FB': 'u',
	    '\u0169': 'u',
	    '\u1E79': 'u',
	    '\u016B': 'u',
	    '\u1E7B': 'u',
	    '\u016D': 'u',
	    '\u00FC': 'u',
	    '\u01DC': 'u',
	    '\u01D8': 'u',
	    '\u01D6': 'u',
	    '\u01DA': 'u',
	    '\u1EE7': 'u',
	    '\u016F': 'u',
	    '\u0171': 'u',
	    '\u01D4': 'u',
	    '\u0215': 'u',
	    '\u0217': 'u',
	    '\u01B0': 'u',
	    '\u1EEB': 'u',
	    '\u1EE9': 'u',
	    '\u1EEF': 'u',
	    '\u1EED': 'u',
	    '\u1EF1': 'u',
	    '\u1EE5': 'u',
	    '\u1E73': 'u',
	    '\u0173': 'u',
	    '\u1E77': 'u',
	    '\u1E75': 'u',
	    '\u0289': 'u',
	    '\u24E5': 'v',
	    '\uFF56': 'v',
	    '\u1E7D': 'v',
	    '\u1E7F': 'v',
	    '\u028B': 'v',
	    '\uA75F': 'v',
	    '\u028C': 'v',
	    '\uA761': 'vy',
	    '\u24E6': 'w',
	    '\uFF57': 'w',
	    '\u1E81': 'w',
	    '\u1E83': 'w',
	    '\u0175': 'w',
	    '\u1E87': 'w',
	    '\u1E85': 'w',
	    '\u1E98': 'w',
	    '\u1E89': 'w',
	    '\u2C73': 'w',
	    '\u24E7': 'x',
	    '\uFF58': 'x',
	    '\u1E8B': 'x',
	    '\u1E8D': 'x',
	    '\u24E8': 'y',
	    '\uFF59': 'y',
	    '\u1EF3': 'y',
	    '\u00FD': 'y',
	    '\u0177': 'y',
	    '\u1EF9': 'y',
	    '\u0233': 'y',
	    '\u1E8F': 'y',
	    '\u00FF': 'y',
	    '\u1EF7': 'y',
	    '\u1E99': 'y',
	    '\u1EF5': 'y',
	    '\u01B4': 'y',
	    '\u024F': 'y',
	    '\u1EFF': 'y',
	    '\u24E9': 'z',
	    '\uFF5A': 'z',
	    '\u017A': 'z',
	    '\u1E91': 'z',
	    '\u017C': 'z',
	    '\u017E': 'z',
	    '\u1E93': 'z',
	    '\u1E95': 'z',
	    '\u01B6': 'z',
	    '\u0225': 'z',
	    '\u0240': 'z',
	    '\u2C6C': 'z',
	    '\uA763': 'z',
	    '\u0386': '\u0391',
	    '\u0388': '\u0395',
	    '\u0389': '\u0397',
	    '\u038A': '\u0399',
	    '\u03AA': '\u0399',
	    '\u038C': '\u039F',
	    '\u038E': '\u03A5',
	    '\u03AB': '\u03A5',
	    '\u038F': '\u03A9',
	    '\u03AC': '\u03B1',
	    '\u03AD': '\u03B5',
	    '\u03AE': '\u03B7',
	    '\u03AF': '\u03B9',
	    '\u03CA': '\u03B9',
	    '\u0390': '\u03B9',
	    '\u03CC': '\u03BF',
	    '\u03CD': '\u03C5',
	    '\u03CB': '\u03C5',
	    '\u03B0': '\u03C5',
	    '\u03C9': '\u03C9',
	    '\u03C2': '\u03C3'
	  };

	  return diacritics;
	});

	S2.define('select2/data/base',[
	  '../utils'
	], function (Utils) {
	  function BaseAdapter ($element, options) {
	    BaseAdapter.__super__.constructor.call(this);
	  }

	  Utils.Extend(BaseAdapter, Utils.Observable);

	  BaseAdapter.prototype.current = function (callback) {
	    throw new Error('The `current` method must be defined in child classes.');
	  };

	  BaseAdapter.prototype.query = function (params, callback) {
	    throw new Error('The `query` method must be defined in child classes.');
	  };

	  BaseAdapter.prototype.bind = function (container, $container) {
	    // Can be implemented in subclasses
	  };

	  BaseAdapter.prototype.destroy = function () {
	    // Can be implemented in subclasses
	  };

	  BaseAdapter.prototype.generateResultId = function (container, data) {
	    var id = container.id + '-result-';

	    id += Utils.generateChars(4);

	    if (data.id != null) {
	      id += '-' + data.id.toString();
	    } else {
	      id += '-' + Utils.generateChars(4);
	    }
	    return id;
	  };

	  return BaseAdapter;
	});

	S2.define('select2/data/select',[
	  './base',
	  '../utils',
	  'jquery'
	], function (BaseAdapter, Utils, $) {
	  function SelectAdapter ($element, options) {
	    this.$element = $element;
	    this.options = options;

	    SelectAdapter.__super__.constructor.call(this);
	  }

	  Utils.Extend(SelectAdapter, BaseAdapter);

	  SelectAdapter.prototype.current = function (callback) {
	    var data = [];
	    var self = this;

	    this.$element.find(':selected').each(function () {
	      var $option = $(this);

	      var option = self.item($option);

	      data.push(option);
	    });

	    callback(data);
	  };

	  SelectAdapter.prototype.select = function (data) {
	    var self = this;

	    data.selected = true;

	    // If data.element is a DOM node, use it instead
	    if ($(data.element).is('option')) {
	      data.element.selected = true;

	      this.$element.trigger('change');

	      return;
	    }

	    if (this.$element.prop('multiple')) {
	      this.current(function (currentData) {
	        var val = [];

	        data = [data];
	        data.push.apply(data, currentData);

	        for (var d = 0; d < data.length; d++) {
	          var id = data[d].id;

	          if ($.inArray(id, val) === -1) {
	            val.push(id);
	          }
	        }

	        self.$element.val(val);
	        self.$element.trigger('change');
	      });
	    } else {
	      var val = data.id;

	      this.$element.val(val);
	      this.$element.trigger('change');
	    }
	  };

	  SelectAdapter.prototype.unselect = function (data) {
	    var self = this;

	    if (!this.$element.prop('multiple')) {
	      return;
	    }

	    data.selected = false;

	    if ($(data.element).is('option')) {
	      data.element.selected = false;

	      this.$element.trigger('change');

	      return;
	    }

	    this.current(function (currentData) {
	      var val = [];

	      for (var d = 0; d < currentData.length; d++) {
	        var id = currentData[d].id;

	        if (id !== data.id && $.inArray(id, val) === -1) {
	          val.push(id);
	        }
	      }

	      self.$element.val(val);

	      self.$element.trigger('change');
	    });
	  };

	  SelectAdapter.prototype.bind = function (container, $container) {
	    var self = this;

	    this.container = container;

	    container.on('select', function (params) {
	      self.select(params.data);
	    });

	    container.on('unselect', function (params) {
	      self.unselect(params.data);
	    });
	  };

	  SelectAdapter.prototype.destroy = function () {
	    // Remove anything added to child elements
	    this.$element.find('*').each(function () {
	      // Remove any custom data set by Select2
	      $.removeData(this, 'data');
	    });
	  };

	  SelectAdapter.prototype.query = function (params, callback) {
	    var data = [];
	    var self = this;

	    var $options = this.$element.children();

	    $options.each(function () {
	      var $option = $(this);

	      if (!$option.is('option') && !$option.is('optgroup')) {
	        return;
	      }

	      var option = self.item($option);

	      var matches = self.matches(params, option);

	      if (matches !== null) {
	        data.push(matches);
	      }
	    });

	    callback({
	      results: data
	    });
	  };

	  SelectAdapter.prototype.addOptions = function ($options) {
	    Utils.appendMany(this.$element, $options);
	  };

	  SelectAdapter.prototype.option = function (data) {
	    var option;

	    if (data.children) {
	      option = document.createElement('optgroup');
	      option.label = data.text;
	    } else {
	      option = document.createElement('option');

	      if (option.textContent !== undefined) {
	        option.textContent = data.text;
	      } else {
	        option.innerText = data.text;
	      }
	    }

	    if (data.id) {
	      option.value = data.id;
	    }

	    if (data.disabled) {
	      option.disabled = true;
	    }

	    if (data.selected) {
	      option.selected = true;
	    }

	    if (data.title) {
	      option.title = data.title;
	    }

	    var $option = $(option);

	    var normalizedData = this._normalizeItem(data);
	    normalizedData.element = option;

	    // Override the option's data with the combined data
	    $.data(option, 'data', normalizedData);

	    return $option;
	  };

	  SelectAdapter.prototype.item = function ($option) {
	    var data = {};

	    data = $.data($option[0], 'data');

	    if (data != null) {
	      return data;
	    }

	    if ($option.is('option')) {
	      data = {
	        id: $option.val(),
	        text: $option.text(),
	        disabled: $option.prop('disabled'),
	        selected: $option.prop('selected'),
	        title: $option.prop('title')
	      };
	    } else if ($option.is('optgroup')) {
	      data = {
	        text: $option.prop('label'),
	        children: [],
	        title: $option.prop('title')
	      };

	      var $children = $option.children('option');
	      var children = [];

	      for (var c = 0; c < $children.length; c++) {
	        var $child = $($children[c]);

	        var child = this.item($child);

	        children.push(child);
	      }

	      data.children = children;
	    }

	    data = this._normalizeItem(data);
	    data.element = $option[0];

	    $.data($option[0], 'data', data);

	    return data;
	  };

	  SelectAdapter.prototype._normalizeItem = function (item) {
	    if (!$.isPlainObject(item)) {
	      item = {
	        id: item,
	        text: item
	      };
	    }

	    item = $.extend({}, {
	      text: ''
	    }, item);

	    var defaults = {
	      selected: false,
	      disabled: false
	    };

	    if (item.id != null) {
	      item.id = item.id.toString();
	    }

	    if (item.text != null) {
	      item.text = item.text.toString();
	    }

	    if (item._resultId == null && item.id && this.container != null) {
	      item._resultId = this.generateResultId(this.container, item);
	    }

	    return $.extend({}, defaults, item);
	  };

	  SelectAdapter.prototype.matches = function (params, data) {
	    var matcher = this.options.get('matcher');

	    return matcher(params, data);
	  };

	  return SelectAdapter;
	});

	S2.define('select2/data/array',[
	  './select',
	  '../utils',
	  'jquery'
	], function (SelectAdapter, Utils, $) {
	  function ArrayAdapter ($element, options) {
	    var data = options.get('data') || [];

	    ArrayAdapter.__super__.constructor.call(this, $element, options);

	    this.addOptions(this.convertToOptions(data));
	  }

	  Utils.Extend(ArrayAdapter, SelectAdapter);

	  ArrayAdapter.prototype.select = function (data) {
	    var $option = this.$element.find('option').filter(function (i, elm) {
	      return elm.value == data.id.toString();
	    });

	    if ($option.length === 0) {
	      $option = this.option(data);

	      this.addOptions($option);
	    }

	    ArrayAdapter.__super__.select.call(this, data);
	  };

	  ArrayAdapter.prototype.convertToOptions = function (data) {
	    var self = this;

	    var $existing = this.$element.find('option');
	    var existingIds = $existing.map(function () {
	      return self.item($(this)).id;
	    }).get();

	    var $options = [];

	    // Filter out all items except for the one passed in the argument
	    function onlyItem (item) {
	      return function () {
	        return $(this).val() == item.id;
	      };
	    }

	    for (var d = 0; d < data.length; d++) {
	      var item = this._normalizeItem(data[d]);

	      // Skip items which were pre-loaded, only merge the data
	      if ($.inArray(item.id, existingIds) >= 0) {
	        var $existingOption = $existing.filter(onlyItem(item));

	        var existingData = this.item($existingOption);
	        var newData = $.extend(true, {}, item, existingData);

	        var $newOption = this.option(newData);

	        $existingOption.replaceWith($newOption);

	        continue;
	      }

	      var $option = this.option(item);

	      if (item.children) {
	        var $children = this.convertToOptions(item.children);

	        Utils.appendMany($option, $children);
	      }

	      $options.push($option);
	    }

	    return $options;
	  };

	  return ArrayAdapter;
	});

	S2.define('select2/data/ajax',[
	  './array',
	  '../utils',
	  'jquery'
	], function (ArrayAdapter, Utils, $) {
	  function AjaxAdapter ($element, options) {
	    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

	    if (this.ajaxOptions.processResults != null) {
	      this.processResults = this.ajaxOptions.processResults;
	    }

	    AjaxAdapter.__super__.constructor.call(this, $element, options);
	  }

	  Utils.Extend(AjaxAdapter, ArrayAdapter);

	  AjaxAdapter.prototype._applyDefaults = function (options) {
	    var defaults = {
	      data: function (params) {
	        return $.extend({}, params, {
	          q: params.term
	        });
	      },
	      transport: function (params, success, failure) {
	        var $request = $.ajax(params);

	        $request.then(success);
	        $request.fail(failure);

	        return $request;
	      }
	    };

	    return $.extend({}, defaults, options, true);
	  };

	  AjaxAdapter.prototype.processResults = function (results) {
	    return results;
	  };

	  AjaxAdapter.prototype.query = function (params, callback) {
	    var matches = [];
	    var self = this;

	    if (this._request != null) {
	      // JSONP requests cannot always be aborted
	      if ($.isFunction(this._request.abort)) {
	        this._request.abort();
	      }

	      this._request = null;
	    }

	    var options = $.extend({
	      type: 'GET'
	    }, this.ajaxOptions);

	    if (typeof options.url === 'function') {
	      options.url = options.url.call(this.$element, params);
	    }

	    if (typeof options.data === 'function') {
	      options.data = options.data.call(this.$element, params);
	    }

	    function request () {
	      var $request = options.transport(options, function (data) {
	        var results = self.processResults(data, params);

	        if (self.options.get('debug') && window.console && console.error) {
	          // Check to make sure that the response included a `results` key.
	          if (!results || !results.results || !$.isArray(results.results)) {
	            console.error(
	              'Select2: The AJAX results did not return an array in the ' +
	              '`results` key of the response.'
	            );
	          }
	        }

	        callback(results);
	      }, function () {
	        // Attempt to detect if a request was aborted
	        // Only works if the transport exposes a status property
	        if ($request.status && $request.status === '0') {
	          return;
	        }

	        self.trigger('results:message', {
	          message: 'errorLoading'
	        });
	      });

	      self._request = $request;
	    }

	    if (this.ajaxOptions.delay && params.term != null) {
	      if (this._queryTimeout) {
	        window.clearTimeout(this._queryTimeout);
	      }

	      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
	    } else {
	      request();
	    }
	  };

	  return AjaxAdapter;
	});

	S2.define('select2/data/tags',[
	  'jquery'
	], function ($) {
	  function Tags (decorated, $element, options) {
	    var tags = options.get('tags');

	    var createTag = options.get('createTag');

	    if (createTag !== undefined) {
	      this.createTag = createTag;
	    }

	    var insertTag = options.get('insertTag');

	    if (insertTag !== undefined) {
	        this.insertTag = insertTag;
	    }

	    decorated.call(this, $element, options);

	    if ($.isArray(tags)) {
	      for (var t = 0; t < tags.length; t++) {
	        var tag = tags[t];
	        var item = this._normalizeItem(tag);

	        var $option = this.option(item);

	        this.$element.append($option);
	      }
	    }
	  }

	  Tags.prototype.query = function (decorated, params, callback) {
	    var self = this;

	    this._removeOldTags();

	    if (params.term == null || params.page != null) {
	      decorated.call(this, params, callback);
	      return;
	    }

	    function wrapper (obj, child) {
	      var data = obj.results;

	      for (var i = 0; i < data.length; i++) {
	        var option = data[i];

	        var checkChildren = (
	          option.children != null &&
	          !wrapper({
	            results: option.children
	          }, true)
	        );

	        var checkText = option.text === params.term;

	        if (checkText || checkChildren) {
	          if (child) {
	            return false;
	          }

	          obj.data = data;
	          callback(obj);

	          return;
	        }
	      }

	      if (child) {
	        return true;
	      }

	      var tag = self.createTag(params);

	      if (tag != null) {
	        var $option = self.option(tag);
	        $option.attr('data-select2-tag', true);

	        self.addOptions([$option]);

	        self.insertTag(data, tag);
	      }

	      obj.results = data;

	      callback(obj);
	    }

	    decorated.call(this, params, wrapper);
	  };

	  Tags.prototype.createTag = function (decorated, params) {
	    var term = $.trim(params.term);

	    if (term === '') {
	      return null;
	    }

	    return {
	      id: term,
	      text: term
	    };
	  };

	  Tags.prototype.insertTag = function (_, data, tag) {
	    data.unshift(tag);
	  };

	  Tags.prototype._removeOldTags = function (_) {
	    var tag = this._lastTag;

	    var $options = this.$element.find('option[data-select2-tag]');

	    $options.each(function () {
	      if (this.selected) {
	        return;
	      }

	      $(this).remove();
	    });
	  };

	  return Tags;
	});

	S2.define('select2/data/tokenizer',[
	  'jquery'
	], function ($) {
	  function Tokenizer (decorated, $element, options) {
	    var tokenizer = options.get('tokenizer');

	    if (tokenizer !== undefined) {
	      this.tokenizer = tokenizer;
	    }

	    decorated.call(this, $element, options);
	  }

	  Tokenizer.prototype.bind = function (decorated, container, $container) {
	    decorated.call(this, container, $container);

	    this.$search =  container.dropdown.$search || container.selection.$search ||
	      $container.find('.select2-search__field');
	  };

	  Tokenizer.prototype.query = function (decorated, params, callback) {
	    var self = this;

	    function createAndSelect (data) {
	      // Normalize the data object so we can use it for checks
	      var item = self._normalizeItem(data);

	      // Check if the data object already exists as a tag
	      // Select it if it doesn't
	      var $existingOptions = self.$element.find('option').filter(function () {
	        return $(this).val() === item.id;
	      });

	      // If an existing option wasn't found for it, create the option
	      if (!$existingOptions.length) {
	        var $option = self.option(item);
	        $option.attr('data-select2-tag', true);

	        self._removeOldTags();
	        self.addOptions([$option]);
	      }

	      // Select the item, now that we know there is an option for it
	      select(item);
	    }

	    function select (data) {
	      self.trigger('select', {
	        data: data
	      });
	    }

	    params.term = params.term || '';

	    var tokenData = this.tokenizer(params, this.options, createAndSelect);

	    if (tokenData.term !== params.term) {
	      // Replace the search term if we have the search box
	      if (this.$search.length) {
	        this.$search.val(tokenData.term);
	        this.$search.focus();
	      }

	      params.term = tokenData.term;
	    }

	    decorated.call(this, params, callback);
	  };

	  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
	    var separators = options.get('tokenSeparators') || [];
	    var term = params.term;
	    var i = 0;

	    var createTag = this.createTag || function (params) {
	      return {
	        id: params.term,
	        text: params.term
	      };
	    };

	    while (i < term.length) {
	      var termChar = term[i];

	      if ($.inArray(termChar, separators) === -1) {
	        i++;

	        continue;
	      }

	      var part = term.substr(0, i);
	      var partParams = $.extend({}, params, {
	        term: part
	      });

	      var data = createTag(partParams);

	      if (data == null) {
	        i++;
	        continue;
	      }

	      callback(data);

	      // Reset the term to not include the tokenized portion
	      term = term.substr(i + 1) || '';
	      i = 0;
	    }

	    return {
	      term: term
	    };
	  };

	  return Tokenizer;
	});

	S2.define('select2/data/minimumInputLength',[

	], function () {
	  function MinimumInputLength (decorated, $e, options) {
	    this.minimumInputLength = options.get('minimumInputLength');

	    decorated.call(this, $e, options);
	  }

	  MinimumInputLength.prototype.query = function (decorated, params, callback) {
	    params.term = params.term || '';

	    if (params.term.length < this.minimumInputLength) {
	      this.trigger('results:message', {
	        message: 'inputTooShort',
	        args: {
	          minimum: this.minimumInputLength,
	          input: params.term,
	          params: params
	        }
	      });

	      return;
	    }

	    decorated.call(this, params, callback);
	  };

	  return MinimumInputLength;
	});

	S2.define('select2/data/maximumInputLength',[

	], function () {
	  function MaximumInputLength (decorated, $e, options) {
	    this.maximumInputLength = options.get('maximumInputLength');

	    decorated.call(this, $e, options);
	  }

	  MaximumInputLength.prototype.query = function (decorated, params, callback) {
	    params.term = params.term || '';

	    if (this.maximumInputLength > 0 &&
	        params.term.length > this.maximumInputLength) {
	      this.trigger('results:message', {
	        message: 'inputTooLong',
	        args: {
	          maximum: this.maximumInputLength,
	          input: params.term,
	          params: params
	        }
	      });

	      return;
	    }

	    decorated.call(this, params, callback);
	  };

	  return MaximumInputLength;
	});

	S2.define('select2/data/maximumSelectionLength',[

	], function (){
	  function MaximumSelectionLength (decorated, $e, options) {
	    this.maximumSelectionLength = options.get('maximumSelectionLength');

	    decorated.call(this, $e, options);
	  }

	  MaximumSelectionLength.prototype.query =
	    function (decorated, params, callback) {
	      var self = this;

	      this.current(function (currentData) {
	        var count = currentData != null ? currentData.length : 0;
	        if (self.maximumSelectionLength > 0 &&
	          count >= self.maximumSelectionLength) {
	          self.trigger('results:message', {
	            message: 'maximumSelected',
	            args: {
	              maximum: self.maximumSelectionLength
	            }
	          });
	          return;
	        }
	        decorated.call(self, params, callback);
	      });
	  };

	  return MaximumSelectionLength;
	});

	S2.define('select2/dropdown',[
	  'jquery',
	  './utils'
	], function ($, Utils) {
	  function Dropdown ($element, options) {
	    this.$element = $element;
	    this.options = options;

	    Dropdown.__super__.constructor.call(this);
	  }

	  Utils.Extend(Dropdown, Utils.Observable);

	  Dropdown.prototype.render = function () {
	    var $dropdown = $(
	      '<span class="select2-dropdown">' +
	        '<span class="select2-results"></span>' +
	      '</span>'
	    );

	    $dropdown.attr('dir', this.options.get('dir'));

	    this.$dropdown = $dropdown;

	    return $dropdown;
	  };

	  Dropdown.prototype.bind = function () {
	    // Should be implemented in subclasses
	  };

	  Dropdown.prototype.position = function ($dropdown, $container) {
	    // Should be implmented in subclasses
	  };

	  Dropdown.prototype.destroy = function () {
	    // Remove the dropdown from the DOM
	    this.$dropdown.remove();
	  };

	  return Dropdown;
	});

	S2.define('select2/dropdown/search',[
	  'jquery',
	  '../utils'
	], function ($, Utils) {
	  function Search () { }

	  Search.prototype.render = function (decorated) {
	    var $rendered = decorated.call(this);

	    var $search = $(
	      '<span class="select2-search select2-search--dropdown">' +
	        '<input class="select2-search__field" type="search" tabindex="-1"' +
	        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
	        ' spellcheck="false" role="textbox" />' +
	      '</span>'
	    );

	    this.$searchContainer = $search;
	    this.$search = $search.find('input');

	    $rendered.prepend($search);

	    return $rendered;
	  };

	  Search.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    decorated.call(this, container, $container);

	    this.$search.on('keydown', function (evt) {
	      self.trigger('keypress', evt);

	      self._keyUpPrevented = evt.isDefaultPrevented();
	    });

	    // Workaround for browsers which do not support the `input` event
	    // This will prevent double-triggering of events for browsers which support
	    // both the `keyup` and `input` events.
	    this.$search.on('input', function (evt) {
	      // Unbind the duplicated `keyup` event
	      $(this).off('keyup');
	    });

	    this.$search.on('keyup input', function (evt) {
	      self.handleSearch(evt);
	    });

	    container.on('open', function () {
	      self.$search.attr('tabindex', 0);

	      self.$search.focus();

	      window.setTimeout(function () {
	        self.$search.focus();
	      }, 0);
	    });

	    container.on('close', function () {
	      self.$search.attr('tabindex', -1);

	      self.$search.val('');
	    });

	    container.on('focus', function () {
	      if (container.isOpen()) {
	        self.$search.focus();
	      }
	    });

	    container.on('results:all', function (params) {
	      if (params.query.term == null || params.query.term === '') {
	        var showSearch = self.showSearch(params);

	        if (showSearch) {
	          self.$searchContainer.removeClass('select2-search--hide');
	        } else {
	          self.$searchContainer.addClass('select2-search--hide');
	        }
	      }
	    });
	  };

	  Search.prototype.handleSearch = function (evt) {
	    if (!this._keyUpPrevented) {
	      var input = this.$search.val();

	      this.trigger('query', {
	        term: input
	      });
	    }

	    this._keyUpPrevented = false;
	  };

	  Search.prototype.showSearch = function (_, params) {
	    return true;
	  };

	  return Search;
	});

	S2.define('select2/dropdown/hidePlaceholder',[

	], function () {
	  function HidePlaceholder (decorated, $element, options, dataAdapter) {
	    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

	    decorated.call(this, $element, options, dataAdapter);
	  }

	  HidePlaceholder.prototype.append = function (decorated, data) {
	    data.results = this.removePlaceholder(data.results);

	    decorated.call(this, data);
	  };

	  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
	    if (typeof placeholder === 'string') {
	      placeholder = {
	        id: '',
	        text: placeholder
	      };
	    }

	    return placeholder;
	  };

	  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
	    var modifiedData = data.slice(0);

	    for (var d = data.length - 1; d >= 0; d--) {
	      var item = data[d];

	      if (this.placeholder.id === item.id) {
	        modifiedData.splice(d, 1);
	      }
	    }

	    return modifiedData;
	  };

	  return HidePlaceholder;
	});

	S2.define('select2/dropdown/infiniteScroll',[
	  'jquery'
	], function ($) {
	  function InfiniteScroll (decorated, $element, options, dataAdapter) {
	    this.lastParams = {};

	    decorated.call(this, $element, options, dataAdapter);

	    this.$loadingMore = this.createLoadingMore();
	    this.loading = false;
	  }

	  InfiniteScroll.prototype.append = function (decorated, data) {
	    this.$loadingMore.remove();
	    this.loading = false;

	    decorated.call(this, data);

	    if (this.showLoadingMore(data)) {
	      this.$results.append(this.$loadingMore);
	    }
	  };

	  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    decorated.call(this, container, $container);

	    container.on('query', function (params) {
	      self.lastParams = params;
	      self.loading = true;
	    });

	    container.on('query:append', function (params) {
	      self.lastParams = params;
	      self.loading = true;
	    });

	    this.$results.on('scroll', function () {
	      var isLoadMoreVisible = $.contains(
	        document.documentElement,
	        self.$loadingMore[0]
	      );

	      if (self.loading || !isLoadMoreVisible) {
	        return;
	      }

	      var currentOffset = self.$results.offset().top +
	        self.$results.outerHeight(false);
	      var loadingMoreOffset = self.$loadingMore.offset().top +
	        self.$loadingMore.outerHeight(false);

	      if (currentOffset + 50 >= loadingMoreOffset) {
	        self.loadMore();
	      }
	    });
	  };

	  InfiniteScroll.prototype.loadMore = function () {
	    this.loading = true;

	    var params = $.extend({}, {page: 1}, this.lastParams);

	    params.page++;

	    this.trigger('query:append', params);
	  };

	  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
	    return data.pagination && data.pagination.more;
	  };

	  InfiniteScroll.prototype.createLoadingMore = function () {
	    var $option = $(
	      '<li ' +
	      'class="select2-results__option select2-results__option--load-more"' +
	      'role="treeitem" aria-disabled="true"></li>'
	    );

	    var message = this.options.get('translations').get('loadingMore');

	    $option.html(message(this.lastParams));

	    return $option;
	  };

	  return InfiniteScroll;
	});

	S2.define('select2/dropdown/attachBody',[
	  'jquery',
	  '../utils'
	], function ($, Utils) {
	  function AttachBody (decorated, $element, options) {
	    this.$dropdownParent = options.get('dropdownParent') || $(document.body);

	    decorated.call(this, $element, options);
	  }

	  AttachBody.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    var setupResultsEvents = false;

	    decorated.call(this, container, $container);

	    container.on('open', function () {
	      self._showDropdown();
	      self._attachPositioningHandler(container);

	      if (!setupResultsEvents) {
	        setupResultsEvents = true;

	        container.on('results:all', function () {
	          self._positionDropdown();
	          self._resizeDropdown();
	        });

	        container.on('results:append', function () {
	          self._positionDropdown();
	          self._resizeDropdown();
	        });
	      }
	    });

	    container.on('close', function () {
	      self._hideDropdown();
	      self._detachPositioningHandler(container);
	    });

	    this.$dropdownContainer.on('mousedown', function (evt) {
	      evt.stopPropagation();
	    });
	  };

	  AttachBody.prototype.destroy = function (decorated) {
	    decorated.call(this);

	    this.$dropdownContainer.remove();
	  };

	  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
	    // Clone all of the container classes
	    $dropdown.attr('class', $container.attr('class'));

	    $dropdown.removeClass('select2');
	    $dropdown.addClass('select2-container--open');

	    $dropdown.css({
	      position: 'absolute',
	      top: -999999
	    });

	    this.$container = $container;
	  };

	  AttachBody.prototype.render = function (decorated) {
	    var $container = $('<span></span>');

	    var $dropdown = decorated.call(this);
	    $container.append($dropdown);

	    this.$dropdownContainer = $container;

	    return $container;
	  };

	  AttachBody.prototype._hideDropdown = function (decorated) {
	    this.$dropdownContainer.detach();
	  };

	  AttachBody.prototype._attachPositioningHandler =
	      function (decorated, container) {
	    var self = this;

	    var scrollEvent = 'scroll.select2.' + container.id;
	    var resizeEvent = 'resize.select2.' + container.id;
	    var orientationEvent = 'orientationchange.select2.' + container.id;

	    var $watchers = this.$container.parents().filter(Utils.hasScroll);
	    $watchers.each(function () {
	      $(this).data('select2-scroll-position', {
	        x: $(this).scrollLeft(),
	        y: $(this).scrollTop()
	      });
	    });

	    $watchers.on(scrollEvent, function (ev) {
	      var position = $(this).data('select2-scroll-position');
	      $(this).scrollTop(position.y);
	    });

	    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
	      function (e) {
	      self._positionDropdown();
	      self._resizeDropdown();
	    });
	  };

	  AttachBody.prototype._detachPositioningHandler =
	      function (decorated, container) {
	    var scrollEvent = 'scroll.select2.' + container.id;
	    var resizeEvent = 'resize.select2.' + container.id;
	    var orientationEvent = 'orientationchange.select2.' + container.id;

	    var $watchers = this.$container.parents().filter(Utils.hasScroll);
	    $watchers.off(scrollEvent);

	    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
	  };

	  AttachBody.prototype._positionDropdown = function () {
	    var $window = $(window);

	    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
	    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

	    var newDirection = null;

	    var offset = this.$container.offset();

	    offset.bottom = offset.top + this.$container.outerHeight(false);

	    var container = {
	      height: this.$container.outerHeight(false)
	    };

	    container.top = offset.top;
	    container.bottom = offset.top + container.height;

	    var dropdown = {
	      height: this.$dropdown.outerHeight(false)
	    };

	    var viewport = {
	      top: $window.scrollTop(),
	      bottom: $window.scrollTop() + $window.height()
	    };

	    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
	    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

	    var css = {
	      left: offset.left,
	      top: container.bottom
	    };

	    // Determine what the parent element is to use for calciulating the offset
	    var $offsetParent = this.$dropdownParent;

	    // For statically positoned elements, we need to get the element
	    // that is determining the offset
	    if ($offsetParent.css('position') === 'static') {
	      $offsetParent = $offsetParent.offsetParent();
	    }

	    var parentOffset = $offsetParent.offset();

	    css.top -= parentOffset.top;
	    css.left -= parentOffset.left;

	    if (!isCurrentlyAbove && !isCurrentlyBelow) {
	      newDirection = 'below';
	    }

	    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
	      newDirection = 'above';
	    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
	      newDirection = 'below';
	    }

	    if (newDirection == 'above' ||
	      (isCurrentlyAbove && newDirection !== 'below')) {
	      css.top = container.top - parentOffset.top - dropdown.height;
	    }

	    if (newDirection != null) {
	      this.$dropdown
	        .removeClass('select2-dropdown--below select2-dropdown--above')
	        .addClass('select2-dropdown--' + newDirection);
	      this.$container
	        .removeClass('select2-container--below select2-container--above')
	        .addClass('select2-container--' + newDirection);
	    }

	    this.$dropdownContainer.css(css);
	  };

	  AttachBody.prototype._resizeDropdown = function () {
	    var css = {
	      width: this.$container.outerWidth(false) + 'px'
	    };

	    if (this.options.get('dropdownAutoWidth')) {
	      css.minWidth = css.width;
	      css.position = 'relative';
	      css.width = 'auto';
	    }

	    this.$dropdown.css(css);
	  };

	  AttachBody.prototype._showDropdown = function (decorated) {
	    this.$dropdownContainer.appendTo(this.$dropdownParent);

	    this._positionDropdown();
	    this._resizeDropdown();
	  };

	  return AttachBody;
	});

	S2.define('select2/dropdown/minimumResultsForSearch',[

	], function () {
	  function countResults (data) {
	    var count = 0;

	    for (var d = 0; d < data.length; d++) {
	      var item = data[d];

	      if (item.children) {
	        count += countResults(item.children);
	      } else {
	        count++;
	      }
	    }

	    return count;
	  }

	  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
	    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

	    if (this.minimumResultsForSearch < 0) {
	      this.minimumResultsForSearch = Infinity;
	    }

	    decorated.call(this, $element, options, dataAdapter);
	  }

	  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
	    if (countResults(params.data.results) < this.minimumResultsForSearch) {
	      return false;
	    }

	    return decorated.call(this, params);
	  };

	  return MinimumResultsForSearch;
	});

	S2.define('select2/dropdown/selectOnClose',[

	], function () {
	  function SelectOnClose () { }

	  SelectOnClose.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    decorated.call(this, container, $container);

	    container.on('close', function (params) {
	      self._handleSelectOnClose(params);
	    });
	  };

	  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
	    if (params && params.originalSelect2Event != null) {
	      var event = params.originalSelect2Event;

	      // Don't select an item if the close event was triggered from a select or
	      // unselect event
	      if (event._type === 'select' || event._type === 'unselect') {
	        return;
	      }
	    }

	    var $highlightedResults = this.getHighlightedResults();

	    // Only select highlighted results
	    if ($highlightedResults.length < 1) {
	      return;
	    }

	    var data = $highlightedResults.data('data');

	    // Don't re-select already selected resulte
	    if (
	      (data.element != null && data.element.selected) ||
	      (data.element == null && data.selected)
	    ) {
	      return;
	    }

	    this.trigger('select', {
	        data: data
	    });
	  };

	  return SelectOnClose;
	});

	S2.define('select2/dropdown/closeOnSelect',[

	], function () {
	  function CloseOnSelect () { }

	  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
	    var self = this;

	    decorated.call(this, container, $container);

	    container.on('select', function (evt) {
	      self._selectTriggered(evt);
	    });

	    container.on('unselect', function (evt) {
	      self._selectTriggered(evt);
	    });
	  };

	  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
	    var originalEvent = evt.originalEvent;

	    // Don't close if the control key is being held
	    if (originalEvent && originalEvent.ctrlKey) {
	      return;
	    }

	    this.trigger('close', {
	      originalEvent: originalEvent,
	      originalSelect2Event: evt
	    });
	  };

	  return CloseOnSelect;
	});

	S2.define('select2/i18n/en',[],function () {
	  // English
	  return {
	    errorLoading: function () {
	      return 'The results could not be loaded.';
	    },
	    inputTooLong: function (args) {
	      var overChars = args.input.length - args.maximum;

	      var message = 'Please delete ' + overChars + ' character';

	      if (overChars != 1) {
	        message += 's';
	      }

	      return message;
	    },
	    inputTooShort: function (args) {
	      var remainingChars = args.minimum - args.input.length;

	      var message = 'Please enter ' + remainingChars + ' or more characters';

	      return message;
	    },
	    loadingMore: function () {
	      return 'Loading more results…';
	    },
	    maximumSelected: function (args) {
	      var message = 'You can only select ' + args.maximum + ' item';

	      if (args.maximum != 1) {
	        message += 's';
	      }

	      return message;
	    },
	    noResults: function () {
	      return 'No results found';
	    },
	    searching: function () {
	      return 'Searching…';
	    }
	  };
	});

	S2.define('select2/defaults',[
	  'jquery',
	  'require',

	  './results',

	  './selection/single',
	  './selection/multiple',
	  './selection/placeholder',
	  './selection/allowClear',
	  './selection/search',
	  './selection/eventRelay',

	  './utils',
	  './translation',
	  './diacritics',

	  './data/select',
	  './data/array',
	  './data/ajax',
	  './data/tags',
	  './data/tokenizer',
	  './data/minimumInputLength',
	  './data/maximumInputLength',
	  './data/maximumSelectionLength',

	  './dropdown',
	  './dropdown/search',
	  './dropdown/hidePlaceholder',
	  './dropdown/infiniteScroll',
	  './dropdown/attachBody',
	  './dropdown/minimumResultsForSearch',
	  './dropdown/selectOnClose',
	  './dropdown/closeOnSelect',

	  './i18n/en'
	], function ($, require,

	             ResultsList,

	             SingleSelection, MultipleSelection, Placeholder, AllowClear,
	             SelectionSearch, EventRelay,

	             Utils, Translation, DIACRITICS,

	             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
	             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

	             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
	             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

	             EnglishTranslation) {
	  function Defaults () {
	    this.reset();
	  }

	  Defaults.prototype.apply = function (options) {
	    options = $.extend(true, {}, this.defaults, options);

	    if (options.dataAdapter == null) {
	      if (options.ajax != null) {
	        options.dataAdapter = AjaxData;
	      } else if (options.data != null) {
	        options.dataAdapter = ArrayData;
	      } else {
	        options.dataAdapter = SelectData;
	      }

	      if (options.minimumInputLength > 0) {
	        options.dataAdapter = Utils.Decorate(
	          options.dataAdapter,
	          MinimumInputLength
	        );
	      }

	      if (options.maximumInputLength > 0) {
	        options.dataAdapter = Utils.Decorate(
	          options.dataAdapter,
	          MaximumInputLength
	        );
	      }

	      if (options.maximumSelectionLength > 0) {
	        options.dataAdapter = Utils.Decorate(
	          options.dataAdapter,
	          MaximumSelectionLength
	        );
	      }

	      if (options.tags) {
	        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
	      }

	      if (options.tokenSeparators != null || options.tokenizer != null) {
	        options.dataAdapter = Utils.Decorate(
	          options.dataAdapter,
	          Tokenizer
	        );
	      }

	      if (options.query != null) {
	        var Query = require(options.amdBase + 'compat/query');

	        options.dataAdapter = Utils.Decorate(
	          options.dataAdapter,
	          Query
	        );
	      }

	      if (options.initSelection != null) {
	        var InitSelection = require(options.amdBase + 'compat/initSelection');

	        options.dataAdapter = Utils.Decorate(
	          options.dataAdapter,
	          InitSelection
	        );
	      }
	    }

	    if (options.resultsAdapter == null) {
	      options.resultsAdapter = ResultsList;

	      if (options.ajax != null) {
	        options.resultsAdapter = Utils.Decorate(
	          options.resultsAdapter,
	          InfiniteScroll
	        );
	      }

	      if (options.placeholder != null) {
	        options.resultsAdapter = Utils.Decorate(
	          options.resultsAdapter,
	          HidePlaceholder
	        );
	      }

	      if (options.selectOnClose) {
	        options.resultsAdapter = Utils.Decorate(
	          options.resultsAdapter,
	          SelectOnClose
	        );
	      }
	    }

	    if (options.dropdownAdapter == null) {
	      if (options.multiple) {
	        options.dropdownAdapter = Dropdown;
	      } else {
	        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

	        options.dropdownAdapter = SearchableDropdown;
	      }

	      if (options.minimumResultsForSearch !== 0) {
	        options.dropdownAdapter = Utils.Decorate(
	          options.dropdownAdapter,
	          MinimumResultsForSearch
	        );
	      }

	      if (options.closeOnSelect) {
	        options.dropdownAdapter = Utils.Decorate(
	          options.dropdownAdapter,
	          CloseOnSelect
	        );
	      }

	      if (
	        options.dropdownCssClass != null ||
	        options.dropdownCss != null ||
	        options.adaptDropdownCssClass != null
	      ) {
	        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

	        options.dropdownAdapter = Utils.Decorate(
	          options.dropdownAdapter,
	          DropdownCSS
	        );
	      }

	      options.dropdownAdapter = Utils.Decorate(
	        options.dropdownAdapter,
	        AttachBody
	      );
	    }

	    if (options.selectionAdapter == null) {
	      if (options.multiple) {
	        options.selectionAdapter = MultipleSelection;
	      } else {
	        options.selectionAdapter = SingleSelection;
	      }

	      // Add the placeholder mixin if a placeholder was specified
	      if (options.placeholder != null) {
	        options.selectionAdapter = Utils.Decorate(
	          options.selectionAdapter,
	          Placeholder
	        );
	      }

	      if (options.allowClear) {
	        options.selectionAdapter = Utils.Decorate(
	          options.selectionAdapter,
	          AllowClear
	        );
	      }

	      if (options.multiple) {
	        options.selectionAdapter = Utils.Decorate(
	          options.selectionAdapter,
	          SelectionSearch
	        );
	      }

	      if (
	        options.containerCssClass != null ||
	        options.containerCss != null ||
	        options.adaptContainerCssClass != null
	      ) {
	        var ContainerCSS = require(options.amdBase + 'compat/containerCss');

	        options.selectionAdapter = Utils.Decorate(
	          options.selectionAdapter,
	          ContainerCSS
	        );
	      }

	      options.selectionAdapter = Utils.Decorate(
	        options.selectionAdapter,
	        EventRelay
	      );
	    }

	    if (typeof options.language === 'string') {
	      // Check if the language is specified with a region
	      if (options.language.indexOf('-') > 0) {
	        // Extract the region information if it is included
	        var languageParts = options.language.split('-');
	        var baseLanguage = languageParts[0];

	        options.language = [options.language, baseLanguage];
	      } else {
	        options.language = [options.language];
	      }
	    }

	    if ($.isArray(options.language)) {
	      var languages = new Translation();
	      options.language.push('en');

	      var languageNames = options.language;

	      for (var l = 0; l < languageNames.length; l++) {
	        var name = languageNames[l];
	        var language = {};

	        try {
	          // Try to load it with the original name
	          language = Translation.loadPath(name);
	        } catch (e) {
	          try {
	            // If we couldn't load it, check if it wasn't the full path
	            name = this.defaults.amdLanguageBase + name;
	            language = Translation.loadPath(name);
	          } catch (ex) {
	            // The translation could not be loaded at all. Sometimes this is
	            // because of a configuration problem, other times this can be
	            // because of how Select2 helps load all possible translation files.
	            if (options.debug && window.console && console.warn) {
	              console.warn(
	                'Select2: The language file for "' + name + '" could not be ' +
	                'automatically loaded. A fallback will be used instead.'
	              );
	            }

	            continue;
	          }
	        }

	        languages.extend(language);
	      }

	      options.translations = languages;
	    } else {
	      var baseTranslation = Translation.loadPath(
	        this.defaults.amdLanguageBase + 'en'
	      );
	      var customTranslation = new Translation(options.language);

	      customTranslation.extend(baseTranslation);

	      options.translations = customTranslation;
	    }

	    return options;
	  };

	  Defaults.prototype.reset = function () {
	    function stripDiacritics (text) {
	      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
	      function match(a) {
	        return DIACRITICS[a] || a;
	      }

	      return text.replace(/[^\u0000-\u007E]/g, match);
	    }

	    function matcher (params, data) {
	      // Always return the object if there is nothing to compare
	      if ($.trim(params.term) === '') {
	        return data;
	      }

	      // Do a recursive check for options with children
	      if (data.children && data.children.length > 0) {
	        // Clone the data object if there are children
	        // This is required as we modify the object to remove any non-matches
	        var match = $.extend(true, {}, data);

	        // Check each child of the option
	        for (var c = data.children.length - 1; c >= 0; c--) {
	          var child = data.children[c];

	          var matches = matcher(params, child);

	          // If there wasn't a match, remove the object in the array
	          if (matches == null) {
	            match.children.splice(c, 1);
	          }
	        }

	        // If any children matched, return the new object
	        if (match.children.length > 0) {
	          return match;
	        }

	        // If there were no matching children, check just the plain object
	        return matcher(params, match);
	      }

	      var original = stripDiacritics(data.text).toUpperCase();
	      var term = stripDiacritics(params.term).toUpperCase();

	      // Check if the text contains the term
	      if (original.indexOf(term) > -1) {
	        return data;
	      }

	      // If it doesn't contain the term, don't return anything
	      return null;
	    }

	    this.defaults = {
	      amdBase: './',
	      amdLanguageBase: './i18n/',
	      closeOnSelect: true,
	      debug: false,
	      dropdownAutoWidth: false,
	      escapeMarkup: Utils.escapeMarkup,
	      language: EnglishTranslation,
	      matcher: matcher,
	      minimumInputLength: 0,
	      maximumInputLength: 0,
	      maximumSelectionLength: 0,
	      minimumResultsForSearch: 0,
	      selectOnClose: false,
	      sorter: function (data) {
	        return data;
	      },
	      templateResult: function (result) {
	        return result.text;
	      },
	      templateSelection: function (selection) {
	        return selection.text;
	      },
	      theme: 'default',
	      width: 'resolve'
	    };
	  };

	  Defaults.prototype.set = function (key, value) {
	    var camelKey = $.camelCase(key);

	    var data = {};
	    data[camelKey] = value;

	    var convertedData = Utils._convertData(data);

	    $.extend(this.defaults, convertedData);
	  };

	  var defaults = new Defaults();

	  return defaults;
	});

	S2.define('select2/options',[
	  'require',
	  'jquery',
	  './defaults',
	  './utils'
	], function (require, $, Defaults, Utils) {
	  function Options (options, $element) {
	    this.options = options;

	    if ($element != null) {
	      this.fromElement($element);
	    }

	    this.options = Defaults.apply(this.options);

	    if ($element && $element.is('input')) {
	      var InputCompat = require(this.get('amdBase') + 'compat/inputData');

	      this.options.dataAdapter = Utils.Decorate(
	        this.options.dataAdapter,
	        InputCompat
	      );
	    }
	  }

	  Options.prototype.fromElement = function ($e) {
	    var excludedData = ['select2'];

	    if (this.options.multiple == null) {
	      this.options.multiple = $e.prop('multiple');
	    }

	    if (this.options.disabled == null) {
	      this.options.disabled = $e.prop('disabled');
	    }

	    if (this.options.language == null) {
	      if ($e.prop('lang')) {
	        this.options.language = $e.prop('lang').toLowerCase();
	      } else if ($e.closest('[lang]').prop('lang')) {
	        this.options.language = $e.closest('[lang]').prop('lang');
	      }
	    }

	    if (this.options.dir == null) {
	      if ($e.prop('dir')) {
	        this.options.dir = $e.prop('dir');
	      } else if ($e.closest('[dir]').prop('dir')) {
	        this.options.dir = $e.closest('[dir]').prop('dir');
	      } else {
	        this.options.dir = 'ltr';
	      }
	    }

	    $e.prop('disabled', this.options.disabled);
	    $e.prop('multiple', this.options.multiple);

	    if ($e.data('select2Tags')) {
	      if (this.options.debug && window.console && console.warn) {
	        console.warn(
	          'Select2: The `data-select2-tags` attribute has been changed to ' +
	          'use the `data-data` and `data-tags="true"` attributes and will be ' +
	          'removed in future versions of Select2.'
	        );
	      }

	      $e.data('data', $e.data('select2Tags'));
	      $e.data('tags', true);
	    }

	    if ($e.data('ajaxUrl')) {
	      if (this.options.debug && window.console && console.warn) {
	        console.warn(
	          'Select2: The `data-ajax-url` attribute has been changed to ' +
	          '`data-ajax--url` and support for the old attribute will be removed' +
	          ' in future versions of Select2.'
	        );
	      }

	      $e.attr('ajax--url', $e.data('ajaxUrl'));
	      $e.data('ajax--url', $e.data('ajaxUrl'));
	    }

	    var dataset = {};

	    // Prefer the element's `dataset` attribute if it exists
	    // jQuery 1.x does not correctly handle data attributes with multiple dashes
	    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
	      dataset = $.extend(true, {}, $e[0].dataset, $e.data());
	    } else {
	      dataset = $e.data();
	    }

	    var data = $.extend(true, {}, dataset);

	    data = Utils._convertData(data);

	    for (var key in data) {
	      if ($.inArray(key, excludedData) > -1) {
	        continue;
	      }

	      if ($.isPlainObject(this.options[key])) {
	        $.extend(this.options[key], data[key]);
	      } else {
	        this.options[key] = data[key];
	      }
	    }

	    return this;
	  };

	  Options.prototype.get = function (key) {
	    return this.options[key];
	  };

	  Options.prototype.set = function (key, val) {
	    this.options[key] = val;
	  };

	  return Options;
	});

	S2.define('select2/core',[
	  'jquery',
	  './options',
	  './utils',
	  './keys'
	], function ($, Options, Utils, KEYS) {
	  var Select2 = function ($element, options) {
	    if ($element.data('select2') != null) {
	      $element.data('select2').destroy();
	    }

	    this.$element = $element;

	    this.id = this._generateId($element);

	    options = options || {};

	    this.options = new Options(options, $element);

	    Select2.__super__.constructor.call(this);

	    // Set up the tabindex

	    var tabindex = $element.attr('tabindex') || 0;
	    $element.data('old-tabindex', tabindex);
	    $element.attr('tabindex', '-1');

	    // Set up containers and adapters

	    var DataAdapter = this.options.get('dataAdapter');
	    this.dataAdapter = new DataAdapter($element, this.options);

	    var $container = this.render();

	    this._placeContainer($container);

	    var SelectionAdapter = this.options.get('selectionAdapter');
	    this.selection = new SelectionAdapter($element, this.options);
	    this.$selection = this.selection.render();

	    this.selection.position(this.$selection, $container);

	    var DropdownAdapter = this.options.get('dropdownAdapter');
	    this.dropdown = new DropdownAdapter($element, this.options);
	    this.$dropdown = this.dropdown.render();

	    this.dropdown.position(this.$dropdown, $container);

	    var ResultsAdapter = this.options.get('resultsAdapter');
	    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
	    this.$results = this.results.render();

	    this.results.position(this.$results, this.$dropdown);

	    // Bind events

	    var self = this;

	    // Bind the container to all of the adapters
	    this._bindAdapters();

	    // Register any DOM event handlers
	    this._registerDomEvents();

	    // Register any internal event handlers
	    this._registerDataEvents();
	    this._registerSelectionEvents();
	    this._registerDropdownEvents();
	    this._registerResultsEvents();
	    this._registerEvents();

	    // Set the initial state
	    this.dataAdapter.current(function (initialData) {
	      self.trigger('selection:update', {
	        data: initialData
	      });
	    });

	    // Hide the original select
	    $element.addClass('select2-hidden-accessible');
	    $element.attr('aria-hidden', 'true');

	    // Synchronize any monitored attributes
	    this._syncAttributes();

	    $element.data('select2', this);
	  };

	  Utils.Extend(Select2, Utils.Observable);

	  Select2.prototype._generateId = function ($element) {
	    var id = '';

	    if ($element.attr('id') != null) {
	      id = $element.attr('id');
	    } else if ($element.attr('name') != null) {
	      id = $element.attr('name') + '-' + Utils.generateChars(2);
	    } else {
	      id = Utils.generateChars(4);
	    }

	    id = id.replace(/(:|\.|\[|\]|,)/g, '');
	    id = 'select2-' + id;

	    return id;
	  };

	  Select2.prototype._placeContainer = function ($container) {
	    $container.insertAfter(this.$element);

	    var width = this._resolveWidth(this.$element, this.options.get('width'));

	    if (width != null) {
	      $container.css('width', width);
	    }
	  };

	  Select2.prototype._resolveWidth = function ($element, method) {
	    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

	    if (method == 'resolve') {
	      var styleWidth = this._resolveWidth($element, 'style');

	      if (styleWidth != null) {
	        return styleWidth;
	      }

	      return this._resolveWidth($element, 'element');
	    }

	    if (method == 'element') {
	      var elementWidth = $element.outerWidth(false);

	      if (elementWidth <= 0) {
	        return 'auto';
	      }

	      return elementWidth + 'px';
	    }

	    if (method == 'style') {
	      var style = $element.attr('style');

	      if (typeof(style) !== 'string') {
	        return null;
	      }

	      var attrs = style.split(';');

	      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
	        var attr = attrs[i].replace(/\s/g, '');
	        var matches = attr.match(WIDTH);

	        if (matches !== null && matches.length >= 1) {
	          return matches[1];
	        }
	      }

	      return null;
	    }

	    return method;
	  };

	  Select2.prototype._bindAdapters = function () {
	    this.dataAdapter.bind(this, this.$container);
	    this.selection.bind(this, this.$container);

	    this.dropdown.bind(this, this.$container);
	    this.results.bind(this, this.$container);
	  };

	  Select2.prototype._registerDomEvents = function () {
	    var self = this;

	    this.$element.on('change.select2', function () {
	      self.dataAdapter.current(function (data) {
	        self.trigger('selection:update', {
	          data: data
	        });
	      });
	    });

	    this.$element.on('focus.select2', function (evt) {
	      self.trigger('focus', evt);
	    });

	    this._syncA = Utils.bind(this._syncAttributes, this);
	    this._syncS = Utils.bind(this._syncSubtree, this);

	    if (this.$element[0].attachEvent) {
	      this.$element[0].attachEvent('onpropertychange', this._syncA);
	    }

	    var observer = window.MutationObserver ||
	      window.WebKitMutationObserver ||
	      window.MozMutationObserver
	    ;

	    if (observer != null) {
	      this._observer = new observer(function (mutations) {
	        $.each(mutations, self._syncA);
	        $.each(mutations, self._syncS);
	      });
	      this._observer.observe(this.$element[0], {
	        attributes: true,
	        childList: true,
	        subtree: false
	      });
	    } else if (this.$element[0].addEventListener) {
	      this.$element[0].addEventListener(
	        'DOMAttrModified',
	        self._syncA,
	        false
	      );
	      this.$element[0].addEventListener(
	        'DOMNodeInserted',
	        self._syncS,
	        false
	      );
	      this.$element[0].addEventListener(
	        'DOMNodeRemoved',
	        self._syncS,
	        false
	      );
	    }
	  };

	  Select2.prototype._registerDataEvents = function () {
	    var self = this;

	    this.dataAdapter.on('*', function (name, params) {
	      self.trigger(name, params);
	    });
	  };

	  Select2.prototype._registerSelectionEvents = function () {
	    var self = this;
	    var nonRelayEvents = ['toggle', 'focus'];

	    this.selection.on('toggle', function () {
	      self.toggleDropdown();
	    });

	    this.selection.on('focus', function (params) {
	      self.focus(params);
	    });

	    this.selection.on('*', function (name, params) {
	      if ($.inArray(name, nonRelayEvents) !== -1) {
	        return;
	      }

	      self.trigger(name, params);
	    });
	  };

	  Select2.prototype._registerDropdownEvents = function () {
	    var self = this;

	    this.dropdown.on('*', function (name, params) {
	      self.trigger(name, params);
	    });
	  };

	  Select2.prototype._registerResultsEvents = function () {
	    var self = this;

	    this.results.on('*', function (name, params) {
	      self.trigger(name, params);
	    });
	  };

	  Select2.prototype._registerEvents = function () {
	    var self = this;

	    this.on('open', function () {
	      self.$container.addClass('select2-container--open');
	    });

	    this.on('close', function () {
	      self.$container.removeClass('select2-container--open');
	    });

	    this.on('enable', function () {
	      self.$container.removeClass('select2-container--disabled');
	    });

	    this.on('disable', function () {
	      self.$container.addClass('select2-container--disabled');
	    });

	    this.on('blur', function () {
	      self.$container.removeClass('select2-container--focus');
	    });

	    this.on('query', function (params) {
	      if (!self.isOpen()) {
	        self.trigger('open', {});
	      }

	      this.dataAdapter.query(params, function (data) {
	        self.trigger('results:all', {
	          data: data,
	          query: params
	        });
	      });
	    });

	    this.on('query:append', function (params) {
	      this.dataAdapter.query(params, function (data) {
	        self.trigger('results:append', {
	          data: data,
	          query: params
	        });
	      });
	    });

	    this.on('keypress', function (evt) {
	      var key = evt.which;

	      if (self.isOpen()) {
	        if (key === KEYS.ESC || key === KEYS.TAB ||
	            (key === KEYS.UP && evt.altKey)) {
	          self.close();

	          evt.preventDefault();
	        } else if (key === KEYS.ENTER) {
	          self.trigger('results:select', {});

	          evt.preventDefault();
	        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
	          self.trigger('results:toggle', {});

	          evt.preventDefault();
	        } else if (key === KEYS.UP) {
	          self.trigger('results:previous', {});

	          evt.preventDefault();
	        } else if (key === KEYS.DOWN) {
	          self.trigger('results:next', {});

	          evt.preventDefault();
	        }
	      } else {
	        if (key === KEYS.ENTER || key === KEYS.SPACE ||
	            (key === KEYS.DOWN && evt.altKey)) {
	          self.open();

	          evt.preventDefault();
	        }
	      }
	    });
	  };

	  Select2.prototype._syncAttributes = function () {
	    this.options.set('disabled', this.$element.prop('disabled'));

	    if (this.options.get('disabled')) {
	      if (this.isOpen()) {
	        this.close();
	      }

	      this.trigger('disable', {});
	    } else {
	      this.trigger('enable', {});
	    }
	  };

	  Select2.prototype._syncSubtree = function (evt, mutations) {
	    var changed = false;
	    var self = this;

	    // Ignore any mutation events raised for elements that aren't options or
	    // optgroups. This handles the case when the select element is destroyed
	    if (
	      evt && evt.target && (
	        evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
	      )
	    ) {
	      return;
	    }

	    if (!mutations) {
	      // If mutation events aren't supported, then we can only assume that the
	      // change affected the selections
	      changed = true;
	    } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
	      for (var n = 0; n < mutations.addedNodes.length; n++) {
	        var node = mutations.addedNodes[n];

	        if (node.selected) {
	          changed = true;
	        }
	      }
	    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
	      changed = true;
	    }

	    // Only re-pull the data if we think there is a change
	    if (changed) {
	      this.dataAdapter.current(function (currentData) {
	        self.trigger('selection:update', {
	          data: currentData
	        });
	      });
	    }
	  };

	  /**
	   * Override the trigger method to automatically trigger pre-events when
	   * there are events that can be prevented.
	   */
	  Select2.prototype.trigger = function (name, args) {
	    var actualTrigger = Select2.__super__.trigger;
	    var preTriggerMap = {
	      'open': 'opening',
	      'close': 'closing',
	      'select': 'selecting',
	      'unselect': 'unselecting'
	    };

	    if (args === undefined) {
	      args = {};
	    }

	    if (name in preTriggerMap) {
	      var preTriggerName = preTriggerMap[name];
	      var preTriggerArgs = {
	        prevented: false,
	        name: name,
	        args: args
	      };

	      actualTrigger.call(this, preTriggerName, preTriggerArgs);

	      if (preTriggerArgs.prevented) {
	        args.prevented = true;

	        return;
	      }
	    }

	    actualTrigger.call(this, name, args);
	  };

	  Select2.prototype.toggleDropdown = function () {
	    if (this.options.get('disabled')) {
	      return;
	    }

	    if (this.isOpen()) {
	      this.close();
	    } else {
	      this.open();
	    }
	  };

	  Select2.prototype.open = function () {
	    if (this.isOpen()) {
	      return;
	    }

	    this.trigger('query', {});
	  };

	  Select2.prototype.close = function () {
	    if (!this.isOpen()) {
	      return;
	    }

	    this.trigger('close', {});
	  };

	  Select2.prototype.isOpen = function () {
	    return this.$container.hasClass('select2-container--open');
	  };

	  Select2.prototype.hasFocus = function () {
	    return this.$container.hasClass('select2-container--focus');
	  };

	  Select2.prototype.focus = function (data) {
	    // No need to re-trigger focus events if we are already focused
	    if (this.hasFocus()) {
	      return;
	    }

	    this.$container.addClass('select2-container--focus');
	    this.trigger('focus', {});
	  };

	  Select2.prototype.enable = function (args) {
	    if (this.options.get('debug') && window.console && console.warn) {
	      console.warn(
	        'Select2: The `select2("enable")` method has been deprecated and will' +
	        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
	        ' instead.'
	      );
	    }

	    if (args == null || args.length === 0) {
	      args = [true];
	    }

	    var disabled = !args[0];

	    this.$element.prop('disabled', disabled);
	  };

	  Select2.prototype.data = function () {
	    if (this.options.get('debug') &&
	        arguments.length > 0 && window.console && console.warn) {
	      console.warn(
	        'Select2: Data can no longer be set using `select2("data")`. You ' +
	        'should consider setting the value instead using `$element.val()`.'
	      );
	    }

	    var data = [];

	    this.dataAdapter.current(function (currentData) {
	      data = currentData;
	    });

	    return data;
	  };

	  Select2.prototype.val = function (args) {
	    if (this.options.get('debug') && window.console && console.warn) {
	      console.warn(
	        'Select2: The `select2("val")` method has been deprecated and will be' +
	        ' removed in later Select2 versions. Use $element.val() instead.'
	      );
	    }

	    if (args == null || args.length === 0) {
	      return this.$element.val();
	    }

	    var newVal = args[0];

	    if ($.isArray(newVal)) {
	      newVal = $.map(newVal, function (obj) {
	        return obj.toString();
	      });
	    }

	    this.$element.val(newVal).trigger('change');
	  };

	  Select2.prototype.destroy = function () {
	    this.$container.remove();

	    if (this.$element[0].detachEvent) {
	      this.$element[0].detachEvent('onpropertychange', this._syncA);
	    }

	    if (this._observer != null) {
	      this._observer.disconnect();
	      this._observer = null;
	    } else if (this.$element[0].removeEventListener) {
	      this.$element[0]
	        .removeEventListener('DOMAttrModified', this._syncA, false);
	      this.$element[0]
	        .removeEventListener('DOMNodeInserted', this._syncS, false);
	      this.$element[0]
	        .removeEventListener('DOMNodeRemoved', this._syncS, false);
	    }

	    this._syncA = null;
	    this._syncS = null;

	    this.$element.off('.select2');
	    this.$element.attr('tabindex', this.$element.data('old-tabindex'));

	    this.$element.removeClass('select2-hidden-accessible');
	    this.$element.attr('aria-hidden', 'false');
	    this.$element.removeData('select2');

	    this.dataAdapter.destroy();
	    this.selection.destroy();
	    this.dropdown.destroy();
	    this.results.destroy();

	    this.dataAdapter = null;
	    this.selection = null;
	    this.dropdown = null;
	    this.results = null;
	  };

	  Select2.prototype.render = function () {
	    var $container = $(
	      '<span class="select2 select2-container">' +
	        '<span class="selection"></span>' +
	        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
	      '</span>'
	    );

	    $container.attr('dir', this.options.get('dir'));

	    this.$container = $container;

	    this.$container.addClass('select2-container--' + this.options.get('theme'));

	    $container.data('element', this.$element);

	    return $container;
	  };

	  return Select2;
	});

	S2.define('select2/compat/utils',[
	  'jquery'
	], function ($) {
	  function syncCssClasses ($dest, $src, adapter) {
	    var classes, replacements = [], adapted;

	    classes = $.trim($dest.attr('class'));

	    if (classes) {
	      classes = '' + classes; // for IE which returns object

	      $(classes.split(/\s+/)).each(function () {
	        // Save all Select2 classes
	        if (this.indexOf('select2-') === 0) {
	          replacements.push(this);
	        }
	      });
	    }

	    classes = $.trim($src.attr('class'));

	    if (classes) {
	      classes = '' + classes; // for IE which returns object

	      $(classes.split(/\s+/)).each(function () {
	        // Only adapt non-Select2 classes
	        if (this.indexOf('select2-') !== 0) {
	          adapted = adapter(this);

	          if (adapted != null) {
	            replacements.push(adapted);
	          }
	        }
	      });
	    }

	    $dest.attr('class', replacements.join(' '));
	  }

	  return {
	    syncCssClasses: syncCssClasses
	  };
	});

	S2.define('select2/compat/containerCss',[
	  'jquery',
	  './utils'
	], function ($, CompatUtils) {
	  // No-op CSS adapter that discards all classes by default
	  function _containerAdapter (clazz) {
	    return null;
	  }

	  function ContainerCSS () { }

	  ContainerCSS.prototype.render = function (decorated) {
	    var $container = decorated.call(this);

	    var containerCssClass = this.options.get('containerCssClass') || '';

	    if ($.isFunction(containerCssClass)) {
	      containerCssClass = containerCssClass(this.$element);
	    }

	    var containerCssAdapter = this.options.get('adaptContainerCssClass');
	    containerCssAdapter = containerCssAdapter || _containerAdapter;

	    if (containerCssClass.indexOf(':all:') !== -1) {
	      containerCssClass = containerCssClass.replace(':all:', '');

	      var _cssAdapter = containerCssAdapter;

	      containerCssAdapter = function (clazz) {
	        var adapted = _cssAdapter(clazz);

	        if (adapted != null) {
	          // Append the old one along with the adapted one
	          return adapted + ' ' + clazz;
	        }

	        return clazz;
	      };
	    }

	    var containerCss = this.options.get('containerCss') || {};

	    if ($.isFunction(containerCss)) {
	      containerCss = containerCss(this.$element);
	    }

	    CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);

	    $container.css(containerCss);
	    $container.addClass(containerCssClass);

	    return $container;
	  };

	  return ContainerCSS;
	});

	S2.define('select2/compat/dropdownCss',[
	  'jquery',
	  './utils'
	], function ($, CompatUtils) {
	  // No-op CSS adapter that discards all classes by default
	  function _dropdownAdapter (clazz) {
	    return null;
	  }

	  function DropdownCSS () { }

	  DropdownCSS.prototype.render = function (decorated) {
	    var $dropdown = decorated.call(this);

	    var dropdownCssClass = this.options.get('dropdownCssClass') || '';

	    if ($.isFunction(dropdownCssClass)) {
	      dropdownCssClass = dropdownCssClass(this.$element);
	    }

	    var dropdownCssAdapter = this.options.get('adaptDropdownCssClass');
	    dropdownCssAdapter = dropdownCssAdapter || _dropdownAdapter;

	    if (dropdownCssClass.indexOf(':all:') !== -1) {
	      dropdownCssClass = dropdownCssClass.replace(':all:', '');

	      var _cssAdapter = dropdownCssAdapter;

	      dropdownCssAdapter = function (clazz) {
	        var adapted = _cssAdapter(clazz);

	        if (adapted != null) {
	          // Append the old one along with the adapted one
	          return adapted + ' ' + clazz;
	        }

	        return clazz;
	      };
	    }

	    var dropdownCss = this.options.get('dropdownCss') || {};

	    if ($.isFunction(dropdownCss)) {
	      dropdownCss = dropdownCss(this.$element);
	    }

	    CompatUtils.syncCssClasses($dropdown, this.$element, dropdownCssAdapter);

	    $dropdown.css(dropdownCss);
	    $dropdown.addClass(dropdownCssClass);

	    return $dropdown;
	  };

	  return DropdownCSS;
	});

	S2.define('select2/compat/initSelection',[
	  'jquery'
	], function ($) {
	  function InitSelection (decorated, $element, options) {
	    if (options.get('debug') && window.console && console.warn) {
	      console.warn(
	        'Select2: The `initSelection` option has been deprecated in favor' +
	        ' of a custom data adapter that overrides the `current` method. ' +
	        'This method is now called multiple times instead of a single ' +
	        'time when the instance is initialized. Support will be removed ' +
	        'for the `initSelection` option in future versions of Select2'
	      );
	    }

	    this.initSelection = options.get('initSelection');
	    this._isInitialized = false;

	    decorated.call(this, $element, options);
	  }

	  InitSelection.prototype.current = function (decorated, callback) {
	    var self = this;

	    if (this._isInitialized) {
	      decorated.call(this, callback);

	      return;
	    }

	    this.initSelection.call(null, this.$element, function (data) {
	      self._isInitialized = true;

	      if (!$.isArray(data)) {
	        data = [data];
	      }

	      callback(data);
	    });
	  };

	  return InitSelection;
	});

	S2.define('select2/compat/inputData',[
	  'jquery'
	], function ($) {
	  function InputData (decorated, $element, options) {
	    this._currentData = [];
	    this._valueSeparator = options.get('valueSeparator') || ',';

	    if ($element.prop('type') === 'hidden') {
	      if (options.get('debug') && console && console.warn) {
	        console.warn(
	          'Select2: Using a hidden input with Select2 is no longer ' +
	          'supported and may stop working in the future. It is recommended ' +
	          'to use a `<select>` element instead.'
	        );
	      }
	    }

	    decorated.call(this, $element, options);
	  }

	  InputData.prototype.current = function (_, callback) {
	    function getSelected (data, selectedIds) {
	      var selected = [];

	      if (data.selected || $.inArray(data.id, selectedIds) !== -1) {
	        data.selected = true;
	        selected.push(data);
	      } else {
	        data.selected = false;
	      }

	      if (data.children) {
	        selected.push.apply(selected, getSelected(data.children, selectedIds));
	      }

	      return selected;
	    }

	    var selected = [];

	    for (var d = 0; d < this._currentData.length; d++) {
	      var data = this._currentData[d];

	      selected.push.apply(
	        selected,
	        getSelected(
	          data,
	          this.$element.val().split(
	            this._valueSeparator
	          )
	        )
	      );
	    }

	    callback(selected);
	  };

	  InputData.prototype.select = function (_, data) {
	    if (!this.options.get('multiple')) {
	      this.current(function (allData) {
	        $.map(allData, function (data) {
	          data.selected = false;
	        });
	      });

	      this.$element.val(data.id);
	      this.$element.trigger('change');
	    } else {
	      var value = this.$element.val();
	      value += this._valueSeparator + data.id;

	      this.$element.val(value);
	      this.$element.trigger('change');
	    }
	  };

	  InputData.prototype.unselect = function (_, data) {
	    var self = this;

	    data.selected = false;

	    this.current(function (allData) {
	      var values = [];

	      for (var d = 0; d < allData.length; d++) {
	        var item = allData[d];

	        if (data.id == item.id) {
	          continue;
	        }

	        values.push(item.id);
	      }

	      self.$element.val(values.join(self._valueSeparator));
	      self.$element.trigger('change');
	    });
	  };

	  InputData.prototype.query = function (_, params, callback) {
	    var results = [];

	    for (var d = 0; d < this._currentData.length; d++) {
	      var data = this._currentData[d];

	      var matches = this.matches(params, data);

	      if (matches !== null) {
	        results.push(matches);
	      }
	    }

	    callback({
	      results: results
	    });
	  };

	  InputData.prototype.addOptions = function (_, $options) {
	    var options = $.map($options, function ($option) {
	      return $.data($option[0], 'data');
	    });

	    this._currentData.push.apply(this._currentData, options);
	  };

	  return InputData;
	});

	S2.define('select2/compat/matcher',[
	  'jquery'
	], function ($) {
	  function oldMatcher (matcher) {
	    function wrappedMatcher (params, data) {
	      var match = $.extend(true, {}, data);

	      if (params.term == null || $.trim(params.term) === '') {
	        return match;
	      }

	      if (data.children) {
	        for (var c = data.children.length - 1; c >= 0; c--) {
	          var child = data.children[c];

	          // Check if the child object matches
	          // The old matcher returned a boolean true or false
	          var doesMatch = matcher(params.term, child.text, child);

	          // If the child didn't match, pop it off
	          if (!doesMatch) {
	            match.children.splice(c, 1);
	          }
	        }

	        if (match.children.length > 0) {
	          return match;
	        }
	      }

	      if (matcher(params.term, data.text, data)) {
	        return match;
	      }

	      return null;
	    }

	    return wrappedMatcher;
	  }

	  return oldMatcher;
	});

	S2.define('select2/compat/query',[

	], function () {
	  function Query (decorated, $element, options) {
	    if (options.get('debug') && window.console && console.warn) {
	      console.warn(
	        'Select2: The `query` option has been deprecated in favor of a ' +
	        'custom data adapter that overrides the `query` method. Support ' +
	        'will be removed for the `query` option in future versions of ' +
	        'Select2.'
	      );
	    }

	    decorated.call(this, $element, options);
	  }

	  Query.prototype.query = function (_, params, callback) {
	    params.callback = callback;

	    var query = this.options.get('query');

	    query.call(null, params);
	  };

	  return Query;
	});

	S2.define('select2/dropdown/attachContainer',[

	], function () {
	  function AttachContainer (decorated, $element, options) {
	    decorated.call(this, $element, options);
	  }

	  AttachContainer.prototype.position =
	    function (decorated, $dropdown, $container) {
	    var $dropdownContainer = $container.find('.dropdown-wrapper');
	    $dropdownContainer.append($dropdown);

	    $dropdown.addClass('select2-dropdown--below');
	    $container.addClass('select2-container--below');
	  };

	  return AttachContainer;
	});

	S2.define('select2/dropdown/stopPropagation',[

	], function () {
	  function StopPropagation () { }

	  StopPropagation.prototype.bind = function (decorated, container, $container) {
	    decorated.call(this, container, $container);

	    var stoppedEvents = [
	    'blur',
	    'change',
	    'click',
	    'dblclick',
	    'focus',
	    'focusin',
	    'focusout',
	    'input',
	    'keydown',
	    'keyup',
	    'keypress',
	    'mousedown',
	    'mouseenter',
	    'mouseleave',
	    'mousemove',
	    'mouseover',
	    'mouseup',
	    'search',
	    'touchend',
	    'touchstart'
	    ];

	    this.$dropdown.on(stoppedEvents.join(' '), function (evt) {
	      evt.stopPropagation();
	    });
	  };

	  return StopPropagation;
	});

	S2.define('select2/selection/stopPropagation',[

	], function () {
	  function StopPropagation () { }

	  StopPropagation.prototype.bind = function (decorated, container, $container) {
	    decorated.call(this, container, $container);

	    var stoppedEvents = [
	      'blur',
	      'change',
	      'click',
	      'dblclick',
	      'focus',
	      'focusin',
	      'focusout',
	      'input',
	      'keydown',
	      'keyup',
	      'keypress',
	      'mousedown',
	      'mouseenter',
	      'mouseleave',
	      'mousemove',
	      'mouseover',
	      'mouseup',
	      'search',
	      'touchend',
	      'touchstart'
	    ];

	    this.$selection.on(stoppedEvents.join(' '), function (evt) {
	      evt.stopPropagation();
	    });
	  };

	  return StopPropagation;
	});

	/*!
	 * jQuery Mousewheel 3.1.13
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 */

	(function (factory) {
	    if ( typeof S2.define === 'function' && S2.define.amd ) {
	        // AMD. Register as an anonymous module.
	        S2.define('jquery-mousewheel',['jquery'], factory);
	    } else if (typeof exports === 'object') {
	        // Node/CommonJS style for Browserify
	        module.exports = factory;
	    } else {
	        // Browser globals
	        factory(jQuery);
	    }
	}(function ($) {

	    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
	        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
	                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
	        slice  = Array.prototype.slice,
	        nullLowestDeltaTimeout, lowestDelta;

	    if ( $.event.fixHooks ) {
	        for ( var i = toFix.length; i; ) {
	            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
	        }
	    }

	    var special = $.event.special.mousewheel = {
	        version: '3.1.12',

	        setup: function() {
	            if ( this.addEventListener ) {
	                for ( var i = toBind.length; i; ) {
	                    this.addEventListener( toBind[--i], handler, false );
	                }
	            } else {
	                this.onmousewheel = handler;
	            }
	            // Store the line height and page height for this particular element
	            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
	            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
	        },

	        teardown: function() {
	            if ( this.removeEventListener ) {
	                for ( var i = toBind.length; i; ) {
	                    this.removeEventListener( toBind[--i], handler, false );
	                }
	            } else {
	                this.onmousewheel = null;
	            }
	            // Clean up the data we added to the element
	            $.removeData(this, 'mousewheel-line-height');
	            $.removeData(this, 'mousewheel-page-height');
	        },

	        getLineHeight: function(elem) {
	            var $elem = $(elem),
	                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
	            if (!$parent.length) {
	                $parent = $('body');
	            }
	            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
	        },

	        getPageHeight: function(elem) {
	            return $(elem).height();
	        },

	        settings: {
	            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
	            normalizeOffset: true  // calls getBoundingClientRect for each event
	        }
	    };

	    $.fn.extend({
	        mousewheel: function(fn) {
	            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
	        },

	        unmousewheel: function(fn) {
	            return this.unbind('mousewheel', fn);
	        }
	    });


	    function handler(event) {
	        var orgEvent   = event || window.event,
	            args       = slice.call(arguments, 1),
	            delta      = 0,
	            deltaX     = 0,
	            deltaY     = 0,
	            absDelta   = 0,
	            offsetX    = 0,
	            offsetY    = 0;
	        event = $.event.fix(orgEvent);
	        event.type = 'mousewheel';

	        // Old school scrollwheel delta
	        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
	        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
	        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
	        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

	        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
	        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
	            deltaX = deltaY * -1;
	            deltaY = 0;
	        }

	        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
	        delta = deltaY === 0 ? deltaX : deltaY;

	        // New school wheel delta (wheel event)
	        if ( 'deltaY' in orgEvent ) {
	            deltaY = orgEvent.deltaY * -1;
	            delta  = deltaY;
	        }
	        if ( 'deltaX' in orgEvent ) {
	            deltaX = orgEvent.deltaX;
	            if ( deltaY === 0 ) { delta  = deltaX * -1; }
	        }

	        // No change actually happened, no reason to go any further
	        if ( deltaY === 0 && deltaX === 0 ) { return; }

	        // Need to convert lines and pages to pixels if we aren't already in pixels
	        // There are three delta modes:
	        //   * deltaMode 0 is by pixels, nothing to do
	        //   * deltaMode 1 is by lines
	        //   * deltaMode 2 is by pages
	        if ( orgEvent.deltaMode === 1 ) {
	            var lineHeight = $.data(this, 'mousewheel-line-height');
	            delta  *= lineHeight;
	            deltaY *= lineHeight;
	            deltaX *= lineHeight;
	        } else if ( orgEvent.deltaMode === 2 ) {
	            var pageHeight = $.data(this, 'mousewheel-page-height');
	            delta  *= pageHeight;
	            deltaY *= pageHeight;
	            deltaX *= pageHeight;
	        }

	        // Store lowest absolute delta to normalize the delta values
	        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

	        if ( !lowestDelta || absDelta < lowestDelta ) {
	            lowestDelta = absDelta;

	            // Adjust older deltas if necessary
	            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
	                lowestDelta /= 40;
	            }
	        }

	        // Adjust older deltas if necessary
	        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
	            // Divide all the things by 40!
	            delta  /= 40;
	            deltaX /= 40;
	            deltaY /= 40;
	        }

	        // Get a whole, normalized value for the deltas
	        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
	        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
	        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

	        // Normalise offsetX and offsetY properties
	        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
	            var boundingRect = this.getBoundingClientRect();
	            offsetX = event.clientX - boundingRect.left;
	            offsetY = event.clientY - boundingRect.top;
	        }

	        // Add information to the event object
	        event.deltaX = deltaX;
	        event.deltaY = deltaY;
	        event.deltaFactor = lowestDelta;
	        event.offsetX = offsetX;
	        event.offsetY = offsetY;
	        // Go ahead and set deltaMode to 0 since we converted to pixels
	        // Although this is a little odd since we overwrite the deltaX/Y
	        // properties with normalized deltas.
	        event.deltaMode = 0;

	        // Add event and delta to the front of the arguments
	        args.unshift(event, delta, deltaX, deltaY);

	        // Clearout lowestDelta after sometime to better
	        // handle multiple device types that give different
	        // a different lowestDelta
	        // Ex: trackpad = 3 and mouse wheel = 120
	        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
	        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

	        return ($.event.dispatch || $.event.handle).apply(this, args);
	    }

	    function nullLowestDelta() {
	        lowestDelta = null;
	    }

	    function shouldAdjustOldDeltas(orgEvent, absDelta) {
	        // If this is an older event and the delta is divisable by 120,
	        // then we are assuming that the browser is treating this as an
	        // older mouse wheel event and that we should divide the deltas
	        // by 40 to try and get a more usable deltaFactor.
	        // Side note, this actually impacts the reported scroll distance
	        // in older browsers and can cause scrolling to be slower than native.
	        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
	        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
	    }

	}));

	S2.define('jquery.select2',[
	  'jquery',
	  'jquery-mousewheel',

	  './select2/core',
	  './select2/defaults'
	], function ($, _, Select2, Defaults) {
	  if ($.fn.select2 == null) {
	    // All methods that should return the element
	    var thisMethods = ['open', 'close', 'destroy'];

	    $.fn.select2 = function (options) {
	      options = options || {};

	      if (typeof options === 'object') {
	        this.each(function () {
	          var instanceOptions = $.extend(true, {}, options);

	          var instance = new Select2($(this), instanceOptions);
	        });

	        return this;
	      } else if (typeof options === 'string') {
	        var ret;
	        var args = Array.prototype.slice.call(arguments, 1);

	        this.each(function () {
	          var instance = $(this).data('select2');

	          if (instance == null && window.console && console.error) {
	            console.error(
	              'The select2(\'' + options + '\') method was called on an ' +
	              'element that is not using Select2.'
	            );
	          }

	          ret = instance[options].apply(instance, args);
	        });

	        // Check if we should be returning `this`
	        if ($.inArray(options, thisMethods) > -1) {
	          return this;
	        }

	        return ret;
	      } else {
	        throw new Error('Invalid arguments for Select2: ' + options);
	      }
	    };
	  }

	  if ($.fn.select2.defaults == null) {
	    $.fn.select2.defaults = Defaults;
	  }

	  return Select2;
	});

	  // Return the AMD loader configuration so it can be used outside of this file
	  return {
	    define: S2.define,
	    require: S2.require
	  };
	}());

	  // Autoload the jQuery bindings
	  // We know that all of the modules exist above this, so we're safe
	  var select2 = S2.require('jquery.select2');

	  // Hold the AMD module references on the jQuery function that was just loaded
	  // This allows Select2 to use the internal loader outside of this file, such
	  // as in the language files.
	  jQuery.fn.select2.amd = S2;

	  // Return the Select2 instance for anyone who is importing it.
	  return select2;
	}));
})();