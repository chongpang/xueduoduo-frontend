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

export default class LOThumb extends React.Component {

    back(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.goBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            los: [],
            allowAdd: true,
            allowCheck: true,
        };

        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    _onClick(e) {

        e.preventDefault();

        e.stopPropagation();

        this.props.parent.props.router.push('/teacher/lo/new');

    }

    _onChange(loid) {

        var self = this;

        var checkedLOs = self.props.parent.state.checkedLOs;

        var v = $('#' + loid).val();

        if ($('#' + loid).is(':checked')) {
            checkedLOs.push(self.getLOObj(loid));

        } else {
            checkedLOs.splice(self.getLOIndex(checkedLOs, loid), 1);
        }
        var checkAll = false;
        if (self.props.los.length == checkedLOs.length) {
            $('#select-all-los').prop('checked', true);
            checkAll = true;
        } else {
            $('#select-all-los').prop('checked', false);
        }

        self.props.parent.state.checkedLOs = checkedLOs;
        self.props.parent.state.checkAll = checkAll;

    }

    _onRemoveLO(loid) {
        var st = this.state;
        // remove from search result
        for (var i = st.los.length - 1; i >= 0; i--) {
            var index = this.getLOIndex(st.los, loid);
            if (index > -1) {
                st.los.splice(index, 1);
            }
        }

        this.setState(st);
    }

    getLOObj(loid) {

        for (var i = this.state.los.length - 1; i >= 0; i--) {
            if (this.state.los[i].id == loid) {
                return this.state.los[i];
            }
        }
    }

    getLOIndex(los, loid) {

        for (var i = los.length - 1; i >= 0; i--) {
            if (this.state.los[i].id == loid) {
                return i;
            }
        }
    }

    _onEditLO(loid) {
        this.props.parent.props.router.push('/teacher/lo/edit/' + loid);
    }

    render() {

        var self = this;

        if (self.props.los.length > 0) {
            self.state.los = self.props.los;
        }

        var len = self.state.los.length;
        if (typeof self.props.allowAdd !== 'undefined') {
            self.state.allowAdd = self.props.allowAdd;
        }
        if (typeof self.props.allowCheck !== 'undefined') {
            self.state.allowCheck = self.props.allowCheck;
        }

        if (len > 0) {
            var lothumb = self.state.los.map(function (mylo) {
                if (self.state.allowCheck) {
                    return (
                        <Col xs={12} sm={3} key={ mylo.id }>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody>
                                        <Checkbox id={ mylo.id } className="checkbox-lo"
                                                  onChange={self._onChange.bind(self, mylo.id)}>
                                            <div className='bg-orange thumb'>
                                                <a href="#"
                                                   onClick={ self._onEditLO.bind(self, mylo.id) }>{ mylo.title }</a>
                                            </div>
                                        </Checkbox>
                                    </PanelBody>
                                </Panel>
                            </PanelContainer>
                        </Col>
                    );
                } else {
                    return (
                        <Col xs={12} sm={3} key={ mylo.id }>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody>
                                        <div className='bg-orange thumb'>
                                            <a className="icon-ikons-close close-btn" href="#"
                                               onClick={ self._onRemoveLO.bind(self, mylo.id) }/>
                                            <a href="#" id={ mylo.id }
                                               onClick={ self._onEditLO.bind(self, mylo.id) }>{ mylo.title }</a>
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
                        { lothumb }
                        <Col xs={12} sm={3} style={{marginTop: 12}}>
                            <PanelContainer>
                                <Panel>
                                    <PanelBody className='thumb thumbAdd text-center'>
                                        <Button bsStyle='xddgreen' onClick={ self._onClick.bind(self) }><Entity
                                            entity='addLO'/></Button>
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
                        { lothumb }
                    </Row>
                </Grid>
            );
        }

    }
}
