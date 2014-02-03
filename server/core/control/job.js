var Task = require("./task.js"),

Job = function() {},

doNextTask = function(client) {
	if(!this.running)
		return;
	var t = this,
		task = t.tasks.shift();
	if(task instanceof Task) {
		task.setJobCallback(function() {
			if(typeof t.stepper == "function")
				t.stepper(task);
			doNextTask.call(t, client);
		});
		task.execute(client);
	}
	else {
		t.running = false;
		if(typeof t.callback == "function")
			t.callback(t, true);
	}
};

Job.prototype = {
	tasks: [],
	running: false,
	callback: null,
	stepper: null,
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
	run: function(client, callback, stepper) {
		if(this.running)
			return;
		if(callback !== undefined)
			this.callback = callback;
		if(stepper !== undefined)
			this.stepper = stepper;
		this.running = true;
		doNextTask.call(this, client);
	},
	stop: function() {
		var c = this.callback;
		this.callback = null;
		this.emptyQueue();
		c(this, false);
	},
	pause: function() {
		this.running = false;
	},
	
	getObject: function() {
		return { title: "Prototype Job" };
	},
	getTasksObject: function() {
		var tasks = [];
		for(var i = 0; i < this.tasks; i++)
			tasks.push(this.tasks[0].getObject());
		return tasks;
	}
};

module.exports = Job;