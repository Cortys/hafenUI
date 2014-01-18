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
});

logout.do = {
	logout: function() {
		socket.do.send("logout", {}, function(success) {
			if(success)
				location.reload();
		});
	}
};