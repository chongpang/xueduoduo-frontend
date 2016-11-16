import React from 'react';
import {withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';

import LOStore from 'stores/LOStore';

import LOActionCreator from 'actions/LOActionCreator';
import LOThumb from 'components/Lothumb';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;


import {
    Row,
    Col,
    Grid,
    Table,
    Form,
    Panel,
    PanelBody,
    FormGroup,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class NewCourse extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

        CourseStore.addChangeListener(this._onCourseCallBack.bind(this));
        LOStore.addChangeListener(this._onLOCallBack.bind(this));

        LOActionCreator.getLOs();

        var self = this;

        $("#form-2").validate({
            rules: {
                confirm_password: {
                    equalTo: "#password"
                }
            }
        });

        $('#wizard-2').steps({
            onStepChanging: function (event, currentIndex, newIndex) {
                $('#form-2').validate().settings.ignore = ':disabled,:hidden';

                if (currentIndex == 1) {

                    var losnames = "";

                    if (self.state.checkAll) {
                        var payload = LOStore.getPayload();
                        self.state.checkedLOs = payload.result.los;
                    }
                    self.state.checkedLOids = [];
                    $.each(self.state.checkedLOs, function (index, value) {
                        self.state.checkedLOids.push(value.id);
                        losnames += value.title + " ";
                    });

                    $('#showlonames').text(losnames);
                    $('#showcoursename').text($('#coursetitle').val());
                    $('#showauthor').text(storage.get("user_name"));

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
                CourseActionCreator.createCourse(self.state.checkedLOids, localStorage.getItem('current_class'));
            }
        });

        var self = this;
        $('#select-all-los').change(function () {
            self._onCheckAll();
        });

    }

    _onCourseCallBack() {

        var payload = CourseStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.CREATE_COURSE) {
            if (result.retcode == 0) {
                var classId = storage.get('current_class');
                if (classId) {
                    this.props.router.push(this.getPath('teacher/class/edit/' + classId));
                } else {
                    this.props.router.goBack();
                }

            } else {
                alert(result.message);
            }
        }

    }

    _onLOCallBack() {

        var payload = LOStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.SEARCH_LO) {
            if (result.retcode == 0) {
                this.refs['lothumbContainer'].setLos(result.los);

            } else {
                alert(result.message);
            }
        }

    }

    _onCheckAll() {

        if (!$('#select-all-los').is(':checked')) {
            $('#select-all-los').prop('checked', false);

            $('.checkbox-lo').prop('checked', false);
            $('.checkbox-lo').val('');
            this.state.checkAll = false;
        } else {
            $('#select-all-los').prop('checked', true);

            $('.checkbox-lo').prop('checked', true);

            this.state.checkAll = true;
        }
    }

    componentWillUnmount() {
        if ($.isFunction(this._onCourseCallBack)) {
            CourseStore.removeChangeListener(this._onCourseCallBack);
        }

        if ($.isFunction(this._onLOCallBack)) {
            LOStore.removeChangeListener(this._onLOCallBack);
        }
    }

    getPath(path) {
        var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {

        var lothumbContainer = React.createElement(LOThumb, {
            ref: "lothumbContainer",
            los: [],
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
                                                <h3><Entity entity='addCourse'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody>
                                    <Form id='form-2'>
                                        <div id='wizard-2'>
                                            <h1>Name</h1>
                                            <div>
                                                <Grid>
                                                    <Row>
                                                        <Col sm={7} xs={12} collapseLeft xsOnlyCollapseRight>
                                                            <FormGroup>
                                                                <Label htmlFor='coursetitle'><Entity
                                                                    entity='inputCourseName'/> *</Label>
                                                                <Input type='text' id='coursetitle' name='title'
                                                                       className='required'/>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col sm={4} xs={6} collapseRight>
                                                            <p>
                                                                <Entity entity='requiredField'/>
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </div>

                                            <h1>Contents</h1>
                                            <div>
                                                <div className=''>
                                                    <h4><Entity entity='selectLO'/></h4>
                                                    <Grid>
                                                        <Row>
                                                            <Col sm={7} xs={12}>
                                                                <input id='select-all-los' type="checkbox"/> <Entity
                                                                entity='selectAllLO'/>
                                                            </Col>
                                                        </Row>
                                                    </Grid>
                                                    { lothumbContainer }
                                                </div>
                                            </div>
                                            <h1>Confirm</h1>
                                            <div>
                                                <div className=''>
                                                    <h3><Entity entity='createCourseConfirm'/></h3>
                                                    <Table>
                                                        <tbody>
                                                        <tr>
                                                            <th><Entity entity='courseName'/></th>
                                                            <td id='showcoursename'>A Course Name</td>
                                                        </tr>
                                                        <tr>
                                                            <th><Entity entity='losName'/></th>
                                                            <td id='showlonames'>Otto</td>
                                                        </tr>
                                                        <tr>
                                                            <th><Entity entity='author'/></th>
                                                            <td id='showauthor'>Otto</td>
                                                        </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
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