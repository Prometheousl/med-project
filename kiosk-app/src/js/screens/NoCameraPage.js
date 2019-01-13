import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Headline from 'grommet/components/Headline';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import FormNext from 'grommet/components/icons/base/FormNext';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import FormField from 'grommet/components/FormField';
import HelpIcon from 'grommet/components/icons/base/Help';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import Meter from 'grommet/components/Meter';
import Webcam from 'react-webcam';
import Camera from 'grommet/components/icons/base/camera';
import vision from './vision';

let url = new URLSearchParams(window.location.search);
let user = url.get('name');
let webcam = null;
let flu = null;

class NoCameraPage extends Component {
  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
    this.checkFlu = this.checkFlu.bind(this);
    this.state = {screenshot: null};

    this.addScript = (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.type = "text/javascript"
      document.head.appendChild(script);
    }
  }

  componentDidMount() {
    pageLoaded('Survey');
    this.addScript("http://chrissmithcrawford.com/files/opencv.js");
    vision.startCamera("video", "canvas1");
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }

  _onSubmit(event, num) {
    if (this.checkFlu() == false) {
      return;
    }
    var newurl = ""
    newurl += "&flu=" + flu;
    switch(num){
      case 0://Previous Page
        window.location.href = "./Page2?"+url;
        break;
      case 1://Next Page
        window.location.href = "./EndPage?"+url+newurl;
        break;
      default:
        window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
  }

  checkFlu() {
    flu = vision.getResult();
    if (flu == "Inconclusive") {
      return false;
    }

    return true;
  }

  capture() {
    const screenshot = webcam.getScreenshot();
    this.setState({ screenshot });
  }





  render() {
    const { session: { error } } = this.props;

    return (
      <Article primary={true} full={true}>
        <Header size="large" justify="between" colorIndex="neutral-4-a" pad={{horizontal: 'medium'}}>
          <Heading tag='h1' strong={true}>Camera Page</Heading>
          <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
            href="/Dashboard"/>
        </Header>

        <Section>
          <Box direction='row' justify='center' alignContent='center' margin='small' colorIndex='light-1'>
            <div>
              {/*<Webcam audio={false} height={350} ref={node => webcam = node} screenshotFormat="image/jpeg" width={350}/>*/}
              <video hidden id="video">Your browser does not support the video tag.</video>
              <Box align='center' pad='medium'>
              <Headline tag='h1' size='small'>
                <br/>
                <br/>
                Please place your test strip in the box and click <b>Get Diagnosis!</b>
              </Headline>
              </Box>
            </div>
            <br/>
            {this.state.screenshot ? <img src={this.state.screenshot} /> : null}
          </Box>
        </Section>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
         <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
         <Paragraph size='large'>4/5</Paragraph>
         <Meter min='0' max='5' type="bar" value={4} colorIndex='light-1' size="medium"/>
         <Button label='Get Diagnosis!' onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>
       </Footer>
      </Article>
    );
  }
}

NoCameraPage.defaultProps = {
  session: {
    error: undefined
  }
};

NoCameraPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

NoCameraPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default NoCameraPage;
