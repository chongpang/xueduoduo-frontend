import React from 'react';
import {withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import ClassStore from 'stores/ClassStore';

import LearnerStore from 'stores/LearnerStore';
import LearnerActionCreator from 'actions/LearnerActionCreator';
import ClassActionCreator from 'actions/ClassActionCreator';
import ActivityActionCreator from 'actions/ActivityActionCreator';
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;
var store = require('store');

import {
    Row,
    Col,
    Grid,
    Button,
    Panel,
    MenuItem,
    PanelBody,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class LearnerClass extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            currentClass: null,
            selected_course_id: null,
            selected_course_title: null,
            menuitems: [],
            classes: [],
            courseThumbs: [],
            courseThumbsAll: [],
            selected: null,
            selectedCourse: {}
        };
    }

    componentDidMount() {

        ClassStore.addChangeListener(this._onGetClassCallBack.bind(this));
        ClassActionCreator.getClassInfo(this.props.router.params.cid);

        ClassActionCreator.getClasses();

        // keep selected classid
        store.set('current_class', this.props.router.params.cid);

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

        if (this._onEnrollCourseCallBack != null)
            LearnerStore.removeChangeListener(this._onEnrollCourseCallBack);

        if ($.isFunction(this._onGetClassCallBack)) {
            ClassStore.removeChangeListener(this._onGetClassCallBack);
        }

    }

    _onEnrollCourse(cid, ctitle) {

        var course = {};
        course.id = cid;
        course.title = ctitle;
        this.state.selectedCourse = course;
        LearnerStore.addChangeListener(this._onEnrollCourseCallBack.bind(this));
        LearnerActionCreator.enrollCourse(cid);

    }

    _onGetClassCallBack() {

        var payload = ClassStore.getPayload();
        var result = payload.result;
        var self = this;
        if (payload.type == ActionTypes.GET_CLASS_INFO) {
            if (result.retcode == 0) {

                var courseThumbs = null;
                var courseThumbsAll = null;
                var courses = [];
                var allCourses = [];
                var classInfo = null;
                var self = this;
                var checkID = {};

                classInfo = result;
                if (classInfo != null) {
                    if (classInfo.retcode == 0) {
                        courses = classInfo.classInfo.courses;
                        if (courses && courses.length > 0) {
                            len = courses.length;
                            if (len > 0) {
                                courseThumbs = courses.map(function (c) {
                                    checkID[c.id] = true;
                                    return (
                                        <Col sm={6} key={ "course-" + c.id }>
                                            <PanelContainer>
                                                <Panel>
                                                    <PanelBody className='bg-orange classThumb'>
                                                        <Grid>
                                                            <Row>
                                                                <Col xs={12}>
                                                                    <a id={ c.id } href="#">{ c.title }</a>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs={12} className="thumbBody">
                                                                    <Button className="start-learn-btn"
                                                                            style={{marginBottom: 5}} outlined
                                                                            bsStyle='xddgreen'
                                                                            onClick={self._onStartLearn.bind(self, c.id)}><Entity
                                                                        entity='learnCourse'/></Button>{' '}
                                                                </Col>
                                                            </Row>
                                                        </Grid>

                                                    </PanelBody>
                                                </Panel>
                                            </PanelContainer>
                                        </Col>
                                    );
                                });
                            }
                        }
                        allCourses = classInfo.classInfo.allCourses;
                        if (allCourses && allCourses.length > 0) {
                            len = allCourses.length;
                            if (len > 0) {
                                courseThumbsAll = allCourses.map(function (c) {
                                    if (checkID[c.id]) {
                                        return null
                                    }
                                    return (
                                        <Col sm={6} key={ "course-thumb-" + c.id }>
                                            <PanelContainer>
                                                <Panel>
                                                    <PanelBody className='bg-orange classThumb'>
                                                        <Grid>
                                                            <Row>
                                                                <Col xs={12}>
                                                                    <a id={c.id} href="#">{ c.title }</a>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs={12} className="thumbBody">
                                                                    <Button className="enroll-btn" inverse outlined
                                                                            style={{marginBottom: 5}} bsStyle='xddgreen'
                                                                            onClick={self._onEnrollCourse.bind(self, c.id, c.title)}><Entity
                                                                        entity='enrollThisCourse'/></Button>{' '}
                                                                </Col>
                                                            </Row>
                                                        </Grid>
                                                    </PanelBody>
                                                </Panel>
                                            </PanelContainer>
                                        </Col>
                                    );
                                });
                            }
                        }
                    }

                    if (this._isMounted) {
                        this.setState({courseThumbs: courseThumbs, courseThumbsAll: courseThumbsAll});
                    }
                }
            } else {
                alert(result.message);
            }
        } else if (payload.type == ActionTypes.GET_CLASSES) {

            var menuitems = null;
            var len = 0;
            var selected = this.props.router.params.cid;
            var self = this;
            ;
            if (result != null) {
                this.state.classes = result.classes;
                len = result.classes.length;
            }

            if (len > 0) {
                menuitems = result.classes.map(function (myclass) {
                    if (selected == myclass.id) {
                        selected = myclass.title;
                        self.state.currentClass = myclass;
                    }
                    return (
                        <MenuItem id={ myclass.id } href='#'>{ myclass.title }</MenuItem>
                    );
                });

                if (this._isMounted) {
                    this.setState({menuitems: menuitems, selected: selected});
                }

            }
        }
    }

    _onEnrollCourseCallBack() {
        var payload = LearnerStore.getPayload();
        if (payload.retcode == 0) {

            ClassActionCreator.getClassInfo(this.props.router.params.cid);

            ClassActionCreator.getClasses();

            ActivityActionCreator.saveAcitivity(XDD_VERBS['attempted'], getCourseObj(this.state.selectedCourse), {});


        } else {
            $(".enroll-btn").notify(payload.message, {
                position: 'top', className: "error", autoHideDelay: 7000
            });
        }
    }

    _onStartLearn(cid, ctitle) {
        this.state.selected_course_id = cid;
        this.state.selected_course_title = ctitle;

        this.props.router.push(this.getPath('learner/learn/' + this.state.selected_course_id));

    }

    getPath(path) {
        var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {

        return (
            <Grid>
                <Row>
                    <Col xs={12} sm={10} collapseRight className='col-sm-offset-1' style={{padding: 10}}>
                        <PanelContainer>
                            <PanelHeader>
                                <Grid>
                                    <Row>
                                        <Col xs={12}>
                                            <h3><span id="selected-class-title">{ this.state.selected } </span></h3>
                                        </Col>
                                    </Row>
                                </Grid>
                            </PanelHeader>
                            <PanelBody className="triggerElement">
                                <Grid>
                                    <Row>
                                        <Col xs={12}>
                                            <h4><Entity entity="jointCourse"/></h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            { this.state.courseThumbs }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <h4><Entity entity="allCourse"/></h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            { this.state.courseThumbsAll }
                                        </Col>
                                    </Row>
                                </Grid>
                            </PanelBody>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}