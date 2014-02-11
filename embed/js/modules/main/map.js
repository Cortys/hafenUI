/**
 * Module: map
 * Purpose: Show a dynamic map
 * Author: Clemens Damke
 */

Modular.addModules({
	mapPicker: "main/map/mapPicker.js"
});

new Modular("map", ["mapPicker"], function() {
	var t = this;
	mapPicker.do.onPicked(function(map) {
		t.do.show(map);
	});
});

map.do = {
	show: function(map) {
		
	}
};