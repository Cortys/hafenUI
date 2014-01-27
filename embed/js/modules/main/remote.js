/**
 * Module: remote
 * Purpose: Remote control for the robot
 * Author: Clemens Damke
 */


new Modular("remote", ["socket", "events"], function() {
    var t = this;
	$("#remote .direction").on(events.click, function() {
	    if(!t.val.blocked)
            t.do.move($(this).attr("data-dir"));
	});
});

remote.val = {
    blocked: false
};

remote.do = {
    val: remote.val,
	move: function(dir) {
	    var t = this.val;
	    t.blocked = true;
	    socket.do.send("moveRobot", { direction:dir }, function(success) {
	        if(success)
                console.log("BAM");
	        t.blocked = false;
	    });
	}
};