var db = require("./db.js"),
	connections = require("./connections.js");

module.exports = function(req) {
	var client = connections.getClientFromKey(req.ip);
	return client && client.connected;
};