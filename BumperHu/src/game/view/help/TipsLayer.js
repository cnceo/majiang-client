main.TipsLayer = game.IView.extend({
    uiHelper:null,
    _isShow:true,
    ctor:function (obj) {
        if (_.isEmpty(obj)){
            console.log("+++++++++TipsLayer++++++++");
            return  ;
        }
        this._super();
        var size = cc.winSize;
        this.uiHelper = new game.UIHelper();
        var node = this.uiHelper.doLayout(res.Tips_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);
        var bg = ccui.helper.seekWidgetByName(node,"ImgBackground") ;
        var btnClose = ccui.helper.seekWidgetByName(bg, "ButtonClose");
        var btnCancel = ccui.helper.seekWidgetByName(bg, "ButtonCancel");
        var btnConfirm = ccui.helper.seekWidgetByName(bg, "ButtonConfirm");
        var btnConfirmOnly = ccui.helper.seekWidgetByName(bg, "ButtonConfirmOnly");
        if (obj.desc){
            var labelDesc =new cc.LabelTTF(obj.desc,"Arial",50,cc.size(760,300),cc.TEXT_ALIGNMENT_CENTER,cc.TEXT_ALIGNMENT_CENTER);
            labelDesc.anchorX = 0.5 ;
            labelDesc.anchorY = 0.5 ;
            labelDesc.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2+60)) ;
            labelDesc.setColor(cc.color(88,50,23));
            bg.addChild(labelDesc);
        }

        if (obj.autoDispear){
            this.scheduleOnce(function(){
                game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
            },1);
        }

        if (obj.close){
            console.log("===================");
            btnClose.setVisible(true);
            btnClose.setTouchEnabled(true) ;
            btnClose.msg = common.NotifyType.CLOSE_TIPS_PANEL ;
            btnClose.addTouchEventListener(this.btnCloseClicked,this);
        }else{
            btnClose.setVisible(false);
        }

        if (obj.cancel!= undefined){
            btnCancel.setVisible(true);
            btnCancel.setTouchEnabled(true) ;
            btnCancel.addTouchEventListener(function(sender,type){
                if (type == ccui.Widget.TOUCH_ENDED){
                    this.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
                    obj.cancel();
                }
            },this) ;
            if (obj.cancelWord!=undefined){
                var btnWord = ccui.helper.seekWidgetByName(btnCancel, "Label");
                btnWord.setString(obj.cancelWord);
            }
        }else{
            btnCancel.setVisible(false) ;
        }

        if (obj.countTime!=undefined){  //计时  到时间之后执行确认按钮的操作
            this.scheduleOnce(function(){
                if (this._isShow == true && obj.confirm!= undefined){
                    this.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
                    obj.confirm();
                }
            },obj.countTime);
        }

        if (obj.confirm!= undefined){
            console.log(" obj.confirm ");
            btnConfirm.setVisible(true);
            btnConfirm.setTouchEnabled(true) ;
            btnConfirm.addTouchEventListener(function(sender,type){
                if (type == ccui.Widget.TOUCH_ENDED){
                    console.log("====================") ;
                    obj.confirm();
                    if (obj.isLoading !=undefined && obj.isLoading == true){
                        this.showLoadingCircle();
                    }else{
                        this.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
                    }
                }
            },this) ;
            if (obj.confirmWord != undefined){
                var btnWord = ccui.helper.seekWidgetByName(btnConfirm, "Label");
                btnWord.setString(obj.confirmWord);
            }
        }else {
            btnConfirm.setVisible(false);
            console.log("! obj.confirm ");
        }

        if (obj.confirmOnly!= undefined){
            console.log(" obj.confirmOnly ");
            btnConfirmOnly.setVisible(true);
            btnConfirmOnly.setTouchEnabled(true) ;
            btnConfirmOnly.addTouchEventListener(function(sender,type){
                if (type == ccui.Widget.TOUCH_ENDED){
                    this.send(common.NotifyType.CLOSE_TIPS_PANEL) ;
                    obj.confirmOnly();
                }
            },this) ;
            if (obj.confirmWord != undefined){
                var btnWord = ccui.helper.seekWidgetByName(btnConfirmOnly, "Label");
                btnWord.setString(obj.confirmWord);
            }
        }else{
            btnConfirmOnly.setVisible(false);
            console.log("! obj.confirmOnly ");
        }

        this.addChild(node);
        return true;
    },


    onExit:function () {
        this._isShow = false ;
        this.uiHelper.clearRes();
        this._super();
    }
});

