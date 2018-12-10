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
import DateTime from 'grommet/components/DateTime';


var url = new URLSearchParams(window.location.search);
let ans1 = url.getAll('ans3.1');

class InsurancePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value0: "",
      value1: "",
      value2: "",
      value3: "",
      value4: "",
    }
    this.question = this.question.bind(this);
    this.handleForm = this.handleForm.bind(this);
  }

  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  handleForm(event, num) {
    if (num == 0) {
      this.setState({value0: event.target.value});
    } else if (num == 1) {
      this.setState({value1: event.target.value});
    } else if (num == 2) {
      this.setState({value2: event.target.value});
    } else if (num == 3) {
      this.setState({value3: event.target.value});
    } else if (num == 4) {
      this.setState({value4: event.target.value});
    }
  }

  _onSubmit(event, num) {
  var newurl = ""

  newurl+="&primary="+this.state.value0
          +"&member="+this.state.value1
          +"&group="+this.state.value2
          +"&policy="+this.state.value3
          +"&idob="+this.state.value4;
    switch(num){
      case 0://Previous Page
        window.location.href = "./History?"+url;
        break;
      case 1://Next Page

        if(url.has('primary')){
          url.delete('primary');
        }
        window.location.href = "./CardPage?"+url+newurl;
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
            Insurance Information
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
            Primary Carrier:
          </Paragraph>
          <FormField>
            <input type="text"
            size='15'
            value={this.state.value}
            onChange={event => this.handleForm(event, 0)}
            placeholder = {"Company Name"} />
          </FormField>

          <Paragraph size='large'>
            Member Name:
          </Paragraph>
          <FormField>
            <input type="text"
            size='15'
            value={this.state.value}
            onChange={event => this.handleForm(event, 1)}
            placeholder = {"Member Name"} />
          </FormField>

          <Paragraph size='large'>
            Group Number:
          </Paragraph>
          <FormField>
            <input type="text"
            size='15'
            value={this.state.value}
            onChange={event => this.handleForm(event, 2)}
            placeholder = {"00000"} />
          </FormField>

          <Paragraph size='large'>
            Policy Number:
          </Paragraph>
          <FormField>
            <input type="text"
            size='15'
            value={this.state.value}
            onChange={event => this.handleForm(event, 3)}
            placeholder = {"ABC000000000"} />
          </FormField>

          <Paragraph size='large'>
            Date of Birth:
          </Paragraph>
          <form>
              <input type="date"
              size='15'
              value={this.state.value}
              onChange={event => this.handleForm(event, 4)}
              placeholder = {""} />
          </form>

        </Section>
        </Box>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={5} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
        </Box>
      </Article>
    );
  }
}

InsurancePage.defaultProps = {
  session: {
    error: undefined
  }
};

InsurancePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

InsurancePage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default InsurancePage;
