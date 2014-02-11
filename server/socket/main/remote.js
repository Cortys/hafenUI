var JobSimple = require("../../core/control/jobs/simple.js");

module.exports = function(jobs) {
	jobs.client.socket.on("moveRobot", function(data) {
		jobs.addJob(new JobSimple(data.direction));
	});
};