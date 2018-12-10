import React, { Component, PropTypes } from 'react';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Button from 'grommet/components/Button';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import Paragraph from 'grommet/components/Paragraph';
import Meter from 'grommet/components/Meter';
import CheckBox from 'grommet/components/CheckBox';
import HelpIcon from 'grommet/components/icons/base/Help';
import HomeIcon from 'grommet/components/icons/base/Home';
import Notification from 'grommet/components/Notification';

var url = new URLSearchParams(window.location.search);
let chief = url.get('chief');
let ans1 = url.getAll('reason');
if(ans1[0] == null){
  ans1 = new Array(6);
  ans1.fill(0);
}
let ans2 = url.getAll('alert');
if(ans2[0] == null){
  ans2 = new Array(4);
  ans2.fill(0);
}

class ReasonPage extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" }
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.question = this.question.bind(this);
  }

  handleChange1(event){
    ans1[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
    foo();
  }

  handleChange2(event){
    ans2[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
    foo2();
  }

  handleForm(event) {
    this.setState({value: event.target.value});
  }

  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  _onSubmit(event, num) {
  var newurl = ""
  //alert(this.onSubmit(event).toString());

  for(let i = 0; i < ans1.length; i++){
    newurl +="&reason="+ans1[i];
  }
  for(let i = 0; i < ans2.length; i++){
    newurl +="&alert="+ans2[i];
  }
  newurl+="&chief="+this.state.value;
    switch(num){
      case 0://Previous Page
        window.location.href = "./Appointment?"+url;
        break;
      case 1://Next Page
        if(ans1[0] == 1 ||
           ans2[0] == 1 || ans2[1] == 1 || ans2[2] == 1 || ans2[3] ==1) {
          window.location.href ="./UrgentPage?"+url+newurl;
          break;
        }
        if(url.has('reason')){
          url.delete('reason');
        }
        window.location.href = "./History?"+url+newurl;
        break;
      default:
        window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
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
            Reason for Visiting
          </Heading>
          <Box direction="row">
            <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
              href="/Dashboard"/>
            <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
              onClick={this.question}/>
          </Box>
        </Header>

        <Box>
        <Box pad={{horizontal: 'large'}}>
        <Section colorIndex="light-1">
          <Paragraph size='large'>
            What is your reason for this appointment?
          </Paragraph>
          <FormField colorIndex="light-2">
            <CheckBox id='choice1-1'
            name='choice1-1'
            label='Emergency'
            checked={(ans1[0] != 0)? true : false}
            value = {0}
            onChange={event => this.handleChange1(event)} />
            <CheckBox id='choice1-2'
              name='choice1-2'
              label='Urgent Care'
              checked={(ans1[1] != 0)? true : false}
              value = {1}
              onChange={event => this.handleChange1(event)} />
            <CheckBox id='choice1-3'
              name='choice1-3'
              label='Check-Up'
              checked={(ans1[2] != 0)? true : false}
              value = {2}
              onChange={event => this.handleChange1(event)} />
            <CheckBox id='choice1-4'
              name='choice1-4'
              label='Physical'
              checked={(ans1[3] != 0)? true : false}
              value = {3}
              onChange={event => this.handleChange1(event)} />
            <CheckBox id='choice1-5'
              name='choice1-5'
              label='Consultation'
              checked={(ans1[4] != 0)? true : false}
              value = {4}
              onChange={event => this.handleChange1(event)} />
            <CheckBox id='choice1-6'
              name='choice1-6'
              label='Follow-Up'
              checked={(ans1[5] != 0)? true : false}
              value = {5}
              onChange={event => this.handleChange1(event)}/>
          </FormField>

          <Paragraph size='large'>
            Check any symptoms you have.
          </Paragraph>
          <FormField colorIndex="light-2">
            <CheckBox id='choice2-1'
              name='choice2-1'
              label='Fever'
              checked={(ans2[0] != 0)? true : false}
              value = {0}
              onChange={event => this.handleChange2(event)} />
            <CheckBox id='choice2-2'
              name='choice2-2'
              label='Dizziness'
              checked={(ans2[1] != 0)? true : false}
              value = {1}
              onChange={event => this.handleChange2(event)} />
            <CheckBox id='choice2-3'
              name='choice2-3'
              label='Bleeding'
              checked={(ans2[2] != 0)? true : false}
              value = {2}
              onChange={event => this.handleChange2(event)} />
            <CheckBox id='choice2-4'
              name='choice2-4'
              label='Chest Pains'
              checked={(ans2[3] != 0)? true : false}
              value = {3}
              onChange={event => this.handleChange2(event)} />
          </FormField>

          <Paragraph size='large'>
            Describe all symptoms in your own words.
          </Paragraph>
            <Box>
            <FormField>
              <input type="text"
              value={this.state.value}
              onChange={this.handleForm}
              placeholder = {"chief complaint"} />
            </FormField>
            </Box>
        </Section>
        </Box>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={3} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
        </Box>
      </Article>
    );
  }
}

ReasonPage.defaultProps = {
  session: {
    error: undefined
  }
};

ReasonPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

ReasonPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default ReasonPage;
