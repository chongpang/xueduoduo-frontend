import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
import l20n, {Entity} from '@sketchpixy/rubix/lib/L20n';


import CourseActionCreator from 'actions/CourseActionCreator';
import CourseStore from 'stores/CourseStore';
import ClassActionCreator from 'actions/ClassActionCreator';
import ClassStore from 'stores/ClassStore';

import CourseThumb from 'components/Coursethumb';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

import {
    Row,
    Col,
    Grid,
    Table,
    Form,
    Panel,
    Checkbox,
    PanelBody,
    FormGroup,
    FormControl,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class NewClass extends React.Component {
  back(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.goBack();
  }

  constructor(props) {
    super(props);
    this.state = {
      checkAll : false,
      checkedCourses: [],
      checkedCourseIds: [],
      courses: []
    };
  }

  componentDidMount() {

    CourseStore.addChangeListener(this._onCourseCallBack.bind(this));
    ClassStore.addChangeListener(this._onClassCallBack.bind(this));

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

        if(currentIndex == 0) {
          // get courses getCourses
          CourseActionCreator.searchCourses('');

        }else if(currentIndex == 1){

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
          $('#showauthor').text(store.get("user_name"));
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

  }

  _onCourseCallBack(){

    var payload = CourseStore.getPayload();
    var result = payload.result;
    var self = this;

    if(payload.type == ActionTypes.SEARCH_COURSE){  
      if(result.retcode ==  0){
        ReactDOM.render(
            <CourseThumb
                parent={ self }
                courses={ result.courses}
                allowAdd={ false }
                allowCheck= { true } />,
            document.getElementById('courses_holder')
        );
      }else{
        alert(result.message);
      }
    }

  }

  _onClassCallBack(){
    var payload = ClassStore.getPayload();
    var result = payload.result;
    if(payload.type == ActionTypes.CREATE_CLASS){
      if(result.retcode == 0){
        this.props.router.push('/teacher/dashboard');
      }else{
        alert(result.message);
      }
    }
  }

  _onCheckAll(){

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
  }

  componentWillUnmount() {
      if($.isFunction(this._onCourseCallBack)){
        CourseStore.removeChangeListener(this._onCourseCallBack);
      }
      if($.isFunction(this._onClassCallBack)){
        CourseStore.removeChangeListener(this._onClassCallBack);
      }
  }

  render(){

    var inputClassName = l20n.ctx.getSync('inputClassName');
    var selectAllCourse = l20n.ctx.getSync('selectAllCourse');

    return (
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
                                  <label> { inputClassName } *</label>
                                  <FormControl type='text' id='classtitle' name='title' className='required' />
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
                            <Checkbox id='select-all-course'>{ selectAllCourse }</Checkbox>
                            <div id='courses_holder'/>
                          </div>
                        </div>
                        <h1>Confirm</h1>
                        <div>
                          <div className=''>
                            <h3><Entity entity='createClasscomfirm'/></h3>
                              <Table>
                              <tbody>
                                <tr>
                                  <th>{ l20n.ctx.getSync('className') }<Entity entity='className'/></th>
                                  <td id='showclassname'>A Class Name</td>
                                </tr>
                                <tr>
                                  <th>{ l20n.ctx.getSync('coursesName') }<Entity entity='coursesName'/></th>
                                  <td id='showcoursenames'>Otto</td>
                                </tr>
                                <tr>
                                  <th>{l20n.ctx.getSync('author') }<Entity entity='author'/></th>
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
    );
  }
}