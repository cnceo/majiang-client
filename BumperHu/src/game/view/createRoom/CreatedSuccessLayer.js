
//已开房间
main.CreatedSuccessLayer = game.IView.extend({
    uiHelper:null,
    ctor:function (obj) {
        this._super();
        var size = cc.winSize;

        this.uiHelper =  new game.UIHelper();
        var node = this.uiHelper.doLayout(res.CreatedSuccess_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);

        var btnClose = ccui.helper.seekWidgetByName(node,"ButtonConfirm") ;
        btnClose.msg = common.NotifyType.CLOSE_CREATED_SUCCESS_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this) ;

        ccui.helper.seekWidgetByName(node,"ButtonShare").addTouchEventListener(this.btnShareClicked,this) ;
        console.log(" create success: ",obj);

        var lablePlayWay=ccui.helper.seekWidgetByName(node,"LabelPlayWay");
        if(obj.gameType==1){
            lablePlayWay.setString("红中发财杠258");
        }else{
            if(obj.hhType==1){
                lablePlayWay.setString("红中发财晃-红中晃晃");
            }else{
                lablePlayWay.setString("红中发财晃-发财晃晃");
            }
        }
        ccui.helper.seekWidgetByName(node,"LabelRoomNo").setString(obj.roomNo);
        ccui.helper.seekWidgetByName(node,"LabelRound").setString(obj.roomCount);
        var lableOther=ccui.helper.seekWidgetByName(node,"LabelOther");
        var other="";

        if(obj.gameType==1){
            other="底分"+obj.underscore+"、"+obj.huCount+"倍起胡、"+obj.maxHuCount+"倍封顶";
        }else{
            other="底分"+obj.underscore+"、"+obj.huCount+"倍起胡、"+obj.theTop+"倍金顶";
        }
        lableOther.setString(other);

        this.addChild(node);
        return true;
    },
    btnShareClicked:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","sendMsgToFriend","(Ljava/lang/String;Ljava/lang/String;)V","快来玩呀","我在这里等你");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("WeChatHelper", "wechatShare:title:description:webpageUrl:", "1", "快来玩呀", "真好玩", "http://www.elepok.com/gameCenter.html");
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }
});