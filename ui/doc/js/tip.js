(function() {
	base.init(["tip"]);
	/*$(".language-js").each(function() {
		alert(this.innerHTML);
	});*/
	$(".cls-box").each(function() {
		var box = $(this);
		var code = box.find(".language-js").html();
		//box.find("select").each(function() {
			eval(code);
		//});
	});
})();