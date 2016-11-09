import { Link, State, Navigation } from 'react-router';

import { Router } from 'react-router';

import classNames from 'classnames';

import Header from 'common/header';
import Footer from 'common/footer';

import LOStore from 'stores/LOStore';

import LOActionCreator from 'actions/LOActionCreator';
import LOThumb from 'components/lothumb';

import ReactStyle from 'global/jsx/react-styles/src/ReactStyle.jsx';

import Quiz from 'components/quiz';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var $tokenbox = null;

var Body = React.createClass({
  mixins: [State, Navigation],
  componentDidMount: function() {

    LOStore.addChangeListener(this._onLOCallBack);

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


    $('#wizard-2').steps({
      onStepChanging: function (event, currentIndex, newIndex) {

        $('#form-2').validate().settings.ignore = ':disabled,:hidden';

        if(currentIndex == 1){
          $('#showloname').text($('#lotitle').val());
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
        LOActionCreator.createLO(localStorage.getItem('current_course'));
      }
    });

    $('#content').trumbowyg({
      mobile: false,
      tablet: false,
      autogrow: true,
      dir: $('html').attr('dir')
    }).trumbowyg('html', '');

    var tokenContainer = $(this.refs.tokeninputContainer.getDOMNode());
    $tokenbox = $('<input />').prop('name', 'tags');
    tokenContainer.append($tokenbox);
    $tokenbox.tokenfield();

    
    var $prerequisitesContainer = $(this.refs.prerequistitsContainer.getDOMNode());
    var $prerequisitesbox = $('<input />').prop('name', 'prerequisites');
    $prerequisitesContainer.append($prerequisitesbox);
    $prerequisitesbox.tokenInput(API_HOST + '/api/v1/searchlo',{
        queryParam: "keywords",
        crossDomain: true,
        onResult: function (results) {
            var result = [];
            for (var i = results.length - 1; i >= 0; i--) {
              var tmp = {};
              tmp['id'] = results[i].id;
              tmp['title'] = results[i].title;
              result.push(tmp);
            };
            return result;
        },
        propertyToSearch: 'title',
        resultsFormatter: function(item){ 
          return "<li>"+ item.id + " " + item.title + "</li>";
        },
        noResultsText: "No result found."
      }
    );

    var $categoryContainer = $(this.refs.categoryContainer.getDOMNode());
    var $categorybox = $('<input />').prop('name', 'category');
    $categoryContainer.append($categorybox);
    $categorybox.tokenInput(API_HOST + '/api/v1/searchlo',{
        queryParam: "keywords",
        crossDomain: true,
        onResult: function (results) {
            var result = [];
            for (var i = results.length - 1; i >= 0; i--) {
              var tmp = {};
              tmp['id'] = results[i].id;
              tmp['title'] = results[i].title;
              result.push(tmp);
            };
            return result;
        },
        propertyToSearch: 'title',
        resultsFormatter: function(item){ 
          return "<li>"+ item.id + " " + item.title + "</li>";
        },
        noResultsText: "No result found."
      }
    );

    $('.token-input-dropdown').css('z-index',700000);
    $('.token-input-list').css('width','100%');
    $('.token-input-list').css('margin-bottom','15px');
    $('.token-input-list').css('min-height','60px');

  },
	_onLOCallBack :function(){

    var payload = LOStore.getPayload();
    var result = payload.result;
    if(payload.type == ActionTypes.CREATE_LO){  
      if(result.retcode ==  0){
           // need refactor!!! why child component can not access transitionTo of parent conment
           //this.transitionTo('/teacher/course/new');
           //this.context.router.goBack();
           var courseId = localStorage.getItem('current_course');
           if(courseId){
              this.transitionTo('/teacher/course/edit/' + courseId);
           }else{
              this.context.router.goBack();
           }
      }else{
        alert(result.message);
      }
    }

  },

  handleSelection: function(itemprops ){
    var value = itemprops.children;
    alert(value);
  },

  componentWillUnmount: function() {

      if($.isFunction(this._onLOCallBack)){
        LOStore.removeChangeListener(this._onLOCallBack);
      }
  },

  render: function() {

    var quiz = React.createElement(Quiz,{'quizs': []});

    return (
      <Container id='body'>
        <div id="fakeLoader"></div>
        <Grid>
          <Row>
            <Col xs={12} sm={10} className='col-sm-offset-1 padding-col'>
              <PanelContainer>
                <Panel>
                  <PanelHeader style={{margin: 0}}>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h3><Entity entity='addLO' /></h3>
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
                                  <Label htmlFor='coursetitle'><Entity entity='inputLOName' /> *</Label>
                                  <Input type='text' id='lotitle' name='title' className='required' />
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

                        <h1>Contents</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col xs={12}>
                                <PanelContainer>
                                  <Panel>
                                    <PanelHeader>
                                      <Grid>
                                        <Row>
                                          <Col xs={12}>
                                            <h3 className='text-left'><Entity entity="addLOContent" /></h3>
                                          </Col>
                                        </Row>
                                      </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                      <div id='content' name="content"></div>
                                    </PanelBody>
                                  </Panel>
                                </PanelContainer>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <PanelContainer>
                                  <Panel>
                                    <PanelHeader>
                                      <Grid>
                                        <Row>
                                          <Col xs={12}>
                                            <h3 className='text-left'><Entity entity="addQuiz" /></h3>
                                          </Col>
                                        </Row>
                                      </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                      <Grid id="question-section">
                                        { quiz }
                                      </Grid>
                                    </PanelBody>
                                  </Panel>
                                </PanelContainer>
                              </Col>
                            </Row>

                            <Row>
                              <Col xs={12}>
                               <PanelContainer>
                                <Panel>
                                  <PanelHeader>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <h3 className='text-left'><Entity entity="addLODescription" /></h3>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelHeader>
                                  <PanelBody>
                                     <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <textarea name="description" className="lo-description">
                                          </textarea>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelBody>
                                </Panel>
                               </PanelContainer>
                              </Col>                                  
                            </Row>
                            <Row>
                              <Col xs={12}>
                               <PanelContainer>
                                <Panel>
                                  <PanelHeader>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <h3 className='text-left'><Entity entity="selectPrerequists" /></h3>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelHeader>
                                  <PanelBody>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <div ref="prerequistitsContainer"></div>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelBody>
                                </Panel>
                               </PanelContainer>
                              </Col>                                  
                            </Row>
                            <Row>
                              <Col xs={12}>
                               <PanelContainer>
                                <Panel>
                                  <PanelHeader>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <h3 className='text-left'><Entity entity="selectCategory" /></h3>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelHeader>
                                  <PanelBody>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <div ref="categoryContainer"></div>
                                        </Col>
                                      </Row>
                                    </Grid>                             
                                  </PanelBody>
                                </Panel>
                               </PanelContainer>
                              </Col>                                  
                            </Row>
                            <Row>
                              <Col xs={12}>
                               <PanelContainer>
                                <Panel>
                                  <PanelHeader>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <h3 className='text-left'><Entity entity="addTag" /></h3>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelHeader>
                                  <PanelBody>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <div ref="tokeninputContainer"></div>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelBody>
                                </Panel>
                               </PanelContainer>
                              </Col>                                  
                            </Row> 
                            <Row>
                              <Col xs={12}>
                               <PanelContainer>
                                <Panel className="panel-min-height">
                                  <PanelHeader>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <h3 className='text-left'><Entity entity="addLearningLevel" /></h3>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelHeader>
                                  <PanelBody>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                            <Dropdown className="padding-topdown-1 select-grade-dropdown">
                                              <DropdownButton outlined bsStyle='green'>
                                                <span>Grade 1</span><Caret/>
                                              </DropdownButton>
                                              <Menu bsStyle='fg-white' onItemSelect={this.handleSelection}>
                                                <MenuItem active href='#'>Grade 1</MenuItem>
                                                <MenuItem href='#'>grade 2</MenuItem>
                                                <MenuItem href='#'>grade 3</MenuItem>
                                              
                                                <MenuItem href='#'>grade 4</MenuItem>
                                                <MenuItem href='#'>grade 5</MenuItem>
                                                <MenuItem href='#'>grade 6</MenuItem>
                                                <MenuItem href='#'>grade 7</MenuItem>
                                                <MenuItem href='#'>grade 8</MenuItem>
                                                <MenuItem href='#'>grade 9</MenuItem>
                                                <MenuItem href='#'>grade 10</MenuItem>
                                                <MenuItem href='#'>grade 11</MenuItem>
                                                <MenuItem href='#'>grade 12</MenuItem>
                                              </Menu>
                                            </Dropdown>
                                        </Col>
                                      </Row>
                                    </Grid>                           
                                  </PanelBody>
                                </Panel>
                               </PanelContainer>
                              </Col>                                  
                            </Row>                                                                                                                                    
                          </Grid>
                        </div>
                        <h1>Confirm</h1>
                        <div>
                          <div className=''>
                            <h3><Entity entity='createLOConfirm'/></h3>
                              <Table>
                              <tbody>
                                <tr>
                                  <th> <Entity entity='LOName'/></th>
                                  <td id='showloname'>A learning Object Name</td>
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
