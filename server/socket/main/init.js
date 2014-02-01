var connections = require("../../core/connectivity/connections.js"),
	JobManager = require("./jobManager.js");

module.exports = function(socket) {
	console.log("> Logged in socket connected");
	
	// Disable connection if required (already opened):
	if(!require("../alreadyConnected.js")(socket))
		return;
	
	var client = connections.getClient(socket);
	
	if(client) {
		client.updateSocket(socket);
		
		socket.emit("robotInformation", client.robot);
		
		var jobManager = new JobManager(socket);
		
		socket.on("logout", function(data, callback) {
			client.onQuit(function() {}); // Remove lost connection error.
			connections.removeClient(client);
			callback(true);
		});
		
		// Lost connection to client:
		client.onQuit(function() {
			socket.emit("connectionLost");
		});
		
		socket.on("moveRobot", require("./remote.js")(client));
	}
	else // connection was killed right after connection:
		socket.emit("connectionLost");
	socket.on("disconnect", require("../disconnect.js")(socket));
};