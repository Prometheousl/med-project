import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from 'grommet/components/App';
import Split from 'grommet/components/Split';
import NavSidebar from './NavSidebar';
import { navResponsive } from '../actions/nav';

import Dashboard from '../screens/Dashboard';
import Appointment from '../screens/Appointment';
import NewPatientPage from '../screens/NewPatientPage';
import ReasonPage from '../screens/ReasonPage';
import History from '../screens/History';
import InsurancePage from '../screens/InsurancePage';
import CardPage from '../screens/CardPage';
import VitalsPage from '../screens/VitalsPage';
import UrgentPage from '../screens/UrgentPage';
import EndPage from '../screens/EndPage';

import Login from '../screens/Login';
import Page1 from '../screens/Page1';
import CameraPage from '../screens/CameraPage';
import NoCameraPage from '../screens/NoCameraPage';
import Tasks from '../screens/Tasks';
import Task from '../screens/Task';
import NotFound from '../screens/NotFound';
import Page2 from '../screens/Page2';

class Main extends Component {
  constructor() {
    super();
    this._onResponsive = this._onResponsive.bind(this);
  }

  _onResponsive(responsive) {
    this.props.dispatch(navResponsive(responsive));
  }

  render() {
    const {
      nav: { active: navActive, enabled: navEnabled, responsive }
    } = this.props;
    const includeNav = (navActive && navEnabled);
    let nav;
    if (includeNav) {
      nav = <NavSidebar />;
    }
    const priority = (includeNav && responsive === 'single' ? 'left' : 'right');

    return (
      <App centered={false}>
        {/* Navigate to each prompt using Router*/}
        <Router>
          <Split
            priority={false}
            flex='right'
            onResponsive={this._onResponsive}
          >
            <Switch>
              <Route exact={true} path='/' component={Dashboard} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/login' component={Login} />
              <Route path='/reasonpage' component={ReasonPage} />
              <Route path='/camerapage' component={CameraPage} />
              <Route path='/nocamerapage' component={NoCameraPage} />
              <Route path='/page1' component={Page1} />
              <Route path='/page2' component={Page2} />
              <Route path='/endpage' component={EndPage} />
              <Route path='/urgentpage' component={UrgentPage} />
              <Route path='/insurancepage' component={InsurancePage} />
              <Route path='/cardpage' component={CardPage} />
              <Route path='/vitalspage' component={VitalsPage} />
              <Route path='/newpatientpage' component={NewPatientPage} />
              <Route path='/history' component={History} />
              <Route path='/appointment' component={Appointment} />
              <Route path='/tasks/:id' component={Task} />
              <Route path='/tasks' component={Tasks} />
              <Route path='/*' component={NotFound} />
            </Switch>
          </Split>
        </Router>
      </App>
    );
  }
}

Main.defaultProps = {
  nav: {
    active: true, // start with nav active
    enabled: true, // start with nav disabled
    responsive: 'multiple'
  }
};

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    active: PropTypes.bool,
    enabled: PropTypes.bool,
    responsive: PropTypes.string
  })
};

const select = state => ({
  nav: state.nav
});

export default connect(select)(Main);
