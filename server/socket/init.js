var socket = {
	server: null,
	io: null,
	port: 3700,
	bluetooth: null,
	init: function(app) {
		
		this.server = require('http').createServer(app);
		this.io = require('socket.io').listen(this.server);
		this.server.listen(this.port);
		
		console.log("> Listening to port "+this.port+" for static page and socket.io connections");
		this.addHandlers();
	},
	addHandlers: function() {
		// login page sockets:
		this.io.of("/login").on("connection", require("./login/init.js"));
		this.io.of("/main").on("connection", require("./main/init.js"));
		console.log("> Ready for socket connections");
	}
};

module.exports = function(app, root) {
	socket.init(app, root);
};