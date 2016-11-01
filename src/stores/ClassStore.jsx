

var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = XddConstants.ActionTypes;
var CHANGE_EVENT = "change";


var payload = {};

var ClassStore = assign({}, EventEmitter.prototype, {

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

ClassStore.dispatchToken = XddAppDispatcher.register(function(action) {


  switch(action.type) {

    case ActionTypes.GET_CLASSES:
      console.log("action type " + action.type);
      payload = action;
      ClassStore.emitChange();
      break;

    case ActionTypes.GET_CLASS_INFO:
      console.log("action type " + action.type);
      payload = action;
      ClassStore.emitChange();
      break;  

    case ActionTypes.CREATE_CLASS:
      console.log("action type " + action.type);
      payload = action;
      ClassStore.emitChange();
      break;    

    case ActionTypes.GET_CLASS:
      console.log("action type " + action.type);
      payload = action;
      ClassStore.emitChange();
      break;

    case ActionTypes.UPDATE_CLASS:
      console.log("action type " + action.type);
      payload = action;
      ClassStore.emitChange();
      break;

     case ActionTypes.DELETE_CLASS:
      console.log("action type " + action.type);
      payload = action;
      ClassStore.emitChange();
      break;     

    default:
      // do nothing
  }

});

module.exports = ClassStore;