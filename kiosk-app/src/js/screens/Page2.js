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

var url = new URLSearchParams(window.location.search);
let ans = url.getAll('ans3');
if(ans[0] == null){
  ans = new Array(8);
  ans.fill(0);
  //alert('empty')
}

class Page2 extends Component {
  constructor(props) {
    super(props);
    this.state = { }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
 ans[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
 foo();
}

  _onSubmit(event, num) {
  var newurl = ""
  //alert(this.onSubmit(event).toString());

  for(let i = 0; i < ans.length; i++){
    newurl +="&ans3="+ans[i];
  }
    switch(num){
      case 0://Previous Page
        window.location.href = "./Page1?"+url;
        break;
// Seperate Case 1s for CameraPage and NoCameraPage
      case 1://Next Page
        if(url.has('ans3')){
          url.delete('ans3');
        }
        window.location.href = "./CameraPage?"+url+newurl;
        break;
      {/*
      case 1://Next Page
        if(url.has('ans3')){
          url.delete('ans3');
        }
        window.location.href = "./NoCameraPage?"+url+newurl;
        break;
      */}
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
          <Heading tag='h1' strong={true}>
            Flu Symptoms
          </Heading>
          <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
            href="/Dashboard"/>
        </Header>

        <Box>
        <Box pad={{horizontal: 'large'}}>
        <Section colorIndex="light-1">
          <Paragraph size='large'>
            What flu symptoms are you feeling?
            <br/>
            (Check all that apply)
          </Paragraph>
          <FormField colorIndex="light-2">
            <CheckBox id='choice1-1'
            name='choice1-1'
            label='Fever/Chills'
            checked={(ans[0] != 0)? true : false}
            value = {0}
            onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-2'
              name='choice1-2'
              label='Cough'
              checked={(ans[1] != 0)? true : false}
              value = {1}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-3'
              name='choice1-3'
              label='Sore Throat'
              checked={(ans[2] != 0)? true : false}
              value = {2}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-4'
              name='choice1-4'
              label='Runny/Stuffy Nose'
              checked={(ans[3] != 0)? true : false}
              value = {3}
              onChange={event => this.handleChange(event)} />
            <CheckBox id='choice1-5'
              name='choice1-5'
              label='Muscle/Body Aches'
              checked={(ans[4] != 0)? true : false}
              value = {4}
              onChange={event => this.handleChange(event)}/>
              <CheckBox id='choice1-6'
                name='choice1-6'
                label='Headaches'
                checked={(ans[5] != 0)? true : false}
                value = {5}
                onChange={event => this.onChange(event)}/>
                <CheckBox id='choice1-7'
                  name='choice1-7'
                  label='Fatigue/Tiredness'
                  checked={(ans[6] != 0)? true : false}
                  value = {6}
                  onChange={event => this.onChange(event)}/>
                  <CheckBox id='choice1-8'
                    name='choice1-8'
                    label='Vomiting/Diarrhea'
                    checked={(ans[7] != 0)? true : false}
                    value = {7}
                    onChange={event => this.onChange(event)}/>
        </FormField>
        </Section>
        </Box>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Paragraph size='large'>3/5</Paragraph>
          <Meter min='0' max='5' type="bar" value={3} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
        </Box>
      </Article>
    );
  }
}

Page2.defaultProps = {
  session: {
    error: undefined
  }
};

Page2.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Page2.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default Page2;
