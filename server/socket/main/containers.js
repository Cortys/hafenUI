var ContainerManager = function(client) {
	if(client) {
		this.client = client;
		console.log("> New ContainerManager for client "+client.key);
	}
};

ContainerManager.prototype = {
	client: null,
	
	containers: [],
	blockedContainers: [],
	
	start: function() {
		
	},
	
	quit: function() {
		
	}
};

module.exports = ContainerManager;