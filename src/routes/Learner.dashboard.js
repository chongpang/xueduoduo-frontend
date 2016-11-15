import React from 'react';
import {Link, withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import ClassThumb from 'components/Classthumb';
import ClassAction from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import ActivityAction from 'actions/ActivityActionCreator';
import ActivityStore from 'stores/ActivityStore';

import Activities from 'components/Activity'

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

import {
    Row,
    Col,
    Grid,
    Panel,
    PanelBody,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class LearnerDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activities: null
    };
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.goBack();
  }

  componentDidMount() {
    ClassStore.addChangeListener(this._onClassCallBack.bind(this));
    ClassAction.getClasses();

    ActivityStore.addChangeListener(this._onActivityCallBack.bind(this));

    setTimeout(function() {
      ActivityAction.getActivities();      
    }, 100);
  }

  componentWillUnmount() {
    ClassStore.removeChangeListener(this._onClassCallBack);

  }

  _onActivityCallBack(){

    var result = ActivityStore.getPayload().result;
    if(result.retcode == 0){

      var activities = React.createElement(Activities,{statements: result.Statements});

      this.setState({activities: activities});

    }
  }

  _onClassCallBack(){

    var self = this;

    var payload = ClassStore.getPayload();

    var result = payload.result;
    if(payload.type == ActionTypes.GET_CLASSES){
      if(result.retcode ==  0){

          self.refs['classthumb_ref']._setClasses(result.classes);
      }else{
        alert(result.message);
      }

    }
  }


  render() {
    var self = this;

    var classthumb = React.createElement(ClassThumb,{ref: 'classthumb_ref', classes: [], parent: this /*,action: action*/});

    return (
        <Grid>
          <Row>
            <Col xs={12} sm={6} className='col-sm-offset-1 padding-col'>
              <PanelContainer>
                <Panel>
                  <PanelHeader>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h3><Entity entity='myclasses'/></h3>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody id="classthumb" className="triggerElement">
                    { classthumb }
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
            <Col xs={12} sm={4} className='padding-col'>
              <PanelContainer>
                <Panel>
                  <PanelHeader>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h3><Entity entity='activities'/></h3>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  { this.state.activities }
                </Panel>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
    );
  }
}
