var connections = require("../../core/connectivity/connections.js"),
	JobManager = require("./jobs.js"),
	ContainerManager = require("./containers.js"),
	Map = require("./map.js");

module.exports = function(socket) {
	console.log("> Logged in socket connected");
	
	// Disable connection if required (already opened):
	if(!require("../alreadyConnected.js")(socket))
		return;
	
	var client = connections.getClient(socket);
	
	if(client) {
		client.updateSocket(socket);
		
		socket.emit("robotInformation", client.robot);
		
		/**
		 * Job Management:
		 */
		if(!client.jobs)
			client.jobs = new JobManager(client);
		
		client.jobs.start();
		
		/**
		 * Map Management:
		 * client.jobs has to be created at this point (used by Map)
		 */
		if(!client.map)
			client.map = new Map(client);
		
		client.map.start(); // Listen for map data requests and emit selected map or if not selected possible selections
		
		/**
		 * Container Management:
		 */
		if(!client.containers)
			client.containers = new ContainerManager(client);
		
		client.containers.start();
		
		/**
		 * Logout feature (too basic for a seperate module, maybe later):
		 */
		
		var end = function() { // stop all running features
			client.jobs.quit();
			client.map.quit();
			client.containers.quit();
		};
		
		socket.on("logout", function(data, callback) {
			client.onQuit(end); // Remove lost connection error.
			connections.removeClient(client);
			callback(true);
		});
		// Lost connection to client:
		client.onQuit(function() {
			end();
			socket.emit("connectionLost");
		});
		
	}
	else // connection was killed right after connection:
		socket.emit("connectionLost");
	socket.on("disconnect", require("../disconnect.js")(socket));
};