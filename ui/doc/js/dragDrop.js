(function() {
	base.init(["util", "dragDrop"]);
	/*$(".language-js").each(function() {
		alert(this.innerHTML);
	});*/
	$(".cls-box").each(function() {
		var box = $(this);
		var code = box.find(".language-js").html();
		eval(code);
		/*box.find(".button").bind("click", function() {
			var dlg = $("#" + this.rel);
			if(dlg.css("display") != "none") {
				dlg.css("display", "none");
			} else {
				dlg.css("display", "block");
			}
		});*/
	});
})();