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
		
		// Job Management:
		if(!client.jobManager)
			client.jobManager = new JobManager(client);
		
		client.jobManager.start(); // Emit job infos on first start + on reopening the page while logged in
		
		var remote = require("./remote.js")(client.jobManager);
		
		// Logout feature (too basic for a seperate module, maybe later):
		socket.on("logout", function(data, callback) {
			client.onQuit(function() {
				client.jobManager.quit();
			}); // Remove lost connection error.
			connections.removeClient(client);
			callback(true);
		});
		
		// Lost connection to client:
		client.onQuit(function() {
			client.jobManager.quit();
			socket.emit("connectionLost");
		});
	}
	else // connection was killed right after connection:
		socket.emit("connectionLost");
	socket.on("disconnect", require("../disconnect.js")(socket));
};