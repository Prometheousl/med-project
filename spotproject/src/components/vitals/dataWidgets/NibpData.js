import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Box, Heading, Text } from 'grommet';
import contactNurse from '../../../scripts/contactNurse';

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
        var sys = Math.round(res.data.Systolic/100);
        var dia = Math.round(res.data.Diastolic/100);
        this.checkNibp(sys,dia);
        this.setState({
          systolic: sys,
          diastolic: dia,
          map: Math.round(res.data.Map/100)
        });
      })
  }

  checkNibp(systolic, diastolic) {
    if(((systolic / diastolic) > (140 / 90)) && systolic > 0 && diastolic > 0)
      contactNurse("Blood pressure too high!");
  }

  render() {
    return (
        <Box pad="none">
            <Heading alignSelf="center" size="large">{this.state.systolic}/{this.state.diastolic}</Heading>
            <Text alignSelf="center" margin="xsmall"> SYS/DIA mmHg (MAP {this.state.map}) </Text>
        </Box>
    )
  }
}
