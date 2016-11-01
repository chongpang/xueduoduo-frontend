

var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = XddConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var payload = {};
var startLO = {};

var LearnerStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getPayload: function(){
    return payload;
  },

  getStartLO: function(){
    return startLO;

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

LearnerStore.dispatchToken = XddAppDispatcher.register(function(action) {


  switch(action.type) {

    case ActionTypes.LEARNER_ENROLL:
      console.log("action type: " + action.type);
      payload = action.result;
      LearnerStore.emitChange();
      break;
    case ActionTypes.START_LEARN:
      console.log("action type: " + action.type);
      startLO = action.result;
      LearnerStore.emitChange();
      break;  
      
    default:
      // do nothing
  }

});

module.exports = LearnerStore;