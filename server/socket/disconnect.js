var connections = require("../core/connections.js");

module.exports = function(client) {
	return function() {
		if(!client)
			return;
		// Removal timer will be automatically quit if connection is reastablished (= accessed via connections.getClient()) within settings.timeout milliseconds.
		console.log("> Client "+client.key+" will be disconnected whithin a certain time");
		connections.removeClient(client, require("../core/settings.js").timeout, function(client) {
			console.log("> Client "+client.key+" disconnected");
		});
	};
};