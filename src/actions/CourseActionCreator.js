
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var CourseActionCreator = {

  /**
   *
   *
   */
  getCourses: function ( cid ) {

    var url = '/api/v1/courses';

    if(cid){
      url += '?cid=' + cid;
    }

    Api.Call(url, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_COURSES,
        result: result ,
      });
    },'get');

  },

    /**
   *
   *
   */
  searchCourses: function ( keywords ) {

    var url = '/api/v1/courses';

    url += '?keywords=' + (keywords || '');


    Api.Call(url, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.SEARCH_COURSE,
        result: result ,
      });
    },'get');

  },

    /**
   *
   *
   */
  getCourse: function ( cid ) {

    var url = '/api/v1/course';

    if(cid){
      url += '?cid=' + cid;
    }

    Api.Call(url, null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_COURSE,
        result: result ,
      });
    },'get');

  },

  createCourse: function ( los, classId) {
    var $form = $("#form-2");

    var param = {};
     $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    param["los"] = los;

    var url = '/api/v1/createcourse';
    if(classId){
        url += '?classId=' + classId
    }

    Api.Call(url, param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.CREATE_COURSE,
        result: result ,
      });
    });
  },

  updateCourse: function (cid, los){
    var $form = $("#form-course-edit");

    var param = {};
     $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    param["los"] = los;
    param["id"] = cid;

    Api.Call('/api/v1/updatecourse', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.UPDATE_COURSE,
        result: result ,
      });
    });
  },

};

module.exports = CourseActionCreator;