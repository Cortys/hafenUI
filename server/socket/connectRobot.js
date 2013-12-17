/**
 * All robot connection related features:
 * Establish / quit a bluetooth connection to a robot
 * Give list of available robots to client
 * Manage connections of users to robots
 */

var connectRobot = module.exports = {
	bluetooth: require("../bluetooth.js"),
	connections: require("./connections.js"),
	
	init: function() {
		var t = this;
	},
	newSocket: function(socket) {
		var t = this;
		
		// Send unconnected robots when client accesses server the first time:
		socket.emit("unconnectedRobots", t.connections.unconnectedRobots);
		
		// Handle connnection requests:
		socket.on("connectRobot", function(robot, callback) {
			var client = t.connections.addClient(socket, robot);
			if(!client) {
				callback(false);
				return;
			}
			socket.broadcast.emit("unconnectedRobots", t.connections.unconnectedRobots);
			
			t.tryBluetoothConnectTo(client, function() {
				// TODO SESSION STUFF...
				callback(true);
			}, function() {
				t.connections.removeClient(client);
				socket.broadcast.emit("unconnectedRobots", t.connections.unconnectedRobots);
				callback(false);
			});
		});
		
		socket.on("disconnect", function() {
			t.disconnectRobot(socket, 10000);
		});
		socket.on("disconnectRobot", function() {
			t.disconnectRobot(socket, 0);
		});
	},
	
	disconnectRobot: function(socket, delay) {
		var t = this;
		t.connections.removeSocket(socket, delay, function(client) {
			t.tryBluetoothDisconnectTo(client, function() {
				
			}, function() {
				
			});
		});
	},
	
	tryBluetoothConnectTo: function(client, success, failure) {
		
	},
	tryBluetoothDisconnectTo: function(client, success, failure) {
		
	}
};

connectRobot.init();