import React from 'react';
import classNames from 'classnames';



var TextAnswer = React.createClass({

  getInitialState: function(){
	   return {}
  },

  componentDidMount: function() {


  },
  componentWillUnmount: function() {

  },

  render() {

    var textanswer = "";

    if(this.props.quiz.answer && this.props.quiz.answer.length > 0){
      textanswer = this.props.quiz.answer[0];
    }

  	return (
       <Col xs={12} sm={12}>
       	<textarea style={{width:'75%',height: '80px'}} name={ this.props['answerTo'] + '-textanswer' }>{ textanswer }</textarea>
      </Col>
  	);
  }
});

module.exports = TextAnswer;
