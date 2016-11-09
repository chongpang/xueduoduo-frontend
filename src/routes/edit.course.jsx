import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';

import CourseThumb from 'components/coursethumb';
import LOStore from 'stores/LOStore';

import LOActionCreator from 'actions/LOActionCreator';
import LOThumb from 'components/lothumb';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;


var Body = React.createClass({
  mixins: [State, Navigation],
  getInitialState: function(){
    return {
      checkAll : false,
      checkedLOs: [],
      course: {},
    }
  },
  componentDidMount: function() {

  	var cid = this.context.router.state.params.cid;

    // keep selected classid
    localStorage.setItem('current_course', this.context.router.state.params.cid);

    CourseStore.addChangeListener(this._onCourseCallBack);

    LOStore.addChangeListener(this._onLOCallBack);

    CourseActionCreator.getCourse( cid );

    LOActionCreator.getLOsByCourse( cid );

    //$('#form-course-eidt').validate().settings.ignore = ':disabled';

    var self = this;
    $('#select-all-los').change(function(){
      self._onCheckAll();
    });

    hideHeader(190);
  },

   _onCheckAll: function(){

   if (!$('#select-all-los').is(':checked')) {
      $('#select-all-los').prop('checked', false);

      $('.checkbox-lo').prop('checked', false);
      $('.checkbox-lo').val('');
      this.state.checkAll = false;
    } else {
      $('#select-all-los').prop('checked', true);

      $('.checkbox-lo').prop('checked', true);

      this.state.checkAll = true;
    }
  },

  _onUpdateCourse :function(){
  	  
  	 var self = this;
  	 if(!$('#form-course-edit').valid()){
  	   return;
  	 }

     var los = this.refs[ 'courseLOContainer' ].getLOs();
     var loids = [];
     for (var i = los.length - 1; i >= 0; i--) {
       loids.push(los[i].id);
     }

    CourseActionCreator.updateCourse(self.state.course.id, loids);
  },
  
  _onAddLOToCourse: function(){

    this.refs[ 'courseLOContainer' ]._onLOChange(1);

    this.refs[ 'searchLOContainer' ]._onLOChange(0);

  },
  _onCourseCallBack :function(){

     var payload = CourseStore.getPayload();

     if(payload.type == ActionTypes.GET_COURSE){

	    this.state.course = payload.result.course;

	    $('#coursetitle').val(this.state.course.title);

     }else if(payload.type == ActionTypes.UPDATE_COURSE){
     	if(payload.result.retcode == 0){
     		//location.href = '/teacher/course/edit/' + payload.result.c_id;
        $(".update_course_btn").notify('Update course successfully.',{
          position:'right', className: "success" ,autoHideDelay: 7000
        }); 
     	}else{
        $(".update_course_btn").notify(payload.result.message,{
          position:'right', className: "error" ,autoHideDelay: 7000
        }); 
     	}
     }
 
  },

  _onLOCallBack :function(){

    var payload = LOStore.getPayload();
    var result = payload.result;
    if(payload.type == ActionTypes.GET_LO){  
      if(result.retcode ==  0){
          this.refs[ 'courseLOContainer' ].setLos(result.los);
           // need refactor!!! why child component can not access transitionTo of parent conment
            //React.render(React.createElement(LOThumb,{ref: 'courseLOContainer', los: result.los, parent: this, allowAdd: false, allowCheck:false, _owner:this}), $("#lothumb").get(0));

      }else{
        $("#coursetitle").notify(result.message,{
          position:'top', className: "error" ,autoHideDelay: 7000
        }); 
      }
    }else if(payload.type == ActionTypes.SEARCH_LO){
      if(result.retcode ==  0){
           // need refactor!!! why child component can not access transitionTo of parent conment
            //React.render(React.createElement(LOThumb,{ref: 'searchLOContainer', los: result.los, parent: this, allowAdd: false, allowCheck:true, _owner:this}), $("#searchloresults").get(0));
          this.refs[ 'searchLOContainer' ].setLos(result.los);
      }else{
        alert(result.message);
      }
    }

  },

  componentWillUnmount: function() {
      if($.isFunction(this._onGetCourseCallBack)){
        CourseStore.removeChangeListener(this._onGetCourseCallBack);
      }

      if($.isFunction(this._onLOCallBack)){
        LOStore.removeChangeListener(this._onLOCallBack);
      }
  },

  _onSearchLO: function() {

    LOActionCreator.getLOs( $('#searchlobtn').val());
  },

  render: function() {

    var courseLOContainer =  React.createElement(LOThumb,{ref: 'courseLOContainer', los: [], parent: this, allowAdd: true, allowCheck:false});

    var searchLOContainer =  React.createElement(LOThumb,{ref: 'searchLOContainer', los: [], parent: this, allowAdd: false, allowCheck:true});

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
                          <h3><Entity entity='editCourse' /></h3>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody className="triggerElement">
                    <Form id='form-course-edit' style={{paddingTop:25}}>
                      <Grid>
                      <Row>
                          <Col sm={6} xs={12}>
                            <FormGroup>
                              <Label htmlFor='coursetitle'><Entity entity='courseName' /> </Label>
                              <Input type='text' id='coursetitle' name='title' className='required'/>
                            </FormGroup>
                          </Col>
                      </Row>
	                    <Row>
                          <Col sm={12} xs={12} >
                            <Label><Entity entity='courseLos' /> </Label>
                          </Col>
	                    </Row>
	                    <Row>
	                    	<Col sm={12} xs={12} >
                         { courseLOContainer }
	                    	</Col>
	                    </Row>
	                    <Row>
	                    	<Col xs={2} sm={1}>
	                    		<Button bsStyle='xddgreen' className='update_course_btn' onClick={ this._onUpdateCourse }><Entity entity='updateCourse'/></Button>
	                    	</Col>
	                    </Row>
                      <Row>
                        <Col xs={12} sm={2} style={{ paddingTop:20, paddingBottom: 10 }}>
                          <Label><Entity entity='addLO' /> </Label> 
                        </Col>
                      </Row>
                      <Row>
                          <Col sm={6} xs={12} className="col-sm-offset-3">
                            <InputGroup>
                                  <Input type='text' id='searchlobtn' placeholder='Enter keywords here ...' />
                                  <InputGroupAddon className='plain'>
                                    <Button bsStyle='xddgreen' onClick={ this._onSearchLO }>
                                      <span><Entity entity='searchlo' /> </span>
                                      <Icon bundle='fontello' glyph='search' />
                                    </Button>
                                  </InputGroupAddon>
                            </InputGroup>
                          </Col>
                      </Row>
                      <Row>
                           <Col sm={7} xs={12} >
                            <input id='select-all-los' type="checkbox" /> <Entity entity='selectAllLO' />
                           </Col>
                      </Row>   
                      <Row>
                        <Col sm={12} xs={12} >
                        { searchLOContainer }
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={2} sm={1}>
                          <Button bsStyle='xddgreen' style={{marginTop: 10, marginBottom: 15}} onClick={ this._onAddLOToCourse }><Entity entity='addToCourse'/></Button>
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
