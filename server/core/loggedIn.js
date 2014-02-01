var db = require("./connectivity/db.js"),
	connections = require("./connectivity/connections.js");

module.exports = function(req) {
	//return true;
	var client = connections.getClientFromKey(req.ip);
	return client && client.connected;
};