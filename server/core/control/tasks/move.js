var Task = require("../task.js"),

TaskMove = function(client, direction, dataCallback) {
	Task.call(this, client, "move", [direction]);
	this.dataCallback = dataCallback;
};

TaskMove.prototype = Object.create(Task.prototype);
TaskMove.prototype.constructor = TaskMove;

TaskMove.prototype.execute = function() {
	var t = this;
	t.rawExecute(function(positionData) {
		t.setDone();
		t.dataCallback(positionData);
		t.jobCallback();
	});
}

module.exports = TaskMove;