import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Box, Heading, Text } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const nibpEndpoint = endpoint + 'NibpData';

export default class NibpData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      systolic: false,
      diastolic: false,
      map: false
    }
  }

  componentDidMount() {
    this.getNibpData();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getNibpData();
  }

  // Get heart rate from endpoint and append to array
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
