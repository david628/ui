(function() {
	base.init(["util", "alignTo"]);
	/*$(".language-js").each(function() {
		alert(this.innerHTML);
	});*/
	$(".cls-box").each(function() {
		var box = $(this);
		var code = box.find(".language-js").html();
		//box.find(".button").bind("click", function() {
			eval(code);
		//});
	});
})();