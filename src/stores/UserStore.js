

var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = XddConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var payload = {};

var userType = -1;

var UserStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getPayload: function(){
    return payload;
  },

  getUserType: function(){
    return userType;
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

UserStore.dispatchToken = XddAppDispatcher.register(function(action) {


  switch(action.type) {

    case ActionTypes.USER_SIGNUP:
      console.log("action type: " + action.type);
      payload = action.result;
      UserStore.emitChange();
      break;

    case ActionTypes.USER_SIGNIN:
      console.log("action type: " + action.type);
      payload = action.result;
      userType = payload.userType;
      UserStore.emitChange();
      break;
      
    case ActionTypes.UPDATE_ACCOUNT:
      console.log("action type: " + action.type);
      payload = action.result;
      UserStore.emitChange();
      break;  
    case ActionTypes.JOIN_CLASS:
      console.log("action type: " + action.type);
      payload = action.result;
      UserStore.emitChange();
      break; 
    case ActionTypes.SIGNUP_CONFIRM:
      console.log("action type: " + action.type);
      payload = action.result;
      UserStore.emitChange();
    case ActionTypes.UPDATE_USER_TYPE:
        console.log("action type: " + action.type);
        payload = action.result;
        UserStore.emitChange();
      default:
      // do nothing
  }

});

module.exports = UserStore;