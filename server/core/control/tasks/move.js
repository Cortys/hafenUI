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
		t.dataCallback(positionData);
		t.jobCallback();
	}]);
}
TaskMove.prototype.getObject = function() {
	return {
		title: (this.dir=="turn"?"Turn back":"Move "+this.dir),
		image: null
	};
};

module.exports = TaskMove;