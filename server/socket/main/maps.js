var db = require("../../core/connectivity/db.js"),

	mapInstances = {},
	sql = {
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
	},

MapManager = function(map, callback) { // map has to be an entry given by getMaps command
	var t = this;
	
	t.data = map;
	sql.getMap(map, function(map) { // map entry is extended by points
		t.data = map;
		callback();
		console.log("> Map instance added id = "+map.id);
	});
	
	if(mapInstances[map.id] === undefined)
		mapInstances[map.id] = [];
	mapInstances[map.id].push(this);
};

MapManager.getMaps = function(callback) {
	sql.getMaps(callback);
};

MapManager.prototype = {
	data: null,
	listener: function() {},
	
	listen: function(listener) {
		if(typeof listener === "function")
			this.listener = listener;
	},
	send: function(message) {
		var instances = mapInstances[this.data.id];
		if(instances)
			for(var i = 0; i < instances.length; i++)
				instances[i].listener(message);
	},
	quit: function() { // TODO may become too slow when many users use the software:
		var instances = mapInstances[this.data.id];
		if(instances)
			for(var i = 0; i < instances.length; i++)
				if(instances[i] === this) {
					instances.splice(i, 1);
					break;
				}
		console.log("> Map instance removed id = "+this.data.id);
	}
};

module.exports = MapManager;