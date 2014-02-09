/**
 * Module: jobCreator
 * Purpose: Generate HTML title for all types of jobs
 * Author: Clemens Damke
 */


new Modular("jobCreator", [], function() {});

jobCreator.create = {
	simpleJob: function(value) {
		if(value == "turn")
			return "Turn back";
		return "Go "+value;
	}
};