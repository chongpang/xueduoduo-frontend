import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';
import ClassActionCreator from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import CourseThumb from 'components/coursethumb';

import LoremIpsum from 'global/jsx/loremipsum';
import ReactStyle from 'global/jsx/react-styles/src/ReactStyle.jsx';
var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;


var Body = React.createClass({
  mixins: [State, Navigation],
  getInitialState: function(){
    return {
      checkAll : false,
      checkedCourses: [],
      checkedCourseIds: []
    }
  },
  componentDidMount: function() {

    CourseStore.addChangeListener(this._onCourseCallBack);
    ClassStore.addChangeListener(this._onClassCallBack);
    // get courses getCourses
    CourseActionCreator.searchCourses('');

    var isLtr = $('html').attr('dir') === 'ltr';
    var styles = {};
    var self = this;

    if(isLtr) {
      styles['#wizard-2 .form-border'] = {
        borderRight: '1px solid #ddd'
      };
    } else {
      styles['#wizard-2 .form-border'] = {
        borderLeft: '1px solid #ddd'
      };
    }

    ReactStyle.addRules(ReactStyle.create(styles));


    $("#form-2").validate({
      rules: {
        confirm_password: {
          equalTo: "#password"
        }
      }
    });

    $('#wizard-2').steps({
      onStepChanging: function (event, currentIndex, newIndex) {
        $('#form-2').validate().settings.ignore = ':disabled,:hidden';

        if(currentIndex == 1){

          var  coursesname = "";
 
          if(self.state.checkAll){
            var payload = CourseStore.getPayload();
            self.state.checkedCourses = payload.result.courses;
          }
          self.state.checkedCourseIds = [];
          $.each(self.state.checkedCourses, function( index, value ) {
            self.state.checkedCourseIds.push(value.id);
            coursesname += value.title + " ";
          });

          $('#showcoursenames').text(coursesname);
          $('#showclassname').text($('#classtitle').val());
          $('#showauthor').text(localStorage.getItem("user_name"));
        }

        return $('#form-2').valid();
      },
      onFinishing: function (event, currentIndex) {
        $('#form-2').validate().settings.ignore = ':disabled';
        return $('#form-2').valid();
      },
      onFinished: function (event, currentIndex) {
        $("#fakeLoader").fakeLoader({
          timeToHide:1000*60*60,
          zIndex:9999999,
          spinner:"spinner3",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7' 
          bgColor: "rgba(0, 0, 0, 0.2)" //Hex, RGB or RGBA colors
        });
        ClassActionCreator.createClass(self.state.checkedCourseIds);
      }
    });

    var self = this;
    $('#select-all-course').change(function(){
      self._onCheckAll();
    });

  },
  _onCourseCallBack :function(){

    var payload = CourseStore.getPayload();
    var result = payload.result;

    if(payload.type == ActionTypes.SEARCH_COURSE){  
      if(result.retcode ==  0){
           // need refactor!!! why child component can not access transitionTo of parent conment
          this.refs['courseRefs'].setCourses(result.courses);
      }else{
        alert(result.message);
      }
    }

  },
  _onClassCallBack: function(){
    var payload = ClassStore.getPayload();
    var result = payload.result;
    if(payload.type == ActionTypes.CREATE_CLASS){
      if(result.retcode == 0){
        this.transitionTo('/teacher/dashboard');
      }else{
        alert(result.message);
      }
    }
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

  componentWillUnmount: function() {
      if($.isFunction(this._onCourseCallBack)){
        CourseStore.removeChangeListener(this._onCourseCallBack);
      }
      if($.isFunction(this._onClassCallBack)){
        CourseStore.removeChangeListener(this._onClassCallBack);
      }
  },
  render: function() {

  var courseThumb = React.createElement(CourseThumb, {ref:'courseRefs', courses: [], parent: this, allowAdd: false, allowCheck:true });

    return (
      <Container id='body'>
        <div id="fakeLoader"></div>
        <Grid>
          <Row>
            <Col sm={10} className='col-sm-offset-1 padding-col'>
              <PanelContainer>
                <Panel>
                  <PanelHeader style={{margin: 0}}>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h3><Entity entity='addClass' /></h3>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody>
                    <Form id='form-2'>
                      <div id='wizard-2'>
                        <h1>Name</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={7} xs={12} collapseLeft xsOnlyCollapseRight>
                                <FormGroup>
                                  <Label htmlFor='classtitle'><Entity entity='inputClassName' /> *</Label>
                                  <Input type='text' id='classtitle' name='title' className='required' />
                                </FormGroup>
                              </Col>
                              <Col sm={4} xs={6} collapseRight>
                                <p>
                                  <Entity entity='requiredField'/>
                                </p>
                              </Col>
                            </Row>
                          </Grid>
                        </div>

                        <h1>Course</h1>
                        <div>
                          <div className=''>
                            <h4><Entity entity='selectCourse'/></h4>
                            <Checkbox id='select-all-course'><Entity entity='selectAllCourse' /></Checkbox>
                            {courseThumb}
                          </div>
                        </div>
                        <h1>Confirm</h1>
                        <div>
                          <div className=''>
                            <h3><Entity entity='createClasscomfirm'/></h3>
                              <Table>
                              <tbody>
                                <tr>
                                  <th><Entity entity='className'/></th>
                                  <td id='showclassname'>A Class Name</td>
                                </tr>
                                <tr>
                                  <th><Entity entity='coursesName'/></th>
                                  <td id='showcoursenames'>Otto</td>
                                </tr>
                                <tr>
                                  <th><Entity entity='author'/></th>
                                  <td id='showauthor'>Otto</td>
                                </tr>
                              </tbody>
                            </Table>                  
                          </div>
                        </div>
                      </div>
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
