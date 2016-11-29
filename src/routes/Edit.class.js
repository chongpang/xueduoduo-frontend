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
    Icon,
    Button,
    Form,
    Panel,
    Label,
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
        };
    }

    componentDidMount() {

        var cid = this.props.router.params.cid;

        // keep selected classid
        store.set('current_class', this.props.router.params.cid);

        ClassStore.addChangeListener(this._onClassCallBack.bind(this));
        CourseStore.addChangeListener(this._onCourseCallBack.bind(this));

        ClassActionCreator.getClass(cid);

        setTimeout(function () {
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

        var courses = this.refs['classCourseContainer'].getCourses();
        var ccids = [];
        for (var i = courses.length - 1; i >= 0; i--) {
            ccids.push(courses[i].id);
        }
        ClassActionCreator.updateClass(self.state.currentClass.id, ccids);
    }

    _onAddCourseToClass() {

        this.refs['classCourseContainer']._onCourseChange(1);

        this.refs['searchCourseContainer']._onCourseChange(0);

    }

    _onClassCallBack() {

        var payload = ClassStore.getPayload();

        if (payload.type == ActionTypes.GET_CLASS) {

            this.state.currentClass = payload.result.Class;

            $('#classtitle').val(this.state.currentClass.title);

            this.refs['classCourseContainer'].setCourses(this.state.currentClass.courses);

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

        var payload = CourseStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.GET_COURSES) {
            if (result.retcode == 0) {
                this.refs['classCourseContainer'].setCourses(result.courses);

            } else {
                alert(result.message);
            }
        } else if (payload.type == ActionTypes.SEARCH_COURSE) {
            if (result.retcode == 0) {
                this.refs['searchCourseContainer'].setCourses(result.courses);
            } else {
                alert(result.message);
            }
        }

    }

    componentWillUnmount() {
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

        var classCourseContainer = React.createElement(CourseThumb, {
            ref: 'classCourseContainer',
            courses: [],
            parent: this,
            allowAdd: true,
            allowCheck: false
        });

        var searchCourseContainer = React.createElement(CourseThumb, {
            ref: 'searchCourseContainer',
            course: [],
            parent: this,
            allowAdd: false,
            allowCheck: true
        });

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
                                            <Row>
                                                <Col sm={6} xs={12}>
                                                    <FormGroup>
                                                        <Label htmlFor='classtitle'><Entity entity='className'/>
                                                        </Label>
                                                        <FormControl type='text' id='classtitle' name='title'
                                                                     className='required'/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12} xs={12}>
                                                    <Label><Entity entity='classCourse'/> </Label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12} xs={12}>
                                                    { classCourseContainer }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={2} sm={1}>
                                                    <Button bsStyle='xddgreen' className="update_class_btn"
                                                            onClick={ self._onUpdateClass.bind(self) }><Entity
                                                        entity='updateClass'/></Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={2} style={{paddingTop: 20, paddingBottom: 10}}>
                                                    <Label><Entity entity='selectCourse'/> </Label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={6} xs={12} className="col-sm-offset-3">
                                                    <InputGroup>
                                                        <FormControl type='text' id='searchCoursebtn'
                                                                     placeholder='Enter keywords here ...'/>
                                                        <Button bsStyle='xddgreen'
                                                                onClick={ self._onSearchCourse.bind(self) }>
                                                            <span><Entity entity='searchCourse'/> </span>
                                                            <Icon bundle='fontello' glyph='search'/>
                                                        </Button>
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={7} xs={12}>
                                                    <FormControl id='select-all-course' type="checkbox"/> <Entity
                                                    entity='selectAllCourse'/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12} xs={12}>
                                                    { searchCourseContainer }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={2} sm={1}>
                                                    <Button bsStyle='xddgreen' style={{marginTop: 20, marginBottom: 20}}
                                                            className='add_to_class_btn'
                                                            onClick={ self._onAddCourseToClass.bind(self) }><Entity
                                                        entity='addToClass'/></Button>
                                                </Col>
                                            </Row>
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
