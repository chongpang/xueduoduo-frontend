import React from 'react';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import {
    Row,
    Col,
    Grid,
    Button,
    Panel,
    PanelBody,
    PanelContainer,

} from '@sketchpixy/rubix';

export default class Studentthumb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    _onClick(e) {

        e.preventDefault();

        e.stopPropagation();

    }

    render() {
        var len = this.props.students.length;
        var stuthumb = null;
        var self = this;
        if (len > 0) {
            stuthumb = self.props.students.map(function (stu) {
                return (
                    <Col sm={6}>
                        <PanelContainer>
                            <Panel>
                                <PanelBody>
                                    <div className='bg-orange loThumb'>
                                        <a href="#">{ stu.title }</a>
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
                                    <Button lg style={{marginTop: 15}} bsStyle='xddgreen'
                                            onClick={ this._onClick.bind(this) }><Entity
                                        entity='inviteStudent'/></Button>
                                </PanelBody>
                            </Panel>
                        </PanelContainer>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
