import React from 'react';
import {Link, withRouter} from 'react-router';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from '../actions/UserActionCreator';
import ActivityActionCreator from '../actions/ActivityActionCreator';
import UserStore from '../stores/UserStore'

var store = require('store');
var xGlobal = require('xGlobal');

import {
    Row,
    Col,
    Grid,
    Form,
    Panel,
    Image,
    Button,
    PanelBody,
    FormGroup,
    FormControl,
    PanelHeader,
    MainContainer,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class Login extends React.Component {

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    signin(e) {

        if ($('#signin_form').valid()) {

            UserActionCreator.signin();
        }
    }

    componentDidMount() {

        if(store.get('access_token')){
            if (store.get('user_type') == '1') {
                this.props.router.push('/teacher/dashboard');
            } else if (store.get('user_type') == '0') {
                this.props.router.push('/learner/dashboard');
            } else if (store.get('user_type') == '2') {
                alert('Parent dashboard is under developing. Thank you !')
            }
            return;
        }

        UserStore.addChangeListener(this._onSignCallBack.bind(this));

        setTimeout(function () {
            $("#signin_form").validate({
                errorClass: "error-font",
                rules: {
                    userId: {
                        required: true,
                    },
                    password: {
                        required: true,
                    }
                },
                messages: {
                    userId: {
                        required: l20n.ctx.getSync('useridRequired'),
                    },
                    password: {
                        required: $.validator.format(l20n.ctx.getSync('passwordRequiredLogin')),
                    }
                }
            });

        }, 10);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onSignCallBack);
    }

    _handleKeyPress(e) {

        if (e.charCode == 13) {
            this.signin();
        }

    }

    _onSignCallBack() {
        var payload = UserStore.getPayload();

        if (payload.retcode == 0) {

            ActivityActionCreator.saveAcitivity(xGlobal.XDD_VERBS['signin'], xGlobal.XDD_OBJECTS['signin'], {"success": true});

            if (payload.userType == '1') {
                this.props.router.push('/teacher/dashboard');

            } else if (payload.userType == '0') {

                this.props.router.push('/learner/dashboard');
            } else if (payload.userType == '2') {
                alert('Parent dashboard is under developing. Thank you !')
            }

        } else {
            var message = payload.message;
            if(payload.retcode == -2){
                message = l20n.ctx.getSync('loginError')
            }

            $("#user_id").notify(message, {
                position: 'top', className: "error", autoHideDelay: 7000
            });
        }
    }

    render() {

        return (
            <MainContainer id='container'>
                <Col id="content" xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
                    <Grid>
                        <Row className='text-center'>
                            <Col sm={5} smOffset={3} xs={6} xsOffset={3} collapseLeft collapseRight>
                                <Image src='/imgs/logo.png' className='img-responsive' alt='xueduoduo'/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 15}}>
                            <Col>
                                <PanelContainer>
                                    <Panel className='bg-hoverblue' style={{marginBottom: -15}}>
                                        <PanelHeader>
                                            <Grid>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='text-center' style={{paddingTop: 15}}>
                                                            <h4><Entity entity='signin'/><Entity entity='signinTo'/>
                                                            </h4>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </PanelHeader>
                                        <PanelBody style={{padding: 0}}>
                                            <div className='fg-black50 text-center' style={{padding: 12.5}}>
                                                <Row>
                                                    <Col xs={6} sm={6}>
                                                        <div style={{paddingLeft: 15}}>
                                                            <a href="https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101356780&redirect_uri=http%3A%2F%2Fxueduoduo.cn%2Fqqlogin&scope=get_user_info"
                                                               id="qqLoginBtn"><Image className='img-responsive'
                                                                                      src="/imgs/qq_login_img.png"/></a>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6} sm={6}>
                                                        <div style={{paddingRight: 15}}>
                                                            <a href="https://open.weixin.qq.com/connect/qrconnect?appid=wxc19c3993d315d6b3&redirect_uri=http%3A%2F%2Fwww.xueduoduo.cn%2Fweixinlogin&response_type=code&scope=snsapi_login&state=3d6be0a4035d839573b04816624a415e#wechat_redirect"
                                                               id="wxLoginBtn">
                                                                <Image className='img-responsive'
                                                                       src="/imgs/icon32_wx_button.png"/></a>
                                                        </div>
                                                    </Col>
                                                </Row>

                                            </div>
                                            <div>
                                                <div className='text-center'>
                                                    <Entity entity='signinUseXddAccount'/>
                                                </div>
                                                <div style={{marginTop: 15, marginBottom: 15}}>
                                                    <Form id="signin_form" name="signin_form">
                                                        <FormGroup bsSize='large' controlId='user_id'>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <FormControl autoFocus type='email'
                                                                                     name='userId'
                                                                                     className='border-focus-blue'
                                                                                     onKeyPress={this._handleKeyPress.bind(this)}
                                                                                     placeholder='support@xueduoduo.cn'/>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>

                                                        <FormGroup bsSize='large' controlId='password'>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <FormControl autoFocus type='password'
                                                                                     name='password'
                                                                                     onKeyPress={this._handleKeyPress.bind(this)}
                                                                                     className='border-focus-blue'
                                                                                     placeholder='Password'/>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>

                                                        <FormGroup style={{paddingBottom: 15}}>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <Button lg type='button' id="signin"
                                                                                bsStyle='blue'
                                                                                block
                                                                                onClick={this.signin.bind(this)}><Entity
                                                                            entity='signin'/></Button>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>
                                                    </Form>
                                                </div>
                                                <div className='bg-hoverblue fg-black50 text-center'>
                                                    <div style={{paddingBottom: 30}}>
                                                        <Entity entity='hasnotAccount'/><Link
                                                        to='/signup'><Entity
                                                        entity='signup'/></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </PanelBody>
                                    </Panel>
                                </PanelContainer>
                            </Col>
                        </Row>
                        <Row className='text-center'>
                            <Col xs={12} sm={12} className='text-center beian_info'>
                                <a target="_blank" href="http://www.xueduoduo.io/"><Entity
                                    entity='companyName'/></a><br/>
                                <a target="_blank" href="http://www.miibeian.gov.cn/">粤ICP备16072087号</a>
                            </Col>
                        </Row>
                    </Grid>
                </Col>
            </MainContainer>
        );
    }
}

