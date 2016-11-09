

var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = XddConstants.ActionTypes;
var CHANGE_EVENT = "chnage";


var payload = {};

var LOStore = assign({}, EventEmitter.prototype, {

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

LOStore.dispatchToken = XddAppDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.SEARCH_LO:
      console.log("action type " + action.type);
      payload = action;
      LOStore.emitChange();
      break;
 
    case ActionTypes.CREATE_LO:
      console.log("action type " + action.type);
      payload = action;
      LOStore.emitChange();
      break; 

    case ActionTypes.ADAPT:
      console.log("action type " + action.type);
      console.log(action);
      payload = action;
      LOStore.emitChange();
      break;   

    case ActionTypes.GET_LO:
      console.log("action type " + action.type);
      payload = action;
      LOStore.emitChange();
      break;      
    case ActionTypes.UPDATE_LO:
      console.log("action type " + action.type);
      payload = action;
      LOStore.emitChange();
      break;      
    case ActionTypes.GET_LO_DETAILS:
      console.log("action type " + action.type);
      payload = action;
      LOStore.emitChange();
      break;            

    default:
      // do nothing
  }

});

module.exports = LOStore;