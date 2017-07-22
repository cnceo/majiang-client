/********************************************************************************
  The game Frameworks
  @author kassia
  @date 2017-04-21
  
  The framework's summary.
********************************************************************************/


game.Frameworks = {
	DEBUG:false,
	LOG_TAG:"DEBUG",
	IS_RUNTIME:false,
	NET_TYPE:1,
	DESIGN_ZOOM:1,
	DEVICE_ID:"DEVICE_ID",
	UI_IGNORE:"common/"
}

//init frameworks
game.Frameworks.init = function (size, logTag, sceneMed) {
	game.Facade.init(size, logTag, sceneMed);
}

game.Frameworks.setUIIgnoreResTag = function (tag) {
	game.Frameworks.UI_IGNORE = tag;
}