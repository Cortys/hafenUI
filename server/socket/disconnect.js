var connections = require("../core/connectivity/connections.js"),
	timeout = require("../core/settings.js").timeout;

module.exports = function(socket) {
	return function() {
		var client = connections.getClient(socket);
		if(!client)
			return;
		// Removal timer will be automatically quit if connection is reastablished (= accessed via connections.getClient()) within settings.timeout milliseconds.
		console.log("> Client "+client.key+" will be disconnected whithin a certain time");
		connections.removeClient(client, timeout, function(client) {
			console.log("> Client "+client.key+" disconnected");
		});
	};
};