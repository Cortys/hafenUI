var db = {
	mysql: require("mysql"),
	connectionData: require("./settings.js").dbData,
	connection: null,
	init: function() {
		this.connection = this.mysql.createConnection(this.connectionData);
		console.log("> Database connection established with state: "+this.connection.state);
	}
};
db.init();
module.exports = db.connection;