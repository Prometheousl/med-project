import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import Value from 'grommet/components/Value';
import Meter from 'grommet/components/Meter';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';
import FormNext from 'grommet/components/icons/base/FormNext';
import NavControl from '../components/NavControl';
import Button from 'grommet/components/Button';
import FormField from 'grommet/components/FormField';
import Form from 'grommet/components/Form';
import TextInput from 'grommet/components/TextInput';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';

import {
  loadDashboard, unloadDashboard
} from '../actions/dashboard';

import { pageLoaded } from './utils';
var url = new URLSearchParams(window.location.search);
var user = url.get('name');
url.delete('name');
function isNullOrWhiteSpace(str) {
  return (!str || str.length === 0 || /^\s*$/.test(str))
}

class Dashboard extends Component {
  constructor(props) {
      super(props);
      this.state = {value:isNullOrWhiteSpace(user)? '':user};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  componentDidMount() {
    pageLoaded('Welcome');
    this.props.dispatch(loadDashboard());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadDashboard());
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if(isNullOrWhiteSpace(this.state.value)){
      alert("Name can not be blank!");
      return;
    }
    window.location.href = "./Appointment?name="+this.state.value + "&"+url;
    event.preventDefault();
  }

  render() {

    return (
      <Article primary={true} full={true}>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
          colorIndex="neutral-4-a">
          <Heading tag='h2' strong={true}>
            Welcome to Health-Check Kiosk
          </Heading>
        </Header>

        <Box pad={{horizontal: 'large', vertical: 'large'}}>
          <Paragraph size='large'>
            Please enter your name then press the Next Arrow.
          </Paragraph>
          <form onSubmit={this.handleSubmit}>
          <FormField>
          <input type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder = {"Enter your name"} />
          </FormField>
          </form>
        </Box>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Paragraph size='large'></Paragraph>
          <Meter min='0' max='8' type="bar" value={0} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {this.handleSubmit} colorIndex='light-1'/>
          </Footer>
      </Article>
    );
  }

}

Dashboard.defaultProps = {
  error: undefined,
  tasks: []
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default Dashboard;
