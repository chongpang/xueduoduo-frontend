import React from 'react';

import {
    Row,
    Col,
    Grid,
    Panel,
    Checkbox,
    PanelBody,
    PanelContainer,

} from '@sketchpixy/rubix';

export default class ClassThumb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: null,
            allowAdd: true,
            allowCheck: true,
        };

        this.setCourses.bind(this);
    }

    _onClick(e) {

        e.preventDefault();

        e.stopPropagation();

        this.props.router.push('/teacher/course/new');

    }

    _onChange(courseid) {

        var checkedCourses = this.props.parent.state.checkedCourses;

        if ($('#' + courseid).is(':checked')) {
            checkedCourses.push(this.getCourseById(courseid));

        } else {
            checkedCourses.splice(this.getCourseIndex(checkedCourses, courseid), 1);
        }

        this.props.parent.setState({checkedCourses: checkedCourses});

        if (this.state.courses.length == this.props.parent.state.checkedCourses.length) {
            $('#select-all-course').prop('checked', true);
            this.props.parent.setState({checkAll: true});
        } else {
            $('#select-all-course').prop('checked', false);
            this.props.parent.setState({checkAll: false});
        }

    }

    _onRemoveCourse(cid) {
        var st = this.state;
        // remove from search result
        for (var i = st.courses.length - 1; i >= 0; i--) {
            var index = this.getCourseIndex(st.courses, cid);
            if (index > -1) {
                st.courses.splice(index, 1);
            }
        }

        this.setState(st);
    }

    _onCourseChange(flag) {

        var checkedCourses = this.props.parent.state.checkedCourses;
        var st = this.state;
        if (flag) {
            // add to course
            st.courses.push.apply(st.courses, checkedCourses);

        } else if (flag == 0) {

            // remove from search result
            for (var i = checkedCourses.length - 1; i >= 0; i--) {
                var cid = checkedCourses[i].id;
                var index = this.getCourseIndex(st.courses, cid);
                if (index > -1) {
                    st.courses.splice(index, 1);
                }
            }
        }
        this.setState(st);
    }

    getCourseById(cid) {

        for (var i = this.state.courses.length - 1; i >= 0; i--) {
            if (this.state.courses[i].id == cid) {
                return this.state.courses[i];
            }
        }
    }

    getCourseIndex(courses, cid) {

        for (var i = courses.length - 1; i >= 0; i--) {
            if (this.state.courses[i].id == cid) {
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

        if (1 == localStorage.getItem('user_type')) {

            this.props.router.push('/teacher/course/edit/' + cid);
        }

    }

    render() {

        if (this.props.courses.length > 0) {
            this.state.courses = this.props.courses
        }

        var len = this.state.courses.length

        if (typeof this.props.allowAdd !== 'undefined') {
            this.state.allowAdd = this.props.allowAdd;
        }
        if (typeof this.props.allowCheck !== 'undefined') {
            this.state.allowCheck = this.props.allowCheck;
        }

        var coursethumb = null;
        var self = this;

        if (len > 0) {
            coursethumb = this.state.courses.map(function (mycourse) {
                if (self.state.allowCheck) {
                    return (
                        <Col xs={12} sm={3} key={ mycourse.id }>
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
                        <Col xs={12} sm={3} key={ mycourse.id }>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody>
                                        <div className='bg-orange thumb'>
                                            <a className="icon-ikons-close close-btn" href="#"
                                               onClick={ self._onRemoveCourse.bind(self, mycourse.id) }></a>
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

        if (this.state.allowAdd) {
            return (
                <Grid>
                    <Row>
                        { coursethumb }
                        <Col sx={6} sm={3}>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody className='thumb thumbAdd text-center'>
                                        <Button style={{marginTop: 15}} bsStyle='xddgreen'
                                                onClick={ this._onClick }><Entity entity='addCourse'/></Button>
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
