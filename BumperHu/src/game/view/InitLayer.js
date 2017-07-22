init.InitScene = game.IScene.extend({
	ctor:function (){
		this._super();
		game.log("init scene!!!!!!!!!");
	}
});

init.InitLayer = game.IView.extend({
    _btnLogin:null,
    _checkBox:null,
    _loadingBar:null,
    _loadingBarBg:null,
    uiHelper:null,
    _code:null,
    _lat:null,
    _lng:null,
    _imgAgreement:null,
    _isShowAgree:false ,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        console.log("login.LoginLayer  size " + size);
        this.uiHelper = new game.UIHelper();
        var node = this.uiHelper.doLayout(res.Login_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);
        node.setTouchEnabled(true);
        node.addTouchEventListener(this.closeAgreement,this);
        common.soundManage.playBackground(voiceRes.music_login_ogg) ;

        this._btnLogin = ccui.helper.seekWidgetByName(node, "ButtonLogin");
        this._btnLogin.addTouchEventListener(this.btnLoginClicked,this) ;
        this._btnLogin.setVisible(false);

        this._checkBox = ccui.helper.seekWidgetByName(node, "CheckBox");
        this._checkBox.setVisible(false);

        this._loadingBarBg = ccui.helper.seekWidgetByName(node, "LoadingBarBg");
        this._loadingBar = ccui.helper.seekWidgetByName(node, "LoadingBar");
        this._loadingBar.setPercent(0) ;

        this.addChild(node);

        this._imgAgreement = ccui.helper.seekWidgetByName(node,"ImgAgreementBg") ;
        this._imgAgreement.setVisible(false) ;
        this._imgAgreement.zIndex = 100 ;

        var btnShowAgreement = ccui.helper.seekWidgetByName(node,"ImageViewUser") ;
        btnShowAgreement.setTouchEnabled(true) ;
        btnShowAgreement.addTouchEventListener(this.showAgreement,this) ;

        // 添加测试账号  不用的时候注释掉  start
        var btnTestLogin = ccui.helper.seekWidgetByName(node, "ButtonTestLogin");
        btnTestLogin.setVisible(false) ;
        var pos = btnTestLogin.getPosition() ;
        for (var i=1;i<=8;i++){  //1~8
            var btn =btnTestLogin.clone() ;
            btn.addTouchEventListener(this.testLoginToo,this) ;
            btn.setTouchEnabled(true) ;
            btn.setVisible(true) ;
            btn.setTag(i) ;
            ccui.helper.seekWidgetByName(btn, "Label").setString(i) ;
            var posX = pos.x + Math.floor((i-1)/4) * 200 ;
            var posY = pos.y - ((i-1)%4) * 80 ;
            btn.setPosition(posX,posY) ;
            node.addChild(btn);
        }

        for (var i =1 ;i<=8;i++){//11111~888888
            var btn =btnTestLogin.clone() ;
            btn.addTouchEventListener(this.testLogin,this) ;
            btn.setTouchEnabled(true) ;
            btn.setVisible(true) ;
            btn.setTag(i) ;
            ccui.helper.seekWidgetByName(btn, "Label").setString(i*11111111) ;
            var posX =  pos.x + Math.floor((i-1)/4) * 200 ;
            var posY = pos.y - ((i-1)%4) * 80 - 400 ;
            btn.setPosition(cc.p(posX,posY)) ;
            node.addChild(btn);
        }

        for (var i =1 ;i<=8;i++){//21~28
            var btn =btnTestLogin.clone() ;
            btn.addTouchEventListener(this.testLoginToo,this) ;
            btn.setTouchEnabled(true) ;
            btn.setVisible(true) ;
            btn.setTag(i+20) ;
            ccui.helper.seekWidgetByName(btn, "Label").setString(i+20) ;
            var posX =  pos.x + Math.floor((i-1)/4) * 200 + 1200 ;
            var posY = pos.y - ((i-1)%4) * 80 ;
            btn.setPosition(cc.p(posX,posY)) ;
            node.addChild(btn);
        }
        //添加测试账号 end

        if (cc.sys.os==cc.sys.OS_ANDROID){
            this._lat=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getLat","()Ljava/lang/String;");
            this._lng=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getLng","()Ljava/lang/String;");
        }  else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("ZYLocationManager", "getCurrentLocation");
        }
        this.scheduleOnce(this.loadResource,0.1);
        return true;
    },
    //显示用户协议
    showAgreement:function(){
        this._imgAgreement.setVisible(true) ;
        if (this._isShowAgree == true){
            return ;
        }
        this._isShowAgree = true ;
        var scrollView = ccui.helper.seekWidgetByName(this._imgAgreement,"ScrollViewAgreemnt") ;
        var scSize = scrollView.getContentSize();
        var label = new cc.LabelTTF(common.Agreement,"Arial",30);
        label.setColor(cc.color(0, 0, 0, 255));
        label.anchorX = 0.5 ;
        label.anchorY = 1;
        var height = 5250 ;
        label.setPosition(cc.p(scSize.width/2,height)) ;
        label.setDimensions(cc.size(scSize.width,height));
        scrollView.addChild(label);

        console.log(" label size  ",label.getContentSize());
        scrollView.setInnerContainerSize(cc.size(scSize.width,height));

    },

    closeAgreement:function(){
        this._imgAgreement.setVisible(false);
    },

    /*iOS经纬度回调*/
    getLocaionFromiOS:function(location) {
        if (location.indexOf(",") > 0) {
            var arr = location.split(",");
            this._lng = arr[0];
            this._lat = arr[1];
            console.log("===init layer=== lng lat ==="+this._lng+"==="+this._lat);
        }
    },

    loadResource:function(){
        var self = this ;
        var count = 0 ;
        var total = voiceArr.length ;
        // console.log(" total total ",total);
        // cc.loader.load(voiceArr,function(res){
        //     count++;
        //     self._loadingBar.setPercent(Math.ceil(count *100 / total));
        // },function(){
            self.loadingFinish();
        // });/
    },

    testLogin:function(sender, type){
       // if(sender.getTag() == 7) {
       //      jsb.reflection.callStaticMethod("WeChatHelper", "postNotify");
       //      return;
       //  }

        if (type != ccui.Widget.TOUCH_ENDED)return;
        this.showLoadingCircle();
        var id =sender.getTag() * 11111111;
        var params = {
            openid: id,
            //openid: 11111111,
            token: id,
            //token: 11111111,
            latitude: 1,
            longitude: 1
        };
        net.NetManage.login(params);
    },

    testLoginToo:function(sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)return;
        this.showLoadingCircle();
        var id =sender.getTag() * 11111111;
        var params = {
            openid: id,
            //openid: 11111111,
            token: id,
            //token: 11111111,
            latitude: 1,
            longitude: 1
        };
        net.NetManage.login(params);
    },

    btnLoginClicked:function(sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)return;
        this.showLoadingCircle();
        this.subscrib();
        var isAgree = this._checkBox.isSelected();
        if (isAgree == false) {
            var params = {
                desc: common.TipsDesc.ChooseAgreement,
                close: false,
                confirmOnly: function () {
                    game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                }
            };
            this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
        } else {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                console.log(" ===Access token .. "+cc.sys.localStorage.getItem("ACCESS_TOKEN"));
                console.log(" ===Access openId .. "+cc.sys.localStorage.getItem("OPENID"));
                if (!cc.sys.localStorage.getItem("ACCESS_TOKEN") || !cc.sys.localStorage.getItem("OPENID")) {//第一次登录
                    var isInstall=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "heaveWeChat", "()I");
                    if(isInstall==0){
                        var params = {
                            desc: common.TipsDesc.WeChatNotInstalled,
                            close: false,
                            confirmOnly: function () {
                                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                            }
                        };
                        this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
                    }else{
                        this.scheduleOnce(this.getTokenAndOpenid, 2);
                    }
                }else{
                    var token = cc.sys.localStorage.getItem("ACCESS_TOKEN");
                    var openid = cc.sys.localStorage.getItem("OPENID");
                    console.log("---init-->",openid);
                    var params = {
                        openid: openid,
                        token: token,
                        latitude: this._lat,
                        longitude: this._lng
                    };
                    console.log(" before login ... ",params );
                    net.NetManage.login(params);
                }
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                console.log(" ===Access token .. "+cc.sys.localStorage.getItem("ACCESS_TOKEN"));
                console.log(" ===Access openId .. "+cc.sys.localStorage.getItem("OPENID"));
                if (!cc.sys.localStorage.getItem("ACCESS_TOKEN") || !cc.sys.localStorage.getItem("OPENID")) {//第一次登录
                    var isInstall=jsb.reflection.callStaticMethod("WeChatHelper", "checkIsWXAppInstalled");
                    if(isInstall==0){
                        var params = {
                            desc: common.TipsDesc.WeChatNotInstalled,
                            close: false,
                            confirmOnly: function () {
                                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                            }
                        };
                        this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
                    }else{
                        jsb.reflection.callStaticMethod("WeChatHelper", "wechatLogin");
                    }
                }else{
                    var token = cc.sys.localStorage.getItem("ACCESS_TOKEN");
                    var openid = cc.sys.localStorage.getItem("OPENID");
                    console.log("---init-->",openid);
                    var params = {
                        openid: openid,
                        token: token,
                        latitude: this._lat,
                        longitude: this._lng
                    };
                    console.log(" before login ... ",params );
                    net.NetManage.login(params);
                }
            }

         }
    },

    loadingFinish:function(){
        this._btnLogin.setVisible(true) ;
        this._checkBox.setVisible(true) ;
        this._loadingBar.setVisible(false);
        this._loadingBarBg.setVisible(false);
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this.unsubscrib();
        this._super();
    },

    getTokenAndOpenid:function () {
        if(cc.sys.os==cc.sys.OS_ANDROID){
            this._code=jsb.reflection.callStaticMethod("com/elepok/BumperHu/wxapi/WXEntryActivity","getCode","()Ljava/lang/String;");
            console.log("getTokenAndOpenid this._code ",this._code);
            if(this._code!=""&& this._code!=null && this._code!=undefined && this._code!="undefined"){
                console.log("-getTokenAndOpenid---js--t----->"+this._code );
                this.unschedule(this.getTokenAndOpenid);
                net.NetManage.httpGetRequest(this._code) ;
            }else{
                console.log(" getTokenAndOpenid ....",this._code);
                this.schedule(this.getTokenAndOpenid,0.1) ;
                // this.scheduleOnce(this.getTokenAndOpenid,0.1) ;
            }
        }
    },


    getCodeFromiOS:function(code) {
        this._code = code;
        if(this._code!=""&& this._code!=null && this._code!=undefined && this._code!="undefined"){
            console.log("-getCodeFromiOS---js--t----->"+this._code );
            net.NetManage.httpGetRequest(this._code) ;
        }
    },

    /**
     * 微信登录跟服务器校验成功  然后调用登录的接口
     * @param obj
     * @param target
     */
    weChatCheckSuccess:function(obj,target){
        console.log("-------weChatCheckSuccess---------->");
        var openId = obj.openid ;
        var token = obj.token ;
        console.log("-------weChatCheckSuccess---------->",openId);
        var params = {
            openid: openId,
            token: token,
            latitude: target._lat,
            longitude: target._lng
        };
        net.NetManage.login(params);
    },

    /**
     * 校验失败  可能是token过期了或者别的原因
     * 先当做过期处理  重新去授权
     */
    weChatCheckFailed:function(obj,target){
        if(cc.sys.os==cc.sys.OS_ANDROID) {
            var isInstall = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "heaveWeChat", "()I");
            if (isInstall == 0) {
                var params = {
                    desc: common.TipsDesc.WeChatNotInstalled,
                    close: false,
                    confirmOnly: function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
            } else {
                target.scheduleOnce(target.getTokenAndOpenid, 2);
            }
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var isInstall=jsb.reflection.callStaticMethod("WeChatHelper", "checkIsWXAppInstalled");
            if(isInstall==0){
                var params = {
                    desc: common.TipsDesc.WeChatNotInstalled,
                    close: false,
                    confirmOnly: function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
            }else{
                jsb.reflection.callStaticMethod("WeChatHelper", "wechatLogin");
            }
        }
    },


    subscrib:function() {
        console.log("---------subscrib-------");
        game.Notification.subscrib(common.NotifyType.WECHAT_CHECk_SUCCESS, this.weChatCheckSuccess, this);
        game.Notification.subscrib(common.NotifyType.WECHAT_CHECk_FAILED, this.weChatCheckFailed, this);
        game.Notification.subscrib(common.NotifyType.WECHAT_GET_CODE_SUCCESS, this.getCodeFromiOS, this);
        game.Notification.subscrib(common.NotifyType.IOS_GET_LOCATION_SUCCESS,this.getLocaionFromiOS,this);
    },
    unsubscrib:function() {
        game.Notification.unsubscrib(common.NotifyType.WECHAT_CHECk_SUCCESS, this.weChatCheckSuccess, this);
        game.Notification.unsubscrib(common.NotifyType.WECHAT_CHECk_FAILED, this.weChatCheckFailed, this);
        game.Notification.unsubscrib(common.NotifyType.WECHAT_GET_CODE_SUCCESS, this.getCodeFromiOS, this);
        game.Notification.unsubscrib(common.NotifyType.IOS_GET_LOCATION_SUCCESS,this.getLocaionFromiOS,this);
    }
});
