var connections = require("../../core/connectivity/connections.js"),
	Job = require("../../core/control/job.js");

var JobManager = function(socket) {
	this.client = connections.getClient(socket);
	
};

JobManager.prototype = {
	client: null,
	jobs: [],
	
	addJob: function(job) {
		
	}
};

module.exports = JobManager;