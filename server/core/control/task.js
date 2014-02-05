var mover = require("./robotMovement.js");

// Abstract robot task implementation. Do not use directly to do a command. Use tasks from "tasks" folder
	
Task = function(type, data) {
	this.type = type;
	this.data = data;
};

Task.prototype = {
	type: undefined,
	data: undefined,
	done: false,
	jobCallback: undefined,
	rawExecute: function(client, add) {
		if(this.done || !mover.isListeningForClient(client))
			return;
		var prop = this.data.concat(add);
		prop.unshift(client);
		mover.do[this.type].apply(mover.do, prop);
	},
	execute: function(client) {},
	setDone: function() {
		this.done = true;
	},
	setJobCallback: function() {
		this.jobCallback = null;
	},
	getObject: function() {
		return {
			title: "Prototype Task",
			image: null
		};
	}
};
module.exports = Task;