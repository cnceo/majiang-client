common.NotifyType = {
    TEST_NOTIFY_TYPE : "TEST_NOTIFY_TYPE",
    GO_TO_PLAY:"GO_TO_PLAY",
    GO_TO_LOBBY:"GO_TO_LOBBY",

    SHOW_LOGIN_FAILED:"SHOW_LOGIN_FAILED",
    CLOSE_LOGIN_FAILED:"CLOSE_LOGIN_FAILED",

    SHOW_SETTING_PANEL:"SHOW_SETTING_PANEL",
    CLOSE_SETTING_PANEL:"CLOSE_SETTING_PANEL",

    SHOW_JOIN_ROOM_PANEL:"SHOW_JOIN_ROOM_PANEL",
    CLOSE_JOIN_ROOM_PANEL:"CLOSE_JOIN_ROOM_PANEL",
    SHOW_JOIN_ROOM_CONFIRM_PANEL:"SHOW_JOIN_ROOM_CONFIRM_PANEL",
    CLOSE_JOIN_ROOM_CONFIRM_PANEL:"CLOSE_JOIN_ROOM_CONFIRM_PANEL",

    SHOW_CREATE_ROOM_PANEL:"SHOW_CREATE_ROOM_PANEL",
    CLOSE_CREATE_ROOM_PANEL:"CLOSE_CREATE_ROOM_PANEL",
    SHOW_CREATED_ROOM_PANEL:"SHOW_CREATED_ROOM_PANEL",
    CLOSE_CREATED_ROOM_PANEL:"CLOSE_CREATED_ROOM_PANEL",
    SHOW_CREATED_SUCCESS_PANEL:"SHOW_CREATED_SUCCESS_PANEL",
    CLOSE_CREATED_SUCCESS_PANEL:"CLOSE_CREATED_SUCCESS_PANEL",

    SHOW_HELP_PANEL:"SHOW_HELP_PANEL",
    CLOSE_HELP_PANEL:"CLOSE_HELP_PANEL",
    SHOW_TIPS_PANEL:"SHOW_TIPS_PANEL",
    CLOSE_TIPS_PANEL:"CLOSE_TIPS_PANEL",

    SHOW_MESSAGE_PANEL:"SHOW_MESSAGE_PANEL",
    CLOSE_MESSAGE_PANEL:"CLOSE_MESSAGE_PANEL",

    SHOW_SHOP_PANEL:"SHOW_SHOP_PANEL",
    CLOSE_SHOP_PANEL:"CLOSE_SHOP_PANEL",

    SHOW_ACHIEVE_PANEL:"SHOW_ACHIEVE_PANEL",
    CLOSE_ACHIEVE_PANEL:"CLOSE_ACHIEVE_PANEL",

    SHOW_ACHIEVE_DETAIL_PANEL:"SHOW_ACHIEVE_DETAIL_PANEL",
    CLOSE_ACHIEVE_DETAIL_PANEL:"CLOSE_ACHIEVE_DETAIL_PANEL",

    SHOW_SHARE_PANEL:"SHOW_SHARE_PANEL",
    CLOSE_SHARE_PANEL:"CLOSE_SHARE_PANEL",

    SHOW_IDENTIFY_PANEL:"SHOW_IDENTIFY_PANEL",
    CLOSE_IDENTIFY_PANEL:"CLOSE_IDENTIFY_PANEL",


    SHOW_BALANCE_PANEL:"SHOW_BALANCE_PANEL",    //结算界面（战绩排行）
    CLOSE_BALANCE_PANEL:"CLOSE_BALANCE_PANEL",

    GAME_START:"GAME_START", //游戏开始
    GAME_PLAYER_ENTER:"GAME_PLAYER_ENTER",//有玩家进入牌桌
    GAME_PLAYER_EXIT:"GAME_PLAYER_EXIT",//有玩家退出牌桌
    GAME_PLAYER_READY:"GAME_PLAYER_READY",//玩家点了准备
    GAME_PLAYER_ON_READY:"GAME_PLAYER_ON_READY", //推送玩家准备
    GAME_PLAYER_LINE:"GAME_PLAYER_LINE",
    GAME_PLAYER_OFF_LINE:"GAME_PLAYER_OFF_LINE",
    GAME_PLAYER_LEAVE:"GAME_PLAYER_LEAVE",
    NEXT_ROUND:"NEXT_ROUND",

    SHOW_POPUP_MESSAGE:"SHOW_POPUP_MESSAGE",//显示弹框信息
    HANDLE_PLAY_RESPONSE : "HANDLE_PLAY_RESPONSE", //出牌响应
    HANDLE_CHOW_RESPONSE : "HANDLE_CHOW_RESPONSE", //吃牌响应
    HANDLE_PONG_RESPONSE : "HANDLE_PONG_RESPONSE", //碰牌响应
    HANDLE_KONG_RESPONSE : "HANDLE_KONG_RESPONSE", //杠牌响应
    HANDLE_WIN_RESPONSE : "HANDLE_WIN_RESPONSE", //胡牌响应
    HANDLE_PASS_RESPONSE : "HANDLE_PASS_RESPONSE", //过牌响应

    ON_PLAYER_PLAY_MAH:"ON_PLAYER_PLAY_MAH",//玩家出牌广播
    ON_PLAYER_NEW_MAH:"ON_PLAYER_NEW_MAH",//抓拍
    ON_PLAYER_PONG:"ON_PLAYER_PONG", //广播碰
    ON_PLAYER_KONG:"ON_PLAYER_KONG",    //广播杠
    ON_PLAYER_LAIZI_KONG:"ON_PLAYER_LAIZI_KONG",    //癞子杠
    ON_PLAYER_CHOW:"ON_PLAYER_CHOW",    //广播吃
    ON_ROUND_OVER:"ON_ROUND_OVER",  //广播牌局结束

    DISSOLVE_ROOM:"DISSOLVE_ROOM",
    AGREE_DISSOLVE_ROOM:"AGREE_DISSOLVE_ROOM",
    CANCEL_DISSOLVE_ROOM:"CANCEL_DISSOLVE_ROOM",
    ON_DISSOLVE_HANDLE:"ON_DISSOLVE_HANDLE",
    ON_ROOM_DISSOLVE:"ON_ROOM_DISSOLVE",
    ON_CANCEL_DISSOLVE:"ON_CANCEL_DISSOLVE",

    ON_DISCONNECT:"ON_DISCONNECT",  //掉线
    ON_TIME_OUT:"ON_TIME_OUT",  //超时

    HANDLE_SEND_MESSAGE:"HANDLE_SEND_MESSAGE",  //发送消息
    ON_SEND_MESSAGE:"ON_SEND_MESSAGE",  //接收发送消息的广播

    WECHAT_LOGIN_RESPONSE:"WECHAT_LOGIN_RESPONSE",  //微信授权登录响应
    WECHAT_CHECk_SUCCESS:"WECHAT_CHECk_SUCCESS",//微信校验成功 回来登录
    WECHAT_CHECk_FAILED:"WECHAT_CHECk_FAILED",

    HANDLE_TING_CALLBACK:"HANDLE_TING_CALLBACK",
    REAL_NAME_VERIFY_INFO:"REAL_NAME_VERIFY_INFO",

    HANDLE_BRIGHT_MAHJONG:"HANDLE_BRIGHT_MAHJONG",
    HANDLE_CANCEL_BRIGHT_MAHJONG:"HANDLE_CANCEL_BRIGHT_MAHJONG",
    ON_BRIGHT_MAHJONG:"ON_BRIGHT_MAHJONG",
    ON_BRIGHT_MAHJONG_OVER:"ON_BRIGHT_MAHJONG_OVER",

    WECHAT_GET_CODE_SUCCESS:"WECHAT_GET_CODE_SUCCESS", // iOS微信登录获取CODE成功
    IOS_GET_LOCATION_SUCCESS:"IOS_GET_LOCATION_SUCCESS", // iOS获取经纬度成功
    IOS_GET_ADDRESS_SUCCESS:"IOS_GET_ADDRESS_SUCCESS", // iOS根据经纬度获取地址成功
    IOS_SHOULD_PAUSE_BGMUSIC:"IOS_SHOULD_PAUSE_BGMUSIC", // iOS录音或者播放时应该停止或继续播放背景音乐的通知

    GO_TO_PLAY_BACK:"GO_TO_PLAY_BACK", // 回放
};
/**
 * 播放文字提示
 *  type 0:准备中 1:对局开始  2 癞子确定 (渐现&放大=》停留=》缩小&消失) 3 对局结束  4流局  5自摸 6 杠上开花
 */
common.ShowWordType = {
    TYPE_PREPARING:0,
    TYPE_GAME_START:1,
    TYPE_LAI_ZI_CONFIRM:2,
    TYPE_GAME_END:3,
    TYPE_GAME_DRAW:4,
    TYPE_GAME_SELF_WIN:5,
    TYPE_WIN_AFTER_KONG:6
};
/**
 * 用户游戏中的状态  0：正常 未准备   1 ：准备中  2：游戏中  3：托管中-->离线
 * @type {{}}
 */
common.PlayerStatus = {
    STATUS_UN_PREPARE:0,
    STATUS_PREPARING:1,
    STATUS_IN_GAME:2,
    STATUS_UN_LINE:3
};

/**
 * 出现的中文提示
 */
common.ShowTipsMsg = {
    SELECT_CHOW_GROUP:"请选择吃的组合"
};

/**
 * 1 开口 2,发财杠 3,红中杠 4 癞子杠 5 暗杠 6 明杠 7 放冲 8 自摸 9,庄家
 * 10 硬胡 11,清一色 12,风一色 13,碰碰胡 14,将一色 15,杠上开花 16,抢杠 17,全球人 18 海底捞
 * 19 7对，20 豪华7对  21 双豪七    22 三豪七    23 门清    24 吃癞子   25三铺倒  26 亮牌
 */
common.FunRecordText = {
    1 : "开口",
    2 : "发财杠",
    3 : "红中杠",
    4 : "癞子杠",
    5 : "暗杠",
    6 : "明杠",
    7 : "放冲",
    8 : "自摸",
    9 : "庄家",
    10: "硬胡",
    11: "清一色",
    12: "风一色",
    13: "碰碰胡",
    14: "将一色",
    15: "杠上开花",
    16: "抢杠",
    17: "全球人",
    18: "海底捞",
    19: "7对",
    20: "豪华7对",
    21: "双豪七",
    22: "三豪七",
    23: "门清",
    24: "吃癞子",
    25: "三铺倒",
    26: "亮牌"
} ;

common.WinUserFunNum = "赢家底倍";
common.DealCardsTime = 0.2 ;
common.TypeKaiKou = 1 ;
/**
 * 结算界面会显示的文字
 */
common.BalanceWord = {
    WinnerFan:"赢家底倍",
    Total:"总计"
};

/**
 * 玩家结算时的标识
 * */
common.PlayerRoleFlag = {
    BANKER:'res/ui/table/img_banker.png',
    CHENG_BAO:'res/ui/table/img_chengbao.png',
    JIN_DING:"res/ui/table/img_goldding.png",
    FENG_DING:'res/ui/table/img_fengding.png',
    GUANG_MING_DING:'res/ui/table/img_guangmin.png',
    HA_BA_DING:'res/ui/table/img_dogeding.png'
};

common.MaxFan= {
    FENG_DING:300,
    JIN_DING:500,
    GUANG_MING_DING:700,
    HA_BA_DING:900
};
/**
 * 赢  输  平局 的颜色值
 */
common.TypeColor ={
    WIN:cc.color(255,60,0),
    LOSE:cc.color(38,143,36),
    TIE:cc.color(255,60,0)
};

/**
 * 玩家操作类型
 * @type {{}}
 */
common.OperationType = {
    PASS:0,
    CHOW:1,
    PONG:2,
    KONG:3,
    KOGN_WIN:4
};

/**
 * 打牌番数
 * @type {{}}
 */
common.Points ={
    KaiKou:2,           // 开口	2番
    Banker:2,           // 庄家	2番
    Shooting:2,         // 点炮（放冲）	2番
    SelfDraw:2,         // 自摸	2番
    WinnerOpen:2,       // 赢家开口	2番
    LoserOpen:2,        // 输家开口	2番
    HardWin:2,          // 硬胡	2番
    KongRedDragon:2,    // 杠红中	2番
    KongGreenDragon:2,  // 杠发财	2番
    ExposedKong:2,      // 明杠	2番
    ConcealedKong:4,    // 暗杠	4番
    KongLaiZi:4,        // 杠癞子	4番
    SingleSuit:10,      // 清一色 10番
    SingleWind:10,      // 风一色 10番
    SinglePong:10,      // 碰碰胡 10番
    SingleEyes:10,      // 将一色 10番
    Blossom:10,         // 杠上开花 10番
    RobbingGong:10,     // 抢杠 10番
    FullClaimant:10,    // 全求人 10番
    SeaFishing:10       // 海捞 10番
};

common.ScoreStatus={
    UP:'res/ui/table/win_counts_icon.png',
    DOWN:'res/ui/table/lose_counts_icon.png',
    ZERO:'res/ui/table/lose_counts_icon.png'
};

common.ImgConcealedKong = [
    "res/ui/mahjong/bei_l_left1.png",
    "res/ui/mahjong/bei_d_left1.png",
    "res/ui/mahjong/bei_r_left1.png",
    "res/ui/mahjong/bei_d_out1.png",
];
common.ImgCurOutMahjongFlag = "res/ui/table/img_lasttile.png";
common.ImgKongFlag = "res/ui/table/flag_gangtile.png";
common.MessageType = {
    Text:1,
    Emoji:2,
    Voice:3
};

common.MessageContext = [
    "你得牌打得太好了",
    "想什么呢，快出牌啊",
    "和你合作真是太愉快了",
    "卡张都不吃，真是笨",
    "可惜了我手上这把好牌",
    "你可真是个炮王啊",
    "上家，打给我开个口啊",
    "我要离开一会儿"
];

common.TipsDesc = {
    OperationError:"操作错误",
    WeChatNotInstalled:"您还没有安装微信，请安装微信后重试",
    ChooseAgreement:"请勾选用户使用协议",
    UnSupport:"暂不支持该平台登录",
    GameMaintenance:"游戏正在维护中，请稍后重试",
    GameUpdate:"游戏需要更新，现在前往下载吗？",
    WeChatAuthorizationExpires:"授权已过期，请登录重试",
    NoNetwork:"“连接服务器中...”",
    LinkNetTimeOut:"“登录服务器超时，请您确认网络后重试”",
    LoggingIn:"登录中...",
    WithoutAuthorization:"获取授权失败，请重新登录",

    NotEnoughRoomCard:"房卡数量不足，是否购买？",
    RoomClosed:"该房间已关闭，再找找其他房间吧",
    RoomFillUpPeople:"房间人数已满，再找找其他房间吧",
    MaxNumberCreateRoom:"已达到最大代开数量",
    IssueRoomStartedGame:"您代开的房间 %s 已开始游戏",
    DissolutionRoom:"确定解散房间吗？",
    DissolvedRoom:"已解散房间 %s ",
    RoomLoseEfficacy:"房间 %s 已失效",
    IssueRoomLoseEfficacy:"您代开的房间 %s 已失效",
    PlayerLeaveRoom:"玩家 %s 离开了",

    NotRemoveEmail:"附件未提取，无法删除",
    ErrorPlayBackYard:"输入的回放码不正确，请重新输入",
    OnlyOwner:"您不是房主，无权进行该项操作",
    OwnerBackToLobbyBeforeGameStart:"返回大厅您的房间仍会保留哦",
    PlayerBackToLobby:"对局即将开始，确认要退出房间返回大厅吗",
    OwnerDissolveRoom:"您未开始一局游戏，解散房间不扣除房卡，是否解散",
    AlreadyDissolved:"房主已解散房间",
    ApplyDissolveRoom:"确定申请解散房间吗",
    SameIPTips:"玩家 %s IP相同",
    PlayerApplyDissoveRoomTips:"玩家 %s 申请解散房间，请问是否同意？超过3分钟未做选择，则默认同意",
    AgreeDissolveRoom:"经玩家同意，房间解散成功",
    RefuseDissolveRoom:"玩家拒绝解散房间，游戏继续",
    KickPlayerOut:"确定请该玩家离开吗",
    BeKickedOut:"您已被请离房间",
    VoiceShut:"语音功能已关闭，请在设置中打开",
    VoiceAuthority:"发送语音信息需要访问您的麦克风，请在手机系统设置中打开",
    CannotWinYet:"您还没有听牌",

    AuthenticationFailure:"姓名或身份证填为空",
    InPutCorrectRecordNum:"请输入回放码！",
    AreYouSureLoginOut:"您确定要退出登录吗？",
    CreateForAlreadyExceed:"已达到最大代开数量",
};

common.NeedRoomCard={
    OwnerEight:4,
    OwnerSixteen:8,
    AAEight:1,
    AASixteen:2
};

common.BtnWords = {
    agree:"同意",
    refuse:"拒绝"
};

common.WifiImage = {
    wifi_bad:"res/ui/table/wifi_bad.png",
    wifi_ok:"res/ui/table/wifi_ok.png",
    wifi_fine:"res/ui/table/wifi_fine.png"
};

common.EmojiImg = [
    "res/ui/emoji/img_100.png",
    "res/ui/emoji/img_blush.png",
    "res/ui/emoji/img_clap.png",
    "res/ui/emoji/img_coldsweat.png",
    "res/ui/emoji/img_flushed.png",
    "res/ui/emoji/img_grimacing.png",
    "res/ui/emoji/img_hearteyes.png",
    "res/ui/emoji/img_joy.png",
    "res/ui/emoji/img_kissing_heart.png",
    "res/ui/emoji/img_mahjong.png",
    "res/ui/emoji/img_okhand.png",
    "res/ui/emoji/img_pray.png",
    "res/ui/emoji/img_rage.png",
    "res/ui/emoji/img_smile.png",
    "res/ui/emoji/img_sob.png",
    "res/ui/emoji/img_sunglasses.png",
    "res/ui/emoji/img_sweatsmile.png",
    "res/ui/emoji/img_weary.png"
];

common.FlagCard = {
    kongLight:"res/ui/table/flag_gangtile.png",
    laizi:"res/ui/table/flag_laiziontile.png"
};
common.ImgWordDirection = [
    "res/ui/word/word_east.png",
    "res/ui/word/word_south.png",
    "res/ui/word/word_west.png",
    "res/ui/word/word_north.png"
] ;

common.DefaultHeadPic = "res/ui/icom/head_";
common.PayWay = {
    1:"房主支付",
    2:"代开房间",
    3:"AA支付"
};

common.PlayType = {
    Normal258:1,    //红中发财杠258
    HongHuang:2     //红中发财晃
};
common.GameInfoByPlayType = {
    1:{
        img:"res/ui/word/word_way2play1.png",
        topName:"封顶",
        title:"红中发财杠 258",
        KongValue:[41,42]
    },
    2:{
        img:"res/ui/word/word_way2play2.png",
        topName:"金顶",
        tips:"金顶500倍，阳光顶700倍，哈巴顶900倍",
        title:"红中发财晃",
        subTitle:{
            1:"红中晃晃",
            2:"发财晃晃"
        },
        KongValue:{
            1:[42],
            2:[41,42]
        },
    }
};

common.ClipType ={
    Circle:1,
    Rectangle:2
};
common.TableDirection = ["West","South","East","North"];
common.PlayBackOpeType = {
    OnMahjong:      1,    //发牌
    OnPlayMahjong:  2,    //出牌
    OnNewMahjong:   3,    //抓牌
    OnPong:         4,    //碰
    OnKong:         5,    //杠
    OnWin:          6,    //胡
    OnPass:         7,    //过
    OnFlow:         8,    //流局
    OnChow:         9,    //吃
};

common.Agreement = "象扑网络科技许可使用协议\n\n"
    +"请务必认真阅读和理解本《用户使用协议》（以下简称《协议》）中规定的所有权利和限制。除非您（以下称为“用户”）接受本《协议》条款，否则您无权下载、安装或使用随附本《协议》的软件（即《象扑科技软件》，以下简称“软件”）及其相关服务。您一旦安装、复制、下载、访问或以其它方式使用本软件，将视为对本《协议》的接受，即表示您同意接受本《协议》各项条款的约束。如果您不同意本《协议》中的条款，请不要安装、复制或使用本软件 。\n\n"
    +"本《协议》是用户与象扑网络科技有限公司（下称“象扑科技”）之间关于用户下载、安装、使用、复制本软件的法律协议。\n\n"
    +"1. 权利声明\n\n"
    +"本软件的一切知识产权，以及与软件相关的所有信息内容，包括但不限于：文字表述、图标、图饰、图像、图表、色彩、界面设计、版面框架、有关数据、附加程序、印刷材料和电子文档等，以及前述各类元素的组合，均为象扑科技所有，受著作权法和国际著作权条约以及其他知识产权法律法规的保护。\n\n"
    +"2. 许可范围\n\n"
    +"2.1 下载、安装和使用：本软件为免费软件，用户可以非商业性、无限制数量地下载、安装及使用本软件。\n\n"
    +"2.2 复制、分发和传播：用户可以非商业性、无限制数量地复制、分发和传播本软件产品。但必须保证每一份复制、分发和传播都是完整和真实的, 包括所有有关本软件产品的软件、电子文档, 版权和商标，亦包括本协议。\n\n"
    +"3. 权利限制\n\n"
    +"3.1 禁止反向工程、反向编译和反向汇编：用户不得对本软件产品进行反向工程（Reverse Engineer）、反向编译（Decompile）或反向汇编（Disassemble），同时不得改动编译在程序文件内部的任何资源。除法律、法规明文规定允许上述活动外，用户必须遵守此协议限制。\n\n"
    +"3.2 组件分割:本软件产品是作为一个单一产品而被授予许可使用, 用户不得将各个部分分开用于任何目的。\n\n"
    +"3.3 个别授权: 如需进行商业性的销售、复制、分发，包括但不限于软件销售、预装、捆绑等，必须获得象扑科技的书面授权和许可。\n\n"
    +"3.4 保留权利：本协议未明示授权的其他一切权利仍归象扑科技所有，用户使用其他权利时必须获得象扑科技的书面同意。\n\n"
    +"4. 用户使用须知\n\n"
    +"4.1 本软件仅适用于IOS/Android操作系统。如果用户在安装本软件后因任何原因欲放弃使用，可从移动设备删除本软件。\n\n"
    +"4.2 本软件由象扑科技提供产品支持。\n\n"
    +"4.3 软件的修改和升级：象扑科技保留为用户提供本软件的修改、升级版本的权利。\n\n"
    +"4.4 本软件不含有任\n\n"
    +"何旨在破坏用户计算机数据和获取用户隐私信息的恶意代码，不含有任何跟踪、监视用户计算机的功能代码，不会监控用户网上、网下的行为，不会收集用户使用其它软件、文档等个人信息，不会泄漏用户隐私。\n\n"
    +"4.5 用户应在遵守法律及本协议的前提下使用本软件。用户无权实施包括但不限于下列行为：\n\n"
    +"4.6.1 删除或者改变本软件上的所有权利管理电子信息；\n\n"
    +"4.6.2 故意避开或者破坏著作权人为保护本软件著作权而采取的技术措施；\n\n"
    +"4.6.3 利用本软件误导、欺骗他人；\n\n"
    +"4.6.4 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行；\n\n"
    +"4.6.5 未经允许，进入计算机信息网络或者使用计算机信息网络资源；\n\n"
    +"4.6.6 未经允许，对计算机信息网络功能进行删除、修改或者增加的；\n\n"
    +"4.6.7 未经允许，对计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；\n\n"
    +"4.6.8 破坏本软件系统或网站的正常运行，故意传播计算机病毒等破坏性程序；\n\n"
    +"4.6.9 其他任何危害计算机信息网络安全的。\n\n"
    +"4.7 对于从非象扑科技指定站点下载的本软件产品以及从非象扑科技发行的介质上获得的本软件产品，象扑科技无法保证该软件是否感染计算机病毒、是否隐藏有伪装的特洛伊木马程序或者黑客软件，使用此类软件，将可能导致不可预测的风险，建议用户不要轻易下载、安装、使用，象扑科技不承担任何由此产生的一切法律责任。\n\n"
    +"4.8 隐私权保护：\n\n"
    +"4.8.1 象扑科技承诺按照《象扑科技用户信息管理制度》以及适用法律的规定保护用户隐私。\n\n"
    +"4.8.2 象扑科技制定了以下五项隐私权保护原则，指导我们如何来处理产品中涉及到用户隐私权和用户信息等方面的问题：\n\n"
    +"（1）利用我们收集的信息为用户提供有价值的产品和服务。\n\n"
    +"（2）开发符合隐私权标准和隐私权惯例的产品。\n\n"
    +"（3）将个人信息的收集透明化，并由权威第三方监督。\n\n"
    +"（4）尽最大的努力保护我们掌握的信息。\n\n"
    +"（5）本软件不会获取用户的浏览历史以及个人资料等隐私数据，更不会上传相关信息。\n\n"
    +"4.8.3 为实现本软件的相关功能所必须，本软件会通过IOS/Android系统接口调用用户移动设备的配置及软件信息。调用的信息仅在用户移动设备本地使用，没有任何上传行为，不会造成用户信息泄露。\n\n"
    +"4.8.4 为了更好地改进软件和服务，在用户安装、卸载本软件以及清理插件时，本软件会向象扑科技服务器报告以上行为的发生，具体报告方法为访问服务器的一个页面，服务器根据该页面的被访问次数统计以上行为的发生次数。象扑科技不会将此数据与用户的个人身份信息相关联。\n\n"
    +"5. 免责与责任限制\n\n"
    +"5.1 本软件经过详细的测试，但不能保证与所有的软硬件系统完全兼容，不能保证本软件完全没有错误。如果出现不兼容及软件错误的情况，用户可拨打技术支持电话将情况报告象扑科技，获得技术支持。如果无法解决兼容性问题，用户可以删除本软件。\n\n"
    +"5.2 使用本软件产品风险由用户自行承担，在适用法律允许的最大范围内，对因使用或不能使用本软件所产生的损害及风险，包括但不限于直接或间接的个人损害、商业赢利的丧失、贸易中断、商业信息的丢失或任何其它经济损失，象扑科技不承担任何责任。\n\n"
    +"5.3 对于因电信系统或互联网网络故障、移动设备故障或病毒、信息损坏或丢失、移动设备系统问题或其它任何不可抗力原因而产生损失，象扑科技不承担任何责任。\n\n"
    +"5.4 用户违反本协议规定，对象扑科技造成损害的。象扑科技有权采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。\n\n"
    +"6. 法律及争议解决\n\n"
    +"6.1 本协议适用中华人民共和国法律。\n\n"
    +"6.2 因本协议引起的或与本协议有关的任何争议，各方应友好协商解决；协商不成的，任何一方均可将有关争议提交至武汉仲裁委员会并按照其届时有效的仲裁规则仲裁；仲裁裁决是终局的，对各方均有约束力。\n\n"
    +"7. 其他条款\n\n"
    +"7.1 如果本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，或违反任何适用的法律，则该条款被视为删除，但本协议的其余条款仍应有效并且有约束力。\n\n"
    +"7.2 象扑科技有权根据有关法律、法规的变化以及公司经营状况和经营策略的调整等修改本协议。修改后的协议会在象扑科技网站上公布，并随附于新版本软件。当发生有关争议时，以最新的协议文本为准。如果不同意改动的内容，用户可以自行删除本软件。如果用户继续使用本软件，则视为您接受本协议的变动。\n\n"
    +"7.3 象扑科技在法律允许的范围内对本协议拥有解释权与修改权。";