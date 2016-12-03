import React from 'react';
import {withRouter} from 'react-router';
import l20n from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore';
import Message from 'components/Message';

@withRouter
export default class SignupConfirm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signup_ok: false,
            message: {
                header: "",
                body: "",
                linktext: "",
                link: "",
                className: "alert-success"
            }
        };
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    componentDidMount() {

        UserStore.addChangeListener(this._onSignupConfirmCallBack.bind(this));

        UserActionCreator.confirm(this.props.router.location.query.token);

        this._isMounted = true;

    }

    componentWillUnmount() {

        if ($.isFunction(this._onSignupConfirmCallBack)) {
            UserStore.removeChangeListener(this._onSignupConfirmCallBack);
        }

        this._isMounted = false;
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

        if(this._isMounted){
            this.setState({message: msg});
        }

    }

    render() {
        var msg = React.createElement(Message, {ref: "msg"});
        return (
            <div>
                <Message message={ this.state.message } />
            </div>
        );
    }
}