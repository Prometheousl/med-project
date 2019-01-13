import React, { Component, PropTypes } from 'react';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import RadioButton from 'grommet/components/RadioButton';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import Paragraph from 'grommet/components/Paragraph';
import Meter from 'grommet/components/Meter';
import DateTime from 'grommet/components/DateTime';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import HelpIcon from 'grommet/components/icons/base/Help';
import HomeIcon from 'grommet/components/icons/base/Home';

var url = new URLSearchParams(window.location.search);
var check1 = url.get("appt");
var check2 = url.get("returner");
if (check1 == null) {
  check1 = true;
  check2 = true;
}
var time = "";

class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {value: time}
    this.handleChange = this.handleChange.bind(this);
    this.question = this.question.bind(this);
  }

  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  _onSubmit(event, num) {
    var newurl = ""
    check1 = document.getElementById("Yes1").checked;
    check2 = document.getElementById("Yes").checked;
    time = document.getElementById("appt-time").value;
    if (check1 && time == '') {
      alert("Please enter your appointment time ");
      return;
    }
    if (!check1) {
      time = '';
    }
    newurl +="&appt="+ check1 +"&time=" + time + "&returner=" + check2;
    switch(num){
      case 0://Previous Page
        window.location.href = "./Dashboard?"+url;
        break;
      case 1://Next Page
        if(url.has('time')){
          url.delete('time');
        }
        if(url.has('appt')){
          url.delete('appt');
        }
        if(url.has('returner')){
          url.delete('returner');
        }
        if (check2 == false) {
          window.location.href = "./NewPatientPage?"+url+newurl;
        } else {
          window.location.href = "./ReasonPage?"+url+newurl;
        }
        break;
      default:
        window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
  }


  handleChange(event) {
    this.setState(event.currentTarget.value);
  }

  render() {
    const { session: { error } } = this.props;

    return (
      <Article primary={true} full={true}>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
          colorIndex="neutral-4-a">
          <Heading tag='h2' strong={true}>
           Appointment Information
          </Heading>
          <Box direction="row">
            <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
              href="/Dashboard"/>
            <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
              onClick={this.question}/>
          </Box>
        </Header>
        <Box pad={{horizontal: 'large'}}>
        <Section colorIndex="light-1">
        <Paragraph size='large'>
          Do you have an appointment scheduled?
        </Paragraph>
        <RadioButton
          type = "radio"
          id='Yes1'
          name='appt'
          label='Yes'
          value = "yes"
          checked={check1}
          onChange = {event => this.handleChange(event)}
          />
        <RadioButton
          id='No1'
          name='appt'
          label='No'
          value = "no"
          checked={!check1}
          onChange = {event => this.handleChange(event)}
          />

          <Paragraph>
            What time is your appointment?
          </Paragraph>
          {/*Step is time is seconds* ie 900 = 15 * 60 */}
          <input id="appt-time" type="time" name="appt-time" step = "900"/>
          <Paragraph size='large'>
            Have you been here before?
          </Paragraph>
          <RadioButton
            type = "radio"
            id='Yes'
            name='fTime'
            label='Yes'
            value = "yes"
            checked={check2}
            onChange = {event => this.handleChange(event)}
          />
          <RadioButton
            id='No'
            name='fTime'
            label='No'
            value = "no"
            checked={!check2}
            onChange = {event => this.handleChange(event)}
          />

        </Section>
        </Box>
        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={1} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>

      </Article>
    );
  }
}

Appointment.defaultProps = {
  session: {
    error: undefined
  }
};

Appointment.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Appointment.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default Appointment;
