main.AchieveLayer=game.IView.extend({
    uiHelper:null,
    _item:null,
    _scrollView:null,
    _panelSeeOtherRecord:null,
    _editRecordNum:null,
    noData:null,
    _allAchieve:[],
    _id:null,
    _myUid :null,
    _curObjData:{},
    ctor:function (obj) {
        this._super();
        var size=cc.winSize;
        console.log(" obj .... " ,obj);
        this._curObjData = obj;
        this.uiHelper=new game.UIHelper();
        var node=this.uiHelper.doLayout(res.Achieve_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(size.width/2,size.height/2);
        node.setContentSize(size);

        this.noData=ccui.helper.seekWidgetByName(node,"ImageViewNoData");
        this._panelSeeOtherRecord=ccui.helper.seekWidgetByName(node,"PanelSeeOtherGame");
        this._panelSeeOtherRecord.setVisible(false);
        this._panelSeeOtherRecord.setTouchEnabled(false);

        this._editRecordNum=new cc.EditBox(cc.size(550,70),new cc.Scale9Sprite("res/ui/common/number-bg.png"));
        this._editRecordNum.setPosition(483,402);
        this._editRecordNum.setAnchorPoint(0,0.5);
        this._editRecordNum.setDelegate(this._panelSeeOtherRecord);
        this._editRecordNum.setFontColor(cc.color(128,127,127));
        this._editRecordNum.setFontSize(30);
        this._editRecordNum.setPlaceHolder("请输入他人分享的回放码");
        this._editRecordNum.setPlaceholderFontSize(25);
        this._editRecordNum.setPlaceholderFontColor(cc.color(128,127,127));
        this._editRecordNum.setMaxLength(6);
        this._editRecordNum.setInputFlag(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this._panelSeeOtherRecord.addChild(this._editRecordNum,3);
        this._editRecordNum.setVisible(false);

        var btnSeeRecord=ccui.helper.seekWidgetByName(node,"ButtonSeeOtherGameInfo");
        btnSeeRecord.setTouchEnabled(true);
        btnSeeRecord.addTouchEventListener(this.btnSeeOtherRecord,this);

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_ACHIEVE_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        this._scrollView = ccui.helper.seekWidgetByName(node,"ScrollView");
        this._item = ccui.helper.seekWidgetByName(node,"ImgItem");
        this._scrollView.removeAllChildren() ;
        if (_.isEmpty(obj.result)){
            this.noData.setVisible(true) ;
        }else{
            this._allAchieve =  obj.result ;
            this._myUid = obj.uid ;
            this.refreshScrollView();
        }

        this.addChild(node);
        return true;
    },

    refreshScrollView:function () {
        var sizeWidth=this._scrollView.getContentSize().width;
        var sizeHeight=this._scrollView.getContentSize().height;
        var itemAmount=this._allAchieve.length;
        var height=this._item.getContentSize().height+20;
        this._scrollView.setInnerContainerSize(cc.size(sizeWidth,height*itemAmount));
        var newSizeHeight=this._scrollView.getInnerContainer().height;
        var finalSizeHeight=(newSizeHeight < sizeHeight)? sizeHeight : newSizeHeight;

        for (var i=0;i<itemAmount;i++){
            var item = this._item.clone() ;
            item.setPosition(sizeWidth / 2, finalSizeHeight - height*i  - height/2);
            item.index = i ;
            item._recordId = this._allAchieve[i]._id;
            item.setVisible(true) ;
            item.setTouchEnabled(true);
            item.addTouchEventListener(this.btnItemClicked,this) ;

            var order =ccui.helper.seekWidgetByName(item,"LabelAtlasNo");
            order.setString(i+1) ;

            var txtTime = ccui.helper.seekWidgetByName(item,"LabelTime");
            var labelPlay = ccui.helper.seekWidgetByName(item,"LabelPlay"); //玩法
            var labelScore = ccui.helper.seekWidgetByName(item,"LabelScore"); //积分

            var newDate = new Date(this._allAchieve[i].createTime);

            var time=newDate.toJSON();
            txtTime.setString(time.substr(0,10)+"\n"+" "+time.substr(11,8));

            labelPlay.setString(this._allAchieve[i].huCount+"倍起胡 "+this._allAchieve[i].maxHuCount+"倍");
            var records = this._allAchieve[i][this._myUid];
            if((records.score) < 0){//负
                labelScore.setColor(common.TypeColor.LOSE);
            }else if((records.score) > 0){
                labelScore.setColor(common.TypeColor.WIN);
            }else{
                labelScore.setColor(common.TypeColor.TIE);
            }
            var userScore=((records.score) > 0) ? ("+"+records.score) :(records.score);
            labelScore.setString(userScore);

            this._scrollView.addChild(item);
        }
    },
    btnItemClicked:function(sender,type){
        if (type != ccui.Widget.TOUCH_ENDED) return;
        var params = {
            gameResultId:sender._recordId
        };
        net.NetManage.getGameRecordList(params,this._curObjData);
        this.send(common.NotifyType.CLOSE_ACHIEVE_PANEL) ;
    },

    btnSeeOtherRecord:function (sender,type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            this._panelSeeOtherRecord.setVisible(true);
            this._editRecordNum.setVisible(true);
            this._panelSeeOtherRecord.setTouchEnabled(true);
            var btnOk = ccui.helper.seekWidgetByName(this._panelSeeOtherRecord, "ButtonOk");
            btnOk.setTouchEnabled(true);
            btnOk.addTouchEventListener(this.btnOkRecodeNum, this);
            ccui.helper.seekWidgetByName(this._panelSeeOtherRecord, "ButtonCancal").addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    this._panelSeeOtherRecord.setVisible(false);
                    this._editRecordNum.setVisible(false);
                }
            }, this);
        }
    },

    btnOkRecodeNum:function (sender,type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            if(this._editRecordNum.getString()==""){
                //输入框为空
                var params={
                    desc:common.TipsDesc.InPutCorrectRecordNum,
                    close:false,
                    confirmOnly:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
            var params={
                code:this._editRecordNum.getString()
            };
            net.NetManage.getGameRecordInfoByCode(params);
            this._panelSeeOtherRecord.setVisible(false);
        }

    }

});