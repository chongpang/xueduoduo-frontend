
import React from 'react';
import {withRouter} from 'react-router';

import MultiChoice from 'components/Multichoice';
import Yesno from 'components/Yesno';
import TextAnswer from 'components/Textanswer';


@withRouter
export default class Answer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            answerType: null,
            quiz: null
        };
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }


  setQuiz(q){
    this.setState({quiz: q, answerType: q.qtype});
  }

  setAnswerType(type){
  	this.setState({answerType: type});

  }

  render() {

  	var answerType = this.state.answerType;
  	var answer = null;

    if(!answerType){
      answerType = this.props.quiz.qtype;
      this.state.answerType = answerType;
      this.state.quiz = this.props.quiz;
    }
  	
  	if(answerType == 1){
		  answer = React.createElement(MultiChoice,this.props);
  	}else if (answerType == 2){
  		answer = React.createElement(Yesno,this.props);
  	}else if (answerType == 3){
  		answer = React.createElement(TextAnswer,this.props);
  	}

    return answer;
  }
}
