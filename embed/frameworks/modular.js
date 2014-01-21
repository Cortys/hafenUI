/**
 * Modular.js 1.0
 * 2013 - Clemens Damke
 * License: WTFPL - Have fun! Credits only if you want to.
 */

var Modular = (function() {
	
	/* Constructor: */
	
	var	globalContext = window,
		Modular = function(name, requires, init) {
		var t = this;
		globalContext[name] = this;
		t.init = init;
		Modular.loadModules(requires, function(status) { // loadModules for-loop is used to create a hashlist of requirements too.
			Object.getPrototypeOf(t).run.call(t, status);
		}, name);
	};
	
	/* Static Definitions: */
	
	Modular.loaded = {};
	Modular.modules = {};
	Modular.path = "";
	Modular.requiredBy = {};
	
	/* Class Methods: */
	
	Modular.isOk = function(result) {
		return result%2 == 1; // 1, 3 or 5 status are ok (5 partially)
	};
	
	Modular.status = function(result) {
		return this.status.codes[result];
	};
	Modular.status.codes = {
		1: "Module already loaded",
		2: "Module could not be loaded",
		3: "Module loaded",
		4: "Module loaded but invalidly defined",
		5: "Circular requirement loop had to be interrupted at first link-back (may cause problems in one modules 'init()')"
	};
	
	Modular.setModulePath = function(path) {
		if(path !== undefined)
			this.path = path;
		return this;
	};
	
	Modular.setModules = function(modules) {
		if(modules !== undefined)
			this.modules = modules;
		return this;
	};
	Modular.addModules = function(modules) {
		for(var key in modules)
			this.modules[key] = modules[key];
		return this;
	};
	
	var callFunctions = function(list, args) {
		for (var i = 0; i < list.length; i++)
			list[i].apply(Modular, args);
	}, moduleIsRequiredBy = function(module, byModule) { // setter to dependency: 'module' is required by 'byModule'
		if(!Modular.requiredBy[module])
			Modular.requiredBy[module] = {};
		Modular.requiredBy[module][byModule] = true;
	}, isModuleRequiredBy = function(module, byModule, viewedAt) { // check if a module is required by another module directly or via some other modules, required to check for circular requirement loops
		if(!viewedAt)
			viewedAt = {}; // viewedAt to prevent ring loops in graph analysis. -> force tree-like backtrace
		viewedAt[module] = true;
		if(Modular.requiredBy[module]) {
			if(Modular.requiredBy[module][byModule])
				return true;
			for(var key in Modular.requiredBy[module])
				if(!viewedAt[key] && isModuleRequiredBy(key, byModule, viewedAt))
					return true;
		}
		return false;
	}, head = document.getElementsByTagName("head")[0] || document.head || document,
	execCode = function(code) {
		if(code)
			try {
				var node = document.createElement("script");
				node.type = "text/javascript";
				node.text = code;
				head.appendChild(node);
				head.removeChild(node);
			} catch(error) {
				return error;
			}
	}, loadScript = function(url, success, fail) {
		var xhttp = new XMLHttpRequest();
		
		if(!xhttp)
			fail();
		xhttp.open("GET", url, true);
		xhttp.overrideMimeType("text/javascript");
		xhttp.send();
		xhttp.ontimeout = fail;
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4) {
				if(this.status == 200 || this.status == 304) {
					var e;
					if(e = execCode(this.responseText))
						fail(e);
					else
						success();
				}
				else
					fail();
			}
		};
	};
	
	Modular.loadModule = function(module, callback, requiredBy) {
		var t = this;
		if(requiredBy)
			moduleIsRequiredBy(module, requiredBy);
		if(!t.loaded[module]) {
			t.loaded[module] = typeof callback==="function"?[callback]:[];
			if(!t.modules[module])
				t.modules[module] = module+".js";
			var finishLoad = function(m, done) {
				callFunctions(t.loaded[module], [m, module]);
				t.loaded[module] = done;
			};
			loadScript(t.path+t.modules[module], function() {
				if(globalContext[module]) {
					t.prototype.onDone.call(globalContext[module], function() {
						finishLoad(3, true); // SUCCESS message
					});
				}
				else
					finishLoad(4, true); // INVALID message
			}, function(error) {
				if(error) {
					finishLoad(4, true); // INVALID message
					var e = new Error();
					e.message = "In module '"+module+"': "+error.message;
					if(document.baseURI)
						e.sourceURL = document.baseURI+t.path+t.modules[module];
					e.name = error.name;
					throw e;
				}
				else
					finishLoad(2, false); // FAIL message
			});
		}
		else if(callback) {
			if(t.loaded[module] === true || (requiredBy && globalContext[module] && isModuleRequiredBy(requiredBy, module)))
				setTimeout(function() {
					callback(t.loaded[module]===true?1:5, module); // ALREADY LOADED message OR CIRCULAR REQUIREMENT MESSAGE => both probably good
				}, 0);
			else // module currently loaded by other module. wait for it...
				t.loaded[module].push(callback);
		}
		return t;
	};
	Modular.loadModules = function(modules, callback, requiredBy) {
		var done = 0,
			result = {};
		if(modules && modules.length)
			for (var i = 0; i < modules.length; i++) {
				this.loadModule(modules[i], function(status, module) {
					done++;
					result[module] = status;
					if(done>=modules.length && callback)
						callback(result);
				}, requiredBy);
			}
		else if(callback)
			setTimeout(function() {
				callback(result);
			}, 0);
		return this;
	};
	
	/* Prototype: */
	
	Modular.prototype = {
		run: function(status) {
			if(this.init)
				this.init(status);
			if(this.doneCallback)
				this.doneCallback();
			if(!this.hasOwnProperty("run"))
				this.run = null;
		},
		onDone: function(callback) {
			this.doneCallback = callback;
		}
	};
	
	return Modular;
})();