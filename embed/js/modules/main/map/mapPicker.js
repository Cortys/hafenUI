/**
 * Module: mapPicker
 * Purpose: Show a dynamic map
 * Author: Clemens Damke
 */

new Modular("mapPicker", ["socket", "events"], function() {
	this.val.c = $("#mapSelection");
	
	this.val.e = this.val.c.children(".maps");
	
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
		
		var t = this,
			list = $("ul", t.val.e);
		
		list.empty();
		
		if(!maps.length)
			return;
		
		for(var i = 0; i < maps.length; i++)
			list.append("<li><div class='mapImg' style='background-image: url(imgs/maps/"+(maps[i].background)+".svg);'></div><div class='name'>"+(maps[i].name)+"</div></li>");
		
		t.val.c.show();
		
		var slider = t.val.e.unslider({
			fluid: false,
			autoplay: false,
			setheight: false,
			speed: 250,
			dots: true,
			easing: "swing",
			keys: true
		}).data("unslider");
		
		$(".arrow", this.val.c).unbind(events.click).on(events.click, function() {
			slider[$(this).attr("data-dir") == "left"?"prev":"next"]();
		});
		
		$(".continue", this.val.c).unbind(events.click).on(events.click, function() {
			t.pickMap(maps[slider.i]);
		});
		
	},
	
	pickMap: function(map) {
		
	},
	
	onPicked: function(callback) {
		this.val.callback = callback;
	}
};