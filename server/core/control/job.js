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
		var a = this.running && this.prepared && this.tasks.length ? this.tasks.slice(0, 1):[];
		this.tasks = a.concat(tasks);
		this.irregularTaskChange = this.running && this.prepared;
	},
	emptyQueue: function() {
		if(this.running && this.prepared && this.tasks.length)
			this.tasks = this.tasks.slice(0, 1); // preserve currently running task. do not delete it.
		else
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
	
	completePrepatation: function() { // call this method in subclasses to set prepare() result to true and signal all waiting processes to continue -> it then can be assumed, that all tasks for this job are calculated and ready to be executed.
		if(!this.preparationCallbacks)
			return;
		for(i = 0; i < this.preparationCallbacks.length; i++)
			this.preparationCallbacks[i]();
		this.preparationCallbacks = null;
	},
	
	// ABSTRACT: Has to be implemented by all jobs. Returns true if job is ready to be executed. false if tasks are not calculated yet. Look at jobs/moveTo.js to see a basic way to use job preparation
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