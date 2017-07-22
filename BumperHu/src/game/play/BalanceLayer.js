
//已开房间
play.BalanceLayer = game.IView.extend({
    uiHelper:null,
    _rootNode:null ,
    _type : 0 , //0 单局结算  1 全部结束结算    2 流局
    _allResult:{},
    _result:{},
    _ownerId:null,  //房主
    _bankerId:null, //庄

    ctor:function (obj) {
        this._super();
        var size = cc.winSize;
        this._allResult = obj.allResult ;
        this._result = _.omit(obj.result,"createTime") ;
        this._ownerId = this._allResult.ownerUid ;
        this._bankerId = obj.banker ;
        console.log("BalanceLayer result : ",this._result);
        console.log("BalanceLayer allResult : ",this._allResult);
        console.log("BalanceLayer obj : ",obj);
        this.uiHelper =  new game.UIHelper();
        var json = res.GameOver_json ;
        if (obj.isFlow  == true){
            this._type = 2 ;
            json = res.GameDraw_json ;
        }else if (this._allResult.roundCount == this._allResult.round){
            this._type = 1 ;
            json = res.GameRank_json ;
        }
        var root = this.uiHelper.doLayout(json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);
        this._rootNode = ccui.helper.seekWidgetByName(root,"ImgBackground");

        var btnClose=ccui.helper.seekWidgetByName(this._rootNode,"ButtonClose");
        btnClose.setTouchEnabled(true) ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);
        //0 单局结算  1 全部结束结算    2 流局
        switch (this._type){
            case 0:
                this.singleBalanceInfo();
                break ;
            case 1:
                this.totalBalanceInfo();
                break;
            case 2:
                this.gameDraw() ;
                break;
        }

        this.addChild(root);
        return true;
    },

    /**
     * 单局结算
     */
    singleBalanceInfo:function(){
        var btnContinue = ccui.helper.seekWidgetByName(this._rootNode,"ButtonContinue");
        btnContinue.setTouchEnabled(true) ;
        btnContinue.addTouchEventListener(this.btnContinueClicked,this);

        var result = this._result ;
        var node = this._rootNode ;
        var uIDs = _.keys(result);
        var numNotKaiKou = 0 ;
        var maxLoseFan = 0;
        var totalLoseScore = 0 ;
        var backBrandUid =null ;
        var winUid = null ;
        _.each(uIDs,function(uid){
            var user = result[uid] ;
            var funRecord = user.funRecord ;
            console.log(" funRecord ",funRecord);
            console.log(" funRecord.length ",funRecord.length);
            result[uid]['isKaiKou'] = false ;
            var funRecords = {} ;
            for (var i= 0 ;i<funRecord.length;i++){
                var funType = _.keys(funRecord[i]) ;
                var value = _.values(funRecord[i]) ;
                if (funRecords[funType.toString()]){
                    funRecords[funType.toString()] *= _.first(value) ;
                }else{
                    funRecords[funType.toString()] = _.first(value) ;
                }
                if (funType == common.TypeKaiKou ){
                    result[uid]['isKaiKou'] = true ;
                }
            }
            console.log(" uid funRecords ",funRecords ,uid);
            result[uid]['funRecords'] = funRecords ;
            if (result[uid]['isKaiKou'] == false){
                numNotKaiKou ++ ;
            }
            if (result[uid].packBrand == true){ //玩家包牌
                backBrandUid = uid ;
            }
            if (result[uid].score < 0){
                totalLoseScore += result[uid].score ;
                if (result[uid].funNum > 300){
                    maxLoseFan++ ;
                }
            }else if (result[uid].score > 0){
                winUid = uid ;
            }
        });
        //maxLoseFan > 0  有封顶个
        // maxLoseFan>= 3 金顶
        // maxLoseFan>= 3 && numNotKaiKou >=1  光明顶
        // maxLoseFan>= 3 && numNotKaiKou >=3 哈巴顶

        for(var dir =0 ;dir<uIDs.length;dir ++){
            var uid = uIDs[dir] ;
            var user = _.clone(result[uid]) ;
            var imgBase = ccui.helper.seekWidgetByName(node,"ImgBase"+(dir+1));
            var labelShowWord = ccui.helper.seekWidgetByName(imgBase,"LabelShowWord") ;
            var img = common.ScoreStatus.ZERO ;
            var color = common.TypeColor.TIE;
            if (user.score > 0){
                img = common.ScoreStatus.UP;
                color = common.TypeColor.WIN ;
                labelShowWord.setString(common.BalanceWord.WinnerFan+" X"+user.winUserFunNum);
            }else if (user.score < 0){
                img = common.ScoreStatus.DOWN ;
                color = common.TypeColor.LOSE ;
                labelShowWord.setString(common.BalanceWord.Total+" X"+ user.funNum);
            }else{
                labelShowWord.setVisible(false);
                ccui.helper.seekWidgetByName(imgBase,"ImgScoreStatus").setVisible(false) ;
            }
            ccui.helper.seekWidgetByName(imgBase,"ImgScoreStatus").loadTexture(img) ;
            ccui.helper.seekWidgetByName(imgBase,"LabelNickname").setString(user.nickname) ;
            ccui.helper.seekWidgetByName(imgBase,"LabelPlayerId").setString(user.id);

            if (this._bankerId == uid){
                ccui.helper.seekWidgetByName(imgBase,"ImgBanker").setVisible(true) ;
            }else{
                ccui.helper.seekWidgetByName(imgBase,"ImgBanker").setVisible(false) ;
            }
            var imgHeadPic = ccui.helper.seekWidgetByName(imgBase,"ImgHeadPic");
            this.loadHeadPic(imgHeadPic,user,common.ClipType.Circle);
            var imgFlag = ccui.helper.seekWidgetByName(imgBase,"ImgRoleFlag") ;
            var funRecords = user.funRecords;
            if (maxLoseFan >= 3){
                imgFlag.setVisible(true) ;
                if (numNotKaiKou >= 3){
                    imgFlag.loadTexture(common.PlayerRoleFlag.HA_BA_DING);
                    labelShowWord.setString(common.BalanceWord.Total+" X"+common.MaxFan.HA_BA_DING) ;
                }else if (numNotKaiKou >= 1){
                    imgFlag.loadTexture(common.PlayerRoleFlag.GUANG_MING_DING);
                    labelShowWord.setString(common.BalanceWord.Total+" X"+common.MaxFan.GUANG_MING_DING) ;
                }else {
                    imgFlag.loadTexture(common.PlayerRoleFlag.JIN_DING);
                    labelShowWord.setString(common.BalanceWord.Total+" X"+common.MaxFan.JIN_DING) ;
                }
            }else if (maxLoseFan>=1){
                imgFlag.setVisible(true) ;
                imgFlag.loadTexture(common.PlayerRoleFlag.FENG_DING);
                labelShowWord.setString(common.BalanceWord.Total+" X"+common.MaxFan.FENG_DING) ;
            }else{
                imgFlag.setVisible(false) ;
            }
            if (user.score > 0){
                imgFlag.setVisible(false) ;
            }
            var labelScore = ccui.helper.seekWidgetByName(imgBase,"LabelScore") ;
            var scoreStr = (user.score > 0) ? ("+" + user.score) : user.score ;
            labelScore.setString(scoreStr) ;
            labelScore.setColor(color) ;
            var imgBackBrand = ccui.helper.seekWidgetByName(imgBase,"ImgBackBrand") ;
            if (backBrandUid != null){ //有包牌的情况
                if (uid == backBrandUid){
                    imgFlag.setVisible(true) ;
                    imgBackBrand.setVisible(true) ;
                    labelScore.setString(totalLoseScore) ;
                    labelScore.setColor(color) ;
                }else if (uid != winUid){
                    labelScore.setString("0") ;
                    imgBackBrand.setVisible(false) ;
                }
            }else{
                imgBackBrand.setVisible(false) ;
            }
            var labelD = ccui.helper.seekWidgetByName(imgBase,"LabelDesc");
            labelD.setVisible(false) ;
            var labelM = ccui.helper.seekWidgetByName(imgBase,"LabelMultiple");
            labelM.setVisible(false) ;

            var types = _.keys(funRecords);
            if (_.isEmpty(types)){
                continue ;
            }

            var pos = labelD.getPosition();
            var posM = labelM.getPosition() ;
            for (var i=0;i<types.length;i++){
                this.dealMultiple(imgBase,labelD,labelM,pos,posM,common.FunRecordText[types[i]]+"番数",funRecords[types[i]],i);
            }
            if (user.score < 0){  //输家还要显示赢家底倍
                this.dealMultiple(imgBase,labelD,labelM,pos,posM,common.WinUserFunNum,user.winUserFunNum,i);
            }
        }
    },

    /**
     * 显示赢家底倍等数据
     * @param imgBase
     * @param labelD
     * @param labelM
     * @param pos
     * @param posM
     * @param desc
     * @param multiple
     */
    dealMultiple:function(imgBase,labelD,labelM,pos,posM,desc,multiple,i){
        var labelDesc = labelD.clone();
        labelDesc.setVisible(true) ;
        labelDesc.x = pos.x ;
        labelDesc.y = pos.y - (i* (labelDesc.getContentSize().height + 10));
        labelDesc.setString(desc) ;
        imgBase.addChild(labelDesc);
        labelDesc.setVisible(true) ;

        var labelMul = labelM.clone();
        labelMul.setVisible(true) ;
        labelMul.x = posM.x ;
        labelMul.y = posM.y - (i* (labelMul.getContentSize().height + 10));
        labelMul.setString("X"+multiple) ;
        imgBase.addChild(labelMul);
        labelMul.setVisible(true);
    },

    totalBalanceInfo:function(){
        var result = this._result ;
        var allResult = this._allResult ;
        var uIDs = _.keys(allResult); //TODO 这里的uid应该是按照排名排序的
        for (var i=0;i<4;i++){
            var uid = uIDs[i] ;
            var key = "ImgRank"+(i+1);
            var user = result[uid];
            user.score = allResult[uid].score ;
            user.win = allResult[uid].win ;
            var base = ccui.helper.seekWidgetByName(this._rootNode,key);
            var color = common.TypeColor.TIE;
            if (user.score > 0){
                color = common.TypeColor.WIN ;
            }else if (user.score<0){
                color = common.TypeColor.LOSE ;
            }
            var labelScore = ccui.helper.seekWidgetByName(base,"LabelScore"); //积分
            labelScore.setString(user.score) ;
            labelScore.setColor(color) ;
            ccui.helper.seekWidgetByName(base,"LabelTotalRound").setString("对局数"+ allResult.round) ; //对局数
            ccui.helper.seekWidgetByName(base,"LabelWinRound").setString("胜局"+ user.win); //胜局数
            ccui.helper.seekWidgetByName(base,"LabelNickname").setString(user.nickname) ;
            var imgHeadPic = ccui.helper.seekWidgetByName(base,"ImgHeadPic"); //头像
            this.loadHeadPic(imgHeadPic,user,common.ClipType.Circle) ;
        }

        var btnShare = ccui.helper.seekWidgetByName(this._rootNode,"ButtonShare");
        btnShare.setTouchEnabled(true) ;
        btnShare.addTouchEventListener(this.btnShareClicked,this);

        var btnQuit = ccui.helper.seekWidgetByName(this._rootNode,"ButtonQuit");
        btnQuit.setTouchEnabled(true) ;
        btnQuit.addTouchEventListener(this.btnQuitClicked,this);
    },

    gameDraw:function(){
        var btnContinue = ccui.helper.seekWidgetByName(this._rootNode,"ButtonContinue");
        btnContinue.setTouchEnabled(true) ;
        if (this._allResult.round== this._allResult.roundCount){
            ccui.helper.seekWidgetByName(btnContinue,"Label").setString("退出房间");
            btnContinue.addTouchEventListener(this.btnQuitClicked,this);
        }else{
            btnContinue.addTouchEventListener(this.btnContinueClicked,this);
        }

    },
    //0 单局结算  1 全部结束结算    2 流局
    btnCloseClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return ;
        if (this._allResult.round == this._allResult.roundCount){ //最后一局
            this.send(common.NotifyType.CLOSE_BALANCE_PANEL);
            this.send(common.NotifyType.GO_TO_LOBBY) ;
        }else{
            this.send(common.NotifyType.NEXT_ROUND) ;
            this.send(common.NotifyType.CLOSE_BALANCE_PANEL);
        }
    },

    btnShareClicked:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            this.send(common.NotifyType.CLOSE_BALANCE_PANEL);
        }
    },
    btnQuitClicked:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            this.send(common.NotifyType.CLOSE_BALANCE_PANEL);
            this.send(common.NotifyType.GO_TO_LOBBY) ;
        }
    },

    btnContinueClicked:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            this.send(common.NotifyType.NEXT_ROUND) ;
            this.send(common.NotifyType.CLOSE_BALANCE_PANEL);
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }
});