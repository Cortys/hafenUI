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

new Modular("jobs", ["socket", "jobCreator", "taskCreator", "events", "map"], function(res) {
	this.val.e = $("#jobList");
	map.do.onRendered(function() {
		jobs.do.listen();
	});
});

jobs.val = {
	e: null,
	jobSpeed: 300,
	taskSpeed: 200
};

jobs.do = {
	val: jobs.val,
	listen: function() {
		var t = this;
		socket.do.send("pushJobs", {});
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
				target = e[0].clientHeight*(-1),
				n = e.next(".job").animate({ marginTop:(e[0].clientHeight*(-1)) }, {
					duration:this.val.jobSpeed, easing:"linear",
					step:function(now, fx) {
						if(e[0].clientHeight*(-1) > fx.end) // stop animation from going to far and causing a job to jump behind the header of job-sidebar
							fx.end = e[0].clientHeight*(-1);
					}, complete:function() {
						n.css({ marginTop:0 });
						e.remove();
					}
				});
			e.finish(); // stop animation if multiple jobs are hidden at once to reduce CPU usage (negative effects of this jump are not visible due to the speed of the animations)
			if(!n || !n.length)
				e.one(events.transitionEnd, function() {
					e.remove();
				});
		}		
		if(jobs.tasks)
			t.showTasks({
				tasks: jobs.tasks,
				type: (jobs.type=="all"?"all":"update")
			});
	},
	showTasks: function(tasks) {
		if(tasks.type !== "shift") {
			var html = "",
				task;
			for(var i = 0; i < tasks.tasks.length; i++) {
				task = tasks.tasks[i];
				html += "<li"+(tasks.type=="update"?" class='hidden'":"")+">"+(taskCreator.create[task.type](task.value))+"</li>";
			}
			var e = this.val.e.children(".job").not(".hiddenTop").first().children("ul").html(html);
			if(tasks.type == "update")
				setTimeout(function() {
					e.children().removeClass("hidden");
				}, 0);
		}
		else {
			var e = $("li:first-child", jobs.val.e).addClass("hidden"),
				n = e.next("li").animate({ marginTop:(e[0].clientHeight*(-1)) }, this.val.taskSpeed, "linear", function() {
					n.css({ marginTop:0 });
					e.remove();
				});
			if(!n || !n.length)
				e.on(events.transitionEnd, function() {
					e.remove();
				});
		}
	}
};