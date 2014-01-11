var hafen = {
	root: null,
	init: function(root) {
		console.log("> Starting Containerhafen-Server");
		
		require("./core/settings.js").rootDir = root;
		
		this.root = root;
		
		this.load();
	},
	load: function() {
		// express framework:
		this.express = require("express");
		this.app = this.express();
		
		// page requires socket to be required:
		this.page = require("./static/init.js")(this.express, this.app);
		
		// sockets:
		this.socket = require("./socket/init.js")(this.app);
	}
};

module.exports = function(root) {
	hafen.init(root);
};