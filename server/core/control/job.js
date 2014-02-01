var Task = require("./task.js"),

Job = function() {},

doNextTask = function() {
	var task = this.tasks.shift();
	if(task instanceof Task)
		task.execute();
};

Job.prototype = {
	tasks: [],
	running: false,
	addTask: function(task) {
		if(task instanceof Task)
			this.tasks.push(task);
	},
	addTasks: function(tasks) {
		this.tasks = this.tasks.concat(tasks);
	},
	emptyQueue: function() {
		this.tasks = [];
	},
	run: function(callback) {
		if(this.running)
			return;
		doNextTask.call(this);
		this.running = true;
	},
	stop: function() {
		this.running = false;
		this.emptyQueue();
	}
};

module.exports = Job;