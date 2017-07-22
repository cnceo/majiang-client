main.SetLayerMediator=game.LayerMediator.extend({
    ctor:function (view) {
        this._super(view);
    },
    init:function () {
        console.log("=============");
        this.subscrib(common.NotifyType.CLOSE_SETTING_PANEL, this.close, this);

    },
    show:function (parent) {
        this._super(parent);
        parent.addChild(this.currView);
    },
    freshen:function (obj) {
        
    },
    close:function (obj,target) {
        target.popLayer();
    },
    destroy:function () {
        this.unsubscrib(common.NotifyType.CLOSE_SETTING_PANEL,this.close,this) ;
    }
});