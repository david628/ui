(function() {
	base.init(["loading"]);
	/*$(".language-js").each(function() {
		alert(this.innerHTML);
	});*/
	$(".cls-box").each(function() {
		var box = $(this);
		var code = box.find(".language-js").html();
		box.find(".button").click(function() {
			eval(code);
		});
	});
})();