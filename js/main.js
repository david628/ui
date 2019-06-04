(function() {
	var tools = {
	  init: function() {
	  	var self = this;
	  	$("#id-_save").click(function() {
	  		alert(self.el.innerHTML);
	  	});
	  	self.$el = $("#id-wrap");
	  	self.el = self.$el.get(0);
	  	var menuList = self.$el.find(".cu-tools");
	  	if(menuList && menuList.length) {
	  		for(var i=0;i<menuList.length;i++) {
	  			var menu = menuList[i];
	  			if(!self.menuDragZone) {
	  				var proxy = document.createElement("div");
	  				proxy.style.position = "absolute";
	          //proxy.innerHTML = '<div class="cls-dd-drag-ghost"></div>';
	          document.body.appendChild(proxy);
	          self.menuDragZone = new DBapp.DragDrop(proxy, {
	            constrain : false,
	            proxy : proxy,
	            //scope : this,
	            handle : menu,
	            onMouseDown : function(e, target, opt) {
	            	if(!this.ghost) {
	  		          this.ghost = this.proxy;
	            	}
	            	clone = this.currentHandle.cloneNode(true);
	            	this.ghost.innerHTML = '<div class="cu-tools"><span class="cu-tools-remove">X</span>' + clone.innerHTML + '</div>';
	            	var xy = [e.pageX, e.pageY];
	  	          this.setStartPos([xy[0], xy[1]]); 
	  	          this.startX = xy[0];
	  	          this.startY = xy[1];
	  	          this.increaseX = this.startX - this.startPageX;
	  	          this.increaseY = this.startY - this.startPageY;
	  	          this.hideDrag();
	  	        },
	  	        onMouseMove : function(e) {
	  	        	var drag_jq = jQuery(this.getDrag());
	  	        	//this.target = self.findRow(e.target);
	  	        	var target = e.target;
	  	        	if(!DBapp.Css.hasClass(target, "cu-tools-wrap")) {
	  	        		this.target = target;
	  	        	} else {
	  	        		this.target = null;
	  	        	}
	  	        	/* if(this.target) {
	  	        		drag_jq.addClass("cls-dd-drop-ok");
	  	        		drag_jq.removeClass("cls-dd-drop-no");
	  	        	} else {
	  	        		drag_jq.addClass("cls-dd-drop-no");
	  	        		drag_jq.removeClass("cls-dd-drop-ok");
	  	        	} */
	  	        },
	  	        onMouseUp : function(e) {
	  	        	if(this.target === undefined) {
	  	        		return;
	  	        	}
	  	        	if(this.target) {
	  	        		var newTool = $(this.ghost).clone();
	  	        		newTool.className = "comp";
	  	        		newTool.css('visibility', 'visible');
	  	        		newTool.appendTo($(document.body));
	  	        		newTool.css({
	  	        			width: 300,
                  	height: 200
	  	        		});
	  	        		newTool.find('.cu-tools-remove').click(function() {
	  	        			newTool.remove();
	  	        		});
	  	        		var $cur = $('<div class="demo-chart"></div>');
	  	        		newTool.append($cur);
	  	        		window.CURRENT = $cur.get(0);
	  	        		var textarea = newTool.find('textarea');
                  if(textarea.get(0).name == "earth") {
                  	newTool.addClass("earth");
	  	        		}
	  	        		eval(textarea.val());
	  	        		//var parent = newTool.get(0).parentNode;
	  	        		//parent.style.width = 200 + "px";
                  //newTool.css({
                  	//width: 500,
                  	//height: 400
                  //});
	  	        		new DBapp.Resizable(newTool, {
							  	  handles: "all",
							  	  //minWidth: 200,
							  	  //minHeight: 100,
							  	  minWidth: 300,
							  	  minHeight: 200,
							  	  pinned: true,
							  	  afterHandleOut: function() {
							  	  	newTool.find(".demo-chart").remove();
							  	  	var $cur = $('<div class="demo-chart"></div>');
			  	        		newTool.append($cur);
			  	        		window.CURRENT = $cur.get(0);
			  	        		var textarea = newTool.find('textarea');
		                  if(textarea.get(0).name == "earth") {
		                  	newTool.addClass("earth");
			  	        		}
			  	        		eval(textarea.val());
							  	  }
							  	});
	  	        		new DBapp.DragDrop(newTool, {
	  		            constrain : false,
	  		            proxy : false,
	  		            //scope : this,
	  		            handle : newTool
	  		          });
	  	        	} else {
	  	        		this.showDrag();
	  	        		var me = this;
	  	        		var xy = DBapp.Css.getXY(this.currentHandle);
	  	        		jQuery(this.getDrag()).animate({
			        			left : xy[0],
			        			top : xy[1]
			        		}, 0.35 * 1000, undefined, function() {
			        			me.hideDrag();
			        		});
	  	        	}
	  	        	delete this.target;
	  	        }
	          });
	      	} else {
	      		self.menuDragZone.addHandle(menu);
	      	}
	  		}
	  	}
	  	
	  }		
	};
	tools.init();
})();