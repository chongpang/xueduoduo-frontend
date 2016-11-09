import React from 'react';

import {IndexRoute, Route} from 'react-router';

import {Grid, Row, Col, MainContainer} from '@sketchpixy/rubix';

/* Common Components */

/* Pages */
import Login from './routes/Login';
import Signup from './routes/Signup';
import TeacherDashBoard from './routes/Teacher.dashboard';

class App extends React.Component {
    render() {
        return (
            <MainContainer {...this.props}>
                <Sidebar />
                <Header />
                <div id='body'>
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                {this.props.children}
                            </Col>
                        </Row>
                    </Grid>
                </div>
                <Footer />
            </MainContainer>
        );
    }
}

/**
 * Includes Sidebar, Header and Footer.
 */
const routes = (
    <Route component={App}>
    </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
    <Route>
        <Route path='signin' component={Login}/>
        <Route path='signup' component={Signup}/>
        <Route path='teacher/dashboard' component={TeacherDashBoard} />

    </Route>
);

const combinedRoutes = (
    <Route>
        <Route>
            {routes}
        </Route>
        <Route>
            {basicRoutes}
        </Route>
    </Route>
);

export default (
    <Route>
        <Route path='/' component={Login}/>

        <Route path='/ltr'>
            {combinedRoutes}
        </Route>
        <Route path='/rtl'>
            {combinedRoutes}
        </Route>
    </Route>
);
