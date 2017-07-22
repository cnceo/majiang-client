var RULE_TYPE = ['Basic','Special','Pay','Balance'];
var MAHJONG_TYPE = ['Kong','Huang'];
main.HelpLayer = game.IView.extend({
    uiHelper:null,
    _curLeftBtn:null,
    _curBtnRule:null,
    _scrollVeiw:null,
    _helpContext:[],
    _curPlayType:0, //玩法   0:红中发财杠  1：红中发财晃
    _curRuleType:0, //玩法   0:基本规则  1：特殊规则  2:支付方式  3:结算
    _scrollViewSize :null,

    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.uiHelper = new game.UIHelper();
        var node = this.uiHelper.doLayout(res.Help_json);
        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        node.setContentSize(size);

        var btnClose=ccui.helper.seekWidgetByName(node,"ButtonClose");
        btnClose.msg = common.NotifyType.CLOSE_HELP_PANEL ;
        btnClose.addTouchEventListener(this.btnCloseClicked,this);
        var imgBg = ccui.helper.seekWidgetByName(node,"ImgBg");
        //初始化左边栏 待扩展其他麻将的加入
        for (var i=0;i<MAHJONG_TYPE.length;i++){
            var btn = ccui.helper.seekWidgetByName(node,"CheckBox"+MAHJONG_TYPE[i]);
            btn.mahjongType=i;
            btn.setTouchEnabled(true);
            btn.addEventListener(this.btnMahjongTypeClicked,this) ;
            if (i==0){
                btn.setSelected(true);
                btn.setTouchEnabled(false);
                this._curLeftBtn = btn;
            }
        }
        this._curPlayType = 0;
        this._curRuleType = 0 ;
        //初始化规则
        for (var i=0;i<RULE_TYPE.length;i++){
            var btnRule = ccui.helper.seekWidgetByName(imgBg,"ButtonRule"+RULE_TYPE[i]);
            btnRule.ruleType = i ;
            btnRule.setTouchEnabled(true);
            btnRule.addEventListener(this.btnRuleTypeClicked,this) ;
            if (i==0){
                btnRule.setSelected(true);
                btnRule.setTouchEnabled(false);
                this._curBtnRule = btnRule ;
            }
        }

        this._scrollVeiw = ccui.helper.seekWidgetByName(imgBg,"ScrollView") ;
        this._scrollViewSize = this._scrollVeiw.getContentSize();
        var helpText = [
            {"ins_play_type":"1","lang_id":"1","color":"0,0,0,","memo":"基本规则","tips":"【用牌】\n有万、条、筒、东、南、西、北、中、发、白，一共136张。\n【定庄】\n初始牌局随机给庄，庄家胡牌或者荒庄（流局）则继续坐庄，否则逆时针上家（东南西北）坐庄，庄家身份在结算时由特殊作用。\n【玩法】\n可吃、可碰、可杠牌；\n红中、发财是固定杠牌，手中有红中或发财时不能胡牌。红中、发财必须杠出去，而且其余玩家也不能胡打出去的红中、发财；\n赖子是全能牌，它可以和任意牌组合玩家想要的牌，赖子和红中，发财一样也可以杠，也可以打出去。如果赖子皮是红中或发财，那么本局的赖子是白板。\n【胡牌规则】\n1.基本牌型\n一对将牌，和4个刻字或者顺子牌。有屁胡、清一色、将一色、风一色、碰碰胡、杠上开花、抢杠、全求人、海底捞。\n除风一色、清一色、碰碰胡外，其余牌型的一对必须是二、五、八做将；\n除了屁胡，其他牌型均为大胡。\n2.胡牌条件\n开口且满足房间起胡番要求才能胡，起胡番在创建房间时设置；\n杠出去的红中、发财、赖子的总番数需要大于等于4番；\n开口但没有杠红中、发财或赖子，这时不得胡牌，但是如果该玩家是庄家又是自摸则可以胡牌；\n屁胡时手中只能有一个赖子，当有两个或两个以上赖子时，只能胡大胡；\n允许截胡，即每一局仅一个人能胡。当同时有超过1人可胡时，以庄家逆时针为序确定胡牌者；\n胡一不胡二，同一圈中没胡第一家就不能胡第二第三家，过圈之后才能胡。\n3.胡牌方式\n自摸：自己摸牌后胡；\n点炮（放冲）：胡其他玩家打出的牌；\n杠上开花：杠后在牌墩最尾摸牌胡；\n抢杠：玩家明杠时，正好另一玩家胡这张牌。\n4.基本番型\n碰碰胡（10番）：除将牌外均为刻字，任意将；\n风一色（10番）：手上全部为风牌，不需要2,5,8做将；\n清一色（10番）：手上全部为同一花色，不需要2,5,8做将；\n将一色（10番）：手上全部为2,5,8；\n全求人（10番）：当玩家开了4口，且手上只剩一张将牌（2,5,8或赖子），这时胡牌叫做全求人；\n抢杠胡（10番）：有一玩家在明杠时，正好有另一玩家胡这张牌，必须2,5,8做将；\n杠上开花（10番）：杠了（包括明杠、暗杠、固定杠牌和杠赖子）之后补牌时自摸，胡牌时必须2、5、8做将；\n海底捞（10番）：从尾墩数到第七墩牌（最后14张牌），在此范围内胡牌为海捞；\n除了屁胡，其余牌型均为大胡。","status":"1"},
            {"ins_play_type":"1","lang_id":"2","color":"0,0,0,","memo":"特殊规则","tips":"无","status":"1"},
            {"ins_play_type":"1","lang_id":"3","color":"0,0,0,","memo":"支付方式","tips":"【房主支付】\n房主支付房卡，其余玩家不用支付。房主玩家有踢出其他玩家的权利。\n【AA支付】\n房员AA支付房卡，每个玩家进入时会预扣除房卡，游戏开始时扣除。如果游戏开始前退出则返还房卡。\n【代开房间】\n 帮助他人支付房费开设房间，在房间内游戏开始前可以在“查看已开”中取消代开。除自己外所有房员均不需要支付房卡，房间内人满且准备后可开始游戏。","status":"1"},
            {"ins_play_type":"1","lang_id":"4","color":"0,0,0,","memo":"结算","tips":"没有承包时，1家胡牌，3家输分，没放冲的玩家也需要进行结算。有承包时，1家承担所有输分。\n输分=自己的番数*赢家的番数*大小胡番数\n【计分】\n基础番为1，庄家x2，赢家开口x2，输家开口x2，自摸x2，点炮（放冲）x2，硬胡x2，每杠红中x2，每杠发财x2，每杠赖子x4，每明杠x2，每暗杠x4。\n清一色、将一色、风一色、碰碰胡、杠上开花、抢杠、全求人、海底捞等大胡为10番。\n【承包】\n1.A玩家胡全求人牌型，B玩家放冲且B玩家没听牌，则B玩家承包；\n若B玩家已听牌，则不用承包。\n2.A玩家胡清一色，此时已经有两铺下地，如果第三次开口的对象是B，那么A胡清一色后B承包；\n3.A玩家胡将一色，此时已经有两铺下地，如果第三次开口的对象是B，那么A胡将一色后B承包；\n4.B玩家明杠时，A玩家刚好胡这张牌，那么B承包。\n【封顶】\n1.封顶：如果该局有玩家输的番数超过300个番，则形成封顶，最多只能付300番。\n2.金顶：如果三个玩家输的番数都超过300个番，则形成金顶，每玩家要付500番。\n3.光明顶：如果在金顶时有一个输家没有开口，则形成光明顶，输家应付700番，有两个输家没有开口是也是光明顶。\n4.哈巴顶：如果在金顶时三个输家都没开口，就形成哈巴顶，此时每玩家应付900番。","status":"1"},
            {"ins_play_type":"2","lang_id":"1","color":"0,0,0,","memo":"基本规则","tips":"【用牌】\n有万、条、筒、中、发、白，一共120张。\n【定庄】\n初始牌局随机给庄，庄家胡牌或者荒庄（流局）则继续坐庄，否则逆时针上家（东南西北）坐庄，庄家身份在结算时由特殊作用。\n【玩法】\n可吃、可碰、可杠牌，可亮中发白；\n红中晃晃中红中固定杠牌，手中有红中不能胡牌。红中必须杠出去，而且其余玩家也不能胡打出去的红中；\n发财晃晃中红中、发财是固定杠牌，手中有红中、发财不能胡牌。红中、发财必须杠出去，而且其余玩家也不能胡打出去的红中、发财；\n赖子是全能牌，它可以和任意牌组合玩家想要的牌，赖子和红中，发财一样也可以杠，也可以打出去；\n红中晃晃中，红中是固定杠牌，不能是赖子。即：若红中是赖子皮，则发财是赖子；发财是赖子皮，则白板是赖子；白板是赖子皮，则发财是赖子；\n财晃晃玩法，红中、发财是固定杠牌，不能是赖子；则翻到中发白任何一张都只能白板为赖子。\n【胡牌规则】\n1.基本牌型\n一对将牌，和4个刻字或者顺子牌。有平胡、门清、清一色、将一色、碰碰胡、七对、豪华七对、双豪华七对、三豪华七对。所有牌型都不需要二、五、八做将，并且没有赖子限制。\n除了平胡，其他牌型均为大胡。\n2.胡牌条件\n满足房间起胡番要求才能胡，起胡番在创建房间时设置；\n允许截胡，即每一局仅一个人能胡。当同时有超过1人可胡时，以庄家逆时针为序确定胡牌者；\n胡一不胡二，同一圈中没胡第一家就不能胡第二第三家，过圈之后才能胡。\n3.胡牌方式\n自摸：自己摸牌后胡\n点炮（放冲）：胡其他玩家打出的牌\n【胡牌番数】\n1.平胡\n软自摸：自摸胡牌时手里有赖子，3倍，3家赔；\n硬自摸：自摸胡牌时手里没有赖子，6倍，3家赔；\n软平胡：手里有赖子时接炮，点炮玩家2倍，非点炮玩家1倍；\n硬平湖：手里没有赖子时接炮，点炮玩家4倍，非点炮玩家2倍；\n2.门清\n有赖子：10倍，3家赔；\n没有赖子：20倍，3家赔；\n3.清一色、将一色、七对、碰碰胡\n软自摸：10倍，3家赔；\n硬自摸：20倍，3家赔；\n软接炮：点炮玩家10倍，非点炮玩家5倍；\n硬接炮：点炮玩家20倍，非点炮玩家10倍；\n4.豪华七对\n软自摸：20倍，3家赔；\n硬自摸：40倍，3家赔；\n软接炮：点炮玩家20倍，非点炮玩家10倍；\n硬接炮：点炮玩家40倍，非点炮玩家20倍；\n5.双豪华七对\n软自摸：40倍，3家赔；\n硬自摸：80倍，3家赔；\n软接炮：点炮玩家40倍，非点炮玩家20倍；\n硬接炮：点炮玩家80倍，非点炮玩家40倍；\n6.三豪华七对\n软自摸：60倍，3家赔；\n硬自摸：120倍，3家赔；\n软接炮：点炮玩家60倍，非点炮玩家30倍；\n硬接炮：点炮玩家120倍，非点炮玩家60倍；","status":"1"},
            {"ins_play_type":"2","lang_id":"2","color":"0,0,0,","memo":"特殊规则","tips":"【亮中发白】\n翻出赖子后，若手牌中含有“中”“发”“白”三张，可选择亮中发白；\n其中“亮”x2，红中x2，发财x2，赖子x4。","status":"1"},
            {"ins_play_type":"2","lang_id":"3","color":"0,0,0,","memo":"支付方式","tips":"【房主支付】\n房主支付房卡，其余玩家不用支付。房主玩家有踢出其他玩家的权利。\n【AA支付】\n房员AA支付房卡，每个玩家进入时会预扣除房卡，游戏开始时扣除。如果游戏开始前退出则返还房卡。\n【代开房间】\n 帮助他人支付房费开设房间，在房间内游戏开始前可以在“查看已开”中取消代开。除自己外所有房员均不需要支付房卡，房间内人满且准备后可开始游戏。","status":"1"},
            {"ins_play_type":"2","lang_id":"4","color":"0,0,0,","memo":"结算","tips":"输分=自己的番数*赢家的番数*胡牌牌型番数。\n【计分】\n基础番为1，每杠红中x2，每杠发财（发财晃晃）x2，每杠赖子x4，每明杠x2，每暗杠x4，三铺倒x2，亮中发白（请看特殊规则）。\n【封顶】\n金顶银顶，银顶=0.8 x金顶；\n银顶：单家封顶倍数。当三家都是银顶时，则形成金顶。","status":"1"},
        ] ; //之后这一部分从配置文件读取
        for (var i = 0;i<helpText.length;i++){
            var playType = parseInt(helpText[i].ins_play_type) -1;
            if (!this._helpContext[playType]){
                this._helpContext[playType] = [] ;
            }
            this._helpContext[playType].push(helpText[i]) ;
        }
        this.showLabelByType() ;


        this.addChild(node);
        return true;
    },

    showLabelByType:function(){
        console.log("showLabelByType this._curPlayType ",this._curPlayType,this._curRuleType);
        this._scrollVeiw.removeAllChildren() ;
        if (!this._helpContext[this._curPlayType] || !this._helpContext[this._curPlayType][this._curRuleType]){
            return ;
        }
        var content = this._helpContext[this._curPlayType][this._curRuleType] ;
        var tips = content.tips ;
        var align = cc.TEXT_ALIGNMENT_LEFT ;
        if (tips.length < 10){
            align = cc.TEXT_ALIGNMENT_CENTER ;
        }
        var label = new cc.LabelTTF(tips,"Arial",30 );
        label.anchorX = 0;
        label.anchorY = 1 ;
        label.x = 50 ;
        label.y = 200;
        // label.setColor(content.color) ;
        label.textAlign =align;
        this._scrollVeiw.addChild(label);
        var contentSize = label.getContentSize() ;
        var oldHeight = contentSize.height ;
        var eachLine = 1100 ;
        var line = 1 ;
        if (contentSize.width > eachLine){
            line = Math.ceil(contentSize.width /eachLine) ;
            var height = oldHeight*line ;
            if (height < this._scrollViewSize.height){
                height = this._scrollViewSize.height ;
            }
            label.y = height -50;
            label.setDimensions(eachLine,height);
            this._scrollVeiw.setInnerContainerSize(cc.size(this._scrollViewSize.width,height));
        }else{
            if (tips.length < 10){
                label.x = this._scrollViewSize.width/2;
                label.y = this._scrollViewSize.height/2 + 100;
            }else{
                label.y = this._scrollViewSize.height - 50 ;
            }
            this._scrollVeiw.setInnerContainerSize(this._scrollViewSize);
        }
    },

    btnMahjongTypeClicked:function(sender, type){
        if(type == ccui.CheckBox.EVENT_SELECTED){
            if (sender == this._curLeftBtn){
                return ;
            }
            this._curPlayType  = sender.mahjongType ;
            this.updateCurBtnMahjong(sender);
            this.showLabelByType();
        }
    },

    btnRuleTypeClicked:function(sender, type){
        if(type==ccui.CheckBox.EVENT_SELECTED){
            if (sender == this._curBtnRule){
                return ;
            }
            this.updateCurBtnRule(sender);
            this._curRuleType = sender.ruleType ;
            this.showLabelByType() ;
        }
    },

    //地区button
    updateCurBtnMahjong:function(btn){
        if (this._curLeftBtn != btn){
            this._curLeftBtn.setSelected(false);
            this._curLeftBtn.setTouchEnabled(true) ;
            btn.setTouchEnabled(false) ;
            btn.setSelected(true) ;
            this._curLeftBtn = btn ;
        }
    },

    //规则Button
    updateCurBtnRule:function(btn){
        if (this._curBtnRule != btn){
            this._curBtnRule.setSelected(false);
            this._curBtnRule.setTouchEnabled(true) ;
            btn.setTouchEnabled(false) ;
            btn.setSelected(true);
            this._curBtnRule = btn ;
        }
    },

    onExit:function () {
        this.uiHelper.clearRes();
        this._super();
    }
});

