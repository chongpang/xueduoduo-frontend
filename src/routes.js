import React from 'react';

import {IndexRoute, Route} from 'react-router';

import {MainContainer} from '@sketchpixy/rubix';

/* Common Components */

/* Pages */
import Login from './routes/Login';
import Signup from './routes/Signup';
import SignupViaInvite from 'routes/Signup.via.invite';
import Confirm from 'routes/Signup.confirm';

import Header from './common/Header';
import Footer from './common/Footer';
import TeacherDashBoard from './routes/Teacher.dashboard';
import NewClass from './routes/New.class';
import ViewClass from './routes/Class';
import EditClass from './routes/Edit.class';
import NewCourse from './routes/New.course';
import EditCourse from './routes/Edit.course';
import ViewCourse from './routes/New.course';

import LearnerClass from 'routes/Learner.class';
import LearnerDashBoard from './routes/Learner.dashboard';
import LearnerLearn from './routes/Learner.learn';

import JoinClass from 'routes/Join.class';

import NewLO from './routes/New.lo';
import EditLO from './routes/Edit.lo';
import ViewLO from 'routes/New.lo';

import WeixinLogin from 'routes/Weixin.login';
import QQLogin from 'routes/QQ.login';

class App extends React.Component {
    render() {
        return (
            <MainContainer {...this.props}>
                <Header/>
                <div>
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
        <Route path='teacher/class/:cid' component={ViewClass} />
        <Route path='teacher/class/edit/:cid' component={EditClass} />

        <Route path='teacher/course/new' component={NewCourse} />
        <Route path='teacher/course/edit/:cid' component={EditCourse} />
        <Route path='teacher/course/:cid' component={ViewCourse} />

        <Route path='teacher/lo/new' component={NewLO} />
        <Route path='teacher/lo/edit/:loid' component={EditLO} />
        <Route path='teacher/lo/:loid' component={ViewLO} />

        <Route path='learner/dashboard' component={LearnerDashBoard} />
        <Route path='learner/class/:cid' component={LearnerClass} />
        <Route path='learner/learn/:cid' component={LearnerLearn} />

        <Route path='parent/dashboard' component={TeacherDashBoard} />

    </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
    <Route>
        <Route path='signupviainvite' component={SignupViaInvite} />
        <Route path='confirm' component={Confirm} />
        <Route path='signin' component={Login}/>
        <Route path='signup' component={Signup}/>
        <Route path='weixinlogin' component={WeixinLogin} />
        <Route path='qqlogin' component={QQLogin} />
        <Route path='learner/joinclass' component={JoinClass} />
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
        { combinedRoutes }

    </Route>
);
