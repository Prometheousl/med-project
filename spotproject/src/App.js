import React, { Component } from 'react';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';

import HealthData from './HealthData';

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
      <Grommet full theme={grommet}>
        <HealthData />
      </Grommet>
    );
  }
}

export default App;
