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
		this.fs.watch(this.dir+this.fileNames.receive, { persistent:true }, function(event) {
			if(event != "change")
				return;
			// TODO call matching listener of this.listeners to added codec-line
		});
	},
	connect: function(client) {
		var robotKey = this.codec.createRobotKey(client.robot.bluetooth);
		this.appendLine(this.codec.encode(client.key, "c", robotKey));
	},
	disconnect: function(client) {
		this.appendLine(this.codec.encode(client.key, "d"));
	},
	send: function(client, message) {
		this.appendLine(this.codec.encode(client.key, "s", message));
	},
	listenFor: function(client, callback) {
		this.listeners[client.key] = callback;
	},
	appendLine: function(line) {
		
	},
	codec: {
		createRobotKey: function(target) {
			return target.toString("hex");
		},
		encode: function(id, operation, data) {
			if(!id || !operation)
				return "";
			return id+":"+operation+(data?":"+data:"");
		},
		decode: function(line) {
			var parts = line.split(":", 3);
			if(!parts[0] || !parts[1])
				return null;
			return {
				id: parts[0],
				operation: parts[1],
				data: parts[2]?parts[2]:null
			};
		}
	}
};
bluetooth.init();