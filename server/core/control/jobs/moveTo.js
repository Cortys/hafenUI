var Job = require("../job.js"),
	TaskMove = require("../tasks/move.js"),
	RouteCalculator = require("../routeCalculator.js");

JobMoveTo = function(target, locator) {
	Job.call(this);
	var t = this;
	t.target = target;
	t.locator = locator;
	locator.location(function(location) {
		t.calculator = new RouteCalculator(location);
	});
	
};

JobMoveTo.prototype = Object.create(Job.prototype);
JobMoveTo.prototype.constructor = JobMoveTo;

JobMoveTo.prototype.calculateFromPosition = function(position, callback) {
	var t = this;
	t.calculator.calculate(position.last, position.current, t.target, function(path) {
		t.emptyQueue();
		for(var i = 1; i < path.length; i++)
			(function(i) { // bind i to emulated "for-scope" by using function scopes
				console.log(path[i]);
				t.addTask(new TaskMove(path[i].direction, function(position, nextTask) {
					t.locator.updatePosition(position, function(position) {
						if(!position)
							return;
						if(path[i].id == position.current && path[i-1].id == position.last)
							nextTask();
						else // recalculate way if robot did not follow optimal way:
							t.calculateFromPosition(position, function() {
								nextTask();
							});
					});
				}));
			})(i);
		
		callback();
	});
};

JobMoveTo.prototype.prepare = function(callback) {
	if(Job.prototype.prepare.call(this, callback))
		return true;
	
	var t = this;
	
	t.locator.getPosition(function(position) {
		t.calculateFromPosition(position, function() {
			for(i = 0; i < t.preparationCallbacks.length; i++)
				t.preparationCallbacks[i]();
			t.preparationCallbacks = null;
		});
	});
	
	return false;
};

JobMoveTo.prototype.getObject = function() {
	return {
		type: "moveToJob",
		value: this.target
	};
};

module.exports = JobMoveTo;