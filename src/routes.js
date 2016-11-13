import React from 'react';

import {IndexRoute, Route} from 'react-router';

import {MainContainer} from '@sketchpixy/rubix';

/* Common Components */

/* Pages */
import Login from './routes/Login';
import Signup from './routes/Signup';

import Header from './common/Header';
import Footer from './common/Footer';
import TeacherDashBoard from './routes/Teacher.dashboard';
import NewClass from './routes/New.class';

class App extends React.Component {
    render() {
        return (
            <MainContainer {...this.props}>
                <Header/>
                <div id='body'>
                    {this.props.children}
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
        <Route path='teacher/dashboard' component={TeacherDashBoard}/>
        <Route path='teacher/class/new' component={NewClass} />
    </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
    <Route>
        <Route path='signin' component={Login}/>
        <Route path='signup' component={Signup}/>
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
