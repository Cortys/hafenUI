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
	
	t.val.c = $("#map");
	t.val.adjust = $(".adjust", t.val.c);
	t.val.bg = t.val.adjust.children(".bg");
	
	mapPicker.do.onPicked(function(map, initial) {
		t.do.show(map, initial);
	});
});

map.val = {
	shownBefore: false
};

map.do = {
	val: map.val,
	show: function(map, initial) {
		var t = this;
		
		if(initial)
			t.val.adjust.addClass("normal");
		else
			setTimeout(function() {
				t.val.adjust.addClass("normal");
			}, 350);
		
		if(!t.val.shownBefore) {
			t.val.c.show();
			$(".side").removeClass("hidden");
		}
		
		t.val.bg.css({ backgroundImage:"url(imgs/maps/"+(map.background)+".svg)" });
		
		t.val.shownBefore = true;
	}
};