play.RunScene = game.IScene.extend({
	ctor:function (){
		this._super();
	}
});
// 1~9 11~19 21~29 字牌
//31~35 东南西北白    41 发  42 中
var CARD_NAME_BY_DIRECTION = ["l_out","d_out","r_out","d_out"];
var KONG_CARD_NAME_BY_DIRECTION = ["l_left","d_out","r_left","d_out"];
var GROUP_CARD_BY_IMAGE = ["l_left","d_left","r_left","d_out"];
var LIGHT_CARD_BY_IMAGE = ["l_left","d_light","r_left","u_light"] ;
var HAND_CARD_IMAGE = ["bei_l_hand.png","dd_hand1.png","bei_r_hand.png","bei_u_hand0.png"] ;
var ROUND_TIMER = 30;
var HAND_CARDS_NUMBER = 14;	//手牌14张  一张隐藏
var MY_DIRECTION = 1;
var TOTAL_CARDS_TYPE =  34;	//中共有34种牌
var EACH_HISTORY_LINE_CARDS = 10 ;  //存放打出去的牌
var CARD_IMAGE_PATH = "res/ui/mahjong/";
var CARD_LAI_ZI_IMAGE = "res/ui/mahjong/plane_";
var TOTAL_PLAYER_NUMBER = 4 ; //牌桌上玩家数量
var EACH_ROUND_ADD_CARDS = 4 ; //每轮新增的牌的数量
var RED_DRAGON = 42;   //红中
var GREEN_DRAGON = 41 ;   //发财
play.RunLayer = game.IView.extend({
    _curPlayType:0,
    _curSubPlayType:0,
    _isMessageShow:false ,
    _preCheck:null,
    _isSingleClick:false, //是否单击出牌
	_btnTrusteeship:null,
	_btnCancelTrusteeship:null,
	_btnWeChatInvite:null,
	_btnPrepare:null,
	_btnMenu:null,
	_btnRound:null, //局数
	_btnCloseMenu:null,
	_btnOperateWin:null,            //胡
	_btnOperateKong:null,           //杠
    _btnOperatePong:null,           //碰
    _btnOperateChow:null,           //吃
	_btnOperatePass:null,           //过
    _btnOperateShow :null,          //亮
    _btnOperateCancelBright :null,  //取消亮

    _btnLaizi:null,
	_btnChat:null,
	_btnWin:null,
	_btnSpeak:null,
	_btnEmoji:null,
	_btnText:null,
    _btnHelp:null,
    _btnDisband:null,//菜单中的
    _btnbackLobby:null,

    _btnOwnerDisband:null,//牌桌上的解散房间按钮
    _btnBackLobbyInTable:null,

    _labelAtlasCurRound:null,
    _labelAtlasTotalRound:null,

	_labelCurRound:null,
	_labelCurTime:null,
	_labelMahJongSurplus:null,
	_imgPopLaizi:null,
	_imgPopWinTip:null,
	_imgPopChat:null, //快速聊天的框
	_imgPopPersonalInfo:null,
	_imgWifiInfo:null,
	_imgMessageTips:null,
	_imgWordTips:null,
	_imgLaiZi:null,
	_imgMahjongModel:null,
	_imgChowBackground:null,
    _imgKongBackground:null,
    _imgCurOperateFlag:null,
    _imgEmoji:null,
    _imgText:null,
	_imgCancelVoice:null,
    _imgRecording:null,
    _loadingRecording:null,
	_imgWinItemArr:[],
	_loadingBarBatteryLevel:null,

    _panelCardsParent:[],  //手牌区
    _panelOutCardsParent:[], //打出去的牌
    _panelKongOutCardsParent:[],    //打出去的杠牌区
    _outSpriteByValue:{},
    _highLightValue:0 ,

    _panelChowGroup:[],
    _panelOutGroup:[],//用于放碰牌 吃牌 杠牌等
    _panelOutGroupArr:[],
    _panelKongArea:[],  //打出去的杠牌或者癞子的区域
    _panelDirection:null,
	_panelMenu:null,
	_curPopLayer:null,		//弹出层  显示一个弹出层时要把之前的弹出层关闭
    _panelWin:null,

	_timer:15,
	_labelTimer:null,
	_labelAddress:null ,
	_rootNode:null,

	_playerCardsValue:[],

	_tableDirection:[],	//那个方向的玩家操作
	_playerDiscard:[],	//玩家出牌

	_playerDiscardValue:[], //玩家打出去的牌值记录
	_playerDiscardNo:0,		//用户出的第几张牌

	_playerInfo:[],	//玩家信息——控件
    _playerData:[], //玩家数据（服务器数据）
	_flagCountTimes:0,	//发牌时用于记录发到第几圈
	_flagDirect:0, 	//方向标识
	_ClickedCardNo:-1,	//用户点击到的牌
	_myCardPositionY : 0,
	_lastClickedCards : null,
	_curPlayerDirect:0,
	_lastPlayerDirect:0 ,
	_kongValue:[], //杠牌&癞子
    _onlyKongValue:[],

	_totalRound:0,	//总共多少局
	_curRound:0,//当前第几局
    _curRoomNo:0,
    _gameData:{},
	_myInfo:{},
    _playerPlayOutMahjong:[],  //玩家打出去的牌
    _playerPlayOutKongMahjong:[],//玩家打出去的癞子&杠牌
    _playerNewMahjong:[], //玩家新抓起来的一张牌

    _playerCards:[],  //玩家手里的牌   用于显示在牌桌上的精灵
    _playerCardsPeng:[],
    _playerCardsGang:[],
    _playerCardsChow:[],
    _playerCardsOut:[] ,
    _playerCardsNew:[],  //玩家新抓起来的一张牌  当新起一张牌时显示在_playerCards右边  空一个拍

    _bankerSeat:-1,
	_laiZiValue:0,
	_surplusMahjong:0, //剩余牌数
    _surTotalMahjong:0,
    _playerMultiple:[],    //玩家番数
    _totalChowArr:[],
    _kongGroup:{},
    _isReLine:false, //标识是断线重连进来的
    _isGameStarted:false ,
    _windLoc:{},
	_tmpHeadImg:{}, //临时用的头像  之后删掉
    _startY : 0,
	_outMahjong:{},
    _valuePlayToTing:[],

	ctor:function (obj) {
        common.soundManage.playBackground(voiceRes.room_bg_sound_ogg) ;

        console.log("  run layer ",obj);

        this._super();
        var size = cc.winSize;
        this._isGameStarted = false ;
        this.uiHelper = new game.UIHelper();
        this._rootNode = this.uiHelper.doLayout(res.GameTable_json);
        this._rootNode.setAnchorPoint(cc.p(0.5,0.5));
        this._rootNode.setTouchEnabled(true);
        this._rootNode.addTouchEventListener(this.backgroundClicked,this);
        this._rootNode.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        this._rootNode.setContentSize(size);
        this._outSpriteByValue = {} ;
        this._isMessageShow = false ;
        this.addChild(this._rootNode);
        this.subscrib(); //注册消息
        this.initRoomData(obj);//初始化房间信息
        this.initPlayerInfo();
        this.initControl();
        this.initCards();
        this.updatePlayerStatus(MY_DIRECTION,this._playerData[MY_DIRECTION].status);

        this.handleReline();

        this.schedule(this.getSystemInfo,1) ;
        this.getMobileInfo();

		return true;
	},

    handleReline:function(){
        if (this._playerData[MY_DIRECTION].status == common.PlayerStatus.STATUS_IN_GAME){
            this._isGameStarted = true ;
            this._isReLine = true ;
            this._panelDirection.setVisible(true) ;
            this._btnPrepare.setVisible(false);
            this._imgWordTips.setVisible(false);
            if (this._curPopLayer!=null){
                this._curPopLayer.setVisible(false) ;
            }
            for (var i=0;i<4;i++){
                ccui.helper.seekWidgetByName(this._playerInfo[i], "ImgPrepareStatus").setVisible(false) ;
            }
            this.updateGameRoundInfo();
            this.initTableData();
            this.bankerConfirm();
            this.refreshUserCards() ;
            this._surplusMahjong =  this._gameData.mahjongCount ;
            var isMyPart =  (this._myInfo._id == this._gameData.currPlayUid) ;
            var self = this ;
            //处理玩家手里的牌
            var myData = this._playerData[MY_DIRECTION];
            var prePlayer = this._gameData.previousOut ;
            var preUid = null ;  //上一个出牌玩家的信息
            var preMahjong = null ;
            var preDir = null ;
            if (prePlayer == null){ //还没有人出过牌
                if (this._curPlayType == common.PlayType.HongHuang){
                    this.checkBrightMahjong();
                }
            }else{
                if (_.isEmpty(prePlayer)){
                    preUid = this._gameData.currPlayUid ;
                }else {
                    preUid = _.first(_.keys(prePlayer)) ;
                    preMahjong = _.first(_.values(prePlayer)) ;
                }
            }
            console.log(" this._kongValue " ,this._kongValue);
            var laizipi = this._gameData.laizipi ;
            for (var dir = 0;dir<common.TableDirection.length;dir++){
                var player = this._playerData[dir] ;
                var uid = player.uid ;
                if (uid == preUid && preUid !=null){
                    preDir = dir ;
                    if (preMahjong == null){
                        preMahjong = _.last(this._playerData[dir].playOutMahjong);
                    }
                }
                if (player.uid == this._gameData.currPlayUid){
                    this.showTableDirection(dir) ; //当前轮到谁出牌
                    if (dir == MY_DIRECTION){
                        this.enableClickMyCard();
                        this.checkplayToTing(dir) ;
                    }
                    if (this._playerNewMahjong[dir]  !=null){
                        this._playerCardsNew[dir].setVisible(true) ;
                    }
                }
                var funNum = player.funNum ;
                this.updatePlayerMultiple(dir,funNum) ;
                var len = player.mahjong.length ;
                if (len % 3 == 2){
                    len = len -1 ;
                }
                for (var i=0;i<len;i++){
                    this._playerCards[dir][i].setVisible(true) ;
                }
                var length = player.playOutMahjong.length ;
                var islaizipi = false ;
                if (laizipi.hasOwnProperty(uid)){
                    islaizipi = true ;
                }
                for(var j=0;j<length;j++){
                    islaizipi = (j==0)? islaizipi : false ;
                    var mahjong = player.playOutMahjong[j];
                    if (this._kongValue.indexOf(mahjong) != -1){
                        this._playerPlayOutKongMahjong[dir].push(mahjong);
                        this.dealDiscardKongRecord(dir,mahjong,true) ;
                    }else{
                        this._playerPlayOutMahjong[dir].push(mahjong);
                        this.dealDiscardRecord(dir,mahjong,true) ;
                    }
                }
                var isResetMahPos = false ;
                if (player.hasOwnProperty("brightMahjong") && !_.isEmpty(player.brightMahjong)){
                    for (var num =0 ;num<player.brightMahjong.length;num++){
                        var brightMahjongs = player.brightMahjong[num] ;
                        this.dealBrightCard(dir,brightMahjongs) ;
                        isResetMahPos = true ;
                    }
                }
                var tmpArr = [] ;
                if (!_.isEmpty(player.chi)){
                    _.each(player.chi,function(data){
                        tmpArr.push(data) ;
                    }) ;
                }

                if (!_.isEmpty(player.peng)){
                    _.each(player.peng,function(data){
                        tmpArr.push(data) ;
                    }) ;
                }
                if (!_.isEmpty(player.gang)){
                    _.each(player.gang,function(data){
                        tmpArr.push(data) ;
                    }) ;
                }
                if (!_.isEmpty(tmpArr)){
                    tmpArr.sort(function(a,b){
                        return a.ts - b.ts ;
                    });
                    //遍历将tmpArr的值赋给data
                    _.each(tmpArr,function(data){
                        self.dealGroupRecord(dir,data);
                    })
                    isResetMahPos = true ;
                }
                if (isResetMahPos == true){
                    this.resetMahjongPosition(dir);
                }
            }
            console.log(" this._gameData.currUserInaugurated ",this._gameData.currUserInaugurated);
            if (isMyPart && this._gameData.currUserInaugurated != null){
                this.showPlayerNewCard(MY_DIRECTION);
            }
            console.log(" isMyPart ",this._gameData.currUserInaugurated);
            console.log(" this._gameData.previousOut ",this._gameData.previousOut);
            if ((this._gameData.currPlayUid!= this._myInfo._id) && !_.isEmpty(this._gameData.previousOut)){
                var key = _.first(_.keys(this._gameData.previousOut));
                console.log("key key ",key);
                var obj = {
                    uid:key,
                    mahjong:this._gameData.previousOut[key]
                };
                this.onPlayMahjong(obj,this) ;
            }
            this._isReLine = false ;
            this.updateBtnLaizi();
            this.hideAfterGameBegin();
            this.showControlAfterGameBegin();
            this.beginTimerCountDown();
            if (preDir!=null){
                var sprite = null ;
                if (_.last(this._playerPlayOutMahjong[preDir]) == preMahjong){
                    var tag = 1000 + this._playerPlayOutMahjong[preDir].length ;
                    sprite = this._panelOutCardsParent[preDir].getChildByTag(tag);
                }else if (_.last(this._playerPlayOutKongMahjong[preDir]) == preMahjong){
                    var tag = 2000 + this._playerPlayOutKongMahjong[preDir].length ;
                    sprite = this._panelKongOutCardsParent[preDir].getChildByTag(tag);
                }
                if (sprite!=null){
                    this.playOperateFlagAction(preDir,preMahjong,sprite);
                }
            }
            if (this._playerData[MY_DIRECTION].mahjong.length % 3 == 1){
                this.checkCanWin();
            }
        }
    },

    checkBrightMahjong:function(){
        var isBright  = this._preCheck.checkBrightMahjong(this._playerData[MY_DIRECTION]) ;
        if (isBright == true){
            this._btnOperateShow.setVisible(true) ;
            this._btnOperateShow.setTouchEnabled(true) ;
            this._btnOperateCancelBright.setVisible(true) ;
            this._btnOperateCancelBright.setTouchEnabled(true);
            if (this._bankerSeat == MY_DIRECTION){
                this.disableClickMyCard() ;
            }
        }else {
            this._btnOperateShow.setVisible(false) ;
            this._btnOperateCancelBright.setVisible(false) ;
            if (this._bankerSeat == MY_DIRECTION){
                this.enableClickMyCard() ;
            }
        }
    },


    backgroundClicked:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            if (this._curPopLayer!= null){
                this._curPopLayer.setVisible(false);
                this._curPopLayer = null ;
            }
            if (this._lastClickedCards!=null){
                this.showPlayToTingFlag(this._lastClickedCards);
                this._lastClickedCards.setPositionY(0) ;
            }
        }
    },

    //初始化房间信息  随机分配玩家位置
    initRoomData:function(obj){
        console.log("initRoomData obj obj ",obj);
        for (var i=0;i<common.TableDirection.length;i++){ //初始化用户数据
            this._playerData[i] = {} ;
        }
        this._gameData = obj;
        this._curRoomNo = obj.roomNo;
        this._curRound = obj.round;
        this._curPlayType = obj.gameType ;
        this._onlyKongValue = common.GameInfoByPlayType[this._curPlayType].KongValue ;
        if (obj.hasOwnProperty("hhType")){
            this._curSubPlayType = obj.hhType ;
            this._onlyKongValue = common.GameInfoByPlayType[this._curPlayType].KongValue[this._curSubPlayType] ;
        }
        this._myInfo = game.LocalData.getUserInfo();
        var myUid = this._myInfo._id ;
        var myKey = 0 ;   //找到我的位置
        for(var i=0;i<obj.users.length;i++){
            var user = obj.users[i] ;
            this._windLoc[user.uid] = i  ;
            this._tmpHeadImg[user.uid] = i +1;
            if (myUid == user.uid){
                myKey = i ;
            }
        }
        var aimKey = [0,1,2,3];
        if (myKey == 0){
            aimKey = [3,0,1,2] ;
        }else if (myKey == 2){
            aimKey = [1,2,3,0];
        }else if (myKey == 3){
            aimKey = [2,3,0,1];
        }
        var key = 0 ;
        var self = this ;
        _.each(aimKey,function(num){
            self._playerData[key++] = obj.users[num] ;
        });
    },

	//初始化控件
	initControl:function(){
        this._panelMenu = ccui.helper.seekWidgetByName(this._rootNode,"PanelMenu") ;
        this._panelMenu.setVisible(true) ;
        this._panelMenu.setPositionX(cc.winSize.width) ;

        this._btnMenu = ccui.helper.seekWidgetByName(this._rootNode, "ButtonMenu");
        this._btnMenu.setVisible(true);
        this._btnMenu.addTouchEventListener(this.btnMenuClicked,this);

        this._btnRound = ccui.helper.seekWidgetByName(this._rootNode, "ButtonRound");
        this._btnRound.setVisible(true);
        this._btnRound.setTouchEnabled(true) ;
        this._btnRound.addTouchEventListener(this.btnRoundClicked,this);

        this._btnBackLobbyInTable=ccui.helper.seekWidgetByName(this._rootNode,"ButtonBackLobby");
        this._btnBackLobbyInTable.setTouchEnabled(true);
        this._btnBackLobbyInTable.addTouchEventListener(this.btnBackClicekd,this);
        this._btnBackLobbyInTable.setVisible(true);

        this._btnOwnerDisband=ccui.helper.seekWidgetByName(this._rootNode,"ButtonDisBandRoom");
        this._btnOwnerDisband.setTouchEnabled(true);
        this._btnOwnerDisband.addTouchEventListener(this.btnDisBandClicked,this);
        this._btnOwnerDisband.setVisible(this._myInfo._id == this._gameData.ownerUid) ;

        this._labelAtlasCurRound = ccui.helper.seekWidgetByName(this._btnRound, "LabelAtlasCurRound"); //当前局数
        this._labelAtlasTotalRound = ccui.helper.seekWidgetByName(this._btnRound, "LabelAtlasTotalRound"); //总局数

        this._btnCloseMenu = ccui.helper.seekWidgetByName(this._rootNode, "ButtonCloseMenu");
        this._btnCloseMenu.setVisible(false);
        this._btnCloseMenu.addTouchEventListener(this.btnCloseMenuClicked,this);


        ccui.helper.seekWidgetByName(this._panelMenu, "ButtonSetting").addTouchEventListener(this.btnSettingClicekd,this); //设置
        this._btnbackLobby = ccui.helper.seekWidgetByName(this._panelMenu, "ButtonBackToLobby");
        this._btnbackLobby.addTouchEventListener(this.btnBackClicekd,this); //返回

        this._btnDisband = ccui.helper.seekWidgetByName(this._panelMenu, "ButtonDisBand") ;
        this._btnDisband.addTouchEventListener(this.btnDisBandClicked,this); //申请解散牌局
        // ccui.helper.seekWidgetByName(this._panelMenu, "ButtonTrusteeship").addTouchEventListener(this.btnTrusteeshipClicekd,this); //不需要托管


        this._btnWin = ccui.helper.seekWidgetByName(this._rootNode, "ButtonWin") ;
        this._btnWin.addTouchEventListener(this.btnWinTipClicked,this); //胡牌提示按钮
        this._btnWin.setTouchEnabled(true) ;
        this._btnWin.setVisible(false) ;

        this._btnChat = ccui.helper.seekWidgetByName(this._rootNode, "ButtonChat");
        this._btnChat.addTouchEventListener(this.btnChatClicked,this); //快速聊天
        this._btnChat.setTouchEnabled(true) ;


        this._btnSpeak = ccui.helper.seekWidgetByName(this._rootNode, "ButtonSpeak") ;
        this._btnSpeak.addTouchEventListener(this.btnSpeakClicked,this); //语音
        this._btnSpeak.setTouchEnabled(true) ;

        this._imgRecording=ccui.helper.seekWidgetByName(this._rootNode,"ImageViewRecording");
        //不知道什么原因 显示uiWeight的错
        // this._loadingRecording=ccui.helper.seekWidgetByName(this._rootNode,"LoadingBarRecording");
        // this._loadingRecording.setParent(0);
        // this._loadingRecording.setVisible(false);
        this._imgRecording.setVisible(false);


        this._imgCancelVoice = ccui.helper.seekWidgetByName(this._rootNode, "ImgCancelVoice");
        this._imgCancelVoice.setVisible(false) ;

        this._btnHelp = ccui.helper.seekWidgetByName(this._rootNode, "ButtonHelp") ;
        this._btnHelp.addTouchEventListener(this.btnHelpClicekd,this); //帮助
        this._btnHelp.setTouchEnabled(true) ;
        var roomTitle = common.GameInfoByPlayType[this._curPlayType].title;
        console.log(" this._curSubPlayType" );
        if (this._curSubPlayType!=0){
            if (common.GameInfoByPlayType[this._curPlayType].hasOwnProperty('subTitle')){
                roomTitle = roomTitle  +"-"+common.GameInfoByPlayType[this._curPlayType]['subTitle'][this._curSubPlayType];
            }
        }
        ccui.helper.seekWidgetByName(this._rootNode, "LabelRoomTitle").setString(roomTitle);
        ccui.helper.seekWidgetByName(this._rootNode, "LabelRoomNo").setString("房间号:"+this._curRoomNo) ;
        ccui.helper.seekWidgetByName(this._rootNode, "LabelRoomIntro").setString(this._gameData.huCount+"倍起胡 " + this._gameData.maxHuCount +"封顶") ;
        ccui.helper.seekWidgetByName(this._rootNode, "LabelUnderScore").setString("底分"+this._gameData.underScore);

        this._btnLaizi =ccui.helper.seekWidgetByName(this._rootNode, "ButtonLaizi") ;//癞子按钮
        this._btnLaizi.setTouchEnabled(false) ;
        this._btnLaizi.setVisible(false) ;
        this._btnLaizi .addTouchEventListener(this.btnLaiziClicekd,this) ;
        ccui.helper.seekWidgetByName(this._btnLaizi,"ImgLaizi").setVisible(false);

        this._imgChowBackground = ccui.helper.seekWidgetByName(this._rootNode, "ImgChowBackground") ;
        this._imgChowBackground.setVisible(false);

        this._imgKongBackground= ccui.helper.seekWidgetByName(this._rootNode, "ImgKongBackground") ;
        this._imgKongBackground.setVisible(false);

        this._imgLaiZi = ccui.helper.seekWidgetByName(this._rootNode, "ImgLaizi") ;
        this._imgLaiZi.setVisible(false) ;
        this._imgMahjongModel = ccui.helper.seekWidgetByName(this._rootNode,"ImgMahjongModel") ;
        this._imgMahjongModel.setVisible(false) ;

        this._imgWordTips = ccui.helper.seekWidgetByName(this._rootNode,"ImgWordTips");
        this._imgWordTips.setVisible(false);

        this._imgMessageTips = ccui.helper.seekWidgetByName(this._rootNode, "ImgMessageTips");
        this._imgMessageTips.setVisible(false);

        this._imgPopLaizi = ccui.helper.seekWidgetByName(this._rootNode,"ImgPopLaiZi");//癞子&杠牌
        this._imgPopLaizi.setVisible(false);

        this._imgPopWinTip =  ccui.helper.seekWidgetByName(this._rootNode,"ImgPopWinTip");//胡牌提示
        this._imgPopWinTip.setVisible(false);

        this._imgPopChat =ccui.helper.seekWidgetByName(this._rootNode,"ImgPopChat");//聊天框
        this._imgPopChat.setVisible(false);
        this._imgPopChat.setTouchEnabled(true);
        this._imgPopChat.addTouchEventListener(function (sender,type) {
        },this);

        this._btnEmoji = ccui.helper.seekWidgetByName(this._imgPopChat,"PanelBtnEmoji");
        this._btnEmoji.setHighlighted(true);
        this._btnEmoji.setTouchEnabled(false) ;
        this._btnEmoji.addTouchEventListener(this.btnShowEmojiPanel,this) ;

        this._btnText = ccui.helper.seekWidgetByName(this._imgPopChat,"PanelBtnText") ;
        this._btnText.setHighlighted(false);
        this._btnText.setTouchEnabled(true) ;
        this._btnText.addTouchEventListener(this.btnShowTextPanel,this) ;

        this._imgEmoji = ccui.helper.seekWidgetByName(this._imgPopChat,"ImgEmoji");
        this._imgEmoji.setVisible(true) ;
        this._imgText = ccui.helper.seekWidgetByName(this._imgPopChat,"ImgText");
        this._imgText.setVisible(false) ;

        var text = common.MessageContext ;
        var amount = text.length;

        var panelItem = ccui.helper.seekWidgetByName(this._imgPopChat,"PanelItem");
        panelItem.setVisible(false) ;
        var height = panelItem.getContentSize().height + 5;
        var scrollView=ccui.helper.seekWidgetByName(this._imgText,"ScrollView");
        var scrollSize = scrollView.getContentSize();
        scrollView.setInnerContainerSize(cc.size(scrollSize.width,height*amount));
        var newScrSize = scrollView.getInnerContainer();
        var finalSizeHeight  = (newScrSize.height <  scrollSize.height)? scrollSize.height : newScrSize.height;
        var count = 0 ;
        var target = this ;
        _.each(text,function (content) {
            var item = panelItem.clone() ;
            item.setTouchEnabled(true) ;
            item.setVisible(true) ;
            item._id = count ;
            item.addTouchEventListener(target.btnTextClicked,target) ;
            item.setPosition(cc.p(0,finalSizeHeight - height*(count+1))) ;
            scrollView.addChild(item) ;
            ccui.helper.seekWidgetByName(item,"LabelText").setString(content);
            count++ ;
        });

        for (var i=0;i<16;i++){
            var key = "ButtonEmoji"+(i+1);
            var btnEmoji = ccui.helper.seekWidgetByName(this._imgPopChat,key);
            btnEmoji.setTouchEnabled(true) ;
            btnEmoji._id = i+1 ;
            btnEmoji.addTouchEventListener(this.btnEmojiClicked,this);
        }

        this._imgPopPersonalInfo = ccui.helper.seekWidgetByName(this._rootNode,"ImgPersonalInfo");//玩家信息
        this._imgPopPersonalInfo.indexDir = -1 ; //初始化一个方向
        this._imgPopPersonalInfo.setVisible(false);

        this.updateGameRoundInfo();

		var panelMobileInfo = ccui.helper.seekWidgetByName(this._rootNode, "PanelMobileInfo");
		this._imgWifiInfo = ccui.helper.seekWidgetByName(panelMobileInfo, "ImgWifi");
		this._loadingBarBatteryLevel = ccui.helper.seekWidgetByName(panelMobileInfo, "LoadingBarBattery");
		this._labelCurTime= ccui.helper.seekWidgetByName(panelMobileInfo, "LabelCurTime");

        this._labelMahJongSurplus = ccui.helper.seekWidgetByName(this._rootNode, "LabelSurplusMahjong");
        this._labelMahJongSurplus.setVisible(false) ;
		var panelOperate = ccui.helper.seekWidgetByName(this._rootNode, "PanelOperation");
		panelOperate.setVisible(true);
        this._btnOperateWin = ccui.helper.seekWidgetByName(panelOperate, "ButtonToWin");
        this._btnOperateWin.addTouchEventListener(this.btnWinClicked,this);
        this._btnOperateWin.setVisible(false);
        this._btnOperateKong = ccui.helper.seekWidgetByName(panelOperate, "ButtonKong");
        this._btnOperateKong.addTouchEventListener(this.btnKongClicked,this);
        this._btnOperateKong.setVisible(false);
        this._btnOperatePong = ccui.helper.seekWidgetByName(panelOperate, "ButtonPong");
        this._btnOperatePong.addTouchEventListener(this.btnPongClicked,this);
        this._btnOperatePong.setVisible(false);
        this._btnOperateChow = ccui.helper.seekWidgetByName(panelOperate, "ButtonChow");
        this._btnOperateChow.addTouchEventListener(this.btnChowClicked,this);
        this._btnOperateChow.setVisible(false);
        this._btnOperatePass = ccui.helper.seekWidgetByName(panelOperate, "ButtonPass");
        this._btnOperatePass.addTouchEventListener(this.btnPassClicked,this);
        this._btnOperatePass.setVisible(false);
        this._btnOperateShow = ccui.helper.seekWidgetByName(panelOperate, "ButtonShow");
        this._btnOperateShow.addTouchEventListener(this.btnBrightClicked,this);
        this._btnOperateShow.setVisible(false);
        this._btnOperateCancelBright = ccui.helper.seekWidgetByName(panelOperate, "ButtonCancelBright");
        this._btnOperateCancelBright.addTouchEventListener(this.btnCancelBright,this);
        this._btnOperateCancelBright.setVisible(false);

        // 如果是房主 显示邀请好友的按钮  点击处理邀请好友
        // var isOwner = (this._myInfo._id == this._gameData.ownerUid) && (this._gameData.users.length<4) ; //是房主  并且房间人数小于4

        //不管是不是房主都可以显示邀请好友或者复制房间号的按钮
        this._btnWeChatInvite =  ccui.helper.seekWidgetByName(this._rootNode, "ButtonInvite"); //微信邀请好友
        this._btnWeChatInvite.setTouchEnabled(true) ;
		this._btnWeChatInvite.addTouchEventListener(this.btnWeChatInviteClicked,this);


        this._btnCopyRoomNo =  ccui.helper.seekWidgetByName(this._rootNode, "ButtonCopy"); //复制房间号
        this._btnCopyRoomNo.setTouchEnabled(true) ;
        this._btnCopyRoomNo.addTouchEventListener(this.btnCopyRoomNoClicked,this);

        this._btnPrepare =  ccui.helper.seekWidgetByName(this._rootNode, "ButtonPrepare"); //开始准备
        this._btnPrepare.addTouchEventListener(this.btnStartPrepareClicked,this);
        this._btnPrepare.setTouchEnabled(true);

        if (this._gameData.users.length<4){
            this._btnWeChatInvite.setVisible(true);
            this._btnCopyRoomNo.setVisible(true);
            this._btnPrepare.setVisible(false);
        }else{
            this._btnWeChatInvite.setVisible(false);
            this._btnCopyRoomNo.setVisible(false);
            var status = this._playerData[MY_DIRECTION].status ; //0  正常状态 1：已准备 2 游戏中  3 断线
            if (status == common.PlayerStatus.STATUS_UN_PREPARE){
                this._btnPrepare.setVisible(true);
            }else{
                this._btnPrepare.setVisible(false);
                this.updatePlayerStatus(MY_DIRECTION,this._playerData[MY_DIRECTION].status);
                if (status == common.PlayerStatus.STATUS_PREPARING){
                    this.playWordTips(common.ShowWordType.TYPE_PREPARING,true) ;
                }
            }
        }
	},


    /**
     * 更新玩家的状态
     * status 0 默认,1,已准备2,游戏中, 3 断线
     */
	initPlayerInfo:function(){
        for (var dir=0;dir<common.TableDirection.length;dir++){
            var key = "Img"+common.TableDirection[dir] + "Player";
            this._playerInfo[dir] = ccui.helper.seekWidgetByName(this._rootNode,key) ;
            this._playerInfo[dir].setTouchEnabled(true) ;
            this._playerInfo[dir].indexDir = dir ;
            this._playerInfo[dir].addTouchEventListener(this.showPlayerInfo,this);
            var isShow = _.isEmpty(this._playerData[dir]);
            this._playerInfo[dir].setVisible(!isShow);
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgFlagMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelAtlasMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImageFlag").setVisible(false) ; //庄
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgVoice").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgSpeak").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelScore").setString(0) ;
            if (isShow) continue ; //用户信息是空的 进入下一个循环
            var status = this._playerData[dir].status ;
            this.updatePlayerStatus(dir,status);
            if (!_.isEmpty(this._playerData[dir])){
                this.showPlayerHeadPic(dir);
            }
        }
	},

    updatePlayerStatus:function(seat,status){
	    console.log(" updatePlayerStatus seat : "+ seat);
        this._playerInfo[seat].setVisible(true) ;
        var imagePath =[
            res.word_unprepare_png,
            res.word_preparing_png,
            "", //游戏中  显示分数
            // res.word_tuoguanzhong_png
        ];
        console.log(" status status : "+ status);
        if (status == 2){ //游戏中
            ccui.helper.seekWidgetByName(this._playerInfo[seat], "ImgPrepareStatus").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[seat],"LabelScore").setVisible(true) ;
            ccui.helper.seekWidgetByName(this._playerInfo[seat],"LabelScore").setString(this._playerData[seat].score) ;
            ccui.helper.seekWidgetByName(this._playerInfo[seat],"PanelOffLine").setVisible(false);
        } else if(status==3){
            ccui.helper.seekWidgetByName(this._playerInfo[seat],"PanelOffLine").setVisible(true);
        }
        else if (imagePath[status] && imagePath[status]!=""){
            ccui.helper.seekWidgetByName(this._playerInfo[seat], "ImgFlagMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[seat], "LabelAtlasMultiple").setVisible(false);
            ccui.helper.seekWidgetByName(this._playerInfo[seat], "ImgPrepareStatus").setVisible(true) ;
            ccui.helper.seekWidgetByName(this._playerInfo[seat],"PanelOffLine").setVisible(false);
            ccui.helper.seekWidgetByName(this._playerInfo[seat], "ImgPrepareStatus").loadTexture(imagePath[status]) ;
        }

    },

    showPlayerHeadPic:function(dir){
        var uid = this._playerData[dir].uid ;
        var headPic = ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgHeadPic") ;
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
            this.loadHeadPic(headPic,this._playerData[dir]) ;
        }else{
            var img = "res/ui/icon/head_"+this._tmpHeadImg[uid]+".jpg";
            this.loadHeadPic(headPic,img) ;
        }
    },

    //判断谁是庄
    bankerConfirm:function(){
        var banker = this._gameData.banker;
        console.log(" banker :" + banker);
        for (var i=0;i<this._playerData.length;i++){
            if (this._playerData[i].uid == banker) {
                var bankerSprite = ccui.helper.seekWidgetByName(this._playerInfo[i], "ImageFlag");
                bankerSprite.setVisible(true) ;
                this._bankerSeat = i ;
            }else{
                ccui.helper.seekWidgetByName(this._playerInfo[i], "ImageFlag").setVisible(false) ;
            }
        }
    },


    /**
     * 弹出玩家的详细信息
     * ["West","South","East","North"]
     * @param widget
     * @param touchType
     */
    showPlayerInfo:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            this.closeCurPopLayer(this._imgPopPersonalInfo);
            var dir = widget.indexDir;
            if (!this._playerData[dir]){
                return ;
            }
            var userInfo = this._playerData[dir] ;
            if (this._imgPopPersonalInfo.indexDir == dir){ //两次点击的同一个按钮
                var isVisible = !this._imgPopPersonalInfo.isVisible() ;
                this._imgPopPersonalInfo.setVisible(isVisible);
                if (isVisible == false)return ;
            }else{
                this._imgPopPersonalInfo.setVisible(true) ;
                this._imgPopPersonalInfo.indexDir = dir ;
            }
			var pos = widget.getPosition();
			var newPos = pos ;
			if (dir == 3){
                newPos.x = pos.x + 270;
                newPos.y = pos.y - 30 ;
            }else if (dir == 0 || dir ==1 ){
                newPos.x = pos.x + 270 ;
			}else{
                newPos.x = pos.x - 270 ;
			}
            this._imgPopPersonalInfo.setPosition(newPos) ;
			//如果不是房主的话  不显示这个按钮
            var btnKickOut=ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"ButtonKickOut");
            btnKickOut.setTouchEnabled(true) ;
            btnKickOut._uid = userInfo.uid ;
            btnKickOut.addTouchEventListener(this.btnKickOutClicked,this);
            var isShow =  true ;
            if (this._myInfo._id != this._gameData.ownerUid || this._isGameStarted == true || dir == MY_DIRECTION){
                isShow = false ;
            }
            btnKickOut.setVisible((isShow));
            var nickName=userInfo.nickname;
            if(userInfo.nickname.length>6){
                nickName=userInfo.nickname.substring(0,6)+"...";
            }
            ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"LabelNickname").setString(nickName);
            ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"LabelPlayerId").setString("ID:"+userInfo.id);
            ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"LabelRoomCard").setString("房卡:"+userInfo.roomCard);
            ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"LabelIP").setString("IP:"+userInfo.ipaddress);
            var labelAddress = ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"LabelAddress") ;
            var imgHeadPic = ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"ImgHeadPic");
            imgHeadPic.removeAllChildren() ;
            this.loadHeadPic(imgHeadPic,userInfo.headimgurl,common.ClipType.Rectangle) ;
            var imgSex = ccui.helper.seekWidgetByName(this._imgPopPersonalInfo,"ImgSex");
            if (userInfo.sex == 1){
                imgSex.loadTexture(res.icon_man_info_png);
            }else{
                imgSex.loadTexture(res.icon_woman_info_png);
            }
            this.getPlayerAddressByPos(userInfo.latitude,userInfo.longitude,labelAddress);
        }
    },


    btnMenuClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        this.closeCurPopLayer();
        this._btnMenu.setVisible(false);
        this._btnCloseMenu.setVisible(true) ;
        this._panelMenu.runAction(cc.moveTo(0.2,cc.winSize.width-300,this._panelMenu.y)) ;
        if (this._isGameStarted == false && this._curRound <=1 ){
            this._btnDisband.setVisible(false) ;
            this._btnbackLobby.setVisible(false);
        }else{
            this._btnDisband.setVisible(true) ;
            this._btnbackLobby.setVisible(true);
        }

        this._btnLaizi.setVisible(false) ;
        this._btnWin.setVisible(false);
        this._btnChat.setVisible(false) ;
        this._btnHelp.setVisible(false) ;
        this._playerInfo[2].setVisible(false) ;
    },

    /**
     * 查看战绩等
     * @param widget
     * @param touchType
     */
    btnRoundClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        this.closeCurPopLayer() ;
        console.log(" btnRoundClicked .......... ");
        if (this._curRound <= 1){
            game.Notification.send(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL,{detail:{},list:{}}) ;
            return ;
        }
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.getCurrRoomResult(params);

    },

    btnCloseMenuClicked:function(widget, touchType) {
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        this._btnMenu.setVisible(true);
        this._btnCloseMenu.setVisible(false) ;
        this._panelMenu.runAction(
            cc.sequence(
                cc.moveTo(0.2,cc.winSize.width,this._panelMenu.y),
                cc.callFunc(function(){
                    if (this._isGameStarted == true){
                        this._btnLaizi.setVisible(true) ;
                        this._playerInfo[2].setVisible(true) ;
                    }
                    this._btnHelp.setVisible(true) ;
                    this._btnChat.setVisible(true) ;
                },this)
            )
        ) ;
    },

    /**
     * 申请解散房间
     * 未开始牌局或者第一局牌未结束  是不扣除房卡的
     * @param widget
     * @param touchType
     */
    btnDisBandClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log("---------btnDisBandClicked----------");
        var curRoomNo = this._curRoomNo ;
        var params = {
            desc:common.TipsDesc.ApplyDissolveRoom,
            close:true,
            confirmOnly:function(){
                var params = {
                    roomNo:curRoomNo
                } ;
                net.NetManage.initiateDissolveRoom(params) ;
            }
        };
        if (this._curRound <=1){
            if (this._isGameStarted == false && this._myInfo._id == this._gameData.ownerUid){  //游戏未开始  且我是房主
                params.desc = common.TipsDesc.OwnerDissolveRoom ;
            }
        }
        this.send(common.NotifyType.SHOW_TIPS_PANEL,params)
    },


    btnKickOutClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log("---------btnKickOutClicked----------");
        if (this._myInfo._id != this._gameData.ownerUid) { //不是房主 不能踢人
            return ;
        }
        var curRoomNo = this._curRoomNo ;
        var kickUid = widget._uid ;
        var params = {
            desc:common.TipsDesc.KickPlayerOut,
            close:true,
            confirmOnly:function(){
                console.log("踢玩家");
                var param = {
                    roomNo:curRoomNo,
                    kickUid:kickUid
                };
                net.NetManage.roomOwnerKickUserByUid(param);
            }
        };
        this.send(common.NotifyType.SHOW_TIPS_PANEL,params)
	},

    /**
     * 初始化房牌桌的信息
     */
	initTableData:function(){
        console.log(" initTableData ",this._gameData);
        this._kongValue = _.union(this._onlyKongValue,[this._gameData.laizi]);
        //红中癞子杠和红中晃晃 检测碰杠胡的方法不同
        if (this._gameData.gameType == common.PlayType.Normal258){
            this._preCheck = new Check(this._gameData.laizi) ;
        }else if (this._gameData.gameType == common.PlayType.HongHuang){
            this._preCheck = new CheckHuang(this._gameData.laizi,this._gameData.hhType) ;
        }
        this._surplusMahjong = this._gameData.mahjongCount ;
        this._surTotalMahjong = this._surplusMahjong + 54 ;
        for (var dir=0;dir<common.TableDirection.length;dir++){
            var player = this._playerData[dir] ;
            var uid = player.uid ;
            if (this._playerData[dir].uid == this._gameData.currPlayUid){
                this._playerNewMahjong[dir] = _.last(this._playerData[dir].mahjong);
                if (this._gameData.currUserInaugurated != null){
                    this._playerNewMahjong[dir] = this._gameData.currUserInaugurated ;
                }
            }
            var panelSize = this._panelCardsParent[dir].getContentSize() ;
            //玩家手里全部的牌按方向的位置
            if (this._windLoc.hasOwnProperty(uid)){
                var imgKey = this._windLoc[uid] ;
                if (common.ImgWordDirection[imgKey]){
                    var sprite = new cc.Sprite(common.ImgWordDirection[imgKey]);
                    sprite.anchorX = 0.5 ;
                    sprite.anchorY = 0.5 ;
                    var pos = this._tableDirection[dir].getPosition();
                    sprite.setPosition(pos) ;
                    this._panelDirection.addChild(sprite);
                }
            }
            var len = player.mahjong.length ;
            if (len%3 == 2){ //这里应该是出牌的玩家
                len = len -1 ;
            }
            console.log(" player.mahjong.length "+player.mahjong.length,len);
            for (var num =0;num<len;num++){
                this.calculateMahjongPosition(panelSize,dir,num,false);
            }
            this.calculateMahjongPosition(panelSize,dir,num,true);
        }
    },

    /**上的麻将显示位置
     * 计算牌桌
     * @param panelSize
     * @param dir
     * @param num
     * @param isNew  是否为最后新起的一张牌
     */
    calculateMahjongPosition:function(panelSize,dir,num,isNew){
        var playerMahjong = this._playerData[dir].mahjong ;
        var mahjong =  playerMahjong[num];
        console.log(" playerMahjong isNew " +isNew,playerMahjong);
        // console.log( " calculateMahjongPosition ",mahjong);
        var sprite ;
        if (dir == MY_DIRECTION){
            sprite = this._imgMahjongModel.clone();
            sprite.num = num;
            sprite.indexValue =mahjong ;
            var isKong = false ;
            if (_.indexOf(this._onlyKongValue,mahjong)!=-1){
                isKong = true ;
            }
            ccui.helper.seekWidgetByName(sprite, "ImgLaiziFlag").setVisible(false);
            ccui.helper.seekWidgetByName(sprite, "ImgKongFlag").setVisible(isKong); //杠牌的标记一开始就显示
            ccui.helper.seekWidgetByName(sprite, "ImgPlayToTing").setVisible(false);
            sprite.setTouchEnabled(true);
            sprite.addTouchEventListener(this.userCardClicked,this);
            var img = CARD_IMAGE_PATH+"dd_hand1.png" ;
            if (mahjong != undefined && mahjong>-1){
                img = CARD_IMAGE_PATH+"dd_hand"+mahjong+".png" ;
            }
            sprite.loadTexture(img);
        }else{
            sprite = new cc.Sprite(CARD_IMAGE_PATH+HAND_CARD_IMAGE[dir]);
        }

        this._panelCardsParent[dir].addChild(sprite);
        sprite.anchorX = 0 ;
        sprite.anchorY = 0 ;
        sprite.setVisible(false) ;

        if (isNew == false){
            this._playerCards[dir][num] = sprite;
        }else{
            num+=0.5 ; //为了计算坐标
            if (dir ==0 || dir == 2){
                num +=0.8 ;
            }
            this._playerCardsNew[dir] = sprite ;
        }

        var posX = 0 ;
        var posY = 0 ;
        var mahSize = this.getMahjongSize(dir) ;
        switch (dir){
            case 0:
                posY = panelSize.height-120 - num*mahSize.height  ;
                break;
            case 1:
                posX = 120+num*mahSize.width  ;
                break;
            case 2:
                posX = 0 ;
                posY =  num*mahSize.height ;
                sprite.zIndex = (20-Math.floor(num));
                break;
            case 3:
                posX = panelSize.width-460 - num*mahSize.width ;
                posY = 0 ;
                break;
        }
        sprite.x = posX ;
        sprite.y = posY ;
    },

    /**
     * 获取一张牌占的尺寸  并不是实际的麻将牌的尺寸
     */
    getMahjongSize:function(dir){
        var size = cc.size(0,0);
        switch (dir){
            case 0:
                size = cc.size(0,42);
                break;
            case 1:
                size = cc.size(110,0);
                break ;
            case 2:
                size = cc.size(0,42);
                break ;
            case 3:
                size = cc.size(75,0);
                break ;
        }
        return size ;
    },

    /**
     * 显示玩家手里最新的一张牌
     * @param dir  根据方位计算坐标
     */
    showPlayerNewCard:function(dir){
        console.log(" showPlayerNewCard ");
        for (var i=0;i<common.TableDirection.length;i++){
            var isShow = (dir == i) ;
            this._playerCardsNew[i].setVisible(isShow) ;
            // console.log(" this._playerNewMahjong[dir] dir "+dir,this._playerNewMahjong[dir] );
            // console.log(" dir "+ dir + " MY_DIRECTION:"+ MY_DIRECTION);
            var mahjongs = this._playerData[dir].mahjong ;
            // console.log("showPlayerNewCard mahjongs ",mahjongs);
            if (dir == MY_DIRECTION && (mahjongs.length % 3 == 2)){
                var sprite = this._playerCardsNew[dir] ;
                var value = this._playerNewMahjong[dir] ;
                var num = mahjongs.length -1;
                this.initSpriteStatus(sprite,value,num)
            }
        }
    },

	//初始化牌桌 此时牌桌上不显示麻将
	initCards:function(){
        this._panelDirection = ccui.helper.seekWidgetByName(this._rootNode, "ImageDirectionLight");
        this._panelDirection.setVisible(false);

		for (var dir=0;dir<common.TableDirection.length;dir++){
            this._playerPlayOutMahjong[dir] = [];
            this._playerPlayOutKongMahjong[dir] = [] ;
            this._playerNewMahjong[dir] = null ;
            this._playerMultiple[dir] = 1 ;

            this._playerCards[dir] = [];
            this._playerCardsValue[dir] = [];
            this._playerDiscardValue[dir] = [];

            var key = "Panel"+common.TableDirection[dir]+"Cards" ;
            this._panelCardsParent[dir] = ccui.helper.seekWidgetByName(this._rootNode, key);
            this._panelCardsParent[dir].setVisible(true) ;

            this._panelOutCardsParent[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir], "PanelOutCard");//出的普通牌的历史记录
            this._panelKongOutCardsParent[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir], "PanelKongOut");//出的杠牌的历史记录
            if (dir == MY_DIRECTION){
                this._panelWin = ccui.helper.seekWidgetByName(this._panelCardsParent[dir], "ImgWinPanel");
                this._panelWin.setVisible(false);
            }
            var keyLight = "Img"+ common.TableDirection[dir]+"Light";  //四个方向高亮箭头
            this._tableDirection[dir] = ccui.helper.seekWidgetByName(this._panelDirection,keyLight);
            this._tableDirection[dir].setVisible(false);


            this._playerDiscard[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir],"ImgDiscard");
            this._playerDiscard[dir].setVisible(false);

            this._panelOutGroupArr[dir] = [] ;
            this._panelOutGroup[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir],"PanelOut");
            this._panelOutGroup[dir].setVisible(false) ;
		}
        this._labelTimer = ccui.helper.seekWidgetByName(this._panelDirection,"LabelAtlas");
        this._labelTimer.setVisible(false);
	},

    btnShowEmojiPanel:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        this._imgEmoji.setVisible(true) ;
        this._imgText.setVisible(false) ;
        this._btnEmoji.setTouchEnabled(false) ;
        this._btnEmoji.setHighlighted(true);
        this._btnText.setTouchEnabled(true) ;
        this._btnText.setHighlighted(false);
	},

    btnShowTextPanel:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log(" ========btnShowTextPanel======== ");
        this._imgText.setVisible(true) ;
        this._imgEmoji.setVisible(false) ;
        this._btnEmoji.setTouchEnabled(true) ;
        this._btnEmoji.setHighlighted(false);
        this._btnText.setTouchEnabled(false) ;
        this._btnText.setHighlighted(true);
    },

    /**
     * 点击发送文本
     * @param widget
     * @param touchType
     */
    btnTextClicked:function(widget, touchType) {
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        if (this._isMessageShow == true){
            return ;
        }
        this.udpateMessageFlag();
        var params = {
            roomNo:this._curRoomNo,
            message:common.MessageType.Text+"-"+widget._id
        };
        net.NetManage.sendMessage(params);
    },

    /**
     * 点击发送表情
     * @param widget
     * @param touchType
     */
    btnEmojiClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        if (this._isMessageShow == true){
            return ;
        }
        this.udpateMessageFlag();
        var params = {
            roomNo:this._curRoomNo,
            message:common.MessageType.Emoji+"-"+widget._id
        };
        net.NetManage.sendMessage(params);
    },

    udpateMessageFlag:function(){
        this._isMessageShow = true ;
        this.scheduleOnce(function(){
            this._isMessageShow = false ;
        },2) ;
    },

    /**
     * 牌局结束后  重置牌桌
     */
	clearTable:function() {
        for (var dir = 0; dir < common.TableDirection.length; dir++) {
            this._panelOutCardsParent[dir].removeAllChildren();	//清除
            this._panelKongOutCardsParent[dir].removeAllChildren(); //玩家出的牌
            for (var i = 0; i < this._playerCards[dir].length; i++) {
                this._playerCards[dir][i].removeFromParent(this._panelCardsParent[dir]);
                this._playerCardsNew[dir].removeFromParent(this._panelCardsParent[dir]) ;
            }

            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgFlagMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelAtlasMultiple").setVisible(false) ;
            this._playerDiscard[dir].setVisible(false);
            _.each(this._panelOutGroupArr[dir],function(panelGroup){
                panelGroup.removeFromParent() ;
            });
            this._tableDirection[dir].setVisible(false);
            this._panelOutGroupArr[dir] = [] ;
            this._playerPlayOutMahjong[dir] = [] ;
            this._playerPlayOutKongMahjong[dir] = [] ;
        }
        this._btnLaizi.setVisible(false);
        this._btnWin.setVisible(false) ;
        this._labelMahJongSurplus.setVisible(false) ;
        this._panelDirection.setVisible(false);
        this._outSpriteByValue = {} ;
        this._outMahjong = {} ;
        this.clearChowGroup();
    },

	clearChowGroup:function(){
        for (var i = 0; i < this._panelChowGroup.length; i++) {
            this._panelChowGroup[i].removeFromParent();
        }
    },

	//翻癞子
    showLaiZi:function(){
	    console.log(" showLaiZi ",this._imgLaiZi);
        this._imgLaiZi.setVisible(true);
        this._imgLaiZi.zIndex = 1000;
        this._imgLaiZi.setPosition(cc.p(960,760)) ;
        console.log(" this._imgLaiZi.zIndex "+ this._imgLaiZi.zIndex);
        var sprite = this._imgLaiZi;
        var laiZi = this._gameData.laizi ;
        this._imgLaiZi.loadTexture(CARD_LAI_ZI_IMAGE+laiZi+".png");
        var pos = cc.p(1860,525) ;
        this._btnLaizi.setVisible(true) ;
        sprite.runAction(
            cc.sequence(
                cc.delayTime(0.5),
                cc.spawn(cc.scaleTo(0.5,1),cc.fadeIn(0.5)),
                cc.delayTime(1),
                cc.spawn(cc.moveTo(0.5,pos),cc.scaleTo(0.5,0.1)),
                cc.callFunc(function(){
                    sprite.setVisible(false);
                    this.updateBtnLaizi() ;
                },this)
            )
        );

        for (var dir=0;dir<common.TableDirection.length;dir++){
            if (!_.isEmpty(this._playerData[dir].playOutMahjong)){
                var laizipi =this._playerData[dir].playOutMahjong[0] ;
                if (this._kongValue.indexOf(laizipi) != -1){
                    this._playerPlayOutKongMahjong[dir].push(laizipi);
                    this.dealDiscardKongRecord(dir,laizipi,true) ;
                }else{
                    this._playerPlayOutMahjong[dir].push(laizipi);
                    this.dealDiscardRecord(dir,laizipi,true) ;
                }
            }
        }
        this.scheduleOnce(this.bankerStart,2) ;
        //TODO
    },

    updateBtnLaizi:function(){
        this._btnLaizi.setVisible(true) ;
        this._btnLaizi.setTouchEnabled(true) ;
        var imgLaizi = ccui.helper.seekWidgetByName(this._btnLaizi,"ImgLaizi") ;
        var imgLaizi = ccui.helper.seekWidgetByName(this._btnLaizi,"ImgLaizi") ;
        imgLaizi.loadTexture(CARD_LAI_ZI_IMAGE+this._gameData.laizi+".png") ;
        imgLaizi.setVisible(true) ;
        this.updateSurplusMahjongCount(0) ;
    },

    bankerStart:function(){
        this.updateSuplusMahjongBeforeGameStart() ;
        this.showPlayerNewCard(this._bankerSeat) ;
        this.showTableDirection(this._bankerSeat) ;
        this._curPlayerDirect = this._bankerSeat ;
        if (this._bankerSeat == MY_DIRECTION){
            this.enableClickMyCard() ;
            this.checkplayToTing(MY_DIRECTION);
        }else{
            this.disableClickMyCard() ;
        }
        this.beginTimerCountDown();
        if (this._curPlayType == common.PlayType.HongHuang){
            this.checkBrightMahjong();
        }
    },

    /**
     * 播放文字提示
     * @param type 0:准备中 1:对局开始  2 癞子确定 (渐现&放大=》停留=》缩小&消失)
     * 3 对局结束  4流局  5自摸 6 杠上开花
     */
	playWordTips:function(type,isStay){
        var imgPath = [res.word_game_preparing_png,
            res.word_game_start_png,
            res.word_game_laiziconfirm_png,
            res.word_game_end_png,
            res.word_game_draw_png,
            res.word_game_winafterdraw_png,
            res.word_game_winafterkong_png
        ];

        this._imgWordTips.setVisible(true);
        this._imgWordTips.loadTexture(imgPath[type]);
        this._imgWordTips.scale = 0;
        var sprite = this._imgWordTips;
        if (isStay !=undefined){
            this._imgWordTips.runAction( cc.spawn( cc.scaleTo(1,1), cc.fadeIn(1)));
            return;
        }
        this._imgWordTips.runAction(
            cc.sequence(
                cc.spawn( cc.scaleTo(1,1), cc.fadeIn(1)),
                cc.delayTime(2),
                cc.spawn( cc.scaleTo(1,0), cc.fadeOut(1)),
                cc.delayTime(1),
                cc.callFunc(function(){
                    sprite.setVisible(false);
                },this)
            )
        );

    },

	//发牌
	dealCards:function(){
        this._panelDirection.setVisible(true) ;
        var time = 0;
        for (var round=0;round<4;round++){  //发3轮牌
            var start = this._bankerSeat ;
            var end = start + TOTAL_PLAYER_NUMBER ;
            for (var j =start;j<end;j++){
                var seat = (j>=TOTAL_PLAYER_NUMBER) ?(j-TOTAL_PLAYER_NUMBER):j;
                time+=common.DealCardsTime ;
                this.showPlayerCards(seat,round,time);
                var that = this ;
                if (round == 3){
                    this.scheduleOnce(function(){
                        that.updateSuplusMahjongBeforeGameStart();
                    },time);
                }else{
                    this.scheduleOnce(function(){
                        that.updateSuplusMahjongBeforeGameStart(4);
                    },time);
                }
            }
        }
	},

	showPlayerCards:function(dir,round,time){
        var start = round * EACH_ROUND_ADD_CARDS;
        var end = start+EACH_ROUND_ADD_CARDS;
        console.log(" this._playerData[dir] ",this._playerData[dir]);
        var playerMahjongs = this._playerData[dir].mahjong ;
        if (end >= playerMahjongs.length){
            end = playerMahjongs.length ;
        }
        var spriteArr = [];
        for (var i=start;i<end;i++){
            spriteArr.push(this._playerCards[dir][i]) ;
        }
        var maxTime = common.DealCardsTime  * 16 ;
        var that = this ;
        var flag = false ;
        console.log(" spriteArr" ,spriteArr );
        spriteArr.forEach(function(sprite){
            if (sprite!=undefined){
                sprite.runAction(
                    cc.sequence(
                        cc.delayTime(time),
                        cc.callFunc(function(){
                            sprite.setVisible(true) ;
                            that.showTableDirection(dir) ;
                            if (time >= maxTime && flag== false){
                                flag  = true ;
                                that.scheduleOnce(that.showLaiZi,0.5) ;
                                that.scheduleOnce(that.hideUserCards,0.5);
                                that.playWordTips(common.ShowWordType.TYPE_LAI_ZI_CONFIRM);
                                return ;
                            }
                        },this)
                    )
                )
            }
        })
    },


    /**
     * 门风指示器变化
     * @param direct
     */
	showTableDirection:function(direct){
        for (var i=0;i<this._tableDirection.length;i++){
            var isShow = (i==direct) ? true:false;
            this._tableDirection[i].setVisible(isShow);
            if (isShow == false){
                this._tableDirection[i].stopAllActions();
            }else{
                this._tableDirection[i].runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.fadeIn(0.8),
                            cc.fadeOut(0.8)
                        )
                    )
                );
            }
        }
	},

	//玩家点击某张牌
	userCardClicked:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            console.log(" widget index : " + widget.num);
            console.log(" widget index Value : " + widget.indexValue);
            var index = widget.num;
            var widgetHeight = widget.getContentSize().height/3;
            var value = widget.indexValue;
            console.log(" this._ClickedCardNo" +this._ClickedCardNo);
            var posY = 0 ;
            this.recoveryHighLightOutMahjong();
            this._playerDiscard[MY_DIRECTION].setVisible(false) ;
            if (this._curPopLayer!=null){
                this._curPopLayer.setVisible(false) ;
            }
            if (this._ClickedCardNo == -1){
                widget.setPositionY(posY+widgetHeight);
                this._ClickedCardNo = index ;
                this._lastClickedCards = widget;
                this.highLightOutMahjong(value);
                this.hidePlayToTingFlag(widget);
                this.isShowWinPanel(widget) ;
                this.hideOperationButton() ;
            }else if (this._ClickedCardNo == index){ //处理出牌的逻辑 两次点击即为出牌
                var params = {
                    roomNo:this._curRoomNo,
                    mahjong:value
                };
                net.NetManage.playMahjong(params) ;
                this.hideAllPlayToTingFlag();
            }else {	//两次点的不是同一张牌
				this._lastClickedCards.setPositionY(posY);
				this.showPlayToTingFlag(this._lastClickedCards) ;
                widget.setPositionY(posY+widgetHeight);
                this._ClickedCardNo = index ;
                this._lastClickedCards = widget;
                this.highLightOutMahjong(value);
                this.hidePlayToTingFlag(widget);
                this.isShowWinPanel(widget) ;
			}
        }
	},

    /**
     * 高亮显示打出去的牌
     * @param value
     */
	highLightOutMahjong:function(value){
	    this._highLightValue = value ;
        if (_.isEmpty(this._outSpriteByValue[value])){
            return ;
        }
        var spriteArr = this._outSpriteByValue[value] ;
        for (var i=0;i<spriteArr.length;i++){
            var sprite = spriteArr[i] ;
            sprite.setColor(cc.color(102,255,255)) ;
            sprite.setOpacity(255) ;
            // if (sprite.getChildByTag(1002)){
            //     var flag = sprite.getChildByTag(1002) ;
            //     this.doFadeAction(flag) ;
            // }
        }
    },

    /**
     * 取消高亮显示
     */
	recoveryHighLightOutMahjong:function(){
	    var value = this._highLightValue ;
	    console.log("recoveryHightLightOutMahjong value ",value);
        if (_.isEmpty(this._outSpriteByValue[value])){
            return ;
        }
        console.log("++++++recoveryHightLightOutMahjong++++++++ " );
        var spriteArr = this._outSpriteByValue[value] ;
        for (var i=0;i<spriteArr.length;i++){
            var sprite = spriteArr[i] ;
            sprite.setColor(cc.color(255,255,255)) ;
            sprite.setOpacity(255) ;
            // if (sprite.getChildByTag(1002)){
            //     var flag = sprite.getChildByTag(1002) ;
            //     flag.setVisible(false) ;
            // }
        }
    },


	//处理玩家出牌
	handleUserDiscard:function(){

	},

    /**
     * 玩家手牌排序 癞子永远在最左边
     * 从左到右：红中、发财、癞子、万（1-9）、条（1-9）、筒（1-9）、东、南、西、北、白
     * @param direct
     */
	sortUserCards:function(dir){
        var laiZi = this._gameData.laizi ;
        var greenDragonAmount = 0 ; //发财的数量
        var redDragonAmount = 0; //红中的数量
        var laiZiAmount = 0 ;//玩家拥有癞子的数量
        var kongValue = this._onlyKongValue ;
        var playerMahjongs = this._playerData[dir].mahjong ;
        var lastMahjong = -1 ;
        console.log("sortUserCards 1 playerMahjongs" ,playerMahjongs);
        if (playerMahjongs.length % 3 == 2){
            lastMahjong = _.last(playerMahjongs);
            playerMahjongs.pop();
        }
        console.log("sortUserCards 2 playerMahjongs" ,playerMahjongs);
        _.each(playerMahjongs,function(num){
            if (_.indexOf(kongValue,num)!=-1 && num == RED_DRAGON){
                redDragonAmount++;
            } if (_.indexOf(kongValue,num)!=-1 && num ==GREEN_DRAGON ){
                greenDragonAmount++;
            }else if (num ==laiZi){
                laiZiAmount++;
            }
        });
        var dataArr = _.without(playerMahjongs,laiZi);
        for (var i= 0;i<kongValue.length;i++){
            dataArr = _.without(dataArr,kongValue[i]);
        }
        dataArr.sort(function (a,b){
            return a-b;
        });
        playerMahjongs = [] ;
        while (redDragonAmount>0){
            playerMahjongs.push(RED_DRAGON) ;
            redDragonAmount -- ;
        }
        while (greenDragonAmount>0){
            playerMahjongs.push(GREEN_DRAGON) ;
            greenDragonAmount--;
        }
        while (laiZiAmount>0){
            playerMahjongs.push(laiZi) ;
            laiZiAmount--;
        }
        _.each(dataArr,function(num){
            playerMahjongs.push(num) ;
        });
        if (lastMahjong != -1){
            playerMahjongs.push(lastMahjong);
        }
        this._playerData[dir].mahjong = playerMahjongs ;
	},

	hideUserCards:function(){
		var dir = MY_DIRECTION ;
		var img = "res/ui/mahjong/bei_d_left0.png";
		for (var num=0;num<(HAND_CARDS_NUMBER-1);num++){
            this._playerCards[dir][num].loadTexture(img);
            ccui.helper.seekWidgetByName(this._playerCards[dir][num],"ImgKongFlag").setVisible(false) ;
		}
		this.scheduleOnce(this.refreshUserCards,0.5) ;
	},

    /**
     * 出完牌之后  刷新玩家的手牌 刷新用户的手牌
     */
	refreshUserCards:function() {
		var dir = MY_DIRECTION;
		console.log("refreshUserCards before:",this._playerData[dir].mahjong);
		this.sortUserCards(dir);
        console.log("refreshUserCards after:",this._playerData[dir].mahjong);
        var mahjongs = this._playerData[dir].mahjong ;
        console.log("refreshUserCards mahjongs ",mahjongs);
		for (var num=0;num<mahjongs.length;num++){
		    var sprite = this._playerCards[dir][num] ;
            this.initSpriteStatus(sprite,mahjongs[num],num)
		}
        this.removeCards(dir);
    },

    // refreshOtherUserCardsAfterPlayOut:function(dir){
    //     this._playerCardsNew[dir].setVisible(false) ;
    //     console.log("refreshOtherUserCardsAfterPlayOut len:");
    //     this.removeCards(dir);
    // },

    removeCards:function(dir){
        var len = this._playerCards[dir].length ;
        var num = this._playerData[dir].mahjong.length ;
        console.log("removeCards len:"+len+" num:"+num);
        for(var i=len;i>num;i--){
            var key  = i-1;
            if (this._playerCards[dir][key]){
                this._playerCards[dir][key].removeFromParent();
                this._playerCards[dir].pop();
            }
        }
        this._playerCardsNew[dir].setVisible(false) ;
    },

    /**
     * 初始化牌的属性  左上角加上杠牌or癞子的标识
     * @param sprite
     * @param value
     * @param num
     */
	initSpriteStatus:function(sprite,value,num){
	    if (value < 1 || sprite== undefined){
	        console.log("initSpriteStatus ");
	        return ;
        }
        var img = this.getMyMahJongImg(value) ;
	    console.log("initSpriteStatus img img ",img);
        sprite.loadTexture(img);
        sprite.num = num ;
        sprite.indexValue = value ;
        if (_.indexOf(this._onlyKongValue,value) != -1){
            ccui.helper.seekWidgetByName(sprite, "ImgLaiziFlag").setVisible(false) ;
            ccui.helper.seekWidgetByName(sprite, "ImgKongFlag").setVisible(true) ;
        }else if (value == this._gameData.laizi){
            ccui.helper.seekWidgetByName(sprite, "ImgLaiziFlag").setVisible(true) ;
            ccui.helper.seekWidgetByName(sprite, "ImgKongFlag").setVisible(false) ;
        }else{
            ccui.helper.seekWidgetByName(sprite, "ImgLaiziFlag").setVisible(false) ;
            ccui.helper.seekWidgetByName(sprite, "ImgKongFlag").setVisible(false) ;
        }


    },

	//新起一张牌
	showLastCard:function(direct,value){
        this._playerCardsNew[direct].setVisible(true);
        if (direct == MY_DIRECTION){
        	this.enableClickMyCard();
        	console.log(" showLastCard value : " + value);
            var img = CARD_IMAGE_PATH+"dd_hand" + value +".png";
            this._playerDiscard[direct].loadTexture(img) ;
		}
	},

	//出完一张牌后  隐藏第14张牌
	hideLastCard:function(){
        this._playerCards[this._curPlayerDirect][HAND_CARDS_NUMBER-1].setVisible(false);
	},


    //显示玩家出的牌 direct:方向   value：牌值
    showPlayerDiscard:function(direct,value){
        // for (var dir=0;dir<common.TableDirection.length;dir++){
        //     var isShow = (dir == direct) ? true : false ;
        //     if (isShow == true){
        //         console.log(" showPlayerDiscard value :: "+ value);
        //         var img = CARD_IMAGE_PATH+"dd_hand" + value +".png";
        //         this._playerDiscard[dir].loadTexture(img) ;
        //     }
        //     this._playerDiscard[dir].setVisible(isShow) ;
        // }
    },

	//隐藏玩家出的牌
	hidePlayerDiscard:function(direct){
		this._playerDiscard[direct].setVisible(false);
	},

	//洗牌
	shuffleCards:function(){
		var dir = this._curPlayerDirect ;
		var num = this._playerDiscardNo ;//当前出的第几张牌
		var length = this._playerCardsValue[dir].length;
		this._playerCardsValue[dir][num] = this._playerCardsValue[dir][length-1];
		this._playerCardsValue[dir][length-1] = TOTAL_CARDS_TYPE;
		this.sortUserCards(dir) ;
        this.refreshUserCards();
	},

	//隐藏当前出牌玩家上一个玩家出的牌
	hideLastDiscard:function(){
        this._playerDiscard[this._lastPlayerDirect].setVisible(false);
	},

	//处理出牌
	dealDiscard:function(num){
	},

    /**
     * 被吃 or 被碰  or 被杠 的玩家
     * @param beDir
     */
    dealBeOperateDir:function(beDir){
        var length  = this._playerPlayOutMahjong[beDir].length ;
        console.log(" beDir : "+ beDir + " length "+ length);
        this._panelOutCardsParent[beDir].removeChildByTag(1000+length) ;
        var value = _.last(this._playerPlayOutMahjong[beDir]);
        this._outSpriteByValue[value].pop();
        this._playerPlayOutMahjong[beDir].pop();
    },

    /**
     * 处理出的组合牌
     * @param dir 操作的玩家
     * @param beDir 被碰or吃or杠的玩家
     * @param data
     * @param type 1 暗杠 2, 碰了之后的杠 3, 明杠
     */
    dealGroupRecord:function(dir, data){
        var mahjongs = data.pai;
        var panelGroup = this._panelOutGroup[dir].clone() ;
        panelGroup.setVisible(true) ;
        this._panelOutGroup[dir].getParent().addChild(panelGroup);
        mahjongs.sort() ;
        panelGroup._mahjongs =mahjongs ;
        var type = 0 ;
        if (data.type!=undefined){
            type = data.type ;
            if (type == 2){
                this.countPlayOutMahjong(data.pai[0],1);
            }else if (type ==3){
                this.countPlayOutMahjong(data.pai[0],4);
            }
        }else{
            this.countPlayOutMahjong(data.pai[0]);
            this.countPlayOutMahjong(data.pai[2]);
        }
        for (var i=0;i<mahjongs.length;i++){
            var key = "ImgMahjong"+i ;
            var img = this.getImgByDirForOutGroup(dir,mahjongs[i]);
            if (type !=0 && type == 1){ //暗杠
                if (dir !=MY_DIRECTION || i != mahjongs.length-1){
                    img = common.ImgConcealedKong[dir] ;
                }
            }
            var sprite = ccui.helper.seekWidgetByName(panelGroup, key) ;
            sprite.setTag(mahjongs[i]+i) ;
            sprite.loadTexture(img) ;
            var value = mahjongs[i] ;
            if (!this._outSpriteByValue.hasOwnProperty(value)){
                this._outSpriteByValue[value] = [] ;
            }
            this._outSpriteByValue[value].push(sprite);
        }
        if (mahjongs.length < 4){
            ccui.helper.seekWidgetByName(panelGroup, "ImgMahjong3").setVisible(false) ;
        }
        var pos = this.getPositionByDirForGroup(dir);
        panelGroup.setPosition(pos) ;
        this._panelOutGroupArr[dir].push(panelGroup);
    },

    /**
     * 处理玩家亮出来的牌
     * @param dir  玩家的位置
     * @param mahjongs
     */
    dealBrightCard:function(dir,mahjongs){
        mahjongs.sort(function (a,b) {
            return b-a ;
        });
        var panelGroup = this._panelOutGroup[dir].clone() ;
        panelGroup.setVisible(true) ;
        this._panelOutGroup[dir].getParent().addChild(panelGroup);
        for (var i=0;i<mahjongs.length;i++){
            var key = "ImgMahjong"+i ;
            this.countPlayOutMahjong(mahjongs[i]);
            var img = this.getImgByDirForOutGroup(dir,mahjongs[i]);
            var sprite = ccui.helper.seekWidgetByName(panelGroup, key) ;
            sprite.setTag(mahjongs[i]+i) ;
            sprite.loadTexture(img) ;
        }
        ccui.helper.seekWidgetByName(panelGroup, "ImgMahjong3").setVisible(false) ;
        var pos = this.getPositionByDirForGroup(dir);
        panelGroup.setPosition(pos) ;
        this._panelOutGroupArr[dir].push(panelGroup);
    },

    /**
     * 重置手牌的位置
     * @param dir
     * @param type   杠  1 暗杠 2, 碰了之后的杠 3, 明杠
     */
    resetMahjongPosition:function(dir,type){
        var length = _.min([this._playerData[dir].mahjong.length,this._playerCards[dir].length]) ;
        console.log(" resetMahjongPosition length ",length,this._playerCards[dir].length);
        var size = this._panelOutGroup[dir].getContentSize();
        var groupPos = (_.last(this._panelOutGroupArr[dir])).getPosition();
        var mahSize = this.getMahjongSize(dir) ;
        for (var num=0;num<length;num++){
            this.moveMahjongPosition(dir,this._playerCards[dir][num],size,groupPos,mahSize,num);
        }
        if (this._isReLine != true && type == undefined){
            num = length -1 ;
        }
        num += 0.5 ;
        if (dir == 0 || dir == 2){
            num += 0.8;
        }
        this.moveMahjongPosition(dir,this._playerCardsNew[dir] ,size,groupPos,mahSize,num );
    },


    /**
     * 移动牌的坐标
     * @param dir
     * @param spr
     * @param size
     */
    moveMahjongPosition:function(dir,spr,size,groupPos,mahSize,num){
        var oldPos = spr.getPosition();
        switch (dir){
            case 0:
                spr.setPosition(cc.p(oldPos.x,groupPos.y -size.height/2 - num*mahSize.height -20));
                break;
            case 1:
                spr.setPosition(cc.p(groupPos.x + size.width + num*mahSize.width + 20,oldPos.y));
                break ;
            case 2:
                spr.setPosition(cc.p(oldPos.x,groupPos.y + size.height/2 + num*mahSize.height+50));
                break ;
            case 3:
                spr.setPosition(cc.p(groupPos.x-size.width/2 -num*mahSize.width- 20,oldPos.y));
                break ;
        }
    },
    /**
     * 根据位置计算出吃牌or碰牌or 杠牌的位置
     * @param dir
     */
	getPositionByDirForGroup:function(dir){
        var length = this._panelOutGroupArr[dir].length ;
        var pos = this._panelOutGroup[dir].getPosition() ;
        var size = this._panelOutGroup[dir].getContentSize();
        if (length == 0){
            return pos ;
        }
        switch (dir){
            case 0:
                pos.y -= length*size.height ;
                break;
            case 1:
                pos.x  = length*size.width ;
                break;
            case 2:
                pos.y += length*size.height ;
                break;
            case 3:
                pos.x -=length* size.width;
                break;
        }
        return pos ;
    },

    getImgByDirForOutGroup:function(dir,value){
        return "res/ui/mahjong/" + GROUP_CARD_BY_IMAGE[dir]+value + ".png"
    },

    /**
     * 打出去的牌 根据位置定位到图片
     * @param dir
     * @param value
     */
	getImgByDirForOutMahjong:function(dir,value ){
	    console.log(" getImgByDirForOutMahjong "+ dir+" value "+ value);
        return "res/ui/mahjong/" + CARD_NAME_BY_DIRECTION[dir]+value + ".png" ;
    },

    /**
     * 打出去的杠牌
     * @param dir
     * @param value
     */
    getImgByDirForKongOutMahjong:function(dir,value ){
        return "res/ui/mahjong/" + KONG_CARD_NAME_BY_DIRECTION[dir]+value + ".png" ;
    },


    /**
     * 玩家打出去的杠牌
     * @param direct
     * @param value
     */
    dealDiscardKongRecord:function(direct,value,isLaiziPi){
        this.countPlayOutMahjong(value);
        var length = this._playerPlayOutKongMahjong[direct].length ;
        var lineNo = parseInt((length-1) / 6) ;  //计算要不要换行
        var curLineNo = (length -1) % 6 ; //当前行的第几个
        if (direct == 0 || direct == 2){  //左右两边玩家竖着放一整行  不需要换行
            lineNo = 0;
            curLineNo =  length -1 ;
        }
        var size = this._panelKongOutCardsParent[direct].getContentSize();
        var posX = 0 ;
        var posY = 0 ;
        var img = this.getImgByDirForKongOutMahjong(direct,value) ;
        var sprite = new cc.Sprite(img);
        //所有已经出的牌都记录到一个对象里
        if (!this._outSpriteByValue.hasOwnProperty(value)){
            this._outSpriteByValue[value.toString()] = [] ;
        }
        this._outSpriteByValue[value.toString()].push(sprite) ;
        sprite.tag = 2000 + length  ;
        this._panelKongOutCardsParent[direct].addChild(sprite);
        var imgOut = "res/ui/table/l_out_highlight.png";
        var flagPos = cc.p(0,0);
        //（0 从上往下  1 从左往右  2 从下往上  3 从右往左）
        switch(direct){
            case 0:
                var spriteSize = cc.size(88,46);
                posX = spriteSize.width/2 +30;
                posY =  size.height - (curLineNo+0.5) * spriteSize.height -25 ;
                flagPos = cc.p(spriteSize.width/2+10,spriteSize.height/2+15);
                break;
            case 1:
                var spriteSize = cc.size(62,80);
                posX = (curLineNo+0.5)*spriteSize.width + 20   ;
                posY =  (lineNo+0.5) *spriteSize.height -4 ;
                sprite.zIndex = 100 - lineNo ;
                imgOut = "res/ui/table/d_left_highlight.png";
                flagPos = cc.p(spriteSize.width/2+10,spriteSize.height/2+20);
                break;
            case 2:
                var spriteSize = cc.size(88,46);
                posX = spriteSize.width/2 -20 ;
                posY = (curLineNo+0.5) * spriteSize.height ;
                sprite.zIndex = 100 - curLineNo*(1+lineNo ) ;
                flagPos = cc.p(spriteSize.width/2+10,spriteSize.height/2+15);
                break;
            case 3:
                var spriteSize = cc.size(62,80);
                posX = size.width - (curLineNo+0.5)* spriteSize.width;
                posY =size.height- (lineNo+0.5) * spriteSize.height -15;
                imgOut = "res/ui/table/d_out_highlight.png";
                flagPos = cc.p(spriteSize.width/2+7,spriteSize.height/2+18);
                break;
        }
        sprite.x = posX ;
        sprite.y = posY ;
        sprite.anchorX = 0.5 ;
        sprite.anchorY = 0.5 ;
        this.showSpriteOutLight(sprite,flagPos,imgOut);
        if (isLaiziPi != undefined && isLaiziPi== true){
            return ;
        }
        this.playOperateFlagAction(direct,value,sprite);
    },

    /**
     * 处理出牌的纪录
     * direct:方向  每行、列放8个
     * @param direct
     * @param value
     */
	dealDiscardRecord:function(direct,value,isLaiziPi){
	    this.countPlayOutMahjong(value);
		var length = this._playerPlayOutMahjong[direct].length ;
		var lineNo = parseInt((length-1) / 8) ;  //计算要不要换行
		var curLineNo = (length -1) % 8 ; //当前行的第几个
		var size = this._panelOutCardsParent[direct].getContentSize();
		var posX = 0 ;
		var posY = 0 ;
		console.log("director : "+ direct + " value : "+ value) ;
		var img = this.getImgByDirForOutMahjong(direct,value) ;
        var sprite = new cc.Sprite(img);
        console.log("dealDiscardRecord tag direct "+direct + " value "+ value +" tag:"+ (1000 + length));
        if (!this._outSpriteByValue.hasOwnProperty(value)){
            this._outSpriteByValue[value.toString()] = [] ;
        }
        this._outSpriteByValue[value.toString()].push(sprite) ;
        sprite.tag = 1000 + length  ;
        this._panelOutCardsParent[direct].addChild(sprite);
        console.log("direct: "+ direct + " lineNo:"+ lineNo+ " curLineNo:"+ curLineNo);
		//（0 从上往下  1 从左往右  2 从下往上  3 从右往左）
        var imgOut = "res/ui/table/l_out_highlight.png";
        var flagPos = cc.p(0,0);
		switch(direct){
			case 0:
			    var spriteSize = cc.size(90,54);
                posX = size.width-  (lineNo+0.5) * spriteSize.width +30;
                posY = size.height - (curLineNo+0.5) *spriteSize.height -70 ;
                flagPos = cc.p(spriteSize.width/2+9,spriteSize.height/2+30);
				break;
			case 1:
                var spriteSize = cc.size(62,80);
                posX = curLineNo*spriteSize.width+40 ;
                posY = size.height - (lineNo+0.5) *spriteSize.height -24 ;
                imgOut = "res/ui/table/d_out_highlight.png";
                flagPos = cc.p(spriteSize.width/2+7,spriteSize.height/2+18);
                break;
			case 2:
                var spriteSize = cc.size(90,54);
                posX =  (lineNo+0.5) * spriteSize.width -20;
                posY = (curLineNo+0.5) * spriteSize.height ;
                sprite.zIndex = EACH_HISTORY_LINE_CARDS-curLineNo ;
                flagPos = cc.p(spriteSize.width/2+9,spriteSize.height/2+30);
				break;
			case 3:
                var spriteSize = cc.size(62,80);
                posX = size.width - (curLineNo+0.5)* spriteSize.width ;
                posY = (lineNo+0.5) * spriteSize.height+25;
                sprite.zIndex = 100 - lineNo*(1+ curLineNo) ;
                imgOut = "res/ui/table/d_out_highlight.png";
                flagPos = cc.p(spriteSize.width/2+7,spriteSize.height/2+18);
				break;
		}
        sprite.x = posX ;
		sprite.y = posY ;
        sprite.anchorX = 0.5 ;
        sprite.anchorY = 0.5 ;
        this.showSpriteOutLight(sprite,flagPos,imgOut);
        if (isLaiziPi != undefined && isLaiziPi== true){
            return ;
        }
        this.playOperateFlagAction(direct,value,sprite);

	},

    /**
     * 出的牌外面的框  用于出牌的时候  亮出来一下
     * @param parent
     * @param flagPos
     * @param img
     */
	showSpriteOutLight:function(parent,flagPos,img){
        var spr = new cc.Sprite(img);
        spr.anchorX = 0.5 ;
        spr.anchorY = 0.5 ;
        spr.setTag(1002) ;
        spr.setPosition(flagPos) ;
        spr.setVisible(false) ;
        parent.addChild(spr);
    },

	//屏蔽用户牌的点击事件
	disableClickMyCard:function(){
        for (var num =0;num<this._playerCards[MY_DIRECTION].length;num++){
            this._playerCards[MY_DIRECTION][num].setTouchEnabled(false);
        }
	},

	//轮到用户出牌 使可点击
	enableClickMyCard:function(){
        for (var num =0;num<this._playerCards[MY_DIRECTION].length;num++){
            if (this._playerCards[MY_DIRECTION][num] != null){
                this._playerCards[MY_DIRECTION][num].setTouchEnabled(true);
            }
        }
	},

	//计时器
	timerCountDown:function(){
		this._labelTimer.setString(this._timer);
		this._timer-- ;
		//添加震动  参数为震动时长  单位毫秒  需判断当前玩家
        // if(this._timer==5){
         //    if(cc.sys.os==cc.sys.OS_ANDROID) {
         //        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "Vibrate", "(Ljava/lang/String;)V", "1000");
         //    }
        // }
		if (this._timer <= 0){ //TODO 这里应该要帮玩家出牌  但是现在还没做
            // this._labelTimer.setVisible(false) ;
            this.unschedule(this.timerCountDown) ;
		}
	},

    /**
     * 开始计时器
     */
	beginTimerCountDown:function(){
        this._labelTimer.setVisible(true);
        this._timer = ROUND_TIMER ;
        if (this._timer<10){
            this._labelTimer.setString("0"+this._timer.toString());
        }else{
            this._labelTimer.setString(this._timer);
        }
        this.schedule(this.timerCountDown,1);
	},

    /**
     * 重置计时器
     */
	resetTimerCountDown:function(){
        this.unschedule(this.timerCountDown) ;
        this._labelTimer.setVisible(true);
        this._timer = ROUND_TIMER ;
        if (this._timer<10){
            this._labelTimer.setString("0"+this._timer.toString());
        }else{
            this._labelTimer.setString(this._timer);
        }
        this.schedule(this.timerCountDown,1);
    },

	//返回大厅
	btnBackClicekd:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        var roomNo = this._curRoomNo;
        var params = {
            desc:common.TipsDesc.OwnerBackToLobbyBeforeGameStart,
            close:true
        };
        if(this._isGameStarted == false && this._curRound <=1) {//牌局未开始
            if (this._myInfo._id != this._gameData.ownerUid) { //非房主  直接离开房间
                params.desc = common.TipsDesc.PlayerBackToLobby;
                params['confirmOnly'] = function () {
                    net.NetManage.leaveRoom({roomNo: roomNo});
                }
            } else { //房主  返回大厅给房主保留房间
                params['confirmOnly'] = function () {
                    game.LocalData.setCurRoomNo(roomNo);
                    game.Notification.send(common.NotifyType.GO_TO_LOBBY);
                }
            }
            this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
        }else{
            //牌局开始 所有玩家返回大厅 都保留房间
            params['confirmOnly'] = function () {
                game.LocalData.setCurRoomNo(roomNo);
                game.Notification.send(common.NotifyType.GO_TO_LOBBY);
            }
            this.send(common.NotifyType.SHOW_TIPS_PANEL, params);
        }
	},

	//语音
    btnSpeakClicked:function(widget, touchType){
        console.log("btnSpeakClicked  touchType "+touchType);
        this.closeCurPopLayer() ;
	    var self = this ;
	    if (touchType == ccui.Widget.TOUCH_BEGAN){
            this._startY = 0 ;
            if ('touches' in cc.sys.capabilities) {
                console.log("---touches--->");
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                    onTouchesMoved: function (touches, event) {
                        var delta = touches[0].getDelta();
                        self._startY = delta.y ;
                        return true;
                    }
                }, this);
            }else if ('mouse' in cc.sys.capabilities) {
                console.log("---mouse--->");
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseMove: function (event) {
                        if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                            self._startY += event.getDelta().y ;
                    }
                }, this);
            }
            var gid = this._gameData.gid ;
            if(cc.sys.os==cc.sys.OS_ANDROID){
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager", "prepareAudio", "(Ljava/lang/String;)V",gid);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("IFlyManager", "iflyStartRecord");
            }
            this._imgRecording.setVisible(true);
        }else if (touchType == ccui.Widget.TOUCH_CANCELED){
            console.log(" =========取消========this._startY  ",this._startY);
            if(cc.sys.os==cc.sys.OS_ANDROID){
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager", "cancle", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("IFlyManager", "iflyCancelRecord");
            }
            this._imgCancelVoice.setVisible(false) ;
        }else if (touchType == ccui.Widget.TOUCH_MOVED){
            console.log(" =========移动======== this._startY  ",this._startY);
            if (this._startY > 30){
                this._imgRecording.setVisible(false);
                this._imgCancelVoice.setVisible(true) ;
            }else{
                this._imgRecording.setVisible(true);
                this._imgCancelVoice.setVisible(false) ;
            }
        }else if (touchType ==ccui.Widget.TOUCH_ENDED){
            console.log(" =========结束======== this._startY  ",this._startY);
            var gid = this._gameData.gid ;
            if(cc.sys.os==cc.sys.OS_ANDROID){
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager", "release", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("IFlyManager", "iflyStopRecordAndSendAudioMessageWithGid:",gid);
            }
            this._imgRecording.setVisible(false);
            this._imgCancelVoice.setVisible(false) ;

            var params = {
                roomNo:this._curRoomNo,
                message:common.MessageType.Voice
            };
            console.log(" AudioManager  ",params);
            net.NetManage.sendMessage(params);

        }
    },

	//帮助
	btnHelpClicekd:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            this.send(common.NotifyType.SHOW_HELP_PANEL);
        }
    },

	//设置
	btnSettingClicekd:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        this.send(common.NotifyType.SHOW_SETTING_PANEL,{from:"RunLayer"});
    },

	//托管--->不需要已隐藏
	btnTrusteeshipClicekd:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED)  return ;
        var params={
            desc : "我要托管——功能稍后",
            confirmOnly:function(){
                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
            },
            close:true
        };
        game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params) ;
    },
	//取消托管
	btnCancelTrusteeshipClicekd:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
			this._btnCancelTrusteeship.setVisible(false);
			this._btnTrusteeship.setVisible(true);
			//TODO 处理取消托管逻辑  只可能主动取消托管
        }
    },
    //TODO 处理托管逻辑  自动托管&主动托管
	trusteeship:function(){
        this._btnTrusteeship.setVisible(false);
        this._btnCancelTrusteeship.setVisible(true) ;
	},

	//先关闭当前显示的层
	closeCurPopLayer:function(showLayer){
        if  (this._lastClickedCards!=null){
            this._lastClickedCards.setPositionY(0) ;
        }
		if (this._curPopLayer == showLayer){
			return ;
		}
        if (this._curPopLayer != null){
            this._curPopLayer.setVisible(false) ;
        }
        this._curPopLayer = showLayer;
	},

	//查看癞子和杠牌
	btnLaiziClicekd:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
        	this.closeCurPopLayer(this._imgPopLaizi);
        	var isVisible = !this._imgPopLaizi.isVisible() ;
            widget.setHighlighted(isVisible);

            var laiZi = this._gameData.laizi ;
            this._imgPopLaizi.setVisible(isVisible);
            var imgLaiZiBase = ccui.helper.seekWidgetByName(this._imgPopLaizi,"ImgLaizi");
            var imgLaiZi = ccui.helper.seekWidgetByName(imgLaiZiBase,"ImgCard");
            imgLaiZi.loadTexture(CARD_LAI_ZI_IMAGE+laiZi+".png");
            var kongValue = this._onlyKongValue ;
            var kongArr = _.without(kongValue,laiZi) ;
            var imgKongBase = ccui.helper.seekWidgetByName(this._imgPopLaizi,"ImgKong");
            var isShowKong = (kongArr.length > 0)? true : false ;
            imgKongBase.setVisible(isShowKong);
            if (isShowKong == false){
                return ;
            }

            for (var i=0;i<kongArr.length;i++){
                var imgKey = "ImgKong"+(i+1);
                var imgKong = ccui.helper.seekWidgetByName(imgKongBase,imgKey);
                imgKong.loadTexture(CARD_LAI_ZI_IMAGE+kongArr[i]+".png") ;
                imgKong.setVisible(true) ;
            }
            if (kongArr.length<2){
                ccui.helper.seekWidgetByName(imgKongBase,"ImgKong2").setVisible(false) ;
            }
        }
    },

    btnChatClicked:function(widget, touchType) {
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log(" +++++++btnChatClicked+++++");
        this.closeCurPopLayer(this._imgPopChat);
        var isVisible = !this._imgPopChat.isVisible() ;
        this._imgPopChat.setVisible(isVisible);
        if (isVisible == false)return ;
        this._imgEmoji.setVisible(true) ;
        this._imgText.setVisible(false) ;
        this._btnEmoji.setTouchEnabled(false) ;
        this._btnText.setTouchEnabled(true) ;
    },

    btnChatContentClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log(" +++++++btnChatContentClicked+++++");
	},


    //胡牌提示
    btnWinTipClicked:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
        	this.closeCurPopLayer(this._imgPopWinTip);
        	var isVisible = !this._imgPopWinTip.isVisible() ;
        	this._imgPopWinTip.setVisible(isVisible) ;
        	if (isVisible == false){
        	    return ;
            }
            var imgSize = this._imgPopWinTip.getContentSize() ;
            this._imgPopWinTip.removeChildByTag(1000) ;
            var imgItem = ccui.helper.seekWidgetByName(this._imgPopWinTip,"ImgCardBg") ;
            imgItem.setVisible(false) ;
            var canWin = this._preCheck.canHu(this._playerData[MY_DIRECTION]);
        	console.log("btnWinTipClicekd canWin " ,canWin);
            if (_.isEmpty(canWin)){
                var tips = new cc.LabelTTF("您还没有听牌","TengXiang",34);
                tips.setPosition(cc.p(imgSize.width/2,imgSize.height/2));
                tips.setTag(1000) ;
                this._imgPopWinTip.addChild(tips);
                return ;
            }
            this.dealWinTipsCard(canWin,this._imgPopWinTip,1);
        }
    },

    /**
     * 计算两个玩家之间的距离
     */
	getPlayerDistance:function(user1,user2){
	    console.log(" getPlayerDistance  user1 ",user1);
	    console.log(" getPlayerDistance  user2 ",user2);
	    console.log(" getPlayer Distance lat ,lon",user1.latitude,user1.longitude ,user2.latitude,user2.longitude);
        if (cc.sys.os == cc.sys.OS_ANDROID){
            var distance = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDistance", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)F",user1.latitude.toString(),user1.longitude.toString() ,user2.latitude.toString(),user2.longitude.toString() );
            console.log("getPlayerDistance distance ",distance);
            return distance ;
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var distance = jsb.reflection.callStaticMethod("ZYLocationManager", "distanceWithLoc1Longtitude:loc1Latitude:loc2Longtitude:loc2Latitude:",user1.longitude, user1.latitude,user2.longitude,user2.latitude );
            console.log("=== iOS == getPlayerDistance distance ",distance);
            return distance ;
        } else {
            return 0 ;
        }
    },

    /**
     * 复制房间号的按钮User
     * @param widget
     * @param touchType
     */
    btnCopyRoomNoClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        if (cc.sys.os == cc.sys.OS_ANDROID){
            var text = this._curRoomNo ;
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","CopyClipboard","(Ljava/lang/String;)V",text);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var text = this._curRoomNo ;
            jsb.reflection.callStaticMethod("EleUtil", "copyToPasteboard:",text);
        } else {
            this.send(common.NotifyType.SHOW_POPUP_MESSAGE,{msg:"暂不支持该平台"}) ;
        }
    },

    /**
     * 邀请玩家
     * @param widget
     * @param touchType
     */
	btnWeChatInviteClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        //暂时的处理
        var title = "房间号："+this._curRoomNo ;
        var str =" 您的好友 "+this._playerData[MY_DIRECTION].nickname+" 邀请您来 碰碰湖 大战 三百回合";
        if (cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","sendMsgToFriend","(Ljava/lang/String;Ljava/lang/String;)V",title,str);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("WeChatHelper", "wechatShare:title:description:webpageUrl:", "1", title, str, "http://www.elepok.com/gameCenter.html");
        }
	},

	btnStartPrepareClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        this.clearTable() ;
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.userReady(params);

    },

    testGameStart:function(){
        this.onGameStart(this._gameData,this);
    },

    /**
     * 下一局
     */
    nextRound:function(obj,target){
        target.lightCard();
        target._btnPrepare.setVisible(true) ;
        target._btnWeChatInvite.setVisible(false) ;
        target._btnCopyRoomNo.setVisible(false);

    },

    //点击胡牌
    btnWinClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log("btnWinClicked " ) ;
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.handlerHu(params);
        this.hideOperationButton();
    },
    //点击杠牌
    btnKongClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        var params = {
            roomNo:this._curRoomNo,
            mahjong:this._kongGroup.pai
        };
        console.log(" params handler Kong ",params);
        net.NetManage.handlerGang(params);
        this.hideOperationButton();
    },
    //点击碰牌
    btnPongClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.handlerPeng(params);
        this.hideOperationButton();
    },
    //点击吃牌
    btnChowClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        var isChow = this._totalChowArr ;
        var mahjong = widget._mahjong ;
        var chowType = Math.floor((isChow.length)/3) ;  //看有几种吃的类型  吃的时候最少一种可能  最多3中可能
        var group = [] ;
        if (chowType == 1){
            _.each(isChow,function(value){
                if (value != mahjong){
                    group.push(value) ;
                }
            })
            this.doChow(group) ;
        }else{
            var chowPosXArr = this.caculateChowPosition(chowType);
            for (var i=0;i<chowType;i++){
                var start = i*3;
                var chowArr = [];
                chowArr.push(isChow[start++]);
                chowArr.push(isChow[start++]);
                chowArr.push(isChow[start++]);
                var chiSprite = this._imgChowBackground.clone() ;
                chiSprite.setPositionX(chowPosXArr[i]) ;
                var group = [] ;
                var imgKey = 1;
                chowArr.sort();
                _.each(chowArr,function(value){
                    if (value != mahjong){
                        group.push(value) ;
                    }
                    var key = "ImgChow" + imgKey;
                    var img = CARD_LAI_ZI_IMAGE+value+".png" ;
                    ccui.helper.seekWidgetByName(chiSprite, key).loadTexture(img);
                    imgKey++;
                });
                chiSprite.chowGroup = JSON.stringify(group);
                chiSprite.setVisible(true) ;
                chiSprite.setTouchEnabled(true) ;
                chiSprite.addTouchEventListener(this.chowGroupSelect,this) ;
                this._panelChowGroup.push(chiSprite);
                this._imgChowBackground.getParent().addChild(chiSprite);
            }
        }
    },
    //点击过牌
    btnPassClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.cannelAction(params);
    },

    /**
     * 玩家亮牌
     * @param widget
     * @param touchType
     */
    btnBrightClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.brightMahjong(params) ;
    },
    /**
     * 取消亮牌
     * @param widget
     * @param touchType
     */
    btnCancelBright:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        var params = {
            roomNo:this._curRoomNo
        };
        net.NetManage.cannelbrightMahjong(params);
        this._btnOperateShow.setVisible(false) ;
        this._btnOperateCancelBright.setVisible(false) ;
    },

    onExit:function () {
        this.unsubscrib();
        this.uiHelper.clearRes();
        this._super();
    },
    
    onGameEnd:function (obj,target) {
        console.log("..............onGameEnd............",obj);
        target.clearTable();

    },

    /**
     * 游戏局数
     */
    updateGameRoundInfo:function(){
        this._labelAtlasCurRound.setString(this._gameData.round);
        this._labelAtlasTotalRound.setString(this._gameData.roundCount);
    },

    /**
     * 游戏开始之前会隐藏掉一些空间，游戏开始之后显示
     */
    showControlAfterGameBegin:function(){
        // this._btnWin.setVisible(true) ;
    },

    /**
     * 游戏开始之后隐藏掉的控件
     */
    hideAfterGameBegin:function(){
        this._btnOwnerDisband.setVisible(false);//游戏开始后 解散 返回按钮消失
        this._btnBackLobbyInTable.setVisible(false);
        this._btnPrepare.setVisible(false);
        this._imgWordTips.setVisible(false);
    },
    /**
     * 牌局开始
     * @param obj
     * @param target
     */
    onGameStart:function(obj,target){
        console.log("..............onGameStart............",JSON.stringify(obj));
        target.clearTable();
        target.hideAfterGameBegin();
        target._isGameStarted = true ;
        target.showControlAfterGameBegin();
	    if (target._curPopLayer!=null){
            target._curPopLayer.setVisible(false) ;
        }
        target.initRoomData(obj);
	    for (var i=0;i<4;i++){
            ccui.helper.seekWidgetByName(target._playerInfo[i], "ImgPrepareStatus").setVisible(false) ;
        }
        target.updateGameRoundInfo();
        target.initTableData();
        target.playWordTips(common.ShowWordType.TYPE_GAME_START) ; //显示对局开始
        target.bankerConfirm();
        //庄确定
        //TODO 游戏特效
        //发牌
        target.scheduleOnce(target.dealCards,1) ;  //1秒之后开始发牌
    },

    onPlayerEnter:function(obj,target){
        console.log("..............onPlayerEnter............",obj);
        console.log(" _playerData  ",target._playerData);
        var flag = false ;
        var playerCount = 0 ;
        for (var i=0;i< common.TableDirection.length;i++){
            var key = (i+1) > 3 ? 0 : (i+1);
            console.log(" key : " +key);
            console.log(" _.isEmpty(this._playerData[key]) " + _.isEmpty(target._playerData[key]));
            if (_.isEmpty(target._playerData[key]) && target._playerData[MY_DIRECTION].uid !=obj.uid && flag == false){
                target._playerData[key]  = obj;
                target._tmpHeadImg[obj.uid] = key;
                target.updatePlayerStatus(key,obj.status);
                target.showPlayerHeadPic(key);
                flag = true ;
                var str ="玩家"+ obj.nickname + " 加入了房间 ";
                var distance = target.getPlayerDistance(target._playerData[MY_DIRECTION],obj) ;
                if (distance!=0){
                    if (distance > 1000){
                        var dis = (distance/1000).toFixed(2) ;
                        str += "距您"+dis+"公里";
                    }else{
                        str += "距您" + distance + "米";
                    }
                }
                target.send(common.NotifyType.SHOW_POPUP_MESSAGE,{msg:str});
            }
            if (!_.isEmpty(target._playerData[key])){
                playerCount++ ;
            }
        }
        if (playerCount >= 4 ){
            target._btnWeChatInvite.setVisible(false) ;
            target._btnCopyRoomNo.setVisible(false) ;
            target._btnPrepare.setVisible(true) ;
            if(cc.sys.os==cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "Vibrate", "(Ljava/lang/String;)V", "1000");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("EleUtil", "playVibration");
            }
        }

    },

    onPlayerExit:function(obj,target){
        console.log("................onPlayerExit..........",obj);
    },

    /**
     * 用户自己点了准备的返回值
     * @param obj
     * @param target
     */
    onPlayerReady:function(obj,target){
        console.log("..............onPlayerReady............",obj);
        target._btnPrepare.setVisible(false);
        target.updatePlayerStatus(MY_DIRECTION,1) ;
        target._playerData[MY_DIRECTION].status = common.PlayerStatus.STATUS_PREPARING;
        target.playWordTips(common.ShowWordType.TYPE_PREPARING,true) ;

    },

    /**
     * 其他玩家点了准备的推送通知
     * @param obj
     * @param target
     */
    onOtherPlayerReady:function(obj,target){
        console.log("..............onOtherPlayerReady............",obj);
        for (var i=0;i<target._playerData.length;i++){
            console.log(" _.isEmpty(target._playerData[i] " + _.isEmpty(target._playerData[i]));
            console.log(i,target._playerData[i]);
            if (!_.isEmpty(target._playerData[i]) && target._playerData[i].uid == obj.uid){
                target.updatePlayerStatus(i,common.PlayerStatus.STATUS_PREPARING);
                return ;
            }
        }
    },

    /**
     * 玩家在线
     * @param obj
     * @param target
     */
    onUserLine:function(obj,target){
        console.log("..............onUserLine............",obj);
        for (var i=0;i<target._playerData.length;i++){
            if (!_.isEmpty(target._playerData[i])&&target._playerData[i].uid == obj.uid){
                target.updatePlayerStatus(i,common.PlayerStatus.STATUS_IN_GAME) ; //更新托管状态
                return ;
            }
        }
    },

    /**
     * 玩家离开房间
     * @param obj
     * @param target
     */
    onUserLeave:function(obj,target){
        console.log("..............onUserLeave............",obj);
        target.closeCurPopLayer();
        var uid = obj.uid ;
        var dir = 0 ;
        var player = {} ;
        for (var i=0;i<target._playerData.length;i++){
            if (!_.isEmpty(target._playerData[i]) && uid ==target._playerData[i].uid){
                dir = i ;
                var oriPlayer = JSON.stringify(target._playerData[i]) ;
                player = JSON.parse(oriPlayer) ;
                break ;
            }
        }
        if ( uid == target._myInfo._id){
            console.log("-------common.TipsDesc.BeKickedOut------------",common.TipsDesc.BeKickedOut);
            var params={
                desc : common.TipsDesc.BeKickedOut,
                confirmOnly:function(){
                    game.Notification.send(common.NotifyType.GO_TO_LOBBY) ;
                }
            };
            game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params) ;
            return ;
        }else if (obj.hasOwnProperty(msg)){
            target.send(common.NotifyType.SHOW_POPUP_MESSAGE,{mgs:obj.msg});
        }else{
            var nickname = player.nickname ;
            var desc = common.TipsDesc.PlayerLeaveRoom ;
            var msg = desc.replace(/%s/,nickname) ;
            target.send(common.NotifyType.SHOW_POPUP_MESSAGE,{msg:msg});
        }
        target.dealStatusWhenPlayerLeave(dir);

    },

    /**
     * 当有用户的时候
     * @param dir
     */
    dealStatusWhenPlayerLeave:function(dir){
        for (var i=0;i<common.TableDirection.length;i++){
            this.updatePlayerStatus(dir,0);
        }
        this._playerData[dir] = {};
        this._playerInfo[dir].setVisible(false);
        this._btnPrepare.setVisible(false);
        this._btnWeChatInvite.setVisible(true);
        this._btnCopyRoomNo.setVisible(true);
        this._imgWordTips.setVisible(false);

    },


    /**
     * 玩家离线
     * @param obj
     * @param target
     */
    onUserOffLine:function(obj,target){
        console.log("..............onUserOffLine............",obj);
        for (var i=0;i<target._playerData.length;i++){
            if (!_.isEmpty(target._playerData[i])&&target._playerData[i].uid == obj.uid){
                target.updatePlayerStatus(i,common.PlayerStatus.STATUS_UN_LINE) ; //更新托管状态--》更新离线状态
                return ;
            }
        }
    },

    /**
     * 弹出提示框
     * @param obj
     * @param target
     */
    showPopupInfo:function(obj,target){
        console.log("showPopupInfo obj ",obj);
        target._imgMessageTips.setVisible(true) ;
        ccui.helper.seekWidgetByName(target._imgMessageTips, "Label").setString(obj.msg) ;
        target.scheduleOnce(target.hidePopupInfo,2);
    },

    /**
     * 隐藏提示框
     */
    hidePopupInfo:function(){
        this._imgMessageTips.setVisible(false);
    },

    /**
     * 玩家出牌之后的响应
     * @param obj
     * @param target
     */
    handlePlayMahjong:function(obj,target){
        console.log(" handlePlayMahjong ",obj);
        for (var i=0;i<target._playerCards[MY_DIRECTION].length;i++){
            target.hidePlayToTingFlag(target._playerCards[MY_DIRECTION][i]);
        }
        target.hidePlayToTingFlag(target._playerCardsNew[MY_DIRECTION]);
    },

    /**
     * 统计打出去的牌的数量
     * @param mahjong
     * @param count  增加的数量
     */
    countPlayOutMahjong:function(mahjong,count){
        if (count == undefined){
            count = 1 ;
        }
        if (this._outMahjong.hasOwnProperty(mahjong.toString())){ //已经打出去的牌
            this._outMahjong[mahjong.toString()] += count ;
        }else{
            this._outMahjong[mahjong.toString()] = count ;
        }
    },

    /**
     * 其他玩家出牌
     * @param obj
     * @param target
     */
    onPlayMahjong:function(obj,target){
        console.log("onPlayMahjong ",obj);
        var dir = 0 ;
        var outPlayer = {};
        var mahjong = obj.mahjong ;
        for (var i=0;i<target._playerData.length;i++){
            if (target._playerData[i].uid == obj.uid){
                dir = i ;
                outPlayer = target._playerData[i] ;
                break ;
            }
        }
        common.soundManage.playMahjongEffect(outPlayer.sex,mahjong);
        if (this._isReLine == true){
            if (target._playerData[MY_DIRECTION].isAction != 0){
                target.checkIsShowOperatePanel(obj.uid,mahjong);
            }
            return ;
        }
        if (dir != MY_DIRECTION){ //不是我自己打来的牌 才去检测
            target.checkIsShowOperatePanel(obj.uid,mahjong,obj.huUserIdArr);
        }
        if (target._kongValue.indexOf(mahjong)!=-1){ //打出来的是杠牌
            target._playerPlayOutKongMahjong[dir].push(mahjong) ;
            target.dealDiscardKongRecord(dir,mahjong)
        }else{
            target._playerPlayOutMahjong[dir].push(mahjong) ;
            target.dealDiscardRecord(dir,mahjong) ;
        }
        if (dir == MY_DIRECTION){ //对于自己 要刷新牌面
            if (target._lastClickedCards!=null){
                target._lastClickedCards.setPositionY(0);
            }
            target._ClickedCardNo = -1 ;
            console.log("onPlayMahjong before dir "+dir +" mahjong "+mahjong,target._playerData[dir].mahjong);
            var index = _.indexOf(target._playerData[dir].mahjong,mahjong);
            console.log(" index ",index);
            target._playerData[dir].mahjong.splice(index,1);
            console.log("onPlayMahjong after dir "+dir +" mahjong "+mahjong,target._playerData[dir].mahjong);
            target.refreshUserCards() ;
            target.disableClickMyCard();
        }else{
            target._playerData[dir].mahjong.pop();
            if (target._playerCardsNew[dir].isVisible() == true){
                target._playerCardsNew[dir].setVisible(false);
            }else{
                target.otherPlayerPopCards(dir,1) ;
            }
        }
        target._playerCardsNew[dir].setVisible(false) ;  //隐藏掉玩家最新抓的一张牌
        target.checkCanWin() ;
    },

    /**
     * 检查是否能胡牌  是否显示胡牌提示
     */
    checkCanWin:function(){
        var canWin = this._preCheck.canHu(this._playerData[MY_DIRECTION]);
        this._btnWin.setVisible(!_.isEmpty(canWin)) ;
        this._btnWin.setTouchEnabled(true) ;
 ;    },

    /**
     * 检查是否吃碰杠胡
     */
    checkIsShowOperatePanel:function(lastUid,mahjong,huUserIdArr){
        var isChow = [];
        var btnGroup = [];
        var user = this._playerData[MY_DIRECTION] ;
        var myUid = user.uid ;
        var isHu = false ;
        if (huUserIdArr!=undefined){
            if (_.indexOf(huUserIdArr,myUid)!=-1){
                isHu = true ;
            }
        }
        var isKong =this._preCheck.checkGang(user,mahjong);
        var isPeng = this._preCheck.checkPeng(user,mahjong);
        if (this._playerData[0].uid == lastUid){  //我坐在1号位，只能吃上一家打出的牌 所以只能是0号位
            isChow = this._preCheck.checkChi(user,mahjong) ;
        }
        if ((!_.isEmpty(isKong)) && isKong.type ==2){//别人打出来的明杠   不能杠
            isKong = {} ;
        }
        this._btnOperateWin.setVisible(isHu);
        this._btnOperatePong.setVisible(isPeng) ;
        var isShowPass = (isHu || isPeng || !_.isEmpty(isChow) || !_.isEmpty(isKong)) ;
        this._btnOperatePass.setVisible(isShowPass) ;
        if (!_.isEmpty(isChow)){
            btnGroup.push(this._btnOperateChow) ;
            this.clearChowGroup() ;
            this._btnOperateChow._mahjong = mahjong ;
            this._btnOperateChow.setVisible(true) ;
            this._totalChowArr = isChow ;
        }
        if (isPeng == true){
            btnGroup.push(this._btnOperatePong) ;
        }
        if (!_.isEmpty(isKong)){
            this._btnOperateKong.setVisible(true) ;
            this._kongGroup = isKong ;
            btnGroup.push(this._btnOperateKong);
        }
        if (isHu){
            btnGroup.push(this._btnOperateWin) ;
        }
        if (!_.isEmpty(btnGroup)){
            var btnPassPos = this._btnOperatePass.getPosition() ;
            for (var i=0;i<btnGroup.length;i++){
                btnGroup[i].setPositionX(btnPassPos.x - 170*(i+1)) ;
            }
        }
    },

    /**
     * 计算吃牌组合的位置
     * @param amount
     * @returns {Array}
     */
    caculateChowPosition:function(amount){
        var posX = this._imgChowBackground.getPositionX();
        var posXArr = [] ;
        switch (amount){ //有几组吃的可能
            case 1:
                posXArr.push(posX);
                break;
            case 2:
                posXArr.push(posX-180);
                posXArr.push(posX+180);
                break;
            case 3:
                posXArr.push(posX-560);
                posXArr.push(posX-180);
                posXArr.push(posX + 180) ;
                break;
            default:
                break;
        }
        return posXArr ;
    },

    /**
     * 玩家新起一张牌
     * @param obj
     * @param target
     */
    onMahjong:function(obj,target){
        console.log("onMahjong  obj",obj);
        console.log("onMahjong  obj .uUserIdArr " ,obj.huUserIdArr);
        var dir = -1 ;
        for (var i=0;i<target._playerData.length;i++){
            if (target._playerData[i].uid == obj.uid){
                dir = i ;
                break ;
            }
        }
        var myUid = target._playerData[MY_DIRECTION].uid ;
        target.showTableDirection(dir) ; //轮到坐在dir方向的玩家操作
        target._playerNewMahjong[dir] = obj.mahjong;
        target._playerCardsNew[dir].setVisible(true) ;
        if (dir != MY_DIRECTION){
            target._playerData[dir].mahjong.push(obj.mahjong);
            target.disableClickMyCard(); //没轮到我操作
        }else {
            target.enableClickMyCard();
            //自己新起一张牌  先加测胡牌或者杠 myUid
            var isHu = (_.indexOf(obj.huUserIdArr,myUid) == -1 )? false : true ;
            var isKong =target._preCheck.checkGang(target._playerData[MY_DIRECTION],obj.mahjong);
            var isShowPass = isHu || !_.isEmpty(isKong) ;
            var btnGroup = [];
            if (!_.isEmpty(isKong)){
                target._btnOperateKong.setVisible(true) ;
                target._kongGroup = isKong ;
                btnGroup.push(target._btnOperateKong) ;
            }
            if (isHu){
                btnGroup.push(target._btnOperateWin) ;
                target._btnOperateWin.setVisible(true) ;
            }
            target._btnOperatePass.setVisible(isShowPass) ;
            if (!_.isEmpty(btnGroup)){
                var btnPassPos = target._btnOperatePass.getPosition() ;
                for (var i=0;i<btnGroup.length;i++){
                    btnGroup[i].setPositionX(btnPassPos.x - 170*(i+1)) ;
                }
            }
            target._playerData[dir].mahjong.push(obj.mahjong);
        }
        target.showPlayerNewCard(dir);
        target.updateSurplusMahjongCount();
        target.resetTimerCountDown();
        if (obj.mahjong != -1 && obj.funNum!=undefined){
            target.updatePlayerMultiple(dir,obj.funNum);
        }
        target.checkplayToTing(dir);
    },

    /**
     * 修改剩余牌数
     */
    updateSurplusMahjongCount:function(num){
        console.log(" this._surplusMahjong :" + this._surplusMahjong);
        this._labelMahJongSurplus.setVisible(true) ;
        if (num != undefined){
            this._surplusMahjong -= num ;
        }else{
            this._surplusMahjong -- ;
        }
        console.log(" this._surTotalMahjong ",this._surplusMahjong);
        this._labelMahJongSurplus.setString("剩余："+this._surplusMahjong);
    },
    /**
     * 牌局开始 更新剩余牌的数量
     * @param num
     */
    updateSuplusMahjongBeforeGameStart:function(num){
        this._labelMahJongSurplus.setVisible(true) ;
        if (num != undefined){
            this._surTotalMahjong -= num ;
        }else{
            this._surTotalMahjong -- ;
        }
        console.log(" this._surTotalMahjong ",this._surTotalMahjong);
        this._labelMahJongSurplus.setString("剩余："+this._surTotalMahjong);
    },
    /**
     * 碰牌响应
     * @param obj
     * @param target
     */
    handlePongMahjong:function(obj,target){
        console.log(" handlePongMahjong ",obj);
    },

    /**
     * 有玩家碰的广播
     * @param obj
     * @param target
     */
    onPong:function(obj,target){
        console.log(" onPong ",obj);
        var uid = obj.pengUid ;
        var beUid = obj.bePengUid;
        var mahjongs = obj.mahjongs ;
        var dir = 0;
        var beDir = 0 ;
        var outPlayer = {} ;
        for (var i=0;i<target._playerData.length;i++){
            if (uid == target._playerData[i].uid){
                dir = i ;
                outPlayer = target._playerData[i] ;
            }
            if (beUid == target._playerData[i].uid){
                beDir = i ;
            }
        }
        var sex = outPlayer.sex ;
        common.soundManage.playOperateEffect(sex,common.OperationType.PONG) ;
        //对碰牌用户的处理
        var data = {
            uid:beUid,
            pai:mahjongs
        };
        target._playerData[dir].peng.push(data);
        console.log("target.peng[dir] ", target._playerData[dir].peng);
        console.log(" _.last(target.peng[dir]) ",_.last(target._playerData[dir].peng));
        //碰的玩家 自己的牌少两张  并在右侧堆3张
        //被碰的玩家  已经出去的牌上一张
        target.dealBeOperateDir(beDir);
        target.dealGroupRecord(dir,_.last(target._playerData[dir].peng));
        console.log(" target.peng ",target._playerData[dir].peng);
        target.showTableDirection(dir) ;
        console.log("beform peng dir:"+dir, outPlayer.mahjong);
        if (dir ==MY_DIRECTION){
            var index = _.indexOf(outPlayer.mahjong,mahjongs[0]);
            target._playerData[dir].mahjong.splice(index,2);
            target.refreshUserCards() ;
            target.enableClickMyCard();
        }else{
            target._playerData[dir].mahjong.pop();
            target._playerData[dir].mahjong.pop();
            target.otherPlayerPopCards(dir,2);
        }

        target.hideOpeate();
        var funNum = obj.funNum ;
        target.updatePlayerMultiple(dir,funNum);
        target.checkplayToTing(dir);
        target.resetMahjongPosition(dir);
    },

    /**
     * 处理其他玩家的手牌
     * @param dir
     * @param num
     */
    otherPlayerPopCards:function(dir,num){
        for (var i=0;i<num;i++){
            var sprite = _.last(this._playerCards[dir]);
            sprite.removeFromParent();
            this._playerCards[dir].pop();
        }
    },

    /**
     * 杠牌响应
     * @param obj
     * @param target
     */
    handleKongMahjong:function(obj,target){
        console.log(" handleKongMahjong ",obj);
    },


    /**
     * 有玩家杠的广播
     * @param obj
     * @param target
     */
    onKong:function(obj,target){
        console.log(" onKong ",obj);
        console.log("onKong  obj .uUserIdArr " ,obj.huUserIdArr);
        var uid = obj.gangUid  ;
        var beUid = obj.beGangUid ;
        var mahjong = obj.mahjong ;
        var dir =0 ;
        var beDir = 0;
        for (var i=0;i<target._playerData.length;i++){
            if (uid == target._playerData[i].uid){
                dir = i ;
            }
            if (beUid == target._playerData[i].uid){
                beDir = i ;
            }
        }
        var type = obj.type ; //1 暗杠 2, 碰了之后的杠 3, 明杠
        var funNum = obj.funNum ;
        target.updatePlayerMultiple(dir,funNum);
        common.soundManage.playOperateEffect(target._playerData[dir].sex,common.OperationType.KONG) ;
        var data = {
            type:type,
            uid:beUid,
            pai:[mahjong,mahjong,mahjong,mahjong]
        };
        console.log("onKong type " ,type);
        target._playerData[dir].gang.push(data);
        if (type == 2){
            target.revokePong(dir,mahjong);
        }
        console.log("target.gang[dir] ", target._playerData[dir].gang);
        console.log(" _.last(target.gang[dir]) ",_.last(target._playerData[dir].gang));
        if (dir != beDir){
            target.dealBeOperateDir(beDir);
        }

        target.dealGroupRecord(dir,_.last(target._playerData[dir].gang));
        console.log(" target.gang ",target._playerData[dir].gang);
        //对杠牌用户的处理
        target.showTableDirection(dir) ;
        var popCount = (type == 1) ? 4:(type == 3) ? 3 : 1;
        if (MY_DIRECTION == dir){
            target._playerData[dir].mahjong.sort() ;
            var index = _.indexOf(target._playerData[dir].mahjong,mahjong);
            target._playerData[dir].mahjong.splice(index,popCount);
        }else{
            for (var i=0;i<popCount;i++){
                target._playerData[dir].mahjong.pop();
            }
            target.otherPlayerPopCards(dir,popCount);
        }
        if (dir ==MY_DIRECTION){
            target.refreshUserCards() ;
            target.enableClickMyCard();
        }
        target.hideOpeate();
        target.resetMahjongPosition(dir,type);
    },

    /**
     * 撤销碰的牌
     * @param dir
     * @param mahjong
     */
    revokePong:function(dir,mahjong){
        var panelGroupArr = this._panelOutGroupArr[dir] ;
        for (var i=0;i<panelGroupArr.length;i++){
            var panelGroup = panelGroupArr[i] ;
            var mahjongs = panelGroup._mahjongs ;
            console.log("revokePong panelGroup mahjongs ",mahjongs);
            if (_.indexOf(mahjongs,mahjong)!= -1){  //碰的组合去掉
                if (i < (panelGroupArr.length-1)){
                    for (var j = i+1;j<panelGroupArr.length;j++){
                        var prePos = panelGroupArr[j-1].getPosition() ;
                        panelGroupArr[j].setPosition(prePos) ;
                    }
                }
                this._panelOutGroupArr[dir] = _.without(panelGroupArr,panelGroup) ;
                panelGroup.removeFromParent() ;
            }
        }
        var pengArr = this._playerData[dir].peng ;
        for (var i=0;i<pengArr.length;i++){
            var peng = pengArr[i] ;
            if (_.indexOf(peng,mahjong) != -1){
                this._playerData[dir].peng = _.without(pengArr,peng);
            }
        }

    },

    onLaiZiKong:function(obj,target){
        console.log(" onLaiZiKong ",obj);
        var uid = obj.gangUid  ;
        var beUid = obj.beGangUid ;
        var mahjong = obj.mahjong ;
        var dir =0 ;
        var beDir = 0;
        var outPlayer = {};
        for (var i=0;i<target._playerData.length;i++){
            if (uid == target._playerData[i].uid){
                dir = i ;
                outPlayer = target._playerData[i] ;
            }
            if (beUid == target._playerData[i].uid){
                beDir = i ;
            }
        }
        console.log(" outPlayer ",outPlayer);
        common.soundManage.playMahjongEffect(outPlayer.sex,mahjong);
        if (target._kongValue.indexOf(mahjong)!=-1){
            target._playerPlayOutKongMahjong[dir].push(mahjong) ;
            target.dealDiscardKongRecord(dir,mahjong)
        }else{
            target._playerPlayOutMahjong[dir].push(mahjong) ;
            target.dealDiscardRecord(dir,mahjong) ;
        }

        target._playerCardsNew[dir].setVisible(false) ;  //隐藏掉玩家最新抓的一张牌
        if (dir == MY_DIRECTION){ //对于自己 要刷新牌面
            if (target._lastClickedCards!=null){
                target._lastClickedCards.setPositionY(0);
            }
            target._ClickedCardNo = -1 ;
            var index = _.indexOf(target._playerData[dir].mahjong,mahjong);
            target._playerData[dir].mahjong.splice(index,1);
            target.refreshUserCards() ;
            target.disableClickMyCard();
        }
        var funNum = obj.funNum ;
        target.updatePlayerMultiple(dir,funNum);
        target.checkIsShowOperatePanel(obj.uid,mahjong);
    },

    /**
     * 更新玩家的番数
     * @param dir
     * @param multiple  倍数
     */
    updatePlayerMultiple:function(dir,multiple){
        ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgPrepareStatus").setVisible(false) ;
        if ( multiple == 1 ){
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgFlagMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelAtlasMultiple").setVisible(false) ;
            return  ;
        }
        ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgFlagMultiple").setVisible(true) ;
        var playerMultiple = ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelAtlasMultiple") ;
        playerMultiple.setVisible(true) ;
        playerMultiple.setString(multiple) ;
        this._playerData[dir].funNum = multiple ;
    },

    /**
     * 吃牌响应
     * @param obj
     * @param target
     */
    handleChowMahjong:function(obj,target){
        console.log(" handleChowMahjong ",obj);
    },

    hideOpeate:function(){
        this.hideOperationButton();
        _.each(this._panelChowGroup,function(child){
            child.removeFromParent() ;
        });
        this._btnWin.setVisible(false);
    },
    /**
     * 移除一些动作
     */
    removeAction:function(){
        if (this._imgCurOperateFlag != null){
            if (this._imgCurOperateFlag.getChildByTag(101)){
                this._imgCurOperateFlag.removeChildByTag(101)
            }
        }
        for (var i=0;i<this._tableDirection.length;i++){
            this._tableDirection[i].setVisible(false);
            this._tableDirection[i].stopAllActions();
        }
    },
    /**
     * 有玩家吃的广播
     * @param obj
     * @param target
     */
    onChow:function(obj,target){
        console.log(" onChow ",obj);
        var uid = obj.chiUid;
        var sex = 0 ;
        var beUid = obj.beChiUid ;
        var mahjongs = (obj.mahjong).split(",");  //中间的牌是被吃的

        for (var i=0;i<mahjongs.length;i++){
            mahjongs[i] = parseInt(mahjongs[i]);
        }
        var dir  = 0; //吃的用户的位置
        var beDir = 0 ; //被吃的用户的位置
        for (var i=0;i<target._playerData.length;i++){
            if (uid == target._playerData[i].uid){
                dir = i ;
                sex = target._playerData[i].sex ;
            }
            if (beUid == target._playerData[i].uid){
                beDir = i ;
            }
        }
        common.soundManage.playOperateEffect(sex,common.OperationType.CHOW) ;
        console.log(" before chow dir :"+dir,target._playerData[dir].mahjong);
        if (dir == MY_DIRECTION){
            var index1 = _.indexOf(target._playerData[dir].mahjong,mahjongs[0]);
            target._playerData[dir].mahjong.splice(index1,1); //吃别人的牌  在显示的列表里去掉
            var index2 = _.indexOf(target._playerData[dir].mahjong,mahjongs[2]);
            target._playerData[dir].mahjong.splice(index2,1); //吃别人的牌  在显示的列表里去掉
            target.refreshUserCards() ;
            target.enableClickMyCard();
        }else{
            target._playerData[dir].mahjong.pop();
            target._playerData[dir].mahjong.pop();
            target.otherPlayerPopCards(dir,2);
        }
        //对吃牌的用户的处理
        var data = {
            uid:beUid,
            pai:mahjongs
        };
        target.showTableDirection(dir) ;
        target._playerData[dir].chi.push(data);
        target.dealBeOperateDir(beDir);
        target.dealGroupRecord(dir,_.last(target._playerData[dir].chi));
        target.hideOpeate();
        var funNum = obj.funNum ;
        target.updatePlayerMultiple(dir,funNum);
        target.checkplayToTing(dir);
        target.resetMahjongPosition(dir);
    },
    /**
     * 胡牌响应
     * @param obj
     * @param target
     */
    handleWinMahjong:function(obj,target){
        console.log(" handleWinMahjong ",obj);
    },


    /**
     * 过牌响应
     * @param obj
     * @param target
     */
    handlePassMahjong:function(obj,target){
        console.log(" handlePassMahjong ",obj);
        target.hideOpeate();
    },

    /**
     * 刚刚玩家出了哪一张牌
     */
    playOperateFlagAction:function(dir,mahjong,sprite){
        console.log(" playOperateFlagAction ",dir);
        for (var i = 0 ;i< common.TableDirection.length;i++){
            if (i == dir && i!=MY_DIRECTION){
                this._playerDiscard[dir].setVisible(true) ;
                var img = CARD_LAI_ZI_IMAGE+mahjong +".png";
                ccui.helper.seekWidgetByName(this._playerDiscard[dir],"ImgCard").loadTexture(img) ;
            }else{
                this._playerDiscard[i].setVisible(false) ;
            }
        }
        if (this._imgCurOperateFlag !=sprite){
            if (this._imgCurOperateFlag != null){
                if (this._imgCurOperateFlag.getChildByTag(101)){
                    this._imgCurOperateFlag.removeChildByTag(101)
                }
            }
        }
        this._imgCurOperateFlag = sprite ;
        //出牌显示指针
        var flag = new cc.Sprite(common.ImgCurOutMahjongFlag);
        flag.anchorX = 0.5;
        flag.anchorY = 0.5 ;
        flag.setTag(101) ;
        this._imgCurOperateFlag.addChild(flag);
        var pos = cc.p(0,0);
        switch (dir){
            case 0 :
                pos = cc.p(55,120);
                break;
            case 1:
                pos = cc.p(35,130);
                break ;
            case 2:
                pos = cc.p(55,120);
                break ;
            case 3:
                pos = cc.p(35,130);
                break ;
        }
        flag.setPosition(pos) ;
        flag.runAction(cc.repeatForever(
            cc.sequence(
                cc.moveTo(0.5,cc.p(pos.x,pos.y+6)),
                cc.moveTo(0.5,cc.p(pos.x,pos.y-6))
            )
        ));
    },

    getMyMahJongImg:function(value){
        console.log(" getMyMahJongImg value "+ value);
        return CARD_IMAGE_PATH+"dd_hand" + value+".png";
    },

    chowGroupSelect:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return;
        console.log(" widget.chowGroup :",widget.chowGroup);
        var group = JSON.parse(widget.chowGroup) ;
        console.log("  widget.chowGroup ", widget.chowGroup);
        this.doChow(group);
    },

    /**
     * 吃的操作
     */
    doChow:function(group){
        var params = {
            roomNo:this._curRoomNo,
            mahjongs:group
        };
        net.NetManage.handlerChi(params);
    },

    hideOperationButton:function(){
        this._btnOperateWin.setVisible(false) ;
        this._btnOperatePass.setVisible(false) ;
        this._btnOperateChow.setVisible(false) ;
        this._btnOperatePong.setVisible(false) ;
        this._btnOperateKong.setVisible(false) ;

    },

    /**
     * 牌局结束
     * @param obj
     * @param target
     */
    onRoundOver:function (obj,target) {
        console.log("----------------onRoundOver-------------- ",obj) ;
        target.hideOpeate();
        target.removeAction();
        if (obj.isFlow  == true){
            target.playWordTips(common.ShowWordType.TYPE_GAME_DRAW);
        }else{
            target.playWordTips(common.ShowWordType.TYPE_GAME_END);
        }

        var result = obj.result ;
        console.log(" result ",result);
        for (var dir =0;dir<target._playerData.length;dir++){
            var uid = target._playerData[dir].uid ;
            console.log( "onRoundOver uid " ,uid );
            if (result.hasOwnProperty(uid)){
                console.log(" result.hasOwnProperty dir "+dir,result[uid]);
                target._playerData[dir].mahjong = result[uid].mahjong;
                target.sortUserCards(dir);
            }
        }
        target.scheduleOnce(function(){
            game.Notification.send(common.NotifyType.SHOW_BALANCE_PANEL,obj)
        },2);
    },

    /**
     * 申请解散牌局的返回
     * @param obj
     * @param target
     */
    dissolveRoom:function(obj, target){
        console.log("--------------dissolveRoom-----------------",obj);
        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
    },

    /**
     * 同意解散牌局
     * @param obj
     * @param target
     */
    agreeDissolveRoom:function(obj, target){
        console.log("--------------agreeDissolveRoom-----------------",obj);
        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
    },

    /**
     * 取消解散牌局
     * @param obj
     * @param target
     */
    cancelDissolveRoom:function(obj, target){
        console.log("--------------cancelDissolveRoom-----------------",obj);
        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
    },

    /**
     * 发起解散 , 玩家同意解散 玩家取消解散 房间广播
     * 如果是我发起的  不用管这个广播  等解散成功或者解散失败的广播
     * @param obj
     * @param target
     */
    onDissolveHandler:function(obj, target){
        console.log("--------------onDissolveHandler-----------------",obj);
        var curRoomNo = target._curRoomNo;
        var nickname = "" ;
        var tipsDesc = common.TipsDesc.PlayerApplyDissoveRoomTips ;
        if (target._myInfo._id == obj.dissUid ) return  ;
        _.each(target._playerData,function(user){
            console.log(" user ",user);
            if (!_.isEmpty(user)&&user.uid == obj.dissUid){
                nickname = user.nickname ;
            }
        });
        var myUid = target._myInfo._id ;
        if (_.indexOf(obj.cannelDissove,myUid) == -1 && _.indexOf(obj.agreeDissolve,myUid) == -1){ //我还没操作
            console.log(" ");
            var desc = tipsDesc.replace(/%s/,nickname) ;
            var params={
                desc : desc,
                confirm:function(){
                    net.NetManage.agreeDissolveRoom({roomNo:curRoomNo});
                },
                cancel:function(){
                    net.NetManage.cannelDissolveRoom({roomNo:curRoomNo});
                },
                confirmWord:common.BtnWords.agree,
                cancelWord:common.BtnWords.refuse,
                countTime:180
            };
            game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params) ;
            if(cc.sys.os==cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "Vibrate", "(Ljava/lang/String;)V", "1000");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("EleUtil", "playVibration");
            }
        }
    },

    /**
     * 房间解散  直接退回大厅
     * @param obj
     * @param target
     */
    onRoomDissolve:function(obj, target){
        console.log("--------------onRoomDissolve-----------------",obj);
        // if (obj.allResult){//如果胡牌好了之后之后会有总结算界面得数据结果
        //
        //     return ;
        // }
        game.LocalData.setCurRoomNo(null);
        var params={
            desc : common.TipsDesc.AgreeDissolveRoom,
            confirmOnly:function(){
                game.Notification.send(common.NotifyType.GO_TO_LOBBY) ;
            }
        };
        game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params) ;
    },

    /**
     * 房间解散被取消
     * @param obj
     * @param target
     */
    onCannelDissolve:function(obj, target){
        console.log("--------------onCannelDissolve-----------------",obj);
        var params={
            desc : common.TipsDesc.RefuseDissolveRoom,
            autoDispear:true
        };
        game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params) ;
    },


    onDisconnect:function(obj, target){
        console.log("--------------onDisconnect-----------------",obj);
        // target.send(common.NotifyType.SHOW_POPUP_MESSAGE,{msg:"断线了。。。。。。"});

    },

    /**
     * 掉线了
     * @param obj
     * @param target
     */
    onTimeOut:function(obj, target){
        console.log("--------------onTimeOut-----------------",obj);
        target.showLoadingCircle();
        var playerInfo = target._playerData[MY_DIRECTION] ;
        var player = game.LocalData.getUserInfo() ;
        console.log("before login player ",player);
        var params = {
            openid: player.openid,
            token: player.token,
            latitude: playerInfo.latitude,
            longitude: playerInfo.longitude
        };
        console.log(" before login ... ",params );
        net.NetManage.login(params);
    },
    /**
     * 断线重连 重新进入牌桌
     * @param obj
     * @param target
     */
    // reConnect:function(obj,target){
    //     console.log("------------------reConnect----------------",obj);
    //     target.ctor(obj);
    // },

    /**
     * 发送消息返回
     * @param obj
     * @param target
     */
    handleSendMessage:function(obj, target){
        console.log("--------------handleSendMessage-----------------",obj);
    },

    /**
     * 发送消息广播
     * @param obj       1 文本  2 表情  3 语音
     * @param target
     */
    onMessage:function(obj, target){
        console.log("--------------onMessage-----------------",obj);
        var message = obj.message ;
        var player = {};
        var uid = obj.uid ;
        var dir = 0 ;
        for (var i=0;i<4;i++){
            if (!_.isEmpty(target._playerData[i]) && target._playerData[i].uid == uid){
                dir = i ;
                player = target._playerData[i] ;
                break ;
            }
        }
        console.log("uid: ",uid);
        console.log("player: ",player);
        var msgArr = (message.toString()).split('-') ;
        var type = parseInt(msgArr[0]) ;

        switch (type){
            case 1:
                var content = parseInt(msgArr[1]);
                target.showPlayerContent(dir,content);
                break;
            case 2:
                var content = parseInt(msgArr[1]);
                target.showPlayerEmoji(dir,content);
                break;
            case 3:
                target.playAudio(dir);
                break;
            default:
                break;

        }

    },

    /**
     * 播放语音
     * @param dir
     */
    playAudio:function(dir){
        console.log(" playAudio dir "+dir);
        if(cc.sys.os==cc.sys.OS_ANDROID){
            // var filePath=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager", "getCurrentFilePath", "()Ljava/lang/String;");
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager", "playSound", "(Ljava/lang/String;)V",filePath);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            // jsb.reflection.callStaticMethod("IFlyManager", "iflyPlayAudio");
        }
        var imgVoice = ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgVoice") ;
        imgVoice.setVisible(true) ;
        var imgFlag = ccui.helper.seekWidgetByName(imgVoice,"ImageView") ;
        this.doFadeAction(imgFlag);
        this.scheduleOnce(function(){
            imgFlag.stopAllActions();
            imgVoice.setVisible(false) ;
        },3);
    },

    /**
     * 显示玩家说的话
     * @param dir
     * @param content
     */
    showPlayerContent:function(dir,content){
        console.log(" -----showPlayerContent------ dir "+dir+" content ",content);
        var imgSpeak = ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgSpeak") ;
        imgSpeak.setVisible(true) ;
        var labelDesc =new cc.LabelTTF(common.MessageContext[content],"Arial",20,cc.size(160,90),cc.TEXT_ALIGNMENT_CENTER,cc.TEXT_ALIGNMENT_CENTER);
        labelDesc.anchorX = 0.5 ;
        labelDesc.anchorY = 0.5 ;
        labelDesc.setPosition(cc.p(imgSpeak.getContentSize().width/2,imgSpeak.getContentSize().height/2)) ;
        imgSpeak.addChild(labelDesc);
        labelDesc.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(1),
            cc.fadeOut(1),
            cc.callFunc(function(){
                imgSpeak.removeAllChildren();
                imgSpeak.setVisible(false) ;
            },this)
        ));
        imgSpeak.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(1),
            cc.fadeOut(1.5),
            cc.callFunc(function(){
                imgSpeak.removeAllChildren();
                imgSpeak.setVisible(false) ;
            },this)
        ));
    },

    /**
     * 显示玩家发的表情
     * @param dir
     * @param emoji
     */
    showPlayerEmoji:function(dir,emoji){
        var imgSpeak = ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgSpeak") ;
        imgSpeak.setVisible(true) ;
        var img = common.EmojiImg[emoji-1] ;
        var sprite = new cc.Sprite(img);
        sprite.anchorX = 0.5;
        sprite.anchorY = 0.5 ;
        sprite.setPosition(cc.p(imgSpeak.getContentSize().width/2,imgSpeak.getContentSize().height/2)) ;
        imgSpeak.addChild(sprite) ;
        imgSpeak.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(1),
            cc.fadeOut(1),
            cc.callFunc(function(){
                imgSpeak.removeAllChildren();
                imgSpeak.setVisible(false) ;
            },this)
        ));
    },
    /**
     * 获取手机wifi信号 电池电量等
     */
    getMobileInfo:function(){
        if(cc.sys.os==cc.sys.OS_ANDROID){
            this.schedule(this.getAndroidInfo,1);
        }else if (cc.sys.os == cc.sys.OS_IOS){
            this.schedule(this.getIosInfo,4);
        }
    },

    /**
     * 至少能获取当前时间啊
     */
    getSystemInfo:function(){
        var curTime = (new Date()).Format("hh:mm");
        this._labelCurTime.setString(curTime);
    },

    /**
     * 获取Android手机的wifi信号
     */
    getAndroidInfo:function(){
        if (cc.sys.os == cc.sys.OS_ANDROID){
            var level =jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getWIFIRssi","()I");
            if ( level >= -50) {//非常好
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_fine) ;
            }else if (level < -50 && level >= -70){ //较好
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_ok) ;
            }
            else if (level < -70 && level >= -80){//一般
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_ok) ;
            }
            else if (level < -80 && level >= -100) {//差
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_bad) ;
            }
            else{//断开
                this._imgWifiInfo.setVisible(false);
            }

            var electricLevel=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getElectric","()I");
            this._loadingBarBatteryLevel.setPercent(electricLevel) ;
        }
    },

    /**
     * 震动的方法
     */
    phoneVibrate:function () {
        if(cc.sys.os==cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "Vibrate", "(Ljava/lang/String;)V", "1000");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("EleUtil", "playVibration");
        }
    },

    /**
     * ios 相关的信息
     */
    getIosInfo:function(){
        if (cc.sys.os == cc.sys.OS_IOS) {
            var wifiValue = jsb.reflection.callStaticMethod("EleUtil", "getSignalStrength");
            if ( wifiValue == 3) {//非常好
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_fine) ;
            } else if (wifiValue == 2){ //较好
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_ok) ;
            } else if (wifiValue == 1) {//差
                this._imgWifiInfo.setVisible(true);
                this._imgWifiInfo.loadTexture(common.WifiImage.wifi_bad) ;
            } else{//断开
                this._imgWifiInfo.setVisible(false);
            }

            var electricLevel=jsb.reflection.callStaticMethod("EleUtil","get_batteryLevel");
            console.log("==iOS == electricLevel ==" + electricLevel);
            this._loadingBarBatteryLevel.setPercent(electricLevel) ;
        }
    },

    /**
     * 根据当前的经纬度获取玩家的位置信息
     * @param lat
     * @param lan
     */
    getPlayerAddressByPos:function(lat,lan,label){
        this._labelAddress = label ;
        if (cc.sys.os == cc.sys.OS_ANDROID){
            console.log("lat ");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","SetLatLng","(Ljava/lang/String;Ljava/lang/String;)V",lat.toString(),lan.toString());
            var address=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getAddressForCoor","()Ljava/lang/String;");
            console.log("getPlayerAddrssInfo address ",address);
            if (address!=null){
                var index=address.indexOf("省");
                if(index!=-1){
                    var clipAddress=address.substring(index);
                    var enterString=clipAddress;
                    if(clipAddress.length>9){
                        enterString=clipAddress.substring(1,9)+"\n"+clipAddress.substring(9,clipAddress.length);
                    }
                    this._labelAddress.setString(enterString) ;
                    this.unschedule(this.getPlayerAddrssInfo) ;
                }else{
                    var enterStringNo=address;
                    if(address.length>9){
                        enterStringNo=address.substring(0,9)+"\n"+address.substring(9,address.length);
                    }
                    this._labelAddress.setString(enterStringNo) ;
                    this.unschedule(this.getPlayerAddrssInfo) ;
                }
            }
            else{
                this._labelAddress.setString("未获取") ;
                this.schedule(this.getPlayerAddrssInfo) ;
            }
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("ZYLocationManager", "getAddressWithLatitude:longtitude:",lat,lan);
        } else{
            label.setString("这里应该显示玩家的地址");
            console.log("getPlayerAddressByPos........... ");
        }
    },

    getAddressFromiOS:function(address) {
        this._labelAddress.setString(address);
    },

    /*
    * 是否暂停播放背景音乐（录音，播放语音时）
    * type ："1"暂停，"0"继续
    * */
    shouldPauseBackgroundMusic:function(type) {
        if (type == "1") { // 暂停背景音乐
            common.soundManage.pauseBackground();
        } else if (type == "0") {  //  继续播放
            common.soundManage.resumeBackground();
        }
    },

    /**
     *获取用户地址信息
     */
    getPlayerAddrssInfo:function(){
        if (cc.sys.os == cc.sys.OS_ANDROID){
            var address=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","getAddress","()Ljava/lang/String;");
            console.log("getPlayerAddrssInfo address ",address);
            if (address!=null){
                this._labelAddress.setString(address) ;
                this.unschedule(this.getPlayerAddrssInfo) ;
            }
        }
    },

    /**
     * 牌局结束 亮牌
     */
    lightCard:function(){
        for (var dir=0;dir<common.TableDirection.length;dir++){
            var mahjongs = this._playerData[dir].mahjong ;
            for (var i=0;i<this._playerCards[dir].length;i++){
                var img = CARD_IMAGE_PATH+LIGHT_CARD_BY_IMAGE[dir]+mahjongs[i]+".png";
                console.log("lightCard dir:"+dir+" i:"+i+" img:" + img);
                if (dir == MY_DIRECTION){
                    this._playerCards[dir][i].loadTexture(img) ;
                    this._playerCards[dir][i].removeAllChildren() ;
                }else{
                    if (mahjongs[i] == -1 &&this._playerCards[dir][i]!=undefined ){
                        this._playerCards[dir][i].removeFromParent() ;
                        continue ;
                    }
                    this._playerCards[dir][i].setTexture(img);
                }
                if (mahjongs[i] == this._gameData.laizi){
                    var sprite = new cc.Sprite(common.FlagCard.laizi);
                    var size = this._playerCards[dir][i].getContentSize() ;
                    sprite.setAnchorPoint(cc.p(0.5,0.5)) ;
                    this.getPositionAfterLightCard(dir,sprite,size);
                    this._playerCards[dir][i].addChild(sprite) ;
                }else if (_.indexOf(this._onlyKongValue,mahjongs[i]) != -1){//固定杠牌
                    var sprite = new cc.Sprite(common.FlagCard.kongLight);
                    sprite.setAnchorPoint(cc.p(0.5,0.5)) ;
                    var size = this._playerCards[dir][i].getContentSize() ;
                    this.getPositionAfterLightCard(dir,sprite,size);
                    this._playerCards[dir][i].addChild(sprite) ;
                }
            }
        }
    },

    /**
     * 亮牌之后获取标识的坐标
     * @param dir
     * @param sprite
     */
    getPositionAfterLightCard:function(dir,sprite,size){
        switch (dir){
            case 0:
                sprite.setRotation(90) ;
                sprite.setPosition(size.width-5 ,size.height-33);
                sprite.setScale(0.8);
                break ;
            case 1 :
                sprite.setPosition(35,size.height-40);
                break ;
            case 2:
                sprite.setPosition(30,size.height-36);
                sprite.setScale(0.8);
                break ;
            case 3:
                sprite.setPosition(30,size.height-36);
                break ;
        }
    },

    update:function(dt){
        console.log("   ------update-------  ",dt);
    },

    /**
     * 检查打出去听牌的情况
     */
    checkplayToTing:function(dir){
        if (dir != MY_DIRECTION){
            return ;
        }
        var oriPlayer = JSON.stringify(this._playerData[MY_DIRECTION]) ;
        var player = JSON.parse(oriPlayer) ;
        var mahjongLength = player.mahjong.length ;
        var newMahjong = this._playerNewMahjong[dir] ;
        if (newMahjong !=null && (mahjongLength%3 ==1)){
            player.mahjong.push(newMahjong);
        } ;
        this._preCheck.playToTing(player);
    },

    /**
     * 共同的做一些渐显和渐消失的动作
     * @param sprite
     */
    doFadeAction:function(sprite){
        sprite.setVisible(true);
        sprite.runAction(cc.repeatForever(
            cc.sequence(
                cc.fadeIn(0.5),
                cc.fadeOut(0.5)
            )
        ));
    },

    /**
     * 检测是否听牌
     * @param obj
     * @param target
     */
    handleTing:function(obj,target){
        console.log("   checkplayToTing------handleTing-------  ",obj);
        target._valuePlayToTing = [] ;
        if (!_.isEmpty(obj)){
            target._valuePlayToTing = _.union(obj);
            console.log(" values ....",target._valuePlayToTing);
            for (var i=0;i<target._playerCards[MY_DIRECTION].length;i++){
                target.showPlayToTingFlag(target._playerCards[MY_DIRECTION][i]);
            }
            target.showPlayToTingFlag(target._playerCardsNew[MY_DIRECTION]);
        }
    },

    hidePlayToTingFlag:function(mahjongSpr){
        ccui.helper.seekWidgetByName(mahjongSpr,"ImgPlayToTing").setVisible(false);
    },

    hideAllPlayToTingFlag:function(){
        for (var i=0;i<this._playerCards[MY_DIRECTION].length;i++){
            ccui.helper.seekWidgetByName(this._playerCards[MY_DIRECTION][i],"ImgPlayToTing").setVisible(false);
        }
    },
    /**
     * 显示听牌提示
     * @param mahjongSpr
     */
    showPlayToTingFlag:function(mahjongSpr){
        var value = mahjongSpr.indexValue ;
        console.log(" target._valuePlayToTing ",this._valuePlayToTing);
        if (_.indexOf(this._valuePlayToTing,value) != -1){
            var sprite = ccui.helper.seekWidgetByName(mahjongSpr,"ImgPlayToTing") ;
            this.doFadeAction(sprite) ;
        }
    },
    /**
     *
     */
    isShowWinPanel:function(mahjongSpr){
        var value = mahjongSpr.indexValue ;
        console.log("isShowWinPanel value ",value);
        console.log(" target._valuePlayToTing ",this._valuePlayToTing);
        if (_.indexOf(this._valuePlayToTing,value) != -1){
            var oriPlayer = JSON.stringify(this._playerData[MY_DIRECTION]) ;
            var player = JSON.parse(oriPlayer) ;
            var index = _.indexOf(player.mahjong,value);
            player.mahjong.splice(index,1);
            var canWin = this._preCheck.canHu(player);
            if (_.isEmpty(canWin)){
                return ;
            }
            this._panelWin.setVisible(true) ;
            this._curPopLayer = this._panelWin ;
            this.dealWinTipsCard(canWin,this._panelWin,2);
        }
    },

    /**
     * 处理胡牌提示的弹出框
     * @param canWin
     * @param parent
     * @param type  1：点击右侧按钮弹出   2：点击打出听牌的部分弹出
     */
    dealWinTipsCard:function(canWin,parent,type){
        var imgItem = ccui.helper.seekWidgetByName(parent,"ImgCardBg") ;
        imgItem.setVisible(false) ;
        if (!_.isEmpty(this._imgWinItemArr)){
            for (var i=0;i<this._imgWinItemArr.length;i++){
                this._imgWinItemArr[i].removeFromParent() ;
            }
        }
        var keys = [];
        var values = [] ;
        for (var i=0;i<canWin.length;i++){
            var data = canWin[i] ;
            var key = _.keys(data) ;
            var value = _.values(data) ;
            keys = _.union(keys,key);
            values.push(_.first(value));
        }
        console.log(" keys ",keys);
        console.log(" values ",values);
        var itemSize = imgItem.getContentSize() ;

        if (type ==1){
            var newSizeW = (itemSize.width +15) * (keys.length + 1) ;
            var size = cc.size(newSizeW,200);
            parent.setContentSize(size) ;
            for (var i=0;i<keys.length;i++){
                var item = imgItem.clone() ;
                item.setVisible(true) ;
                parent.addChild(item);
                var pos = cc.p(size.width -(i+0.5)*(itemSize.width+15),size.height/2) ;
                item.setPosition(pos) ;
                this._imgWinItemArr.push(item) ;
                console.log(" keys[i] ",keys[i]);
                var img = CARD_LAI_ZI_IMAGE+keys[i]+".png" ;
                ccui.helper.seekWidgetByName(item,"ImageCard").loadTexture(img) ;
                console.log("btnWinTipClicekd values[i] "+i,values[i]);
                ccui.helper.seekWidgetByName(item,"LabelMultiple").setString(values[i]);
                var surplus = 4 ;
                if (this._outMahjong[keys[i].toString()]){
                    console.log("_outMahjong keys[i] ",keys[i]);
                    surplus = 4 - this._outMahjong[keys[i].toString()] ;
                    if (surplus < 0){
                        surplus = 0;
                    }
                }
                ccui.helper.seekWidgetByName(item,"LabelSurplus").setString(surplus);
            }
        }else{
            var newSizeW = (itemSize.width +15) * (keys.length) + itemSize.width ;
            var size = cc.size(newSizeW,170);
            parent.setContentSize(size) ;
            for (var i=0;i<keys.length;i++){
                var item = imgItem.clone() ;
                item.setVisible(true) ;
                parent.addChild(item);
                var pos = cc.p((i+1.4)*(itemSize.width+15),size.height/2) ;
                item.setPosition(pos) ;
                this._imgWinItemArr.push(item) ;
                console.log(" keys[i] ",keys[i]);
                var img = CARD_LAI_ZI_IMAGE+keys[i]+".png" ;
                ccui.helper.seekWidgetByName(item,"ImageCard").loadTexture(img) ;
                console.log("btnWinTipClicekd values[i] "+i,values[i]);
                ccui.helper.seekWidgetByName(item,"LabelMultiple").setString(values[i]);
                var surplus = 4 ;
                if (this._outMahjong[keys[i].toString()]){
                    surplus = 4 - this._outMahjong[keys[i].toString()] ;
                }
                ccui.helper.seekWidgetByName(item,"LabelSurplus").setString(surplus);
            }
        }
    },

    /**
     * 亮牌
     * @param obj
     * @param target
     */
    handleBrightMahjong:function(obj,target){
        console.log(" handleBrightMahjong ",obj);
    },

    /**
     * 取消亮牌
     * @param obj
     * @param target
     */
    handleCancelBrightMahjong:function(obj,target){
        console.log(" handleBrightMahjong ",obj);

    },

    /**
     * 亮牌广播
     * @param obj
     * @param target
     * 亮牌的玩家  从手牌里减少3张牌
     */
    onBrightMahjong:function(obj,target){
        console.log(" handleBrightMahjong ",obj);
        var uid = obj.uid;
        var sex = 0 ;
        var mahjongs = obj.mahjong;
        var dir = 0;
        for (var i=0;i<target._playerData.length;i++){
            if (uid == target._playerData[i].uid){
                dir = i ;
                sex = target._playerData[i].sex ;
                break ;
            }
        }
        var data = mahjongs;
        if (target._playerNewMahjong[dir]!=null){
            target._playerNewMahjong[dir] = null ;
        }
        console.log("onBrightMahjong mahjongs ",mahjongs);
        for (var i=0;i<mahjongs.length;i++){
            var index = _.indexOf(target._playerData[dir].mahjong, mahjongs[i]) ;
            target._playerData[dir].mahjong.splice(index,1);
        }
        target._playerData[dir].brightMahjong.push(data);
        if (dir == MY_DIRECTION){
            target.refreshUserCards() ;
        }else{
            target.otherPlayerPopCards(dir,3) ;
        }
        target.dealBrightCard(dir,_.last(target._playerData[dir].brightMahjong));
        target.resetMahjongPosition(dir);
        target.checkBrightMahjong() ;
        if (obj.funNum != undefined){
            target.updatePlayerMultiple(dir,obj.funNum) ;
        }
    },

    /**
     * 亮牌结束
     * @param obj
     * @param target
     */
    onBrightMahjongOver:function(obj,target){
        console.log(" onBrightMahjongOver ",obj);
        target._btnOperateShow.setVisible(false) ;
        target._btnOperateCancelBright.setVisible(false) ;
        if (target._bankerSeat == MY_DIRECTION){
            target.enableClickMyCard() ;
        }else {
            target.disableClickMyCard();
        }
    },
    /**
     *
     */
    handleMyCard:function(){

    },

    subscrib:function(){
        game.Notification.subscrib(common.NotifyType.GAME_START,this.onGameStart,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_ENTER,this.onPlayerEnter,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_ON_READY,this.onOtherPlayerReady,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_EXIT,this.onPlayerExit,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_READY,this.onPlayerReady,this) ; //自己准备
        game.Notification.subscrib(common.NotifyType.SHOW_POPUP_MESSAGE,this.showPopupInfo,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_LINE,this.onUserLine,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_LEAVE,this.onUserLeave,this);
        game.Notification.subscrib(common.NotifyType.GAME_PLAYER_OFF_LINE,this.onUserOffLine,this);
        game.Notification.subscrib(common.NotifyType.HANDLE_PLAY_RESPONSE,this.handlePlayMahjong,this) ;

        game.Notification.subscrib(common.NotifyType.HANDLE_CHOW_RESPONSE,this.handleChowMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.HANDLE_PONG_RESPONSE,this.handlePongMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.HANDLE_KONG_RESPONSE,this.handleKongMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.HANDLE_WIN_RESPONSE,this.handleWinMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.HANDLE_PASS_RESPONSE,this.handlePassMahjong,this) ;

        game.Notification.subscrib(common.NotifyType.ON_PLAYER_PLAY_MAH,this.onPlayMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_PLAYER_NEW_MAH,this.onMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_PLAYER_PONG,this.onPong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_PLAYER_KONG,this.onKong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_PLAYER_LAIZI_KONG,this.onLaiZiKong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_PLAYER_CHOW,this.onChow,this) ;
        game.Notification.subscrib(common.NotifyType.ON_ROUND_OVER,this.onRoundOver,this) ;

        game.Notification.subscrib(common.NotifyType.DISSOLVE_ROOM,this.dissolveRoom,this) ;
        game.Notification.subscrib(common.NotifyType.AGREE_DISSOLVE_ROOM,this.agreeDissolveRoom,this) ;
        game.Notification.subscrib(common.NotifyType.CANCEL_DISSOLVE_ROOM,this.cancelDissolveRoom,this) ;
        game.Notification.subscrib(common.NotifyType.ON_DISSOLVE_HANDLE,this.onDissolveHandler,this) ;
        game.Notification.subscrib(common.NotifyType.ON_ROOM_DISSOLVE,this.onRoomDissolve,this) ;
        game.Notification.subscrib(common.NotifyType.ON_CANCEL_DISSOLVE,this.onCannelDissolve,this) ;

        game.Notification.subscrib(common.NotifyType.ON_DISCONNECT,this.onDisconnect,this) ;
        game.Notification.subscrib(common.NotifyType.ON_TIME_OUT,this.onTimeOut,this) ;
        game.Notification.subscrib(common.NotifyType.HANDLE_SEND_MESSAGE,this.handleSendMessage,this) ;
        game.Notification.subscrib(common.NotifyType.ON_SEND_MESSAGE,this.onMessage,this) ;
        game.Notification.subscrib(common.NotifyType.NEXT_ROUND,this.nextRound,this) ;
        game.Notification.subscrib(common.NotifyType.GO_TO_PLAY,this.reConnect,this) ;

        game.Notification.subscrib(common.NotifyType.HANDLE_TING_CALLBACK,this.handleTing,this) ;

        game.Notification.subscrib(common.NotifyType.IOS_GET_ADDRESS_SUCCESS,this.getAddressFromiOS,this) ;
        game.Notification.subscrib(common.NotifyType.IOS_SHOULD_PAUSE_BGMUSIC,this.shouldPauseBackgroundMusic,this) ;

        game.Notification.subscrib(common.NotifyType.HANDLE_BRIGHT_MAHJONG,this.handleBrightMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.HANDLE_CANCEL_BRIGHT_MAHJONG,this.handleCancelBrightMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_BRIGHT_MAHJONG,this.onBrightMahjong,this) ;
        game.Notification.subscrib(common.NotifyType.ON_BRIGHT_MAHJONG_OVER,this.onBrightMahjongOver,this) ;
    },

    unsubscrib:function(){
        game.Notification.unsubscrib(common.NotifyType.GAME_START,this.onGameStart,this);
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_ENTER,this.onPlayerEnter,this);
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_ON_READY,this.onOtherPlayerReady,this);
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_EXIT,this.onPlayerExit,this);
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_READY,this.onPlayerReady,this) ;
        game.Notification.unsubscrib(common.NotifyType.SHOW_POPUP_MESSAGE,this.showPopupInfo,this) ;
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_LINE,this.onUserLine,this) ;
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_LEAVE,this.onUserLeave,this) ;
        game.Notification.unsubscrib(common.NotifyType.GAME_PLAYER_OFF_LINE,this.onUserOffLine,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_PLAY_RESPONSE,this.handlePlayMahjong,this) ;

        game.Notification.unsubscrib(common.NotifyType.HANDLE_CHOW_RESPONSE,this.handleChowMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_PONG_RESPONSE,this.handlePongMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_KONG_RESPONSE,this.handleKongMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_WIN_RESPONSE,this.handleWinMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_PASS_RESPONSE,this.handlePassMahjong,this) ;

        game.Notification.unsubscrib(common.NotifyType.ON_PLAYER_PLAY_MAH,this.onPlayMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_PLAYER_NEW_MAH,this.onMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_PLAYER_PONG,this.onPong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_PLAYER_KONG,this.onKong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_PLAYER_LAIZI_KONG,this.onLaiZiKong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_PLAYER_CHOW,this.onChow,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_ROUND_OVER,this.onRoundOver,this) ;

        game.Notification.unsubscrib(common.NotifyType.DISSOLVE_ROOM,this.dissolveRoom,this) ;
        game.Notification.unsubscrib(common.NotifyType.AGREE_DISSOLVE_ROOM,this.agreeDissolveRoom,this) ;
        game.Notification.unsubscrib(common.NotifyType.CANCEL_DISSOLVE_ROOM,this.cancelDissolveRoom,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_DISSOLVE_HANDLE,this.onDissolveHandler,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_ROOM_DISSOLVE,this.onRoomDissolve,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_CANCEL_DISSOLVE,this.onCannelDissolve,this) ;

        game.Notification.unsubscrib(common.NotifyType.ON_DISCONNECT,this.onDisconnect,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_TIME_OUT,this.onTimeOut,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_SEND_MESSAGE,this.handleSendMessage,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_SEND_MESSAGE,this.onMessage,this) ;
        game.Notification.unsubscrib(common.NotifyType.NEXT_ROUND,this.nextRound,this) ;
        game.Notification.unsubscrib(common.NotifyType.GO_TO_PLAY,this.reConnect,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_TING_CALLBACK,this.handleTing,this) ;
        game.Notification.unsubscrib(common.NotifyType.IOS_GET_ADDRESS_SUCCESS,this.getAddressFromiOS,this) ;
        game.Notification.unsubscrib(common.NotifyType.IOS_SHOULD_PAUSE_BGMUSIC,this.shouldPauseBackgroundMusic,this) ;

        game.Notification.unsubscrib(common.NotifyType.HANDLE_BRIGHT_MAHJONG,this.handleBrightMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.HANDLE_CANCEL_BRIGHT_MAHJONG,this.handleCancelBrightMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_BRIGHT_MAHJONG,this.onBrightMahjong,this) ;
        game.Notification.unsubscrib(common.NotifyType.ON_BRIGHT_MAHJONG_OVER,this.onBrightMahjongOver,this) ;
    },
});