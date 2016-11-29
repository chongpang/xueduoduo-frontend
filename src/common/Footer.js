import React from 'react';
import {Entity} from '@sketchpixy/rubix/lib/L20n';
import {
    Row,
    Col,
    Grid
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
            <Grid className="text-center">
                <Row>
                    <Col xs={12} sm={12} className='beian_info'>
                        <a target="_blank" href="http://www.xueduoduo.io"><Entity entity='companyName'/> -
                            v{this.state.version}</a><br/>
                        <a target="_blank" href="http://www.miibeian.gov.cn/">粤ICP备16072087号</a>
                    </Col>
                </Row>
            </Grid>
        );
    }
}