import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';


import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';
import ClassActionCreator from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import CourseThumb from 'components/Coursethumb';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

import {
    Row,
    Col,
    Grid,
    Table,
    Form,
    Panel,
    Checkbox,
    PanelBody,
    FormGroup,
    FormControl,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

var store = require("store");

@withRouter
export default class NewClass extends React.Component {
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
            checkedCourseIds: [],
            courses: []
        };
    }

    componentDidMount() {

        var self = this;

        self.renderNewClassForm();

        setTimeout(function () {

            self.loadComponent();

        }, 200);

    }

    _onCourseCallBack() {

        var payload = CourseStore.getPayload();
        var result = payload.result;
        var self = this;

        if (payload.type == ActionTypes.SEARCH_COURSE) {
            if (result.retcode == 0) {
                ReactDOM.render(
                    <CourseThumb
                        parent={ self }
                        courses={ result.courses}
                        allowAdd={ false }
                        allowCheck={ true }/>,
                    document.getElementById('courses_holder')
                );
            } else {
                alert(result.message);
            }
        }

    }

    _onClassCallBack() {
        var payload = ClassStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.CREATE_CLASS) {
            if (result.retcode == 0) {
                this.props.router.push('/teacher/dashboard');
            } else {
                alert(result.message);
            }
        }
    }

    _onCheckAll() {

        var self = this;
        if (!$('#select-all-course').is(':checked')) {
            $('#select-all-course').prop('checked', false);

            $('.checkbox-course input').prop('checked', false);
            $('.checkbox-course').val('');
            self.state.checkAll = false;
        } else {
            $('#select-all-course').prop('checked', true);

            $('.checkbox-course input').prop('checked', true);

            self.state.checkAll = true;
        }
    }

    componentWillUnmount() {

        if ($.isFunction(this._onCourseCallBack)) {
            CourseStore.removeChangeListener(this._onCourseCallBack);
        }
        if ($.isFunction(this._onClassCallBack)) {
            CourseStore.removeChangeListener(this._onClassCallBack);
        }
    }

    renderNewClassForm() {

        ReactDOM.render(
            <Form id='form-2'>
                <div id='wizard-2'>
                    <h1><Entity entity="className" /></h1>
                    <div>
                        <Grid>
                            <Row>
                                <Col sm={7} xs={12} collapseLeft xsOnlyCollapseRight>
                                    <FormGroup>
                                        <Entity entity="inputClassName" />
                                        <FormControl type='text' id='classtitle' name='title' className='required'/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Grid>
                    </div>

                    <h1><Entity entity="selectCourses" /></h1>
                    <div>
                        <div className=''>
                            <h4><Entity entity='selectCourse'/></h4>
                            <Checkbox id='select-all-course'> <Entity entity="selectAllCourse" /> </Checkbox>
                            <div id='courses_holder'/>
                        </div>
                    </div>
                    <h1><Entity entity="confirmation" /></h1>
                    <div>
                        <div className=''>
                            <h3><Entity entity='createClasscomfirm'/></h3>
                            <Table>
                                <tbody>
                                <tr>
                                    <th><Entity entity="className" /></th>
                                    <td id='showclassname'>A Class Name</td>
                                </tr>
                                <tr>
                                    <th><Entity entity="courseName" /></th>
                                    <td id='showcoursenames'>Otto</td>
                                </tr>
                                <tr>
                                    <th><Entity entity="author" /></th>
                                    <td id='showauthor'>Otto</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </Form>
            , document.getElementById("createClassForm")
        );

    }

    loadComponent() {
        var self = this;

        $('#wizard-2').steps({
            onStepChanging: function (event, currentIndex, newIndex) {
                $('#form-2').validate().settings.ignore = ':disabled,:hidden';

                if (currentIndex == 0) {
                    // get courses getCourses
                    CourseStore.addChangeListener(self._onCourseCallBack.bind(self));
                    CourseActionCreator.searchCourses('');

                } else if (currentIndex == 1) {

                    var coursesname = "";

                    if (self.state.checkAll) {
                        var payload = CourseStore.getPayload();
                        self.state.checkedCourses = payload.result.courses;
                    }
                    self.state.checkedCourseIds = [];
                    $.each(self.state.checkedCourses, function (index, value) {
                        self.state.checkedCourseIds.push(value.id);
                        coursesname += value.title + " ";
                    });

                    $('#showcoursenames').text(coursesname);
                    $('#showclassname').text($('#classtitle').val());
                    $('#showauthor').text(store.get("user_name"));
                }

                return $('#form-2').valid();
            },
            onFinishing: function (event, currentIndex) {
                $('#form-2').validate().settings.ignore = ':disabled';
                return $('#form-2').valid();
            },
            onFinished: function (event, currentIndex) {
                $("#fakeLoader").fakeLoader({
                    timeToHide: 1000 * 60 * 60,
                    zIndex: 9999999,
                    spinner: "spinner3",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
                    bgColor: "rgba(0, 0, 0, 0.2)" //Hex, RGB or RGBA colors
                });

                ClassStore.addChangeListener(self._onClassCallBack.bind(self));
                ClassActionCreator.createClass(self.state.checkedCourseIds);
            }
        });

        $('#select-all-course').change(function () {
            self._onCheckAll();
        });
    }

    render() {

        return (
            <Grid>
                <Row>
                    <Col sm={10} className='col-sm-offset-1 padding-col'>
                        <PanelContainer>
                            <Panel>
                                <PanelHeader style={{margin: 0}}>
                                    <Grid>
                                        <Row>
                                            <Col xs={12}>
                                                <h3><Entity entity='addClass'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody id="createClassForm">
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}