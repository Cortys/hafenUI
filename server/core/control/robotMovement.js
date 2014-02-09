var robotMovement = {
	listeners: {},
	
	startListeningForClient: function(client) {
		if(!client)
			return;
		var t = this;
		t.listeners[client.key] = {};
		console.log("> Started RCP listening for client '"+client.ip+"'");
		client.onReceive(function(message) {
			var data = t.codec.decode(message);
			if(typeof t.listeners[client.key][data.operation] == "function") {
				var f = t.listeners[client.key][data.operation];
				delete t.listeners[client.key][data.operation];
				f(data);
			}
		});
	},
	stopListeningForClient: function(client) {
		if(client && this.listeners.hasOwnProperty(client.key)) {
			delete this.listeners[client.key];
			client.onReceive(null);
		}
	},
	isListeningForClient: function(client) {
		return client && this.listeners.hasOwnProperty(client.key);
	},
	
	codec: require("../protocols/RCP.js") // Use RCP for robot movements
};
robotMovement.do = {
	codec: robotMovement.codec,
	listeners: robotMovement.listeners,
	send: function(client, line, listenFor, callback) {
		if(this.listeners.hasOwnProperty(client.key)) {
			client.send(line);
			this.listeners[client.key][listenFor] = callback;
			return true;
		}
		return false;
	},
	move: function(client, direction, callback) {
		return this.send(client, this.codec.encode(this.codec.operations[direction]), this.codec.operations.position, callback);
	},
	getContainer: function(client, container, success, fail) {
		if(!this.send(client, this.codec.encode(this.codec.operations.getContainer, container), this.codec.operations.status, function(status) {
			(status?success:fail)(container);
		}) && typeof fail == "function")
			fail();
	},
	putContainer: function(client, success, fail) {
		if(!this.send(client, this.codec.encode(this.codec.operations.putContainer), this.codec.operations.status, function(status) {
			(status?success:fail)(container);
		}) && typeof fail == "function")
			fail();
	}
};

module.exports = robotMovement;