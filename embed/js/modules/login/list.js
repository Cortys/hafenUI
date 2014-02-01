/**
 * Module: list
 * Purpose: Loads elements in login robot list and handles clicks on them
 * Author: Clemens Damke
 */

new Modular("list", ["events","socket","ajaxBar","connect"], function() {
	this.val.list = $(this.val.list);
});

list.val = {
	list: "#robotList ul",
	activeRobot: null,
	activeId: null,
	loaded: false
};

list.do = {
	val: list.val,
	start: function(data) {
		ajaxBar.hide();
		this.val.list.empty();
		var foundSelected = false,
			foundAnything = false;
		$.each(data, function(i,v) {
			if(!v)
				return;
			foundAnything = true;
			var bluetooth = [],
				selected = v.id==list.val.activeId;
			for (var i = 0; i < v.bluetooth.length; i++)
				bluetooth[i] = (v.bluetooth[i]<16?"0":"")+v.bluetooth[i].toString(16);
			bluetooth = bluetooth.join("-").toUpperCase();
			list.val.list.append('<li data-id="'+v.id+'"><div class="robotInfo"><div class="pic" style="background-image:url(imgs/robots/'+v.picture+'.png);"></div><div class="name">'+v.name+'</div><div class="bluetoothId">'+bluetooth+'</div></div></li>');
			if(selected) {
				foundSelected = true;
				list.do.select(list.val.list.children("[data-id="+v.id+"]"));
			}
		});
		if(foundAnything) {
			(foundSelected?function(){}:this.select).call(this, list.val.list.children("li").on(events.click, function() {
				list.do.select($(this));
			}).on(events.doubleClick, function() {
				connect.do.fire();
			}).first());
			$("#noRobots").hide();
			connect.do.activate();
		}
		else {
			this.val.activeId = null;
			$("#noRobots").show();
			connect.do.deactivate();
		}
	},
	load: function(callback) {
		var t = this;
		ajaxBar.show();
		socket.do.register("unconnectedRobots", function(data) {
			t.start(data);
			if(!t.val.loaded)
				callback();
			t.val.loaded = true;
		});
	},
	select: function(e) {
		if(!connect.val.active || connect.val.disabled)
			return;
		if(this.val.activeRobot)
			this.val.activeRobot.removeClass("active");
		this.val.activeRobot = e;
		this.val.activeId = e.attr("data-id")*1;
		this.val.activeRobot.addClass("active");
	}
};