main.HelpLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
        this._super(view);
    },
    init:function () {
        this.subscrib(common.NotifyType.CLOSE_HELP_PANEL, this.closeHelp, this);

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
    destroy:function () {
        this.unsubscrib(common.NotifyType.CLOSE_HELP_PANEL, this.closeHelp);
    }
});
