
var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    USER_PASSWORD_RESET: null,
  	USER_SIGNUP: null,
    SIGNUP_CONFIRM: null,
  	USER_SIGNIN: null,
  	SEND_SMS:null,
  	GET_CLASSES:null,
    GET_CLASS:null,
    DELETE_CLASS:null,
    GET_CLASS_INFO: null,
  	GET_COURSES:null,
    GET_COURSE:null,
    SEARCH_COURSE:null,
  	CREATE_CLASS:null,
  	CREATE_COURSE:null,
  	CREATE_LO:null,
  	SEARCH_LO:null,
    GET_LO_DETAILS:null,
    GET_LO:null,
    UPDATE_LO:null,
  	ADAPT:null,
    INVITE_STUDENT: null,
    JOIN_CLASS:null,
    LEARNER_ENROLL: null,
    START_LEARN: null,
    UPDATE_COURSE: null,
    UPDATE_CLASS: null,
    GET_ACTIVITIES:null,
    UPDATE_ACCOUNT:null,
    UPDATE_USER_TYPE:null,
  })

};