var Job = require("../job.js"),
	TaskMove = require("../tasks/move.js"),

JobSimple = function(dir) {
	Job.call(this);
	this.dir = dir;
	this.addTask(new TaskMove(dir));
	this.addTask(new TaskMove(dir));
};

JobSimple.prototype = Object.create(Job.prototype);
JobSimple.prototype.constructor = JobSimple;

JobSimple.prototype.getObject = function() {
	return {
		type: "simpleJob",
		value: this.dir
	};
};

module.exports = JobSimple;