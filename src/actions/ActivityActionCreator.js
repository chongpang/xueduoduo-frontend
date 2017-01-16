var XddAppDispatcher = require('dispatcher/XddDispatcher');
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var xGlobal = require('xGlobal');
var Api = require('services/Api');

var store = require('store');

var ActivityActionCreator = {

    /**
     *
     *
     */
    getActivities: function (limit) {

        if (!limit) {
            limit = 6;
        }

        Api.Call('/api/v1/activities?limit=' + limit, null, function (result) {

            XddAppDispatcher.dispatch({
                type: ActionTypes.GET_ACTIVITIES,
                result: result,
            });
        }, 'get');

    },

    saveAcitivity: function (verb, object, result) {

        try {

            var uname = store.get("user_name");
            if (!uname) {
                uname = store.get("user_id");
            }

            var mailto = store.get("user_id");
            if (!mailto.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)) {
                mailto = store.get("user_id") + '@xueduoduo.cn';
            }
            var stmt = {
                "actor": {
                    "objectType": "Agent",
                    "name": uname,
                    "mbox": "mailto:" + mailto
                },
                "verb": verb,
                "object": object,
                "result": result
            };
            /*var resp_obj = */
            ADL.XAPIWrapper.sendStatement(stmt);
        } catch (e) {
            console.log(e);
        }
    },

    getCourseObj: function (course) {
        var course = xGlobal.XDD_OBJECTS['course'];

        course.id = "http://" + xGlobal.HOST_NAME + '/learner/course/' + course.id;
        course.definition.name['en-US'] = "课程: " + course.title;
        course.definition.name['zh-CN'] = "course: " + course.title;
        course.definition.description['en-US'] = course.description;
        course.definition.description['zh-CN'] = course.description;

        return course;
    },


    getClassObj: function (c) {
        var oClass = xGlobal.XDD_OBJECTS['class'];

        oClass.id = "http://" + xGlobal.HOST_NAME + '/learner/class/' + c.id;
        oClass.definition.name['en-US'] = "班级: " + c.title;
        oClass.definition.name['zh-CN'] = "Class: " + c.title;
        oClass.definition.description['en-US'] = c.description;
        oClass.definition.description['zh-CN'] = c.description;

        return oClass;
    },

    getLearningObj: function (lo) {
        var learningbj = xGlobal.XDD_OBJECTS['learningobj'];

        learningbj.id = "http://" + xGlobal.HOST_NAME + '/learner/learn/' + lo.id;
        learningbj.definition.name['en-US'] = "learning object : " + lo.title;
        learningbj.definition.name['zh-CN'] = "知识点: " + lo.title;
        learningbj.definition.description['en-US'] = lo.description;
        learningbj.definition.description['zh-CN'] = lo.description;

        return learningbj;
    },
    getQuestionObj: function (qid, q) {
        var qest = xGlobal.XDD_OBJECTS['question'];

        qest.id = "http://" + xGlobal.HOST_NAME + '/learner/learn/' + qid; // learning object + qindex
        qest.definition.name['en-US'] = q;
        qest.definition.name['zh-CN'] = q;
        qest.definition.description['en-US'] = '';
        qest.definition.description['zh-CN'] = '';

        return qest;
    }

};

module.exports = ActivityActionCreator;