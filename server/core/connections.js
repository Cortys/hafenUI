/**
 * Classes:
 */
var Client = function(socket, robotId) { // class for storing a client connection
	
	this.ip = this.key = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
	
	if(robotId !== undefined) { // If robotId is not defined => Client object is only for key retrieval => no further initialization
		this.robot = robots[robotId];
		this.updateSocket(socket);
	}
};
Client.prototype = {
	socket: null,
	ip: null,
	key: null,
	robot: null,
	connector: require("./bluetooth.js"),
	updateSocket: function(newSocket) {
		if(newSocket !== this.socket)
			this.socket = newSocket;
	},
	send: function(message) {
		
	},
	onDone: function(success, fail) {
		
	}
};

var robots = [], // connection may not exist yet -> store only robot information
	unconnectedRobots = [], // connection does not exist yet -> store only robot information
	clients = {}, // connections exists -> store client information along with robot information (will contain Client-objects)

connections = {
	init: function() {
		var t = this;
		require("./db.js").query("SELECT * FROM `robots`", function(err, rawResults) {
			if(err) {
				console.error("> Failed to get robots in 'connectRobot.js':", err);
				return;
			}
			var results = [];
			for (var i = 0; i < rawResults.length; i++)
				results[rawResults[i].id] = rawResults[i];
			robots = unconnectedRobots = results;
			console.log("> Got "+rawResults.length+" robot(s) from database");
		});
	},
	
	// getters:
	getRobots: function() {
		return robots;
	},
	getUnconnectedRobots: function() {
		return unconnectedRobots;
	},
	getClients: function() {
		return clients;
	},
	
	// add a new connection:
	addClient: function(socket, robotId) {
		var client = this.getClient(socket);
		if(client)
			client.updateSocket(socket);
		else {	
			client = new Client(socket, robotId);
			
			if(clients[client.key])
				socket.set("client", client);
			
			clients[client.key] = client;
			delete unconnectedRobots[robotId];
		}
		return client;
	},
	
	// get a connection:
	
	getClient: function(socket) {
		var client = socket.client || clients[(new Client(socket)).key];
		if(client) { // If socket is associated to client again removal timer will be quit
			var timer = client.removeTimer;
			if(client.removeTimer)
				clearTimeout(client.removeTimer);
		}
		return client;
	},
	
	// remove a connection:
	removeClient: function(socket, delay, callback) {
		var client = this.getClient(socket);
		var remove = function() {
			unconnectedRobots[client.robot.id] = robots[client.robot.id];
			delete clients[client.key];
			if(callback)
				callback(client);
		};
		if(delay)
			client.removeTimer = setTimeout(remove, delay);
		else
			remove();
		return client;
	},
};
connections.init();
module.exports = connections;