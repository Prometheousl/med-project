import React from 'react';
//import socketIOClient from "socket.io-client";
import axios from 'axios';

const endpoint = "http://127.0.0.1:4002/api"

export default class HealthData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthData: false,
    }
  }

  componentDidMount() {
    //const socket = socketIOClient(endpoint);
    //socket.on("FromAPI", data => this.setState({ healthData: data}));
    var _this = this;
    _this.getHealthData(_this);

    _this.timerID = setInterval(() => _this.tick(),1000); // call every second
  }

  tick() {
    var _this = this;
    _this.getHealthData(_this);
  }

  getHealthData(_this) {
    axios.get(endpoint)
      .then(res => {
        _this.setState({ healthData: res.data });
      })
  }

  render() {
    const { healthData } = this.state;
    return (
      <div>
      {healthData
        ? <p>
            The temperature in Florence is: {healthData} degrees F
          </p>
        : <p> Loading...</p>
      }
      </div>
    );
  }
}
