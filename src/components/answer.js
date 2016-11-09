import React from 'react';
import classNames from 'classnames';
import MultiChoice from 'components/multichoice';
import Yesno from 'components/yesno';
import TextAnswer from 'components/textanswer';


var Answer = React.createClass({

  getInitialState: function(){
	   return {
      answerType: null,
      quiz: null
    }
  },

  componentDidMount: function() {


  },
  componentWillUnmount: function() {

  },

  setQuiz: function(q){
    this.setState({quiz: q, answerType: q.qtype});
  },

  setAnswerType: function(type){
  	this.setState({answerType: type});

  },

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
});

module.exports = Answer;
