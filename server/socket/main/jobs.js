var mover = require("../../core/control/robotMovement.js"),
	Job = require("../../core/control/job.js"),

JobManager = function(client) {
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
		job = t.jobs.length?t.jobs[0]:null;
	
	if(job instanceof Job) {
		job.run(t.client, function(success) { // callback:
			t.jobs.shift();
			t.pushJobs("shift");
			doNextJob.call(t);
		}, function(task, irregular, isLast) { // after each step:
			if(!isLast)
				t.pushTasks(irregular?undefined:"shift");
		});
	}
	else
		t.running = false;
};

JobManager.prototype = {
	client: null,
	jobs: null,
	running: false,
	
	start: function() {
		this.pushJobs();
	},
	
	addJob: function(job) {
		if(job instanceof Job) {
			this.jobs.push(job);
			this.pushJobs("push");
			if(!this.running)
				doNextJob.call(this);
		}
	},
	
	pushJobs: function(type) {
		var jobs = {
			jobs: [],
			tasks: [],
			type: (type || "all")
		};
		
		if(type !== "shift")
			for(var i = (type === "push" && this.jobs.length?this.jobs.length-1:0); i < this.jobs.length; i++)
				jobs.jobs.push(this.jobs[i].getObject());
		else
			delete jobs.jobs;
			
		if(this.running && type && type !== "shift") // ALL flag not set or REMOVE FLAG NOT SET: remove task information
			delete jobs.tasks;
		else if(this.jobs[0])
			jobs.tasks = this.jobs[0].getTasksObject();
		this.client.socket.emit("currentJobs", jobs);
	},
	
	pushTasks: function(type) {
		if(this.jobs[0]) {
			var tasks = type==="shift"?{
				type: "shift"
			}:{
				tasks: this.jobs[0].getTasksObject(),
				type: "all"
			};
			this.client.socket.emit("currentTasks", tasks);
		}
	},
	
	quit: function() {
		mover.stopListeningForClient(this.client);
	}
};

module.exports = JobManager;