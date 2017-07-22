/********************************************************************************
  The LayerMediator
  @author kassia
  @date 2017-04-21
  
  The layer's logic.
********************************************************************************/
game.LayerMediator = game.IMediator.extend({
	currView:null,
	backBtn:null,
	mask:null,
	isRoot:true,
	ctor:function (view) {
		this.currView = view;
	},
	show:function (parent, obj) {
		if (this.isRoot) return;	
		var size = cc.winSize;
		this.mask = new cc.LayerColor(cc.color(0,0,0,200), size.width, size.height);
		parent.addChild(this.mask);
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan
		}, this.mask);
	},
	onTouchBegan:function(touch, event) {
		//Could to do sth.
		return true;
	},
	init:function () {
		throw new Error("SubClass must be overwrite init function and regist event in this function.");
	},
	freshen:function (obj) {
		cc.log("freshen");
	},
	//Use this function to send notification.
	send:function (key, obj)
	{
		game.Notification.send(key, obj);
	},
	subscrib:function (type, callback, target) {
		game.Notification.subscrib(type, callback, target);
	},
	unsubscrib:function (type, callback) {
		game.Notification.unsubscrib(type, callback);
	},
	//Switch scene
	showScene:function (sceneMed) {
		game.Facade._directorMediator.showScene(sceneMed);
		game.Facade._directorMediator.currSceneMediator.showRoot();
	},
	//Push new scen into the stack
	pushScene:function (sceneMed) {
		game.Facade._directorMediator.pushScene(sceneMed);
		game.Facade._directorMediator.currSceneMediator.showRoot();
	},
	//Pop current scene out of the stack
	popScene:function () {
		game.Facade._directorMediator.popScene();
	},
	//Switch layer
	showLayer:function (layerMed, obj) {
		game.Facade._directorMediator.currSceneMediator.showLayer(layerMed, obj);
	},
	//Push new layer into the stack
	pushLayer:function (layerMed, obj) {
		game.Facade._directorMediator.currSceneMediator.pushLayer(layerMed, obj);
	},
	//Pop current scene out of the stack
	popLayer:function (obj) {
		game.Facade._directorMediator.currSceneMediator.popLayer(obj);
	},
	//private
	_pDispose:function () {
		var that = this;
		that.destroy();
		that.currView.removeFromParent(true);
		that.mask && this.mask.removeFromParent(true);
	},
	destroy:function () {
		throw new Error("SubClass must be overwrite destroy function and delete event in this function.");
	}
});

