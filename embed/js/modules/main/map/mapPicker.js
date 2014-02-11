/**
 * Module: mapPicker
 * Purpose: Show a dynamic map
 * Author: Clemens Damke
 */

new Modular("mapPicker", ["socket"], function() {
	this.do.requestMaps();
});

mapPicker.val = {
	callback: null
};

mapPicker.do = {
	val: mapPicker.val,
	requestMaps: function() {
		var t = this;
		socket.do.send("mapData", {}, function(data) {
			console.log(data);
			if(data.picked && typeof t.val.callback == "function")
				t.val.callback(data.map);
			else
				t.showMaps(data.maps);
		});
	},
	
	showMaps: function(maps) {
		$("#mapSelection").unslider();
	},
	
	onPicked: function(callback) {
		this.val.callback = callback;
	}
};