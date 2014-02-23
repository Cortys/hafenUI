var db = require("../../core/connectivity/db.js"),
	mover = require("../../core/control/robotMovement.js"),
	JobMoveTo = require("../../core/control/jobs/moveTo.js");

Map = function(client) {
	if(client) {
		this.client = client;
		this.client.robot.position = null;
		console.log("> New Map for client "+client.key);
	}
},

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
	},
	getPosition: function(map, position, callback) {
		db.query("SELECT DISTINCT `turn`.`currentPoint` AS `current`, `turn`.`lastPoint` AS `last` FROM `points`, (SELECT `turns`.`currentPoint`, `turns`.`lastPoint` FROM `turns`, `points` AS `p1`, `points` AS `p2` WHERE `p1`.`map` = `p2`.`map` = "+map+" AND `p1`.`code` = "+(position.current*1)+" AND `p2`.`code` = "+(position.last*1)+" AND `turns`.`currentPoint` = `p1`.`id` AND `turns`.`lastPoint` = `p2`.`id`) AS `turn` WHERE `points`.`id` = `turn`.`currentPoint`", function(err, result) {
			if(err || !result[0])
				callback(null);
			else
				callback(result[0]);
		});
	}
};

Map.prototype = {
	
	client: null,
	data: null,
	
	start: function() {
		var t = this;
		t.client.socket.on("mapData", function(data, callback) {
			if(!data) { // no map given
				if(t.data)
					callback({
						picked: true,
						map: t.data,
						robotPosition: t.client.robot.position
					});
				else
					sql.getMaps(function(maps) {
						callback({
							picked: false,
							maps: maps
						});
					});
			}
			else { // map given, details required
				sql.getMap(data, function(map) {
					t.data = map;
					callback(map);
					
					t.locateRobot();
				});
			}
		});
		
		t.client.socket.on("goToPoint", function(data, callback) {
			t.client.jobs.addJob(new JobMoveTo(data.target, t));
		});
	},
	
	location: function(callback) {
		callback(this.data?this.data.id:-1);
	},
	
	locateRobot: function() {
		var t = this;
		mover.do.init(t.client, function(position) {
			t.updatePosition(position);
		});
	},
	
	updatePosition: function(position, callback) {
		var t = this;
		sql.getPosition(t.data.id, position, function(position) {
			t.client.robot.position = position;
			t.client.socket.emit("robotPosition", position);
			if(typeof callback == "function")
				callback(position);
		});
	},
	
	getPosition: function(callback) {
		callback(this.client.robot.position);
	}
};

module.exports = Map;