import React from 'react';
import {withRouter} from 'react-router';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import LOStore from 'stores/LOStore';

import LOActionCreator from 'actions/LOActionCreator';

import Quiz from 'components/Quiz';

var XddConstants = require('constants/XddConstants');
var ActionTypes = XddConstants.ActionTypes;

var $prerequisitesbox = null;
var $tokenbox = null;
var $categorybox = null;

import {
    Row,
    Col,
    Grid,
    Button,
    Form,
    Panel,
    MenuItem,
    DropdownButton,
    FormControl,
    PanelBody,
    PanelHeader,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class EditLO extends React.Component {
    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            lo: null
        };
    }
    
  componentDidMount() {

  	var loid = this.props.router.params.loid;

    LOStore.addChangeListener(this._onLOCallBack.bind(this));

    LOActionCreator.getLOById(loid);

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
        onResult (results) {
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
        resultsFormatter(item){ 
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
        onResult (results) {
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
        resultsFormatter(item){ 
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
  }
	_onLOCallBack(){

    var payload = LOStore.getPayload();
    var result = payload.result;

    if(payload.type == ActionTypes.UPDATE_LO){  
      if(result.retcode ==  0){

		  $('#updatelo-btn').notify("Update learning object succeeded!",{
		  	position:'right', className: "success" 
		  });
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

  }

  handleSelection(itemprops ){
    var value = itemprops.children;

    $('#grade-selected').text(value);

    if(value){
    	value = value.split(' ');
    	value = value[1];
    }

    $(body).click();

    $('input[name=learningLevel]').val(value);

 
    
  }

  _getLODetails( lo){

  	LOStore.addChangeListener(this._onLOCallBack);

    LOActionCreator.getLODetails(lo.prerequisites);
  }

  componentWillUnmount() {

      if($.isFunction(this._onLOCallBack)){
        LOStore.removeChangeListener(this._onLOCallBack);
      }
  }

  setContent(){

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

  }

  _onUpdateLO(){
  	LOActionCreator.updateLO(this.context.router.state.params.loid);
  }

  render() {

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
		                             	        <FormControl type='text' id='lotitle' name='title' className='required' />
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
                                            <DropdownButton outlined bsStyle="xddgreen" title={lo.learningLevel} id={`dropdown-basic`} onSelect={ this.handleSelection.bind(this) }>
                                                <MenuItem eventKey="1" active>grade 1</MenuItem>
                                                <MenuItem eventKey="2">grade 2</MenuItem>
                                                <MenuItem eventKey="3">grade 3</MenuItem>
                                                <MenuItem eventKey="4">grade 4</MenuItem>
                                                <MenuItem eventKey="5">grade 5</MenuItem>
                                                <MenuItem eventKey="6">grade 6</MenuItem>
                                                <MenuItem eventKey="7">grade 7</MenuItem>
                                                <MenuItem eventKey="8">grade 8</MenuItem>
                                                <MenuItem eventKey="9">grade 9</MenuItem>
                                                <MenuItem eventKey="10">grade 10</MenuItem>
                                                <MenuItem eventKey="11">grade 11</MenuItem>
                                                <MenuItem eventKey="12">grade 12</MenuItem>
                                            </DropdownButton>
                                            <FormControl type="hidden" name='learningLevel' value={ lo.learningLevel } />
                                        </Col>
                                      </Row>
                                    </Grid>                           
                              </Col>                                  
                            </Row> 
                             <Row>
	                        <Col xs={12} sm={12} className='text-center' style={{paddingTop: 20}}>
	                          <Button id="updatelo-btn" bsStyle='xddgreen' onClick={ this._onUpdateLO.bind(this) }><Entity entity='updateLO'/></Button>
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
    );
  }
}
