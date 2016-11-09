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

var $prerequisitesbox = null;
var $tokenbox = null;
var $categorybox = null;

var Body = React.createClass({

  mixins: [State, Navigation],

 getInitialState: function(){
	  return {
      lo: null
    }
  },
  componentDidMount: function() {

  	var loid = this.context.router.state.params.loid;

    LOStore.addChangeListener(this._onLOCallBack);

    LOActionCreator.getLOById(loid);

    var isLtr = $('html').attr('dir') === 'ltr';
    var styles = {};
    var self = this;

    ReactStyle.addRules(ReactStyle.create(styles));


    $("#form-2").validate({
      rules: {
        confirm_password: {
          equalTo: "#password"
        }
      }
    });

    this.setContent();

    var tokenContainer = $(this.refs.tokeninputContainer.getDOMNode());
    $tokenbox = $('<input />').prop('name', 'tags');
    tokenContainer.append($tokenbox);

     $tokenbox.tokenfield();
    
    var $prerequisitesContainer = $(this.refs.prerequistitsContainer.getDOMNode());
    $prerequisitesbox = $('<input />').prop('name', 'prerequisites');
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
    $categorybox = $('<input />').prop('name', 'category');
    $categoryContainer.append($categorybox);
    $categorybox.tokenInput(API_HOST + '/api/v1/searchlo',{
        queryParam: "keywords",
        crossDomain: true,
        onResult: function (results) {
            var result = [];
            //for (var i = results.length - 1; i >= 0; i--) {
              var tmp = {};
              tmp['id'] = "1";//results[i].id;
              tmp['title'] = "Math";//results[i].title;
              result.push(tmp);
            //};

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

    hideHeader(190);
    $("#navbar").css("opacity",1);
  },
	_onLOCallBack :function(){

    var payload = LOStore.getPayload();
    var result = payload.result;

    if(payload.type == ActionTypes.UPDATE_LO){  
      if(result.retcode ==  0){

		  $('#updatelo-btn').notify("Update learning object succeeded!",{
		  	position:'right', className: "success" 
		  });
          //this.context.router.transitionTo('/teacher/lo/edit/' +  this.context.router.state.params.loid);
      }else{

        $('#updatelo-btn').notify(result.message,{
        position:'right', className: "error" 
      });
      }
    }else if(payload.type == ActionTypes.SEARCH_LO){
      if(result.retcode ==  0){
      		if(result.los.length == 1){
      			this.setState({lo: result.los[0]});
      			this.setContent();
      			this._getLODetails(result.los[0]);

      			// show saved tags
      			var tags = result.los[0].tags;
      			$tokenbox.tokenfield('setTokens', tags);
      			$categorybox.tokenInput("add",{"id": "1", "title": "Math"});

            $("#lotitle").val(result.los[0].title);

      		}
            
      }else{
        alert(result.message);
      }
    }else if(payload.type == ActionTypes.GET_LO_DETAILS){

      if(result.retcode ==  0){

      	 $prerequisitesbox.tokenInput("clear");
      	for (var i =  result.los.length - 1; i >= 0; i--) {
      		 $prerequisitesbox.tokenInput("add",{"id":result.los[i].id,"title":result.los[i].title});
      	}
            
      }else{
        alert(result.message);
      }
    }

  },

  handleSelection: function(itemprops ){
    var value = itemprops.children;

    $('#grade-selected').text(value);

    if(value){
    	value = value.split(' ');
    	value = value[1];
    }

    $(body).click();

    $('input[name=learningLevel]').val(value);

 
    
  },

  _getLODetails: function( lo){

  	LOStore.addChangeListener(this._onLOCallBack);

    LOActionCreator.getLODetails(lo.prerequisites);
  },

  componentWillUnmount: function() {

      if($.isFunction(this._onLOCallBack)){
        LOStore.removeChangeListener(this._onLOCallBack);
      }
  },

  setContent: function(){

    var defaultLoContent = "";
    if(this.state.lo){
    	defaultLoContent = this.state.lo.content;
    }

    $('#content').trumbowyg({
      mobile: true,
      tablet: true,
      autogrow: true,
      dir: $('html').attr('dir')
    }).trumbowyg('html', defaultLoContent);

  },

  _onUpdateLO: function(){
  	LOActionCreator.updateLO(this.context.router.state.params.loid);
  },

  render: function() {

    var lo = this.state.lo;
    var qs = [];
    if(lo){
		qs = lo.quizs;
    }else{
    	this.state.lo = {};
    	lo = {};
    }
    var quiz = React.createElement(Quiz,{'quizs': qs});
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
                          <h3><Entity entity='editLO' /></h3>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody  className="triggerElement">
                    <Form id='form-edit-lo' style={{paddingTop:25}}>
                        <Grid>
                          	<Row>
                          	  <Col sm={12} xs={12}>
                          	     <PanelContainer>
                                  <Panel>
                                    <PanelHeader>
		                              <Grid>
                                        <Row>
                                          <Col xs={12}>
		                                  	<h3 className='text-left'><Entity entity='inputLOName' /></h3>
		                                  </Col>
		                                </Row>
		                               </Grid>
		                             </PanelHeader>
		                             <PanelBody>
		                            	<Grid>
                                    <Row>
                                      <Col xs={12}>
		                             	        <Input type='text' id='lotitle' name='title' className='required' />
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
                                            <h3 className='text-left'><Entity entity="addLOContent" /></h3>
                                          </Col>
                                        </Row>
                                      </Grid>
                                    </PanelHeader>
                                    <PanelBody>
                                       <Grid>
                                        <Row>
                                          <Col xs={12}>
                                             <div id='content' name="content"></div>
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
                                          <textarea name="description" className="lo-description" value={lo.description}>
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
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <h3 className='text-left'><Entity entity="addLearningLevel" /></h3>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col xs={12}>
                                            <Dropdown className="dropup">
                                              <DropdownButton outlined bsStyle='xddgreen'>
                                                <span id="grade-selected">{'Grade ' + lo.learningLevel} </span><Caret/>
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
                                              <input type="hidden" name='learningLevel' value={ lo.learningLevel } />

                                            </Dropdown>
                                        </Col>
                                      </Row>
                                    </Grid>                           
                              </Col>                                  
                            </Row> 
                             <Row>
	                        <Col xs={12} sm={12} className='text-center' style={{paddingTop: 20}}>
	                          <Button id="updatelo-btn" bsStyle='xddgreen' onClick={ this._onUpdateLO }><Entity entity='updateLO'/></Button>
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
