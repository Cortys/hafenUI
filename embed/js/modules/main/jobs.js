/**
 * Module: jobs
 * Purpose: Display queued and running jobs + tasks
 * Author: Clemens Damke
 */

/**
 * TODO: UGLY CODE
 */

Modular.addModules({
	jobCreator: "main/jobCreators/jobCreator.js",
	taskCreator: "main/jobCreators/taskCreator.js",
});

new Modular("jobs", ["socket", "jobCreator", "taskCreator"], function(res) {
	this.val.e = $("#jobList");
	this.do.listen();
});

jobs.val = {
	e: null,
};

jobs.do = {
	val: jobs.val,
	listen: function() {
		var t = this;
		socket.do.register("currentJobs", function(data) {
			t.showJobs(data);
			
		});
		socket.do.register("currentTasks", function(data) {
			t.showTasks(data);
		});
	},
	showJobs: function(jobs) {
		var t = this;
		if(jobs.type !== "shift") { // Add or set jobs:
			var html = "";
			for(var i = 0; i < jobs.jobs.length; i++) {
				var job = jobs.jobs[i];
				html += "<div class='job"+(jobs.type=="push"?" hiddenBottom":"")+"'><h2>"+(jobCreator.create[job.type](job.value))+"</h2><ul></ul></div>";
			}
			t.val.e[jobs.type=="all"?"html":"append"](html);
			if(jobs.type == "push")
				setTimeout(function() {
					t.val.e.children().removeClass("hiddenBottom");
				}, 0);
		}
		else { // Remove first job
			var e = t.val.e.children(".job").not(".hiddenTop").first().addClass("hiddenTop"),
				n = e.next(".job").animate({ marginTop:(e[0].clientHeight*(-1)) }, 200, "linear", function() {
				n.css({ marginTop:0 });
				e.remove();
			});
			if(!n || !n.length)
				setTimeout(function() {
					e.remove();
				}, 200);
		}		
		if(jobs.tasks)
			t.showTasks({
				tasks: jobs.tasks,
				type: "all"
			});
	},
	showTasks: function(tasks) {
		if(tasks.type !== "shift") {
			var html = "",
				task;
			for(var i = 0; i < tasks.tasks.length; i++) {
				task = tasks.tasks[i];
				html += "<li>"+(taskCreator.create[task.type](task.value))+"</li>";
			}
			jobs.val.e.children(".job").not(".hiddenTop").first().children("ul").html(html);
		}
		else {
			var e = $("li:first-child", jobs.val.e).addClass("hidden"),
				n = e.next("li").animate({ marginTop:(e[0].clientHeight*(-1)) }, 500, "linear", function() {
				n.css({ marginTop:0 });
				e.remove();
			});
			if(!n || !n.length)
				setTimeout(function() {
					e.remove();
				}, 200);
		}
	}
};