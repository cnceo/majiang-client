/********************************************************************************
  The game.IView
  @author kassia
  @date 2017-04-21
  
  IView is the view of MVC, create your layer view to extend this class. 
 ********************************************************************************/
game.IView = cc.Layer.extend({
   	_loadingCircle:null,
   	ctor:function () {
   		this._super();
   		return true;
   	},
   	//Use this function to send notification.
   	send:function (key, obj)
   	{
   		game.Notification.send(key, obj);
   	},

    /**
     * 裁剪头像
     * @param headBase
     * @param data
     * @param isClip  不传or 0  不裁剪　　　1:圆形  2圆角矩形
     */
	loadHeadPic:function(headBase,data,isClip){
	    var url = "";
	    if (_.isObject(data)){
            if (data.hasOwnProperty("headimgurl")){
                url = data.headimgurl ;
            }else {
                var mod = (data.id % 4) + 1;
                url = common.DefaultHeadPic + mod + ".jpg";
            }
        }else {
            url = data ;
        }
        cc.loader.loadImg(url,{isCrossOrigin:true},function(err,img){
            var width = headBase.width ;
            var height = headBase.height ;
            console.log("loadHeadPic img",img);
        	var sprite = cc.Sprite.create(img);
            sprite.anchorX = 0.5 ;
            sprite.anchorY = 0.5 ;
            var spriteSize = sprite.getContentSize() ;
            sprite.scaleX = (headBase.width / spriteSize.width );
            sprite.scaleY = (headBase.height / spriteSize.height );
            if (isClip == undefined || isClip == 0){
                sprite.x = width/2;
                sprite.y = height/2;
                headBase.addChild(sprite) ;
            }else if (isClip == 1){
                sprite.x=0;
                sprite.y=0;
                var draw = new cc.DrawNode();
                draw.drawCircle(cc.p(0,0), width*0.22, 0,width, false,width*0.46) ;
                var clipper = new cc.ClippingNode();
                clipper.width = headBase.width;
                clipper.height = headBase.height;
                clipper.x = width/2 ;
                clipper.y = height/2 ;
                clipper.anchorX =0 ;
                clipper.anchorY =0 ;
                headBase.addChild(clipper) ;
                clipper.stencil = draw ;
                clipper.addChild(sprite) ;
            }else if (isClip == 2){
                var offsetX = 0;
                var offsetY = 0;
                var clipWidth = 162;
                var clipHeight =162;
                var radius =25;
                var stencil = new cc.DrawNode();
                stencil.drawRect(cc.p((width-clipWidth)/2+offsetX,(height-clipHeight)/2+offsetY+radius),cc.p(width/2+clipWidth/2+offsetX,height/2+clipHeight/2+offsetY-radius),cc.color(0,0,0),1,cc.color(0,0,0));
                stencil.drawRect(cc.p((width-clipWidth)/2+offsetX+radius,(height-clipHeight)/2+offsetY),cc.p(width/2+clipWidth/2+offsetX-radius,height/2+clipHeight/2+offsetY),cc.color(0,0,0),1,cc.color(0,0,0));
                stencil.drawCircle(cc.p(width/2-clipWidth/2+offsetX+radius,height/2-clipHeight/2+offsetY+radius),radius/3,0,100,false,radius,cc.color(0,0,0));
                stencil.drawCircle(cc.p(width/2+clipWidth/2+offsetX-radius,height/2-clipHeight/2+offsetY+radius),radius/3,0,100,false,radius,cc.color(0,0,0));
                stencil.drawCircle(cc.p(width/2+clipWidth/2+offsetX-radius,height/2+clipHeight/2+offsetY-radius),radius/3,0,100,false,radius,cc.color(0,0,0));
                stencil.drawCircle(cc.p(width/2-clipWidth/2+offsetX+radius,height/2+clipHeight/2+offsetY-radius),radius/3,0,100,false,radius,cc.color(0,0,0));

                var clippingPanel = new cc.ClippingNode();
                clippingPanel.anchorX = 0.5 ;
                clippingPanel.anchorY = 0.5;
                sprite.anchorX = 0 ;
                sprite.anchorY=0;
                sprite.y = 5 ;
                sprite.x = 0;
                clippingPanel.stencil = stencil;
                clippingPanel.addChild(sprite) ;
                headBase.addChild(clippingPanel) ;
            }
        });
	},

    btnCloseClicked:function(sender,type){
        if (type != ccui.Widget.TOUCH_ENDED) return;
        common.soundManage.closeBtnClick();
        if (sender.msg){
            this.send(sender.msg) ;
        }
        if (sender.callFunc){
            sender.callFunc();
        }
    },

    /**
     * 处理值发送消息的按钮
     * @param sender
     * @param type
     */
    btnNormalClicked:function(sender,type){
        if (type != ccui.Widget.TOUCH_ENDED) return;
        common.soundManage.norBtnClick();
        if(sender.callFunc){
            sender.callFunc();
        }
        if (sender.msg){
            this.send(sender.msg) ;
        }
    },

    /**
     * 显示loading 动画
     */
    showLoadingCircle:function(){
        if (this._loadingCircle !=null){
            this.closeLoadingCircle() ;
        }
        this._loadingCircle = new cc.Sprite(res.img_loadingcircle_png);
        this._loadingCircle.anchorX = 0.5 ;
        this._loadingCircle.anchorY = 0.5 ;
        var size = cc.winSize ;
        this._loadingCircle.setPosition(cc.p(size.width/2,size.height/2)) ;
        this.addChild(this._loadingCircle) ;
        this._loadingCircle.setRotation(0) ;
        this._loadingCircle.runAction(
            cc.repeatForever(
                cc.rotateBy(2,360)
            )
        );
    },

    closeLoadingCircle:function(){
        if (this._loadingCircle!=null){
            this._loadingCircle.stopAllActions() ;
            this._loadingCircle.removeFromParent() ;
            this._loadingCircle = null ;
        }
    },
});