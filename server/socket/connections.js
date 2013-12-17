var connections = {
	db: require("../db.js"),
	
	robots: [], // connection may not exist yet -> store only robot information
	unconnectedRobots: [], // connection does not exist yet -> store only robot information
	connectedClients: {}, // connections exists -> store client information along with robot ioformation (will contain Client-objects)
	
	init: function() {
		var t = this;
		t.db.query("SELECT * FROM `robots`", function(err, rawResults) {
			if(err) {
				console.error("> Failed to get robots in 'connectRobot.js':", err);
				return;
			}
			var results = [];
			for (var i = 0; i < rawResults.length; i++)
				results[rawResults[i].id] = rawResults[i];
			t.robots = t.unconnectedRobots = results;
			console.log("> Got "+rawResults.length+" robot(s) from database");
		});
	},
	
	Client: function(socket, robotId) { // class for storing a client connection
		this.ip = this.key = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
		if(robotId !== undefined) {
			this.robot = connections.robots[robotId];
			this.connector = require("../bluetooth.js");
			
		}
	},
	
	// add a new connection:
	addClient: function(socket, robotId) {
		var client = new this.Client(socket, robotId);
		if(this.connectedClients[client.key])
			return null;
		socket.set("client", client);
		this.connectedClients[client.key] = client;
		delete this.unconnectedRobots[robotId];
		return client;
	},
	
	// get a connection:
	
	getClientKey: function(socket) {
		var timer = socket.removeTimer;
		if(timer)
			clearTimeout(timer);
		return (new this.Client(socket)).key;
	},
	
	getClient: function(socket) {
		return this.connectedClients[this.getClientKey(socket)];
	},
	
	// remove a connection:
	removeClient: function(client, delay, callback) {
		var remove = function() {
			this.unconnectedRobots[client.robot.id] = this.robots[client.robot.id];
			delete this.connectedClients[client.key];
			if(callback)
				callback(client);
		};
		if(delay)
			client.set("removeTimer", setTimeout(remove, delay));
		else
			remove();
		return client;
	},
	
	removeSocket: function(socket, delay, callback) {
		return this.removeClient(socket.client, delay, callback);
	}
};
connections.init();
module.exports = connections;