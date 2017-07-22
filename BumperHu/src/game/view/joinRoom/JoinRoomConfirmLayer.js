/**
 * Created by ShiTing on 2017/5/25.
 */
var showType = ["CreateMan","Round","PayWay","PlayWay","Other","RoomCard"];
main.JoinRoomConfirmLayer=game.IView.extend({
    uiHelper:null,
    _obj:null,
    ctor:function (obj) {
        this._super();
        this._obj=obj;
        var size=cc.winSize;
        this.uiHelper=new game.UIHelper();
        var root=this.uiHelper.doLayout(res.JoinRoomConfirm_json);
        root.setAnchorPoint(cc.p(0.5,0.5));
        root.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        root.setContentSize(size);

        var node = ccui.helper.seekWidgetByName(root,"ImgBackground");
        var btnConfirm=ccui.helper.seekWidgetByName(node,"ButtonConfirm");
        btnConfirm.setTouchEnabled(true) ;
        btnConfirm.addTouchEventListener(this.btnConfirmClicked,this);

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.setTouchEnabled(true) ;
        btnClose.msg = common.NotifyType.CLOSE_JOIN_ROOM_CONFIRM_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);

        var other="";
        if(obj.gameType==1){
            other="底分为"+obj.underScore+"、"+obj.huCount +"倍起胡、"+obj.maxHuCount+"倍封顶";
        }else{
            other="底分为"+obj.underScore+"、"+obj.huCount +"倍起胡、"+obj.maxHuCount+"倍金顶";
        }

        var playWay="";
        if(obj.gameType==1){
            playWay="红中发财杠258";
        }else{
            if(obj.hhType==1){
                playWay="红中发财晃-红中晃晃";
            }else{
                playWay="红中发财晃-发财晃晃";
            }
        }

        var roomCard="";
        if(obj.roomType == 1 || obj.roomType==2){
            roomCard="0张";
        }else if(obj.roomType == 3){
            if(obj.roundCount==8){
                roomCard="1张";
            }else{
                roomCard="2张";
            }
        }

        var keyRoomType = "roomType_" + obj.roomType;
        var showValue = {
            CreateMan:obj.ownerNickname,
            Round:obj.roundCount +"局",
            PayWay:common.RoomTypeConfig[keyRoomType],
            PlayWay:playWay,
            Other:other,
            RoomCard:roomCard,
        };
        for (var i=0;i<showType.length;i++){
            var imgIcon = ccui.helper.seekWidgetByName(node,"ImgIcon" + showType[i]);
            var labelValue =  ccui.helper.seekWidgetByName(imgIcon,"LabelValue"); //需要修改label的值
            labelValue.setString(showValue[showType[i]]+"") ;
        }
        this.addChild(root);
        return true;
    },
    btnConfirmClicked:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        this.send(common.NotifyType.GO_TO_PLAY,this._obj);
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }
});