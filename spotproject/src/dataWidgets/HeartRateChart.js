import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Box, Heading, Text } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const heartRateEndpoint = endpoint + 'HeartRateData';
const nibpEndpoint = endpoint + 'NibpData';
const spo2Endpoint = endpoint + 'Spo2Data';

const timeEndpoint = endpoint + 'SessionData';

/**
 * Component for heart rate. Uses a line-chart to display heart rate.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
class HeartRateChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** An array of recorded heart rate data (bpm) */
      heartRates: [],
      /** The time that its corresponding heart-rate (by index) was recorded */
      times: []
    }
  }

  // Called at beginning. Sets up the function tick() to run every second.
  componentDidMount() {
    this.getHeartRateData();
    this.getTime();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  // Gets the heart rate and time data from the json backend
  tick() {
    this.getHeartRateData();
    this.getTime();
  }

  // Gets heart rate from endpoint and append to the heartRates array
  getHeartRateData() {
      axios.get(spo2Endpoint)
        .then(res => {
          console.log(res.data.HR);
          this.setState({ heartRates: [...this.state.heartRates, res.data.HR ]});
        })

  }

  // Gets the Time associated with heart rate and appends it to the times array
  getTime() {
    axios.get(timeEndpoint)
      .then(res => {
        this.setState({ times: [...this.state.times, this.sanitizeTime(res.data.SessionDate) ]});
      })
  }

  /**
    * Changes the time from the format...
    * Tue Mar 24 2015 19:05:43 GMT-0500 (Central Daylight Time)
    *   to 05:43 for clarity.
    *
    * @param sessionDate = The date to be converted
    */
  sanitizeTime(sessionDate) {
    var date = new Date(sessionDate);
    var m = date.getMinutes();
    var s = date.getSeconds();
    return m + ':' + s;
  }

  render() {
    var data = {
        labels: this.state.times,
        datasets: [
            {
                label: 'Heart Rate (bpm)',
                data: this.state.heartRates,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(138,7,7,0.4)',
                borderColor: 'rgba(138,7,7,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(138,7,7,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(138,7,7,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            }
        ]
    };

    return (
        <Box>
            <Heading alignSelf="center" margin="xsmall">Heart Rate</Heading>

            <Line data={data} />
        </Box>
    )
  }
}

export default HeartRateChart;
