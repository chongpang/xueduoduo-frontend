

var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = XddConstants.ActionTypes;
var CHANGE_EVENT = "change";


var payload = {};

var ActivityStore = assign({}, EventEmitter.prototype, {

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

ActivityStore.dispatchToken = XddAppDispatcher.register(function(action) {


  switch(action.type) {

    case ActionTypes.GET_ACTIVITIES:
      payload = action;
      ActivityStore.emitChange();
      break;
      
    default:
      // do nothing
  }

});

module.exports = ActivityStore;