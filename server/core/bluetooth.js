var bluetooth = module.exports = {
	dir: null,
	fs: require("fs"),
	fileNames: {
		send: "send.txt",
		receive: "receive.txt"
	},
	listeners: {},
	init: function() {
		this.dir = require("./settings.js").rootDir+"/bluetooth/";
		this.startListening();
	},
	startListening: function() {
		var file = this.dir+this.fileNames.receive,
			fs = this.fs,
			codec = this.codec,
			listeners = this.listeners;
		fs.watch(file, { persistent:false }, function(event) {
			if(event != "change")
				return;
			fs.readFile(file, { encoding:"utf8", flag:"w+" }, function(err, data) {
				if(err)
					throw err;
				var lines = data.split("\n"),
					parts;
				for(var i = 0; i < lines.length; i++) {
					parts = codec.decode(lines[i]);
					if(typeof listeners[parts.key] == "object" && typeof listeners[parts.key][parts.operation] == "function")
						listeners[parts.key][parts.operation](parts.data);
				}	
			});
		});
	},
	connect: function(client, callback) {
		var t = this;
			robotKey = t.codec.createRobotKey(client.robot.bluetooth);
		t.listenFor(client, t.codec.connect, function() {
			callback();
			t.unlistenFor(client, "connect");
		});
		t.appendLine(t.codec.encode(client.key, t.codec.operations.connect, robotKey));
	},
	disconnect: function(client) {
		this.appendLine(this.codec.encode(client.key, this.codec.operations.disconnect));
	},
	send: function(client, message) {
		this.appendLine(this.codec.encode(client.key, this.codec.operations.send, message));
	},
	listenFor: function(client, operation, callback) {
		if(typeof this.listeners[client.key] != "object")
			this.listeners[client.key] = {};
		this.listeners[client.key][this.codec.operations[operation]] = callback;
	},
	unlistenFor: function(client, operation) {
		if(typeof listeners[client.key] == "object" && typeof listeners[client.key][operation] == "function")
			delete listeners[client.key][this.codec.operations[operation]];
	},
	unlistenForAll: function(client) {
		if(typeof listeners[client.key] == "object")
			delete listeners[client.key];
	},
	appendLine: function(line) {
		console.log("Appending line: '"+line+"'");
		this.fs.appendFile(this.dir+this.fileNames.send, line, { encoding:"utf8" }, function(err) {
			if(err)
				throw err;
		});
	},
	codec: {
		operations: {
			connect: "c",
			disconnect: "d",
			send: "s",
			receive: "r"
		},
		createRobotKey: function(target) {
			return target.toString("hex");
		},
		encode: function(id, operation, data) {
			if(!id || !operation)
				return "";
			return id+":"+operation+(data?":"+data:"");
		},
		decode: function(line) {
			var parts = line.trim().split(":", 3);
			if(!parts[0] || !parts[1])
				return null;
			return {
				key: parts[0],
				operation: parts[1],
				data: parts[2]?parts[2]:null
			};
		}
	}
};
bluetooth.init();