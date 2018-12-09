import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Box, Heading, Text } from 'grommet';

const endpoint = 'http://127.0.0.1:3000/';
const heartRateEndpoint = endpoint + 'HeartRateData';
const timeEndpoint = endpoint + 'SessionData';

class HeartRateChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heartRates: [],
      times: []
    }
  }

  componentDidMount() {
    this.getHeartRateData();
    this.getTime();

    this.timerID = setInterval(() => this.tick(),3000); // call every second
  }

  tick() {
    this.getHeartRateData();
    this.getTime();
  }

  // Get heart rate from endpoint and append to array
  getHeartRateData() {
    axios.get(heartRateEndpoint)
      .then(res => {
        this.setState({ heartRates: [...this.state.heartRates, res.data.Hr ]});
      })
  }

  // Get Time associated with heart rate and append to array
  getTime() {
    axios.get(timeEndpoint)
      .then(res => {
        this.setState({ times: [...this.state.times, this.sanitizeTime(res.data.SessionDate) ]});
      })
  }

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
