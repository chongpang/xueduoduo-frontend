import React from 'react';
import {
    Col

} from '@sketchpixy/rubix';

export default class Textanswer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        var textanswer = "";

        if (this.props.quiz.answer && this.props.quiz.answer.length > 0) {
            textanswer = this.props.quiz.answer[0];
        }

        return (
            <Col xs={12} sm={12}>
                <textarea style={{width: '75%', height: '80px'}}
                          name={ this.props['answerTo'] + '-textanswer' } value={ { textanswer } } />
            </Col>
        );
    }
}
