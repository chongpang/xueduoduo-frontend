import React from 'react';
import {Link, withRouter} from 'react-router';

import CourseStore from 'stores/CourseStore';
import CourseActionCreator from 'actions/CourseActionCreator';

import LearnerStore from 'stores/LearnerStore'
import LearnerActionCreator from 'actions/LearnerActionCreator'

import ActivityActionCreator from 'actions/ActivityActionCreator';

import LearningObject from 'components/Learningobject'

var store = require('store');
var xGlobal = require('xGlobal');


import {
    Row,
    Col,
    Grid,
    Panel,
    PanelBody,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class LearnerDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentClass: null,
            lo_component: null
        };
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    componentDidMount() {

        CourseStore.addChangeListener(this._onCourseCallBack.bind(this));
        var cid = this.props.router.params.cid;

        setTimeout(function () {
            CourseActionCreator.getCourse(cid);
        }, 100);

        LearnerStore.addChangeListener(this._onStartLearnCallBack.bind(this));
        LearnerActionCreator.startLearn(cid);

        store.set('current_course', this.props.router.params.cid);

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;


        if (this._onCourseCallBack != null) {
            CourseStore.removeChangeListener(this._onCourseCallBack);
        }

        if (this._onStartLearnCallBack != null)
            LearnerStore.removeChangeListener(this._onStartLearnCallBack);
    }

    _onStartLearnCallBack() {
        var payload = LearnerStore.getStartLO();
        var self = this;
        if (payload.retcode == 0) {

            var startLO = payload.lo;
            var lo_component = React.createElement(LearningObject, {LO: startLO, parent: self});

            if (self._isMounted) {
                self.setState({lo_component: lo_component});

            }

            ActivityActionCreator.saveAcitivity(xGlobal.XDD_VERBS['attempted'], ActivityActionCreator.getLearningObj(startLO), {});

        } else {
            $(".start-learn-btn").notify(payload.message, {
                position: 'top', className: "error", autoHideDelay: 7000
            });
        }
    }

    _onCourseCallBack() {

        var payload = CourseStore.getPayload();

        if (payload != null) {

            var result = payload.result;
            if (result == null || result.retcode != 0) {
                alert(result.messasge);
            } else {
                $("#course-title").html(result.course.title);
            }

        }
    }

    render() {

        return (
            <Grid>
                <Row>
                    <Col xs={12} sm={10} className='col-sm-offset-1 padding-col'>
                        <PanelContainer>
                            <Panel>
                                <PanelHeader>
                                    <Grid>
                                        <Row>
                                            <Col xs={12} className='col-sm-offset-5'>
                                                <h3 id="course-title"/>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody className="triggerElement">
                                    <Grid>
                                        <Row>
                                            { this.state.lo_component }
                                        </Row>
                                    </Grid>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}