

main.EmailLayer = game.IView.extend({
    uiHelper:null,
    email_ListView:null,
    _scrollView : null ,
    _item:null,

    ctor:function (obj) {
        this._super();
        var size = cc.winSize;
        this.uiHelper = new game.UIHelper();
        var node = this.uiHelper.doLayout(res.Mail_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);
        var bg = ccui.helper.seekWidgetByName(node, "ImgBackground");
        var btnClose = ccui.helper.seekWidgetByName(bg, "ButtonClose");
        btnClose.setTouchEnabled(true);
        btnClose.msg = common.NotifyType.CLOSE_MESSAGE_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);
        this._scrollView = ccui.helper.seekWidgetByName(bg, "ScrollView");
        this._scrollView.setTouchEnabled(true);
        this._scrollView.setBounceEnabled(true);
        this._scrollView.setInertiaScrollEnabled(true);
        this._item = ccui.helper.seekWidgetByName(node, "ImgBgUnread");
        this.refreshScrollView();

        this.addChild(node);
        return true;
    },

    touchEvent:function (sender, type) {
        if(type == ccui.Widget.TOUCH_ENDED){
            this.send(common.NotifyType.CLOSE_MESSAGE_PANEL);
        }
    },

    selectedItemEvent:function (sender,type) {
        switch (type){
            case ccui.ListView.EVENT_SELECTED_ITEM:
                console.log("-------->index:"+sender.getCurSelectedIndex());
                break;
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    },

    clearScrollView:function(){
        this._scrollView.removeAllChildren() ;
    },

    refreshScrollView:function(){
        var sizeWidth = this._scrollView.getContentSize().width;

        var sizeHeight = this._scrollView.getContentSize().height ;
        console.log(" sizeHeight: " + this._scrollView.getContentSize().height);
        var itemAmount = Math.floor(Math.random()*100);
        var height =  this._item.getContentSize().height + 5 ;
        this._scrollView.setInnerContainerSize(cc.size(sizeWidth,height*itemAmount));
        var newSizeHeight = this._scrollView.getInnerContainer().height ;
        var finalSizeHeight  = (newSizeHeight <  sizeHeight)? sizeHeight : newSizeHeight;


        for (var i=0;i<itemAmount;i++){
            var item = this._item.clone();
            item.setTouchEnabled(true) ;
            item.addTouchEventListener(this.btnItemClicked,this) ;
            item.setPosition(sizeWidth/2,finalSizeHeight - height*i -height/2); //这里用来设置坐标  从上往下
            this._scrollView.addChild(item);

            var imgNewFlag = ccui.helper.seekWidgetByName(item, "ImgNew");
            var labelIsReceived = ccui.helper.seekWidgetByName(item, "LabelIsReceived");
            var labelValidTime =ccui.helper.seekWidgetByName(item, "LabelValidTime");
            var labelMailTime = ccui.helper.seekWidgetByName(item, "LabelMailTime");
            var labelMailTitle =ccui.helper.seekWidgetByName(item, "LabelMailTitle");
            var labelMailType = ccui.helper.seekWidgetByName(item, "LabelMailType");
            var imgIcon = ccui.helper.seekWidgetByName(item, "ImgIcon");
        }
    },

    btnItemClicked:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return ;
        console.log("---------btnItemClicked ");
    },
});