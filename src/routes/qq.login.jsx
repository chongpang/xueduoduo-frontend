import { Link, State, Navigation } from 'react-router';

import React from 'react';
import classNames from 'classnames';


import UserActionCreator from 'actions/UserActionCreator';
import ActivityActionCreator from 'actions/ActivityActionCreator';
import UserStore from 'stores/UserStore';

var Api = require('services/Api');


var Body = React.createClass({

  mixins: [State, Navigation],

  componentDidMount: function() {

  	UserStore.addChangeListener(this._onSignCallBack);

  	var code = this.context.router.state.location.query.code;

  	if(code){

		  UserActionCreator.siginWithQQ(code);
  	}

  },
   
  _onSignCallBack: function(){
    var payload = UserStore.getPayload();

    if(payload.retcode ==  0){
      
      ActivityActionCreator.saveAcitivity(XDD_VERBS['signin'], XDD_OBJECTS['signin'], {"success": true});
    
      if(payload.userType == '1'){

        this.transitionTo('/teacher/dashboard'); 

      }else if(payload.userType == '0'){
          this.transitionTo('/learner/dashboard')
      }else if(payload.userType == '2'){
          alert('Parent dashboard is under developing. Thank you !')
      }   

    }else{

      $("#user_id").notify(payload.message,{
        position:'top', className: "error" ,autoHideDelay: 7000
      });      
    }
  },

  componentWillUnmount: function() {

  },

  render: function() {
    return (
      <div>
      	<a>Success!</a>
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

