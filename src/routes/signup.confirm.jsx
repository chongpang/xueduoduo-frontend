import { Link, State, Navigation } from 'react-router';

import React from 'react';
import classNames from 'classnames';

import UserActionCreator from 'actions/UserActionCreator';
import UserStore from 'stores/UserStore';
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
    //$('html').addClass('authentication');
    UserStore.addChangeListener(this._onSignupConfirmCallBack);

    UserActionCreator.confirm(this.context.router.state.location.query.token);

  },
  componentWillUnmount: function() {


    if($.isFunction(this._onSignupConfirmCallBack)){
        UserStore.removeChangeListener(this._onSignupConfirmCallBack);
    }
  },

  _onSignupConfirmCallBack: function(){
      var result = UserStore.getPayload();
      var msg ={};
      if(result && result.retcode == 0){
        msg.header= translate('congratulate');
        msg.body = translate('accountReady');
        msg.linktext = translate('signin');
        msg.link = "/signin";
        msg.className = "alert-success";

      }else{
        msg.header="Oops!";
        msg.body =translate('tokenInvalid');
        msg.linktext = "";
        msg.link = "";
        msg.className = "alert-danger";
      }  
      this.refs['msg'].setMessage(msg);
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
