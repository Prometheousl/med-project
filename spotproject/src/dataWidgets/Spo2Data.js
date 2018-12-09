import React from 'react';
import axios from 'axios';
import { Box, Heading } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const spo2Endpoint = endpoint + 'Spo2Data';

export default class NibpData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sat: false
    }
  }

  componentDidMount() {
    this.getSpo2Data();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getSpo2Data();
  }

  // Get heart rate from endpoint and append to array
  getSpo2Data() {
    axios.get(spo2Endpoint)
      .then(res => {
        this.setState({ sat: res.data.Sat });
      })
  }

  render() {
    return (
        <Box pad="none">
            <Heading alignSelf="start" size="small" margin="xsmall">Spo2</Heading>
            <Heading alignSelf="center" size="large">{this.state.sat}%</Heading>
        </Box>
    )
  }
}
