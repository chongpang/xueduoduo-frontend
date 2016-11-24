import React from 'react';
import {withRouter} from 'react-router';

import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore'

import {
    Row,
    Col,
    Grid,
    MainContainer,

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

        //$('html.default body').css('background','#499ed7');
        UserStore.addChangeListener(this._onUpdateAccountCallBack.bind(this));

        var self = this;

        setTimeout(function () {
            var passwordPlaceholder = l20n.ctx.getSync('password');
            var passwordRepeatPlaceholder = l20n.ctx.getSync('repeatPassword');
            var userNamePlaceholder = l20n.ctx.getSync('userName');

            $('#userid').val(self.context.router.state.location.query.user)

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

        if (e.charCode == 13) {
            this._updateAccount();
        }

    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onUpdateAccountCallBack);
    }

    _onUpdateAccountCallBack() {

        var res = UserStore.getPayload();
        if (res.retcode == 0) {
            this.props.router.push(this.getPath('/learner/joinclass?token=' + res.token));
        } else {
            alert(res.message);
        }
    }

    getPath(path) {
        var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {
        return (
            <MainContainer id='container' className={classes}>
                <Col xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
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
                                                            <h4><Entity entity='updateAccount'/></h4>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </PanelHeader>
                                        <PanelBody style={{padding: 0}}>
                                            <div>
                                                <div style={{marginTop: 15, marginBottom: 15}}>
                                                    <Form id="account_update_form" name="account_update_form">
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <Input lg autoFocus type='text' id='userid' name="userid"
                                                                   className='border-focus-blue' disabled/>
                                                        </FormGroup>
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <Input lg autoFocus type='text' id='username'
                                                                   name="userName" className='border-focus-blue'
                                                                   onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <Input lg autoFocus type='password' id='password'
                                                                   name="password" className='border-focus-blue'
                                                                   onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <Input lg type='password' id='repeat_password'
                                                                   name="repeatPassword" className='border-focus-blue'
                                                                   onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} className='text-center'
                                                                         style={{paddingBottom: 15}}>
                                                                        <Button id="signin" lg type='button'
                                                                                bsStyle='xddgreen'
                                                                                onClick={this._updateAccount.bind(this)}><Entity
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
