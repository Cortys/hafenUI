var connections = require("../../core/connections.js");

module.exports = function(socket) {
	console.log("> Socket connected");
	
	var client = connections.getClient(socket);
	
	// Send unconnected robots when client accesses server the first time:
	socket.emit("unconnectedRobots", connections.getUnconnectedRobots());
	// Handle connnection requests:
	socket.on("connectRobot", function(robot, callback) {
		client = connections.addClient(socket, robot);
		console.log("> Client "+client.key+" connected");
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
    
    console.log(require("../alreadyConnected.js"));
	
	socket.on("disconnect", require("../disconnect.js")(client));
}