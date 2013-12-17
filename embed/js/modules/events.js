/**
 * Module: events
 * Purpose: Cross device events for desktop and touch
 * Author: Clemens Damke
 */

new Modular("events", [], function() {
	this.deviceType = this.getDeviceType();
	
	this.click = this.deviceType?"touchend":"click";
	this.move = this.deviceType?"touchmove":"mousemove";
	this.down = this.deviceType?"touchstart":"mousedown";
	this.end = this.deviceType?"touchend":"mouseup";
	this.doubleClick = "dblclick";
});

events.getDeviceType = function() {
	var el = document.createElement('div');
	el.setAttribute('ongesturestart', 'return;');
	return (typeof el.ongesturestart == "function" || (/android/gi).test(navigator.appVersion))?((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/mobile/i))?2:1):false;
};