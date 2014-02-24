var Job = require("../job.js"),
	TaskMove = require("../tasks/move.js"),

JobSimple = function(dir, callback) {
	Job.call(this);
	this.dir = dir;
	this.addTask(new TaskMove(dir, function(position, c) {
		callback(position);
		c();
	}));
};

JobSimple.prototype = Object.create(Job.prototype);
JobSimple.prototype.constructor = JobSimple;

JobSimple.prototype.prepare = function(callback) {
	callback();
};

JobSimple.prototype.getObject = function() {
	return {
		type: "simpleJob",
		value: this.dir
	};
};

module.exports = JobSimple;