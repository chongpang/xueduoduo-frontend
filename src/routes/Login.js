import React from 'react';
import classNames from 'classnames';
import {Link, withRouter} from 'react-router';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';

import UserActionCreator from '../actions/UserActionCreator';
import ActivityActionCreator from '../actions/ActivityActionCreator';
import UserStore from '../stores/UserStore'

import {
    Row,
    Col,
    Grid,
    Icon,
    Form,
    Panel,
    Image,
    Button,
    PanelBody,
    FormGroup,
    FormControl,
    InputGroup,
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

        UserStore.addChangeListener(this._onSignCallBack);

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

    getPath(path) {
        var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {

        var classes = classNames({
            'container-open': this.props.open,
        });

        return (
            <MainContainer id='container' className={classes}>
                <Col id="content" xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
                    <Grid>
                        <Row className='text-center'>
                            <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
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
                                                                                      src="http://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_4.png"/></a>
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
                                                        <FormGroup controlId='user_id'>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <InputGroup bsSize='large'>
                                                                            <FormControl autoFocus type='email'
                                                                                         name='userId'
                                                                                         className='border-focus-blue col-sm-12 col-xs-12'
                                                                                         onKeyPress={this._handleKeyPress}
                                                                                         placeholder='support@xueduoduo.cn'/>
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>

                                                        <FormGroup controlId='password'>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <InputGroup bsSize='large'>
                                                                            <FormControl autoFocus type='password'
                                                                                         name='password'
                                                                                         onKeyPress={this._handleKeyPress}
                                                                                         className='border-focus-blue'
                                                                                         placeholder='Password'/>
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>

                                                        <FormGroup style={{paddingBottom: 15}}>
                                                            <Grid>
                                                                <Row>
                                                                    <Col xs={12} sm={12}>
                                                                        <Button outlined lg type='button' id="signin"
                                                                                bsStyle='blue'
                                                                                block onClick={this.signin}><Entity
                                                                            entity='signin'/></Button>
                                                                    </Col>
                                                                </Row>
                                                            </Grid>
                                                        </FormGroup>
                                                    </Form>
                                                </div>
                                                <div className='bg-hoverblue fg-black50 text-center'>
                                                    <div style={{paddingBottom: 30}}>
                                                        <Entity entity='hasnotAccount'/><Link to='/signup'><Entity
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
    }
}

