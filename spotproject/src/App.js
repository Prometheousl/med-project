import React, { Component } from 'react';
import { Grommet } from 'grommet';
import { grommet, dark } from 'grommet/themes';

import HealthData from './HealthData';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

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
