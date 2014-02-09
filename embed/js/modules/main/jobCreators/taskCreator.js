/**
 * Module: taskCreator
 * Purpose: Generate HTML title for all types of tasks
 * Author: Clemens Damke
 */


new Modular("taskCreator", [], function() {});

taskCreator.create = {
	move: function(value) {
		return "<img src='imgs/directions/"+value+".svg' alt='' /><span>"+(value=="turn"?"Turn back":"Go "+value)+"</span>";
	}
};