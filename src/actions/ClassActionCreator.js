
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var ClassActionCreator = {

  /**
   *
   *
   */
  getClasses: function () {

    Api.Call('/api/v1/classes', null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_CLASSES,
        result: result ,
      });
    },'get');

  },

  getClassInfo: function (classId) {
    
    Api.Call('/api/v1/classinfo?cid=' + classId, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_CLASS_INFO,
        result: result ,
      });
    },'get');
  },

  getClass: function (classId) {
    
    Api.Call('/api/v1/class?cid=' + classId, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_CLASS,
        result: result ,
      });
    },'get');
  },

  deleteClass: function (classId) {
    
    Api.Call('/api/v1/class/remove?cid=' + classId, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.DELETE_CLASS,
        result: result ,
      });
    },'get');
  },

  updateClass: function(classId, courseIds){
    var $form = $("#form-class-edit");

    var param = {};
     $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    param["courses"] = courseIds;
    param["id"]=classId;

    console.log(param);

    Api.Call('/api/v1/class/updateclass', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.UPDATE_CLASS,
        result: result ,
      });
    });
  },

  createClass: function (courses) {
    var $form = $("#form-2");

    var param = {};
     $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    param["courses"] = courses;

    Api.Call('/api/v1/createclass', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.CREATE_CLASS,
        result: result ,
      });
    });
  }
};

module.exports = ClassActionCreator;