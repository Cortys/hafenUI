var Job = require("../job.js"),
	TaskMove = require("../tasks/move.js"),

JobSimple = function(client, dir) {
	Job.call(this);
	this.addTask(new TaskMove(dir));
};

JobSimple.prototype = Object.create(Job.prototype);
JobSimple.prototype.constructor = JobSimple;

module.exports = JobSimple;