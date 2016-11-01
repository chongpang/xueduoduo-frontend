
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var LearnerActionCreator = {

  /**
   *
   *
   */
  enrollCourse: function ( courseId ) {

    Api.Call('/api/v1/learner/enroll?courseId=' + courseId , null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.LEARNER_ENROLL,
        result: result ,
      });
    }, 'get');

  },

  startLearn: function( courseId ){

    Api.Call('/api/v1/learner/start?cid=' + courseId , null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.START_LEARN,
        result: result ,
      });
    }, 'get');
  }

};

module.exports = LearnerActionCreator;