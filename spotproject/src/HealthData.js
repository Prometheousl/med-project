import React from 'react';
import socketIOClient from "socket.io-client";

const endpoint = "http://127.0.0.1:4001"

export default class HealthData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthData: false,
    }
  }

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ healthData: data}));
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
