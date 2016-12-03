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
export default class QQLogin extends React.Component {

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    componentDidMount() {

        UserStore.addChangeListener(this._onSignCallBack.bind(this));

        var code = this.props.router.location.query.code;

        if (code) {

            UserActionCreator.siginWithQQ(code);
        }

    }

    _onSignCallBack() {

        var self = this;
        var payload = UserStore.getPayload();

        if (payload.retcode == 0) {

            ActivityActionCreator.saveAcitivity(XDD_VERBS['signin'], XDD_OBJECTS['signin'], {"success": true});

            if (payload.userType == '1') {

                self.props.router.push('/teacher/dashboard');

            } else if (payload.userType == '0') {
                self.props.router.push('/learner/dashboard');
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
            <MainContainer id='container' className={classes}>
                <Grid>
                    <Row>
                        <Col xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
                            <div>
                                <a>Success!</a>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </MainContainer>
        );
    }
}
