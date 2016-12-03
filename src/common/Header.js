import React from 'react';

import {withRouter} from 'react-router';

var store = require('store');

import {
    Row,
    Col,
    Grid,
    Image
} from '@sketchpixy/rubix';


@withRouter
export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            figure: "/imgs/avatars/avatar.png"

        }
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    logout() {

        store.clear();

        this.props.router.push("/");
    }

    onDashboard() {
        var utype = store.get('user_type');

        if (utype == '0') {
            // learner
            this.props.router.push("/learner/dashboard");
        } else if (utype == '1') {
            this.props.router.push("/teacher/dashboard");
        }
    }

    componentDidMount() {
        var figure = store.get('o_charater');
        var nickname = store.get('o_nickname');

        var open_type_id = store.get('o_openid_type');

        if (!figure || open_type_id == '0') {
            figure = '/imgs/avatars/avatar.png';
        }

        if (!nickname || open_type_id == '0') {
            nickname = store.get('user_name');
        }

        this.setState({
            figure: figure,
            nickname: nickname
        });
    }

    render() {

        var self = this;

        return (
            <nav>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <Row>
                                <Col xs={5} sm={2} className='col-sm-offset-1' style={{marginTop: 20}}>
                                    <Image src='/imgs/logo200x200.png' alt='xueduoduo'/>
                                </Col>
                                <Col xs={1} sm={1} className='logout-btn col-xs-offset-3'
                                     style={{fontSize: 30}}>
                                    <a href="#" onClick={this.onDashboard.bind(this)}>
                                        <span className="rubix-icon fontello icon-fontello-home-1 fg-pink"></span>
                                    </a>
                                </Col>
                                <Col xs={1} sm={1} className='logout-btn col-sm-offset-3'
                                     style={{marginLeft: 10}}>
                                            <span className="qc_item figure"><img src={ self.state.figure } width="30"
                                                                                  height="30"/></span>
                                </Col>
                                <Col xs={1} sm={2} className='hidden-xs logout-btn text-align-left'
                                     style={{marginTop: 5}}>
                                    <span className="qc_item nickname">{ self.state.nickname }</span>
                                </Col>
                                <Col xs={1} sm={1} className="logout-btn text-center-important"
                                     style={{marginTop: 6, marginLeft: 10}}>
                                    <a href="#" onClick={ self.logout.bind(self) }>
                                        <span className="rubix-icon fontello icon-fontello-off-1 fg-pink"/>
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </nav>
        );
    }
}

