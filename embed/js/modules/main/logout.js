/**
 * Module: logout
 * Purpose: Quit the connection to the robot
 * Author: Clemens Damke
 */


new Modular("logout", ["socket", "events"], function() {
	var t = this;
	$("#logout").on(events.click, function() {
		t.do.logout();
	});
	
	socket.do.register("connectionLost", function() {
		window.alert("I'm so very sorry for you.\nThe connection to your robot was destroyed.\nPlease try to reconnect.");
		location.reload();
	});
});

logout.do = {
	logout: function() {
		socket.do.send("logout", {}, function(success) {
			if(success) {
				$("body").attr("class", "animated fadeOutUp").unbind(events.transitionEnd).on(events.transitionEnd, function() {
					location.reload();
				});
			}
		});
	}
};