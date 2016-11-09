import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import ClassStore from 'stores/ClassStore';
import CourseStore from 'stores/CourseStore';

import LearnerStore from 'stores/LearnerStore';
import LearnerActionCreator from 'actions/LearnerActionCreator';
import ClassActionCreator from 'actions/ClassActionCreator';
import ActivityActionCreator from 'actions/ActivityActionCreator';
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;


var Body = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function(){
    return {
      currentClass : null,
      selected_course_id: null,
      selected_course_title: null,
      menuitems: [],
      classes: [],
      courseThumbs: [],
      courseThumbsAll: [],
      selected : null,
      selectedCourse: {}

    }
  },

  componentDidMount: function(){

    ClassStore.addChangeListener(this._onGetClassCallBack);
    ClassActionCreator.getClassInfo(this.context.router.state.params.cid);

    ClassActionCreator.getClasses();

    // keep selected classid
    localStorage.setItem('current_class', this.context.router.state.params.cid);

    hideHeader(190);

  },
  componentWillUnmount: function() {

    if(this._onEnrollCourseCallBack!= null)
      LearnerStore.removeChangeListener(this._onEnrollCourseCallBack);

    if($.isFunction(this._onGetClassCallBack)){
      //CourseStore.removeChangeListener(this._onGetCourseCallBack);
      ClassStore.removeChangeListener(this._onGetClassCallBack);
    }

  },
  _onEnrollCourse: function( cid , ctitle){

    var course = {};
    course.id = cid;
    course.title = ctitle;
    this.state.selectedCourse = course;
    LearnerStore.addChangeListener(this._onEnrollCourseCallBack);
    LearnerActionCreator.enrollCourse(cid);

  },
  _onGetClassCallBack: function(){

    var payload = ClassStore.getPayload();
    var result = payload.result;
    var self =this;
    if(payload.type == ActionTypes.GET_CLASS_INFO){  
      if(result.retcode ==  0 ){

        var courseThumbs = null;
        var courseThumbsAll = null;
        var courses = [];
        var allCourses = [];
        var classInfo = null;
        var self = this;
        var checkID = {};

        classInfo = result;
        if(classInfo != null){
          if(classInfo.retcode == 0){
              courses = classInfo.classInfo.courses;
              if(courses && courses.length > 0){
                  len = courses.length;
                  if (len > 0) {
                    courseThumbs = courses.map(function (c) {
                      checkID[c.id] = true;
                      return (
                            <Col sm={6}>
                              <PanelContainer>
                              <Panel>
                                <PanelBody className='bg-orange classThumb'>
                                  <Grid>
                                    <Row>
                                      <Col xs={12}>
                                          <a id= { c.id } herf="#">{ c.title }</a>         
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col xs= {12} className="thumbBody">
                                          <Button className="start-learn-btn" style={{marginBottom: 5}} outlined bsStyle='xddgreen' onClick={self._onStartLearn.bind(self, c.id)}><Entity entity='learnCourse'/></Button>{' '}
                                      </Col>
                                    </Row>
                                  </Grid>

                                </PanelBody>
                              </Panel>
                              </PanelContainer>
                            </Col>
                      );
                    });
                }
              } 
              allCourses = classInfo.classInfo.allCourses;
              if(allCourses && allCourses.length > 0){
                len = allCourses.length;
                if (len > 0) {
                  courseThumbsAll = allCourses.map(function (c) {
                    if(checkID[c.id]){
                      return null
                    }
                  return (
                        <Col sm={6}>
                          <PanelContainer>
                          <Panel>
                            <PanelBody className='bg-orange classThumb'>
                              <Grid>
                                <Row>
                                  <Col xs= {12}>
                                      <a id={c.id} herf="#">{ c.title }</a>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs= {12} className="thumbBody">
                                      <Button className="enroll-btn" inverse outlined style={{marginBottom: 5}} bsStyle='xddgreen' onClick={self._onEnrollCourse.bind(self, c.id, c.title)}><Entity entity='enrollThisCourse'/></Button>{' '}
                                  </Col>
                                </Row>
                              </Grid>
                            </PanelBody>
                          </Panel>
                          </PanelContainer>
                        </Col>
                  );
                });
                }
              } 
          }

         this.setState({ courseThumbs: courseThumbs, courseThumbsAll: courseThumbsAll});
        }
      }else{
        alert(result.message);
      }
    }else if (payload.type == ActionTypes.GET_CLASSES){

      var menuitems = null;
      var len = 0;
      var selected = this.context.router.state.params.cid;
      var stuCount = 0;
      var self = this;
;
      if(result != null ){
        this.state.classes = result.classes;
        len = result.classes.length;
      }

      if (len > 0) {
        menuitems = result.classes.map(function (myclass) {
          if(selected == myclass.id){
            selected = myclass.title;
            self.state.currentClass = myclass;
          }
          return (
              <MenuItem  id={ myclass.id } href='#'>{ myclass.title }</MenuItem>
          );
        });

        this.setState({menuitems: menuitems, selected: selected});
      }
    }
  },

  _onEnrollCourseCallBack: function(){
    var payload = LearnerStore.getPayload();
    if(payload.retcode==0){
      //this.transitionTo('/learner/class/' + this.context.router.state.params.cid);

      ClassActionCreator.getClassInfo(this.context.router.state.params.cid);

      ClassActionCreator.getClasses();

      ActivityActionCreator.saveAcitivity(XDD_VERBS['attempted'], getCourseObj(this.state.selectedCourse), {});


    }else{
      $(".enroll-btn").notify(payload.message,{
          position:'top', className: "error" ,autoHideDelay: 7000
      }); 
    }
  },

  _onStartLearn: function( cid ,ctitle){
    this.state.selected_course_id = cid;
    this.state.selected_course_title = ctitle;
    
    this.transitionTo('/learner/learn/' + this.state.selected_course_id );

  },

  handleSelection: function(itemprops) {
    // access any property attached to MenuItem child component.
    // ex: itemprops.keyaction === 'another-action' if MenuItem
    // with "Another action" is clicked.
    var cid = itemprops.id;
    for (var i = this.state.classes.length - 1; i >= 0; i--) {
      var id_tmp = this.state.classes[i].id;
      if(id_tmp == cid){
        this.state.currentClass = this.state.classes[i];

        this.transitionTo('/learner/class/' + cid );

        //$('#selected-class-title').text(this.state.currentClass.title );
        //$('.dropdown-menu').css("display","block")
        //break;
      }

    };
  },
  
  render: function() {

    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col xs={12} sm={10} collapseRight className='col-sm-offset-1' style={{padding: 10}}>
              <PanelContainer>
                <PanelHeader>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <h3><span id="selected-class-title">{ this.state.selected } </span></h3>
                      </Col>
                    </Row>
                  </Grid>
                </PanelHeader>
	             <PanelBody className="triggerElement">
	              <Grid>
                  <Row>
                    <Col xs={12}>
                      <h4><Entity entity="jointCourse"/></h4>
                    </Col>
                  </Row>
	                <Row>
	                  <Col xs={12}>
	                  { this.state.courseThumbs }
	                  </Col>
	                </Row>
                   <Row>
                    <Col xs={12}>
                      <h4><Entity entity="allCourse"/></h4>
                    </Col>
                  </Row>
                    <Row>
                    <Col xs={12}>
                    { this.state.courseThumbsAll }
                    </Col>
                  </Row>
	              </Grid>
	            </PanelBody>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
      </Container>
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
        <Header />
        <Body />
        <Footer />
      </Container>
    );
  }
}
