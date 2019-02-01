import React from 'react';
import Websocket from 'react-websocket';

const endpoint = "ws://127.0.0.1:4002/"

export default class HealthData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthData: false,
    }
  }

  componentDidMount() {
  }

  handleData(data) {
    let result = JSON.parse(data);
    this.setState({healthData: result.data})
  }

  render() {
    const { healthData } = this.state;
    return (
      <div>
        {healthData}
        <Websocket url={endpoint} onMessage={this.handleData.bind(this)}/>
      </div>
    );
  }
}
