play.RunSceneMediator = game.SceneMediator.extend({
	ctor:function (view) {
		this._super(view);
	}
});

play.RunLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
		this._super(view);
	},
	init:function () {
        this.subscrib(common.NotifyType.GO_TO_LOBBY, this.gotoLobby, this);
        this.subscrib(common.NotifyType.SHOW_SETTING_PANEL, this.showSetting, this);
        this.subscrib(common.NotifyType.SHOW_HELP_PANEL, this.showHelp, this);
        this.subscrib(common.NotifyType.SHOW_BALANCE_PANEL, this.showBalanceLayer, this);
        this.subscrib(common.NotifyType.SHOW_TIPS_PANEL, this.showTips, this);
        this.subscrib(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL,this.showAchieveDetail,this) ;
        // this.subscrib(common.NotifyType.GO_TO_PLAY,this.reConnect,this) ;
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

    showSetting:function(obj, target){
        var layerMediator = new main.SetLayerMediator(new main.SetLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    showHelp:function(obj, target){
        var layerMediator = new main.HelpLayerMediator(new main.HelpLayer()) ;
        target.showLayer(layerMediator);
    },
    /**
     * 总的结算
     * @param obj
     * @param target
     */
    showBalanceLayer:function(obj, target){
        var layerMediator = new play.BalanceMediator(new play.BalanceLayer(obj)) ;
        target.showLayer(layerMediator);
    },


    showTips:function(obj, target){
        console.log(" showTips obj obj ",obj);
        var layerMediator = new main.TipsLayerMediator(new main.TipsLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    showAchieveDetail:function(obj, target){
        var mediator = new main.AchieveDetailMediator(new main.AchieveDetailLayer(obj));
        target.pushLayer(mediator) ;
    },

  /*  reConnect:function(obj,target){

    },*/

    destroy:function () {
        this.unsubscrib(common.NotifyType.GO_TO_LOBBY, this.gotoLobby);
        this.unsubscrib(common.NotifyType.SHOW_SETTING_PANEL, this.showSetting);
        this.unsubscrib(common.NotifyType.SHOW_HELP_PANEL, this.showHelp);
        this.unsubscrib(common.NotifyType.SHOW_BALANCE_PANEL, this.showBalanceLayer);
        this.unsubscrib(common.NotifyType.SHOW_TIPS_PANEL, this.showTips);
        this.unsubscrib(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL, this.showAchieveDetail);
        // this.unsubscrib(common.NotifyType.GO_TO_PLAY, this.reConnect);
    }
});