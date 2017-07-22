/**
 * Created by ShiTing on 2017/5/24.
 */
var pomelo = window.pomelo;
var gateRoute = 'gate.gateHandler.queryEntry';
var loginRoute = "connector.loginHandler.checkLogin";
var visitorLoginRoute = "connector.loginHandler.visitorLogin"; // 游客登录
var createRoomRoute = "room.roomHandler.createRoom";
var entryRoomRoute = "room.roomHandler.entryRoom";
var getUserRoomListRoute= "room.roomHandler.getUserRoomList";
var getRoomMessageRoute = "room.roomHandler.getRoomMessage"; //获取房间信息
var userReadyRoute = "room.roomHandler.userReady"; //玩家准备
var handlerChiRoute = "room.roomHandler.handlerChi" ;
var handlerPengRoute = "room.roomHandler.handlerPeng";
var handlerGangRoute = "room.roomHandler.handlerGang" ;
var handlerHuRoute = "room.roomHandler.handlerHu" ;
var cannelActionRoute = "room.roomHandler.cannelAction";
var getGameResultListRoute = "room.roomHandler.getGameResultList";//获取战绩
var getGameRecordListRoute = "room.roomHandler.getGameRecordList";//点击战绩item获取战绩流水
var getGameRecordRoute = "room.roomHandler.getGameRecord";//查看回放记录接口
var getCurrRoomResultRoute = "room.roomHandler.getCurrRoomResult";//查看当局数据
var initiateDissolveRoomRoute = "room.roomHandler.initiateDissolveRoom"; //发起解散
var agreeDissolveRoomRoute= "room.roomHandler.agreeDissolveRoom";//同意解散
var cannelDissolveRoomRoute = "room.roomHandler.cannelDissolveRoom";
var playMahjongRoute = "room.roomHandler.playMahjong"; //出牌
var sendMessageRoute = "room.roomHandler.sendMessage"; //聊天
var getRoomConfigRoute = "room.roomHandler.getRoomConfig";
var realNameVerify = "connector.loginHandler.realNameVerify";//实名认证
var getRecordCode = "room.roomHandler.getRecordCode";//获取回放码
var getGameRecordByCode = "room.roomHandler.getGameRecordByCode";//根据回放码获取战绩
var brightMahjongRoute = "room.roomHandler.brightMahjong";//亮牌
var cannelbrightMahjongRoute = "room.roomHandler.cannelbrightMahjong";//取消亮牌
var leaveRoomRoute = "room.roomHandler.leaveRoom";//离开房间
var getGameOverRoomRoute = "room.roomHandler.getGameOverRoom";//离开房间
var roomOwnerKickUserByUidRoute = "room.roomHandler.roomOwnerKickUserByUid"; //房主踢出其它玩家
var getMailsRoute = "connector.loginHandler.getMails"; //获取邮件
//var httpUrl = "http://47.94.45.41:5100";
var httpUrl = "http://192.168.1.123:5100";
var net = net || {};
net.NetManage={
    _applyDisconnect:false ,
    httpGetRequest:function(code){
        console.log("httpGetRequest code ",code);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open("GET", httpUrl+"/login?code="+code, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var httpStatus = xhr.statusText;
                var response = JSON.parse(xhr.responseText);
                console.log(" httpStatus  ",httpStatus);
                console.log(" response : ",response);
                if (response.code == 500){
                    if (cc.sys.localStorage.getItem("ACCESS_TOKEN")){
                        cc.sys.localStorage.removeItem("ACCESS_TOKEN");
                    }
                    if (cc.sys.localStorage.getItem("OPENID")){
                        cc.sys.localStorage.removeItem("OPENID");
                    }
                    var params={
                        desc:response.msg+",重新登录微信授权，这句话的拜托策划想一想怎么表达好一点",
                        close:true,
                        confirmOnly:function(){ //校验失败  重新去授权
                            game.Notification.send(common.NotifyType.WECHAT_CHECk_FAILED,response);
                        }
                    };
                    game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
                }else{
                    cc.sys.localStorage.setItem("OPENID",response.openid);
                    cc.sys.localStorage.setItem("ACCESS_TOKEN",response.token);
                    game.Notification.send(common.NotifyType.WECHAT_CHECk_SUCCESS,response);
                }
            }else{
                if (cc.sys.localStorage.getItem("ACCESS_TOKEN")){
                    cc.sys.localStorage.removeItem("ACCESS_TOKEN");
                }
                if (cc.sys.localStorage.getItem("OPENID")){
                    cc.sys.localStorage.removeItem("OPENID");
                }
                var params={
                    desc:"网络出错了 readyState: "+xhr.readyState+" status:"+ xhr.status,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        };
        xhr.send();
    },

    //登录
    login:function(params){
        var self = this;
        console.log(" login ................");
        console.log(params);
        pomelo.init({
            host: common.GameConfig.host,
            port: common.GameConfig.gatePort,
            log: true
        }, function() {
            pomelo.request(gateRoute, {}, function(data) {
                console.log(" ---------------- ");
                console.log(data);
                pomelo.disconnect();
                pomelo.init({
                    host:data.host,
                    port: data.port,
                    log: true
                }, function() {
                    self.listener();
                    pomelo.request(loginRoute, params, function(data) {
                        console.log(" connector.loginHandler.checkLogin ");
                        cc.log(JSON.stringify(data));
                        if (data.code == 200){
                            game.LocalData.setUserInfo(data.data) ;
                            if(cc.sys.os==cc.sys.OS_ANDROID){
                                console.log("-------科大讯飞登录-----");
                                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/App","initIMClient","(Ljava/lang/String;)V",data.data.xfToken);
                                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager","audioLogin","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",(data.data._id).toString(),(data.data.nickname).toString(),(data.data.xfToken).toString(),(data.data.headimgurl).toString());
                            } else if (cc.sys.os == cc.sys.OS_IOS) {
                                jsb.reflection.callStaticMethod("IFlyManager", "iflyLoginWithUserId:nickName:userToken:", (data.data._id).toString(),(data.data.nickname).toString(),(data.data.xfToken).toString());
                            }
                            if (data.data.currRoomNo != null){
                                var param = {
                                    roomNo:data.data.currRoomNo
                                };
                                self.entryRoom(param) ;
                            }else{
                                game.Notification.send(common.NotifyType.GO_TO_LOBBY,data);
                            }
                        }else{
							cc.sys.localStorage.removeItem("isFirst");
                            var param={
                                desc:data.msg,
                                close:true
                            };
                            game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,param);
                        }
                    });
                });
            });
        });
    },

    // 游客登录
    visitorLogin:function(params){
        var self = this;
        console.log(" visitorLogin ................");
        console.log(params);
        pomelo.init({
            host: common.GameConfig.host,
            port: common.GameConfig.gatePort,
            log: true
        }, function() {
            pomelo.request(gateRoute, {}, function(data) {
                console.log(" ---------------- ");
                console.log(data);
                pomelo.disconnect();
                pomelo.init({
                    host:data.host,
                    port: data.port,
                    log: true
                }, function() {
                    self.listener();
                    pomelo.request(visitorLoginRoute, params, function(data) {
                        console.log(" connector.loginHandler.visitorLogin ");
                        cc.log(JSON.stringify(data));
                        if (data.code == 200){
                            console.log("visitor login 200");
                            game.LocalData.setUserInfo(data.data) ;
                            if(cc.sys.os==cc.sys.OS_ANDROID){
                                console.log("-------科大讯飞登录-----");
                                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/App","initIMClient","(Ljava/lang/String;)V",data.data.xfToken);
                                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AudioManager","audioLogin","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",(data.data._id).toString(),(data.data.nickname).toString(),(data.data.xfToken).toString(),(data.data.headimgurl).toString());
                            } else if (cc.sys.os == cc.sys.OS_IOS) {
                                jsb.reflection.callStaticMethod("IFlyManager", "iflyLoginWithUserId:nickName:userToken:", (data.data._id).toString(),(data.data.nickname).toString(),(data.data.xfToken).toString());
                            }
                            if (data.data.currRoomNo != null){
                                var param = {
                                    roomNo:data.data.currRoomNo
                                };
                                self.entryRoom(param) ;
                            }else{
                                game.Notification.send(common.NotifyType.GO_TO_LOBBY,data);
                            }
                        }else{
                            console.log("visitor login fail"+ data.msg);
                            cc.sys.localStorage.removeItem("isFirst");
                            var param={
                                desc:data.msg,
                                close:true
                            };
                            game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,param);
                        }
                    });
                });
            });
        });
    },

    //实名认证
    realUserNameVerify:function(params){
        console.log( "realNameVerify ",params);
        pomelo.request(realNameVerify,params, function (data) {
            if (data.code == 200){
                var params={
                    desc:data.msg,
                    close:false,
                    confirmOnly:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
                game.Notification.send(common.NotifyType.REAL_NAME_VERIFY_INFO,data);

            }else{
                console.log( "data.code else ",data.code);
                var params={
                    desc:common.TipsDesc.AuthenticationFailure,
                    close:false,
                    confirmOnly:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        });
    },

    //创建房间
    createRoom:function(params){
        var self = this ;
        console.log(" createRoom .............",params);
        pomelo.request(createRoomRoute,params, function (data) {
            console.log(" user create room ");
            console.log(JSON.stringify(data));
            if (data.code == 200){
                params['roomNo'] = data.data.roomNo;
                if (data.data.roomType == 2){ //代开房间提示代开成功 否则直接进游戏
                    game.Notification.send(common.NotifyType.SHOW_CREATED_SUCCESS_PANEL,params) ;
                }else{
                    self.entryRoom({roomNo:data.data.roomNo}) ;
                }
            }else{
                console.log("----net data---->",data);
                var param={
                    desc:data.msg,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,param);
            }
        });
    },

    //加入房间
    entryRoom:function(params){
        pomelo.request(entryRoomRoute,params, function (data) {
            console.log("  entry room ............ ");
            console.log(JSON.stringify(data));
            if (data.code == 200){
                game.Notification.send(common.NotifyType.GO_TO_PLAY,data.data);
            }else if(data.code==400){//房间不存在
                var params={
                    desc:data.msg,
                    close:false,
                    confirmOnly:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                        game.Notification.send(common.NotifyType.SHOW_JOIN_ROOM_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }else if(data.code==500){//房卡不足
                var params={
                    desc:common.TipsDesc.NotEnoughRoomCard,
                    close:false,
                    confirm:function () {
                        game.Notification.send(common.NotifyType.SHOW_SHOP_PANEL);
                    },
                    cancel:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                        game.Notification.send(common.NotifyType.SHOW_JOIN_ROOM_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        });
    },

    //代开房间
    openRoom:function(params){
        console.log( "open room ",params);
        pomelo.request(createRoomRoute,params, function (data) {
            if (data.code == 200){
                params.roomNo = data.data.roomNo;
                game.Notification.send(common.NotifyType.SHOW_CREATED_SUCCESS_PANEL,params) ;
            }else{
                var param={
                    desc:common.TipsDesc.CreateForAlreadyExceed,
                    close:false,
                    confirmOnly:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,param);
            }
        });
    },

    //加入房间之前 先获取这个房间的信息
    getRoomMessage:function(params){
        console.log( "getRoomMessage ",params);
        pomelo.request(getRoomMessageRoute,params, function (data) {
            console.log(" getRoomMessageRoute ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.SHOW_JOIN_ROOM_CONFIRM_PANEL,data.data);
            }else if(data.code==500){//房间不存在
                var params={
                    desc:data.msg,
                    close:false,
                    confirmOnly:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                        game.Notification.send(common.NotifyType.SHOW_JOIN_ROOM_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        });
    },

    //获取用户开房间列表
    getUserRoomList:function(){
        pomelo.request(getUserRoomListRoute,{},function(data){
            console.log("getUserRoomListRoute ",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.SHOW_CREATED_ROOM_PANEL,data.data);
            }else{

            }
        })
    },

    //查看已开房间
    checkRoom:function(params){
        var route = "";
        pomelo.request(route,params, function (data) {
            console.log(JSON.stringify(data));

        });
    },

    userReady:function (params) {
      pomelo.request(userReadyRoute,params,function(data){
          console.log(" userReady ",data);
          if (data.code == 200){
              game.Notification.send(common.NotifyType.GAME_PLAYER_READY,data.data) ;
              return ;
          }
          game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
      })
    },

    //吃牌
    handlerChi:function(params){
        pomelo.request(handlerChiRoute,params,function(data){
            console.log(" handlerChi ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.HANDLE_CHOW_RESPONSE,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        })
    },

    cannelAction:function(params){
        pomelo.request(cannelActionRoute,params,function(data){
            console.log(" cannelAction ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.HANDLE_PASS_RESPONSE,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        })
    },

    //碰
    handlerPeng:function(params){
        pomelo.request(handlerPengRoute,params,function(data){
            console.log(" handlerPeng ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.HANDLE_PONG_RESPONSE,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        })
    },

    handlerGang:function(params){
        pomelo.request(handlerGangRoute,params,function(data){
            console.log(" handlerGang ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.HANDLE_KONG_RESPONSE,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        })
    },

    handlerHu:function(params){
        pomelo.request(handlerHuRoute,params,function(data){
            console.log(" handlerHu ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.HANDLE_WIN_RESPONSE,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        })
    },

    initiateDissolveRoom:function(params){
        pomelo.request(initiateDissolveRoomRoute,params,function(data){
            console.log(" initiateDissolveRoom ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.DISSOLVE_ROOM,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        });
    },
    agreeDissolveRoom:function(params){
        pomelo.request(agreeDissolveRoomRoute,params,function(data){
            console.log(" agreeDissolveRoom ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.AGREE_DISSOLVE_ROOM,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        });
    },
    cannelDissolveRoom:function(params){
        pomelo.request(cannelDissolveRoomRoute,params,function(data){
            console.log(" cannelDissolveRoom ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.CANCEL_DISSOLVE_ROOM,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        });
    },

    /**
     * 发送消息 文字&语音&表情
     * @param params
     */
    sendMessage:function(params){
        pomelo.request(sendMessageRoute,params,function(data){
            console.log(" sendMessage ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.HANDLE_SEND_MESSAGE,data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        });
    },

    /**
     * 获取房间配置
     * @param params
     */
    getRoomConfigRoute:function(){
        pomelo.request(getRoomConfigRoute,{},function(data){
            console.log(" getRoomConfigRoute ",data);
            console.log(" sendMessage ",data);
            if (data.code == 200){
                game.Notification.send(common.NotifyType.SHOW_CREATE_ROOM_PANEL,data.data);
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data);
            }
        })
    },


    /**
     * 亮牌
     * @param params
     */
    brightMahjong:function(params){
        console.log("brightMahjong-->params",params);
        pomelo.request(brightMahjongRoute,params,function(data) {
            console.log(" brightMahjong ",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.HANDLE_BRIGHT_MAHJONG) ;
            }else{
                var params={
                    desc:data.msg,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },
    /**
     * 亮牌
     * @param params
     */
    cannelbrightMahjong:function(params){
        console.log("cannelbrightMahjong-->params",params);
        pomelo.request(cannelbrightMahjongRoute,params,function(data) {
            console.log(" cannelbrightMahjong ",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.HANDLE_CANCEL_BRIGHT_MAHJONG) ;
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },

    /**
     * 离开房间
     * @param params
     */
    leaveRoom:function(params){
        console.log("leaveRoom-->params",params);
        pomelo.request(leaveRoomRoute,params,function(data) {
            console.log(" leaveRoom ",JSON.stringify(data));
            if(data.code==200){
                //game.Notification.send(common.NotifyType.HANDLE_CANCEL_BRIGHT_MAHJONG) ;
                game.Notification.send(common.NotifyType.GO_TO_LOBBY) ;
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },

    /**
     * 获取已开房间
     * @param params
     */
    getGameOverRoom:function(params){
        console.log("getGameOverRoom-->params",params);
        pomelo.request(getGameOverRoomRoute,params,function(data) {
            console.log(" getGameOverRoom ",JSON.stringify(data));
            if(data.code==200){
                //game.Notification.send(common.NotifyType.HANDLE_CANCEL_BRIGHT_MAHJONG) ;
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },

    /**
     * 踢玩家下线
     * @param params
     */
    roomOwnerKickUserByUid:function(params){
        console.log("roomOwnerKickUserByUid-->params",params);
        pomelo.request(roomOwnerKickUserByUidRoute,params,function(data) {
            console.log(" roomOwnerKickUserByUid ",JSON.stringify(data));
            if(data.code==200){

            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        });
    },

    /**
     * 获取邮件
     */
    getMails:function(){
        console.log("getMailsRoute");
        pomelo.request(getMailsRoute,{},function(data) {
            console.log(" getMails ",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.SHOW_MESSAGE_PANEL,data);
            }else{

                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                if (data.msg!=undefined){
                    params.desc = data.msg ;
                }
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        });
    },

    //注册监听服务器推送的消息
    listener:function(){
        console.log(" listener ...........");
        pomelo.on("onUserEntry",this.onUserEntry);
        pomelo.on("onUserLine",this.onUserLine);
        pomelo.on("onUserOffLine",this.onUserOffLine);
        pomelo.on("onUserLeave",this.onUserLeave);
        pomelo.on("onReady",this.onReady);
        pomelo.on("onGameStart",this.onGameStart);
        pomelo.on("onPlayMahjong",this.onPlayMahjong);
        pomelo.on("onMahjong",this.onMahjong);
        pomelo.on("onChi",this.onChi);
        pomelo.on("onPeng",this.onPeng);
        pomelo.on("onGang",this.onGang);
        pomelo.on("onLaiziGang",this.onLaiziGang);
        pomelo.on("onRoundOver",this.onRoundOver);
        pomelo.on("disconnect",this.onDisconnect);
        pomelo.on("heartbeat timeout",this.onTimeOut);
        pomelo.on("onDissolveHandler",this.onDissolveHandler);
        pomelo.on("onRoomDissolve",this.onRoomDissolve);
        pomelo.on("onCannelDissolve",this.onCannelDissolve);
        pomelo.on("onMessage",this.onMessage);
        pomelo.on("onBrightMahjong",this.onBrightMahjong);
        pomelo.on("onBrightMahjongOver",this.onBrightMahjongOver);
    },

    /**
     * 亮牌广播
     * @param  data
     */
    onBrightMahjong:function (data) {
        console.log(" onBrightMahjong ",data);
        if (data.code == 200){
            game.Notification.send(common.NotifyType.ON_BRIGHT_MAHJONG,data.data) ;
        }
    },

    /**
     * 全部亮牌结束才能出牌
     * @param data
     */
    onBrightMahjongOver:function (data) {
        console.log(" onBrightMahjongOver ",data);
        if (data.code == 200){
            game.Notification.send(common.NotifyType.ON_BRIGHT_MAHJONG_OVER,data) ;
        }
    },

    /**
     * 发送消息的广播
     * @param data
     */
    onMessage:function(data){
        if (data.code ==200){
            game.Notification.send(common.NotifyType.ON_SEND_MESSAGE,data.data) ;
        }else{
            game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data) ;
        }
    },

    /**
     * 发起解散 , 玩家同意解散 玩家取消解散 房间广播
     */
    onDissolveHandler:function(data){
        console.log("===========onDissolveHandler==========",data);
        game.Notification.send(common.NotifyType.ON_DISSOLVE_HANDLE,data.data) ;
    },

    /**
     *  房间解散
     */
    onRoomDissolve:function(data){
        console.log("===========onRoomDissolve==========",data);
        if (data.code == 200){
            game.Notification.send(common.NotifyType.ON_ROOM_DISSOLVE,data) ;
        }else{
            game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data) ;
        }

    },

    /**
     * 房间解散被取消
     */
    onCannelDissolve:function(data){
        console.log("===========onCannelDissolve==========",data);
        game.Notification.send(common.NotifyType.ON_CANCEL_DISSOLVE,data) ;
    },

    /**
     * 超时
     */
    onTimeOut:function(data){
        console.log(" -----onTimeOut------",data);
        game.Notification.send(common.NotifyType.ON_TIME_OUT,data) ;
    },

    /**
     * 掉线
     */
    onDisconnect:function(data){
        console.log(" 掉线了。。。。掉线了。。。。。掉线了。。。。。掉线了。。。。。",data);
        game.Notification.send(common.NotifyType.ON_DISCONNECT,data) ;
    },



    //房间内玩家收到其他玩家进入的消息
    onUserEntry:function(data){
        console.log("onUserEntry",data) ;
        game.Notification.send(common.NotifyType.GAME_PLAYER_ENTER,data.data)
    },

    //房间玩家断线之后，重新能链接
    onUserLine:function(data){
        console.log("onUserLine",data) ;
        game.Notification.send(common.NotifyType.GAME_PLAYER_LINE,data.data) ;
    },

    //玩家掉线的广播
    onUserOffLine:function(data){
        console.log("onUserOffLine",data) ;
        game.Notification.send(common.NotifyType.GAME_PLAYER_OFF_LINE,data.data) ;
    },
    /**
     * 房间中玩家离开
     * @param data
     */
    onUserLeave:function(data){
        console.log("onUserLeave",data) ;
        game.Notification.send(common.NotifyType.GAME_PLAYER_LEAVE,data.data) ;
    },
    //玩家准备广播
    onReady:function(data){
        console.log("onReady",data) ;
        game.Notification.send(common.NotifyType.GAME_PLAYER_ON_READY,data.data) ;
    },

    onGameStart:function(data){
        console.log("onGameStart",data) ;
        game.Notification.send(common.NotifyType.GAME_START,data.data);
    },

    playMahjong:function(params){

        console.log("----------playMahjong-----------",params);
        pomelo.request(playMahjongRoute,params,function(data){
            console.log(" playMahjong ",data);
            if (data.code ==200){
                game.Notification.send(common.NotifyType.HANDLE_PLAY_RESPONSE,data) ;
            }else{
                game.Notification.send(common.NotifyType.SHOW_POPUP_MESSAGE,data) ;
            }
        });
    },

    //出牌广播:
    onPlayMahjong:function(data){
        console.log("onPlayMahjong",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_PLAYER_PLAY_MAH,data.data);
    },

    //抓牌广播:
    onMahjong:function(data){
        console.log("onMahjong",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_PLAYER_NEW_MAH,data.data);
    },

    //吃牌广播
    onChi:function(data){
        console.log("onChi",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_PLAYER_CHOW,data.data);
    },
    //碰牌广播
    onPeng:function(data){
        console.log("onPeng ",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_PLAYER_PONG,data.data);
    },
    //获取战绩
    getGameResultList:function () {
        pomelo.request(getGameResultListRoute,{},function(data) {
            console.log("getGameResultListRoute",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.SHOW_ACHIEVE_PANEL,data.data);
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },
    /**
     * 获取战绩item
     * @param params
     * @param recordList  战绩列表的
     */
    getGameRecordList:function (params,recordList) {
        console.log("getGameRecordList-->params",params);
        pomelo.request(getGameRecordListRoute,params,function(data) {
            console.log(" getGameRecordList ",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL,{detail:data.data,list:recordList});
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },

    /**
     * 查看战绩
     * @param params
     */
    getGameRecord:function(params){
        console.log("getGameRecord-->params",params);
        pomelo.request(getGameRecordRoute,params,function(data) {
            console.log(" getGameRecord ",JSON.stringify(data));
            if(data.code==200){
                //应该是进入牌桌  进行回放的处理
                game.Notification.send(common.NotifyType.GO_TO_PLAY_BACK,data.data.result) ;
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },
    /**
     * 获取回放码
     */
    getRecordCodeNum:function(params){
        console.log("getRecordCodeNum-->params",params);
        pomelo.request(getRecordCode,params,function (data) {
            if(data.code==200){
                var oldNickName=game.LocalData.getUserInfo().nickname;
                var nickName=oldNickName;
                if(oldNickName.length > 7){
                    nickName=oldNickName.substring(0,7)+"... ";
                }
                console.log("---------code-------->",data.data.code);
                var obj={title:"碰碰湖",desc:"玩家"+nickName+"分享了一个回放码："+data.data.code+"，在大厅点击战绩按钮，然后点击查看他人战绩按钮，输入回放码观看。"};
                game.Notification.send(common.NotifyType.SHOW_SHARE_PANEL,obj);
            }else{

            }
        })
    },

    /**
     * 根据回访码获取回放记录
     */
    getGameRecordInfoByCode:function (params) {
        console.log("getGameRecordInfoByCode-->params",params);
        pomelo.request(getGameRecordByCode,params,function (data) {
            if(data.code==200){
                //输入的回放码正确
            }else{
                var params={
                    desc:common.TipsDesc.ErrorPlayBackYard,
                    close:false,
                    confirm:function () {
                        game.Notification.send(common.NotifyType.CLOSE_TIPS_PANEL);
                    }
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },

    /**
     * 牌桌上 查看当前牌局记录
     * @param params
     */
    getCurrRoomResult:function(params){
        console.log("getCurrRoomResult-->params",params);
        pomelo.request(getCurrRoomResultRoute,params,function(data) {
            console.log(" getCurrRoomResult ",JSON.stringify(data));
            if(data.code==200){
                game.Notification.send(common.NotifyType.SHOW_ACHIEVE_DETAIL_PANEL,{detail:data.data,list:{}});
            }else{
                var params={
                    desc:common.TipsDesc.OperationError,
                    close:true
                };
                game.Notification.send(common.NotifyType.SHOW_TIPS_PANEL,params);
            }
        })
    },

    onGang:function(data){
        console.log("onGang ",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_PLAYER_KONG,data.data);
    },

    /**
     * 癞子杠
     * @param data
     */
    onLaiziGang:function(data){
        console.log("onLaiziGang ",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_PLAYER_LAIZI_KONG,data.data);
    },

    /**
     * 牌局结束
     * @param data
     */
    onRoundOver:function(data){
        console.log("onRoundOver ",data) ;
        if (data.code !=200){
            return ; //出错了 进行错误处理
        }
        game.Notification.send(common.NotifyType.ON_ROUND_OVER,data.data);
    },

    //退出登录
    logOut:function(){
        console.log(" ============== ");
        pomelo.disconnect();
    },

};