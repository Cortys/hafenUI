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
			if(!data) { // no map given
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
			}
			else { // map given, details required
				t.getMap(data, function(map) {
					t.data = map;
					callback(map);
				});
			}
		});
	},
	
	getMaps: function(callback) {
		db.query("SELECT * FROM `maps`", function(err, result) {
			if(err)
				callback([]);
			else
				callback(result);
		});
	},
	
	getMap: function(map, callback) {
		db.query("SELECT * FROM `points` WHERE `map` = "+(db.escape(map.id)), function(err, result) {
			map.points = err?{}:result;
			callback(map);
		});
	}
};

module.exports = Map;