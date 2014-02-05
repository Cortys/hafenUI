var mover = require("../../core/control/robotMovement.js"),
	Job = require("../../core/control/job.js");

var JobManager = function(client) {
	this.jobs = [];
	if(client) {
		this.client = client;
		console.log("> New JobManager for client "+client.key);
		mover.startListeningForClient(client);
	}
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
	jobs: null,
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
		var jobs = {
			jobs: [],
			tasks: []
		};
		for(var i = 0; i < this.jobs.length; i++)
			jobs.jobs.push(this.jobs[i].getObject());
		if(this.jobs[0])
			jobs.tasks = this.jobs[0].getTasksObject();
		this.client.socket.emit("currentJobs", jobs);
	},
	
	pushTasks: function() {
		if(this.jobs[0]) {
			var tasks = this.jobs[0].getTasksObject();
			this.client.socket.emit("currentTasks", tasks);
		}
	},
	
	quit: function() {
		mover.stopListeningForClient(this.client);
	}
};

module.exports = JobManager;