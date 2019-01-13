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
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import HelpIcon from 'grommet/components/icons/base/Help';

var url = new URLSearchParams(window.location.search);
var quest = url.getAll('q');
if(quest[0] == null){
  quest = new Array(3);
  quest.fill('');
}

class Page1 extends Component {
  constructor(props) {
    super(props);
    this.state = { value1: quest[0], value2: quest[1], value3: quest[2] }
    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  _onSubmit(event, num) {
  var newurl = ""
  //alert(this.onSubmit(event).toString());

  newurl +="&q="+quest[0]+"&q="+quest[1]+"&q="+quest[2];

    switch(num){
      case 0://Previous Page
      window.location.href = "./Login?"+url;
      break;
      case 1://Next Page
      if(url.has('q')){
        url.delete('q');
      }
      window.location.href = "./Page2?"+url+newurl;
      break;
      default:
      window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
  }

  handleChange(event, num) {
    if (num == 1) {
      this.setState({value1: event.target.value});
      quest[0] = event.target.value;
      //alert(quest[0]);
    } else if (num == 2) {
      this.setState({value2: event.target.value});
      quest[1] = event.target.value;
    } else if (num == 3){
      this.setState({value3: event.target.value});
      quest[2] = event.target.value;
    }
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
            Recent Medical History
          </Heading>
          <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
            href="/Dashboard"/>
        </Header>
        <Box pad={{horizontal: 'large'}}>
        <Section colorIndex="light-1">
        <Paragraph size='large'>
          Click on all tabs that apply to you.
          <br/>
          (If none, continue to next page.)
        </Paragraph>

        <Accordion pad='large' openMulti={true}>
          <AccordionPanel heading='Have you been hospitalized in the past 60 days?'>
            <Box pad={{horizontal: 'large'}}>
            <Paragraph>
              If yes, who is your Home Healthcare Provider?
            </Paragraph>
            <FormField>
              <input type="text" value={quest[0]} onChange={event => this.handleChange(event, 1)} />
            </FormField>
            </Box>
          </AccordionPanel>
          <AccordionPanel heading='Have you had physical and/or speech therapy in the past 12 months?'>
            <Box pad={{horizontal: 'large'}}>
            <Paragraph>
              If yes, where?
            </Paragraph>
            <FormField>
              <input type="text" value={quest[1]} onChange={event => this.handleChange(event, 2)} />
            </FormField>
            </Box>
          </AccordionPanel>
          <AccordionPanel heading='Were you referred here?'>
            <Box pad={{horizontal: 'large'}}>
            <Paragraph>
              If yes, who is your referring Physician?
            </Paragraph>
            <FormField>
              <input type="text" value={quest[2]} onChange={event => this.handleChange(event, 3)} />
            </FormField>
            </Box>
          </AccordionPanel>
        </Accordion>

        </Section>
        </Box>
        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Paragraph size='large'>2/5</Paragraph>
          <Meter min='0' max='5' type="bar" value={2} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>

      </Article>
    );
  }
}

Page1.defaultProps = {
  session: {
    error: undefined
  }
};

Page1.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Page1.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default Page1;
