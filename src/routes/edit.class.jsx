import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import ClassActionCreator from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';

import CourseThumb from 'components/coursethumb';


var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;


var Body = React.createClass({
  mixins: [State, Navigation],
  getInitialState: function(){
    return {
      checkAll : false,
      checkedCourses: [],
      currentClass: {},
    }
  },
  componentDidMount: function() {

  	var cid = this.context.router.state.params.cid;

    // keep selected classid
    localStorage.setItem('current_class', this.context.router.state.params.cid);

    ClassStore.addChangeListener(this._onClassCallBack);
    CourseStore.addChangeListener(this._onCourseCallBack);

    ClassActionCreator.getClass( cid );

    setTimeout(function() {
      CourseActionCreator.getCourses(cid);
    }, 200);

    var self = this;
    $('#select-all-los').change(function(){
      self._onCheckAll();
    });

    hideHeader(190);

  },

   _onCheckAll: function(){

   if (!$('#select-all-course').is(':checked')) {
      $('#select-all-course').prop('checked', false);

      $('.checkbox-course').prop('checked', false);
      $('.checkbox-course').val('');
      this.state.checkAll = false;
    } else {
      $('#select-all-course').prop('checked', true);

      $('.checkbox-course').prop('checked', true);

      this.state.checkAll = true;
    }
  },

  _onUpdateClass :function(){
  	  
  	 var self = this;
  	 if(!$('#form-class-edit').valid()){
  	   return;
  	 }

     var courses = this.refs[ 'classCourseContainer' ].getCourses();
     var ccids = [];
     for (var i = courses.length - 1; i >= 0; i--) {
      ccids.push(courses[i].id);
     }
    ClassActionCreator.updateClass(self.state.currentClass.id, ccids);
  },
  
  _onAddCourseToClass: function(){

    this.refs[ 'classCourseContainer' ]._onCourseChange(1);

    this.refs[ 'searchCourseContainer' ]._onCourseChange(0);

  },

  _onClassCallBack :function(){

     var payload = ClassStore.getPayload();

     if(payload.type == ActionTypes.GET_CLASS){

	    this.state.currentClass = payload.result.Class;

	    $('#classtitle').val(this.state.currentClass.title);

	    this.refs[ 'classCourseContainer' ].setCourses(this.state.currentClass.courses);

     }else if(payload.type == ActionTypes.UPDATE_CLASS){
     	  if(payload.result.retcode == 0){
          $(".update_class_btn").notify('Update class successfully.' ,{
            position:'right', className: "success" ,autoHideDelay: 7000
          }); 
        }else{
          $(".update_class_btn").notify( payload.result.message ,{
            position:'right', className: "error" ,autoHideDelay: 7000
        }); 
        }
     		//location.href = '/teacher/class/edit/' + this.state.currentClass.id;
    }
 
  },

  _onCourseCallBack :function(){

    var payload = CourseStore.getPayload();
    var result = payload.result;
    if(payload.type == ActionTypes.GET_COURSES){  
      if(result.retcode ==  0){
          this.refs[ 'classCourseContainer' ].setCourses(result.courses);

      }else{
        alert(result.message);
      }
    }else if(payload.type == ActionTypes.SEARCH_COURSE){
      if(result.retcode ==  0){
          this.refs[ 'searchCourseContainer' ].setCourses(result.courses);
      }else{
        alert(result.message);
      }
    }

  },

  componentWillUnmount: function() {
      if($.isFunction(this._onClassCallBack)){
        ClassStore.removeChangeListener(this._onClassCallBack);
      }

      if($.isFunction(this._onCourseCallBack)){
        CourseStore.removeChangeListener(this._onCourseCallBack);
      }
  },

  _onSearchCourse: function() {

    CourseActionCreator.searchCourses( $('#searchCoursebtn').val());
  },

  render: function() {

    var classCourseContainer =  React.createElement(CourseThumb,{ref: 'classCourseContainer', courses: [], parent: this, allowAdd: true, allowCheck:false});

    var searchCourseContainer =  React.createElement(CourseThumb,{ref: 'searchCourseContainer', course: [], parent: this, allowAdd: false, allowCheck:true});

    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col xs={12} sm={10} className='col-sm-offset-1 padding-col'>
              <PanelContainer>
                <Panel>
                  <PanelHeader style={{margin: 0}}>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h3><Entity entity='editClass' /></h3>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody className="triggerElement">
                    <Form id='form-class-edit' style={{paddingTop:25}}>
                      <Grid>
                      <Row>
                          <Col sm={6} xs={12}>
                            <FormGroup>
                              <Label htmlFor='classtitle'><Entity entity='className' /> </Label>
                              <Input type='text' id='classtitle' name='title' className='required'/>
                            </FormGroup>
                          </Col>
                      </Row>
	                    <Row>
                          <Col sm={12} xs={12} >
                            <Label><Entity entity='classCourse' /> </Label>
                          </Col>
	                    </Row>
	                    <Row>
	                    	<Col sm={12} xs={12} >
                         { classCourseContainer }
	                    	</Col>
	                    </Row>
	                    <Row>
	                    	<Col xs={2} sm={1}>
	                    		<Button bsStyle='xddgreen' className="update_class_btn" onClick={ this._onUpdateClass }><Entity entity='updateClass'/></Button>
	                    	</Col>
	                    </Row>
                      <Row>
                        <Col xs={12} sm={2} style={{ paddingTop:20, paddingBottom: 10 }}>
                          <Label><Entity entity='selectCourse' /> </Label> 
                        </Col>
                      </Row>
                      <Row>
                          <Col sm={6} xs={12} className="col-sm-offset-3">
                            <InputGroup>
                                  <Input type='text' id='searchCoursebtn' placeholder='Enter keywords here ...' />
                                  <InputGroupAddon className='plain'>
                                    <Button bsStyle='xddgreen' onClick={ this._onSearchCourse }>
                                      <span><Entity entity='searchCourse' /> </span>
                                      <Icon bundle='fontello' glyph='search' />
                                    </Button>
                                  </InputGroupAddon>
                            </InputGroup>
                          </Col>
                      </Row>
                      <Row>
                           <Col sm={7} xs={12} >
                            <input id='select-all-course' type="checkbox" /> <Entity entity='selectAllCourse'/>
                           </Col>
                      </Row>   
                      <Row>
                        <Col sm={12} xs={12} >
                        { searchCourseContainer }
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={2} sm={1}>
                          <Button bsStyle='xddgreen' style={{ marginTop: 20, marginBottom: 20 }} className='add_to_class_btn'  onClick={ this._onAddCourseToClass }><Entity entity='addToClass'/></Button>
                        </Col>
                      </Row>
                      </Grid>
                    </Form>
                  </PanelBody>
                </Panel>
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
