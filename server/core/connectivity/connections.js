var Client,
	robots = [], // connection may not exist yet -> store only robot information
	unconnectedRobots = [], // connection does not exist yet -> store only robot information
	clients = {}, // connections exists -> store client information along with robot information (will contain Client-objects)

connections = {
	init: function() {
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
		if(client instanceof Client) {
			client.onQuit(function() {});
			this.removeClient(client);
		}
		if(!socket || (!unconnectedRobots[robotId] && robotId !== undefined))
			return null;
		
		client = new Client(socket, robotId);
		
		if(clients[client.key])
			socket.set("client", client);
		
		clients[client.key] = client;
		if(robotId !== undefined)
			delete unconnectedRobots[robotId];
		return client;
	},
	
	// get a connection:
	
	getClient: function(socket) {
		var client = socket.client || clients[(new Client(socket)).key];
		if(client && client.removeTimer) // If socket is associated to client again removal timer will be quit
			clearTimeout(client.removeTimer);
		return client;
	},
	
	getClientFromKey: function(key) {
		var client = clients[key];
		if(client && client.removeTimer) // If socket is associated to client again removal timer will be quit
			clearTimeout(client.removeTimer);
		return client;
	},
	
	// remove a connection:
	removeClient: function(client, delay, callback) {
		if(!(client instanceof Client))
			return;
		clearTimeout(client.removeTimer);
		var remove = function() {
			if(client.robot !== null) {
				client.quitBluetoothConnection();
				unconnectedRobots[client.robot.id] = client.robot;
			}
			delete clients[client.key];
			if(callback)
				callback(client);
			client.connectionEvents.quit();
		};
		if(delay)
			client.removeTimer = setTimeout(remove, delay);
		else
			remove();
		return client;
	}
};

/**
 * Classes:
 */
Client = function(socket, robotId) { // class for storing a client connection
	
	if(!socket)
		return;
	
	this.ip = this.key = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address.address;
	
	this.updateSocket(socket);
	
	if(robotId !== undefined) { // If robotId is not defined => Client object is only for key retrieval => no further initialization
		this.robot = robots[robotId];
		this.establishBluetoothConnection();
	}
};
Client.prototype = {
	socket: null,
	ip: null,
	key: null,
	robot: null,
	connector: require("./bluetooth.js"),
	mover: require("../control/robotMovement.js"),
	removeTimer: null,
	connectionEvents: {
		success: function() {}, // On connection established
		fail: function() {}, // On connection failed and then removed
		quit: function() {} // On connection removed
	},
	connected: false,
	updateSocket: function(newSocket) {
		if(!this.socket || newSocket.id != this.socket.id)
			this.socket = newSocket;
	},
	establishBluetoothConnection: function() {
		var t = this,
			fail = function() {
				t.disableRobotMovements();
				clearTimeout(timer);
				t.connected = false;
				connections.removeClient(t);
				t.connectionEvents.fail();
			}, timer = setTimeout(fail, require("../settings.js").timeout);

		t.connector.connect(t, function() {
			t.enableRobotMovements();
			clearTimeout(timer);
			t.connected = true;
			t.connectionEvents.success();
		});
		t.connector.listenFor(t, "disconnect", fail);
	},
	quitBluetoothConnection: function() {
		this.connector.unlistenForAll(this);
		this.connector.disconnect(this);
	},
	enableRobotMovements: function() {
		this.mover.startListeningForClient(this);
	},
	disableRobotMovements: function() {
		this.mover.stopListeningForClient(this);
	},
	send: function(message) {
		if(this.robot !== null)
			this.connector.send(this, message);
	},
	onReceive: function(callback) {
		if(typeof callback == "function")
			this.connector.listenFor(this, "receive", callback);
		else
			this.connector.unlistenFor(this, "receive");
	},
	onDone: function(success, fail) { // bluetooth connection established / quit
		if(typeof success == "function")
			this.connectionEvents.success = success;
		if(typeof fail == "function")
			this.connectionEvents.fail = fail;
	},
	onQuit: function(quit) { // client server login connection quit (connection error with bluetooth OR websocket)
		if(typeof quit == "function")
			this.connectionEvents.quit = quit;
	}
};

connections.init();

module.exports = connections;