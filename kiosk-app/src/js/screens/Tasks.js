import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Notification from 'grommet/components/Notification';
import Meter from 'grommet/components/Meter';
import Paragraph from 'grommet/components/Paragraph';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import HelpIcon from 'grommet/components/icons/base/Help';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import Select from 'grommet/components/Select';
import value from 'grommet/components/Value';
import Camera from 'grommet/components/icons/base/camera';
import Webcam from 'react-webcam';

import { pageLoaded } from './utils';

var url = new URLSearchParams(window.location.search);
var user = url.get('name');
var ans = url.getAll('answer');
if(ans[0] == null){
  ans = new Array(5);
  ans.fill(0);
  //alert('empty')
}

class Tasks extends Component {
  constructor(props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this.state = {screenshot: null};
  }

  _onSubmit(event, num) {
  //alert(this.onSubmit(event).toString());
    switch(num){
      case 0://Previous Page
      window.location.href = "./Login?"+url;
      break;
      case 1://Next Page
      if(url.has('answer')){
        url.delete('answer');
      }
      window.location.href = "./Page1?"+url;
      break;
      default:
      window.location.href = "./Dashboard";//Homepage
    }
    event.preventDefault();
  }

  l(event){
    ans[event.currentTarget.value] = event.currentTarget.checked? 1 : 0;
    foo();
  }

  componentDidMount() {
    pageLoaded('Camera');
    this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }


  capture() {
    const screenshot = webcam.getScreenshot();
    this.setState({ screenshot });
  }

  render() {
    const { session: { error } } = this.props;
    return (
      <Article full={true}>
      <Header size="large" justify="between" colorIndex="neutral-4-a" pad={{horizontal: 'medium'}}>
        <Heading tag='h1' strong={true}>Camera</Heading>
        <Button align="end" icon={<HelpIcon colorIndex='light-1'/>} href="/Dashboard"/>
      </Header>
      <Section justify="between" colorIndex="light-1">

        <Box direction='row'
          justify='center'
          alignContent='center'
          pad='medium'
          margin='small'
          colorIndex='light-2'>
        <div>
        <Webcam
          audio={false}
          height={350}
          ref={node => webcam = node}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <Button onClick={event => this.capture()} icon={<Camera />}></Button>
        </div>

        {this.state.screenshot ? <img src={this.state.screenshot} /> : null}
        </Box>

      </Section>
      <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
        <Button icon={<CaretBackIcon/>} href='/Login' colorIndex='light-1'/>
        <Paragraph size='large'>3/10</Paragraph>
        <Meter min='0' max='10' type="bar" value={3} colorIndex='light-1' size="medium"/>
        <Button icon={<CaretNextIcon/>} href='/Tasks' colorIndex='neutral-1'/>
      </Footer>
      </Article>
    );
  }
}

Tasks.defaultProps = {
  session: {
    error: undefined
  }
};

Tasks.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

Tasks.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(Tasks);
