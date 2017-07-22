/**
 * 游戏配置类
 */
var common = common || {};	//公共类

common.GameConfig = {
		//host:'47.94.45.41',
	host:'192.168.1.123',
		gatePort:5100,
		Debug:true,
		isRuntime:false,
		Log_tag:"MAP",
		TESE_UID:"TUIETUI-23423-adf123qqq"//,	// 本地测试时使用的设备唯一id
        // LoginServer:"http://192.168.24.82:8080/platform"	//开发登陆服务器

};

common.RoomTypeConfig = {roomType_1:"房主支付",roomType_2:"代开房间",roomType_3:"AA支付"};