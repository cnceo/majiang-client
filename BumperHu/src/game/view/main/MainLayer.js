main.MainScene = game.IScene.extend({
	ctor:function (){
		this._super();
	},
});

main.MainLayer = game.IView.extend({
	_tf:null,
	uiHelper:null,
    clipper:null,
    lable:null,
	_labelNickname:null,
	_labelPlayerId:null,
	_labelRoomCard:null,
	_imgHeadPic:null,
    _panelPersonalInfo:null,
    _labelAddress:null,
    _userInfo:null,
    _btnIdentify:null,
    _imgIdentify:null,
    _nickName:null,
    _curRoomNo:null,
    _lat:null,
    _lng:null,
    _audioTaken:null,
    _btnCreateRoom:null ,
    _address:null,
    _imgNotice:null,
    _noticeObj:[],
    _countNotice:0 ,
	ctor:function () {
		this._super();
		this._noticeObj = [] ;
		var size = cc.winSize;
		this.uiHelper = new game.UIHelper();
		var root = this.uiHelper.doLayout(res.Mian_json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);

        var node = ccui.helper.seekWidgetByName(root, "ImgBackground");
        this._btnCreateRoom = ccui.helper.seekWidgetByName(node, "ButtonCreateRoom") ;
        this._btnCreateRoom.addTouchEventListener(this.btnCreatedForClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonJoinRoom").addTouchEventListener(this.btnJoinRoomClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonCreated").addTouchEventListener(this.btnCreatedRoomClicked,this) ;

        this._btnIdentify=ccui.helper.seekWidgetByName(node, "ButtonIdentufy");
        this._btnIdentify.addTouchEventListener(this.btnIdentifyClicked,this) ;
        this._imgIdentify=ccui.helper.seekWidgetByName(node, "ImageViewIdentify");

        ccui.helper.seekWidgetByName(node, "ButtonSetting").addTouchEventListener(this.btnSettingClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonHelp").addTouchEventListener(this.btnHelpClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonAchieve").addTouchEventListener(this.btnAchieveClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonMail").addTouchEventListener(this.btnMailClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonShop").addTouchEventListener(this.btnShopClicked,this) ;
        ccui.helper.seekWidgetByName(node, "ButtonAddRoomCard").addTouchEventListener(this.btnShopClicked,this) ;
        ccui.helper.seekWidgetByName(node, "Buttonshare").addTouchEventListener(this.btnShareClicked,this) ;

        var bgImgUser = ccui.helper.seekWidgetByName(node,"Imguserheadimgbg") ;
        bgImgUser.setTouchEnabled(true );
        bgImgUser.addTouchEventListener(this.showUserInfo,this);

        this._panelPersonalInfo = ccui.helper.seekWidgetByName(node,"PanelUserInfo");
        this._panelPersonalInfo.setVisible(false) ;
        this._panelPersonalInfo.setTouchEnabled(true);
        this._panelPersonalInfo.addTouchEventListener(function(sender,type){
            if (type == ccui.Widget.TOUCH_ENDED){
                    sender.setVisible(false) ;
            }
        },this) ;

        var imgPersonalInfo=ccui.helper.seekWidgetByName(this._panelPersonalInfo,"ImgBgUserInfo");
        imgPersonalInfo.setTouchEnabled(true);
        imgPersonalInfo.addTouchEventListener(function (sender,type) {
        },this);

        var imgTop = ccui.helper.seekWidgetByName(node, "ImgTop");
        this._labelNickname = ccui.helper.seekWidgetByName(imgTop, "LabelNickname");
        this._labelPlayerId = ccui.helper.seekWidgetByName(imgTop, "LabelUserID");
        this._labelRoomCard = ccui.helper.seekWidgetByName(imgTop, "LabelRoomCard");
        this._imgHeadPic = ccui.helper.seekWidgetByName(imgTop, "ImgHeadPic");

        this._userInfo = game.LocalData.getUserInfo();

        if(this._userInfo.realName==null && this._userInfo.IDNo==null){
            this._imgIdentify.setVisible(false);
            this._btnIdentify.setVisible(true);
        }else{
            this._imgIdentify.setVisible(true);
            this._btnIdentify.setVisible(false);
        }
        this._imgNotice = ccui.helper.seekWidgetByName(node,"ImgNotice") ;
        var desc = "亲爱的玩家，欢迎来到 碰碰湖 祝您游戏愉快";
        var labelDesc =new cc.LabelTTF(desc,"Arial",30,cc.size(400,260),cc.TEXT_ALIGNMENT_CENTER,cc.TEXT_ALIGNMENT_CENTER);
        labelDesc.anchorX = 0.5 ;
        labelDesc.anchorY = 0.5 ;
        labelDesc.setPosition(cc.p(this._imgNotice.getContentSize().width/2,this._imgNotice.getContentSize().height/2)) ;
        this._imgNotice.addChild(labelDesc,1,100);

        console.log(" user Info..............");
        console.log(this._userInfo);
        if (this._userInfo.hasOwnProperty("notice") && !_.isEmpty(this._noticeObj)){
            this._noticeObj = this._userInfo.notice ;
            labelDesc.setString(this._noticeObj[0].content) ;
            this.schedule(this.carouselNotice,3) ;
        }

        this._nickName=this._userInfo.nickname;
        if(this._userInfo.nickname.length>6){
            this._nickName=this._userInfo.nickname.substring(0,6)+"...";
        }
        this._labelNickname.setString(this._nickName) ;
        this._labelRoomCard.setString(this._userInfo.roomCard);
        this._labelPlayerId.setString("ID:"+this._userInfo.id);

        this._audioTaken=this._userInfo.xfToken;
        this.loadHeadPic(this._imgHeadPic,this._userInfo ,common.ClipType.Circle) ;
        this.addChild(root);
        common.soundManage.playBackground(voiceRes.music_login_ogg) ;

        //获取经纬度
        if (cc.sys.os==cc.sys.OS_ANDROID){
            this._lat=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getLat","()Ljava/lang/String;");
            this._lng=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getLng","()Ljava/lang/String;");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("ZYLocationManager", "getCurrentLocation");
        }

        // //初始化登录科大讯飞语音
        // if(cc.sys.os==cc.sys.OS_ANDROID){
        //     console.log("-------登录-----");
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/App","initIMClient","(Ljava/lang/String;)V",this._audioTaken);
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager","audioLogin","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",(this._userInfo._id).toString(),this._labelNickname.getString(),this._audioTaken,(this._userInfo.headimgurl).toString());
        // } else if (cc.sys.os == cc.sys.OS_IOS) {
        //     jsb.reflection.callStaticMethod("IFlyManager", "iflyLoginWithUserId:nickName:userToken:", (this._userInfo._id).toString(),this._labelNickname.getString(),this._audioTaken);
        // }

        this.subscrib();
        this.updateBtnCreateRoom() ;
        return true;
	},

    carouselNotice:function(){
        this._countNotice++ ;
        if (this._countNotice>= this._noticeObj.length){
            this._countNotice = 0 ;
        }
        var labelDesc = this._imgNotice.getChildByTag(100) ;
        labelDesc.setString(this._noticeObj[this._countNotice].content);
    },
    /*iOS经纬度回调*/
    getLocaionFromiOS:function(location) {
        if (location.indexOf(",") > 0) {
            var arr = location.split(",");
            this._lng = arr[0];
            this._lat = arr[1];
            game.LocalData.setLatitude(this._lat);
            game.LocalData.setLongtitude(this._lng);

            console.log("===main layer=== lng lat ==="+this._lng+"==="+this._lat);
            jsb.reflection.callStaticMethod("ZYLocationManager", "getAddressWithLatitude:longtitude:",this._lat,this._lng);
        }
    },
    /**
     * 根据当前是否在有已经进入的房间来显示创建房间&返回房间
     */
    updateBtnCreateRoom:function(){
        this._curRoomNo = game.LocalData.getCurRoomNo();
        console.log(" this._curRoomNo ",this._curRoomNo);
        var imgWord = ccui.helper.seekWidgetByName(this._btnCreateRoom,"ImageView") ;
        if (this._curRoomNo == null){
            imgWord.loadTexture("res/ui/word/word_lobby_creatroom.png") ;
        }else{
            imgWord.loadTexture("res/ui/word/word_backtoroom.png") ;
        }
    },

    showUserInfo:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        console.log("showUserInfo .......... ");
        this._panelPersonalInfo.setVisible(true);
        ccui.helper.seekWidgetByName(this._panelPersonalInfo,"LabelNickname").setString(this._nickName);
        ccui.helper.seekWidgetByName(this._panelPersonalInfo,"LabelPlayerId").setString("ID:"+this._userInfo.id);
        ccui.helper.seekWidgetByName(this._panelPersonalInfo,"LabelRoomCard").setString("房卡:"+this._userInfo.roomCard);
        ccui.helper.seekWidgetByName(this._panelPersonalInfo,"LabelIP").setString("IP:"+this._userInfo.ipaddress);
        this._labelAddress = ccui.helper.seekWidgetByName(this._panelPersonalInfo,"LabelAddress");
        var imgHeadPic = ccui.helper.seekWidgetByName(this._panelPersonalInfo,"ImgHeadPicInner");
        imgHeadPic.removeAllChildren() ;
        this.loadHeadPic(imgHeadPic,this._userInfo,common.ClipType.Rectangle) ;
        var imgSex = ccui.helper.seekWidgetByName(this._panelPersonalInfo,"ImgSex");
        if (this._userInfo.sex == 1){
            imgSex.loadTexture(res.icon_man_info_png);
        }else{
            imgSex.loadTexture(res.icon_woman_info_png);
        }

        if (cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","SetLatLng","(Ljava/lang/String;Ljava/lang/String;)V",this._lat,this._lng);
            this.schedule(this.getPlayerAddress,0.1)
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this._lat = game.LocalData.getLatitude();
            this._lng = game.LocalData.getLongtitude();
            console.log("===iOS lat lng ===" + this._lat +"===" + this._lng);
            this._address = game.LocalData.getAddress();
            console.log("==this.address==" + this._address);
            this._labelAddress.setString(this._address);
        } else{
        }
    },

    getAddressFromiOS:function(address) {
        console.log("==getAddressFromiOS==="+ address);
        game.LocalData.setAddress(address);
    },

    getPlayerAddress:function(){
        if (cc.sys.os == cc.sys.OS_ANDROID){
            var address=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getAddressForCoor","()Ljava/lang/String;");
            if (address!=null){
                var index=address.indexOf("省");
                if(index!=-1){
                    var clipAddress=address.substring(index);
                    var enterString=clipAddress;
                    if(clipAddress.length>9){
                        enterString=clipAddress.substring(1,9)+"\n"+clipAddress.substring(9,clipAddress.length);
                    }
                    this._labelAddress.setString(enterString) ;
                    this.unschedule(this.getPlayerAddress) ;
                }else{
                    var enterStringNo=address;
                    if(address.length>9){
                        enterStringNo=address.substring(0,9)+"\n"+address.substring(9,address.length);
                    }
                    this._labelAddress.setString(enterStringNo) ;
                    this.unschedule(this.getPlayerAddress) ;
                }
            }else{
                this._labelAddress.setString("未获取") ;
                this.unschedule(this.getPlayerAddress) ;
            }
        }
    },

    testGoToLobby:function(){
	  console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk");
    },
    //加入房间
    btnJoinRoomClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.SHOW_JOIN_ROOM_PANEL);
        return;
    },

    //已开房间
    btnCreatedRoomClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        net.NetManage.getUserRoomList();
    },

    /**
     * 创建房间按钮  如果当前已经有进入的房间，则直接进入  否则进入
     * @param sender
     * @param type
     */
    btnCreatedForClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        if (this._curRoomNo == null){
            net.NetManage.getRoomConfigRoute();//从服务器获取房间的配置信息
        }else{
            var params = {roomNo:this._curRoomNo};
            net.NetManage.entryRoom(params) ;
        }
    },

    btnShopClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.SHOW_SHOP_PANEL);
    },

    btnMailClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.showLoadingCircle();
        net.NetManage.getMails();
    },

    btnAchieveClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        net.NetManage.getGameResultList();
    },

    btnHelpClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.SHOW_HELP_PANEL);
    },

    btnSettingClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.SHOW_SETTING_PANEL);
    },
    btnShareClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        var obj={title:"碰碰湖",desc:"快来玩呀"};
        this.send(common.NotifyType.SHOW_SHARE_PANEL,obj);
    },

    btnIdentifyClicked:function (sender, type) {
        if(type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.SHOW_IDENTIFY_PANEL);
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this.unsubscrib();
        this._super();
    },

    realNameVerify:function (obj,target) {
        target._imgIdentify.setVisible(true);
        target._btnIdentify.setVisible(false);
    },

    /**
     * 监听牌局结束的事件
     * @param obj
     * @param target
     */
    onRoundOver:function(obj,target){
        game.LocalData.setCurRoomNo(null) ;
        target.updateBtnCreateRoom();
    },

    /**
     * 监听房间解散的时间
     * @param obj
     * @param target
     */
    onRoomDissolve:function (obj,target) {
        console.log("onRoomDissolve ........... ");
        game.LocalData.setCurRoomNo(null) ;
        target.updateBtnCreateRoom();
    },

    subscrib:function () {
        game.Notification.subscrib(common.NotifyType.REAL_NAME_VERIFY_INFO,this.realNameVerify,this);
        game.Notification.subscrib(common.NotifyType.ON_ROUND_OVER,this.onRoundOver,this);
        game.Notification.subscrib(common.NotifyType.ON_ROOM_DISSOLVE,this.onRoomDissolve,this);
        game.Notification.subscrib(common.NotifyType.IOS_GET_LOCATION_SUCCESS,this.getLocaionFromiOS,this);
        game.Notification.subscrib(common.NotifyType.IOS_GET_ADDRESS_SUCCESS,this.getAddressFromiOS,this) ;
    },
    unsubscrib:function () {
        game.Notification.unsubscrib(common.NotifyType.REAL_NAME_VERIFY_INFO,this.realNameVerify,this);
        game.Notification.unsubscrib(common.NotifyType.ON_ROUND_OVER,this.onRoundOver,this);
        game.Notification.unsubscrib(common.NotifyType.ON_ROOM_DISSOLVE,this.onRoomDissolve,this);
        game.Notification.unsubscrib(common.NotifyType.IOS_GET_LOCATION_SUCCESS,this.getLocaionFromiOS,this);
        game.Notification.unsubscrib(common.NotifyType.IOS_GET_ADDRESS_SUCCESS,this.getAddressFromiOS,this) ;
    }
});


