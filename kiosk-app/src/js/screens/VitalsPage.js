import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Headline from 'grommet/components/Headline';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import HelpIcon from 'grommet/components/icons/base/Help';
import HomeIcon from 'grommet/components/icons/base/Home';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import Meter from 'grommet/components/Meter';
import filewriter from './filewriter'

let url = new URLSearchParams(window.location.search);

class VitalsPage extends Component {
  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
    this.question = this.question.bind(this);
  }

  componentDidMount() {
    pageLoaded('Survey');
    //this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    //this.props.dispatch(navEnable(true));
  }
  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  _onSubmit(event, num) {
    var newurl = "";
    switch(num){
      case 0://Previous Page
        window.location.href = "./CardPage?"+url;
        break;
      case 1://Next Page
        window.location.href = "./EndPage?"+url;
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
      <Header size="large" justify="between" colorIndex="neutral-4-a" pad={{horizontal: 'medium'}}>
        <Heading tag='h2' strong={true}>Check Vitals</Heading>
        <Box direction="row">
          <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
            href="/Dashboard"/>
          <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
            onClick={this.question}/>
        </Box>
      </Header>

        <Section>
        <Box align='center' textAlign='center' direction='column'>
          <Paragraph size ='large'>
            Use equipment to check temperature, blood pressure, etc.
          </Paragraph>
        </Box>
        </Section>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={7} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
      </Article>
    );
  }
}

VitalsPage.defaultProps = {
  session: {
    error: undefined
  }
};

VitalsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

VitalsPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default VitalsPage;
