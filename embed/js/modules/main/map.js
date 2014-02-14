/**
 * Module: map
 * Purpose: Show a dynamic map
 * Author: Clemens Damke
 */

Modular.addModules({
	mapPicker: "main/map/mapPicker.js"
});

new Modular("map", ["events", "mapPicker"], function() {
	var t = this;
	
	t.val.c = $("#map");
	t.val.adjust = $(".adjust", t.val.c);
	t.val.bg = t.val.adjust.children(".bg");
	t.val.points = t.val.adjust.children(".points");
	
	mapPicker.do.onPicked(function(map, initial) {
		t.do.show(map, initial);
	});
});

map.val = {
	shownBefore: false,
	pointTypes: {
		1: "normal",
		2: "station"
	}
};

map.do = {
	val: map.val,
	
	updatePoints: function(ratio) {
		var t = this,
			x = t.val.bg[0].clientWidth,
			y = t.val.bg[0].clientHeight,
			w = y*ratio<x?y*ratio:x,
			h = y*ratio<x?y:x/ratio,
			f = w*0.025;
		t.val.points.css({ width:w, height:h, marginTop:(-h/2), marginLeft:(-w/2), fontSize:(f/2), lineHeight:(f+"px") }).removeClass("hidden");
	},
	
	show: function(map, initial) {
		var t = this;
		
		setTimeout(function() {
			t.val.bg.css({ opacity:1 });
			t.val.adjust.addClass("normal").on(events.transitionEnd, function() {
				t.updatePoints(map.backgroundRatio);
			});
		}, initial?0:350);
		
		if(!t.val.shownBefore) {
			t.val.c.show();
			$(".side").removeClass("hidden");
		}
		
		t.val.bg.css({ backgroundImage:"url(imgs/maps/"+(map.background)+".svg)", opacity:(initial?0:1) });
		
		$(window).unbind("resize").on("resize", function() {
			t.updatePoints(map.backgroundRatio);
		});
		t.setPoints(map.points);
		
		t.val.shownBefore = true;
	},
	
	setPoints: function(points) {
		
		var t = this,
			html = "",
			p;
		
		for (var i = 0; i < points.length; i++) {
			p = points[i];
			html += "<div class='point "+(t.val.pointTypes[p.type])+"' style='top:"+(p.y/10)+"%; left:"+(p.x/10)+"%'><div>"+(p.name)+"</div></div>";
		}
		
		t.val.points.html(html);
	}
};