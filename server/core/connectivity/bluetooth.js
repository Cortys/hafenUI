var bluetooth = module.exports = {
	dir: null,
	fs: require("fs"),
	fileNames: {
		send: "send.txt",
		receive: "receive.txt"
	},
	listeners: {},
	init: function() {
		this.dir = require("../settings.js").rootDir+"/bluetooth/";
		this.resetFiles();
		this.startListening();
	},
	resetFiles: function() {
		this.fs.writeFile(this.dir+this.fileNames.send, this.codec.encode(this.codec.operations.kill));
	},
	startListening: function() {
		var fileName = this.fileNames.receive,
			file = this.dir+fileName,
			fs = this.fs,
			codec = this.codec,
			listeners = this.listeners,
			t = this;
		console.log("> Watching file '"+file+"' for changes");
		require("chokidar").watch(file, { persistent:false }).on("change", function(filename, stats) {
			var data = fs.readFileSync(file, { encoding:"utf8", flag:"r" });
			if(!data)
				return;
			fs.writeFile(file, new Buffer(0));
			console.log("> Received change for file '"+file+"'");
			var lines = data.split("\n"),
				parts;
			for(var i = 0; i < lines.length; i++) {
				// On "kill" (Java client restarted/crashed): Call all disconnect listeners and force quit all connections
				if(lines[i] == codec.operations.kill) {
					for(var key in listeners)
						if(typeof listeners[key][codec.operations.disconnect] == "function")
							listeners[key][codec.operations.disconnect]();
					t.listeners = listeners = {};
				}
				else {
					parts = codec.decode(lines[i]);
					if(parts && typeof listeners[parts.key] == "object" && typeof listeners[parts.key][parts.operation] == "function")
						listeners[parts.key][parts.operation](parts.data);
				}
			}
		});
	},
	connect: function(client, callback) {
		var t = this,
			robotKey = t.codec.createRobotKey(client.robot.bluetooth);
		console.log("> Trying to connect client "+client.key+" with "+robotKey);
		
		//Fake login:
		/*this.fs.appendFile(this.dir+this.fileNames.receive, client.key+":c", { encoding:"utf8" }, function(err) {
			if(err)
				throw err;
		});*/
		
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
	isListeningFor: function(client, operation) {
		return client && client.key && this.listeners[client.key] && this.listeners[client.key][this.codec.operations[operation]];
	},
	appendLine: function(line) {
		console.log("> Appending line: '"+line+"'");
		this.fs.appendFile(this.dir+this.fileNames.send, line, { encoding:"utf8" }, function(err) {
			if(err)
				throw err;
		});
	},
	codec: require("../protocols/BFP.js") // Use BFP for communication
};
bluetooth.init();
