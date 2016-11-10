import React from 'react';

import routes from './routes';
import render from '@sketchpixy/rubix/lib/node/router';
import l20n from '@sketchpixy/rubix/lib/L20n';

l20n.initializeLocales({
  'locales': ['en-US', 'ch'],
  'default': 'ch'
});

render(routes, () => {
  l20n.ready();
});

if (module.hot) {
  module.hot.accept('./routes', () => {
    // reload routes again
    require('./routes').default
    render(routes);
  });
}

/////////////prod////////////////////////
window.API_HOST = "http://www.xueduoduo.cn:6060";
// xAPI
var conf = {
  "endpoint" : "http://52.39.94.215:8000/data/xAPI/",
  "auth" : "Basic " + toBase64('517a95278142c1ee3e9b81228097a32c0540f32d:0785215b8b4e446fdd887ef7d7995169a63a4d6b'),
};
//////////////////////////////////////////

ADL.XAPIWrapper.changeConfig(conf);

var hostname = location.protocol + "//" + location.host;

window.XDD_VERBS = {
  "signin" : {
    "id" : "http://adlnet.gov/expapi/verbs/logged-in",
    "display" : {"en-US" : "logged-in", "zh-CN" : "登录"}
  },
  "signup" : {
    "id" : "http://adlnet.gov/expapi/verbs/registered",
    "display" : {"en-US" : "signup", "zh-CN" : "注册"}
  },
  "enroll" : {
    "id" : "http://adlnet.gov/expapi/verbs/registered",
    "display" : {"en-US" : "attended", "zh-CN" : "加入"}
  },
  "launched" : {
    "id" : "http://adlnet.gov/expapi/verbs/launched",
    "display" : {"en-US" : "started", "zh-CN" : "开始学习"}
  },
  "resumed" : {
    "id" : "http://adlnet.gov/expapi/verbs/resumed",
    "display" : {"en-US" : "resumed", "zh-CN" : "继续"}
  },
  "answered" : {
    "id" : "http://adlnet.gov/expapi/verbs/answered",
    "display" : {"en-US" : "answer", "zh-CN" : "回答了"}
  },
  "completed" : {
    "id" : "http://adlnet.gov/expapi/verbs/completed",
    "display" : {"en-US" : "completed", "zh-CN" : "完成了"}
  },
  "experienced" : {
    "id" : "http://adlnet.gov/expapi/verbs/experienced",
    "display" : {"en-US" : "experienced", "zh-CN" : "学习了"}
  },
  "passed" : {
    "id" : "http://adlnet.gov/expapi/verbs/passed",
    "display" : {"en-US" : "passed", "zh-CN" : "通过了"}
  },
  "attempted" : {
    "id" : "http://adlnet.gov/expapi/verbs/attempted",
    "display" : {"en-US" : "attempted", "zh-CN" : "尝试"}
  },
  "mastered" : {
    "id" : "http://adlnet.gov/expapi/verbs/mastered",
    "display" : {"en-US" : "mastered", "zh-CN" : "掌握了"}
  },
};

window.XDD_OBJECTS ={
  "signin" : {
    "id" : hostname + "/signin",
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
  "signup" : {
    "id" : hostname+ "/signup",
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
  "class" : {
    "id" : "id of class",
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
  "course" : {
    "id" : "id of course",
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

  "learningobj" : {
    "id" : "id of learning object",
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
  "question" : {
    "id" : "id of question",
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
  },
};

function getCourseObj(course){
  var course = XDD_OBJECTS['course'];

  course.id = hostname + '/learner/course/' + course.id;
  course.definition.name['en-US'] =  "课程: " + course.title;
  course.definition.name['zh-CN'] =  "course: " + course.title;
  course.definition.description['en-US'] =  course.description;
  course.definition.description['zh-CN'] =  course.description;

  return course;
}


function getClassObj(c){
  var oClass = XDD_OBJECTS['class'];

  oClass.id = hostname + '/learner/class/' + c.id;
  oClass.definition.name['en-US'] =  "班级: " + c.title;
  oClass.definition.name['zh-CN'] =  "Class: " +c.title;
  oClass.definition.description['en-US'] =  c.description;
  oClass.definition.description['zh-CN'] =  c.description;

  return oClass;
}

function getLearningObj(lo){
  var learningbj = XDD_OBJECTS['learningobj'];

  learningbj.id = hostname + '/learner/learn/' + lo.id;
  learningbj.definition.name['en-US'] =  "learning object : " + lo.title;
  learningbj.definition.name['zh-CN'] =   "知识点: " +lo.title;
  learningbj.definition.description['en-US'] =  lo.description;
  learningbj.definition.description['zh-CN'] =  lo.description;

  return learningbj;
}

function getQuestionObj(qid, q){
  var qest = XDD_OBJECTS['question'];

  qest.id = hostname + '/learner/learn/' + qid; // learning object + qindex
  qest.definition.name['en-US'] =  q;
  qest.definition.name['zh-CN'] =  q;
  qest.definition.description['en-US'] =  '';
  qest.definition.description['zh-CN'] =  '';

  return qest;
}

function hideHeader( offset_v ){

  if($(window).width() < 1024){
    offset_v = 190;
    if($(window).width() > 400){
      offset_v = 300;
    }
    var scene = new ScrollMagic.Scene({triggerElement: ".triggerElement", offset: offset_v, duration:100});
    scene.setTween("#navbar", 1, { alpha: 0})
    //.addIndicators({name: "1 (duration: 0)"})
        .addTo(new ScrollMagic.Controller());
    $("#navbar").css("opacity",1);
  }

}

