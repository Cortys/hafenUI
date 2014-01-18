var connections = require("../../core/connections.js");

module.exports = function(socket) {
	console.log("> Logged out socket connected");
	
	// Disable connection if required (already opened):
	if(!require("../alreadyConnected.js")(socket))
		return;
	
	var client = connections.addClient(socket);
	
	// Send unconnected robots when client accesses server the first time:
	socket.emit("unconnectedRobots", connections.getUnconnectedRobots());
	// Handle connnection requests:
	socket.on("connectRobot", function(robot, callback) {
		client = connections.addClient(socket, robot);
		console.log("> Client "+client.key+" connected");
		console.log(connections.getClient(socket));
		if(!client) {
			callback(false);
			return;
		}
		socket.broadcast.emit("unconnectedRobots", connections.getUnconnectedRobots());
		
		client.onDone(function() {
			callback(true);
		}, function() {
			socket.broadcast.emit("unconnectedRobots", connections.getUnconnectedRobots());
			callback(false);
		});
		client.onQuit(function() {
			socket.broadcast.emit("unconnectedRobots", connections.getUnconnectedRobots());
		});
	});
	
	socket.on("disconnect", require("../disconnect.js")(socket));
}