main.IdentifyLayer = game.IView.extend({
    _editName:null,
    _editNumber:null,
    _buttonIdentify:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.uiHelper = new game.UIHelper();
        var root = this.uiHelper.doLayout(res.Identify_json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);

        var node=ccui.helper.seekWidgetByName(root,"ImageViewBg");

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_IDENTIFY_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        this._buttonIdentify=ccui.helper.seekWidgetByName(node,"ButtonOK");
        this._buttonIdentify.setTouchEnabled(true);
        this._buttonIdentify.addTouchEventListener(this.btnIdentifyClicked,this);


        this._editName=new cc.EditBox(cc.size(590,65),new cc.Scale9Sprite("res/ui/common/number-bg.png"));
        this._editName.setPosition(774,615);
        this._editName.setAnchorPoint(0,0.5);
        this._editName.setDelegate(this);
        this._editName.setFontSize(30);
        this._editName.setFontColor(cc.color(128,127,127));
        this._editName.setPlaceHolder("请输入您的真实姓名");
        this._editName.setPlaceholderFontSize(25);
        this._editName.setPlaceholderFontColor(cc.color(128,127,127));

        this._editNumber=new cc.EditBox(cc.size(590,65),new cc.Scale9Sprite("res/ui/common/number-bg.png"));
        this._editNumber.setPosition(774,485);
        this._editNumber.setAnchorPoint(0,0.5);
        this._editNumber.setDelegate(this);
        this._editNumber.setFontSize(30);
        this._editNumber.setFontColor(cc.color(128,127,127));
        this._editNumber.setPlaceHolder("请输入您的身份证号");
        this._editNumber.setMaxLength(18);
        this._editNumber.setPlaceholderFontSize(25);
        this._editNumber.setPlaceholderFontColor(cc.color(128,127,127));

        this.addChild(this._editNumber,2);
        this.addChild(this._editName,2);

        this.addChild(root);
        return true;
    },

    btnIdentifyClicked:function (sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        console.log("认证------>");
        if (this._editNumber.getString() != "" && this._editName.getString() != "") {
            var params = {
                realName: this._editName.getString(),
                IDNo: this._editNumber.getString()
            };
            net.NetManage.realUserNameVerify(params);
            this.send(common.NotifyType.CLOSE_IDENTIFY_PANEL);
        } else {
            var params = {
                desc: common.TipsDesc.AuthenticationFailure,
                close: false,
                confirmOnly: function () {
					game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    game.Notification.send(common.NotifyType.SHOW_IDENTIFY_PANEL);
                }
            };
            game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL, params);
        }

    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }

});