
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var ActivityActionCreator = {

  /**
   *
   *
   */
  getActivities: function ( limit) {

  	if(!limit){
  		limit=6;
  	}

    Api.Call('/api/v1/activities?limit=' + limit, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_ACTIVITIES,
        result: result ,
      });
    },'get');

  },

  saveAcitivity: function(verb, object, result){

      try{

        var uname = localStorage.getItem("user_name");
        if(!uname){
          uname = localStorage.getItem("user_id")
        }

        var mailto = localStorage.getItem("user_id");
        if (!mailto.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)){
          mailto = uname + '@dumy.xueduoduo.io'
        }
        var stmt = {
          "actor" : {
            "objectType": "Agent",
            "name": uname,
            "mbox" : "mailto:" + mailto
          },
          "verb" : verb,
          "object" : object,
          "result" : result
        };
        /*var resp_obj = */
        ADL.XAPIWrapper.sendStatement(stmt);
      }catch(e){
        console.log(e);
      }
  }

};

module.exports = ActivityActionCreator;