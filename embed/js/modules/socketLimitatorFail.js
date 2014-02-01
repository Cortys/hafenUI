/**
 * Module: socketLimitatorFail
 * Purpose: Limit number of socktes to server to one per client (= IP)
 * Author: Clemens Damke
 */

new Modular("socketLimitatorFail", ["socketLimitator"], function() {
	socketLimitator.do.onFail(this.do);
});

socketLimitatorFail.do = function() {
	socket.do.quit();
	$("#limitFail").show();
};