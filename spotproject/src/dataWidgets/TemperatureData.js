import React from 'react';
import axios from 'axios';
import { Box, Heading } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const spo2Endpoint = endpoint + 'TemperatureData';

/**
 * Component for temperature.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
export default class TemperatureData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: false
    }
  }

  // sets up tick to be called every 3 seconds
  componentDidMount() {
    this.getTempData();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getTempData();
  }

  // Gets the temperature from the backend and stores it in state.
  getTempData() {
    axios.get(spo2Endpoint)
      .then(res => {
        this.setState({
          temp: Math.round(res.data.Temperature - 210) });
      })
  }

  render() {
    return (
        <Box pad="none">
            <Heading alignSelf="start" size="small" margin="xsmall">Temperature</Heading>
            <Heading alignSelf="center" size="large">{this.state.temp}°F</Heading>
        </Box>
    )
  }
}
