var Job = require("../job.js"),
	TaskMove = require("../tasks/move.js"),
	RouteCalculator = require("../routeCalculator.js");

JobMoveTo = function(target, locator) {
	Job.call(this);
	var t = this;
	t.target = target;
	t.locator = locator; // used to transform point codes to unique point ids. locator is also notified about the current robot position in real time
	locator.location(function(location) { // location = map id
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
				t.addTask(new TaskMove(path[i].direction, function(position, nextTask) { // transform path array to executable tasks
					t.locator.updatePosition(position, function(position) {
						if(!position)
							return;
						if(path[i].id == position.current && path[i-1].id == position.last)
							nextTask();
						else // recalculate way if robot did not follow optimal way (this does not affect prepare, which is used to decide when to fist reveal the job to the user, at recalculation the job has already been revealed):
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
	if(Job.prototype.prepare.call(this, callback)) // tasks already calculated?
		return true;
	
	var t = this;
	
	// if not: calculate route to target from current position
	t.locator.getPosition(function(position) {
		t.calculateFromPosition(position, function() {
			t.completePrepatation(); // finished calculating the route -> set prepared to true -> prepare will (because of the superclass) now return true and does not recalculate the route at further prepare() requests
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