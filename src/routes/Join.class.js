import React from 'react';
import {withRouter} from 'react-router';


import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore'
import Message from 'components/Message';
import l20n from '@sketchpixy/rubix/lib/L20n';

var store = require('store');

@withRouter
export default class JoinClass extends React.Component {

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
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

        var token = this.props.router.location.query['token'];
        UserActionCreator.joinClass(token);
        UserStore.addChangeListener(this._onJoinClassCallBack.bind(this));
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onJoinClassCallBack);
        $('html').removeClass('authentication');
    }

    _onJoinClassCallBack() {

        var result = UserStore.getPayload();
        var self = this;
        if (result.retcode == 1) {
            self.props.router.push('signupviainvite', {user: result.userid})
        } else {

            store.clear();

            var msg = {};
            if (result && result.retcode == 0) {
                msg.header = l20n.ctx.getSync('congratulate');
                msg.body = l20n.ctx.getSync('joinSuccess');
                msg.linktext = l20n.ctx.getSync('signin');
                msg.link = "/signin";
                msg.className = "alert-success";

                setTimeout(function () {
                    self.props.router.push(self.getPath('learner/dashboard'));
                }, 5000);

            } else {
                msg.header = "Oops!";
                msg.body = l20n.ctx.getSync('joinError');
                msg.linktext = "";
                msg.link = "";
                msg.className = "alert-danger";
            }
            this.setState({message: msg});
        }
    }


    getPath(path) {
        var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {
        return (
            <div>
                <Message message={ this.state.message } />
            </div>
        );
    }
}