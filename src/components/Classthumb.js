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
            selectedClassId: null,
            classes: []
        };

        this.setClasses.bind(this);
    }

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    onOpenClass(id) {
        this.state.selectedClassId = id;

        var utype = localStorage.getItem('user_type');
        if (utype == "0") {
            this.props.router.push('/learner/class/' + this.state.selectedClassId);

        } else {
            this.props.router.push('/teacher/class/' + this.state.selectedClassId);
        }

    }

    setClasses(classes) {

        this.setState({classes: classes});
    }

    render() {


        if (this.props.classes && this.props.classes.length > 0) {
            this.state.classes = this.props.classes;
        }

        var self = this;

        var classthumb = this.state.classes.map(function (myclass) {
            return (
                <Col xs={12} sm={4}
                     key={"class-" + (new Date().getTime().toString(16) + Math.floor(3000 * Math.random()).toString(16))  }>
                    <PanelContainer>
                        <Panel>
                            <PanelBody className='bg-orange thumb'>
                                <a style={{cursor: 'pointer'}} id={ myclass.id } href="#"
                                   onClick={ self.onOpenClass.bind(self, myclass.id) }>{ myclass.title }</a>
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
