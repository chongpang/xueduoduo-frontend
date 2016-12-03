import React from 'react';
import {Entity} from '@sketchpixy/rubix/lib/L20n';

import {
    Row,
    Col,
    Grid,
    Panel,
    Button,
    Checkbox,
    PanelBody,
    PanelContainer,

} from '@sketchpixy/rubix';

var store = require('store');

export default class ClassThumb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            allowAdd: true,
            allowCheck: true,
        };

        this.setCourses.bind(this);
    }

    _onClick(e) {

        e.preventDefault();

        e.stopPropagation();

        this.props.parent.props.router.push('/teacher/course/new');

    }

    _onChange(courseid) {

        var self = this;

        var checkedCourses = self.props.parent.state.checkedCourses;

        if ($('#' + courseid).is(':checked')) {
            checkedCourses.push(self.getCourseById(courseid));

        } else {
            checkedCourses.splice(self.getCourseIndex(checkedCourses, courseid), 1);
        }

        self.props.parent.state.checkedCourses = checkedCourses;

        if (self.state.courses.length == self.props.parent.state.checkedCourses.length) {
            $('#select-all-course').prop('checked', true);
            self.props.parent.checkAll = true;
        } else {
            $('#select-all-course').prop('checked', false);
            self.props.parent.checkAll = false;
        }

    }

    _onRemoveCourse(cid) {

        var self = this;
        var courses = this.state.courses;
        // remove from search result
        for (var i = courses.length - 1; i >= 0; i--) {
            var index = self.getCourseIndex(courses, cid);
            if (index > -1) {
                courses.splice(index, 1);
            }
        }

        self.setState({courses: courses});
    }

    getCourseById(cid) {

        for (var i = this.state.courses.length - 1; i >= 0; i--) {
            if (this.state.courses[i].id == cid) {
                return this.state.courses[i];
            }
        }
    }

    getCourseIndex(courses, cid) {

        var self = this;

        for (var i = courses.length - 1; i >= 0; i--) {
            if (self.state.courses[i].id == cid) {
                return i;
            }
        }
    }

    getCourses() {
        return this.state.courses;
    }

    setCourses(courses) {
        var st = this.state;
        st.courses = courses;
        this.setState(st);
    }

    _onEditCourse(cid) {

        if (1 == store.get('user_type')) {

            this.props.parent.props.router.push('/teacher/course/edit/' + cid);
        }

    }

    render() {

        if (this.props.courses && this.props.courses.length > 0) {
            this.state.courses = this.props.courses;
        }

        if (typeof this.props.allowAdd !== 'undefined') {
            this.state.allowAdd = this.props.allowAdd;
        }
        if (typeof this.props.allowCheck !== 'undefined') {
            this.state.allowCheck = this.props.allowCheck;
        }

        var self = this;
        var len = this.state.courses.length;
        if (len > 0) {
            var coursethumb = this.state.courses.map(function (mycourse) {
                if (self.state.allowCheck) {
                    return (
                        <Col xs={12} sm={3}
                             key={ "course-" + mycourse.id + (new Date().getTime().toString(16) + Math.floor(3000 * Math.random()).toString(16) )}>
                            <PanelContainer>
                                <Panel className="bg-hoverblue">
                                    <PanelBody>
                                        <Checkbox id={ mycourse.id } className="checkbox-course"
                                                  onChange={self._onChange.bind(self, mycourse.id)}>
                                            <div className='bg-orange thumb'>
                                                <a href="#"
                                                   onClick={ self._onEditCourse.bind(self, mycourse.id) }>{ mycourse.title }</a>
                                            </div>
                                        </Checkbox>
                                    </PanelBody>
                                </Panel>
                            </PanelContainer>
                        </Col>
                    );
                } else {
                    return (
                        <Col xs={12} sm={3}
                             key={ "course-" + mycourse.id + (new Date().getTime().toString(16) + Math.floor(3000 * Math.random()).toString(16) )}>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody>
                                        <div className='bg-orange thumb'>
                                            <a className="icon-ikons-close close-btn" href="#"
                                               onClick={ self._onRemoveCourse.bind(self, mycourse.id) }/>
                                            <a href="#"
                                               onClick={ self._onEditCourse.bind(self, mycourse.id) }>{ mycourse.title }</a>
                                        </div>
                                    </PanelBody>
                                </Panel>
                            </PanelContainer>
                        </Col>
                    );
                }

            });
        }

        if (self.state.allowAdd) {
            return (
                <Grid>
                    <Row>
                        { coursethumb }
                        <Col xs={6} sm={3}>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody className='thumb thumbAdd text-center'>
                                        <Button style={{marginTop: 15}} bsStyle='xddgreen'
                                                onClick={ self._onClick.bind(self) }><Entity
                                            entity='addCourse'/></Button>
                                    </PanelBody>
                                </Panel>
                            </PanelContainer>
                        </Col>
                    </Row>
                </Grid>
            );
        } else {
            return (
                <Grid>
                    <Row>
                        { coursethumb }
                    </Row>
                </Grid>
            );
        }
    }
}
