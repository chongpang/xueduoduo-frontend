/**
 * Created by Sazanami on 22/11/16.
 */
var os = require("os");

var xGlobal = {

    'HOST_NAME': os.hostname(),

    'API_HOST': "http://localhost:8081",

    'XDD_VERBS': {
        "signin": {
            "id": "http://adlnet.gov/expapi/verbs/logged-in",
            "display": {"en-US": "logged-in", "zh-CN": "登录"}
        },
        "signup": {
            "id": "http://adlnet.gov/expapi/verbs/registered",
            "display": {"en-US": "signup", "zh-CN": "注册"}
        },
        "enroll": {
            "id": "http://adlnet.gov/expapi/verbs/registered",
            "display": {"en-US": "attended", "zh-CN": "加入"}
        },
        "launched": {
            "id": "http://adlnet.gov/expapi/verbs/launched",
            "display": {"en-US": "started", "zh-CN": "开始学习"}
        },
        "resumed": {
            "id": "http://adlnet.gov/expapi/verbs/resumed",
            "display": {"en-US": "resumed", "zh-CN": "继续"}
        },
        "answered": {
            "id": "http://adlnet.gov/expapi/verbs/answered",
            "display": {"en-US": "answer", "zh-CN": "回答了"}
        },
        "completed": {
            "id": "http://adlnet.gov/expapi/verbs/completed",
            "display": {"en-US": "completed", "zh-CN": "完成了"}
        },
        "experienced": {
            "id": "http://adlnet.gov/expapi/verbs/experienced",
            "display": {"en-US": "experienced", "zh-CN": "学习了"}
        },
        "passed": {
            "id": "http://adlnet.gov/expapi/verbs/passed",
            "display": {"en-US": "passed", "zh-CN": "通过了"}
        },
        "attempted": {
            "id": "http://adlnet.gov/expapi/verbs/attempted",
            "display": {"en-US": "attempted", "zh-CN": "尝试"}
        },
        "mastered": {
            "id": "http://adlnet.gov/expapi/verbs/mastered",
            "display": {"en-US": "mastered", "zh-CN": "掌握了"}
        }
    },

    'XDD_OBJECTS': {
        "signin": {
            "id": os.hostname() + "/signin",
            "objectType": "Activity",
            "definition": {
                "name": {
                    "en-US": "Xueduoduo",
                    "zh-CN": "学多多"

                },
                "description": {
                    "en-US": "Xueduoduo",
                    "zh-CN": "学多多"
                }
            }
        },
        "signup": {
            "id": os.hostname() + "/signup",
            "objectType": "Activity",
            "definition": {
                "name": {
                    "en-US": "Xueduoduo",
                    "zh-CN": "学多多"

                },
                "description": {
                    "en-US": "Xueduoduo",
                    "zh-CN": "学多多"
                }
            }
        },
        "class": {
            "id": "id of class",
            "objectType": "Activity",
            "definition": {
                "name": {
                    "en-US": "name of class",
                    "zh-CN": "name of 班级"

                },
                "description": {
                    "en-US": "name of class",
                    "zh-CN": "name of 班级"
                }
            }
        },
        "course": {
            "id": "id of course",
            "objectType": "Activity",
            "definition": {
                "name": {
                    "en-US": "name of course",
                    "zh-CN": "name of 课程"

                },
                "description": {
                    "en-US": "course",
                    "zh-CN": "课程"
                }
            }
        },

        "learningobj": {
            "id": "id of learning object",
            "objectType": "Activity",
            "definition": {
                "name": {
                    "en-US": "name of learning object",
                    "zh-CN": "name of 知识点"

                },
                "description": {
                    "en-US": "description of learning object",
                    "zh-CN": "description of 知识点"
                }
            }
        },
        "question": {
            "id": "id of question",
            "objectType": "Activity",
            "definition": {
                "name": {
                    "en-US": "name of question",
                    "zh-CN": "name of question"

                },
                "description": {
                    "en-US": "description of question",
                    "zh-CN": "description of question"
                }
            }
        }
    }
}
module.exports = xGlobal;