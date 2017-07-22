main.ShopLayer=game.IView.extend({
    uiHelper:null,
    _item:null,
    _panel:null,
    _scrollview:null,
    _btnCopy:[],
    _lableWeChat:[],
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.uiHelper = new game.UIHelper();

        var node = this.uiHelper.doLayout(res.Shop_json);
        node.setAnchorPoint(cc.p(0.5, 0.5));
        node.setPosition(size.width / 2, size.height / 2);
        node.setContentSize(size);

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_SHOP_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        for(var i=0;i<3;i++){
            var label =ccui.helper.seekWidgetByName(node,"Label"+(i+1));
            var weChatNo = ccui.helper.seekWidgetByName(label,"LabelWeChat");
            var btnCopy =ccui.helper.seekWidgetByName(node,"ButtonCopy_"+(i+1));
            btnCopy.setTouchEnabled(true);
            btnCopy.addTouchEventListener(this.btnCopyClicked,this);
            btnCopy._value = weChatNo.getString() ;

        }
        this.addChild(node);
        return true;
    },

    btnCopyClicked:function (sender,type) {
        if(type==ccui.Widget.TOUCH_ENDED){
            this.copyText(sender._value) ;
        }
    },
    copyText:function (text) {
        console.log(" copyText ",text) ;
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","CopyClipboard","(Ljava/lang/String;)V",text);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("EleUtil", "copyToPasteboard:",text);
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    },
});
