import React, { Component } from 'react';
import { Provider } from "react-redux";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { persistor, store } from "./store";
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import Routes from './routes'
import { PersistGate } from 'redux-persist/integration/react';

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
            <Routes />
          </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
