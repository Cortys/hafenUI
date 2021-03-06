/**
 * Module: map
 * Purpose: Show a dynamic map
 * Author: Clemens Damke
 */

Modular.addModules({
	mapPicker: "main/map/mapPicker.js"
});

new Modular("map", ["events", "mapPicker", "robotInformation"], function() {
	var t = this;
	
	t.val.c = $("#map");
	t.val.adjust = $(".adjust", t.val.c);
	t.val.bg = t.val.adjust.children(".bg");
	t.val.points = t.val.adjust.children(".points");
	t.val.proportions = t.val.adjust.children(".preserveProportion");
	t.val.locating = t.val.adjust.children(".locating");
	t.val.overlay = t.val.adjust.children(".overlay");
	
	mapPicker.do.onPicked(function(map, position, initial) {
		t.do.show(map, initial);
		if(position)
			t.do.setRobotPosition(position);
	});
	
	socket.do.register("robotPosition", function(position) {
		t.do.setRobotPosition(position);
	});
	
	t.val.points.on(events.click, ".point", function() {
		t.do.goTo($(this).attr("data-id")*1);
	});
});

map.val = {
	shownBefore: false,
	pointTypes: {
		1: "normal",
		2: "station"
	},
	position: null,
	renderedCallback: null
};

map.do = {
	val: map.val,
	
	showLocator: function() {
		this.val.locating.show();
		this.val.overlay.show();
		this.val.locating.removeClass("hidden");
	},
	
	hideLocator: function() {
		this.val.overlay.hide();
		this.val.locating.addClass("hidden").one(events.transitionEnd, function() {
			$(this).hide();
		});
	},
	
	updatePoints: function(ratio) {
		var t = this,
			x = t.val.bg[0].clientWidth,
			y = t.val.bg[0].clientHeight,
			w = y*ratio<x?y*ratio:x,
			h = y*ratio<x?y:x/ratio,
			f = w*0.025;
		t.val.proportions.not(".locating").css({ width:w, height:h, marginTop:(-h/2), marginLeft:(-w/2), fontSize:(f/2), lineHeight:(f+"px") }).not(".overlay").removeClass("hidden");
		t.val.locating.css({ width:h, height:h, marginTop:(-h/2), marginLeft:(-h/2) });
	},
	
	show: function(map, initial) {
		var t = this,
			f = function() {
				t.val.bg.css({ opacity:1 });
				t.val.adjust.addClass("normal").one(events.transitionEnd, function() {
					t.updatePoints(map.backgroundRatio);
				});
				if(initial)
					t.updatePoints(map.backgroundRatio);
			};
		
		if(!t.val.shownBefore) {
			t.val.c.show();
			$(".side").removeClass("hidden");
		}
		
		t.val.bg.css({ backgroundImage:"url(imgs/maps/"+(map.background)+".svg)", opacity:(initial?0:1) });
		
		$(window).unbind("resize").on("resize", function() {
			t.updatePoints(map.backgroundRatio);
		});
		t.setPoints(map.points);
		
		initial?f():setTimeout(f, 350);
		
		if(!t.val.shownBefore && typeof t.renderedCallback == "function")
			t.renderedCallback();
		
		t.val.shownBefore = true;
	},
	
	setPoints: function(points) {
		
		var t = this,
			html = "",
			p;
		
		for(var i = 0; i < points.length; i++) {
			p = points[i];
			html += "<div class='point "+(t.val.pointTypes[p.type])+" n"+p.id+"' data-id='"+p.id+"' style='top:"+(p.y/10)+"%; left:"+(p.x/10)+"%'><div>"+(p.name)+"</div></div>";
		}
		
		t.val.points.html(html);
	},
	
	setRobotPosition: function(position) {
		var t = this,
			hide = function() {
				t.val.points.children("[data-id="+(t.val.position.current)+"]").removeClass("robot").children("div").css({ backgroundImage:"" });
			};
		if(position && (!t.val.position || position.current != t.val.position.current)) {
			if(!t.val.position)
				t.hideLocator();
			else
				hide();
			
			robotInformation.getData(function(robot) {
				t.val.points.children("[data-id="+(position.current)+"]").addClass("robot").children("div").css({ backgroundImage:("url(imgs/robots/"+robot.picture+".png)") });
			});
		}
		else if(!position) {
			window.alert("Oh no! Your little robot friend is hiding from me. But do not worry I will try again.");
			hide();
			t.showLocator();
		}
		t.val.position = position;
	},
	
	goTo: function(position) {
		socket.do.send("goToPoint", { target:position });
	},
	
	onRendered: function(callback) {
		if(this.shownBefore)
			callback();
		else
			this.renderedCallback = callback;
	}
};