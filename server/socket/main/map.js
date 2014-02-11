var db = require("../../core/connectivity/db.js"),

Map = function(client) {
	if(client) {
		this.client = client;
		console.log("> New Map for client "+client.key);
	}
};

Map.prototype = {
	
	data: null,
	
	start: function() {
		var t = this;
		t.client.socket.on("mapData", function(data, callback) {
			if(t.data)
				callback({
					picked: true,
					map: t.data
				});
			else
				t.getMaps(function(maps) {
					callback({
						picked: false,
						maps: maps
					});
				});
		});
	},
	
	getMaps: function(callback) {
		db.query("SELECT * FROM `maps`", function(err, result) {
			if(err)
				callback([]);
			else
				callback(result);
		});
	}
};

module.exports = Map;