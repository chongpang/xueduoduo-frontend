import { Link, State, Navigation } from 'react-router';

import classNames from 'classnames';
import Header from 'common/header';
import Footer from 'common/footer';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore'

var Body = React.createClass({
  mixins: [State, Navigation],
  resetPassword: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var token = UserStore.getPayload();
    if($("#password_reset_form").valid()){
        UserActionCreator.resetPassword(token.message);
    }

    //this.transitionTo('/dashboard');
  },
  componentDidMount: function() {

    //$('html.default body').css('background','#499ed7');
    UserStore.addChangeListener(this._onResetPasswordCallBack);

    setTimeout(function() {
        var passwordPlaceholder = translate('password');
        var passwordRepeatPlaceholder = translate('repeatPassword');

        $('#password').attr("placeholder", passwordPlaceholder);
        $('#repeat_password').attr("placeholder", passwordRepeatPlaceholder);

        $("#password_reset_form").validate({
          errorClass:"error-font",
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
                  required: translate('passwordRequiredLogin'),
                  minlength: $.validator.format(translate('passwordMinLen'))
              },
              repeatPassword:{
                  required: $.validator.format(translate('repeatPasswordRequired')),
                  equalTo: translate('repeatPasswordNotSame'),
              }
            }
        });
    }, 1000);

  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onResetPasswordCallBack);
  },
  _onResetPasswordCallBack: function(){

  	var res = UserStore.getPayload();
  	if(res.retcode == 0){
  		this.context.router.transitionTo('/signin')
  	}else{
  		alert(res.message);
  	}
  },
  render: function() {
    var passwordPlaceholder = translate('passwordRequiredLogin');
    var passwordRepeatPlaceholder = translate('repeatPasswordRequired');
    return (
        <Grid>
           <Row className='text-center'>
            <Col xs={4} sm={12} className='col-center'>
              <NavHeader>
                <NavBrand>
                  <Img src='/imgs/xdd.png' style={{ marginLeft:15 }}  alt='xueduoduo' width={240}/>
                </NavBrand>
              </NavHeader>
            </Col>
          </Row>
          <Row style={{marginTop: 35}}>
            <Col sm={12}>
              <PanelContainer noControls>
                <Panel className='bg-hoverblue' style={{ marginBottom:-15}}>
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
                      <div style={{marginTop: 15,marginBottom:15}}>
                        <Form id="password_reset_form" name="password_reset_form">
                          <FormGroup style={{paddingLeft: 25, paddingRight:25 }} >
                              <Input lg autoFocus type='password' id='password'  name="newPassword" className='border-focus-blue' />
                          </FormGroup>
                          <FormGroup style={{paddingLeft: 25, paddingRight:25 }} >
                              <Input lg type='password' id='repeat_password' name="repeatPassword" className='border-focus-blue' />
                          </FormGroup>
                          <FormGroup>
                            <Grid>
                              <Row>
                                <Col xs={12} className='text-center' style={{paddingBottom: 15}} >
                                  <Button id="signin" type='button' bsStyle='xddgreen' onClick={this.resetPassword}><Entity entity='submit'/></Button>
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
});

export default class extends React.Component {
  render() {
    var classes = classNames({
      'container-open': this.props.open
    });

    return (
      <Container id='container' className={classes}>
        <Col xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
          <Body />
        </Col>
      </Container>
    );
  }
}
