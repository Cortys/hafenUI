var connections = require("../../core/connectivity/connections.js"),
	JobManager = require("./jobs.js"),
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
		 */
		if(!client.map)
			client.map = new Map(client);
		
		client.map.start(); // Listen for map data requests and emit selected map or if not selected possible selections
		
		/**
		 * Remote feature (disabled):
		 */
		 var remote = require("./remote.js")(client.jobs);
		
		/**
		 * Logout feature (too basic for a seperate module, maybe later):
		 */
		socket.on("logout", function(data, callback) {
			client.onQuit(function() {
				client.jobs.quit();
			}); // Remove lost connection error.
			connections.removeClient(client);
			callback(true);
		});
		// Lost connection to client:
		client.onQuit(function() {
			client.jobs.quit();
			socket.emit("connectionLost");
		});
		
	}
	else // connection was killed right after connection:
		socket.emit("connectionLost");
	socket.on("disconnect", require("../disconnect.js")(socket));
};