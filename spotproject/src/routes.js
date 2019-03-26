import React from 'react';
import { Route, BrowserRouter, Router, Switch } from 'react-router-dom';
//import { ConnectedRouter } from 'react-router-redux';
import { ConnectedRouter } from 'connected-react-router';

import Main from './components/Main';
import ScrollToTop from './components/common/ScrollToTop';
import Preliminary from './components/form/pages/Preliminary';

import Forms from './components/form/pages/Forms';
import BasicInfo from './components/form/pages/BasicInfo';
import FamilyHistory from './components/form/pages/FamilyHistory';
import Questionss from './components/form/pages/Questionss';
import Review from './components/form/pages/Review';
import HealthData from './components/vitals/HealthData';
import showResults from "./components/form/showResults";

export default props => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path='/' component={ Main } />
        <Route exact path='/main' component={ Main } />
        <Route exact path='/preliminary' component={ Preliminary } />
        <Route exact path='/forms' component={ Forms } />
        <Route exact path='/basicInfo' component={ BasicInfo } />
        <Route exact path='/familyHistory' component={ FamilyHistory } />
        <Route exact path='/questions' component={ Questionss } />
        <Route exact path='/review' component={ Review } />
        <Route exact path='/vitals' component={ HealthData } />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
)
