import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import Main from './components/Main';
import ScrollToTop from './components/common/ScrollToTop';

import Preliminary from './components/form/pages/Preliminary';
import BasicInfo from './components/form/pages/BasicInfo';
import FamilyHistory from './components/form/pages/FamilyHistory';
import Questionss from './components/form/pages/Questionss';
import Review from './components/form/pages/Review';
import Signup from './components/form/Signup';
import HealthData from './components/vitals/HealthData';
import Form from "./components/form/Form";
import showResults from "./components/form/showResults";

export default props => (
  <HashRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path='/' component={ Main } />
        <Route exact path='/main' component={ Main } />
        <Route exact path='/preliminary' component={ Preliminary } />
        <Route exact path='/basicInfo' component={ BasicInfo } />
        <Route exact path='/familyHistory' component={ FamilyHistory } />
        <Route exact path='/questions' component={ Questionss } />
        <Route exact path='/review' component={ Review } />
        <Route exact path='/signup' component={ Signup } />
        <Route exact path='/form' component={ Form } onSubmit={ showResults }/>
        <Route exact path='/vitals' component={ HealthData } />
      </Switch>
    </ScrollToTop>
  </HashRouter>
)
