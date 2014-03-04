/**
 * Module: containers
 * Purpose: Display the available containers
 * Author: Marvin Schäfer
 */


new Modular("containers", ["socket", "events"], function(){
	var t = this;

	t.val.list = $("#containerList");
	
	socket.do.send("getContainers", {}, function(data){
		if(data)
			t.do.displayContainers(data);
		console.log(data);
	});
});

containers.val = {
	list: null
};

containers.do = {
	val: containers.val,
	
	displayContainers: function(containers){
		this.val.list.empty();
		for(var i = 0; i < containers.length; i++){
			this.val.list.append("<div class='container'><div class='name'>"+containers[i].name+"</div><div class='company'>"+containers[i].manufacturer+"</div></div>");
		}
	}
};