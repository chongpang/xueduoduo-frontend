import React from 'react';
import classNames from 'classnames';

var LOThumb = React.createClass({

  getInitialState: function(){
     return {
      los: [],
      allowAdd: true,
      allowCheck: true,
    }
  },

  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },

  _onClick: function(e) {

    e.preventDefault();

    e.stopPropagation();

    this.props.parent.transitionTo('/teacher/lo/new');

  },

  _onChange: function( loid ) {

    var checkedlos = this.props.parent.state.checkedLOs;

    var v = $('#' + loid).val();

    if ($('#' + loid).is(':checked')) {
      checkedlos.push(this.getLOObj(loid));
      
    }else{
      checkedlos.splice( this.getLOIndex(checkedlos,loid), 1 );
    }

    this.props.parent.setState({checkedLOs: checkedlos });

    if(this.props.los.length == this.props.parent.state.checkedLOs.length){
        $('#select-all-los').prop('checked', true);
        this.props.parent.setState({checkAll: true });
    }else{
        $('#select-all-los').prop('checked', false);
        this.props.parent.setState({checkAll: false });
    }

  },

  _onRemoveLO: function( loid ){
     var st = this.state;
    // remove from search result
    for (var i = st.los.length - 1; i >= 0; i--) {
      var index = this.getLOIndex(st.los, loid);
      if(index > -1){
        st.los.splice(index, 1);
      }
    }

    this.setState(st);
  },

  _onLOChange: function( flag ){

     var checkedLos = this.props.parent.state.checkedLOs;
     var st = this.state;
      if(flag){
        // add to course
        st.los.push.apply(st.los, checkedLos);

      }else if(flag == 0){

        // remove from search result
        for (var i = checkedLos.length - 1; i >= 0; i--) {
          var loid = checkedLos[i].id;
          var index = this.getLOIndex(st.los, loid);
          if(index > -1){
            st.los.splice(index, 1);
          }
        }
      }
      this.setState(st);
  },
  getLOObj: function(loid){

    for (var i = this.state.los.length - 1; i >= 0; i--) {
      if(this.state.los[i].id == loid){
        return this.state.los[i];
      } 
    }
  },

  getLOIndex: function(los , loid){

    for (var i = los.length - 1; i >= 0; i--) {
      if(this.state.los[i].id == loid){
        return i;
      } 
    }
  },

  getLOs : function(){
    return this.state.los;
  },

  setLos: function( los ){
    var st = this.state;
    st.los = los;
    this.setState(st);
  },

  _onEditLO: function(loid){
    this.props.parent.transitionTo('/teacher/lo/edit/' + loid);
  },

  render() {

    var len = this.state.los.length
    var lothumb = null;

    //if( typeof this.props.los !== 'undefined'){
    //  this.state.los = this.props.los;
    //}
    if(typeof this.props.allowAdd !== 'undefined'){
      this.state.allowAdd = this.props.allowAdd;
    }
    if(typeof this.props.allowCheck !== 'undefined'){
      this.state.allowCheck = this.props.allowCheck;
    }

    var self = this;

    if(len > 0){
      lothumb = this.state.los.map(function (mylo) {
        if(self.state.allowCheck){
            return (
              <Col xs={12} sm={3}>
                <PanelContainer>
                <Panel>
                  <PanelBody>
                    <Checkbox id={ mylo.id } className="checkbox-lo" onChange={self._onChange.bind(this, mylo.id)}>
                      <div className='bg-orange thumb'>
                      <a herf="#" onClick={ self._onEditLO.bind(self, mylo.id) }>{ mylo.title }</a>
                      </div>
                    </Checkbox>
                  </PanelBody>
                </Panel>
                </PanelContainer>
              </Col>
          );
        }else{
             return (
              <Col xs={12} sm={3}>
                <PanelContainer>
                <Panel>
                  <PanelBody>
                      <div className='bg-orange thumb'>
                      <a className="icon-ikons-close close-btn" herf="#" onClick={ self._onRemoveLO.bind(self, mylo.id ) }></a>
                      <a herf="#" id={ mylo.id } onClick={ self._onEditLO.bind(self, mylo.id) }>{ mylo.title }</a>
                      </div>
                  </PanelBody>
                </Panel>
                </PanelContainer>
              </Col>
          );         
        }


    });
    }
    if(this.state.allowAdd){
      return (
          <Grid>
            <Row>
            { lothumb }
            <Col xs={12} sm={3} style={{marginTop:12}}>
                <PanelContainer>
                <Panel>
                  <PanelBody className='thumb thumbAdd text-center'>
                     <Button bsStyle='xddgreen' onClick={ this._onClick }><Entity entity='addLO'/></Button>
                  </PanelBody>
                </Panel>
                </PanelContainer>
              </Col>
            </Row>
          </Grid>
      );      
    }else{
      return (
        <Grid>
          <Row>
            { lothumb }
          </Row>
        </Grid>
        );
    }

  }
});

module.exports = LOThumb;