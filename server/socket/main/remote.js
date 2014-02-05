var JobSimple = require("../../core/control/jobs/simple.js"),
	dirs = {
		top: "forward",
		left: "left",
		bottom: "turn",
		right: "right"
	};

module.exports = function(jobManager) {
	jobManager.client.socket.on("moveRobot", function(data) {
		jobManager.addJob(new JobSimple(dirs[data.direction]));
	});
};