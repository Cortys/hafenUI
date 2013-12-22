var connections = require("../../core/connections.js");

module.exports = function(socket) {
	// Send unconnected robots when client accesses server the first time:
	socket.emit("unconnectedRobots", connections.getUnconnectedRobots());
	
	// Handle connnection requests:
	socket.on("connectRobot", function(robot, callback) {
		var client = connections.addClient(socket, robot);
		if(!client) {
			callback(false);
			return;
		}
		socket.broadcast.emit("unconnectedRobots", connections.getUnconnectedRobots());
		
		client.onDone(function() {
			// TODO SESSION STUFF...
			callback(true);
		}, function() {
			socket.broadcast.emit("unconnectedRobots", connections.getUnconnectedRobots());
			callback(false);
		});
	});
}