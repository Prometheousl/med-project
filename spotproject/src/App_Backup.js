import React, { Component } from 'react';
import { Provider } from "react-redux";
//import { Values } from 'redux-form-website-template';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import store from "./store";
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';

import HealthData from './HealthData';
import Form from "./form/Form";
import showResults from "./form/showResults";

/**
 * Top-level component for the application.
 * Uses Grommet for now, a React styling package.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Form onSubmit={showResults}/>
          //<Grommet full theme={grommet}>
            //<HealthData />
          //</Grommet>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
