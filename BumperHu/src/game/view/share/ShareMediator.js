main.ShareMediator=game.LayerMediator.extend({
    ctor:function (view) {
        this._super(view);
    },
    init:function () {
        this.subscrib(common.NotifyType.CLOSE_SHARE_PANEL,this.close,this);

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

    }
});
