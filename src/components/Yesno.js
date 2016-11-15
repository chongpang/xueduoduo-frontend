import React from 'react';
import {
    Col

} from '@sketchpixy/rubix';

export default class Yesno extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        var answer = null;
        var checked_yes = '';
        var checked_no = '';

        if (this.props.quiz.answer && this.props.quiz.answer.length > 0) {
            answer = this.props.quiz.answer[0];

            if (answer == 'Yes') {
                checked_yes = "checked";
            } else if (answer == 'No') {
                checked_no = "checked";
            }
        }

        return (
            <Col xs={9}>
                <Radio value='Yes' defaultChecked={ checked_yes } name={ this.props['answerTo'] + '-answeryesno' }>
                    Yes
                </Radio>
                <Radio value='No' defaultChecked={ checked_no } name={ this.props['answerTo'] + '-answeryesno' }>
                    No
                </Radio>
            </Col>
        );
    }
}
