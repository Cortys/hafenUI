var db = {
	mysql: require("mysql"),
	connectionData: require("../settings.js").dbData,
	connection: null,
	init: function() {
		var t = this;
		this.connection = this.mysql.createConnection(this.connectionData);
		this.connection.connect(function(err) {
			console.log("> Database connection established with state: "+t.connection.state);
			if(err) {
				console.log("> Retrying to connect in 2000 ms", err);
				setTimeout(function() {
					t.init();
				}, 2000);
			}
		});
		this.connection.on('error', function(err) {
			if(err.code === "PROTOCOL_CONNECTION_LOST")
				t.init();
			else
				console.log("> Unsolvable DB error", err);
		});
	}
};
db.init();
module.exports = db.connection;