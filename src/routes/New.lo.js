import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
import l20n,{Entity} from '@sketchpixy/rubix/lib/L20n';
import LOStore from 'stores/LOStore';

import {
    Row,
    Col,
    Grid,
    Label,
    Table,
    Form,
    Panel,
    MenuItem,
    PanelBody,
    FormGroup,
    FormControl,
    DropdownButton,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';


import LOActionCreator from 'actions/LOActionCreator';

import Quiz from 'components/Quiz';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var store = require('store');

var xGlobal = require('xGlobal');


@withRouter
export default class NewLO extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            showIcon: true
        };
    }

    componentDidMount() {

        // render form
        this.renderCreateLOForm();
    }

    _onLOCallBack() {

        var self = this;

        var payload = LOStore.getPayload();
        var result = payload.result;
        if (payload.type == ActionTypes.CREATE_LO) {
            if (result.retcode == 0) {
                var courseId = store.get('current_course');
                if (courseId) {
                    self.props.router.push('/teacher/course/edit/' + courseId);
                } else {
                    self.props.router.goBack();
                }
            } else {
                alert(result.message);
            }
        }

    }

    handleSelection(itemprops) {
        var value = itemprops.children;
        alert(value);
    }

    componentWillUnmount() {

        if ($.isFunction(this._onLOCallBack)) {
            LOStore.removeChangeListener(this._onLOCallBack);
        }
    }

    renderCreateLOForm() {

        var self = this;

        ReactDOM.render(
            <Form id='form-2' style={{ marginBottom: 30 }}>
                <div id='wizard-2'>
                    <h1><Entity entity="newLOName" /></h1>
                    <div>
                        <Grid>
                            <Row>
                                <Col sm={7} xs={12} collapseLeft xsOnlyCollapseRight>
                                    <FormGroup>
                                        <Entity entity="inputLOName"/>
                                        <FormControl type='text' id='lotitle' name='title'
                                                     className='required'/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Grid>
                    </div>

                    <h1><Entity entity="newLOContent" /></h1>
                    <div>
                        <Grid>
                            <Row>
                                <Col xs={12} sm={12}>
                                    <PanelContainer>
                                        <Panel>
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className='text-left'><Entity
                                                                entity="addLOContent"/></h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <div id='content' name="content"></div>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <PanelContainer>
                                        <Panel>
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className="text-left"><Entity entity="addQuiz"/></h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <Grid id="question-section"></Grid>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <PanelContainer>
                                        <Panel>
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className='text-left'><Entity
                                                                entity="addLODescription"/></h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                          <textarea name="description" className="lo-description">
                                          </textarea>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <PanelContainer>
                                        <Panel>
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className='text-left'><Entity
                                                                entity="selectPrerequists"/>
                                                            </h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <input id="prerequisiteContainer" name="prerequisites"/>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <PanelContainer>
                                        <Panel>
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className='text-left'><Entity
                                                                entity="selectCategory"/></h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <input id="categoryContainer" name="category"/>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <PanelContainer>
                                        <Panel>
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className='text-left'><Entity
                                                                entity="addTag"/></h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <input id="tags" name="tags"/>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <PanelContainer>
                                        <Panel className="panel-min-height">
                                            <PanelHeader>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h3 className='text-left'><Entity
                                                                entity="addLearningLevel"/></h3>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelHeader>
                                            <PanelBody>
                                                <Grid>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <DropdownButton outlined
                                                                            bsStyle="darkorange"
                                                                            dropup
                                                                            title="Select grade"
                                                                            id="select_grade"
                                                                            onSelect={ self.handleSelection.bind(this) }>
                                                                <MenuItem eventKey="1" active>grade
                                                                    1</MenuItem>
                                                                <MenuItem eventKey="2">grade
                                                                    2</MenuItem>
                                                                <MenuItem eventKey="3">grade
                                                                    3</MenuItem>
                                                                <MenuItem eventKey="4">grade
                                                                    4</MenuItem>
                                                                <MenuItem eventKey="5">grade
                                                                    5</MenuItem>
                                                                <MenuItem eventKey="6">grade
                                                                    6</MenuItem>
                                                                <MenuItem eventKey="7">grade
                                                                    7</MenuItem>
                                                                <MenuItem eventKey="8">grade
                                                                    8</MenuItem>
                                                                <MenuItem eventKey="9">grade
                                                                    9</MenuItem>
                                                                <MenuItem eventKey="10">grade
                                                                    10</MenuItem>
                                                                <MenuItem eventKey="11">grade
                                                                    11</MenuItem>
                                                                <MenuItem eventKey="12">grade
                                                                    12</MenuItem>
                                                            </DropdownButton>
                                                            <FormControl type="hidden"
                                                                         name='learningLevel'
                                                                         defaultValue="1"/>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </PanelBody>
                                        </Panel>
                                    </PanelContainer>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                    <h1><Entity entity="newLOConf" /></h1>
                    <div>
                        <div className=''>
                            <h3><Entity entity='createLOConfirm'/></h3>
                            <Table>
                                <tbody>
                                <tr>
                                    <th><Entity entity='LOName'/></th>
                                    <td id='showloname'>A learning Object Name</td>
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
            </Form>,
            document.getElementById('step-form'));

        setTimeout(function () {
            self.loadComponent();
        }, 200);
    }

    loadComponent() {

        var self = this;

        $('#wizard-2').steps({
            onStepChanging: function (event, currentIndex, newIndex) {

                $('#form-2').validate().settings.ignore = ':disabled,:hidden';

                if (currentIndex == 1) {
                    $('#showloname').text($('#lotitle').val());
                    $('#showauthor').text(store.get("user_name"));
                } else {
                    setTimeout(function () {
                        ReactDOM.render(
                            <Quiz quizs={ [] }/>,
                            document.getElementById('question-section')
                        );

                        $('#content').trumbowyg({
                            mobile: false,
                            tablet: false,
                            autogrow: true,
                            dir: $('html').attr('dir')
                        }).trumbowyg('html', '');

                        $("#prerequisiteContainer").tokenInput(xGlobal.API_HOST + '/api/v1/searchlo', {
                            queryParam: "keywords",
                            crossDomain: true,
                            onResult: function (results) {
                                var result = [];
                                for (var i = results.length - 1; i >= 0; i--) {
                                    var tmp = {};
                                    tmp['id'] = results[i].id;
                                    tmp['title'] = results[i].title;
                                    result.push(tmp);
                                }
                                ;
                                return result;
                            },
                            propertyToSearch: 'title',
                            resultsFormatter: function (item) {
                                return "<li>" + item.id + " " + item.title + "</li>";
                            },
                            noResultsText: "No result found."
                        });

                        $("#categoryContainer").tokenInput(xGlobal.API_HOST + '/api/v1/searchlo', {
                            queryParam: "keywords",
                            crossDomain: true,
                            onResult: function (results) {
                                var result = [];
                                for (var i = results.length - 1; i >= 0; i--) {
                                    var tmp = {};
                                    tmp['id'] = results[i].id;
                                    tmp['title'] = results[i].title;
                                    result.push(tmp);
                                }
                                ;
                                return result;
                            },
                            propertyToSearch: 'title',
                            resultsFormatter: function (item) {
                                return "<li>" + item.id + " " + item.title + "</li>";
                            },
                            noResultsText: "No result found."
                        });

                        $("#tags").tokenfield();

                        $('.token-input-dropdown').css('z-index', 700000);
                        $('.token-input-list').css('width', '100%');
                        $('.token-input-list').css('margin-bottom', '15px');
                        $('.token-input-list').css('min-height', '60px');

                    }, 200);
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

                LOStore.addChangeListener(self._onLOCallBack.bind(self));
                LOActionCreator.createLO(store.get('current_course'));
            }
        });

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
                                                <h3><Entity entity='addLO'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody id="step-form">
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}