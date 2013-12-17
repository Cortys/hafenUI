/**
 * Module: ajaxBar
 * Purpose: Show loading or error dialog for dynamic content stuff (ajax or websockets)
 * Author: Clemens Damke
 */

new Modular("ajaxBar", ["events"], function() {
	var t = this;
	t.e = $("#loading");
	t.e.children("div").on(events.click, function() {
		t.hide();
	});
});

ajaxBar.hide = function() {
	this.e.attr("class", "hide");
};

ajaxBar.show = function() {
	this.e.attr("class", "show");
};

ajaxBar.error = function() {
	this.e.attr("class", "error");
};