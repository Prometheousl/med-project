import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Box, Heading, Text } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const nibpEndpoint = endpoint + 'NibpData';

/**
 * Component for pressure. Displays the systolic, diastolic, and MAP
 *  (systolic/diastolic) readings from the device.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
export default class NibpData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** The systolic pressure (float) */
      systolic: false,
      /** The diastolic pressure (float) */
      diastolic: false,
      /** The map pressure (float) */
      map: false
    }
  }

  // Sets tick to be called every 3 seconds
  componentDidMount() {
    this.getNibpData();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getNibpData();
  }

  // Gets the pressure data from the json backend and stores it in state.
  getNibpData() {
    axios.get(nibpEndpoint)
      .then(res => {
        this.setState({
          systolic: Math.round(res.data.Systolic/100),
          diastolic: Math.round(res.data.Diastolic/100),
          map: Math.round(res.data.Map/100)
        });
      })
  }

  render() {
    return (
        <Box pad="none">
            <Heading alignSelf="start" size="small" margin="xsmall">Nibp</Heading>
            <Heading alignSelf="center" size="large">{this.state.systolic}/{this.state.diastolic}</Heading>
            <Text alignSelf="start" margin="xsmall"> SYS/DIA mmHg (MAP {this.state.map}) </Text>
        </Box>
    )
  }
}
