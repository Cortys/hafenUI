/**
 * Module: robotInformation
 * Purpose: Load information about connected robot
 * Author: Clemens Damke
 */

new Modular("robotInformation", ["socket"], function() {
	socket.do.register("robotInformation", function(robot) {
		$("#center .headArea h1").html(robot.name).siblings(".robotIcon").css("background-image", "url(imgs/robots/"+robot.picture+".png)");
	});
});