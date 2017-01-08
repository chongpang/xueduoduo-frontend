import React from 'react';
import {withRouter} from 'react-router';


import UserActionCreator from 'actions/UserActionCreator';
import ActivityActionCreator from 'actions/ActivityActionCreator';
import UserStore from 'stores/UserStore';

var Api = require('services/Api');


import {
    Row,
    Col,
    Grid,
    MainContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class WeinxinLogin extends React.Component {

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    componentDidMount() {

        UserStore.addChangeListener(this._onSignCallBack.bing(this));

        var code = this.context.router.state.location.query.code;
        var state = this.context.router.state.location.query.state;

        if (code && state) {

            UserActionCreator.signWithWeixin(code, state);
        }

    }

    _onSignCallBack() {
        var payload = UserStore.getPayload();

        if (payload.retcode == 0) {

            ActivityActionCreator.saveAcitivity(XDD_VERBS['signin'], XDD_OBJECTS['signin'], {"success": true});

            if (payload.userType == '1') {

                this.transitionTo('/teacher/dashboard');

            } else if (payload.userType == '0') {
                this.transitionTo('/learner/dashboard')
            } else if (payload.userType == '2') {
                alert('Parent dashboard is under developing. Thank you !')
            }

        } else {

            $("#user_id").notify(payload.message, {
                position: 'top', className: "error", autoHideDelay: 7000
            });
        }
    }

    render() {
        return (
            <MainContainer id='container'>
                <Col xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">

                    <a>Success!</a>
                </Col>
            </MainContainer>
        );
    }
}

