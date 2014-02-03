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
	t.do.listen();
});

remote.val = {
	blocked: false
};

remote.do = {
	val: remote.val,
	move: function(dir) {
		var t = this.val;
		socket.do.send("moveRobot", { direction:dir });
	},
	listen: function() {
		socket.do.register("currentJobs", function(data) {
			console.log("jobs", data);
		});
		socket.do.register("currentTasks", function(data) {
			console.log("tasks", data);
		});
	}
};