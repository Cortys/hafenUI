Modular.setModulePath("embed/js/modules/");

$(function() {
	Modular.loadModule(isLoggedIn?"main":"login", function(result) {
		if(!Modular.isOk(result))
			throw new Error("Loading main module: "+Modular.status(result));
	});
	document.body.addEventListener('touchmove', function(e){
		e.preventDefault();
		return false;
	});
});