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
            quiz: null
        };
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }


    render() {

        if (this.props.quiz != null) {
            this.state.quiz = this.props.quiz;
        }

        console.log(this.state.quiz)

        var answer = null;

        if (this.state.quiz.qtype == 1) {
            answer = React.createElement(MultiChoice, this.props);
        } else if (this.state.quiz.qtype == 2) {
            answer = React.createElement(Yesno, this.props);
        } else if (this.state.quiz.qtype == 3) {
            answer = React.createElement(TextAnswer, this.props);
        }

        return answer;
    }
}
