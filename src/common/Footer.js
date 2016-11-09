import React from 'react';

import {
    Row,
    Col,
    Grid,
    MainContainer
} from '@sketchpixy/rubix';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      version: 0
    };
  }
  componentDidMount() {
    this.setState({
      version: document.getElementsByTagName('body')[0].getAttribute('data-version')
    });
  }
  render() {
    return (
      <MainContainer id='footer'>
        <Grid><Row>
        <Col xs={12} sm={12} className='beian_info'>
            <a target="_blank" href="http://www.xueduoduo.io"><Entity entity='companyName'/> - v{this.state.version}</a><br/>
            <a target="_blank" href="http://www.miibeian.gov.cn/">粤ICP备16072087号</a>
        </Col>
        </Row></Grid>
      </MainContainer>
    );
  }
}