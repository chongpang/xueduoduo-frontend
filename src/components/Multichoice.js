import React from 'react';

import {
    Row,
    Col,
    Icon,
    Grid,
    Checkbox,
    ButtonGroup,

} from '@sketchpixy/rubix';

export default class MultiChoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            choices: []
        };
    }

    addChoice() {

        var choices = this.state.choices;

        if (!choices) {
            choices = null;
        }

        choices.push({});

        this.setState({choices: choices});

    }

    removeChoice(index) {

        var choices = this.state.choices;

        if (choices.length < 2) {
            return;
        }

        choices.splice(index - 1, 1);

        this.setState({choices: choices});

    }

    render() {

        if (this.props.quiz.choices && this.props.quiz.choices.length > 0) {
            this.state.choices = this.props.quiz.choices;
        }

        if (this.state.choices.length == 0) {
            this.state.choices.push({});
        }

        var self = this;

        var mc = this.state.choices.map(function (choice, index) {
            var answer = self.props.quiz.answer;
            var dchecked = "";
            if (answer && answer.indexOf((index + 1) + "") >= 0) {
                dchecked = "checked";
            }
            return (
                <Grid key={ 'choice-' + (index + 1)  }>
                    <Row className='answer-option padding-topdown-20'>
                        <Col xs={6}>
                            <Row>
                                <Col xs={2} collapseRight>
                                    <Checkbox defaultChecked={ dchecked }
                                              name={ self.props['answerTo'] + '-choice-' + (index + 1) + '-correct'}/></Col>
                                <Col xs={10} collapseLeft>
                                    <textarea rows='2' name={ self.props['answerTo'] + '-choice-' + (index + 1)  }
                                              placeholder='New choice...' defaultValue={choice.content} />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6} collapseLeft>
                            <ButtonGroup>
                                <a onClick={ self.addChoice }><Icon className={'fg-orange'} style={{fontSize: 28}}
                                                                    glyph='icon-fontello-plus'/></a>
                                <a style={{paddingLeft: 10}}
                                   onClick={ self.removeChoice.bind(this, 'choice-' + (index + 1)) }><Icon
                                    className={'fg-orange'} style={{fontSize: 28}} glyph='icon-fontello-minus'/></a>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Grid>);

        });
        return (
            <Col xs={12} className="answer-area" style={{paddingTop: 12.5}}>
                { mc }
            </Col>
        );
    }
}
