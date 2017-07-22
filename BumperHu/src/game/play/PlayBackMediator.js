play.PlayBackSceneMediator = game.SceneMediator.extend({
	ctor:function (view) {
		this._super(view);
	}
});

play.PlayBackLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
		this._super(view);
	},
	init:function () {
        this.subscrib(common.NotifyType.GO_TO_LOBBY, this.gotoLobby, this); 
	},
	show:function (parent)
	{
		this._super(parent);
		parent.addChild(this.currView);
	},
	freshen:function (obj){

	},

    gotoLobby:function (obj, target) {
        var runSceneMediator = new main.MainSceneMediator(new main.MainScene());
        runSceneMediator.rootLayer(new main.MainLayerMediator(new main.MainLayer()));
        target.showScene(runSceneMediator);
    },

    destroy:function () {
        this.unsubscrib(common.NotifyType.GO_TO_LOBBY, this.gotoLobby);
    }
});