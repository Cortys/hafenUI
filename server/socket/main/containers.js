var db = require("../../core/connectivity/db.js"), 

ContainerManager = function(client) {
	if(client) {
		this.client = client;
		console.log("> New ContainerManager for client "+client.key);
	}
};

ContainerManager.prototype = {
	client: null,
	
	containers: [],
	blockedContainers: [],
	
	fetchContainers: function(callback) {
		db.query("SELECT `container`.`id`, `container`.`name`, `rfid`, `point`, `manufacturers`.`name` AS `manufacturer` FROM `container` INNER JOIN `manufacturers` ON `container`.`manufacturer` = `manufacturers`.`id` INNER JOIN `points` ON `container`.`point` = `points`.`id` WHERE `points`.`map` = " + this.client.map.manager.data.id, function(err, result) {
			if (result)
				callback(result);
		});
	},

	start: function() {
		var t = this;
		t.client.socket.on("getContainers", function(data, callback) {
			t.fetchContainers(function(result) {
				callback(result);
			});
		});
	},
	
	quit: function() {
		
	}
};

module.exports = ContainerManager;