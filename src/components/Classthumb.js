import React from 'react';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import {withRouter} from 'react-router';

import UserStore from 'stores/UserStore';
import UserActionCreator from 'actions/UserActionCreator';


import {
    Row,
    Col,
    Grid,
    Panel,
    Button,
    PanelBody,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class ClassThumb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedClassId: null,
            classes: [],
            flag: 0, // 0 user joint 1 search results,
            currentCID: null,
        };

        this.setClasses.bind(this);
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    onOpenClass(id) {
        this.state.selectedClassId = id;

        var utype = localStorage.getItem('user_type');
        if (utype == "0") {
            this.props.router.push('/learner/class/' + this.state.selectedClassId);

        } else {
            this.props.router.push('/teacher/class/' + this.state.selectedClassId);
        }

    }

    setClasses(classes) {

        this.setState({classes: classes});
    }

    _onApplyClassCallBack(){

        var self = this;

        var payload = UserStore.getPayload();
        if(payload.retcode == 0){

            self.props.onApplyClass(self.state.currentCID);

        }else{

            $("#panel-" + self.state.currentCID ).notify(UserStore.getPayload().message, {
                position: 'bottom', className: "error", autoHideDelay: 7000
            });

            // for testing
            //self.props.onApplyClass(self.state.currentCID);
        }

    }

    _onApplyClass( cid ){

        this.state.currentCID = cid;

        UserStore.addChangeListener(this._onApplyClassCallBack.bind(this));
        UserActionCreator.applyClass(cid);

    }

    componentWillUnmount() {

        UserStore.removeChangeListener(this._onApplyClassCallBack);
    }

    render() {

        if (this.props.classes && this.props.classes.length > 0) {
            this.state.classes = this.props.classes;
        }

        var self = this;

        if( this.props.flag){

            self.state.flag = this.props.flag;
        }

        var classthumb = this.state.classes.map(function (myclass) {

            if (self.state.flag == 1) {
                return (
                    <Col xs={12} sm={4} id={"panel-" + myclass.id}
                         key={"class-" + (new Date().getTime().toString(16) + Math.floor(3000 * Math.random()).toString(16))  }>
                        <PanelContainer>
                            <Panel>
                                <PanelBody className='bg-orange thumb'>
                                    <Grid>
                                        <Row>
                                            <Col xs={12}>
                                                <span id={ myclass.id } href="#">{ myclass.title }</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} className="thumbBody">
                                                <Button
                                                        style={{marginBottom: 5}} inverse
                                                        bsStyle='xddgreen'
                                                        onClick={self._onApplyClass.bind(self, myclass.id)}><Entity
                                                    entity='applyClass'/></Button>{' '}
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                );
            }  else if (self.state.flag == 2) {
                return (
                    <Col xs={12} sm={4}
                         key={"class-" + (new Date().getTime().toString(16) + Math.floor(3000 * Math.random()).toString(16))  }>
                        <PanelContainer>
                            <Panel>
                                <PanelBody className='bg-orange thumb'>
                                    <span id={ myclass.id }>{ myclass.title }</span>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                );
            }  else {
                return (
                    <Col xs={12} sm={4}
                         key={"class-" + (new Date().getTime().toString(16) + Math.floor(3000 * Math.random()).toString(16))  }>
                        <PanelContainer>
                            <Panel>
                                <PanelBody className='bg-orange thumb'>

                                    <a style={{cursor: 'pointer'}} id={ myclass.id } href="#"
                                       onClick={ self.onOpenClass.bind(self, myclass.id) }>{ myclass.title }</a>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                );
            }

        });

        var action = this.props.action;

        return (
            <Grid>
                <Row>
                    { classthumb }
                    { action }
                </Row>
            </Grid>
        );
    }
}
