
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var UserActionCreator = {

  /**
   *
   *
   */
  signup: function () {

    var $form = $("#signup");

    var param = {};
     $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    Api.Call('/api/v1/signup', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.USER_SIGNUP,
        result: result ,
      });
    });

  },

  signin: function () {

    var $form = $("#signin_form");

    var param = {};

    $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    Api.Call('/api/v1/signin', param, function(result){

      if(result != null  && result.retcode == 0 ){
        localStorage.setItem('access_token', result.token);
        localStorage.setItem('user_type', result.userType);
        localStorage.setItem('user_id', result.userId);
        localStorage.setItem('user_name', result.userName);
        localStorage.setItem('o_openid_type', result.openIdType);

      }

      XddAppDispatcher.dispatch({
        type: ActionTypes.USER_SIGNIN,
        result: result,
      });
    });

  },

  signWithWeixin: function (code, state){

    var param = {};

    param['code'] = code;
    param['state'] = state;
    
    Api.Call('/api/v1/signinwithweixin', param, function(result){

    if(result != null  && result.retcode == 0 ){
      
      localStorage.setItem('access_token', result.token);
      localStorage.setItem('user_type', result.userType);
      localStorage.setItem('user_id', result.userId);
      localStorage.setItem('user_name', result.userName);
      localStorage.setItem('o_access_token', result.accessToken);
      localStorage.setItem('o_openid_type', result.openIdType);

      localStorage.setItem('o_nickname', result.userName);
      localStorage.setItem('o_charater', result.headimgurl);
    }

    XddAppDispatcher.dispatch({
      type: ActionTypes.USER_SIGNIN,
        result: result,
      });
    });

  },

  siginWithQQ: function ( code ){

    var param = {};

    param['code'] = code;
    
    Api.Call('/api/v1/signinwithqq', param, function(result){

    if(result != null  && result.retcode == 0 ){
      
      localStorage.setItem('access_token', result.token);
      localStorage.setItem('user_type', result.userType);
      localStorage.setItem('user_id', result.userId);
      localStorage.setItem('user_name', result.userName);
      localStorage.setItem('o_access_token', result.accessToken);
      localStorage.setItem('o_openid_type', result.openIdType);

      localStorage.setItem('o_nickname', result.userName);
      localStorage.setItem('o_charater', result.headimgurl);
    }

    XddAppDispatcher.dispatch({
      type: ActionTypes.USER_SIGNIN,
        result: result,
      });
    });
  },

  // siginWithQQ: function (openId, accessToken,userName) {

  //   var param = {};

  //   param['openId'] = openId;
  //   param['accessToken'] = accessToken;
  //   param['userName'] = userName;
    
  //   Api.Call('/api/v1/signinwithqq', param, function(result){

  //   if(result != null  && result.retcode == 0 ){
  //     localStorage.setItem('access_token', result.token);
  //     localStorage.setItem('user_type', result.userType);
  //     localStorage.setItem('user_id', result.userId);
  //     localStorage.setItem('user_name', result.userName);
  //     localStorage.setItem('o_access_token', result.accessToken);
  //     localStorage.setItem('o_openid_type', result.openIdType);
  //   }

  //   XddAppDispatcher.dispatch({
  //     type: ActionTypes.USER_SIGNIN,
  //       result: result,
  //     });
  //   });
  // },


  getUserInfoFromQQ: function (openId, accessToken) {

    var req = 'https://graph.qq.com/user/get_user_info?';
    req += 'oauth_consumer_key=101356780';
    req += '&access_token=' + accessToken;
    req += '&openid=' + openId;
    req += '&format=json';

    var ret = -1;
    
    Api.Call(req, null, function(result){
      console.log(result);
      result = $.parseJSON(result);
      ret = result.ret;
      if(result != null  && ret == 0){

        localStorage.setItem('o_nickname', result.nickname);
        localStorage.setItem('o_charater', result.figureurl);
      }else{
        console.log('Failed to get user info from qq.')
      }
    },'get', false);

    return ret;
  },



  resetPassword: function( token ){

    var $form = $("#password_reset_form");

    var param = {};

    $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });
    param['token'] = token;

    Api.Call('/api/v1/passwordreset', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.USER_PASSWORD_RESET,
        result: result,
      });
    });
  },

  updateAccount: function( token ){

    var $form = $("#account_update_form");

    var param = {};

    $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });
    param['token'] = token;

    Api.Call('/api/v1/updateuser', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.UPDATE_ACCOUNT,
        result: result,
      });
    });
  },


  joinClass: function( param ){

    Api.Call('/api/v1/class/join', {"token" : param }, function( result ){

      XddAppDispatcher.dispatch({
        type: ActionTypes.JOIN_CLASS,
        result: result,
      });

    });
  },

  sendSMS: function(){

    var param = {};
    param['phone'] = $('#user_id').val();

    Api.Call('/api/v1/sendsms', param, function( result ){

      XddAppDispatcher.dispatch({
        type: ActionTypes.SEND_SMS,
        result: result,
      });

    });
  },

  confirm: function( token){

    var param = {};
    param['phone'] = $('#user_id').val();

    Api.Call('/api/v1/confirm?token=' + token, null, function( result ){

      XddAppDispatcher.dispatch({
        type: ActionTypes.SIGNUP_CONFIRM,
        result: result,
      });

    }, 'get');
  }
};

module.exports = UserActionCreator;