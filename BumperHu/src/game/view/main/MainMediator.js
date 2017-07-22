main.MainSceneMediator = game.SceneMediator.extend({
	ctor:function (view) {
		this._super(view);
	}
});

main.MainLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
		this._super(view);
	},
	init:function () {
        this.subscrib(common.NotifyType.SHOW_SETTING_PANEL, this.showSetting, this);
        this.subscrib(common.NotifyType.SHOW_CREATE_ROOM_PANEL, this.showCreateRoom, this);
        this.subscrib(common.NotifyType.SHOW_CREATED_ROOM_PANEL, this.showCreatedRoom, this);
        this.subscrib(common.NotifyType.SHOW_CREATED_SUCCESS_PANEL, this.showCreatedSuccess, this);
        this.subscrib(common.NotifyType.SHOW_JOIN_ROOM_PANEL, this.showJoin, this);
        this.subscrib(common.NotifyType.SHOW_JOIN_ROOM_CONFIRM_PANEL, this.showJoinConfirm, this);
        this.subscrib(common.NotifyType.SHOW_HELP_PANEL, this.showHelp, this);
        this.subscrib(common.NotifyType.SHOW_TIPS_PANEL, this.showTips, this);
        this.subscrib(common.NotifyType.SHOW_MESSAGE_PANEL, this.showEmail, this);
        this.subscrib(common.NotifyType.SHOW_SHOP_PANEL, this.showShop, this);
        this.subscrib(common.NotifyType.SHOW_ACHIEVE_PANEL,this.showAchieve,this) ;
        this.subscrib(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL,this.showAchieveDetail,this) ;
        this.subscrib(common.NotifyType.GO_TO_PLAY,this.gotoPlay,this) ;
        this.subscrib(common.NotifyType.SHOW_SHARE_PANEL,this.showShare,this) ;
        this.subscrib(common.NotifyType.ON_DISCONNECT,this.onDisconnect,this) ;
        this.subscrib(common.NotifyType.ON_TIME_OUT,this.onTimeOut,this) ;
        this.subscrib(common.NotifyType.SHOW_IDENTIFY_PANEL,this.showIdentify,this);
        this.subscrib(common.NotifyType.GO_TO_PLAY_BACK,this.goToPlayBack,this);
	},

	show:function (parent)
	{
		this._super(parent);
		parent.addChild(this.currView);
	},

	setUserInfo:function(data){
        console.log("setUserInfo data");
        console.log(data);
    },

	freshen:function (obj){
        console.log(" freshen ..................... ");

	},

    onDisconnect:function(obj, target){
        console.log("--------------onDisconnect-----------------");

    },

    onTimeOut:function(obj, target){
        console.log("--------------onTimeOut-----------------");
    },

    showSetting:function(obj, target){
        var layerMediator = new main.SetLayerMediator(new main.SetLayer()) ;
        target.showLayer(layerMediator);
	},

    showCreateRoom:function(obj, target){
        console.log( "showCreateRoom obj " ,obj);
        var layerMediator = new main.CreateLayerMediator(new main.CreateRoomLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    showCreatedRoom:function(obj, target){
        var layerMediator = new main.CreatedLayerMediator(new main.CreatedRoomLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    showCreatedSuccess:function(obj, target){
        var layerMediator = new main.CreatedSuccessMediator(new main.CreatedSuccessLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    showJoin:function(obj, target){
        var layerMediator = new main.JoinLayerMediator(new main.JoinLayer(obj)) ;
        target.pushLayer(layerMediator);
    },

    showJoinConfirm:function(obj, target){
        var layerMediator = new main.JoinRoomConfirmMediator(new main.JoinRoomConfirmLayer(obj)) ;
        target.pushLayer(layerMediator);
    },

    showHelp:function(obj, target){
        var layerMediator = new main.HelpLayerMediator(new main.HelpLayer()) ;
        target.showLayer(layerMediator);
    },

    showTips:function(obj, target){
        target.closeLoadingCircle() ;
        var layerMediator = new main.TipsLayerMediator(new main.TipsLayer(obj)) ;
        target.showLayer(layerMediator);
    },
    showEmail:function(obj, target){
        target.closeLoadingCircle();
        var layerMediator = new main.EmailLayerMediator(new main.EmailLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    showShop:function(obj, target){
        var mediator = new main.ShopLayerMediator(new main.ShopLayer());
        target.showLayer(mediator) ;
    },

    showAchieve:function(obj, target){
        var mediator = new main.AchieveLayerMediator(new main.AchieveLayer(obj));
        target.showLayer(mediator) ;
    },

	showAchieveDetail:function(obj, target){
        var mediator = new main.AchieveDetailMediator(new main.AchieveDetailLayer(obj));
        target.pushLayer(mediator) ;
    },

    showShare:function(obj, target){
        var mediator = new main.ShareMediator(new main.ShareLayer(obj));
        target.showLayer(mediator) ;
    },
    showIdentify:function (obj, target) {
        var mediator = new main.IdentifyMediator(new main.IdentifyLayer());
        target.showLayer(mediator) ;
    },

    gotoPlay: function (obj,target) {
        var sceneMediator = new play.RunSceneMediator(new play.RunScene);
        sceneMediator.rootLayer(new play.RunLayerMediator(new play.RunLayer(obj)));
        target.showScene(sceneMediator);
    },

    goToPlayBack:function(obj,target){
        var sceneMediator = new play.PlayBackSceneMediator(new play.PlayBackScene);
        sceneMediator.rootLayer(new play.PlayBackLayerMediator(new play.PlayBackLayer(obj)));
        target.showScene(sceneMediator);
    },

	destroy:function () {
        this.unsubscrib(common.NotifyType.SHOW_SETTING_PANEL, this.showSetting);
        this.unsubscrib(common.NotifyType.SHOW_CREATE_ROOM_PANEL, this.showCreateRoom);
        this.unsubscrib(common.NotifyType.SHOW_CREATED_ROOM_PANEL, this.showCreatedRoom);
        this.unsubscrib(common.NotifyType.SHOW_CREATED_SUCCESS_PANEL,this.showCreatedSuccess) ;
        this.unsubscrib(common.NotifyType.SHOW_JOIN_ROOM_PANEL, this.showJoin);
        this.unsubscrib(common.NotifyType.SHOW_JOIN_ROOM_CONFIRM_PANEL, this.showJoinConfirm);
        this.unsubscrib(common.NotifyType.SHOW_HELP_PANEL, this.showHelp);
        this.unsubscrib(common.NotifyType.SHOW_TIPS_PANEL, this.showTips);
        this.unsubscrib(common.NotifyType.SHOW_MESSAGE_PANEL, this.showEmail);
        this.unsubscrib(common.NotifyType.SHOW_SHOP_PANEL, this.showShop);
        this.unsubscrib(common.NotifyType.SHOW_ACHIEVE_PANEL, this.showAchieve);
        this.unsubscrib(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL,this.showAchieveDetail,this) ;
        this.unsubscrib(common.NotifyType.GO_TO_PLAY, this.gotoPlay);
        this.unsubscrib(common.NotifyType.SHOW_SHARE_PANEL,this.showShare) ;
        this.unsubscrib(common.NotifyType.ON_DISCONNECT,this.onDisconnect,this) ;
        this.unsubscrib(common.NotifyType.ON_TIME_OUT,this.onTimeOut,this) ;
        this.unsubscrib(common.NotifyType.SHOW_IDENTIFY_PANEL,this.showIdentify,this) ;
        this.unsubscrib(common.NotifyType.GO_TO_PLAY_BACK,this.goToPlayBack,this);
	}
});