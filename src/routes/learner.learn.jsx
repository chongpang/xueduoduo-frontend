import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import CourseStore from 'stores/CourseStore';
import CourseActionCreator from 'actions/CourseActionCreator';

import LearnerStore from 'stores/LearnerStore'
import LearnerActionCreator from 'actions/LearnerActionCreator'

import ActivityActionCreator from 'actions/ActivityActionCreator';

import LearningObject from 'components/learningobject'

var Body = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function(){
    return {
      currentClass : null,
      lo_component: null
    }
  },

  componentDidMount: function(){
  	 
     CourseStore.addChangeListener(this._onCourseCallBack);
  	 var cid = this.context.router.state.params.cid;

  	 setTimeout(function(){
  	 	CourseActionCreator.getCourse(cid);
  	 },100);

    LearnerStore.addChangeListener(this._onStartLearnCallBack);
    LearnerActionCreator.startLearn(cid);

    localStorage.setItem('current_course', this.context.router.state.params.cid);

    hideHeader(190);

  },
  componentWillUnmount: function() {
  	if(this._onCourseCallBack!= null){
  		CourseStore.removeChangeListener(this._onCourseCallBack);
  	}

      if(this._onStartLearnCallBack != null)
      LearnerStore.removeChangeListener(this._onStartLearnCallBack);
  },

  _onStartLearnCallBack: function(){
    var payload = LearnerStore.getStartLO();
    var self = this;
    if(payload.retcode==0){

        var startLO = payload.lo;
        var lo_component = React.createElement(LearningObject, {LO: startLO, parent: self });

        this.setState({lo_component: lo_component});

        ActivityActionCreator.saveAcitivity(XDD_VERBS['attempted'], getLearningObj(startLO), {});
        
    }else{
      $(".start-learn-btn").notify(payload.message,{
          position:'top', className: "error" ,autoHideDelay: 7000
      }); 
    }
  },

  _onCourseCallBack: function(){

     var payload = CourseStore.getPayload();

     if(payload != null ){

        var result = payload.result;
        if(result == null || result.retcode != 0){
          alert(result.messasge);
        }else{
          $("#course-title").html(result.course.title);
        }

     }
  },
  
  render: function() {

    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col xs={12} sm={10} className='col-sm-offset-1 padding-col'>
              <PanelContainer>
                <PanelHeader>
                  <Grid>
                    <Row>
                      <Col xs={12} className='col-sm-offset-5'>
                      		<h3 id="course-title"/>
                      </Col>
                    </Row>
                  </Grid>
                </PanelHeader>
	             <PanelBody className="triggerElement">
                <Grid>
                <Row>
                    { this.state.lo_component }
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
