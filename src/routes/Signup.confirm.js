import React from 'react';
import {withRouter} from 'react-router';
import l20n from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore';
import Message from 'components/Message';

import {
    Row,
    Col,
    Grid,
    MainContainer,

} from '@sketchpixy/rubix';


@withRouter
export default class SignupConfirm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signup_ok: false,
            message: {}
        };
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    getInitialState() {
        return {
            message: {
                header: "",
                body: "",
                linktext: "",
                link: "",
                className: "alert-success"
            }
        }
    }

    componentDidMount() {

        UserStore.addChangeListener(this._onSignupConfirmCallBack).bind(this);

        UserActionCreator.confirm(this.props.router.location.query.token);

    }

    componentWillUnmount() {


        if ($.isFunction(this._onSignupConfirmCallBack)) {
            UserStore.removeChangeListener(this._onSignupConfirmCallBack);
        }
    }

    _onSignupConfirmCallBack() {
        var result = UserStore.getPayload();
        var msg = {};
        if (result && result.retcode == 0) {
            msg.header = l20n.ctx.getSync('congratulate');
            msg.body = l20n.ctx.getSync('accountReady');
            msg.linktext = l20n.ctx.getSync('signin');
            msg.link = "/signin";
            msg.className = "alert-success";

        } else {
            msg.header = "Oops!";
            msg.body = l20n.ctx.getSync('tokenInvalid');
            msg.linktext = "";
            msg.link = "";
            msg.className = "alert-danger";
        }
        this.refs['msg'].setMessage(msg);
    }

    render() {
        var msg = React.createElement(Message, {ref: "msg"});
        return (
            <MainContainer id='container' className={classes}>
                <Grid><Row>
                    <Col xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
                        <div>
                            { msg }
                        </div>
                    </Col>
                </Row>
                </Grid>
            </MainContainer>
        );
    }
}