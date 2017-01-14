import React from 'react';
import {withRouter} from 'react-router';
import l20n,{Entity} from '@sketchpixy/rubix/lib/L20n';

import ClassThumb from 'components/Classthumb';
import ClassAction from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import ActivityAction from 'actions/ActivityActionCreator';
import ActivityStore from 'stores/ActivityStore';

import Activities from 'components/Activity'

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

import {
    Row,
    Col,
    Grid,
    Panel,
    BPanel,
    Button,
    FormControl,
    InputGroup,
    PanelBody,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class LearnerDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activities: null,
            classes: [],
            searchResults:[],
            pendingClasses:[]
        };
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    componentDidMount() {

        this._isMounted = true;

        ClassStore.addChangeListener(this._onClassCallBack.bind(this));
        ClassAction.getClasses();

        ActivityStore.addChangeListener(this._onActivityCallBack.bind(this));

        setTimeout(function () {
            ActivityAction.getActivities();
        }, 100);
    }

    componentWillUnmount() {

        ClassStore.removeChangeListener(this._onClassCallBack);

        ClassStore.removeChangeListener(this._onSearchClassCallBack);

        this._isMounted = false;

    }

    _onActivityCallBack() {

        var result = ActivityStore.getPayload().result;
        if (result.retcode == 0) {

            var activities = React.createElement(Activities, {statements: result.Statements});

            if (this._isMounted) {

                this.setState({activities: activities});

            }

        }
    }

    _onClassCallBack() {

        var self = this;

        var payload = ClassStore.getPayload();

        var result = payload.result;
        if (payload.type == ActionTypes.GET_CLASSES) {
            if (result.retcode == 0) {

                if (self._isMounted) {
                    self.setState({classes: result.classes, pendingClasses: result.pendingClasses});
                }
            } else {
                alert(result.message);
            }

        }
    }

    removeJointClass( searchResults){

        // remove duplicated class from search results
        var mergeArray = JSON.parse(JSON.stringify(this.state.classes));
        mergeArray = $.merge(mergeArray, this.state.pendingClasses);

        for(var i = 0; i < mergeArray.length; i++){
            for(var j = 0; j < searchResults.length; j++ ){

                if(mergeArray[i].id == searchResults[j].id){
                    searchResults.splice(j, 1);
                    break;
                }
            }
        }

        return searchResults;
    }

    _onSearchClassCallBack() {

        var self = this;

        var payload = ClassStore.getPayload();

        var result = payload.result;
        if (payload.type == ActionTypes.SEARCH_CLASS) {
            if (result.retcode == 0) {

                if (self._isMounted) {
                    self.setState({searchResults: self.removeJointClass(result.classes)});
                }
            } else {

                //alert(result.message);
                $("#searchClassInput").notify(result.message,{
                    position:'bottom', className: "error" ,autoHideDelay: 5000});
            }

        }
    }

    _onSearchClass(){

        ClassStore.addChangeListener(this._onSearchClassCallBack.bind(this));
        ClassAction.searchClass($("#searchClassInput").val());
    }

    _onApplyClass( cid ) {

        var self = this;

        var searchResults =  self.state.searchResults;
        var pendingClass = self.state.pendingClasses;
        var cName = "";

        //remove from search result add to waiting list
        for(var i= searchResults.length -1; i>=0; i--){

            var id = searchResults[i].id;
            if(id == cid){
                cName = searchResults[i].title;
                pendingClass.push(searchResults[i]);
                searchResults.splice(i, 1);

                if( self._isMounted){
                    self.setState({searchResults: searchResults , pendingClasses: pendingClass});
                }

                vex.defaultOptions.className = 'vex-theme-default';
                vex.dialog.alert($.validator.format(l20n.ctx.getSync('applySucceeded'), cName));

                return;
            }
        }
    }

    render() {
        var self = this;

        return (
            <Grid>
                <Row>
                    <Col xs={12} sm={6} className='col-sm-offset-1 padding-col' style={{padding: 10}}>
                        <PanelContainer>
                            <PanelHeader>
                                <Grid>
                                    <Row>
                                        <Col xs={12}>
                                            <h3><span></span></h3>
                                        </Col>
                                    </Row>
                                </Grid>
                            </PanelHeader>
                            <Panel>
                                <PanelBody className="triggerElement">
                                    <Grid>
                                        <BPanel>
                                            <Row>
                                                <Col xs={12}>
                                                    <h4><Entity entity="myclasses"/></h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                     <ClassThumb classes={ self.state.classes} flag="0"/>
                                                </Col>
                                            </Row>
                                        </BPanel>
                                        <BPanel>
                                            <Row>
                                                <Col xs={12}>
                                                    <h4><Entity entity="applying"/></h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <ClassThumb classes={ self.state.pendingClasses} flag="2" />
                                                </Col>
                                            </Row>
                                        </BPanel>
                                        <BPanel>
                                            <Row>
                                                <Col xs={11}>
                                                    <InputGroup style={{ paddingLeft: 25 }}>
                                                        <FormControl id='searchClassInput' type="text"
                                                                     placeholder='Class name, teacher name here ...'
                                                        />
                                                        <InputGroup.Button>
                                                            <Button bsStyle='xddgreen'
                                                                    onClick={ self._onSearchClass.bind(self) }>
                                                                <Entity entity="searchClass"/></Button>
                                                        </InputGroup.Button>
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} style={{paddingTop: 15}}>
                                                    <ClassThumb classes={ self.state.searchResults} flag="1" onApplyClass={ self._onApplyClass.bind(self) }/>
                                                </Col>
                                            </Row>
                                        </BPanel>
                                    </Grid>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                    <Col xs={12} sm={4} className='padding-col'>
                        <PanelContainer>
                            <Panel>
                                <PanelHeader>
                                    <Grid>
                                        <Row>
                                            <Col xs={12}>
                                                <h3><Entity entity='activities'/></h3>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                { this.state.activities }
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
