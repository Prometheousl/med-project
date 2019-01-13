import React from 'react';
import axios from 'axios';
import { Box, Grid, Heading, Text } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const patientEndpoint = endpoint + 'PatientData';
const timeEndpoint = endpoint + 'SessionDate';
const heightEndpoint = endpoint + 'HeightData';
const weightEndpoint = endpoint + 'WeightData';
const bmiEndpoint = endpoint + 'BMIData';
const painEndpoint = endpoint + 'PainData';

/**
 * Component for the patient's data.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
export default class PatientData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** The full name of the patient (string) */
      fullName: false,
      /** The patient's number (int) */
      number: false,
      /** The patient's height (float) */
      height: false,
      /** The patient's weight (float) */
      weight: false,
      /** The patient's bmi (float) */
      bmi: false,
      /** The patient's perceived pain level (int) */
      pain: false,
      /** The current time (Time) */
      time: false
    }
  }

  // Sets up tick to be called every 3 seconds.
  componentDidMount() {
    this.getAllData();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getAllData();
  }

  // Gets each piece of data from the json backend and stores it in state
  getAllData() {
    this.getPatientData();
    this.getTime();
    this.getHeight();
    this.getWeight();
    this.getBMI();
    this.getPain();
  }

  // Gets the full name and number from the backend
  getPatientData() {
    axios.get(patientEndpoint)
      .then(res => {
        this.setState({
          fullName: res.data.FullName,
          number: res.data.Number
        });
      })
  }

  /**
    * Gets the current time from the backend, converts it to a proper
    *  format and then stores it in state
    */
  getTime() {
    axios.get(timeEndpoint)
      .then(res => {
        this.setState({ time: this.sanitizeTime(res.data.SessionDate) });
      })
  }

  getWeight() {
    axios.get(weightEndpoint)
      .then(res => {
        this.setState({
          weight: Math.round(res.data.Weight/453.59)
        });
      })
  }

  getBMI() {
    axios.get(bmiEndpoint)
      .then(res => {
        this.setState({
          bmi: res.data.BodyMassIndex
        });
      })
  }

  getPain() {
    axios.get(painEndpoint)
      .then(res => {
        this.setState({
          pain: res.data.PainIndex
        });
      })
  }

  getHeight() {
    axios.get(heightEndpoint)
      .then(res => {
        this.setState({
          height: res.data.Height/25.4
        });
      })
  }

  // Converts the time to a proper format to be displayed
  sanitizeTime(sessionDate) {
    var date = new String(sessionDate);
    return date.substring(0, date.length-6);
  }

  render() {
    return (
      <div>
        <Grid align="stretch"
          areas={[
            { name: 'identification', start: [0, 0], end: [1, 0] },
            { name: 'bodyInfo', start: [1, 0], end: [2, 0] },
            { name: 'time', start: [2, 0], end: [3, 0] },
          ]}
          columns={['flex', 'flex','flex']}
          rows={['full']}
          gap='small'

        >
          <Box gridArea="identification" >
            <Heading margin="xsmall" level={1}>{this.state.fullName} </Heading>
            <Heading margin="xsmall" color="status-critical" level={1} size="small">
              Pain:   {this.state.pain}
            </Heading>
            <br />
            <Text margin="xsmall"> number: {this.state.number} </Text> <br />
          </Box>
          <Box gridArea="bodyInfo" pad='xsmall'>
            <Text margin="xsmall" pad="none"> Height: {this.state.height}" </Text> <br />
            <Text margin="xsmall"> Weight: {this.state.weight}lbs </Text><br />
            <Text margin="xsmall"> BMI:    {this.state.bmi}    </Text><br />
          </Box>
          <Box gridArea="time" pad='xsmall'>
            Date:   {this.state.time}   <br />
          </Box>
        </Grid>
      </div>
    );
  }
}
