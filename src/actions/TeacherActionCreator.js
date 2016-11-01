
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var TeacherActionCreator = {

  /**
   *
   *
   */
  inviteStudent: function ( param) {

    var userids = param['students'];
    userids = userids.split(",");
    param['students'] =  userids;

    Api.Call('/api/v1/class/invite', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.INVITE_STUDENT,
        result: result ,
      });
    });

  }
};

module.exports = TeacherActionCreator;