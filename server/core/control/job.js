var Task = require("./task.js"),

Job = function() {
	this.tasks = [];
},

doNextTask = function(client) {
	if(!this.running)
		return;
	var t = this,
		task = t.tasks[0];
	if(task instanceof Task) {
		task.setJobCallback(function() {
			t.tasks.shift();
			if(typeof t.stepper == "function")
				t.stepper(task, t.irregularTaskChange, !(t.tasks[0] instanceof Task));
			t.irregularTaskChange = false;
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
	tasks: null,
	running: false,
	callback: null,
	stepper: null,
	irregularTaskChange: false,
	prepared: false,
	preparationRunning: false,
	preparationCallbacks: null,
	addTask: function(task) {
		if(task instanceof Task) {
			this.tasks.push(task);
			this.irregularTaskChange = this.running && this.prepared;
		}
	},
	addTasks: function(tasks) {
		this.tasks = this.tasks.concat(tasks);
		this.irregularTaskChange = this.running && this.prepared;
	},
	replaceQueue: function(tasks) {
		this.tasks = tasks.concat([]);
		this.irregularTaskChange = this.running && this.prepared;
	},
	emptyQueue: function() {
		this.tasks = [];
		this.irregularTaskChange = this.running && this.prepared;
	},
	run: function(client, callback, stepper) {
		var t = this;
		if(t.running)
			return;
		if(callback !== undefined)
			t.callback = callback;
		if(stepper !== undefined)
			t.stepper = stepper;
		t.running = true;
		t.prepare(function() {
			doNextTask.call(t, client);
		});
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
		return {
			type: "text",
			value: "Prototype Job"
		};
	},
	
	prepare: function(callback) {
		var t = this;
		if(typeof callback != "function")
			return true;
		if(t.prepared) {
			callback();
			return true;
		}
		if(!t.preparationRunning) {
			t.preparationRunning = true;
			t.preparationCallbacks = [function() {
				t.prepared = true;
			}, callback];
			return false;
		}
		t.preparationCallbacks.push(callback);
		return true;
	},
	
	getTasksObject: function(callback) {
		var t = this;
		t.prepare(function() {
			var tasks = [];
			for(var i = 0; i < t.tasks.length; i++)
				tasks.push(t.tasks[i].getObject());
			
			callback(tasks);
		});
	}
};

module.exports = Job;