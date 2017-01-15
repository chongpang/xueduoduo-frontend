import React from 'react';
import classNames from 'classnames';
import {Link, withRouter} from 'react-router';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from '../actions/UserActionCreator';
import UserStore from '../stores/UserStore'
import ActivityActionCreator from '../actions/ActivityActionCreator';
import Message from '../components/Message';

var xGlobal = require('xGlobal');

import {
    Row,
    Col,
    Grid,
    Form,
    Panel,
    Image,
    Button,
    Radio,
    PanelBody,
    FormGroup,
    FormControl,
    PanelHeader,
    MainContainer,
    PanelContainer,

} from '@sketchpixy/rubix';


@withRouter
export default class Login extends React.Component {

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

    signup() {

        if ($('#signup').valid()) {

            UserActionCreator.signup();
        }
    }

    componentDidMount() {

        UserStore.addChangeListener(this._onSignupCallBack.bind(this));

        setTimeout(function () {
            $("#signup").validate({
                errorClass: "error-font",
                rules: {
                    userId: {
                        required: true,
                        minlength: 8
                    },
                    userName: {
                        required: true,
                        minlength: 5
                    },
                    password: {
                        required: true,
                        minlength: 6
                    },
                    repeatPassword: {
                        required: true,
                        equalTo: "#password"
                    },
                    userType:{
                        required: true
                    }
                },
                messages: {
                    userId: {
                        required: l20n.ctx.getSync('useridRequired'),
                        minlength: $.validator.format(l20n.ctx.getSync('useridMinLen'))
                    },
                    userName: {
                        required: l20n.ctx.getSync('userNameRequired'),
                        minlength: $.validator.format(l20n.ctx.getSync('userNameMinLen'))
                    },
                    password: {
                        required: $.validator.format(l20n.ctx.getSync('passwordRequired')),
                        minlength: $.validator.format(l20n.ctx.getSync('passwordMinLen'))
                    },
                    repeatPassword: {
                        required: l20n.ctx.getSync('repeatPasswordRequired'),
                        equalTo: l20n.ctx.getSync('repeatPasswordNotSame')
                    },
                    userType:{
                        required: l20n.ctx.getSync('userTypeRequired'),
                    }
                }
            });

        }, 10);


    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onSignupCallBack);
        $('html').removeClass('authentication');
    }

    _onSignupCallBack(e) {
        var payload = UserStore.getPayload();
        if (payload.retcode == 0) {

            ActivityActionCreator.saveAcitivity(xGlobal.XDD_VERBS['signup'], xGlobal.XDD_OBJECTS['signup'], {"success": true});

            var msg = {};
            msg.header = l20n.ctx.getSync('signupThanks');
            msg.body = l20n.ctx.getSync('signuoConfirmGuide');
            msg.linktext = "";
            msg.link = "";
            msg.className = "alert-success";

            this.setState({signup_ok: true, message: msg});

            $('html').removeClass('authentication');
            $('html.default body').css('background', '#499ed7');

            var self = this;
            setTimeout(function () {
                self.props.router.push('/signin');
            }, 5000);

        } else {
            $("#user_id").notify(payload.message, {
                position: 'top', className: "error", autoHideDelay: 7000
            });
        }
    }

    _onSelect(v) {
        $('#user_type').prop('value', v);
    }

    _handleKeyPress(e) {

        if (e.charCode == 13) {
            this.signup();
        }

    }

    _onCheckFormat(el) {

        // SMS registration not used
        // var v = el.target.value;
        // if (v && v.match(/^(((13[0-9]{1})|159|153)+\d{8})$/)) {
        //     $('#phone_verify').removeClass('hidden');
        //     $('#user_id').val("+86" + v);
        //     $('#phone_verify').show();
        // } else if (v && v.match(/^(090|080|070|050)+\d{8}$/)) {
        //     $('#phone_verify').removeClass('hidden');
        //     $('#user_id').val("+81" + v.substr(1));
        //     $('#phone_verify').show();
        // } else {
        //     $('#phone_verify').hide();
        // }
    }

    _sendSMS() {
        UserActionCreator.sendSMS();
    }

    render() {

        var classes = classNames({
            'container-open': this.props.open
        });

        var body = (
            <MainContainer id='container' className={classes}>
                <Col id="content" xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">

                    <Grid>
                        <Row className='text-center'>
                            <Col sm={5} smOffset={3} xs={6} xsOffset={3} collapseLeft collapseRight>
                                <Image src='/imgs/logo.png' className='img-responsive' alt='xueduoduo'/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 35}}>
                            <Col>
                                <PanelContainer>
                                    <Panel className='bg-hoverblue'>
                                        <PanelHeader>
                                            <Grid>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='text-center' style={{paddingTop: 15}}>
                                                            <h4><Entity entity='signup'/></h4>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </PanelHeader>
                                        <PanelBody>
                                            <div>
                                                <div style={{paddingTop: 15}}>
                                                    <Form id="signup" name="signup">
                                                        <FormGroup bsSize='large'
                                                                   style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='text' name='userId' id='user_id'
                                                                         className='border-focus-blue'
                                                                         onChange={this._onCheckFormat.bind(this)}
                                                                         placeholder='support@xueduoduo.cn'
                                                                         onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup bsSize='large'
                                                                   style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl autoFocus type='text' name='userName'
                                                                         id='user_name'
                                                                         className='border-focus-blue' placeholder='用户名'
                                                                         onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup bsSize='large'
                                                                   style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='password' name='password' id='password'
                                                                         className='border-focus-blue' placeholder='密码'
                                                                         onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup bsSize='large'
                                                                   style={{paddingLeft: 25, paddingRight: 25}}>
                                                            <FormControl type='password' name='repeatPassword'
                                                                         id='repeat_password'
                                                                         className='border-focus-blue'
                                                                         placeholder='请再次输入密码'
                                                                         onKeyPress={this._handleKeyPress.bind(this)}/>
                                                        </FormGroup>
                                                        <FormGroup bsSize='large' id="phone_verify" className="hidden">
                                                            <Grid>
                                                                <Row className="text-left">
                                                                    <Col xs={8} collapseLeft style={{paddingLeft: 25}}>

                                                                        <FormControl type='text' name='verifyCode'
                                                                                     id='verify_code'
                                                                                     className='border-focus-blue'
                                                                                     placeholder='验证码'
                                                                                     onKeyPress={this._handleKeyPress.bind(this)}/>

                                                                    </Col>
                                                                    <Col xs={3} collapseRight style={{paddingLeft: 15}}>
                                                                        <Button type="button" id="send_sms"
                                                                                onClick={this._sendSMS.bind(this)} lg
                                                                                bsStyle='xddblue'>发送</Button>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12} className="text-center">
                                                                        <Radio name="userType" value="0" inline required>
                                                                            <Entity entity='learner'/>
                                                                        </Radio>
                                                                        <Radio name="userType" value="1" inline>
                                                                            <Entity entity='teacher'/>
                                                                        </Radio>
                                                                        <Radio name="userType" value="2" inline disabled>
                                                                            <Entity entity='parent'/>
                                                                        </Radio>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <Button lg type='button' id="signup_btn"
                                                                                bsStyle='blue'
                                                                                block
                                                                                onClick={this.signup}><Entity
                                                                            entity='createAccount'/></Button>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>
                                                    </Form>
                                                </div>
                                                <div className='bg-hoverblue fg-black50 text-center'
                                                     style={{padding: 10}}>
                                                    <div style={{marginTop: 0}}>
                                                        <Entity entity='hasAccount'/><Link
                                                        to='/signin'><Entity
                                                        entity='signin'/></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </PanelBody>
                                    </Panel>
                                </PanelContainer>
                            </Col>
                        </Row>
                        <Row className='text-center'>
                            <Col xs={4} sm={12} className='col-center beian_info'>
                                <a target="_blank" href="http://www.xueduoduo.io/"><Entity
                                    entity='companyName'/></a><br/>
                                <a target="_blank" href="http://www.miibeian.gov.cn/">粤ICP备16072087号</a>
                            </Col>
                        </Row>
                    </Grid>
                </Col>
            </MainContainer>
        );

        if (this.state.signup_ok) {
            return (
                <Message message={ this.state.message }/>
            );
        } else {
            return body;
        }
    }
}

