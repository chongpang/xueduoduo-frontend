import { Link, State, Navigation } from 'react-router';
import classNames from 'classnames';
import Header from 'common/header';
import Footer from 'common/footer';

import ClassThumb from 'components/classthumb';
import LoremIpsum from 'global/jsx/loremipsum';
import ClassAction from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

//import LearningObject from 'components/learningobject';
import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';

import LOActionCreator from 'actions/LOActionCreator';
import LOStore from 'stores/LOStore';

import ActivityAction from 'actions/ActivityActionCreator';
import ActivityStore from 'stores/ActivityStore';

import Activities from 'components/activity'

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var LearnerDashboard = React.createClass({

  mixins: [State, Navigation],

  getInitialState: function(){
    return {
      activities: null

    }
  },

  componentDidMount: function() {
    ClassStore.addChangeListener(this._onClassCallBack);
    ClassAction.getClasses();

    ActivityStore.addChangeListener(this._onActivityCallBack);

    setTimeout(function() {
      ActivityAction.getActivities();      
    }, 100);

    hideHeader(190);

    //CourseActionCreator.getCourses();
    //CourseStore.addChangeListener(this._onCourseCallBack);
    //LOStore.addChangeListener(this._onLOCallBack);

  },

  componentWillUnmount: function() {
    //CourseStore.removeChangeListener(this._onCourseCallBack);
    //LOStore.removeChangeListener(this._onLOCallBack);

    ClassStore.removeChangeListener(this._onClassCallBack);
    //$('html').removeClass('authentication');

  },

  _onActivityCallBack: function(){

    var result = ActivityStore.getPayload().result;
    if(result.retcode == 0){

      var activities = React.createElement(Activities,{statements: result.Statements});

      this.setState({activities: activities});

    }
  },

  _onClick: function(e) {

    e.preventDefault();

    e.stopPropagation();

  },

  _onClassCallBack: function(){

    var self = this;

    var payload = ClassStore.getPayload();

    var result = payload.result;
    if(payload.type == ActionTypes.GET_CLASSES){
      if(result.retcode ==  0){

          self.refs['classthumb_ref']._setClasses(result.classes);
           // need refactor!!! why child component can not access transitionTo of parent conment
           //React.render(React.createElement(ClassThumb,{classes: result.classes, parent: this, action: action }), $("#classthumb").get(0));
      }else{
        alert(result.message);
      }

    }
  },

  _onCourseCallBack: function(){
    var payload = CourseStore.getPayload();
    var courses = [];
    if(payload.type == ActionTypes.GET_COURSES){

      if(payload.result.retcode == 0){
        courses = payload.result.courses;

        var menuitems = null;
        var selected = "";
        var startlo = null;

        if (courses && courses.length > 0) {
          selected = courses[0].id; 
          var index = -1;
          menuitems = courses.map(function (mycourse) {
            if(selected == mycourse.id){
              selected = mycourse.title;

              startlo = mycourse.learning_objs;
              if(startlo && startlo.length > 0){
                startlo = startlo[0];

                if(startlo){
                  LOActionCreator.getLOs();
                }
              }

            }
            index++;
            return (
                <MenuItem  href='#' c_index={ index }>{ mycourse.title }</MenuItem>
            );
          });

          React.render( 
            <Dropdown className="padding-topdown">
                <DropdownButton outlined bsStyle='fg-white'>
                  <span className="font-size-dropdown"> {selected}</span><Caret/>
                </DropdownButton>
                <Menu id="menu_item" bsStyle='fg-white' onItemSelect={this._handleSelection}>
                  { menuitems }
                </Menu>
            </Dropdown>, $("#menu_dropdown").get(0));
        }

      }  
    }
  },

  _onLOCallBack:function(){
    /*
    var payload = LOStore.getPayload();
    this.startlo = [];
    if(payload.type == ActionTypes.SEARCH_LO){
      if(payload.result.retcode == 0){
        this.startlo = payload.result;
        React.render(React.createElement(LearningObject,{LO: this.startlo, parent: this }), $("#earning-object").get(0));
      }  
    }*/
  },

  _handleSelection: function(itemprops){
    var value = itemprops.children;

    var cs = CourseStore.getPayload().result.courses;

    if(cs.length > 0){
      var course = cs[itemprops.c_index];

      if(course.start_lo){
        LOActionCreator.getLOs();
      }
    }

    alert(value);
  },

  render: function() {
    var self = this;
    var action = (
      <Col xs={6} sm={3}>
        <PanelContainer>
        <Panel>
          <PanelBody className='classThumb classThumbAdd text-center'>
             <Button style={{marginTop: 25}} bsStyle='xddgreen' onClick={ self._onClick }><Entity entity='joinNewClass'/></Button>
          </PanelBody>
        </Panel>
        </PanelContainer>
      </Col>
      );

    var classthumb = React.createElement(ClassThumb,{ref: 'classthumb_ref', classes: [], parent: this /*,action: action*/});

    return (
      <Container id='body'>
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
      </Container>
    );
  }
});

module.exports = React.createClass ({
  render() {
    var classes = classNames({
      'container-open': this.props.open
    });

    return (
      <Container id='container' className={classes}>
        <Header />
        <LearnerDashboard />
        <Footer />
      </Container>
    );
  }
});
