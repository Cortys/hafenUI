var Task = require("../task.js"),

TaskMove = function(direction, dataCallback) {
	Task.call(this, "move", [direction]);
	this.dir = direction;
	this.dataCallback = dataCallback;
};

TaskMove.prototype = Object.create(Task.prototype);
TaskMove.prototype.constructor = TaskMove;

TaskMove.prototype.execute = function(client) {
	var t = this;
	t.rawExecute(client, [function(positionData) {
		t.setDone();
		if(typeof t.dataCallback == "function")
			t.dataCallback(positionData);
		if(typeof t.jobCallback == "function")
			t.jobCallback();
	}]);
};
TaskMove.prototype.getObject = function() {
	return {
		type: "move",
		value: this.dir
	};
};

module.exports = TaskMove;