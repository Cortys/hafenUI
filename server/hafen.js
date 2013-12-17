var hafen = {
	root: null,
	init: function(root) {
		console.log("> Starting Containerhafen-Server");
		
		require("./settings.js").rootDir = root;
		
		this.root = root;
		
		this.load();
	},
	load: function() {
		// express framework:
		this.express = require("express");
		this.app = this.express();
		
		// page requires socket to be required:
		this.page = require("./page.js")(this.express, this.app, this.root);
		
		// sockets:
		this.socket = require("./socket.js")(this.app, this.root);
	}
};

module.exports = function(root) {
	hafen.init(root);
};