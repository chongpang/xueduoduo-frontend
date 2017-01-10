import React from 'react';
import {withRouter} from 'react-router';

import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore'

var store = require('store');

import {
    Row,
    Col,
    Grid,
    Form,
    Radio,
    Panel,
    Image,
    Button,
    FormControl,
    PanelBody,
    FormGroup,
    PanelHeader,
    MainContainer,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class SetUserType extends React.Component {


    componentDidMount() {

        var self = this;

        setTimeout(function () {
            var passwordPlaceholder = l20n.ctx.getSync('password');
            var passwordRepeatPlaceholder = l20n.ctx.getSync('repeatPassword');
            var userNamePlaceholder = l20n.ctx.getSync('userName');

            $('#userid').val(self.props.router.location.query.user)

            $('#password').attr("placeholder", passwordPlaceholder);
            $('#repeat_password').attr("placeholder", passwordRepeatPlaceholder);
            $('#username').attr("placeholder", userNamePlaceholder);

            $("#account_update_form").validate({
                errorClass: "error-font",
                rules: {
                    userName: {
                        required: true,
                        minlength: 5
                    },
                    newPassword: {
                        required: true,
                        minlength: 6
                    },
                    repeatPassword: {
                        required: true,
                        equalTo: "#password"
                    }
                },
                messages: {
                    userName: {
                        required: l20n.ctx.getSync('userNameRequired'),
                        minlength: $.validator.format(l20n.ctx.getSync('userNameMinLen'))
                    },
                    newPassword: {
                        required: l20n.ctx.getSync('passwordRequiredLogin'),
                        minlength: $.validator.format(l20n.ctx.getSync('passwordMinLen'))
                    },
                    repeatPassword: {
                        required: $.validator.format(l20n.ctx.getSync('repeatPasswordRequired')),
                        equalTo: l20n.ctx.getSync('repeatPasswordNotSame'),
                    }
                }
            });
        }, 100);

    }

    _onUserTypeUpdateCallBack() {

        var self = this;
        var payload = UserStore.getPayload();

        if (payload.retcode == 0) {

            store.set("user_type", payload.userType);

            if (payload.userType == '1') {

                self.props.router.push('/teacher/dashboard');

            } else if (payload.userType == '0') {
                self.props.router.push('/learner/dashboard');
            } else if (payload.userType == '2') {
                alert('Parent dashboard is under developing. Thank you !')
            }
        } else {

            $("#user_type_form").notify(l20n.ctx.getSync('updateUTypeError'), {
                position: 'top', className: "error", autoHideDelay: 7000
            });
        }

    }

    _updateUserType( ) {

        UserStore.addChangeListener(this._onUserTypeUpdateCallBack.bind(this));

        UserActionCreator.updateUserType();
    }

    componentWillUnmount() {

        if ($.isFunction(this._onUserTypeUpdateCallBack)) {
            UserStore.removeChangeListener(this._onUserTypeUpdateCallBack);
        }

    }


    render() {
        var self = this;
        return (
            <MainContainer id='container'>
                <Col id="content" xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
                    <Grid>
                        <Row className='text-center'>
                            <Col sm={5} smOffset={3} xs={6} xsOffset={3} collapseLeft collapseRight>
                                <Image src='/imgs/logo.png' className='img-responsive' alt='xueduoduo'/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 35}}>
                            <Col sm={12}>
                                <PanelContainer>
                                    <Panel className='bg-hoverblue'>
                                        <PanelHeader>
                                            <Grid>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='text-center' style={{paddingTop: 15}}>
                                                            <h4><Entity entity='selectUserType'/></h4>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </PanelHeader>
                                        <PanelBody>
                                            <div>
                                                <div style={{marginTop: 15, marginBottom: 15}}>
                                                    <Form id="user_type_form" name="user_type_form">
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <Radio name="userType" value="0">
                                                                <Entity entity='learner'/>
                                                            </Radio>
                                                            <Radio name="userType" value="1">
                                                                <Entity entity='teacher'/>
                                                            </Radio>
                                                            {/*<Radio name="userType" value="2">*/}
                                                                {/*<Entity entity='parent'/>*/}
                                                            {/*</Radio>*/}
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} className='text-center'
                                                                         style={{paddingBottom: 15}}>
                                                                        <Button id="update_utype" type='button'
                                                                                bsStyle='xddgreen'
                                                                                onClick={self._updateUserType.bind(self)}><Entity
                                                                            entity='submit'/></Button>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>
                                                    </Form>
                                                </div>
                                            </div>
                                        </PanelBody>
                                    </Panel>
                                </PanelContainer>
                            </Col>
                        </Row>
                    </Grid>
                </Col>
            </MainContainer>
        );
    }
}
