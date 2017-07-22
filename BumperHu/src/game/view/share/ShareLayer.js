
main.ShareLayer=game.IView.extend({
    uiHelper:null,

    _title:null,
    _desc:null,
    ctor:function (obj) {
        this._super();
        var size=cc.winSize;

        this.uiHelper=new game.UIHelper();
        var node=this.uiHelper.doLayout(res.Share_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(size.width/2,size.height/2);
        node.setContentSize(size);

        var imageView=ccui.helper.seekWidgetByName(node, "ImageView") ;
        ccui.helper.seekWidgetByName(imageView, "btn_sharemoment").addTouchEventListener(this.btnShareMoment,this) ;
        ccui.helper.seekWidgetByName(imageView, "btn_sharefriend").addTouchEventListener(this.btnShareFriend,this) ;

        node.setTouchEnabled(true);
        node.addTouchEventListener(this.btnShareClose,this);
        this.addChild(node);
        console.log(obj);
        this._title=obj.title;
        this._desc=obj.desc;
        return true;
    },

    btnShareFriend:function (sender,type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        console.log("btnShareFriend");
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","sendMsgToFriend","(Ljava/lang/String;Ljava/lang/String;)V",this._title,this._desc);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("WeChatHelper", "wechatShare:title:description:webpageUrl:", "1", this._title, this._desc, "http://www.elepok.com/gameCenter.html");
        }
        this.send(common.NotifyType.CLOSE_SHARE_PANEL);
    },
    btnShareMoment:function (sender,type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        console.log("btnShareMoment");
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","sendMsgToTimeLine","(Ljava/lang/String;Ljava/lang/String;)V",this._title,this._desc);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("WeChatHelper", "wechatShare:title:description:webpageUrl:", "2", this._title, this._desc, "http://www.elepok.com/gameCenter.html");
        }
        this.send(common.NotifyType.CLOSE_SHARE_PANEL);
    },

    btnShareClose:function (sender,type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.CLOSE_SHARE_PANEL);
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }

});