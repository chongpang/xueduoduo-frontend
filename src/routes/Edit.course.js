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

var store = require('store');

import {
    Row,
    Col,
    Grid,
    Checkbox,
    Button,
    Form,
    Panel,
    Accordion,
    BPanel,
    PanelBody,
    FormGroup,
    InputGroup,
    FormControl,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class EditCourse extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            courseLOs: [],
            searchLOs: [],
            checkedLOs: []

        };
    }

    componentDidMount() {

        var cid = this.props.router.params.cid;

        // keep selected classid
        store.set('current_course', this.props.router.params.cid);

        CourseStore.addChangeListener(this._onCourseCallBack.bind(this));

        LOStore.addChangeListener(this._onLOCallBack.bind(this));

        CourseActionCreator.getCourse(cid);

        LOActionCreator.getLOsByCourse(cid);

        var self = this;
        $('#select-all-los').change(function () {
            self._onCheckAll();
        });

        this._isMounted = true;
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

    _onUpdateCourse() {

        var self = this;
        if (!$('#form-course-edit').valid()) {
            return;
        }

        var los = self.state.courseLOs;
        var loids = [];
        for (var i = los.length - 1; i >= 0; i--) {
            loids.push(los[i].id);
        }

        CourseActionCreator.updateCourse(self.state.course.id, loids);
    }

    getLOIndex(los, loid) {

        for (var i = los.length - 1; i >= 0; i--) {
            if (los[i].id == loid) {
                return i;
            }
        }
    }

    _onAddLOToCourse() {

        var self = this;

        var checkedLos = self.state.checkedLOs;

        var courseLOs = self.state.courseLOs;
        var searchLOs = self.state.searchLOs;

        courseLOs.push.apply(courseLOs, checkedLos);

        for (var i = checkedLos.length - 1; i >= 0; i--) {
            var loid = checkedLos[i].id;
            var index = self.getLOIndex(searchLOs, loid);
            if (index > -1) {
                searchLOs.splice(index, 1);
            }
        }

        self.setState({courseLOs: courseLOs, searchLOs: searchLOs});


    }

    _onCourseCallBack() {

        var payload = CourseStore.getPayload();

        if (payload.type == ActionTypes.GET_COURSE) {

            this.state.course = payload.result.course;

            $('#coursetitle').val(this.state.course.title);

        } else if (payload.type == ActionTypes.UPDATE_COURSE) {
            if (payload.result.retcode == 0) {

                $(".update_course_btn").notify('Update course successfully.', {
                    position: 'right', className: "success", autoHideDelay: 7000
                });
            } else {
                $(".update_course_btn").notify(payload.result.message, {
                    position: 'right', className: "error", autoHideDelay: 7000
                });
            }
        }

    }

    _onLOCallBack() {

        var self = this;

        var payload = LOStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.GET_LO) {
            if (result.retcode == 0) {

                if (self._isMounted) {
                    self.setState({courseLOs: result.los});
                }

            } else {
                $("#coursetitle").notify(result.message, {
                    position: 'top', className: "error", autoHideDelay: 7000
                });
            }
        }

    }
    _onSearchLOCallBack() {

        var self = this;

        var payload = LOStore.getPayload();
        var result = payload.result;

        if (result.retcode == 0) {

            if (self._isMounted) {
                self.setState({searchLOs: result.los});
            }
        } else {
            alert(result.message);
        }


    }
    componentWillUnmount() {

        if ($.isFunction(this._onLOCallBack)) {
            LOStore.removeChangeListener(this._onLOCallBack);
        }

        if ($.isFunction(this._onSearchLOCallBack)) {
            LOStore.removeChangeListener(this._onSearchLOCallBack);
        }

        this._isMounted = false;

    }

    _onSearchLO() {

        LOStore.addChangeListener(this._onSearchLOCallBack.bind(this));
        LOActionCreator.getLOs($('#searchlobtn').val());
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
                                                <h3><Entity entity='editCourse'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody className="triggerElement">
                                    <Form id='form-course-edit' style={{paddingTop: 25, marginBottom: 35}}>
                                        <Grid>
                                            <Accordion>
                                                <BPanel >
                                                    <Row>
                                                        <Col sm={6} xs={12}>
                                                            <FormGroup>
                                                                <Entity entity="courseName"/>
                                                                <FormControl type='text' id='coursetitle' name='title'
                                                                             className='required'/>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={12} xs={12}>
                                                            <Entity entity="courseLos"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={12} xs={12}>
                                                            <LOThumb los={ self.state.courseLOs}
                                                                     parent={ self }
                                                                     allowAdd={ true }
                                                                     allowCheck={ false }/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={2} sm={1}>
                                                            <Button bsStyle='xddgreen' className='update_course_btn'
                                                                    onClick={ self._onUpdateCourse.bind(self) }>
                                                                <Entity entity="updateCourse"/></Button>
                                                        </Col>
                                                    </Row>
                                                </BPanel>
                                                <BPanel>
                                                    <Row>
                                                        <Col xs={12} sm={2} style={{paddingTop: 20, paddingBottom: 10}}>
                                                            <Entity entity="addLO"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={6} xs={12} className="col-sm-offset-3 text-center">
                                                            <InputGroup>
                                                                <FormControl id='searchlobtn' type="text"
                                                                             placeholder='Keywords here ...'
                                                                />
                                                                <InputGroup.Button>
                                                                    <Button bsStyle='xddgreen'
                                                                            onClick={ self._onSearchLO.bind(self) }>
                                                                        <Entity entity="searchlo"/></Button>
                                                                </InputGroup.Button>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={7} xs={12}>
                                                            <Checkbox id='select-all-los'>
                                                                <Entity entity="selectAllLO"/>
                                                            </Checkbox>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={12} xs={12}>
                                                            <LOThumb los={ self.state.searchLOs}
                                                                     parent={ self }
                                                                     allowAdd={ false }
                                                                     allowCheck={ true }/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={2} sm={1}>
                                                            <Button bsStyle='xddgreen'
                                                                    style={{marginTop: 10, marginBottom: 15}}
                                                                    onClick={ self._onAddLOToCourse.bind(self) }>
                                                                <Entity entity="addToCourse"/></Button>
                                                        </Col>
                                                    </Row>
                                                </BPanel>
                                            </Accordion>
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

