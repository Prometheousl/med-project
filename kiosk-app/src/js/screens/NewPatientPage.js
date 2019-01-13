import React, { Component, PropTypes } from 'react';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Headline from 'grommet/components/Headline';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import Select from 'grommet/components/Select';
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
import RadioButton from 'grommet/components/RadioButton';

var url = new URLSearchParams(window.location.search);
let gender = '';
let ans = url.getAll('alert');
if(ans[0] == null){
  ans = new Array(3);
  ans.fill(0);
}
class NewPatientPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value0: "", value1: "", value2: "", value3: "", value4: "", value5: "",
      value6: "", value7: "", value8: "", value9: "", value10: "", value11: ""
    }
    this.question = this.question.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    } else if (num == 5) {
      this.setState({value5: event.target.value});
    } else if (num == 6) {
      this.setState({value6: event.target.value});
    } else if (num == 7) {
      this.setState({value7: event.target.value});
    } else if (num == 8) {
      this.setState({value8: event.target.value});
    } else if (num == 9) {
      this.setState({value9: event.target.value});
    } else if (num == 10) {
      this.setState({value10: event.target.value});
    } else if (num == 11) {
      this.setState({value11: event.target.value});
    }
  }

  handleChange(event, num){
    ans[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
    foo();

    if (num == 0) {
      ans[1] = 0;
      ans[2] = 0;
    } else if (num == 1) {
      ans[0] = 0;
      ans[2] = 0;
    } else if (num == 2) {
      ans[0] = 0;
      ans[1] = 0;
    }
  }

  _onSubmit(event, num) {
  var newurl = "";

  if (ans[0] == 1) {
    gender = 'male';
  } else if (ans[1] == 1) {
    gender = 'female';
  } else if (ans[2] == 1) {
    gender = 'other';
  }
  var marital = document.getElementById("marital").value;
  var race = document.getElementById("race").value;

  newurl+="&address="+this.state.value0
          +"&address="+this.state.value1
          +"&address="+this.state.value2
          +"&address="+this.state.value3
          +"&phone="+this.state.value4
          +"&social="+this.state.value5
          +"&dob="+this.state.value6
          +"&gender="+gender
          +"&race="+race
          +"&marital="+marital
          +"&ecname="+this.state.value10
          +"&ecphone="+this.state.value11;
    switch(num){
      case 0://Previous Page
        window.location.href = "./Login?"+url;
        break;
      case 1://Next Page

        if(url.has('address')){
          url.delete('address');
          url.delete('phone');
          url.delete('social');
          url.delete('dob');
          url.delete('gender');
          url.delete('ecname');
          url.delete('ecphone');
          url.delete('marital');
          url.delete('race');
          }
        window.location.href = "./ReasonPage?"+url+newurl;
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
            New Patient Information
          </Heading>
          <Box direction="row">
            <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
              href="/Dashboard"/>
            <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
              onClick={this.question}/>
          </Box>
        </Header>

        <Box>
        <Box pad={{horizontal: 'large'}} align='center'>
        <Section colorIndex="light-1">
          <Paragraph size='large'>
            Patient Contact:
          </Paragraph>

          <Box direction='row'>
            <Paragraph size='medium'>
              Street Address:
            </Paragraph>
            &nbsp;
            <form>
              <FormField>
                <input type="text"
                size='20'
                value={this.state.value}
                onChange={event => this.handleForm(event, 0)}
                placeholder = {"123 Sugar Lane"} />
              </FormField>
            </form>

            &ensp;
            <Paragraph size='medium'>
              City:
            </Paragraph>
            &nbsp;
            <form>
              <FormField>
                <input type="text"
                size='15'
                value={this.state.value}
                onChange={event => this.handleForm(event, 1)}
                placeholder = {"Auburn"} />
              </FormField>
            </form>

            &ensp;
            <Paragraph size='medium'>
              State:
            </Paragraph>
            &nbsp;
            <form>
              <FormField>
                <input type="text"
                size='2'
                value={this.state.value}
                onChange={event => this.handleForm(event, 2)}
                placeholder = {"AL"} />
              </FormField>
            </form>

            &ensp;
            <Paragraph size='medium'>
              Zipcode:
            </Paragraph>
            &nbsp;
            <form>
              <FormField>
                <input type="text"
                size='5'
                value={this.state.value}
                onChange={event => this.handleForm(event, 3)}
                placeholder = {"36832"} />
              </FormField>
            </form>
          </Box>

          <br/>
          <Box direction='row'>
          &ensp;
          <Paragraph size='medium'>
            Phone Number:
          </Paragraph>
          &nbsp;
          <form>
            <FormField>
              <input type="text"
              size='15'
              value={this.state.value}
              onChange={event => this.handleForm(event, 4)}
              placeholder = {"123-456-7890"} />
            </FormField>
          </form>

          &ensp;
          <Paragraph size='medium'>
            Social Security:
          </Paragraph>
          &nbsp;
          <form>
            <FormField>
              <input type="text"
              size='15'
              value={this.state.value}
              onChange={event => this.handleForm(event, 5)}
              placeholder = {"123-45-6789"} />
            </FormField>
          </form>

          &ensp;
          <Paragraph size='medium'>
            Date of Birth:
          </Paragraph>
          &nbsp;
          <form>
              <input type="date"
              size='15'
              value={this.state.value}
              onChange={event => this.handleForm(event, 6)}
              placeholder = {""} />
          </form>
        </Box>

        <Box direction='row'>
        <Paragraph size='medium'>
          Gender:
        </Paragraph>
        &nbsp;
        <form>
        <FormField direction='row'>
        <RadioButton id='choice1-1'
          name='male'
          label='Male'
          checked={(ans[0] != 0)? true : false}
          value = {0}
          onChange={event => this.handleChange(event, 0)} />
          <RadioButton id='choice1-2'
            name='male'
            label='Female'
            checked={(ans[1] != 0)? true : false}
            value = {1}
            onChange={event => this.handleChange(event, 1)} />
            <RadioButton id='choice1-3'
              name='male'
              label='Other'
              checked={(ans[2] != 0)? true : false}
              value = {2}
              onChange={event => this.handleChange(event, 2)} />
        </FormField>
        </form>

        &ensp;
        <Paragraph size='medium'>
          Race:
        </Paragraph>
        &nbsp;
        <form>
          <select id = 'race'>
          <option value="Unlisted">Unlisted</option>
          <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
          <option value="Asian">Asian</option>
          <option value="Black or African American">Black or African American</option>
          <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
          <option value="White">White</option>
          <option value="Multiracial">Multiracial</option>
          </select>
         </form>

        &ensp;
        <Paragraph size='medium'>
          Marital Status:
        </Paragraph>
        &nbsp;
        <form>
          <select id = 'marital'>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
         </form>
        </Box>

        <br/>
        <Paragraph size='large'>
          Emergency Contact:
        </Paragraph>
        <Box direction='row'>
        <Paragraph size='medium'>
          Name:
        </Paragraph>
        &nbsp;
        <form>
          <FormField>
            <input type="text"
            size='20'
            value={this.state.value}
            onChange={event => this.handleForm(event, 10)}
            placeholder = {"John Doe"} />
          </FormField>
        </form>

        &ensp;
        <Paragraph size='medium'>
          Phone Number:
        </Paragraph>
        &nbsp;
        <form>
          <FormField>
            <input type="text"
            size='12'
            value={this.state.value}
            onChange={event => this.handleForm(event, 11)}
            placeholder = {"123-456-7890"} />
          </FormField>
        </form>
      </Box>


        </Section>
        </Box>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={2} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
        </Box>
      </Article>
    );
  }
}

NewPatientPage.defaultProps = {
  session: {
    error: undefined
  }
};

NewPatientPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

NewPatientPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default NewPatientPage;
