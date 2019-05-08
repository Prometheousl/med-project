import React from 'react';
import axios from 'axios';
//import {Line} from 'react-chartjs-2';
import { Box, Heading, Text } from 'grommet';

import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';

import contactNurse from '../../../scripts/contactNurse';

const endpoint = 'http://127.0.0.1:3000/';
const heartRateEndpoint = endpoint + 'HeartRateData';
const nibpEndpoint = endpoint + 'NibpData';
const spo2Endpoint = endpoint + 'Spo2Data';

const timeEndpoint = endpoint + 'SessionDate';

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
      times: [],
      data: [],
      validHR: true
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
    console.log(this.state.validHR);
    if(this.state.validHR) {
      this.getTime();
      this.setState({  data: this.constructData()});
    }
    //console.log(this.state);
    //this.setState({ heartRates: [100,90,89,78,53,56,65],
                    //times:      [0, 1, 2, 3, 4, 5, 6]});
  }

  // Gets heart rate from endpoint and append to the heartRates array
  getHeartRateData() {
      axios.get(spo2Endpoint)
        .then(res => {
          console.log(res.data.HR);
          this.checkHeartRate(res.data.HR);
          if(this.isHRRelevant(res.data.HR) && res.data.HR != "")
            this.setState({ heartRates: [...this.state.heartRates, res.data.HR ],
                            validHR: true});
          else
            this.setState({ validHR: false});
        })
  }

  // Gets the Time associated with heart rate and appends it to the times array
  getTime() {
    axios.get(timeEndpoint)
      .then(res => {
        this.setState({ times: [...this.state.times, this.sanitizeTime(res.data.SessionDate) ]});
      })
  }

  isHRRelevant(currHR) {
   // if(currHR == "" || currHR == null) return false;

    var heartRates = this.state.heartRates;
    var prevHR = heartRates[heartRates.length-1];
    if(prevHR - currHR == 0)
      return false;
    else
      return true;
  }

  checkHeartRate(HR) {
    if(HR > 0) {
      if(HR < 60)
        contactNurse("Heart rate too low!");
      if(HR > 100)
        contactNurse("Heart rate too high!");
    }
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

  constructData() {
    //console.log("constructData called!");
    var data = [];
    for (var x = 0; x < this.state.times.length; x++) {
      data.push(
        { name: this.state.times[x], HeartRate: this.state.heartRates[x] }
      );
    }
    console.log(data);
    return data;
  }

  render() {
    return (
      <ResponsiveContainer width="99%" height={320}>
        <LineChart data={this.state.data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="HeartRate" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default HeartRateChart;
