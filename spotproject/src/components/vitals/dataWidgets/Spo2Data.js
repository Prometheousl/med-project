import React from 'react';
import axios from 'axios';
import { Box, Heading } from 'grommet';
import contactNurse from '../../../scripts/contactNurse';

const endpoint = 'http://127.0.0.1:3000/';
const spo2Endpoint = endpoint + 'Spo2Data';

/**
 * Component for spo2, or oxygen saturation (amount of oxygen in the blood).
 * It just displays the percentage.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
export default class Spo2Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** The oxygen saturation percentage */
      sat: false
    }
  }

  // sets up tick to be called every 3 seconds
  componentDidMount() {
    this.getSpo2Data();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getSpo2Data();
  }

  // Gets the oxygen saturation from the backend and stores it in state.
  getSpo2Data() {
    axios.get(spo2Endpoint)
      .then(res => {
        this.checkSpo(res.data.Sat);
        this.setState({ sat: res.data.Sat });
      })
  }

  checkSpo(spo) {
    if(spo > 0) {
      if(spo < 80)
        contactNurse("Your oxygen levels are too low!");
      if(spo > 100)
        contactNurse("Your oxygen levels are too high!");
    }
  }

  render() {
    return (
        <Box pad="none">
            <Heading alignSelf="center" size="large">{this.state.sat}%</Heading>
        </Box>
    )
  }
}
