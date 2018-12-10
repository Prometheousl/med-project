import React from 'react';
import axios from 'axios';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Box, Grid, Heading, Text } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const patientEndpoint = endpoint + 'PatientData';
const timeEndpoint = endpoint + 'SessionDate';
const heightEndpoint = endpoint + 'HeightData';
const weightEndpoint = endpoint + 'WeightData';
const bmiEndpoint = endpoint + 'BMIData';
const painEndpoint = endpoint + 'PainData';

export default class PatientData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: false,
      number: false,
      height: false,
      weight: false,
      bmi: false,
      pain: false,
      time: false
    }
  }

  componentDidMount() {
    this.getAllData();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getAllData();
  }

  getAllData() {
    this.getPatientData();
    this.getTime();
    this.getHeight();
    this.getWeight();
    this.getBMI();
    this.getPain();
  }

  // Get heart rate from endpoint and append to array
  getPatientData() {
    axios.get(patientEndpoint)
      .then(res => {
        this.setState({
          fullName: res.data.FullName,
          number: res.data.Number
        });
      })
  }

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
          weight: res.data.Weight
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
          height: res.data.Height
        });
      })
  }

  sanitizeTime(sessionDate) {
    /*var date = new Date(sessionDate);
    var m = date.getMinutes();
    var s = date.getSeconds();
    return m + ':' + s;*/
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
            <Text margin="xsmall" pad="none"> Height: {this.state.height} </Text> <br />
            <Text margin="xsmall"> Weight: {this.state.weight} </Text><br />
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
