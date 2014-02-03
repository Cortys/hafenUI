var Job = require("../job.js"),
	TaskMove = require("../tasks/move.js"),

JobSimple = function(dir) {
	Job.call(this);
	this.addTask(new TaskMove(dir));
};

JobSimple.prototype = Object.create(Job.prototype);
JobSimple.prototype.constructor = JobSimple;

JobSimple.prototype.getObject = function() {
	return { title: "Move Robot" };
};

module.exports = JobSimple;