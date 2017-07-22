init.InitSceneMediator = game.SceneMediator.extend({
	ctor:function (view) {
		this._super(view);
	}
});

init.InitLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
		this._super(view);
	},
	init:function () {
        this.subscrib(common.NotifyType.GO_TO_LOBBY, this.gotoLobby, this);
        this.subscrib(common.NotifyType.SHOW_LOGIN_FAILED,this.showLoginFail,this);
        this.subscrib(common.NotifyType.CLOSE_LOGIN_FAILED,this.closeLoginFailPanel,this) ;
        this.subscrib(common.NotifyType.GO_TO_PLAY,this.gotoPlay,this) ;
        this.subscrib(common.NotifyType.ON_DISCONNECT,this.onDisconnect,this) ;
        this.subscrib(common.NotifyType.ON_TIME_OUT,this.onTimeOut,this) ;
        this.subscrib(common.NotifyType.SHOW_TIPS_PANEL, this.showTips, this);
        this.subscrib(common.NotifyType.WECHAT_LOGIN_RESPONSE, this.weChatLoginResponse, this);

	},

	show:function (parent)
	{
		this._super(parent);
		parent.addChild(this.currView);
	},
	freshen:function (obj){

	},

    showLoginFail:function(obj, target){
		console.log(" login failed ............. ");
	},

    closeLoginFailPanel:function (obj, target) {

    },

    gotoLobby:function (obj, target) {
		console.log("gotoLobby obj  ");
		console.log(obj);
		if (obj.code == 200){ //登录成功
            var runSceneMediator = new main.MainSceneMediator(new main.MainScene());
            runSceneMediator.rootLayer(new main.MainLayerMediator(new main.MainLayer()));
            target.showScene(runSceneMediator);
            return ;
		}
		//TODO 登录失败的处理
    },

    showTips:function(obj, target){
        console.log(" obj obj ",obj);
        var layerMediator = new main.TipsLayerMediator(new main.TipsLayer(obj)) ;
        target.showLayer(layerMediator);
    },

    gotoPlay:function(obj, target){
        var playSceneMediator = new main.MainSceneMediator(new main.MainScene);
        playSceneMediator.rootLayer(new play.RunLayerMediator(new play.RunLayer(obj)));
        target.showScene(playSceneMediator);
	},

	test:function () {
		game.log("dsfsdfasdf");
	},
	
	onDisconnect:function(obj, target){
        console.log("--------------onDisconnect-----------------");
    },

    onTimeOut:function(obj, target){
        console.log("--------------onTimeOut-----------------");
    },
    weChatLoginResponse:function(obj,target){
        console.log(" WECHAT_LOGIN_RESPONSE ",JSON.stringify(obj));
    },

    destroy:function () {
        this.unsubscrib(common.NotifyType.GO_TO_LOBBY, this.gotoLobby);
        this.unsubscrib(common.NotifyType.SHOW_LOGIN_FAILED,this.showLoginFail) ;
        this.unsubscrib(common.NotifyType.CLOSE_LOGIN_FAILED,this.closeLoginFailPanel);
        this.unsubscrib(common.NotifyType.GO_TO_PLAY, this.gotoPlay);
        this.unsubscrib(common.NotifyType.ON_DISCONNECT,this.onDisconnect,this) ;
        this.unsubscrib(common.NotifyType.ON_TIME_OUT,this.onTimeOut,this) ;
        this.unsubscrib(common.NotifyType.SHOW_TIPS_PANEL,this.showTips,this) ;
        this.unsubscrib(common.NotifyType.WECHAT_LOGIN_RESPONSE,this.weChatLoginResponse,this) ;
	}
});