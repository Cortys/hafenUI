var db = require("../../core/connectivity/db.js"),
	mover = require("../../core/control/robotMovement.js"),
	JobMoveTo = require("../../core/control/jobs/moveTo.js"),
	MapManager = require("./maps.js");

Map = function(client) {
	if(client) {
		this.client = client;
		this.client.robot.position = null;
		console.log("> New Map for client "+client.key);
	}
},

sql = {
	getPosition: function(map, position, callback) { // point codes of current and last to unique point ids of current and last
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
	manager: null,
	
	start: function() {
		var t = this;
		t.client.socket.on("mapData", function(data, callback) {
			if(!data) { // no map given
				if(t.manager && t.manager.data)
					callback({
						picked: true,
						map: t.manager.data,
						robotPosition: t.client.robot.position
					});
				else
					MapManager.getMaps(function(maps) {
						callback({
							picked: false,
							maps: maps
						});
					});
			}
			else { // map given, details required
				t.manager = new MapManager(data, function() {
					callback(t.manager.data);
					
					t.locateRobot();
				});
				t.manager.listen(function(message) {
					t.handleMapMessage(message); // handle messages that apply to all connected clients on this map
				});
			}
		});
		
		t.client.socket.on("goToPoint", function(data, callback) {
			if(t.client.jobs && t.client.robot.position)
				t.client.jobs.addJob(new JobMoveTo(data.target, t));
		});
	},
	
	handleMapMessage: function(message) {
		
	},
	
	location: function(callback) { // method has to be implemented: map follows locator interface (has to report map id)
		callback(this.manager.data?this.manager.data.id:-1);
	},
	
	locateRobot: function(callback) { // method has to be implemented: map follows locator interface (has to report robot position)
		var t = this;
		mover.do.init(t.client, function(position) {
			t.updatePosition(position, callback);
		});
	},
	
	updatePosition: function(position, callback) {
		var t = this;
		sql.getPosition(t.manager.data.id, position, function(position) {
			t.client.robot.position = position;
			if(!position)
				t.locateRobot(callback);
			else if(typeof callback == "function")
				callback(position);
			t.client.socket.emit("robotPosition", position);
		});
	},
	
	getPosition: function(callback) {
		callback(this.client.robot.position);
	},
	
	quit: function() {
		if(this.manager)
			this.manager.quit();
	}
};

module.exports = Map;