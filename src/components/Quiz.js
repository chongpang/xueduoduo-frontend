import React from 'react';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';
import Answer from 'components/Answer';

import {
    Row,
    Col,
    Grid,
    FormControl,
    MenuItem,
    Button,
    ButtonGroup,
    DropdownButton

} from '@sketchpixy/rubix';

export default class Quiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quizs: []
        };
    }

    setQuizs(quizs) {
        this.setState({quizs: quizs});
    }

    addChild() {
        // State change will cause component re-render
        var quizs = this.state.quizs;

        var q = {};

        quizs.push(q);

        var len = quizs.length;
        var n = "quiz-" + len;

        //quizs.push({name: n, qtype:"1"});


        this.setState({quizs: quizs});

        setTimeout(function () {
            $('#' + n).trumbowyg({
                mobile: false,
                tablet: false,
                autogrow: true,
                autoAjustHeight: true,
                dir: $('html').attr('dir')
            }).trumbowyg('html', '');
        }, 10);

    }

    setQuestion(q, content) {

        setTimeout(function () {
            $('#' + q).trumbowyg({
                mobile: false,
                tablet: false,
                autogrow: true,
                autoAjustHeight: true,
                dir: $('html').attr('dir')
            }).trumbowyg('html', content);
        }, 10);
    }

    handleSelection(qindex, answerType) {


        var answerRef = "answerRef-" + qindex;

        $("body").click();

        var qtypename = 'input[name=' + qindex + '-qtype]';
        $(qtypename).val(answerType);

        var quizs = this.state.quizs;

        for (var i = quizs.length - 1; i >= 0; i--) {
            var quiz = quizs[i];
            if (('quiz-' + (i+1) )== qindex) {
                quiz.qtype = answerType;
                quizs[i] = quiz;
                this.setState({quizs: quizs});
                break;
            }
        }

    }

    removeQ(item) {

        var quizs = this.state.quizs;

        item = item.split('-');
        var index = item[1];

        quizs.splice(index - 1, 1);

        this.setState({quizs: quizs});

    }

    render() {
        if (this.props.quizs && this.props.quizs.length > 0) {
            this.state.quizs = this.props.quizs;

        }
        return (
            <div>
                {
                    this.state.quizs.map((quiz, index) => (
                        <Grid key={ 'quiz-' + (index + 1) }>
                            <Row className="padding-topdown-20">
                                <Col xs={12}>

                                    <Row>
                                        <Col>
                                            <div className="question-editor" id={ 'quiz-' + (index + 1) }
                                                 name={'quiz-' + (index + 1) }>{ this.setQuestion.bind(this, 'quiz-' + (index + 1), quiz.question) }</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        { React.createElement(Answer, {
                                            "answerTo": 'quiz-' + (index + 1),
                                            'quiz': quiz
                                        })}
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <ButtonGroup>
                                                <Button bsStyle='darkorange' onClick={this.addChild.bind(this)}><Entity
                                                    entity="addQuiz"/></Button>

                                                <DropdownButton outlined bsStyle="darkorange" dropup
                                                                title={ l20n.ctx.getSync("multiChoice")}
                                                                id={ 'dropdown-quiz' + (index + 1) }
                                                                onSelect={ this.handleSelection.bind(this, 'quiz-' + (index + 1)) }>
                                                    <MenuItem eventKey="1" active><Entity
                                                        entity="multiChoice"/></MenuItem>
                                                    <MenuItem eventKey="2"><Entity entity="yesNo"/></MenuItem>
                                                    <MenuItem eventKey="3"><Entity entity="comment"/></MenuItem>

                                                </DropdownButton>
                                                <FormControl type="hidden" name={'quiz-' + (index + 1) + "-qtype"}
                                                             defaultValue={ quiz.qtype }/>
                                                <Button bsStyle='orange'
                                                        onClick={this.removeQ.bind(this, 'quiz-' + (index + 1))}><Entity
                                                    entity="removeQ"/></Button>
                                            </ButtonGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Grid>
                    ))
                }
            </div>
        );
    }
}
