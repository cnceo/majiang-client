main.SetLayer=game.IView.extend({
    uiHelper:null,
    ctor:function (obj) {
        this._super();
        var size=cc.winSize;

        this.uiHelper=new game.UIHelper();
        var root=this.uiHelper.doLayout(res.Setting_json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);

        var node = ccui.helper.seekWidgetByName(root,"ImgBackground");

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_SETTING_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        var btnLogout = ccui.helper.seekWidgetByName(node,"ButtonLogOut");
        btnLogout.setTouchEnabled(true) ;
        btnLogout.addTouchEventListener(this.btnLogoutClicked,this) ;
        if (obj != undefined){
            btnLogout.setVisible(false) ;
        }
        //1000,1001,1002,1003  对应音乐&音效&语音
        var posX =290;
        var posY =380;
        var gap = 80;
        for (var i=0;i<3;i++){
            var btn = this.createControlSwitch(posX,posY-gap*i,1000+i);
            btn.addTargetWithActionForControlEvents(this,this.btnMusicSetting,cc.CONTROL_EVENT_VALUECHANGED);
            node.addChild(btn);
            var status = common.soundManage.getMusicSettingStatus(i) ;
            btn.setOn((status == 0)? false:true) ;
        }

        //2000,2001,2002 方言&震动&静音启动
        posX = 790 ;
        posY = 380 ;
        for (var i=0;i<3;i++){
            var btn = this.createControlSwitch(posX,posY-gap*i,2000+i);
            btn.addTargetWithActionForControlEvents(this,this.btnGameSetting,cc.CONTROL_EVENT_VALUECHANGED);
            node.addChild(btn);
            var status = common.soundManage.getGameSettingStatus(i) ;
            btn.setOn((status == 0)? false:true) ;
        }


        this.addChild(root);

        return true;
    },

    /**
     * 1000,1001,1002,1003  对应音乐&音效&语音&震动
     * @param sender
     * @param controlEvent
     */
    btnMusicSetting:function (sender,controlEvent){
        var tag = sender.getTag() - 1000;
        var isOn = sender.isOn() ;
        common.soundManage.setMusicSettingStatus(isOn,tag);

    },

    /**
     * 2000,2001,2002 对应方言&单击出牌&静音启动
     * @param sender
     * @param controlEvent
     */
    btnGameSetting:function(sender,controlEvent){
        console.log(" sender.getTag() ,",sender.getTag());
        var tag = sender.getTag() - 2000;
        var isOn = sender.isOn() ;
        common.soundManage.setGameSettingStatus(isOn,tag);
    },

    btnLogoutClicked:function(sender,touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        var params={
            desc:common.TipsDesc.AreYouSureLoginOut,
            close:false,
            isLoading:true,
            confirm:function () {
                console.log(" logout ...........");
                net.NetManage.logOut() ;
            },
            cancel:function () {
                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                game.Notification.send(common.NotifyType.SHOW_SETTING_PANEL);
            }
        };
        game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
    },

    createControlSwitch:function(posX,posY,tag){
        var switchBtn=new cc.ControlSwitch
        (
            new cc.Sprite(res.music_base_png),
            new cc.Sprite(res.music_open_png),
            new cc.Sprite(res.music_close_png),
            new cc.Sprite(res.music_btn_png),
            new cc.Sprite(res.word_open_png),
            new cc.Sprite(res.word_close_png)
        );
        switchBtn.setPosition(posX,posY);
        switchBtn.setTag(tag);
        return switchBtn;
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }
});