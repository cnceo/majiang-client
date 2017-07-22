main.CreateLayerMediator = game.LayerMediator.extend({
    ctor:function (view) {
        this._super(view);
    },
    init:function () {
        this.subscrib(common.NotifyType.CLOSE_CREATE_ROOM_PANEL, this.close, this);
    },
    show:function (parent)
    {
        this._super(parent);
        parent.addChild(this.currView);
    },

    freshen:function (obj){

    },

    openSuccess:function(obj){
        this.currView.testFun(1);
    },


    close:function (obj,target) {
        target.popLayer();
    },
    destroy:function () {
        this.unsubscrib(common.NotifyType.CLOSE_CREATE_ROOM_PANEL, this.close);
    }
});