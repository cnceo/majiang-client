main.JoinLayer=game.IView.extend({
    uiHelper:null,
    text_Num:null,
    isFirstInPut:null,
    _roomCard:null,

    _btnReset:null,
    _btnBack:null,
    ctor:function () {
        this._super();

        var size=cc.winSize;
        this.uiHelper=new game.UIHelper();
        var node=this.uiHelper.doLayout(res.JoinRoom_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);

        for (var i=0;i<=9;i++){
            var btnName = "ButtonNum" + i;
            var btnNumber =ccui.helper.seekWidgetByName(node,btnName);
            btnNumber.setTag(i);
            btnNumber.addTouchEventListener(this.touchEvent,this);
        }

        this._btnBack=ccui.helper.seekWidgetByName(node,"ButtonBack");
        this._btnBack.addTouchEventListener(this.btnStepBackClicked,this);
        this._btnBack.setTouchEnabled(false);

        this._btnReset=ccui.helper.seekWidgetByName(node,"ButtonReset");
        this._btnReset.addTouchEventListener(this.btnResetClicked,this);
        this._btnReset.setTouchEnabled(false);

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_JOIN_ROOM_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        var inputBg = ccui.helper.seekWidgetByName(node,"ImgInputBg");
        this.txtRoomNo=ccui.helper.seekWidgetByName(inputBg,"LabelRoomNo");

        this.isFirstInPut=true;
        this.addChild(node);
        this.scheduleUpdate();
        return true;
    },

    btnStepBackClicked:function(sender,type){
        if(type!=ccui.Widget.TOUCH_ENDED) return;
        var str = this.txtRoomNo.getString();
        if(str.length>=1){
            this.txtRoomNo.setString(str.substr(0,str.length-1))
        }
    },

    btnResetClicked:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        this.txtRoomNo.setString("");
    },

    touchEvent:function (sender,type) {
        if(type==ccui.Widget.TOUCH_ENDED){
            this._btnBack.setTouchEnabled(true);
            this._btnReset.setTouchEnabled(true);
            if(this.isFirstInPut){
                this.txtRoomNo.setString("");
                this.isFirstInPut=false;
            }
            if(this.txtRoomNo.getString().length<6){
                this.txtRoomNo.setString(this.txtRoomNo.getString() + (sender.getTag()).toString());
            }
        }
    },

    update:function (dt) {
        if(this.txtRoomNo.getString().length==6){
            if(!isNaN(this.txtRoomNo.getString())){
                this.unscheduleUpdate() ;
                var params = {
                    roomNo:this.txtRoomNo.getString()
                };
                net.NetManage.entryRoom(params);
                this.showLoadingCircle() ;
            }
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }
});