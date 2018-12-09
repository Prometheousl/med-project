import React from 'react';
import { Box, Grid } from 'grommet';

import HeartRateChart from './dataWidgets/HeartRateChart';
import PatientData from './dataWidgets/PatientData';
import NibpData from './dataWidgets/NibpData';
import Spo2Data from './dataWidgets/Spo2Data';
import TemperatureData from './dataWidgets/TemperatureData';

export default class HealthData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthData: false
    }
  }

  render() {
    return (
      <div>
        <Grid align="stretch"
          areas={[
            { name: 'patientData', start: [0, 0], end: [2, 0] },
            { name: 'heartData', start: [0, 1], end: [1, 1] },
            { name: 'nibpData', start: [1, 1], end: [2, 1] },
            { name: 'spo2Data', start: [0, 2], end: [1, 2] },
            { name: 'tempData', start: [1, 2], end: [2, 2] },
          ]}
          columns={['flex', 'flex']}
          rows={['small', 'flex', 'flex']}
          gap='small'

        >
          <Box gridArea="patientData" pad='xsmall'>
            <PatientData />
          </Box>
          <Box gridArea="heartData" border={{ color: 'brand', size: 'xsmall' }} pad='xsmall'>
            <HeartRateChart />
          </Box>
          <Box gridArea="nibpData" border={{ color: 'brand', size: 'xsmall' }} pad='xsmall'>
            <NibpData />
          </Box>
          <Box gridArea="spo2Data" border={{ color: 'brand', size: 'xsmall' }} pad='xsmall'>
            <Spo2Data />
          </Box>
          <Box gridArea="tempData" border={{ color: 'brand', size: 'xsmall' }} pad='xsmall'>
            <TemperatureData />
          </Box>
        </Grid>
      </div>
    );
  }
}
