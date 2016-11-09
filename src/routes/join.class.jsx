import { Link, State ,Navigation, Router} from 'react-router';

import classNames from 'classnames';
import Header from 'common/header';
import Footer from 'common/footer';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore'
import Message from 'components/message';

var Body = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function(){
    return {
      message: {
        header:"",
        body:"",
        linktext:"",
        link:"",
        className:"alert-success"
      }
    }
  },

  componentDidMount: function() {
    //$('html.default body').css('background','#499ed7');

  	var token = this.context.router.state.location.query['token'];
  	UserActionCreator.joinClass(token);
    UserStore.addChangeListener(this._onJoinClassCallBack);
    //$('html').addClass('authentication');
  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onJoinClassCallBack);
    $('html').removeClass('authentication');
  },
  _onJoinClassCallBack: function(){

  	var result = UserStore.getPayload();
    var self = this;
  	if( result.retcode == 1 ){
  		self.context.router.transitionTo('/signupviainvite',{ user: result.userid })
  	}else{

      removeUserInfo();

      var msg ={};
      if(result && result.retcode == 0){
        msg.header= translate('congratulate');
        msg.body = translate('joinSuccess');
        msg.linktext = translate('signin');
        msg.link = "/signin";
        msg.className = "alert-success";

        setTimeout(function() {
          self.context.router.transitionTo('/learner/dashboard')
        }, 5000);

      }else{
        msg.header="Oops!";
        msg.body =translate('joinError');
        msg.linktext = "";
        msg.link = "";
        msg.className = "alert-danger";
      }
      this.refs['msg'].setMessage(msg);
    }
  },

  render: function() {
    var msg = React.createElement(Message,{ref: "msg"} ) ;
    return (
      <div>
        { msg }
      </div>  
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
          <Body/>
        </Col>
      </Container>
    );
  }
}