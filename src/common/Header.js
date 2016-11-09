import React from 'react';

import {Link, withRouter} from 'react-router';

import {
    Grid,
    Row,
    Col,
    Navbar,
    Image,
    MainContainer,
} from '@sketchpixy/rubix';


@withRouter
export default class Header extends React.Component {

    logout() {

        removeUserInfo();

        this.transitionTo("/");
    }

    onDashboard() {
        var utype = globals.localStorage.getItem('user_type');

        if (utype == '0') {
            // learner
            this.transitionTo("/learner/dashboard");
        } else if (utype == '1') {
            this.transitionTo("/teacher/dashboard");
        }
    }

    render() {

        var figure = globals.localStorage.getItem('o_charater');
        var nickname = globals.localStorage.getItem('o_nickname');

        var open_type_id = globals.localStorage.getItem('o_openid_type');

        if (!figure || open_type_id == '0') {
            figure = '/imgs/avatars/avatar12.png';
        }

        if (!nickname || open_type_id == '0') {
            nickname = globals.localStorage.getItem('user_name');
        }

        return (
            <MainContainer id='navbar'>
                <Grid>
                    <Row>
                        <Col xs={12} sm={12}>
                            <Navbar id='rubix-nav-header'>
                                <MainContainer fluid>
                                    <Row>
                                        <Col xs={5} sm={2} className='col-sm-offset-1' style={{marginTop: 20}}>
                                            <Image src='/imgs/logo200x200.png' className='marginLeft25' min-width="150"
                                                   alt='xueduoduo'/>
                                        </Col>
                                        <Col xs={1} sm={1} className='logout-btn col-xs-offset-3'
                                             style={{fontSize: 30}}>
                                            <a href="#" onClick={this.onDashboard}>
                                                <span
                                                    className="rubix-icon fontello icon-fontello-home-1 fg-pink"></span>
                                            </a>
                                        </Col>
                                        <Col xs={1} sm={1} className='logout-btn col-sm-offset-3'
                                             style={{marginLeft: 10}}>
                                            <span className="qc_item figure"><img src={ figure } width="30"
                                                                                  height="30"/></span>
                                        </Col>
                                        <Col xs={1} sm={2} className='hidden-xs logout-btn text-align-left'
                                             style={{marginTop: 5}}>
                                            <span className="qc_item nickname">{ nickname }</span>
                                        </Col>
                                        <Col xs={1} sm={1} className="logout-btn text-center-important"
                                             style={{marginTop: 6, marginLeft: 10}}>
                                            <a href="#" onClick={ this.logout }>
                                                <span className="rubix-icon fontello icon-fontello-off-1 fg-pink"/>
                                            </a>
                                        </Col>
                                    </Row>
                                </MainContainer>
                            </Navbar>
                        </Col>
                    </Row>
                </Grid>
            </MainContainer>
        );
    }
}

