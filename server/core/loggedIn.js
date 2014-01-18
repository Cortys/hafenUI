var db = require("./db.js"),
	connections = require("./connections.js");

module.exports = function(req) {
	return true;
	var client = connections.getClientFromKey(req.ip);
	return client && client.connected;
};