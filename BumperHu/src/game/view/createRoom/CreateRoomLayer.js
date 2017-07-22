//roomType  1 房主开房  2 代开  3 AA支付

main.CreateRoomLayer = game.IView.extend({
    uiHelper:null,

    _curSelectType:null,
    _selectSubPlayType:null,
    _curLeftBtn:null,
    _selectPayWay:null,
    _selectRound:null,
    _selectTop:null,
    _selectWinMultiple:null,
    _selectBase:null,
    _selectPlayWay:null,

    _roomCard:null,  //获取玩家房卡数
    _playType : {} ,
    _subPlayType:{},
    _gameConfig:{},
    _posXArr:{},

    _itemCheckBox:null,
    _imgRoomCard:null,
    _imgBg:null,
    _imgEachItem:null,
    _panelImgQuestion:null,
    _btnCheckBoxLimit:null,
    _btnCheckBoxPlayType:null,
    _imgRoomCardArr : [] ,
    ctor:function (data) {
        this._super();
        var size = cc.winSize;
        console.log(" create Room  ",data);
        this.uiHelper =  new game.UIHelper();
        var root = this.uiHelper.doLayout(res.CreateRoom_json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);
        var node = ccui.helper.seekWidgetByName(root,"ImgBackground");

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_CREATE_ROOM_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        var btnCreate=ccui.helper.seekWidgetByName(node,"ButtonCreate");
        btnCreate.setTouchEnabled(true) ;
        btnCreate.addTouchEventListener(this.btnCreateClicked,this);

        var labelHigh = ccui.helper.seekWidgetByName(node,"LabelHigh");
        var btnQue = ccui.helper.seekWidgetByName(labelHigh,"ButtonIpQuestion");
        btnQue.setTouchEnabled(true) ;
        btnQue.addTouchEventListener(this.btnQuestionClicked,this) ;

        this._btnCheckBoxLimit = ccui.helper.seekWidgetByName(labelHigh,"CheckBoxLimit");
        this._btnCheckBoxLimit.setTouchEnabled(true) ;

        this._imgBg = ccui.helper.seekWidgetByName(node,"ImgBg");
        this._imgEachItem = ccui.helper.seekWidgetByName(node,"ImgEachItem");
        this._imgRoomCard = ccui.helper.seekWidgetByName(node,"ImageViewRoomCard");
        this._imgRoomCard.setVisible(false) ;
        this._itemCheckBox = ccui.helper.seekWidgetByName(node,"ItemCheckBox");
        this._imgQuestion=ccui.helper.seekWidgetByName(node,"ImgQuestion");
        this._imgQuestion.setVisible(false);
        this._imgQuestion.setTouchEnabled(true);
        this._imgQuestion.addTouchEventListener(function (sender,type) {
            if(type==ccui.Widget.TOUCH_ENDED){
                sender.setVisible(false);
            }
        },this);

        this._btnCheckBoxPlayType = ccui.helper.seekWidgetByName(node,"CheckBoxPlayType") ;

        var width =  this._imgEachItem.getContentSize().width ;
        this._posXArr =  {
            2:[1.5*width/8,5*width/8],
            3:[1.5*width/8,3*width/8,5*width/8],
            4:[1.5*width/8,3*width/8,5*width/8,7*width/8]
        };
        var self = this ;
        _.each(data,function(config){
            var gameType = config.ins_type ;
            var subGameType = config.ins_play_type ;
            var price = (config.ins_price).split('-') ;// 不同支付方式  不同局数对应的房卡数量
            var payWay = (config.ins_pay_type).split('|') ;
            var priceObj= {};
            for (var i=0;i<payWay.length;i++){
                priceObj[payWay[i].toString()] = price[i].split('|');
            }
            if (!self._gameConfig.hasOwnProperty(gameType)){
                self._gameConfig[gameType] = {} ;
            }
            var obj = {
                name:config.ins_name,
                payWay:payWay,            //支付方式   具体参照 common.PayWay
                baseFactor:(config.ins_antes).split('|'),           //底分倍数
                minWinMulti:(config.ins_min_multiple).split('|'),   //胡牌低倍
                winMaxMulti:(config.ins_max_multiple).split('|'),   //封顶倍数
                round:(config.ins_board_number).split('|'),         //局数
                price:priceObj
            };
            self._gameConfig[gameType][subGameType] = obj;
        });

        var playTypes = _.keys(this._gameConfig);   //对应左边菜单栏
        var bgSize =  this._imgBg.getContentSize() ;
        var checkBoxHeight = this._btnCheckBoxPlayType.getContentSize().height ;
        console.log(" checkBoxHeight ",checkBoxHeight);
        for (var i=0;i<playTypes.length;i++){
            var checkBox = this._btnCheckBoxPlayType.clone();
            checkBox._playType = playTypes[i] ;
            checkBox.setTouchEnabled(true) ;
            checkBox.setSelected(false) ;
            checkBox.addEventListener(this.btnPlayTypeClicked,this) ;
            checkBox.setPositionY(bgSize.height-30 - i*(checkBoxHeight-15)) ;
            node.addChild(checkBox);
            if (i == 0){
                checkBox.setSelected(true) ;
                checkBox.setTouchEnabled(false);
                this._curLeftBtn=checkBox;
                this._curSelectType = playTypes[i] ;
            }
            var imgName = ccui.helper.seekWidgetByName(checkBox,"ImageView") ;
            imgName.loadTexture(common.GameInfoByPlayType[playTypes[i]].img) ;
        }
        this.showInfoByType();
        this.addChild(root);
        return true;
    },

    showInfoByType:function(){
        this._imgRoomCardArr = [] ;
        this._imgBg.removeAllChildren() ;
        var bgSize = this._imgBg.getContentSize();
        var gameConfig = this._gameConfig[this._curSelectType];
        var subTypes = _.keys(gameConfig);  //子玩法
        var startY = bgSize.height -80 ;
        var gap = (subTypes.length > 1) ? 5 : 10 ;
        var eachHeight =( this._imgEachItem.getContentSize().height  + gap);  //每个栏位的间距
        var height = eachHeight/2;
        var number = 0 ;
        this._selectSubPlayType =  subTypes[0];
        if (subTypes.length>1){
            var imgPlayType = this._imgEachItem.clone();
            ccui.helper.seekWidgetByName(imgPlayType,"Label").setString("玩法");
            this._imgBg.addChild(imgPlayType);
            imgPlayType.setPosition(cc.p(bgSize.width/2,startY -  eachHeight * number++)) ;
            var labelObj = {};
            for (var i=0;i<subTypes.length;i++){
                labelObj[subTypes[i]] = this._gameConfig[this._curSelectType][subTypes[i]].name ;
            }
            this._selectPlayWay =this.handleCheckBox(imgPlayType,subTypes,labelObj,height,this.checkBoxPlayTypeClicked) ;
        }

        var imgPayWay = this._imgEachItem.clone() ;
        ccui.helper.seekWidgetByName(imgPayWay,"Label").setString("收费");
        this._imgBg.addChild(imgPayWay);
        imgPayWay.setPosition(cc.p(bgSize.width/2,startY -  eachHeight * number++)) ;
        var payTypeArr = this._gameConfig[this._curSelectType][this._selectSubPlayType].payWay;
        this._selectPayWay = this.handleCheckBox(imgPayWay,payTypeArr,common.PayWay,height,this.checkBoxPayWayClicked);

        var imgStartWin = this._imgEachItem.clone();
        ccui.helper.seekWidgetByName(imgStartWin,"Label").setString("起胡");
        this._imgBg.addChild(imgStartWin);
        imgStartWin.setPosition(cc.p(bgSize.width/2,startY -  eachHeight * number++)) ;
        var startWinArr = this._gameConfig[this._curSelectType][this._selectSubPlayType].minWinMulti;
        this._selectWinMultiple = this.handleCheckBox(imgStartWin,startWinArr,'倍',height,this.checkBoxWinMultipleClicked) ;

        var imgBaseFactor = this._imgEachItem.clone();
        ccui.helper.seekWidgetByName(imgBaseFactor,"Label").setString("底分");
        this._imgBg.addChild(imgBaseFactor);
        imgBaseFactor.setPosition(cc.p(bgSize.width/2,startY -  eachHeight * number++)) ;
        var baseFacArr = this._gameConfig[this._curSelectType][this._selectSubPlayType].baseFactor;
        baseFacArr.sort() ;
        this._selectBase = this.handleCheckBox(imgBaseFactor,baseFacArr,'',height,this.checkBoxBaseFactorClicked) ;

        var imgTop = this._imgEachItem.clone();
        var labelTopName = ccui.helper.seekWidgetByName(imgTop,"Label") ;
        labelTopName.setString(common.GameInfoByPlayType[this._curSelectType].topName);
        this._imgBg.addChild(imgTop);
        var curImgTopHeight = height ;
        var topArr = this._gameConfig[this._curSelectType][this._selectSubPlayType].winMaxMulti;
        if (common.GameInfoByPlayType[this._curSelectType].hasOwnProperty('tips')){
            var tips = common.GameInfoByPlayType[this._curSelectType]['tips'] ;
            curImgTopHeight = eachHeight *1.5;
            imgTop.setContentSize(cc.size(imgTop.getContentSize().width,curImgTopHeight)) ;
            imgTop.setPosition(cc.p(bgSize.width/2,startY -  eachHeight * (number+0.3))) ;
            labelTopName.setPositionY(labelTopName.getPositionY()+50) ;
            number++ ;
            var label = new cc.LabelTTF(tips,"Arial", 26);
            label.setAnchorPoint(cc.p(0,0)) ;
            label.setPosition(cc.p(200,15));
            imgTop.addChild(label) ;
        }else{
            imgTop.setPosition(cc.p(bgSize.width/2,startY -  eachHeight * number++)) ;
        }
        var checkBoxY = (curImgTopHeight == height )?height : (eachHeight + 10) ;
        this._selectTop = this.handleCheckBox(imgTop,topArr,'倍',checkBoxY,this.checkBoxTopClicked) ;

        var imgRound = this._imgEachItem.clone();
        ccui.helper.seekWidgetByName(imgRound,"Label").setString("局数");
        this._imgBg.addChild(imgRound);
        var shift =(curImgTopHeight == height) ? 0: (height+10)  ;
        imgRound.setPosition(cc.p(bgSize.width/2,startY - shift - eachHeight * number++ )) ;
        var roundArr = this._gameConfig[this._curSelectType][this._selectSubPlayType].round;
        var priceObj = this._gameConfig[this._curSelectType][this._selectSubPlayType].price ;
        var payWay = this._selectPayWay._value ;
        this._selectRound = this.handleCheckBox(imgRound,roundArr,'局',height,this.checkBoxTotalRoundClicked,priceObj[payWay]) ;
        this.updateRoomCardInfo();
    },

    /**
     * 处理checkBox
     * @param parent
     * @param dataArr
     * @param labelName
     * @param posY
     * @param clickFunc
     * @param roomCardArr
     * @returns {*}
     */
    handleCheckBox:function(parent,dataArr,labelName,posY,clickFunc,roomCardArr){
        var defaultCheckBox ;
        for (var i=0;i<dataArr.length;i++){
            var checkBox = this._itemCheckBox.clone() ;
            checkBox._value = dataArr[i];
            parent.addChild(checkBox);
            checkBox.setPosition(cc.p(this._posXArr[dataArr.length][i],posY-10)) ;
            checkBox.setVisible(true) ;
            var name = "";
            if (_.isObject(labelName)){
                name = labelName[dataArr[i]] ;
            }else {
                name = dataArr[i] + labelName ;
            }
            ccui.helper.seekWidgetByName(checkBox,"Label").setString(name) ;
            checkBox.setSelected(false);
            checkBox.setTouchEnabled(true) ;
            if (i==0){
                defaultCheckBox = checkBox;
                checkBox.setSelected(true);
                checkBox.setTouchEnabled(false) ;
            }
            if (clickFunc!=undefined){
                checkBox.addEventListener(clickFunc,this) ;
            }
            if (roomCardArr != undefined){
                console.log(" roomCardArr ",roomCardArr);
                var baseRoomCard = this._imgRoomCard.clone();
                baseRoomCard.setVisible(true) ;
                baseRoomCard.setPosition(cc.p(180,15)) ;
                checkBox.addChild(baseRoomCard);
                this._imgRoomCardArr.push(baseRoomCard) ;
            }
        }
        return defaultCheckBox ;
    },

    /**
     * 根据玩法 和  支付方式修改房卡数量
     */
    updateRoomCardInfo:function(){
        var priceObj = this._gameConfig[this._curSelectType][this._selectSubPlayType].price ;
        var payWay = this._selectPayWay._value ;
        var roomCard = priceObj[payWay];
        for (var i=0;i<this._imgRoomCardArr.length;i++){
            ccui.helper.seekWidgetByName(this._imgRoomCardArr[i],"LabelRoomCard").setString("房卡x"+roomCard[i]) ;
        }
    },

    btnCreateClicked:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            var roomType = this._selectPayWay._value;
            console.log("--->",this._selectSubPlayType);
            var params= {
                roomCount:this._selectRound._value,
                roomType:this._selectPayWay._value,
                huCount:this._selectWinMultiple._value,
                gameType:this._curSelectType,
                hhType:this._selectSubPlayType,
                underScore:this._selectBase._value,
                areaLimit:this._btnCheckBoxLimit.isSelected()
            } ;
            if (this._curSelectType == 1){
                params['maxHuCount'] = this._selectTop._value;
            }else{
                params['theTop'] = this._selectTop._value;
            }
            console.log("btnCreateClicked params ",params);
            if (roomType == 2){
                net.NetManage.openRoom(params);
            }else{
                net.NetManage.createRoom(params);
            }
            this.showLoadingCircle() ;
        }
    },

    tip:function(){
        var params={
            desc:common.TipsDesc.NotEnoughRoomCard,
            close:false,
            confirm:function () {
                game.Notification.send(common.NotifyType.SHOW_SHOP_PANEL);
            },
            cancel:function () {
                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
            }
        };
        this.send(common.NotifyType.SHOW_TIPS_PANEL,params);
    },

    testFun:function(){

    },

    checkBoxPayWayClicked:function(sender, type){
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (sender == this._selectPayWay) return;
            console.log("----type-->" ,this._selectPayWay._value);
            this._selectPayWay.setSelected(false);
            this._selectPayWay.setTouchEnabled(true);
            sender.setTouchEnabled(false);
            sender.setSelected(true);
            this._selectPayWay = sender;
            this.updateRoomCardInfo();
        }
    },

    checkBoxTotalRoundClicked:function(sender, type){
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (sender == this._selectRound) return;
            this._selectRound.setSelected(false);
            this._selectRound.setTouchEnabled(true);
            sender.setTouchEnabled(false);
            sender.setSelected(true);
            this._selectRound = sender;
        }
    },

    checkBoxTopClicked:function(sender, type){
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (sender == this._selectTop) return;
            this._selectTop.setSelected(false);
            this._selectTop.setTouchEnabled(true);
            sender.setTouchEnabled(false);
            sender.setSelected(true);
            this._selectTop = sender;
        }
    },

    checkBoxWinMultipleClicked:function(sender, type){
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (sender == this._selectWinMultiple) return;
            this._selectWinMultiple.setSelected(false);
            this._selectWinMultiple.setTouchEnabled(true);
            sender.setTouchEnabled(false);
            sender.setSelected(true);
            this._selectWinMultiple = sender;
        }
    },
    checkBoxBaseFactorClicked:function (sender,type) {
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (sender == this._selectBase) return;
            this._selectBase.setSelected(false);
            this._selectBase.setTouchEnabled(true);
            sender.setTouchEnabled(false);
            sender.setSelected(true);
            this._selectBase = sender;
        }
    },
    checkBoxPlayTypeClicked:function (sender,type) {
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (sender == this._selectPlayWay) return;
            this._selectPlayWay.setSelected(false);
            this._selectPlayWay.setTouchEnabled(true);
            sender.setTouchEnabled(false);
            sender.setSelected(true);
            this._selectPlayWay = sender;
            this._selectSubPlayType = sender._value ;
            this.updateRoomCardInfo();
        }
    },

    btnPlayTypeClicked:function (sender,type) {
        if(type == ccui.CheckBox.EVENT_SELECTED) {
            if (this._curLeftBtn == sender) return ;
            this._curLeftBtn.setSelected(false);
            this._curLeftBtn.setTouchEnabled(true) ;
            sender.setTouchEnabled(false) ;
            sender.setSelected(true);
            this._curLeftBtn = sender;
            this._curSelectType = sender._playType ;
            this.showInfoByType() ;
        }
    },

    btnQuestionClicked:function(sender,type){
        if (type ==ccui.Widget.TOUCH_ENDED){
            this._imgQuestion.setVisible(true) ;
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    },
});