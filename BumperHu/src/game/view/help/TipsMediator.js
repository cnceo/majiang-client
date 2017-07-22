main.TipsLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
        this._super(view);
    },
    init:function () {
        this.subscrib(common.NotifyType.CLOSE_TIPS_PANEL, this.closeHelp, this);
        this.subscrib(common.NotifyType.ON_DISCONNECT, this.onDisconnect, this);
    },
    show:function (parent)
    {
        this._super(parent);
        parent.addChild(this.currView);
    },
    freshen:function (obj){

    },

    closeHelp:function (obj,target) {
        target.popLayer();
    },

    onDisconnect:function(obj,target){
        console.log(" ON_DISCONNECT ON_DISCONNECT");
        var initSceneMediator = new init.InitSceneMediator(new init.InitScene());
        initSceneMediator.rootLayer(new init.InitLayerMediator(new init.InitLayer()));
        game.Frameworks.init({width:1920, height:1080}, "DEBUG", initSceneMediator);
    },
    
    destroy:function () {
        this.unsubscrib(common.NotifyType.CLOSE_TIPS_PANEL, this.closeHelp);
        this.unsubscrib(common.NotifyType.ON_DISCONNECT, this.onDisconnect, this);
    }
});
