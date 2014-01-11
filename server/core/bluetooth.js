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
		console.log("> Watching file '"+file+"' for changes");
		fs.watchFile(file, { persistent:true, interval:5007 }, function() {
			var data = fs.readFileSync(file, { encoding:"utf8", flag:"r" });
			if(!data)
				return;
			fs.writeFile(file, new Buffer(0));
			console.log("> Received change for file '"+file+"'");
			var lines = data.split("\n"),
				parts;
			for(var i = 0; i < lines.length; i++) {
				parts = codec.decode(lines[i]);
				console.log(listeners);
				if(parts && typeof listeners[parts.key] == "object" && typeof listeners[parts.key][parts.operation] == "function")
					listeners[parts.key][parts.operation](parts.data);
			}
		});
	},
	connect: function(client, callback) {
		var t = this,
			robotKey = t.codec.createRobotKey(client.robot.bluetooth);
		console.log("> Trying to connect client "+client.key+" with "+robotKey);
		t.listenFor(client, "connect", function() {
			callback();
			t.unlistenFor(client, "connect");
			console.log("> Connected client "+client.key+" with "+robotKey);
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
		if(client && typeof this.listeners[client.key] == "object" && typeof this.listeners[client.key][operation] == "function")
			delete this.listeners[client.key][this.codec.operations[operation]];
	},
	unlistenForAll: function(client) {
		if(client && typeof this.listeners[client.key] == "object")
			delete this.listeners[client.key];
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
			return id+":"+operation+(data?":"+data:"")+"\n";
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