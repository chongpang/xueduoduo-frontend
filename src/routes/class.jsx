import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import Coursehumb from 'components/coursethumb';

import ClassStore from 'stores/ClassStore';
import CourseThumb from 'components/coursethumb';

import CourseStore from 'stores/CourseStore';

import TeacherActionCreator from 'actions/TeacherActionCreator';
import TeacherStore from 'stores/TeacherStore'
import ClassActionCreator from 'actions/ClassActionCreator';
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var Body = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function(){
    return {
      currentClass : {},
      menuitems: [],
      classes: [],
      courseThumbs: [],
      selected : null,
      stuCount: 0,
      learner_rows: []
    }
  },

  componentDidMount: function(){
    //$('.tablesaw').table();
    setTimeout(function() {
      $('.tablesaw').table();
    }, 500);

    ClassStore.addChangeListener(this._onClassCallBack);
    ClassActionCreator.getClassInfo(this.context.router.state.params.cid);

    ClassActionCreator.getClasses();

    // keep selected classid
    localStorage.setItem('current_class', this.context.router.state.params.cid);

    hideHeader(190);
  },
  componentWillUnmount: function() {

    if($.isFunction(this._onClassCallBack)){
      //CourseStore.removeChangeListener(this._onGetCourseCallBack);
      ClassStore.removeChangeListener(this._onClassCallBack);
    }

  },

  _onClassCallBack: function(){

    var payload = ClassStore.getPayload();
    var result = payload.result;
    var self =this;

    if(payload.type == ActionTypes.GET_CLASS_INFO){ 

        var courseThumbs = [];
        var courses = [];
        var learners = [];
        var stuCount = 0;
        var learner_rows = [];
        var classInfo = result;

        if(classInfo != null){
          if(classInfo.retcode == 0){
              courses = classInfo.classInfo.courses;
              if(courses && courses.length > 0){
                  len = courses.length;
                  if (len > 0) {
                    courseThumbs = courses.map(function (c) {
                      return (
                            <Col xs={6} sm={3}>
                              <PanelContainer>
                              <Panel>
                                <PanelBody className='bg-orange thumb'>
                                  <a href="#" onClick={ self._onEditCourse.bind(self, c.id) } id= { c.id }>{ c.title }</a>
                                </PanelBody>
                              </Panel>
                              </PanelContainer>
                            </Col>
                      );
                    });
                  }
              }
              //
              learners = classInfo.classInfo.learners;
              stuCount = learners.length;
              if (stuCount > 0) {
                learner_rows = learners.map(function (learner) {
                  return (
                        <tr>
                          <td>{ learner.userId }</td>
                          <td>1</td>
                          <td>1 minitue ago</td>
                          <td>Joint</td>
                        </tr>
                  );
                });
              }

          }

          this.setState({ courseThumbs: courseThumbs, learner_rows: learner_rows, stuCount: stuCount});

        }

    }else if (payload.type == ActionTypes.GET_CLASSES){

      var menuitems = null;
      var classes = []; 
      var len = 0;
      var selected = this.context.router.state.params.cid;
      var stuCount = 0;
      var self = this;

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

    }else if (payload.type == ActionTypes.DELETE_CLASS){

        if(payload.result.retcode == 0){
            $(".delete_class_btn").notify('Delete class successfully.' ,{
             position:'bottom', className: "success" ,autoHideDelay: 7000
            });

            setTimeout(function() {
              location.href = '/teacher/dashboard';
            }, 3000);
        }else{
            $(".delete_class_btn").notify( payload.result.message, {
             position:'bottom', className: "error" ,autoHideDelay: 7000
            }); 
        }
    }

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
        $('#selected-class-title').text(this.state.currentClass.title );
        $('.dropdown-menu').css("display","block")
        break;
      }

    };
  },

  _onTabChange: function(e){

  },

  _onInviteStudent: function(){

    var $form = $("#inviteForm");

    var param = {};
     $($form.serializeArray()).each(function(i, v) {
        param[v.name] = v.value;
    });

    TeacherStore.addChangeListener(this._onInviteCallBack);
    param["cid"] = this.state.currentClass.id;
    TeacherActionCreator.inviteStudent(param);

  },

  _onInviteCallBack: function(){
      $.notify.defaults({ className: "success" });
      $('#inviteForm').notify("Invite student succeeded!",{
        position:'bottom'
      });
  },
  
  _onEditCourse: function( cid ){

    this.transitionTo('/teacher/course/edit/' + cid);
  },

  _onCreateCourse: function(){

    this.transitionTo('/teacher/course/new');
  },

  _onEditClass: function( cid ){

    this.transitionTo('/teacher/class/edit/' + cid);
  },

  _onDeleteClass :function(){

    ClassActionCreator.deleteClass(this.state.currentClass.id);
  },

  render: function() {

    var self = this;

    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smCollapseRight className='col-sm-offset-1 padding-col'>
              <PanelContainer>
                <Panel>
                <PanelHeader>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                          <h3><span id="selected-class-title">{ self.state.selected } </span></h3>
                      </Col>
                    </Row>
                  </Grid>
                </PanelHeader>
                <PanelBody className="triggerElement"> 
                 <Grid>
                  <Row>
                  <Col xs={12} sm={12}>
                  <Accordian>
                    <AccordianPane active>
                      <AccordianTitle><Entity entity='classHome' /></AccordianTitle>
                      <AccordianContent>
                          <PanelContainer>
                            <Panel>
                              <PanelHeader className=''>
                                <Grid>
                                  <Row>
                                    <Col xs={12}>
                                      <h4> {  self.state.stuCount } Student</h4>
                                    </Col>
                                  </Row>
                                </Grid>
                              </PanelHeader>
                              <PanelBody>

                                  <Row>
                                    <Col xs={12}>
                                      <Table bordered striped className='tablesaw' data-mode='stack'>
                                        <thead>
                                          <tr>
                                            <th><Entity entity="overviewStuName" /></th>
                                            <th><Entity entity="overviewQuestionAnswered" /></th>
                                            <th><Entity entity="overviewLastAccess" /></th>
                                            <th><Entity entity="overvieStatus" /></th>

                                          </tr>
                                        </thead>
                                        <tbody>
                                          {  self.state.learner_rows }
                                        </tbody>
                                      </Table>
                                      
                                    </Col>
                                  </Row>

                              </PanelBody>
                            </Panel>
                          </PanelContainer>
                      </AccordianContent>
                    </AccordianPane>
                    <AccordianPane>
                      <AccordianTitle><Entity entity='classCurriculum' /></AccordianTitle>
                      <AccordianContent>
                          <PanelContainer noOverflow controlStyles='bg-purple fg-white'>
                            <Panel>
                              <PanelHeader>
                                <Grid>
                                  <Row>
                                    <Col xs={8} sm={3}>
                                      <h4> <Entity entity="courses"/></h4>
                                    </Col>
                                  </Row>
                                </Grid>
                              </PanelHeader>
                              <PanelBody>
                                <Grid>
                                  <Row>  
                                    { self.state.courseThumbs }
                                    <Col xs={12} sm={3}>
                                      <PanelContainer>
                                      <Panel>
                                        <PanelBody className='thumb thumbAdd text-center'>
                                           <Button style={{marginTop: 15}} bsStyle='xddgreen' onClick={ self._onCreateCourse }><Entity entity='addCourse'/></Button>
                                        </PanelBody>
                                      </Panel>
                                      </PanelContainer>
                                    </Col>
                                  </Row>
                                </Grid>
                              </PanelBody>
                            </Panel>
                          </PanelContainer>
                      </AccordianContent>
                    </AccordianPane>
                    <AccordianPane>
                      <AccordianTitle><Entity entity='inviteStudent' /></AccordianTitle>
                      <AccordianContent>
                          <PanelContainer noOverflow controlStyles='bg-purple fg-white'>
                            <Panel>
                              <PanelBody>
                                <Grid>
                                  <Row>
                                    <Col xs={12}>
                                      <Form horizontal id="inviteForm" style={{paddingTop:15}}>
                                         <FormGroup>
                                            <Col xs={12}>
                                              <Input type='text' name="students" id='blockhelp' required placeholder='Email, Phone number' />
                                              <HelpBlock><Entity entity="learnerId" /></HelpBlock>
                                            </Col>
                                          </FormGroup>
                                          <FormGroup>
                                            <Col xs={12}>
                                              <br/>
                                              <div>
                                                <Button bsStyle='xddgreen' onClick={ self._onInviteStudent }><Entity entity='send'/></Button>
                                              </div>
                                              <br/>
                                            </Col>
                                          </FormGroup>
                                      </Form>
                                    </Col>
                                  </Row>
                                </Grid>
                              </PanelBody>
                            </Panel>
                          </PanelContainer>  
                      </AccordianContent>
                    </AccordianPane>
                    <AccordianPane>
                      <AccordianTitle><Entity entity='classManage' /></AccordianTitle>
                      <AccordianContent>
                          <PanelContainer noOverflow controlStyles='bg-purple fg-white'>
                            <Panel>
                              <PanelBody>
                                <Grid>
                                  <Row style={{paddingTop:15}}>
                                        <Col key='icon-fontello-edit' xs={5} sm={2} className='text-center cursor-hand' onClick={ self._onEditClass.bind(self, self.state.currentClass.id) }>
                                            <div>
                                              <Icon className={'fg-darkblue'} style={{fontSize: 48}} glyph='icon-fontello-edit' />
                                            </div>
                                            <div>
                                              <Entity entity="editClassBtn" />
                                            </div>
                                        </Col>
                                         <Col key='icon-stroke-gap-icons-Delete' xs={5} sm={2} className='text-center delete_class_btn cursor-hand' onClick={ self._onDeleteClass }>
                                            <div>
                                              <Icon className={'fg-darkblue'} style={{fontSize: 48}} glyph='icon-stroke-gap-icons-Delete' />
                                            </div>
                                            <div>
                                              <Entity entity="deleteClass" />
                                            </div>
                                        </Col>
                                  </Row>
                                </Grid>
                              </PanelBody>
                            </Panel>
                          </PanelContainer>  
                      </AccordianContent>
                    </AccordianPane>
                  </Accordian>
                  </Col>
                  </Row>
                  </Grid>
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
