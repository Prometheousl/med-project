import React from 'react';
import axios from 'axios';
//import { Box, Grid, Heading, Text } from 'grommet';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const endpoint = 'http://127.0.0.1:3000/';
const patientEndpoint = endpoint + 'PatientData';
const timeEndpoint = endpoint + 'SessionDate';
const heightEndpoint = endpoint + 'HeightData';
const weightEndpoint = endpoint + 'WeightData';
const bmiEndpoint = endpoint + 'BMIData';
const painEndpoint = endpoint + 'PainData';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  mainFeaturedPost: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 4,
  },
  mainFeaturedPostContent: {
    padding: `${theme.spacing.unit * 6}px`,
    [theme.breakpoints.up('md')]: {
      paddingRight: 0,
    },
  },
  mainGrid: {
    marginTop: theme.spacing.unit * 3,
  },
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
});

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
          height: Math.round(res.data.Height/25.4)
        });
      })
  }

  // Converts the time to a proper format to be displayed
  sanitizeTime(sessionDate) {
    var date = new String(sessionDate);
    return date.substring(0, date.length-11);
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={6} sm={3}>
          <Typography align="left" color="secondary" variant="h6">
            Pain: {this.state.pain}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography align="left" variant="h6">
            Number: {this.state.number}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3} />
        <Grid item xs={6} sm={3}>
          <Typography align="left" variant="h6">
            Date: {this.state.time}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography align="left" variant="h6">
            Height: {this.state.height}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography align="left" variant="h6">
            Weight: {this.state.weight}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3} />
        <Grid item xs={6} sm={3}>
          <Typography align="left" variant="h6">
            BMI: {this.state.bmi}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
