/**
 * Created by ShiTing on 2017/5/19.
 */
var game = game || {};
game.LocalData = {
    _userInfo:null,
    _curRoomNo:null,
    _address:null,
    _lat:null,
    _lng:null,
    setUserInfo:function(data){
      this._userInfo = data ;
    },

    getUserInfo:function(){
        return this._userInfo;
    },

    setCurRoomNo:function(roomNo){
        this._curRoomNo = roomNo ;
    },

    getCurRoomNo:function(roomNo){
        return this._curRoomNo ;
    },

    /*位置*/
    setAddress:function(address) {
        this._address = address;
    },

    getAddress:function () {
        return this._address;
    },

    // 经纬度
    setLatitude:function(lat) {
        this._lat = lat;
    },

    getLatitude:function() {
        return this._lat;
    },

    setLongtitude:function (lng) {
        this._lng = lng;
    },

    getLongtitude:function () {
        return this._lng;
    },


};
