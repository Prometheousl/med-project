import React, { Component, PropTypes } from 'react';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import FormField from 'grommet/components/FormField';
import Button from 'grommet/components/Button';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import Paragraph from 'grommet/components/Paragraph';
import Meter from 'grommet/components/Meter';
import CheckBox from 'grommet/components/CheckBox';
import HelpIcon from 'grommet/components/icons/base/Help';
import HomeIcon from 'grommet/components/icons/base/Home';

var url = new URLSearchParams(window.location.search);
let ans = url.getAll('hist');
if(ans[0] == null){
  ans = new Array(28);
  ans.fill(0);
  //alert('empty')
}

class History extends Component {
  constructor(props) {
    super(props);
    this.state = { }
    this.handleChange = this.handleChange.bind(this);
    this.question = this.question.bind(this);
  }

  handleChange(event){
    ans[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
    foo();
  }

  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  _onSubmit(event, num) {
  var newurl = ""
  //alert(this.onSubmit(event).toString());

  for(let i = 0; i < ans.length; i++){
    newurl +="&hist="+ans[i];
  }
    switch(num){
      case 0://Previous Page
        window.location.href = "./ReasonPage?"+url;
        break;
      case 1://Next Page
        if(url.has('hist')){
          url.delete('hist');
        }
        window.location.href = "./InsurancePage?"+url+newurl;
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
            Medical History
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
           Please check if you have ever experienced any of the following conditions.
            <br/>
          </Paragraph>
          <FormField colorIndex="light-2">
          <Box direction = 'row'>
          <Box direction = 'column'>
            <CheckBox id='choice1-1'
              name = 'choice1-1'
              label = 'Allergies'
              checked={(ans[0] != 0)? true : false}
              value = {0}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-2'
              name='choice1-2'
              label='Anemia (low Blood)'
              checked={(ans[1] != 0)? true : false}
              value = {1}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-3'
              name='choice1-3'
              label='Angina (frequent chest pain)'
              checked={(ans[2] != 0)? true : false}
              value = {2}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-4'
              name='choice1-4'
              label='Anxiety'
              checked={(ans[3] != 0)? true : false}
              value = {3}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-5'
              name='choice1-5'
              label='Arthritis'
              checked={(ans[4] != 0)? true : false}
              value = {4}
              onChange={event => this.handleChange(event)}/>
            <CheckBox id='choice1-6'
              name='choice1-6'
              label='Asthma'
              checked={(ans[5] != 0)? true : false}
              value = {5}
              onChange={event => this.onChange(event)}/>
            <CheckBox id='choice1-7'
              name='choice1-7'
              label='Atrial fib ("irregular heartbeat")'
              checked={(ans[6] != 0)? true : false}
              value = {6}
              onChange={event => this.onChange(event)}/>
            <CheckBox id='choice1-8'
              name='choice1-8'
              label='BPH ("enlarged prostate")'
              checked={(ans[7] != 0)? true : false}
              value = {7}
              onChange={event => this.onChange(event)}/>
            </Box>
          <Box direction = 'column'>
            <CheckBox id='choice1-9'
              name = 'choice1-9'
              label = 'Blood Clots'
              checked={(ans[8] != 0)? true : false}
              value = {8}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-10'
              name='choice1-10'
              label='Cancer'
              checked={(ans[9] != 0)? true : false}
              value = {9}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-11'
              name='choice1-11'
              label='Cerebrovascular accident ("stroke")'
              checked={(ans[10] != 0)? true : false}
              value = {10}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-12'
              name='choice1-12'
              label='Coronary disease ("heart disease")'
              checked={(ans[11] != 0)? true : false}
              value = {11}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-13'
              name='choice1-13'
              label='COPD (Emphysema)'
              checked={(ans[12] != 0)? true : false}
              value = {12}
              onChange={event => this.handleChange(event)}/>
            <CheckBox id='choice1-14'
              name='choice1-14'
              label='Crohns Disease'
              checked={(ans[13] != 0)? true : false}
              value = {13}
              onChange={event => this.onChange(event)}/>
            <CheckBox id='choice1-15'
              name='choice1-15'
              label='Depression'
              checked={(ans[14] != 0)? true : false}
              value = {14}
              onChange={event => this.onChange(event)}/>
            <CheckBox id='choice1-16'
              name='choice1-16'
              label='Diabetes'
              checked={(ans[15] != 0)? true : false}
              value = {15}
              onChange={event => this.onChange(event)}/>
            </Box>
            <Box direction = 'column'>
            <CheckBox id='choice1-17'
              name = 'choice1-17'
              label = 'GallBladder Disease'
              checked={(ans[16] != 0)? true : false}
              value = {16}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-18'
              name='choice1-18'
              label='GERD ("acid reflex", "heartburn")'
              checked={(ans[17] != 0)? true : false}
              value = {17}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-19'
              name='choice1-19'
              label= 'Hepatitis A, B or C'
              checked={(ans[18] != 0)? true : false}
              value = {18}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-20'
              name='choice1-20'
              label='Hyperlipidemia ("High cholesterol")'
              checked={(ans[19] != 0)? true : false}
              value = {19}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-21'
              name='choice1-21'
              label='Hypertension ("high blood pressure")'
              checked={(ans[20] != 0)? true : false}
              value = {20}
              onChange={event => this.handleChange(event)}/>
            <CheckBox id='choice1-22'
              name='choice1-22'
              label='Irriable bowl disease'
              checked={(ans[21] != 0)? true : false}
              value = {21}
              onChange={event => this.onChange(event)}/>
            <CheckBox id='choice1-23'
              name ='choice1-23'
              label = 'Migrane headaches'
              checked={(ans[22] != 0)? true : false}
              value = {22}
              onChange={event => this.onChange(event)}/>
            <CheckBox id='choice1-24'
              name='choice1-24'
              label='Myocardial infarction ("Heart Attack")'
              checked={(ans[23] != 0)? true : false}
              value = {23}
              onChange={event => this.onChange(event)}/>
            </Box>
          <Box direction = 'column'>
            <CheckBox id='choice2-1'
              name = 'choice2-1'
              label = 'Osteoporosis'
              checked={(ans[24] != 0)? true : false}
              value = {24}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice2-2'
              name='choice2-2'
              label='Renal disease (kidney disease)'
              checked={(ans[25] != 0)? true : false}
              value = {25}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice2-3'
              name='choice2-3'
              label='Seizure Disorder'
              checked={(ans[26] != 0)? true : false}
              value = {26}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice2-4'
              name='choice2-4'
              label='Thyroid problems'
              checked={(ans[27] != 0)? true : false}
              value = {27}
              onChange={event => this.handleChange(event)} />
            </Box>
            </Box>
        </FormField>

        </Section>
        </Box>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={4} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
        </Box>
      </Article>
    );
  }
}

History.defaultProps = {
  session: {
    error: undefined
  }
};

History.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

History.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default History;
