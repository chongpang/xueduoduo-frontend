import React from 'react';
import classNames from 'classnames';



var Message = React.createClass({

  getInitialState: function(){
    return {
      message: {
        header:"",
        body:"",
        linktext:"",
        link:"",
        className:"alert-success"
      }
    }
  },

  componentDidMount: function() {


  },
  componentWillUnmount: function() {
  },

  setMessage: function(msg){
  	this.setState({message: msg});
  },

  render: function() {

  	if(this.props.message){
  		this.state.message = this.props.message;
  	}
    return (
        <Grid>
        <Row className='text-center'>
          <Col xs={12} sm={12} className='col-center'>
            <NavHeader>
              <NavBrand>
                <img src='/imgs/xdd.png' class="img-responsive" alt='xueduoduo' width={240}/>
              </NavBrand>
            </NavHeader>
          </Col>
        </Row>
        <Row>
          <Col style={{marginTop:35}}>
            <PanelContainer>
               <Panel>
                  <PanelBody>
                    <Grid>
                      <Row>
                        <Col xs={12} style={{marginTop:25}}>
                          <Alert className={this.state.message.className}>
                            <strong>{this.state.message.header}</strong> {this.state.message.body}<AlertLink href={this.state.message.link}>{this.state.message.linktext}</AlertLink><Entity entity="endmark" />
                          </Alert>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelBody>
               </Panel>
            </PanelContainer>
          </Col>
        </Row>
        </Grid>
    );
  }
});

module.exports = Message;
