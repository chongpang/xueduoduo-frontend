import React from 'react';
import {withRouter} from 'react-router';

import LOAction from 'actions/LOActionCreator';
import LOStore from 'stores/LOStore'
import ActivityActionCreator from 'actions/ActivityActionCreator';

import {
    Grid,
    Row,
    Col,
    Panel,
    Button,
    FormControl,
    PanelBody,
    PanelContainer
} from '@sketchpixy/rubix';

@withRouter
export default class Learningobject extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentLO: null,
            userAnwser: []
        };
    }

    componentDidMount() {
        LOStore.addChangeListener(this._onAdaptCallback);
    }

    componentWillUnmount() {

        if (this._onAdaptCallback != null) {
            LOStore.removeChangeListener(this._onAdaptCallback);
        }

    }

    _onAdapt(loid, title) {

        TweenMax.killAll(false, true, false);

        $('div[id*="lo-answer-"' + ']').each(function (i, el) {
            //It'll be an array of elements
            if (el) {

                $(el).removeClass("disabled");
                $(el).removeAttr('disabled');
                $(el).children().attr('disabled');
                $(el).removeClass("choice-selected");
                $(el).removeClass("right-answer");
                $(el).removeClass("wrong-answer");
            }
        });

        LOAction.adapt(loid, this.state.userAnwser);

        var result = {"success": true};
        for (var i = this.state.userAnwser.length - 1; i >= 0; i--) {
            if (this.state.userAnwser[i].answer == 0) {
                result = {"success": false};
                break;
            }
        }

        ActivityActionCreator.saveAcitivity(XDD_VERBS['completed'], getLearningObj({id: loid, title: title}), result);

    }

    _setUserAnswer(answer) {
        // answer {id: 1, qtype: 2, answer: 2/yes/no/comment string}
        this.state.userAnswer.push(answer);
    }

    _onAdaptCallback() {
        var payload = LOStore.getPayload();
        var res = payload.result;
        var self = this;
        if (res != null && res.retcode == 0) {
            if (res.lo.id == this.state.currentLO.id) {
                // finished
                vex.dialog.confirm({
                    message: $.validator.format(translate('finishCourse'), $('#course-title').html()),
                    showCloseButto: true,
                    appendLocation: $('#lo-content'),
                    callback: (value) => {
                        //vex.dialog.alert(value ? 'Successfully destroyed the planet.' : 'Chicken.');
                        if (value) {
                            //self.props.parent.transitionTo('/learner/learn/' + localStorage.getItem('current_course'));
                            location.reload();
                        } else {
                            $('.vex').remove();
                            self.props.parent.transitionTo('/learner/class/' + localStorage.getItem('current_class'));
                        }
                    }
                });
                return;
            } else {
                this.setState({currentLO: res.lo});

                ActivityActionCreator.saveAcitivity(XDD_VERBS['attempted'], getLearningObj(res.lo), {});
            }
        }
    }

    _unescapeHTML(html) {
        var escapeEl = document.createElement('textarea');
        escapeEl.innerHTML = html;
        return escapeEl.textContent;
    }

    arraysEqual(a, b) {

        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        a.sort();
        b.sort();

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    /*
     * qtype: 1 multichoice 2 yes/no 3 comment
     * qindex: question index
     * choice: selected choice
     * correct: answer for question
     */

    _onChooseAnswer(qtype, qindex, choice, correct, q) {
        var result = {"success": false};
        var correct = $.map(correct, function (value) {
            return [value];
        });

        if (qtype == "1") {
            choice = choice + "";
            var choices = this.state.userAnwser[qindex - 1].choices;
            var selected = false;
            for (var i = choices.length - 1; i >= 0; i--) {
                if (choices[i] == choice) {
                    selected = true;
                    choices.splice(i, 1);
                    $("#lo-answer-" + qindex + "-" + choice).removeClass('choice-selected');
                    break;
                }
            }

            if (!selected) {
                choices.push(choice);
                $("#lo-answer-" + qindex + "-" + choice).addClass('choice-selected');
                this.state.userAnwser[qindex - 1].choices = choices;
            }

            if (correct.length > 0) {
                if (correct.length == choices.length) {

                    var equal = this.arraysEqual(correct, choices)
                    if (equal) {
                        this.state.userAnwser[qindex - 1].answer = "1";
                        result = {"success": true};
                    } else {
                        this.state.userAnwser[qindex - 1].answer = "0";
                    }

                    // mark result correct is green, wrong is red
                    this._finishOneQ(qindex, correct, choices);
                }
            }

        } else if (qtype == "2") {

            var answerOri = correct;
            if (choice) choice = choice.toLowerCase();
            if (correct.length > 0) {
                correct = correct[0].toLowerCase();
            }
            var userChoice = [];
            userChoice.push(choice);
            if (choice == correct) {
                this.state.userAnwser[qindex - 1].answer = "1";
                $("#lo-answer-" + qindex).addClass('right-answer');
                result = {"success": true};
            } else {
                this.state.userAnwser[qindex - 1].answer = "0";
                $("#lo-answer-" + qindex).addClass('wrong-answer');
            }


        } else if (qtype == "3") {
            if ($("#textAnswerInput").val()) {
                this.state.userAnwser[qindex - 1].answer = "1";
                $("#lo-answer-" + qindex).addClass('right-answer');
                result = {"success": true};
            } else {
                $("#lo-answer-" + qindex).addClass('wrong-answer');
            }
        }

        ActivityActionCreator.saveAcitivity(XDD_VERBS['answered'], getQuestionObj(this.state.currentLO.id + "-" + qindex, q), result);

    }

    _finishOneQ(qindex, answers, userChoices) {

        for (var i = answers.length - 1; i >= 0; i--) {
            $("#lo-answer-" + qindex + "-" + answers[i]).addClass('right-answer');
        }

        for (var i = userChoices.length - 1; i >= 0; i--) {
            if (answers.indexOf(userChoices[i]) < 0) {
                $("#lo-answer-" + qindex + "-" + userChoices[i]).addClass('wrong-answer');
            }
        }

        $('div[id*="lo-answer-' + qindex + '-"' + ']').each(function (i, el) {
            //It'll be an array of elements
            if (el) {
                $(el).addClass("disabled");
                $(el).attr('disabled', 'disabled');
                $(el).children().attr('disabled', 'disabled');
            }
        });

        var thisNode = this.getDOMNode();
        TweenMax.to($('.right-answer'), 1.0, {scale: 1.05, repeat: 1, yoyo: true});


    }

    _getQuizesComponent(quizs) {

        var quizs_ret = null;
        var self = this;
        if (quizs.length > 0) {

            quizs_ret = quizs.map(function (q, i) {
                i = i + 1;
                var answerComponent = null;
                if (q.qtype == "1") {
                    answerComponent = q.choices.map(function (c, j) {
                        j = j + 1;
                        return (
                            <Col xs={12} className="lo-answer" id={ "lo-answer-" + i + "-" + j }>
                                <div dangerouslySetInnerHTML={{__html: c.content}}
                                     onClick={ self._onChooseAnswer.bind(this, q.qtype, i, j, q.answer, q.question) }/>
                            </Col>
                        );
                    });

                    answerComponent = (
                        <Row style={{padding: 25}}>
                            { answerComponent }
                        </Row>
                    );
                } else if (q.qtype == "2") {
                    answerComponent = (
                        <Row>
                            <Col xs={9} id={ "lo-answer-" + i}>
                                <Radio value='Yes' name="answeryesno"
                                       onClick={ self._onChooseAnswer.bind(this, q.qtype, i, 'yes', q.answer, q.question) }>
                                    Yes
                                </Radio>
                                <Radio value='No' name="answeryesno"
                                       onClick={ self._onChooseAnswer.bind(this, q.qtype, i, 'no', q.answer, q.question) }>
                                    No
                                </Radio>
                            </Col>
                        </Row>);
                } else if (q.qtype == "3") {
                    answerComponent = (
                        <Row>
                            <Col xs={10} className="" id={ "lo-answer-" + i}>
                                <FormControl type='text' id='textAnswerInput' name='comment'
                                       placeholder="Please input your comment here!" className='required'/>
                            </Col>
                            <Col xs={2}>
                                <Button bsStyle='xddgreen'
                                        onClick={ self._onChooseAnswer.bind(this, q.qtype, i, '', q.answer, q.question) }><Entity
                                    entity='confirm'/></Button>
                            </Col>
                        </Row>
                    );

                }

                return (
                    <Panel>
                        <PanelBody>
                            <Row>
                                <Col xs={12}>
                                    <Entity entity="question"/>: {{i}}:
                                    <div dangerouslySetInnerHTML={{__html: q.question}}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} className="lo-answers">
                                    { answerComponent }
                                </Col>
                            </Row>
                        </PanelBody>
                    </Panel>
                );
            });

        }

        return quizs_ret;
    }

    render() {

        this.state.userAnwser = [];
        var lo = null;

        if (this.props.LO) {
            lo = this.props.LO;
            this.state.currentLO = lo;
            this.props.LO = null;
        } else {
            lo = this.state.currentLO;
        }
        var quizs = this._getQuizesComponent(lo.quizs);

        for (var i = 0; i < lo.quizs.length; i++) {
            this.state.userAnwser.push({id: i + 1, qtype: lo.quizs[i].qtype, answer: "0", choices: []});
        }
        return (
            <Grid id="lo-content">
                <Row>
                    <Col xs={12}>
                        <PanelContainer>
                            <Panel>
                                <PanelBody>
                                    <Row>
                                        <Col xs={12} className="lo-content">
                                            <div dangerouslySetInnerHTML={{__html: lo.content}}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            { quizs }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} className="text-center">
                                            <Button bsStyle='xddgreen'
                                                    onClick={ this._onAdapt.bind(this, lo.id, lo.title) }><Entity
                                                entity='continueLO'/></Button>
                                        </Col>
                                    </Row>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
