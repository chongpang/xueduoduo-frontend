import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import LOStore from 'stores/LOStore';

import LOActionCreator from 'actions/LOActionCreator';

import Quiz from 'components/Quiz';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var xGlobal = require('xGlobal');

import {
    Row,
    Col,
    Grid,
    Button,
    Form,
    Panel,
    MenuItem,
    DropdownButton,
    FormControl,
    PanelBody,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class EditLO extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            lo: []
        };
    }

    componentDidMount() {

        var self = this;

        self.renderLOEditControl(self);

        var loid = self.props.router.params.loid;

        LOStore.addChangeListener(self._onLOCallBack.bind(self));

        LOActionCreator.getLOById(loid);

        self._isMounted = true;

        setTimeout(function () {
            self.loadData();
        }, 200);

    }

    _onLOCallBack() {

        var self = this;

        var payload = LOStore.getPayload();
        var result = payload.result;

        if (payload.type == ActionTypes.UPDATE_LO) {
            if (result.retcode == 0) {

                $('#updatelo-btn').notify("Update learning object succeeded!", {
                    position: 'right', className: "success"
                });
            } else {

                $('#updatelo-btn').notify(result.message, {
                    position: 'right', className: "error"
                });
            }
        } else if (payload.type == ActionTypes.SEARCH_LO) {

            if (result.retcode == 0) {
                if (result.los.length == 1) {

                    if (self._isMounted) {
                        self.setState({lo: result.los[0]});

                        self.setContent();
                        self._getLODetails(result.los[0]);

                        // show saved tags
                        var tags = result.los[0].tags;
                        $("#tagsContainer").tokenfield('setTokens', tags);
                        $("#categoryContainer").tokenInput("add", {"id": "1", "title": "Math"});

                        $("#lotitle").val(result.los[0].title);

                    }

                }

            } else {
                alert(result.message);
            }
        } else if (payload.type == ActionTypes.GET_LO_DETAILS) {

            if (result.retcode == 0) {

                $("#prerequistitsContainer").tokenInput("clear");
                for (var i = result.los.length - 1; i >= 0; i--) {
                    $("#prerequistitsContainer").tokenInput("add", {"id": result.los[i].id, "title": result.los[i].title});
                }

            } else {
                alert(result.message);
            }
        }

    }

    handleSelection(v) {


        $('#grade-selected').text(v);

        $(body).click();

        $('input[name=learningLevel]').val(v);


    }

    _getLODetails(lo) {

        LOStore.addChangeListener(this._onLOCallBack.bind(this));

        LOActionCreator.getLODetails(lo.prerequisites);
    }

    componentWillUnmount() {

        if ($.isFunction(this._onLOCallBack)) {
            LOStore.removeChangeListener(this._onLOCallBack);
        }

        this._isMounted = false;

    }

    setContent() {

        var defaultLoContent = "";
        if (this.state.lo) {
            defaultLoContent = this.state.lo.content;
        }

        $('#content').trumbowyg({
            mobile: true,
            tablet: true,
            autogrow: true,
            dir: $('html').attr('dir')
        }).trumbowyg('html', defaultLoContent);

    }

    _onUpdateLO() {
        LOActionCreator.updateLO(this.props.router.params.loid);
    }

    renderLOEditControl(self) {

        ReactDOM.render(
            <Form id='form-edit-lo' style={{paddingTop: 25, marginBottom: 30}}>
                <Grid>
                    <Row>
                        <Col sm={12} xs={12}>
                            <PanelContainer>
                                <Panel>
                                    <PanelHeader>
                                        <Grid>
                                            <Row>
                                                <Col xs={12}>
                                                    <h3 className='text-left'><Entity
                                                        entity='inputLOName'/></h3>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                        <Grid>
                                            <Row>
                                                <Col xs={12}>
                                                    <FormControl type='text' id='lotitle'
                                                                 name='title'
                                                                 className='required'/>
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
                                                        entity="addLOContent"/></h3>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                        <Grid>
                                            <Row>
                                                <Col xs={12}>
                                                    <div id='content' name="content"></div>
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
                                                        entity="addQuiz"/></h3>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                        <Grid id="question-section">
                                            <Quiz quizs={ self.state.lo.quizs || {} }/>

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
                                                        entity="addLODescription"/></h3>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                        <Grid>
                                            <Row>
                                                <Col xs={12}>
                                                                              <textarea name="description"
                                                                                        className="lo-description"
                                                                                        value={ self.state.lo.description || ""}>
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
                                                        entity="selectPrerequists"/></h3>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                        <Grid>
                                            <Row>
                                                <Col xs={12}>
                                                    <input id="prerequistitsContainer" name="prerequisites" />
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
                                                    <input id="categoryContainer" name="category" />
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
                                                    <input id="tagsContainer" name="tags"/>
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
                            <Grid>
                                <Row>
                                    <Col xs={12}>
                                        <h3 className='text-left'><Entity
                                            entity="addLearningLevel"/></h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <DropdownButton outlined bsStyle="darkorange" dropup
                                                        title="Select grade" id="select_grade"
                                                        onSelect={ self.handleSelection.bind(self) }>
                                            <MenuItem eventKey="1" active>grade 1</MenuItem>
                                            <MenuItem eventKey="2">grade 2</MenuItem>
                                            <MenuItem eventKey="3">grade 3</MenuItem>
                                            <MenuItem eventKey="4">grade 4</MenuItem>
                                            <MenuItem eventKey="5">grade 5</MenuItem>
                                            <MenuItem eventKey="6">grade 6</MenuItem>
                                            <MenuItem eventKey="7">grade 7</MenuItem>
                                            <MenuItem eventKey="8">grade 8</MenuItem>
                                            <MenuItem eventKey="9">grade 9</MenuItem>
                                            <MenuItem eventKey="10">grade 10</MenuItem>
                                            <MenuItem eventKey="11">grade 11</MenuItem>
                                            <MenuItem eventKey="12">grade 12</MenuItem>
                                        </DropdownButton>
                                        <FormControl type="hidden" name='learningLevel'
                                                     defaultValue={ self.state.lo.learningLevel || "1" }/>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} className='text-center' style={{paddingTop: 20}}>
                            <Button id="updatelo-btn" bsStyle='xddgreen'
                                    onClick={ self._onUpdateLO.bind(self) }><Entity
                                entity='updateLO'/></Button>
                        </Col>
                    </Row>
                </Grid>
            </Form>
            ,
            document.getElementById('editLOForm')
        );
    }

    loadData() {
        this.setContent();

        $('#tagsContainer').tokenfield();

        $("#prerequistitsContainer").tokenInput(xGlobal.API_HOST + '/api/v1/searchlo', {
                queryParam: "keywords",
                crossDomain: true,
                onResult (results) {
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
                resultsFormatter(item){
                    return "<li>" + item.id + " " + item.title + "</li>";
                },
                noResultsText: "No result found."
            }
        );

        $("#categoryContainer").tokenInput(xGlobal.API_HOST + '/api/v1/searchlo', {
                queryParam: "keywords",
                crossDomain: true,
                onResult (results) {
                    var result = [];
                    //for (var i = results.length - 1; i >= 0; i--) {
                    var tmp = {};
                    tmp['id'] = "1";//results[i].id;
                    tmp['title'] = "Math";//results[i].title;
                    result.push(tmp);
                    //};

                    return result;
                },
                propertyToSearch: 'title',
                resultsFormatter(item){
                    return "<li>" + item.id + " " + item.title + "</li>";
                },
                noResultsText: "No result found."
            }
        );

        $('.token-input-dropdown').css('z-index', 700000);
        $('.token-input-list').css('width', '100%');
        $('.token-input-list').css('margin-bottom', '15px');
        $('.token-input-list').css('min-height', '60px');
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
                                                <h3><Entity entity='editLO'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody className="triggerElement" id="editLOForm">
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
