/**
 * Module: jobCreator
 * Purpose: Generate HTML title for all types of jobs
 * Author: Clemens Damke
 */


new Modular("jobCreator", ["map"], function() {});

jobCreator.create = {
	simpleJob: function(value) {
		if(value == "turn")
			return "Turn back";
		return "Go "+value;
	},
	moveToJob: function(value) {
		return "Move to "+(map.val.points.children(".n"+value).children("div").html());
	}
};