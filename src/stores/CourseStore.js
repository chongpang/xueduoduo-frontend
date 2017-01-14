

var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = XddConstants.ActionTypes;
var CHANGE_EVENT = "chnage";


var payload = {};

var CourseStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getPayload: function(){
    return payload;
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

CourseStore.dispatchToken = XddAppDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.GET_COURSES:
      payload = action;
      CourseStore.emitChange();
      break;

     case ActionTypes.GET_COURSE:
      payload = action;
      CourseStore.emitChange();
      break;     
 
    case ActionTypes.CREATE_COURSE:
      payload = action;
      CourseStore.emitChange();
      break; 

    case ActionTypes.UPDATE_COURSE:
      payload = action;
      CourseStore.emitChange();
      break; 

    case ActionTypes.SEARCH_COURSE:
      payload = action;
      CourseStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = CourseStore;