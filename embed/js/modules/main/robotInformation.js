/**
 * Module: robotInformation
 * Purpose: Load information about connected robot
 * Author: Clemens Damke
 */

new Modular("robotInformation", ["socket"], function() {
	var t = this;
	socket.do.register("robotInformation", function(robot) {
		if(typeof t.callback == "function")
			t.callback(robot);
		t.robot = robot;
		$("#center .headArea h1").html(robot.name).siblings(".robotIcon").css("background-image", "url(imgs/robots/"+robot.picture+".png)");
	});
});

robotInformation.getData = function(callback) {
	if(!this.robot)
		this.callback = callback;
	else
		callback(this.robot);
};