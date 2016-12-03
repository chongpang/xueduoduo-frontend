import React from 'react';
import {withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import ClassActionCreator from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';

import CourseThumb from 'components/Coursethumb';

import {
    Row,
    Col,
    Grid,
    Checkbox,
    Button,
    Form,
    Panel,
    BPanel,
    PanelBody,
    FormGroup,
    InputGroup,
    FormControl,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';


var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var store = require('store');


@withRouter
export default class EditClass extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            checkAll: false,
            checkedCourses: [],
            currentClass: {},
            courses: [],
            coursesSearch: []
        };
    }

    componentDidMount() {

        this._isMounted = true;

        var cid = this.props.router.params.cid;

        // keep selected classid
        store.set('current_class', this.props.router.params.cid);

        ClassStore.addChangeListener(this._onClassCallBack.bind(this));
        CourseStore.addChangeListener(this._onCourseCallBack.bind(this));

        setTimeout(function () {
            ClassActionCreator.getClass(cid);
            CourseActionCreator.getCourses(cid);
        }, 200);

        var self = this;
        $('#select-all-los').change(function () {
            self._onCheckAll();
        });
    }

    _onCheckAll() {

        if (!$('#select-all-course').is(':checked')) {
            $('#select-all-course').prop('checked', false);

            $('.checkbox-course').prop('checked', false);
            $('.checkbox-course').val('');
            this.state.checkAll = false;
        } else {
            $('#select-all-course').prop('checked', true);

            $('.checkbox-course').prop('checked', true);

            this.state.checkAll = true;
        }
    }

    _onUpdateClass() {

        var self = this;
        if (!$('#form-class-edit').valid()) {
            return;
        }

        var courses = this.state.courses;
        var ccids = [];
        for (var i = courses.length - 1; i >= 0; i--) {
            ccids.push(courses[i].id);
        }
        ClassActionCreator.updateClass(self.state.currentClass.id, ccids);
    }

    _onAddCourseToClass() {

        var self = this;

        var checkedCourses = self.state.checkedCourses;
        var courses = self.state.courses;
        var coursesSearch = self.state.coursesSearch;

        // add to course
        courses.push.apply(courses, checkedCourses);

        // remove from search result
        for (var i = checkedCourses.length - 1; i >= 0; i--) {
            var cid = checkedCourses[i].id;
            var index = self.getCourseIndex(coursesSearch, cid);
            if (index > -1) {
                coursesSearch.splice(index, 1);
            }
        }

        if (self._isMounted) {
            self.setState({courses: courses, coursesSearch: coursesSearch});
        }

    }

    getCourseIndex(courses, cid) {

        for (var i = courses.length - 1; i >= 0; i--) {
            if (courses[i].id == cid) {
                return i;
            }
        }
    }

    _onClassCallBack() {

        var self = this;

        var payload = ClassStore.getPayload();

        if (payload.type == ActionTypes.GET_CLASS) {

            $('#classtitle').val(payload.result.Class.title);

            if (self._isMounted) {
                self.setState({currentClass: payload.result.Class, courses: payload.result.Class.courses});
            }

        } else if (payload.type == ActionTypes.UPDATE_CLASS) {
            if (payload.result.retcode == 0) {
                $(".update_class_btn").notify('Update class successfully.', {
                    position: 'right', className: "success", autoHideDelay: 7000
                });
            } else {
                $(".update_class_btn").notify(payload.result.message, {
                    position: 'right', className: "error", autoHideDelay: 7000
                });
            }
        }

    }

    _onCourseCallBack() {
        var self = this;

        var payload = CourseStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.GET_COURSES) {
            if (result.retcode == 0) {
                if (self._isMounted) {
                    self.setState({courses: result.courses});
                }

            } else {
                alert(result.message);
            }
        } else if (payload.type == ActionTypes.SEARCH_COURSE) {
            if (result.retcode == 0) {
                if (self._isMounted) {
                    self.setState({coursesSearch: result.courses});
                }
            } else {
                alert(result.message);
            }
        }

    }

    componentWillUnmount() {
        this._isMounted = false;

        if ($.isFunction(this._onClassCallBack)) {
            ClassStore.removeChangeListener(this._onClassCallBack);
        }

        if ($.isFunction(this._onCourseCallBack)) {
            CourseStore.removeChangeListener(this._onCourseCallBack);
        }
    }

    _onSearchCourse() {

        CourseActionCreator.searchCourses($('#searchCoursebtn').val());
    }

    render() {

        var self = this;

        return (
            <Grid>
                <Row>
                    <Col xs={12} sm={10} className='col-sm-offset-1 padding-col'>
                        <PanelContainer>
                            <Panel>
                                <PanelHeader style={{margin: 0}}>
                                    <Grid>
                                        <Row>
                                            <Col xs={12}>
                                                <h3><Entity entity='editClass'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody className="triggerElement">
                                    <Form id='form-class-edit' style={{paddingTop: 25}}>
                                        <Grid>
                                            <BPanel>
                                                <Row>
                                                    <Col sm={6} xs={12}>
                                                        <FormGroup>
                                                            <Entity entity='className'/>
                                                            <FormControl type='text' id='classtitle' name='title'
                                                                         className='required'/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={12} xs={12}>
                                                        <Entity entity='classCourse'/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={12} xs={12}>
                                                        <CourseThumb courses={ self.state.courses }
                                                                     parent={ self }
                                                                     allowAdd={true}
                                                                     allowCheck={false}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={2} sm={1}>
                                                        <Button bsStyle='xddgreen' className="update_class_btn"
                                                                onClick={ self._onUpdateClass.bind(self) }><Entity
                                                            entity='updateClass'/></Button>
                                                    </Col>
                                                </Row>
                                            </BPanel>
                                            <BPanel>
                                                <Row>
                                                    <Col xs={12} sm={2} style={{paddingTop: 20, paddingBottom: 10}}>
                                                        <Entity entity='selectCourse'/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={6} xs={12} className="col-sm-offset-3">
                                                        <InputGroup>
                                                            <FormControl id='searchCoursebtn' type="text"
                                                                         placeholder='Keywords here ...'
                                                            />
                                                            <InputGroup.Button>
                                                                <Button bsStyle='xddgreen'
                                                                        onClick={ self._onSearchCourse.bind(self) }>
                                                                    <Entity entity="searchCourse"/></Button>
                                                            </InputGroup.Button>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={7} xs={12}>
                                                        <Checkbox id='select-all-course'>
                                                            <Entity entity="selectAllCourse"/>
                                                        </Checkbox>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={12} xs={12}>
                                                        <CourseThumb
                                                            courses={ self.state.coursesSearch }
                                                            parent={this}
                                                            allowAdd={false}
                                                            allowCheck={true}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={2} sm={1}>
                                                        <Button bsStyle='xddgreen'
                                                                style={{marginTop: 20, marginBottom: 20}}
                                                                className='add_to_class_btn'
                                                                onClick={ self._onAddCourseToClass.bind(self) }><Entity
                                                            entity='addToClass'/></Button>
                                                    </Col>
                                                </Row>
                                            </BPanel>
                                        </Grid>
                                    </Form>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
