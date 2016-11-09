import React from 'react';
import classNames from 'classnames';

var StudentThumb = React.createClass({

  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },

  _onClick: function(e) {

    e.preventDefault();

    e.stopPropagation();

    //this.props.parent.transitionTo('/teacher/newlo');

  },
  _onChange: function( loid ) {

  },


  render() {
    var len = this.props.students.length
    var stuthumb = null;
    var self = this;
    if(len > 0){
      stuthumb = this.props.students.map(function (stu) {
        return (
          <Col sm={6}>
            <PanelContainer>
            <Panel>
              <PanelBody>
                  <div className='bg-orange loThumb'>
                  <a herf="#">{ stu.title }</a>
                  </div>
              </PanelBody>
            </Panel>
            </PanelContainer>
          </Col>
      );

    });
    }

    return (
		<Grid>
          <Row>
          { lothumb }
          <Col sm={6}>
              <PanelContainer>
              <Panel>
                <PanelBody className='classThumb classThumbAdd text-center'>
                   <Button lg style={{marginTop: 15}} bsStyle='xddgreen' onClick={ this._onClick }><Entity entity='inviteStudent'/></Button>
                </PanelBody>
              </Panel>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
    );
  }
});

module.exports = LOThumb;
