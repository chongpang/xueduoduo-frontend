
var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Api = require('services/Api');

var LOActionCreator = {

  adapt: function( loid , userAnswer){

    var param = {};
  
    param["loid"] = loid;
    param["userAnswer"] = userAnswer;

    Api.Call('/api/v1/learner/adapt?loid=' + loid , param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.ADAPT,
        result: result ,
      });
    });
  },

  /**
   *
   *
   */
  getLOs: function ( keywords) {

    var param = null;
    var url = '/api/v1/searchlo';
    var type = ActionTypes.SEARCH_LO;
    if(keywords){
      url = url + "?keywords=" + keywords;
    }

    Api.Call(url, null, function(result){

      XddAppDispatcher.dispatch({
        type: type,
        result: result ,
      });
    },'get');

  },

    /**
   *
   *
   */
  getLOById: function ( loid) {

    var param = null;
    var url = '/api/v1/searchlo';
    var type = ActionTypes.SEARCH_LO;
    if(loid){
      url = url + "?loid=" + loid;
    }

    Api.Call(url, null, function(result){

      XddAppDispatcher.dispatch({
        type: type,
        result: result ,
      });
    },'get');

  },

  getLOsByCourse:  function ( cid){

    Api.Call('/api/v1/searchlo?cid='+ cid , null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_LO,
        result: result ,
      });
    },'get');

  },

  getLODetails: function( ids ){

    Api.Call('/api/v1/searchlo?loids='+ ids.join() , null, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.GET_LO_DETAILS,
        result: result ,
      });
    },'get');
  },

  updateLO: function ( loid ) {

    var param = this.getFormData('form-edit-lo');

    param['id'] = loid;

    if(param['prerequisites']){
      param['prerequisites'] = param['prerequisites'].split(",");
    }
    

    Api.Call('/api/v1/updatelo', param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.UPDATE_LO,
        result: result ,
      });
    });

  },

  createLO: function ( courseId ) {

    var param = this.getFormData('form-2');
    var url = '/api/v1/createlo';

    if(courseId){
        url += "?courseId=" +  courseId
    }

    Api.Call(url, param, function(result){

      XddAppDispatcher.dispatch({
        type: ActionTypes.CREATE_LO,
        result: result ,
      });
    });
  },

  getFormData: function( id ){

    var $form = $("#" + id);

    var param = {};
    var quizs = [];

    var choices = [];
  
     $($form.serializeArray()).each(function(i, v) {

        if(v.name.indexOf('quiz-') > -1 ){

            if(v.name.length < 8){
              var answers = [];
              var quiz = {};
              quiz['question'] = v.value;
              var choices = [];

              $($form.serializeArray()).each(function(j, vv) {

                   $($form.serializeArray()).each(function(k, vvv) {
                      
                      var key = v.name + "-choice-" + (j + 1);
                      if(vvv.name == key){
                          var choice = {};
                          choice['content'] = vvv.value;
                          choices.push(choice);
                      }

                      key = v.name + "-choice-" + (j+1) + "-correct" ;

                      if(vvv.name == key){
                          answers.push((j+1).toString());
                      }

                   });

                  var key = v.name + "-answeryesno" ;
                  if(vv.name == key){
                      answers.push(vv.value);
                  }

                  var key = v.name + "-textanswer" ;
                  if(vv.name == key){
                      answers.push(vv.value);
                  }

                  var key = v.name + "-qtype" ;
                  if(vv.name == key){
                      quiz['qtype']=vv.value;
                  }
              });

              if(choices.length > 0){
                quiz['choices'] = choices;
              }
              quiz['answer']  = answers;
              quizs.push(quiz);
            }

        }else if(v.name == "tags"){
            if(v.value){
                param[v.name] = v.value.split(',');
            }

        }else if(v.name == "learningLevel"){
            param[v.name] = parseInt(v.value);
        }else{
            param[v.name] = v.value;  
        }

    });

    param['quizs'] = quizs;
    
    return param;
  },

};

module.exports = LOActionCreator;