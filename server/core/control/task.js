var mover = require("./robotMovement.js");

// Abstract robot task implementation. Do not use directly to do a command. Use tasks from "tasks" folder
	
Task = function(client, type, data) {
	this.client = client;
	this.type = type;
	this.data = data;
};

Task.prototype = {
	type: undefined,
	data: undefined,
	done: false,
	jobCallback: undefined,
	rawExecute: function() {
		if(this.done)
			return;
		var prop = this.data.concat(arguments);
		prop.unshift(this.client);
		mover.do[type].apply(mover.do, prop);
	},
	execute: function() {},
	setDone: function() {
		this.done = true;
	},
	setJobCallback: function() {
		this.jobCallback = null;
	}
};
module.exports = Task;