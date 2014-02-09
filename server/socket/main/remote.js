var JobSimple = require("../../core/control/jobs/simple.js");

module.exports = function(jobManager) {
	jobManager.client.socket.on("moveRobot", function(data) {
		jobManager.addJob(new JobSimple(data.direction));
	});
};