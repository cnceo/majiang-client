/**
 * Created by ShiTing on 2017/5/26.
 */

var SELECTED_TYPE = ['List','Rank'];
main.AchieveDetailLayer=game.IView.extend({
    uiHelper:null,
    _scrollView:null,
    _recordItem:null,
    _totalItem:null,
    _btnListDetail:null,
    _btnScoreRank:null,
    _detailList:[],
    _scoreRank:{},
    _recordId:null,
    _isFromRunLayer:false,
    ctor:function (obj) {
        this._super();
        var size=cc.winSize;
        this.uiHelper=new game.UIHelper();
        var node=this.uiHelper.doLayout(res.AchieveDetail_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_ACHIEVE_DETAIL_PANEL ;
        btnClose.callFunc = function(){
            if (!_.isEmpty(recordList)){
                game.Notification.send(common.NotifyType.SHOW_ACHIEVE_PANEL,recordList) ;
            }
        };
        btnClose.setTouchEnabled(true) ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        var noData = ccui.helper.seekWidgetByName(node,"ImgNoData");
        this._scrollView = ccui.helper.seekWidgetByName(node,"ScrollView");
        this._recordItem = ccui.helper.seekWidgetByName(node,"ImgItem");
        this._totalItem = ccui.helper.seekWidgetByName(node,"ImageItemRank");
        var recordList = obj.list ;

        var detail = null ;
        if (_.isEmpty(recordList)){ //如果是从大厅过来的  这个对象不可能为空  所以如果为空，则是从牌桌点击的弹窗
            this._isFromRunLayer = true ;
            detail = obj.detail;
        }else{
            detail = obj.detail.result ;
        }
        var scores = detail.scores;
        if (detail.hasOwnProperty('_id')){
            this._recordId = detail._id ;
        }

        //判断显不显是空
        if(this._isFromRunLayer==true && _.isEmpty(detail)) {
            noData.setVisible(true);
            // imgBg.setVisible(false);
        }else {
            this._detailList = _.clone(scores);
            this._scoreRank = {};
            for (var i = 0; i < scores.length; i++) {
                var keys = _.without(_.keys(scores[i]), "createTime");
                var value = scores[i];
                for (var j = 0; j < keys.length; j++) {
                    var uid = keys[j];
                    if (this._scoreRank.hasOwnProperty(uid)) {
                        var score = this._scoreRank[uid].score + value[uid].score
                        this._scoreRank[uid].score = score;
                        this._scoreRank[uid]['round']++;
                        if (value[uid].score > 0) {
                            this._scoreRank[uid]['win'] += 1;
                        }
                    } else {
                        this._scoreRank[uid] = _.clone(value[uid]);
                        this._scoreRank[uid]['round'] = 1; //总局
                        this._scoreRank[uid]['win'] = 0; //胜局
                        if (value[uid].score > 0) {
                            this._scoreRank[uid]['win'] = 1;
                        }
                    }
                }
            }
        }

        for (var i=0;i<OPEN_TYPE.length;i++){
            var btn = ccui.helper.seekWidgetByName(node,"CheckBox"+SELECTED_TYPE[i]);
            btn.selectedtype=i;
            btn.setTouchEnabled(true);
            btn.addEventListener(this.CheckBoxSelectedClicked,this) ;
            if (i==1){
                btn.setSelected(true);
                btn.setTouchEnabled(false);
                this._curLeftBtn = btn;
            }
        }
        this.refreshTotalScoreScrollView();
        this.addChild(node);
        return true;
    },

    refreshRecordFlowScrollView:function () {
        this._scrollView.removeAllChildren();
        var sizeWidth=this._scrollView.getContentSize().width;
        var sizeHeight=this._scrollView.getContentSize().height;
        var itemAmount=this._detailList.length;
        var height=this._recordItem.getContentSize().height+5;
        this._scrollView.setInnerContainerSize(cc.size(sizeWidth,height*itemAmount));
        var newSizeHeight=this._scrollView.getInnerContainer().height;
        var finalSizeHeight=(newSizeHeight < sizeHeight)? sizeHeight : newSizeHeight;
        var gap = 67 ;
        if (this._isFromRunLayer == true){
            gap = 0 ;
        }
        for (var i=0;i<itemAmount;i++) {
            var item = this._recordItem.clone();
            item.setTouchEnabled(true);
            item.setPosition(sizeWidth / 2-gap, finalSizeHeight - height * i - height / 2);
            this._scrollView.addChild(item);
            var detail = _.omit(this._detailList[i],"createTime") ;
            ccui.helper.seekWidgetByName(item,"LabelAtlasNo").setString((i+1)) ;
            var uIds = _.keys(detail);
            for (var j=0;j<uIds.length;j++){
                var key = "ImgUser"+(j+1);
                var uid = uIds[j] ;
                var imgUser = ccui.helper.seekWidgetByName(item,key);
                ccui.helper.seekWidgetByName(imgUser,"LabelNickname").setString(detail[uid].nickname);
                this.loadHeadPic(imgUser,detail[uid],common.ClipType.Circle);
                var labelScore = ccui.helper.seekWidgetByName(imgUser,"Label");
                this.handleScore(labelScore,detail[uid].score);
            }

            var btnPlayBack = ccui.helper.seekWidgetByName(item,"ButtonPlayBack"); //回放按钮
            btnPlayBack._round = (i+1) ;
            btnPlayBack.addTouchEventListener(this.btnPlayBackClicked,this) ;
            btnPlayBack.setTouchEnabled(true);
            btnPlayBack.setVisible(!this._isFromRunLayer) ;
            var btnShare = ccui.helper.seekWidgetByName(item,"ButtonShare");
            btnShare._round=(i+1);
            btnShare.addTouchEventListener(this.btnShareClicked,this) ;
            btnShare.setTouchEnabled(true);
            btnShare.setVisible(!this._isFromRunLayer) ;
        }
    },

    refreshTotalScoreScrollView:function () {
        this._scrollView.removeAllChildren();
        var sizeWidth=this._scrollView.getContentSize().width;
        var sizeHeight=this._scrollView.getContentSize().height;
        var uIds = _.keys(this._scoreRank);
        var itemAmount=uIds.length;
        var height=this._totalItem.getContentSize().height+5;
        this._scrollView.setInnerContainerSize(cc.size(sizeWidth,height*itemAmount));
        var newSizeHeight=this._scrollView.getInnerContainer().height;
        var finalSizeHeight=(newSizeHeight < sizeHeight)? sizeHeight : newSizeHeight;
        for (var i=0;i<itemAmount;i++) {
            var uid = uIds[i] ;
            var item = this._totalItem.clone();
            item.setTouchEnabled(true);
            item.setPosition(sizeWidth / 2, finalSizeHeight - height * i - height / 2);
            this._scrollView.addChild(item);
            var userInfo = this._scoreRank[uid] ;
            if(userInfo.nickname==game.LocalData.getUserInfo().nickname){
                item.setOpacity(255);
            }else{
                item.setOpacity(100);
            }
            ccui.helper.seekWidgetByName(item,"LabelAtlasNo").setString((i+1)) ;
            ccui.helper.seekWidgetByName(item,"LabelUserName").setString(userInfo.nickname) ;
            ccui.helper.seekWidgetByName(item,"LabelCount").setString(userInfo.round) ;
            ccui.helper.seekWidgetByName(item,"LabelWin").setString(userInfo.win) ;
            var labelScore = ccui.helper.seekWidgetByName(item,"LabelScore") ;
            this.handleScore(labelScore,userInfo.score);
            var head = ccui.helper.seekWidgetByName(item,"ImgHeadPic");
            this.loadHeadPic(head,userInfo,common.ClipType.Circle) ;
        }
    },

    handleScore:function(labelScore,score){
        if (score>0){
            labelScore.setColor(common.TypeColor.WIN) ;
            labelScore.setString("+"+score) ;
        }else if (score <0){
            labelScore.setColor(common.TypeColor.LOSE) ;
            labelScore.setString(score) ;
        }else{
            labelScore.setColor(common.TypeColor.TIE) ;
            labelScore.setString(score) ;
        }
    },

    CheckBoxSelectedClicked:function(sender,type) {
        if(type==ccui.CheckBox.EVENT_SELECTED) {
            if (this._curLeftBtn == sender) return ;
            this.updateCurCheckOpen(sender);
            if(sender.selectedtype==0){
                this.refreshRecordFlowScrollView();
            }else{
                this.refreshTotalScoreScrollView();
            }
        }
    },

    updateCurCheckOpen:function(btn){
        this._curLeftBtn.setTouchEnabled(true) ;
        this._curLeftBtn.setSelected(false);
        btn.setSelected(true) ;
        btn.setTouchEnabled(false) ;
        this._curLeftBtn = btn ;
    },

    btnPlayBackClicked:function(sender,type){
        if (type != ccui.Widget.TOUCH_ENDED) return;
        console.log(" btnPlayBackClicked ");
        var params = {
            recordId:this._recordId,
            round:sender._round
        };
        net.NetManage.getGameRecord(params) ;
        this.send(common.NotifyType.CLOSE_ACHIEVE_DETAIL_PANEL) ;
    },

    btnShareClicked:function (sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        var params={
            recordId:this._recordId,
            round:sender._round
        };
        net.NetManage.getRecordCodeNum(params);
    },

});