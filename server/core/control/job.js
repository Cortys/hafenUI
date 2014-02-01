var Task = require("./task.js"),

Job = function() {},

doNextTask = function() {
	if(!this.running)
		return;
	var t = this,
		task = t.tasks.shift();
	if(task instanceof Task) {
		task.setJobCallback(function() {
			doNextTask.call(t);
		});
		task.execute();
	}
	else {
		t.running = false;
		t.callback();
	}
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
		this.running = true;
		doNextTask.call(this);
	},
	stop: function() {
		this.emptyQueue();
	},
	pause: function() {
		this.running = false;
	}
};

module.exports = Job;