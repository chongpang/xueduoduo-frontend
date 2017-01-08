import React from 'react';
import {withRouter} from 'react-router';

import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore'

import {
    Row,
    Col,
    Grid,
    Form,
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
export default class SignupViaInvite extends React.Component {

    _updateAccount(e) {

        var token = UserStore.getPayload();
        if ($("#account_update_form").valid()) {
            UserActionCreator.updateAccount(token.message);
        }
    }

    componentDidMount() {

        var self = this;
        //$('html.default body').css('background','#499ed7');
        UserStore.addChangeListener(self._onUpdateAccountCallBack.bind(self));

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

    _handleKeyPress(e) {

        var self = this;
        if (e.charCode == 13) {
            self._updateAccount();
        }

    }

    componentWillUnmount() {

        UserStore.removeChangeListener(this._onUpdateAccountCallBack);
    }

    _onUpdateAccountCallBack() {

        var self = this;
        var res = UserStore.getPayload();
        if (res.retcode == 0) {
            self.props.router.push('/learner/joinclass?token=' + res.token);
        } else {
            alert(res.message);
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
                                                            <h4><Entity entity='updateAccount'/></h4>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </PanelHeader>
                                        <PanelBody>
                                            <div>
                                                <div style={{marginTop: 15, marginBottom: 15}}>
                                                    <Form id="account_update_form" name="account_update_form">
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='text' id='userid' name="userid"
                                                                   className='border-focus-blue' disabled/>
                                                        </FormGroup>
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='text' id='username'
                                                                   name="userName" className='border-focus-blue'
                                                                   onKeyPress={self._handleKeyPress.bind(self)}/>
                                                        </FormGroup>
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='password' id='password'
                                                                   name="password" className='border-focus-blue'
                                                                   onKeyPress={self._handleKeyPress.bind(self)}/>
                                                        </FormGroup>
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='password' id='repeat_password'
                                                                   name="repeatPassword" className='border-focus-blue'
                                                                   onKeyPress={self._handleKeyPress.bind(self)}/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} className='text-center'
                                                                         style={{paddingBottom: 15}}>
                                                                        <Button id="signin" lg type='button'
                                                                                bsStyle='xddgreen'
                                                                                onClick={self._updateAccount.bind(self)}><Entity
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
