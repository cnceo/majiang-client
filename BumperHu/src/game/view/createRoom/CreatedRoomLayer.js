
var OPEN_TYPE = ['Created','CreatedFor'];

//已开房间
main.CreatedRoomLayer = game.IView.extend({
    uiHelper:null,
    _scrollView:null,
    _item:null,
    _btnCreated:null,
    _btnCreatedFor:null,
    _curLeftBtn:null,
    _noData:null,

    _createdFor:[],
    _created:[],
    _selectedRoomNo:null,

    ctor:function (obj) {
        this._super();

        var size = cc.winSize;

        this._created.splice(0,this._created.length);
        this._createdFor.splice(0,this._createdFor.length);

        this.uiHelper =  new game.UIHelper();
        var root = this.uiHelper.doLayout(res.CreatedRoom_json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);
        var node = ccui.helper.seekWidgetByName(root,"ImgBackground");


        this._noData=ccui.helper.seekWidgetByName(root,"ImageViewNoData");
        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_CREATED_ROOM_PANEL ;
        btnClose.callFunc = function(){
            this._created.splice(0,this._created.length);
            this._createdFor.splice(0,this._createdFor.length);
        }.bind(this) ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        this._scrollView = ccui.helper.seekWidgetByName(node,"ScrollView");
        this._scrollView.setTouchEnabled(true);
        this._scrollView.setBounceEnabled(true);
        this._scrollView.setInertiaScrollEnabled(true);
        this._item = ccui.helper.seekWidgetByName(root,"ImgItem");

        console.log(obj);

        for (var i=0;i<obj.length;i++){
            if(obj[i].roomType==1 || obj[i].roomType==3){
                this._created.push(obj[i]);
            }else if(obj[i].roomType==2){
                this._createdFor.push(obj[i]);
            }
        }

        for (var i=0;i<OPEN_TYPE.length;i++){
            var btn = ccui.helper.seekWidgetByName(node,"CheckBox"+OPEN_TYPE[i]);
            btn.openType=i;
            btn.setTouchEnabled(true);
            btn.addEventListener(this.CheckBoxOpenClicked,this) ;
            if (i==0){
                btn.setSelected(true);
                btn.setTouchEnabled(false);
                this._curLeftBtn = btn;
                this.refreshCreatedScrollView();
            }
        }
        this.addChild(root);
        return true;
    },


    refreshCreatedScrollView:function(){
        this._scrollView.removeAllChildren();
        if(this._created.length==0){
            this._noData.setVisible(true);
        }
        var sizeWidth=this._scrollView.getContentSize().width;
        var sizeHeight=this._scrollView.getContentSize().height;
        var itemAmount=this._created.length;
        var height=this._item.getContentSize().height+5;
        this._scrollView.setInnerContainerSize(cc.size(sizeWidth,height*itemAmount));
        var newSizeHeight=this._scrollView.getInnerContainer().height;
        var finalSizeHeight=(newSizeHeight < sizeHeight)? sizeHeight : newSizeHeight;


        for (var i=0;i<itemAmount;i++) {
            var item = this._item.clone();
            item.setTouchEnabled(true);
            item.addTouchEventListener(this.btnItemClicked, this);
            item.setPosition(sizeWidth / 2, finalSizeHeight - height*i  - height/2);
            this._scrollView.addChild(item);

            var labelRoomNo = ccui.helper.seekWidgetByName(item, "LabelRoomNo");//房间号
            var labelRound = ccui.helper.seekWidgetByName(item, "LabelRound");//局数
            var labelWinCondition = ccui.helper.seekWidgetByName(item, "LabelWinCondition"); //起胡
            var labelWinTop = ccui.helper.seekWidgetByName(item, "LabelWinTop"); //封顶
            var labelCreateTime = ccui.helper.seekWidgetByName(item, "LabelCreateTime"); //创建时间
            var btnInvite = ccui.helper.seekWidgetByName(item, "ButtonInvite"); //邀请
            var btnDismiss = ccui.helper.seekWidgetByName(item, "ButtonDismiss"); //解散
            btnInvite.setTag(i);
            btnDismiss.setTag(i);

            labelRoomNo.setString(this._created[i].roomNo);
            labelRound.setString(this._created[i].data.configure.roundCount);
            labelWinCondition.setString(this._created[i].data.configure.huCount+"倍起胡");
            labelWinTop.setString(this._created[i].data.configure.maxHuCount+"倍封顶");
            var time = this._created[i].createTime.substr(0,10)+"\n"+" "+this._created[i].createTime.substr(11,8);
            labelCreateTime.setString(time);

            btnDismiss.setTouchEnabled(true);
            btnDismiss.addTouchEventListener(this.btnCreatedDissolvedClicked,this);
            btnInvite.setTouchEnabled(true);
            btnInvite.addTouchEventListener(this.btnCreatedInvitationClicked,this);

            this._noData.setVisible(false);
        }
    },

    refreshCreatedForScrollView:function () {
        this._scrollView.removeAllChildren();
        if(this._createdFor.length==0){
            this._noData.setVisible(true);
        }
        var sizeWidth=this._scrollView.getContentSize().width;
        var sizeHeight=this._scrollView.getContentSize().height;
        var itemAmount=this._createdFor.length;
        var height=this._item.getContentSize().height+5;
        this._scrollView.setInnerContainerSize(cc.size(sizeWidth,height*itemAmount));
        var newSizeHeight=this._scrollView.getInnerContainer().height;
        var finalSizeHeight=(newSizeHeight < sizeHeight)? sizeHeight : newSizeHeight;

        for (var i=0;i<itemAmount;i++) {
            var item = this._item.clone();
            item.setTouchEnabled(true);
            item.addTouchEventListener(this.btnItemClicked, this);
            item.setPosition(sizeWidth / 2, finalSizeHeight-height*i - height / 2);
            this._scrollView.addChild(item);
            var labelRoomNo = ccui.helper.seekWidgetByName(item, "LabelRoomNo");//房间号
            var labelRound = ccui.helper.seekWidgetByName(item, "LabelRound");//局数
            var labelWinCondition = ccui.helper.seekWidgetByName(item, "LabelWinCondition"); //起胡
            var labelWinTop = ccui.helper.seekWidgetByName(item, "LabelWinTop"); //封顶
            var labelCreateTime = ccui.helper.seekWidgetByName(item, "LabelCreateTime"); //创建时间
            var btnInvite = ccui.helper.seekWidgetByName(item, "ButtonInvite"); //邀请
            var btnDismiss = ccui.helper.seekWidgetByName(item, "ButtonDismiss"); //解散
            btnInvite.setTag(i);
            btnDismiss.setTag(i);

            labelRoomNo.setString(this._createdFor[i].roomNo);
            labelRound.setString(this._createdFor[i].data.configure.roundCount);
            labelWinCondition.setString(this._createdFor[i].data.configure.huCount+"倍起胡");
            labelWinTop.setString(this._createdFor[i].data.configure.maxHuCount+"倍封顶");
            var time = this._createdFor[i].createTime.substr(0,10)+"\n"+" "+this._createdFor[i].createTime.substr(11,8);
            labelCreateTime.setString(time);

            btnDismiss.setTouchEnabled(true);
            btnDismiss.addTouchEventListener(this.btnCreatedForDissolvedClicked,this);
            btnInvite.setTouchEnabled(true);
            btnInvite.addTouchEventListener(this.btnCreatedForInvitationClicked,this);

            this._noData.setVisible(false);
        }
    },

    btnItemClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return ;
        console.log("---------btnScrollItemClicked ");
    },

    CheckBoxOpenClicked:function(sender,type) {
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            this.updateCurCheckOpen(sender);
            if(sender.openType==0){
                this.refreshCreatedScrollView();
            }else{
                this.refreshCreatedForScrollView();
            }
        }
    },

    updateCurCheckOpen:function(btn){
        if (this._curLeftBtn != btn){
            this._curLeftBtn.setTouchEnabled(true) ;
            this._curLeftBtn.setSelected(false);
            btn.setSelected(true) ;
            btn.setTouchEnabled(false) ;
            this._curLeftBtn = btn ;
        }
    },

    btnCreatedDissolvedClicked:function (sender,type) {
        var tag=sender.getTag();
        var selectedRoomNo=this._created[tag].roomNo;
        this._selectedRoomNo=selectedRoomNo;
        if(type == ccui.Widget.TOUCH_ENDED){
            var params={
                desc:common.TipsDesc.DissolutionRoom,
                close:false,
                confirm:function () {
                    //解散房间
                    var params={
                        roomNo:selectedRoomNo
                    };
                    net.NetManage.initiateDissolveRoom(params);
                    game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                },
                cancel:function () {
                    game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                }
            };
            this.send(common.NotifyType.SHOW_TIPS_PANEL,params);
        }

    },


    btnCreatedInvitationClicked:function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            console.log("---------btnInvitationClicked ");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendMsgToFriend", "(Ljava/lang/String;Ljava/lang/String;)V", "快来玩呀", "真好玩");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("WeChatHelper", "wechatShare:title:description:webpageUrl:", "1", "快来玩呀", "真好玩", "http://www.elepok.com/gameCenter.html");
            }
        }
    },

    btnCreatedForDissolvedClicked:function (sender,type) {
        var tag=sender.getTag();
        var selectedRoomNo=this._created[tag].roomNo;
        this._selectedRoomNo=selectedRoomNo;
        if(type == ccui.Widget.TOUCH_ENDED){
            var params={
                desc:common.TipsDesc.DissolutionRoom,
                close:false,
                confirm:function () {
                    //解散房间
                    var params={
                        roomNo:selectedRoomNo
                    };
                    net.NetManage.initiateDissolveRoom(params);
                    game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                },
                cancel:function () {
                    game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                }
            };
            this.send(common.NotifyType.SHOW_TIPS_PANEL,params);
        }

    },
    
    btnCreatedForInvitationClicked:function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            console.log("---------btnInvitationClicked ");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendMsgToFriend", "(Ljava/lang/String;Ljava/lang/String;)V", "快来玩呀", "真好玩");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("WeChatHelper", "wechatShare:title:description:webpageUrl:", "1", "快来玩呀", "真好玩", "http://www.elepok.com/gameCenter.html");
            }
        }
    },

    showPopupInfo:function (obj, target) {

    },
    dissolveRoom:function (obj, target) {
        console.log("-----------dissolveRoom------------");
        var params= {
            desc: common.TipsDesc.DissolvedRoom+this._selectedRoomNo,
            close: false,
            autoDispear: function () {
                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
            },
        };
        this.send(common.NotifyType.SHOW_TIPS_PANEL,params);
    },
    //确认解散
    onRoomDissolve:function (obj, target) {
        console.log("-----------onRoomDissolve------------");
        var params= {
            desc: common.TipsDesc.DissolvedRoom+this._selectedRoomNo,
            close: false,
            autoDispear: function () {
                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
            },
        };
        this.send(common.NotifyType.SHOW_TIPS_PANEL,params);
    },
    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    },
    subscrib:function() {
        game.Notification.subscrib(common.NotifyType.DISSOLVE_ROOM, this.dissolveRoom(), this);
        game.Notification.subscrib(common.NotifyType.SHOW_POPUP_MESSAGE,this.showPopupInfo,this);
        game.Notification.subscrib(common.NotifyType.ON_ROOM_DISSOLVE,this.onRoomDissolve,this) ;
    },

    unsubscrib:function() {
        game.Notification.unsubscrib(common.NotifyType.ON_ROOM_DISSOLVE,this.onRoomDissolve,this) ;
        game.Notification.unsubscrib(common.NotifyType.SHOW_POPUP_MESSAGE,this.showPopupInfo,this);
        game.Notification.unsubscrib(common.NotifyType.DISSOLVE_ROOM, this.dissolveRoom(), this);
    }
});