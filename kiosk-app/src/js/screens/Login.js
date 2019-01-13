import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import LoginForm from 'grommet/components/LoginForm';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Menu from 'grommet/components/Menu';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import FormNext from 'grommet/components/icons/base/FormNext';
import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import FormField from 'grommet/components/FormField';
import RadioButton from 'grommet/components/RadioButton';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import HelpIcon from 'grommet/components/icons/base/Help';
import Meter from 'grommet/components/Meter';
import CheckBox from 'grommet/components/CheckBox';
import Value from 'grommet/components/Value';
import Select from 'grommet/components/Select';
import Headline from 'grommet/components/Headline';
import Title from 'grommet/components/Title';
import HomeIcon from 'grommet/components/icons/base/Home';

const oArray =  ['I am a returning patient but some of my information has changed.',
                 'I am a returning patient and my information has not changed.',
                 'I am a new patient.'];
const url = new URLSearchParams(window.location.search);
const user = url.get('name');
let ans = url.getAll('ans');
let choice = url.get('ans2');
if(choice == null){
  choice = -1;
}

if (ans[0] == null) {
  ans = new Array(5);
  ans.fill(0);
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { value: undefined }
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.question = this.question.bind(this);
  }

  l(event) {
    ans[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
    foo();
  }

  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  handleSelectChange({ value }) {
    this.setState({ value });
    choice = oArray.indexOf(value);
  }

  componentDidMount() {
    pageLoaded('Login');
    this.props.dispatch(loadLogin());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadLogin());
  }

  _onSubmit(event, num) {
    var newurl = "";
    for(let i = 0; i < ans.length; i++){
      newurl +="&ans="+ans[i];
    }

    if(num == 1){
      if(choice == -1){
        alert("You must anwser if you have been to this location before.");
        return;
      }

      if(Math.max(...ans) != 1){
        alert("Please select at least one choice");
        return;
      }
    }

    newurl += "&ans2="+choice;
    switch(num){
      case 0://Previous Page
        window.location.href = "./Dashboard?"+url;
        break;
      case 1://Next Page
        if(url.has('ans')){
          url.delete('ans');
        }
        if(url.has('ans2')){
          url.delete('ans2');
        }
        window.location.href = "./Page1?"+url+newurl;
        break;
      default:
        window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
  }

  render() {
    const { error } = this.props;

    return (
      <Article primary={true} full={true}>
      <Header size="large" justify="between" colorIndex="neutral-4-a" pad={{horizontal: 'medium'}}>
        <Heading tag='h2' strong={true}>Welcome <b>{user}</b></Heading>
        <Box direction="row">
          <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
            href="/Dashboard"/>
          <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
            onClick={this.question}/>
        </Box>
      </Header>

      <Box direction="column" >
    <Box pad={{horizontal: 'large'}}>
    <Section colorIndex="light-1">
      <Paragraph size='large'>
        What is your reason for this appointment?
      </Paragraph>
      <FormField colorIndex="light-2">
        <CheckBox id='choice1-1'
          name='choice1-1'
          value = {0}
          label='Check-Up'
          checked={(ans[0] != 0)? true : false}
          onChange={event => this.l(event)}/>
        <CheckBox id='choice1-2'
          name='choice1-2'
          value = {1}
          label='Illness'
          checked={(ans[1] != 0)? true : false}
          onChange={event => this.l(event)}/>
        <CheckBox id='choice1-3'
          name='choice1-3'
          value = {2}
          label='Physical'
          checked={(ans[2] != 0)? true : false}
          onChange={event => this.l(event)}/>
        <CheckBox id='choice1-4'
          name='choice1-4'
          value = {3}
          label='Consultation'
          checked={(ans[3] != 0)? true : false}
          onChange={event => this.l(event)}/>
        <CheckBox id='choice1-5'
          name='choice1-5'
          value = {4}
          label='Other'
          checked={(ans[4] != 0)? true : false}
          onChange={event => this.l(event)}/>
      </FormField>


        <Paragraph size='large'>
          Have you been here before?
        </Paragraph>
        <FormField>
          <Select placeHolder='N/A'
            value={oArray[choice]}
            onChange={this.handleSelectChange}
            options={[oArray[0],oArray[1],oArray[2]]}/>
        </FormField>
      </Section>
      </Box>

      <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
        <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
        <Meter min='0' max='9' type="bar" value={1} colorIndex='light-1' size="medium"/>
        <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
      </Footer>
      </Box>
      </Article>
    );
  }
}

Login.defaultProps = {
  session: {
    error: undefined
  }
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Login.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default Login;
