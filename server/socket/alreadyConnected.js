var connections = require("../core/connectivity/connections.js");

module.exports = function(socket) {
	var client = connections.getClient(socket),
		v = !(client && client.socket && socket.id != client.socket.id && !client.socket.disconnected && !socket.disconnected);
	if(client)
		console.log("<>", client.socket);
	socket.emit("alreadyConnected", { isUnconnected:v });
	return v;
};