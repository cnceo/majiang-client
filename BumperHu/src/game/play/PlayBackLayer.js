play.PlayBackScene = game.IScene.extend({
	ctor:function (){
		this._super();
	}
});
play.PlayBackLayer = game.IView.extend({
    _totalStep:0,
    _curStep:0,
    _imgMahjongModel:null,
    _imgWifiInfo:null,
    _loadingBarBatteryLevel:null,
    _labelCurTime:null,
    _labelMahJongSurplus:null,

    _gameData:null,
    _playerData:[], //玩家数据
    _playerInfo:[], //玩家头像等信息（控件）
    _curRoomNo:0,
    _onlyKongValue:[],
    _curSubPlayType:null,

    _labelCurStep:null,
    _labelTotalStep:null,

    _myInfo:{},
    _windLoc:[],
    _tmpHeadImg:[],

    _panelDirection:null,
    _playerCards:[],
    _panelCardsParent:[],
    _panelOutCardsParent:[],
    _panelKongOutCardsParent:[],
    _tableDirection:[],
    _labelTimer:null,
    _playerDiscard:[],
    _panelOutGroupArr:[],
    _panelOutGroup:[],
	_imgPlayerOpearte:[], //玩家操作情况

    // zhou start
    _bankerSeat:-1,
    _playerMahJong:[], //玩家手里的牌
    _totalActions:[],  // 可播放的牌局



    // zhou end

	ctor:function (obj) {
        common.soundManage.playBackground(voiceRes.room_bg_sound_ogg) ;
        console.log("== obj ",obj);
        this._super();
        var size = cc.winSize;
        this._isGameStarted = false ;
        this.uiHelper = new game.UIHelper();
        this._rootNode = this.uiHelper.doLayout(res.PlayBack_json);
        this._rootNode.setAnchorPoint(cc.p(0.5,0.5));
        this._rootNode.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        this._rootNode.setContentSize(size);
        this.addChild(this._rootNode);
        this.initRoomData(obj);//初始化房间信息
        this.initPlayerInfo();
        this.initControl();
        this.initCards() ;


        // zhou start

        this.initTableData();

        this.bankerConfirm();
        // 开始回放
        this.scheduleOnce(this.playTotalAction,1);  //1秒之后

        // zhou end

        this.schedule(this.getSystemInfo,1) ;
		return true;
	},

    initRoomData:function(obj){
        for (var i=0;i<common.TableDirection.length;i++){ //初始化用户数据
            this._playerData[i] = {} ;
        }
        this._gameData = obj;
        this._curRoomNo = obj.roomNo;
        this._curRound = obj.round;
        this._curPlayType = obj.gameType ;
        this._totalStep = obj.actions.length ;


        this._totalActions = obj.actions;

        // 对牌局中所有步骤的牌排序
        for (var i=0;i< this._totalActions.length;i++) {
            var srcMahjongs = this._totalActions[i].mahjongs;
            this._totalActions[i].mahjongs = this.sortUserCards(srcMahjongs);
        }

        console.log("== actions 0",this._totalActions[0].mahjongs);
        // this._onlyKongValue = common.GameInfoByPlayType[this._curPlayType].KongValue ;
        // if (obj.hasOwnProperty("hhType")){
        //     this._curSubPlayType = obj.hhType ;
        //     this._onlyKongValue = common.GameInfoByPlayType[this._curPlayType].KongValue[this._curSubPlayType] ;
        // }
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

    initPlayerInfo:function(){
        for (var dir=0;dir<common.TableDirection.length;dir++){
            var key = "Img"+common.TableDirection[dir] + "Player";
            this._playerInfo[dir] = ccui.helper.seekWidgetByName(this._rootNode,key) ;
            this._playerInfo[dir].setTouchEnabled(true) ;
            this._playerInfo[dir].indexDir = dir ;
            this._playerInfo[dir].addTouchEventListener(this.showPlayerInfo,this);
            this._playerInfo[dir].setVisible(true);
            this.showPlayerHeadPic(dir);
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgFlagMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelAtlasMultiple").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImageFlag").setVisible(false) ; //庄
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgVoice").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgSpeak").setVisible(false) ;
            ccui.helper.seekWidgetByName(this._playerInfo[dir], "LabelScore").setVisible(false) ;

        }
    },

    initControl:function(){

        this._imgMahjongModel = ccui.helper.seekWidgetByName(this._rootNode,"ImgMahjongModel") ;
        this._imgMahjongModel.setVisible(false) ;

        var panelMobileInfo = ccui.helper.seekWidgetByName(this._rootNode, "PanelMobileInfo");
        this._imgWifiInfo = ccui.helper.seekWidgetByName(panelMobileInfo, "ImgWifi");
        this._loadingBarBatteryLevel = ccui.helper.seekWidgetByName(panelMobileInfo, "LoadingBarBattery");
        this._labelCurTime= ccui.helper.seekWidgetByName(panelMobileInfo, "LabelCurTime");

        this._labelMahJongSurplus = ccui.helper.seekWidgetByName(this._rootNode, "LabelSurplusMahjong");
        this._labelMahJongSurplus.setVisible(false) ;

    },
    //初始化牌桌 此时牌桌上不显示麻将
    initCards:function(){
        this._panelDirection = ccui.helper.seekWidgetByName(this._rootNode, "ImageDirectionLight");
        this._panelDirection.setVisible(true);
        for (var dir=0;dir<common.TableDirection.length;dir++){

            this._playerCards[dir] = [];
            var key = "Panel"+common.TableDirection[dir]+"Cards" ;
            this._panelCardsParent[dir] = ccui.helper.seekWidgetByName(this._rootNode, key);
            this._panelCardsParent[dir].setVisible(true) ;

            this._panelOutCardsParent[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir], "PanelOutCard");//出的普通牌的历史记录
            this._panelKongOutCardsParent[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir], "PanelKongOut");//出的杠牌的历史记录

            var keyLight = "Img"+ common.TableDirection[dir]+"Light";  //四个方向高亮箭头
            this._tableDirection[dir] = ccui.helper.seekWidgetByName(this._panelDirection,keyLight);
            this._tableDirection[dir].setVisible(false);

            this._playerDiscard[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir],"ImgDiscard");
            this._playerDiscard[dir].setVisible(false);

            this._panelOutGroupArr[dir] = [] ;
            this._panelOutGroup[dir] = ccui.helper.seekWidgetByName(this._panelCardsParent[dir],"PanelOut");
            this._panelOutGroup[dir].setVisible(false) ;

            var keyOpe = "Img" + common.TableDirection[dir] + "Operate";
            this._imgPlayerOpearte[dir] = ccui.helper.seekWidgetByName(this._rootNode,keyOpe) ;
            this._imgPlayerOpearte[dir].setVisible(false) ;
        }

        this._labelTimer = ccui.helper.seekWidgetByName(this._panelDirection,"LabelAtlas");
        this._labelTimer.setVisible(false);

        var labelStep = ccui.helper.seekWidgetByName(this._rootNode,"LabelSpeedOfProgress") ;
        this._labelCurStep = ccui.helper.seekWidgetByName(labelStep,"LabelCurStep") ;
        this._labelTotalStep = ccui.helper.seekWidgetByName(labelStep,"LabelTotalStep") ;
        this._labelTotalStep.setString(this._totalStep);
        this._labelCurStep.setString(this._curStep);
        ccui.helper.seekWidgetByName(this._rootNode, "LabelRoomNo").setString("房间号:"+this._curRoomNo) ;
        var btnProgress = ccui.helper.seekWidgetByName(this._rootNode,"ImgProgress");
        ccui.helper.seekWidgetByName(btnProgress,"LabelReturn").addTouchEventListener(this.btnReturnClicked,this);
        ccui.helper.seekWidgetByName(btnProgress,"ButtonPause").addTouchEventListener(this.btnPauseClicked,this);
        ccui.helper.seekWidgetByName(btnProgress,"ButtonNext").addTouchEventListener(this.btnNextStepClicked,this);
        ccui.helper.seekWidgetByName(btnProgress,"ButtonFallback").addTouchEventListener(this.btnPreviousStepClicked,this);
    },

    // zhou start

    initTableData:function(){
        console.log(" initTableData ",this._gameData);
        this._kongValue = _.union(this._onlyKongValue,[this._gameData.laizi]);
        //红中癞子杠和红中晃晃 检测碰杠胡的方法不同
        if (this._gameData.gameType == common.PlayType.Normal258){
            this._preCheck = new Check(this._gameData.laizi) ;
        }else if (this._gameData.gameType == common.PlayType.HongHuang){
            this._preCheck = new CheckHuang(this._gameData.laizi,this._gameData.hhType) ;
        }

        // this._surplusMahjong = this._gameData.mahjongCount ;
        // this._surTotalMahjong = this._surplusMahjong + 54 ;
        for (var dir=0;dir<common.TableDirection.length;dir++){
            var uid = this._playerData[dir].uid ;
            // this._playerMahJong[dir] = this._playerData[dir].mahjong;

            var dirPlayerMahJongs = this._totalActions[dir].mahjongs;//this._playerMahJong[seat];//
            // dirPlayerMahJongs = this.sortUserCards(dirPlayerMahJongs);
            console.log("==banker kaiju mahjongs",this._totalActions[0].mahjongs);

            var panelSize = this._panelCardsParent[dir].getContentSize() ;
            for (var num =0;num<dirPlayerMahJongs.length;num++){
                this.calculateMahjongPosition(panelSize,dir,num,false);
            }
        }

    },

    //判断谁是庄
    bankerConfirm:function(){
        var banker = this._gameData.banker;
        console.log("==gameData: ",this._gameData);
        console.log(" ==banker :" + banker);
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

    // 牌局回放
    playTotalAction:function () {
        this._panelDirection.setVisible(true) ;
        // var time = 0;
        this.playStepAction(0);
    },

    // 牌局播放
    // step 第几步
    playStepAction:function(step) {

        if (step == this._totalActions.length) {
            return;
        }

        var action = this._totalActions[step];
        var dir = this.getPlayerDir(action.uid);

        switch (action.type) {
            case 1: // 发牌
                this.showPlayerCards(dir);
                break;
            case 2: // 出牌

                break;
            case 3: // 抓牌

                break;
            case 9: // 吃牌

                break;
            default:

                break;
        }

        var that = this;
        that.scheduleOnce(function(){
            that.playStepAction(++step);
        },1);
    },

    // 根据玩家uid找到其位置
    getPlayerDir:function(uid) {
        var dir;
        for(var i=0;i<this._playerData.length;i++) {
            var user = this._playerData[i];
            if (uid == user.uid) {
                dir = i;
                break;
            }
        }
        return dir;
    },

    //发牌
    dealCards:function(){
        this._panelDirection.setVisible(true) ;
        var time = 0;
        // for (var round=0;round<4;round++){  //发3轮牌

            var start = this._bankerSeat ;
            var end = start + TOTAL_PLAYER_NUMBER ;
            for (var j =start;j<end;j++){
                var seat = (j>=TOTAL_PLAYER_NUMBER) ?(j-TOTAL_PLAYER_NUMBER):j;
                time+=0.5;
                this.showPlayerCards(seat,time);
                var that = this ;
                // if (round == 3){
                //     this.scheduleOnce(function(){
                //         that.updateSuplusMahjongBeforeGameStart();
                //     },time);
                // }else{
                //     this.scheduleOnce(function(){
                //         that.updateSuplusMahjongBeforeGameStart(4);
                //     },time);
                // }
            }

        // }
    },

    showPlayerCards:function(seat,time){

        var start = 0;

        var dirPlayerMahJongs = this._totalActions[seat].mahjongs;//this._playerMahJong[seat];//
        // dirPlayerMahJongs = this.sortUserCards(dirPlayerMahJongs);

        console.log("=== player kaiju mahJong",dirPlayerMahJongs );
        var end = dirPlayerMahJongs .length;

        var spriteArr = [];
        for (var i=start;i<end;i++){
            spriteArr.push(this._playerCards[seat][i]) ;
        }
        var maxTime = 0.5 * 16 ;
        var that = this ;
        var flag = false ;

        console.log("=== spriteArr :",spriteArr);
        console.log("=== sprite 0",spriteArr[0]);

        spriteArr.forEach(function(sprite){
            sprite.runAction(
                cc.sequence(
                    cc.delayTime(0.0),//cc.delayTime(time),
                    cc.callFunc(function(){
                        sprite.setVisible(true) ;
                        that.showTableDirection(seat) ;
                        // if (time >= maxTime && flag== false){
                        //     flag  = true ;
                        //     that.scheduleOnce(that.showLaiZi,0.5) ;
                        //     that.scheduleOnce(that.hideUserCards,0.5);
                        //     that.playWordTips(common.ShowWordType.TYPE_LAI_ZI_CONFIRM);
                        //     return ;
                        // }
                    },this)
                )
            )
        })

        this.scheduleOnce(this.lightCard,0.0);
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

    /**上的麻将显示位置
     * 计算牌桌
     * @param panelSize
     * @param dir
     * @param num
     * @param isNew  是否为最后新起的一张牌
     */
    calculateMahjongPosition:function(panelSize,dir,num,isNew){
        var sprite ;
        if (dir == MY_DIRECTION){

            var dirPlayerMahJongs  = this._totalActions[dir].mahjongs;//this._playerMahJong[seat];//


            sprite = this._imgMahjongModel.clone();
            sprite.num = num;
            sprite.indexValue = dirPlayerMahJongs[num] ;
            var isKong = false ;
            var mahjong = dirPlayerMahJongs[num] ;
            if (_.indexOf(this._onlyKongValue,mahjong)!=-1){
                isKong = true ;
            }
            ccui.helper.seekWidgetByName(sprite, "ImgLaiziFlag").setVisible(false);
            ccui.helper.seekWidgetByName(sprite, "ImgKongFlag").setVisible(isKong); //杠牌的标记一开始就显示
            ccui.helper.seekWidgetByName(sprite, "ImgPlayToTing").setVisible(false);
            sprite.setTouchEnabled(true);
            sprite.addTouchEventListener(this.userCardClicked,this);
            var img = CARD_IMAGE_PATH+"dd_hand1.png" ;
            if (dirPlayerMahJongs[num]){
                console.log(" _playerMahJong "+ num+"-"+dirPlayerMahJongs[num]);
                img = CARD_IMAGE_PATH+"dd_hand"+dirPlayerMahJongs[num]+".png" ;
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
            num+=1 ; //为了计算坐标
            if (dir ==0 || dir == 2){
                num +=0.4 ;
            }
            this._playerCardsNew[dir] = sprite ;
        }

        var posX = 0 ;
        var posY = 0 ;
        switch (dir){
            case 0:
                posY = panelSize.height-120 - num*42;
                break;
            case 1:
                posX = 120+num*110;
                break;
            case 2:
                posX = 0 ;
                posY =  num*42;
                sprite.zIndex = (20-Math.floor(num));
                break;
            case 3:
                posX = panelSize.width-460 - num*75;
                posY = 0 ;
                break;
        }
        sprite.x = posX ;
        sprite.y = posY ;
    },

    /**
     * 亮牌
     */
    lightCard:function(){

        for (var dir=0;dir<common.TableDirection.length;dir++){
            var mahjongs = this._totalActions[dir].mahjongs;//this._playerData[dir].mahjong ;
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
     * 玩家手牌排序 癞子永远在最左边
     * 从左到右：红中、发财、癞子、万（1-9）、条（1-9）、筒（1-9）、东、南、西、北、白
     * @param direct
     */
    sortUserCards:function(srcMahjongs){

        var resultArr = [];

        var laiZi = this._gameData.laizi ;

        console.log("== laizi "+ laiZi);

        var greenDragonAmount = 0 ; //发财的数量
        var redDragonAmount = 0; //红中的数量
        var laiZiAmount = 0 ;//玩家拥有癞子的数量
        var kongValue = this._onlyKongValue ;
        _.each(srcMahjongs,function(num){
            if (_.indexOf(kongValue,num)!=-1 && num == RED_DRAGON){
                redDragonAmount++;
            } if (_.indexOf(kongValue,num)!=-1 && num ==GREEN_DRAGON ){
                greenDragonAmount++;
            }else if (num ==laiZi){
                laiZiAmount++;
            }
        });
        var dataArr = _.without(srcMahjongs,laiZi);
        for (var i= 0;i<kongValue.length;i++){
            dataArr = _.without(dataArr,kongValue[i]);
        }
        dataArr.sort(function (a,b){
            return a-b;
        });
        srcMahjongs = [] ;
        while (redDragonAmount>0){
            resultArr.push(RED_DRAGON) ;
            redDragonAmount -- ;
        }
        while (greenDragonAmount>0){
            resultArr.push(GREEN_DRAGON) ;
            greenDragonAmount--;
        }
        while (laiZiAmount>0){
            resultArr.push(laiZi) ;
            laiZiAmount--;
        }
        // var target = this ;
        _.each(dataArr,function(num){
            resultArr.push(num) ;
        });

        return resultArr;
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
                sprite.setPosition(size.width +10,size.height-10);
                sprite.setScale(0.8);
                break ;
            case 1 :
                sprite.setPosition(35,size.height-45);
                break ;
            case 2:
                sprite.setPosition(30,size.height-10);
                sprite.setScale(0.8);
                break ;
            case 3:
                sprite.setPosition(30,size.height-30);
                break ;
        }
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
            console.log(" this._playerNewMahjong[dir] dir "+dir,this._playerNewMahjong[dir] );
            console.log(" dir "+ dir + " MY_DIRECTION:"+ MY_DIRECTION);
            if (dir == MY_DIRECTION){
                var sprite = this._playerCardsNew[dir] ;
                var value = this._playerNewMahjong[dir] ;
                var num = this._playerMahJong[dir].length ;
                this.initSpriteStatus(sprite,value,num)
            }
        }
    },

    //玩家点击某张牌
    userCardClicked:function(widget, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            console.log(" widget index : " + widget.num);
            console.log(" widget index Value : " + widget.indexValue);
            var index = widget.num;
            var widgetHeight = widget.getContentSize().height-30;
            var value = widget.indexValue;
            console.log(" this._ClickedCardNo" +this._ClickedCardNo);
            var posY = 0 ;
            this.recoveryHighLightOutMahjong();
            this._playerDiscard[MY_DIRECTION].setVisible(false) ;
            if (this._ClickedCardNo == -1){
                widget.setPositionY(posY+widgetHeight);
                this._ClickedCardNo = index ;
                this._lastClickedCards = widget;
                this.highLightOutMahjong(value);
            }else if (this._ClickedCardNo == index){ //处理出牌的逻辑 两次点击即为出牌
                var params = {
                    roomNo:this._curRoomNo,
                    mahjong:value
                };
                net.NetManage.playMahjong(params) ;
            }else {	//两次点的不是同一张牌
                this._lastClickedCards.setPositionY(posY);
                widget.setPositionY(posY+widgetHeight);
                this._ClickedCardNo = index ;
                this._lastClickedCards = widget;
                this.highLightOutMahjong(value);
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
            //     flag.setVisible(true) ;
            //     flag.runAction(cc.repeatForever(
            //         cc.sequence(
            //             cc.fadeIn(0.5),
            //             cc.fadeOut(0.5)
            //         )
            //     ));
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


    removeCards:function(dir){
        var len = this._playerCards[dir].length ;
        var num = this._playerMahJong[dir].length ;
        console.log("removeCards len:"+len+" num:"+num);
        for(var i=len;i>num;i--){
            var key  = i-1;
            if (this._playerCards[dir][key]){
                this._playerCards[dir][key].removeFromParent();
                this._playerCards[dir].pop();
            }
        }
    },

    // zhou end


    /**
     * 下一步
     * @param widget
     * @param touchType
     */
    btnNextStepClicked:function(widget, touchType) {
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
    },

    /**
     * 上一步操作
     * @param widget
     * @param touchType
     */
    btnPreviousStepClicked:function(widget, touchType){
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;

    },

    /**
     * 暂停
     * @param widget
     * @param touchType
     */
    btnPauseClicked:function (widget, touchType) {
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        
    },

    /**
     * 返回大厅
     * @param widget
     * @param touchType
     */
    btnReturnClicked:function (widget, touchType) {
        if (touchType != ccui.Widget.TOUCH_ENDED) return ;
        this.send(common.NotifyType.GO_TO_LOBBY);
    },

    /**
     * 如果玩家操作有吃碰杠胡的时候  需要做下面的操作
     * @param dir
     */
    showPlayerOpereate:function(dir){
        this._imgPlayerOpearte[dir].setVisible(true) ;
        var imgFingle = ccui.helper.seekWidgetByName(this._imgPlayerOpearte[dir],"ImgUserOperate") ;
        var labelChow = ccui.helper.seekWidgetByName(this._imgPlayerOpearte[dir],"LabelChow") ;
        var labelWin = ccui.helper.seekWidgetByName(this._imgPlayerOpearte[dir],"LabelWin") ;
        var labelKong = ccui.helper.seekWidgetByName(this._imgPlayerOpearte[dir],"LabelKong") ;
        var labelPass = ccui.helper.seekWidgetByName(this._imgPlayerOpearte[dir],"LabelPass") ;
        var labelPong = ccui.helper.seekWidgetByName(this._imgPlayerOpearte[dir],"LabelPong") ;
        var colorGrey = cc.color(190,190,190,255) ;
        var colorBright = cc.color(255,219,82,255) ;



    },

    /**
     * 更新进度信息
     */
    updateStepInfo:function(){
        this._labelCurStep.setString(this._curStep);
    },

    showPlayerHeadPic:function(dir){
        var uid = this._playerData[dir].uid ;
        var headPic = ccui.helper.seekWidgetByName(this._playerInfo[dir], "ImgHeadPic") ;
        var img = "res/ui/icon/head_"+this._tmpHeadImg[uid]+".jpg";
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
            if (this._playerData[dir].hasOwnProperty("headimgurl")){
                img = this._playerData[dir].headimgurl ;
            }
            this.loadHeadPic(headPic,img) ;
        }else{
            this.loadHeadPic(headPic,img) ;
        }
    },

    /**
     * 至少能获取当前时间啊
     */
    getSystemInfo:function(){
        var curTime = (new Date()).Format("hh:mm");
        this._labelCurTime.setString(curTime);
    },

    subscrib:function(){
    },

    unsubscrib:function(){
    },
});