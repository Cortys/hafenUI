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

JobMoveTo.prototype.prepare = function(callback) {
	if(Job.prototype.prepare.call(this, callback))
		return true;
	
	var t = this;
	
	t.locator.getPosition(function(position) {
		t.calculator.calculate(position.last, position.current, t.target, function(path) {
			if(path.length)
				for(var i = 0; i < path.length; i++)
					t.addTask(new TaskMove(path[i].direction, function() {
						// check if everything is correct
					}));
			
			for(var i = 0; i < t.preparationCallbacks.length; i++)
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