var connections = require("../../core/connections.js");

module.exports = function(socket) {
	console.log("> Logged in socket connected");
	
	// Disable connection if required (already opened):
	if(!require("../alreadyConnected.js")(socket))
		return;
	
	connections.addClient(socket, 1);
	
	var client = connections.getClient(socket);
	
	if(client) {
		client.updateSocket(socket);
		
		socket.emit("robotInformation", client.robot);
		
		socket.on("logout", function(data, callback) {
			connections.removeClient(client);
			callback(true);
		});
		socket.on("moveRobot", require("./remote.js")(client));
	}
	socket.on("disconnect", require("../disconnect.js")(socket));
}