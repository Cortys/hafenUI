var mover = require("../../core/control/robotMovement.js"),
	connections = require("../../core/connectivity/connections.js"),
	Job = require("../../core/control/job.js");

var JobManager = function(socket) {
	this.client = connections.getClient(socket);
	
	mover.startListeningForClient(this.client);
},

doNextJob = function() {
	this.running = true;
	var t = this,
		job = t.jobs[0];
	
	if(job instanceof Job) {
		job.run(t.client, function(success) { // callback:
			t.jobs.shift();
			t.pushJobs();
			doNextJob.call(this);
		}, function(task) { // after each step:
			t.pushTasks();
		});
	}
	else {
		t.running = false;
	}
};

JobManager.prototype = {
	client: null,
	jobs: [],
	running: false,
	
	addJob: function(job) {
		if(job instanceof Job) {
			this.jobs.push(job);
			this.pushJobs();
			if(!this.running)
				doNextJob.call(this);
		}
	},
	
	pushJobs: function() {
		var jobs = [];
		for(var i = 0; i < this.jobs.length; i++)
			jobs.push(this.jobs[i].getObject());
		this.client.socket.emit("currentJobs", jobs);
		this.pushTasks();
	},
	
	pushTasks: function() {
		var tasks = this.jobs[0].getTasksObject();
		this.client.socket.emit("currentTasks", tasks);
	},
	
	quit: function() {
		mover.stopListeningForClient(this.client);
	}
};

module.exports = JobManager;