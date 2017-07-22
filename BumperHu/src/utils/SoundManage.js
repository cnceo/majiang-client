/**
 * Created by ShiTing on 2017/5/19.
 */
var common = common || {};
var LOCAL_MUSIC_ITEM = ["Music","Effect","Voice","Vibrate"];
var LOCAL_GAME_ITEM = ["Dialect","SingleClick","MuteStart"] ;
var LOCAL_SAME_KEY = "BumperHu";
common.soundManage = {
    isMusicOpen:true,
    isEffectOpen:true,
    isDialect:false,
    curMusicName:"",

    init:function(){

    },

    getMusicSettingStatus:function(index){
        var key = LOCAL_SAME_KEY + LOCAL_MUSIC_ITEM[index];
        return cc.sys.localStorage.getItem(key);
    },

    getGameSettingStatus:function(index){
        var key = LOCAL_SAME_KEY+ LOCAL_GAME_ITEM[index];
        return cc.sys.localStorage.getItem(key);
    },

    /**
     * 0123 对应音乐&音效&语音&震动
     * @param isOpen
     * @param index
     */
    setMusicSettingStatus:function(isOpen,index){
        var status = (isOpen == true )? 1: 0 ;
        var key = LOCAL_SAME_KEY + LOCAL_MUSIC_ITEM[index] ;
        cc.sys.localStorage.setItem(key,status);
        switch (index){
            case 0:
                this.isMusicOpen = isOpen ;
                if (isOpen == false){
                    this.stopBackground();
                }
                break;
            case 1:
                this.isEffectOpen = isOpen ;
                if (isOpen == false){
                    cc.audioEngine.stopAllEffects();
                }
                break;
            case 2:
                break;
            case 3:
                break ;

        }
    },

    /**
     * 012 对应方言&单击出牌&静音启动
     * @param isOpen
     * @param index
     */
    setGameSettingStatus:function(isOpen,index){
        var status = (isOpen == true )? 1: 0 ;
        var key = LOCAL_SAME_KEY + LOCAL_GAME_ITEM[index] ;
        cc.sys.localStorage.setItem(key,status);
        switch (index){
            case 0:
                this.isDialect = isOpen;
                break;
            case 1:
                break;
            case 2:
                break;
        }
    },


    update:function(params){

    },
    //普通按钮点击事件
    norBtnClick:function(){
        if (this.isEffectOpen == false) return ;
        cc.audioEngine.playEffect(voiceRes.btn_normal_wav);
    },

    closeBtnClick:function(){
        if (this.isEffectOpen == false) return ;
        cc.audioEngine.playEffect(voiceRes.btn_close_ogg);
    },

    /**
     * 播放出牌音效
     * @param sex 1男2女
     * @param value 1~9 11~19 21~29 字牌  31~35 东南西北白    41 发  42 中
     */
    playMahjongEffect:function(sex,value){
        return ;
        if (this.isEffectOpen == false) return ;
        var resource = sex == 1?mahjongEffect.Man_Ogg:mahjongEffect.Woman_Ogg;
        var sounds = (this.isDialect == true)? resource.Dialect : resource.Mandarin;
        var suit = ["Character_","Bamboo_","Dot_"]; //字牌
        var wind = ["East_Wind_ogg","South_Wind_ogg","West_Wind_ogg","North_Wind_ogg","White_Dragon_ogg"];
        var dragon = ["Green_Dragon_ogg","Red_Dragon_ogg"] ;
        var type = Math.floor(value/10) ;
        var soundName = "";
        var v = value % 10 ;
        if (type == 3){
            soundName = wind[v];
        }else if (type == 4){
            soundName = dragon[v] ;
        }else{
            soundName = suit[type]+v+"_ogg" ;
        }
        cc.audioEngine.playEffect(sounds[soundName]);
    },

    /**
     * 播放吃or碰or杠 音效
     * @param sex
     * @param type  过  吃  碰 杠 杠上开花
     */
    playOperateEffect:function(sex,type){
        if (this.isEffectOpen == false) return ;
        var resource = sex == 1?mahjongEffect.Man_Ogg:mahjongEffect.Woman_Ogg;
        var sounds = (this.isDialect == true)? resource.Dialect : resource.Mandarin;
        var sArr = ["","Chow_ogg","Pong_ogg","Kong_ogg","Kong_And_Win"] ;
        var soundName =sArr[type];
        if (soundName!=""){
            cc.audioEngine.playEffect(sounds[soundName]);
        }
    },


    //播放背景音 大厅和牌桌播放的背景音应该是不一样的
    playBackground:function(name){
        // return ;
        if (this.isMusicOpen == false) return ;
        if (name == this.curMusicName && cc.audioEngine.isMusicPlaying()){ //播放的同一段背景音  不用管
            cc.audioEngine.stopMusic();
        }
        cc.audioEngine.playMusic(name,true);
    },

    pauseBackground:function() {
        cc.audioEngine.pauseMusic();
    },

    resumeBackground:function () {
        cc.audioEngine.resumeMusic();
    },

    stopBackground:function(){
        cc.audioEngine.stopMusic();
    },
};