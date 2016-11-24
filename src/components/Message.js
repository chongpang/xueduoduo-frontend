import React from 'react';
import {withRouter} from 'react-router';
import classNames from 'classnames';

import {Entity} from '@sketchpixy/rubix/lib/L20n';

import {
    Row,
    Col,
    Grid,
    Panel,
    Alert,
    Image,
    AlertLink,
    PanelBody,
    PanelContainer,
    MainContainer

} from '@sketchpixy/rubix';

@withRouter
export default class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: {
                header: "",
                body: "",
                linktext: "",
                link: "",
                className: "alert-success"
            }
        };
    }

    setMessage(msg) {
        this.setState({message: msg});
    }

    render() {

        if (this.props.message) {
            this.state.message = this.props.message;
        }

        var classes = classNames({
            'container-open': this.props.open,
        });

        return (
            <MainContainer id='container' className={classes}>
                <Col id="content" xs={12} sm={4} style={{padding: 10}} className="col-sm-offset-4">
                    <Grid>
                        <Row className='text-center'>
                            <Col sm={5} smOffset={3} xs={6} xsOffset={3} collapseLeft collapseRight>
                                <Image src='/imgs/logo.png' className='img-responsive' alt='xueduoduo'/>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{marginTop: 35}}>
                                <PanelContainer>
                                    <Panel>
                                        <PanelBody>
                                            <Grid>
                                                <Row>
                                                    <Col xs={12} style={{marginTop: 25}}>
                                                        <Alert className={this.state.message.className}>
                                                            <strong>{this.state.message.header}</strong> {this.state.message.body}<AlertLink
                                                            href={this.state.message.link}>{this.state.message.linktext}</AlertLink><Entity
                                                            entity="endmark"/>
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
                </Col>
            </MainContainer>
        );
    }
}
