import React from 'react';
import {withRouter} from 'react-router';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import ClassStore from 'stores/ClassStore';

import TeacherActionCreator from 'actions/TeacherActionCreator';
import TeacherStore from 'stores/TeacherStore'
import ClassActionCreator from 'actions/ClassActionCreator';
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

import {
    Row,
    Col,
    Grid,
    Icon,
    Table,
    Button,
    Form,
    Panel,
    BPanel,
    MenuItem,
    HelpBlock,
    Accordion,
    PanelBody,
    FormGroup,
    FormControl,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class ViewClass extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            currentClass: {},
            menuitems: [],
            classes: [],
            courseThumbs: [],
            selected: null,
            stuCount: 0,
            learner_rows: []
        };
    }

    componentDidMount() {

        setTimeout(function () {
            $('.tablesaw').table();
        }, 500);

        ClassStore.addChangeListener(this._onClassCallBack.bind(this));
        ClassActionCreator.getClassInfo(this.props.router.params.cid);

        ClassActionCreator.getClasses();

        // keep selected classid
        store.set('current_class', this.props.router.params.cid);

    }

    componentWillUnmount() {

        if ($.isFunction(this._onClassCallBack)) {
            ClassStore.removeChangeListener(this._onClassCallBack);
        }

    }

    _onClassCallBack() {

        var payload = ClassStore.getPayload();
        var result = payload.result;
        var self = this;

        if (payload.type == ActionTypes.GET_CLASS_INFO) {

            var courseThumbs = [];
            var courses = [];
            var learners = [];
            var stuCount = 0;
            var learner_rows = [];
            var classInfo = result;

            if (classInfo != null) {
                if (classInfo.retcode == 0) {
                    courses = classInfo.classInfo.courses;
                    if (courses && courses.length > 0) {
                        len = courses.length;
                        if (len > 0) {
                            courseThumbs = courses.map(function (c) {
                                return (
                                    <Col xs={6} sm={3} key={ c.id }>
                                        <PanelContainer>
                                            <Panel>
                                                <PanelBody className='bg-orange thumb'>
                                                    <a href="#" onClick={ self._onEditCourse.bind(self, c.id) }
                                                       id={ c.id }>{ c.title }</a>
                                                </PanelBody>
                                            </Panel>
                                        </PanelContainer>
                                    </Col>
                                );
                            });
                        }
                    }
                    //
                    learners = classInfo.classInfo.learners;
                    stuCount = learners.length;
                    if (stuCount > 0) {
                        learner_rows = learners.map(function (learner) {
                            return (
                                <tr>
                                    <td>{ learner.userId }</td>
                                    <td>1</td>
                                    <td>1 minitue ago</td>
                                    <td>Joint</td>
                                </tr>
                            );
                        });
                    }

                }

                self.setState({courseThumbs: courseThumbs, learner_rows: learner_rows, stuCount: stuCount});

            }

        } else if (payload.type == ActionTypes.GET_CLASSES) {

            var menuitems = null;
            var len = 0;
            var selected = this.props.router.params.cid;
            var self = this;

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

                self.setState({menuitems: menuitems, selected: selected});
            }

        } else if (payload.type == ActionTypes.DELETE_CLASS) {

            if (payload.result.retcode == 0) {
                $(".delete_class_btn").notify('Delete class successfully.', {
                    position: 'bottom', className: "success", autoHideDelay: 7000
                });

                setTimeout(function () {
                    self.props.router.push(self.getPath('/teacher/dashboard'));
                }, 3000);
            } else {
                $(".delete_class_btn").notify(payload.result.message, {
                    position: 'bottom', className: "error", autoHideDelay: 7000
                });
            }
        }

    }

    _onInviteStudent() {

        var $form = $("#inviteForm");

        var param = {};
        $($form.serializeArray()).each(function (i, v) {
            param[v.name] = v.value;
        });

        TeacherStore.addChangeListener(this._onInviteCallBack.bind(this));
        param["cid"] = this.state.currentClass.id;
        TeacherActionCreator.inviteStudent(param);

    }

    _onInviteCallBack() {
        $.notify.defaults({className: "success"});
        $('#inviteForm').notify("Invite student succeeded!", {
            position: 'bottom'
        });
    }

    _onEditCourse(cid) {

        this.props.router.push(this.getPath('teacher/course/edit/' + cid));
    }

    _onCreateCourse() {

        this.props.router.push(this.getPath('teacher/course/new'));
    }

    _onEditClass(cid) {

        this.props.router.push(this.getPath('teacher/class/edit/' + cid));
    }

    _onDeleteClass() {

        ClassActionCreator.deleteClass(this.state.currentClass.id);
    }

    getPath(path) {
        var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {

        var self = this;

        return (
            <Grid>
                <Row>
                    <Col xs={12} sm={10} smCollapseRight className='col-sm-offset-1 padding-col'>
                        <PanelContainer>
                            <Panel>
                                <PanelHeader>
                                    <Grid>
                                        <Row>
                                            <Col xs={12}>
                                                <h3><span id="selected-class-title">{ self.state.selected } </span></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody className="triggerElement">
                                    <Grid>
                                        <Row>
                                            <Col xs={12} sm={12}>
                                                <Accordion>
                                                    <BPanel header={ l20n.ctx.getSync('classHome') }
                                                            eventKey="1">
                                                        <PanelContainer>
                                                            <Panel>
                                                                <PanelHeader className=''>
                                                                    <Grid>
                                                                        <Row>
                                                                            <Col xs={12}>
                                                                                <h4> {  self.state.stuCount }
                                                                                    Student</h4>
                                                                            </Col>
                                                                        </Row>
                                                                    </Grid>
                                                                </PanelHeader>
                                                                <PanelBody>

                                                                    <Row>
                                                                        <Col xs={12}>
                                                                            <Table bordered striped className='tablesaw'
                                                                                   data-mode='stack'>
                                                                                <thead>
                                                                                <tr>
                                                                                    <th><Entity
                                                                                        entity="overviewStuName"/></th>
                                                                                    <th><Entity
                                                                                        entity="overviewQuestionAnswered"/>
                                                                                    </th>
                                                                                    <th><Entity
                                                                                        entity="overviewLastAccess"/>
                                                                                    </th>
                                                                                    <th><Entity entity="overvieStatus"/>
                                                                                    </th>

                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {  self.state.learner_rows }
                                                                                </tbody>
                                                                            </Table>

                                                                        </Col>
                                                                    </Row>

                                                                </PanelBody>
                                                            </Panel>
                                                        </PanelContainer>
                                                    </BPanel>
                                                    <BPanel header={ l20n.ctx.getSync('classCurriculum') } eventKey="2">
                                                        <PanelContainer noOverflow>
                                                            <Panel>
                                                                <PanelHeader>
                                                                    <Grid>
                                                                        <Row>
                                                                            <Col xs={8} sm={3}>
                                                                                <h4><Entity entity="courses"/></h4>
                                                                            </Col>
                                                                        </Row>
                                                                    </Grid>
                                                                </PanelHeader>
                                                                <PanelBody>
                                                                    <Grid>
                                                                        <Row>
                                                                            { self.state.courseThumbs }
                                                                            <Col xs={12} sm={3}>
                                                                                <PanelContainer>
                                                                                    <Panel>
                                                                                        <PanelBody
                                                                                            className='thumb thumbAdd text-center'>
                                                                                            <Button
                                                                                                style={{marginTop: 15}}
                                                                                                bsStyle='xddgreen'
                                                                                                onClick={ self._onCreateCourse.bind(self) }><Entity
                                                                                                entity='addCourse'/></Button>
                                                                                        </PanelBody>
                                                                                    </Panel>
                                                                                </PanelContainer>
                                                                            </Col>
                                                                        </Row>
                                                                    </Grid>
                                                                </PanelBody>
                                                            </Panel>
                                                        </PanelContainer>
                                                    </BPanel>
                                                    <BPanel header={ l20n.ctx.getSync('inviteStudent') } eventKey="3">
                                                        <PanelContainer noOverflow>
                                                            <Panel>
                                                                <PanelBody>
                                                                    <Grid>
                                                                        <Row>
                                                                            <Col xs={12}>
                                                                                <Form horizontal id="inviteForm"
                                                                                      style={{paddingTop: 15}}>
                                                                                    <FormGroup>
                                                                                        <Col xs={12}>
                                                                                            <FormControl type='text'
                                                                                                         name="students"
                                                                                                         id='blockhelp'
                                                                                                         required
                                                                                                         placeholder='Email, Phone number'/>
                                                                                            <HelpBlock><Entity
                                                                                                entity="learnerId"/></HelpBlock>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                    <FormGroup>
                                                                                        <Col xs={12}>
                                                                                            <br/>
                                                                                            <div>
                                                                                                <Button
                                                                                                    bsStyle='xddgreen'
                                                                                                    onClick={ self._onInviteStudent.bind(self) }><Entity
                                                                                                    entity='send'/></Button>
                                                                                            </div>
                                                                                            <br/>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                </Form>
                                                                            </Col>
                                                                        </Row>
                                                                    </Grid>
                                                                </PanelBody>
                                                            </Panel>
                                                        </PanelContainer>
                                                    </BPanel>
                                                    <BPanel header={ l20n.ctx.getSync('classManage') } eventKey="4">
                                                        <PanelContainer noOverflow>
                                                            <Panel>
                                                                <PanelBody>
                                                                    <Grid>
                                                                        <Row style={{paddingTop: 15}}>
                                                                            <Col key='icon-fontello-edit' xs={5} sm={2}
                                                                                 className='text-center cursor-hand'
                                                                                 onClick={ self._onEditClass.bind(self, self.state.currentClass.id) }>
                                                                                <div>
                                                                                    <Icon className={'fg-darkblue'}
                                                                                          style={{fontSize: 48}}
                                                                                          glyph='icon-fontello-edit'/>
                                                                                </div>
                                                                                <div>
                                                                                    <Entity entity="editClassBtn"/>
                                                                                </div>
                                                                            </Col>
                                                                            <Col key='icon-stroke-gap-icons-Delete'
                                                                                 xs={5} sm={2}
                                                                                 className='text-center delete_class_btn cursor-hand'
                                                                                 onClick={ self._onDeleteClass.bind(self) }>
                                                                                <div>
                                                                                    <Icon className={'fg-darkblue'}
                                                                                          style={{fontSize: 48}}
                                                                                          glyph='icon-stroke-gap-icons-Delete'/>
                                                                                </div>
                                                                                <div>
                                                                                    <Entity entity="deleteClass"/>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </Grid>
                                                                </PanelBody>
                                                            </Panel>
                                                        </PanelContainer>
                                                    </BPanel>
                                                </Accordion>
                                            </Col>
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