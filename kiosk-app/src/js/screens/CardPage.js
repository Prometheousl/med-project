import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import FormNext from 'grommet/components/icons/base/FormNext';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import FormField from 'grommet/components/FormField';
import HelpIcon from 'grommet/components/icons/base/Help';
import HomeIcon from 'grommet/components/icons/base/Home';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import Meter from 'grommet/components/Meter';
import Webcam from 'react-webcam';
import Camera from 'grommet/components/icons/base/camera';

let url = new URLSearchParams(window.location.search);
let user = url.get('name');
let webcam = null;

class CardPage extends Component {
  constructor(props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this.question = this.question.bind(this);
    this.state = {value: 'one', screenshot: null};


  }

  question(event) {
    alert("A staff member has been notified for assistance.");
  }

  _onChange(event, option) {
    const { onChange, value, defaultValue } = this.props;
    if (onChange) {
        const checked = event.target.checked;
        const newValue = checked ? 1 : 0;
        onChange(newValue);
    }
  }

  componentDidMount() {
    pageLoaded('Survey');
    //this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    //this.props.dispatch(navEnable(true));
  }

  _onSubmit(event, num) {
    var newurl = ""

    switch(num){
      case 0://Previous Page
        window.location.href = "./Login?"+url;
        break;
      case 1://Next Page
        window.location.href = "./VitalsPage?"+url+newurl;
        break;
      default:
        window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
  }

  capture() {
    const screenshot = webcam.getScreenshot();
    this.setState({ screenshot });
  }

  render() {
    const { session: { error } } = this.props;
    const { currentValue } = this.state.value;
    return (
      <Article full={true}>
        <Header size="large" justify="between" colorIndex="neutral-4-a" pad={{horizontal: 'medium'}}>
          <Heading tag='h2' strong={true}>Insurance Card and Drivers License</Heading>
          <Box direction="row">
            <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
              href="/Dashboard"/>
            <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
              onClick={this.question}/>
          </Box>
        </Header>
        <Section justify="between" colorIndex="light-1">
          <Box textAlign='left' pad={{ horizontal: 'medium', between: 'small' }}>
            <Paragraph size='large'>
              Please place your insurance card and drivers license under camera and take a picture.
            </Paragraph>
          </Box>
          <Box direction='row' justify='center'
            alignContent='center' pad='medium'
            margin='small' colorIndex='light-1'>
            <div>
            <Webcam
              audio={false}
              height={300}
              ref={node => webcam = node}
              screenshotFormat="image/jpeg"
              width={450}
            />
            <Button onClick={event => this.capture()} icon={<Camera />}></Button>
            </div>
            {this.state.screenshot ? <img src={this.state.screenshot} /> : null}
          </Box>
        </Section>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={6} colorIndex='light-1' size="medium"/>
          <Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
        </Footer>
      </Article>
    );
  }
}

CardPage.defaultProps = {
  session: {
    error: undefined
  }
};

CardPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

CardPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default CardPage;
