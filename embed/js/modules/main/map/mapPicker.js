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
	callback: null,
	disabled: false
};

mapPicker.do = {
	val: mapPicker.val,
	requestMaps: function() {
		var t = this;
		socket.do.send("mapData", null, function(data) {
			if(data.picked && typeof t.val.callback == "function") {
				t.val.callback(data.map, data.robotPosition, true);
				t.hide();
			}
			else
				t.showMaps(data.maps);
		});
	},
	
	showMaps: function(maps) {
		
		var t = this,
			list = $("ul", t.val.e);
		
		list.empty();
		
		if(!maps.length) {
			$(".continue", this.val.c).addClass("inactive");
			return;
		}
		
		for(var i = 0; i < maps.length; i++)
			list.append("<li><div class='mapImg' style='background-image: url(imgs/maps/"+(maps[i].background)+".svg);'></div><div class='name'>"+(maps[i].name)+"</div></li>");
		
		t.show();
		
		var slider = t.val.e.unslider({
			fluid: false,
			autoplay: false,
			setheight: false,
			speed: 250,
			dots: true,
			easing: "swing",
			keys: true
		}).data("unslider");
		
		if(maps.length > 1)
			$(".arrow", this.val.c).show().unbind(events.click).on(events.click, function() {
				slider[$(this).attr("data-dir") == "left"?"prev":"next"]();
			});
		else {
			$(".arrow, .dots").hide();
		}
		
		$(".continue", this.val.c).removeClass("inactive").unbind(events.click).on(events.click, function() {
			t.pickMap(maps[slider.i]);
		});
	},
	
	show: function() {
		this.val.c.removeClass("hidden");
	},
	
	hide: function() {
		this.val.c.addClass("hidden").one(events.transitionEnd, function() {
			$(this).remove();
		});
	},
	
	pickMap: function(map) {
		var t = this;
		if(t.val.disabled)
			return;
		t.val.disabled = true;
		socket.do.send("mapData", map, function(map) {
			if(map) {
				if(typeof t.val.callback == "function")
					t.val.callback(map);
				t.hide();
			}
			t.val.disabled = false;
		});
	},
	
	onPicked: function(callback) {
		this.val.callback = callback;
	}
};