(function() {
	main = {
	  init: function() {
	  	//alert(DBapp.ui.Waterfall);
	  	var self = this;
	  	if(!self.grid) {
	  		self.grid = new DBapp.ui.Waterfall({
	  			renderTo: 'id-product',
	  			//width: 220,
	  			//splitWidth: 5,
	  			//paddingWidth: 5,
	  			loadBtn: {},
	  			pageView: {
	  				callback: function(page, o) {
	  					self.req_get();
	  				}
	  			}
	  		});
	  		self.grid.getTemplate = function(l, ds) {
	  			//l.style.width = self.grid.width + "px";
	  			l.innerHTML = 
	  			'<div class="img-item">' +
	  			  '<div class="img-item-con">' +
	  			    '<a target="_blank" href="javascript:;"><img src="' + ds['img'] + '"/></a>' +
	  			    '<span class="price">￥' + ds['price'] + '</span>' +
	  			  '</div>' +
	  			  '<div class="img-item-title">' +
	  			    '<a target="_blank" href="javascript:;">' + ds['name'] + '</a>' +
	  			  '</div>' +
	  			'<div>';
	  		}
	  	}
	  	self.req_get();
	  },
	  req_get: function() {
	  	var self = this;
	  	$.ajax({
	  		type: 'post',
	  		dataType: 'json',
	  		url: 'run',
	  		success: function() {
	  			
	  		},
	  		error: function() {
	  			var data = {
	  			  total: 200,
	  			  list: []
	  			};
	  			for(var i = 0; i < 50; i++) {
	  				data['list'].push({
	  					id: i,
	  					price: (i * 10.02).toFixed(2),
	  					name: '16年秋季新款,百搭运动童鞋',
	  					img: '../images/taobao/product/' + i + '.png'
	  				});
	  			}
	  			self.grid.load(data['list'] || [], data['total'] || []);
	  		}
	  	});
	  }
	};
	main.init();
})();