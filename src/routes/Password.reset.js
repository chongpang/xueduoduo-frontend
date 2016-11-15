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
    Button,
    PanelBody,
    FormGroup,
    FormControl,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class PasswordReset extends React.Component {

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    resetPassword(e) {
        e.preventDefault();
        e.stopPropagation();

        var token = UserStore.getPayload();
        if ($("#password_reset_form").valid()) {
            UserActionCreator.resetPassword(token.message);
        }

    }

    componentDidMount() {

        UserStore.addChangeListener(this._onResetPasswordCallBack);

        setTimeout(function () {
            var passwordPlaceholder = l20n.ctx.getSync('password');
            var passwordRepeatPlaceholder = l20n.ctx.getSync('repeatPassword');

            $('#password').attr("placeholder", passwordPlaceholder);
            $('#repeat_password').attr("placeholder", passwordRepeatPlaceholder);

            $("#password_reset_form").validate({
                errorClass: "error-font",
                rules: {
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
        }, 1000);

    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onResetPasswordCallBack);
    }

    _onResetPasswordCallBack() {

        var res = UserStore.getPayload();
        if (res.retcode == 0) {
            this.context.router.transitionTo('/signin')
        } else {
            alert(res.message);
        }
    }

    render() {
        return (
            <Grid>
                <Row className='text-center'>
                    <Col xs={4} sm={12} className='col-center'>
                        <NavHeader>
                            <NavBrand>
                                <Img src='/imgs/xdd.png' style={{marginLeft: 15}} alt='xueduoduo' width={240}/>
                            </NavBrand>
                        </NavHeader>
                    </Col>
                </Row>
                <Row style={{marginTop: 35}}>
                    <Col sm={12}>
                        <PanelContainer noControls>
                            <Panel className='bg-hoverblue' style={{marginBottom: -15}}>
                                <PanelHeader>
                                    <Grid>
                                        <Row>
                                            <Col xs={12}>
                                                <div className='text-center' style={{paddingTop: 15}}>
                                                    <h4><Entity entity='resetPassword'/></h4>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </PanelHeader>
                                <PanelBody style={{padding: 0}}>
                                    <div>
                                        <div style={{marginTop: 15, marginBottom: 15}}>
                                            <Form id="password_reset_form" name="password_reset_form">
                                                <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                    <FormControl autoFocus type='password' id='password'
                                                                 placeholder={l20n.ctx.getSync('passwordRequiredLogin')}
                                                                 name="newPassword" className='border-focus-blue'/>
                                                </FormGroup>
                                                <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                    <FormControl type='password' id='repeat_password'
                                                                 placeholder={ l20n.ctx.getSync('repeatPasswordRequired') }
                                                                 name="repeatPassword" className='border-focus-blue'/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Grid>
                                                        <Row>
                                                            <Col xs={12} className='text-center'
                                                                 style={{paddingBottom: 15}}>
                                                                <Button id="signin" type='button' bsStyle='xddgreen'
                                                                        onClick={this.resetPassword}><Entity
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
        );
    }
}
