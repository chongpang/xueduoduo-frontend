import React from 'react'
    ;
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

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
    Checkbox,
    PanelBody,
    FormControl,
    FormGroup,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

var store = require('store');

@withRouter
export default class NewCourse extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            los: [],
            checkedLOs: [],
        };
    }

    componentDidMount() {

        this._isMounted = true;

        var self = this;

        setTimeout(function () {
            self.renderCreateCourseForm();

            self.loadComponent();

        }, 200);

    }

    _onCourseCallBack() {

        var payload = CourseStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.CREATE_COURSE) {
            if (result.retcode == 0) {
                var classId = store.get('current_class');
                if (classId) {
                    this.props.router.push('/teacher/class/edit/' + classId);
                } else {
                    this.props.router.goBack();
                }

            } else {
                alert(result.message);
            }
        }

    }

    _onLOCallBack() {

        var self = this;

        var payload = LOStore.getPayload();
        var result = payload.result;

        if (payload.type == ActionTypes.SEARCH_LO) {
            if (result.retcode == 0) {

                if (self._isMounted) {

                    ReactDOM.render(
                        <LOThumb
                            los={ result.los }
                            parent={ self }
                            allowAdd={ false }
                            allowCheck={ true }
                        />,
                        document.getElementById('loHolder')
                    );
                }

            } else {
                alert(result.message);
            }
        }

    }

    _onCheckAll() {
        var self = this;

        if (!$('#select-all-los').is(':checked')) {
            $('#select-all-los').prop('checked', false);

            $('.checkbox-lo input').prop('checked', false);
            $('.checkbox-lo input').val('');
            self.state.checkAll = false;
        } else {
            $('#select-all-los').prop('checked', true);

            $('.checkbox-lo input').prop('checked', true);

            self.state.checkAll = true;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

        if ($.isFunction(this._onCourseCallBack)) {
            CourseStore.removeChangeListener(this._onCourseCallBack);
        }

        if ($.isFunction(this._onLOCallBack)) {
            LOStore.removeChangeListener(this._onLOCallBack);
        }
    }

    renderCreateCourseForm() {

        var self = this;

        ReactDOM.render(
            <Form id='form-2'>
                <div id='wizard-2'>
                    <h1><Entity entity="courseName"/></h1>
                    <div>
                        <Grid>
                            <Row>
                                <Col sm={7} xs={12} collapseLeft xsOnlyCollapseRight>
                                    <FormGroup>
                                        <Entity entity="inputCourseName"/>
                                        <FormControl type='text' id='coursetitle' name='title'
                                                     className='required'/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Grid>
                    </div>

                    <h1><Entity entity='selectLOs'/></h1>
                    <div>
                        <div className=''>
                            <h4><Entity entity='selectLO'/></h4>
                            <Grid>
                                <Row>
                                    <Col sm={7} xs={12}>
                                        <Checkbox id='select-all-los'>
                                            <Entity entity="selectAllLO"/>
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Grid>
                            <div id="loHolder"/>
                        </div>
                    </div>
                    <h1><Entity entity='confirmation'/></h1>
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
            ,
            document.getElementById('createCourseForm')
        );
    }

    loadComponent() {

        var self = this;

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
                    $('#showauthor').text(store.get("user_name"));

                } else if (currentIndex == 0) {
                    LOStore.addChangeListener(self._onLOCallBack.bind(self));
                    LOActionCreator.getLOs();
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
                CourseStore.addChangeListener(self._onCourseCallBack.bind(self));
                CourseActionCreator.createCourse(self.state.checkedLOids, store.get('current_class'));
            }
        });

        $('#select-all-los').change(function () {
            self._onCheckAll();
        });

    }

    render() {

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
                                <PanelBody id="createCourseForm">
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}