import React from 'react';
import {withRouter} from 'react-router';


import {
    Row,
    Col,
    Grid,
    Panel,
    PanelBody,
    PanelContainer,

} from '@sketchpixy/rubix';

@withRouter
export default class ClassThumb extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedClassId:  null,
      classes: []
    };

    this._setClasses.bind(this);
  }
  back(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.goBack();
  }

  onOpenClass(id){
    this.state.selectedClassId = id;

    var utype = localStorage.getItem('user_type');
    if(utype == "0"){
      this.props.router.push(this.getPath('learner/class/' + this.state.selectedClassId ));

    }else{
      this.props.router.push(this.getPath('teacher/class/' + this.state.selectedClassId ));
    }

  }

  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  _setClasses(classes){

      this.setState({classes: classes});
  }

  render() {

    var len = this.props.classes.length

    if( len > 0){
      this.state.classes = this.props.classes;
    }

    var self = this;

    var classthumb = this.state.classes.map(function (myclass) {
      return (
            <Col xs={12} sm={4}>
              <PanelContainer>
              <Panel>
                <PanelBody className='bg-orange thumb'>
                  <a style={{cursor: 'pointer'}} id= { myclass.id } herf="#" onClick={ self.onOpenClass.bind(self, myclass.id) }>{ myclass.title }</a>
                </PanelBody>
              </Panel>
              </PanelContainer>
            </Col>
      );
    });

    var action = this.props.action;

    return (
		<Grid>
           <Row>
            { classthumb }
            { action }
          </Row>
        </Grid>
    );
  }
}
