import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Headline from 'grommet/components/Headline';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import HelpIcon from 'grommet/components/icons/base/Help';
import CaretNextIcon from 'grommet/components/icons/base/CaretNext';
import CaretBackIcon from 'grommet/components/icons/base/CaretBack';
import Meter from 'grommet/components/Meter';
import filewriter from './filewriter'
import HomeIcon from 'grommet/components/icons/base/Home';

let url = new URLSearchParams(window.location.search);
let flu = url.get('flu');
let writer = new filewriter();
writer.write(url);

class EndPage extends Component {
  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
    this.question = this.question.bind(this);
  }

  componentDidMount() {
    pageLoaded('Survey');
    //this.props.dispatch(navEnable(false));
  }

  question(event) {
      alert("A staff member has been notified for assistance.");
    }

  componentWillUnmount() {
    //this.props.dispatch(navEnable(true));
  }

  _onSubmit(event, num) {
    var newurl = ""
    switch(num){
      case 0://Previous Page
        window.location.href = "./CameraPage?"+url;
        break;
      case 1://Next Page
        if(url.has('answer')){
          url.delete('answer');
        }
        window.location.href = "./Dashboard?"+url;
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
          justify='end'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
          colorIndex="neutral-4-a">
          <Box direction="row">
            <Button align="end" icon={<HomeIcon colorIndex='light-1'/>}
              href="/Dashboard"/>
            <Button align="end" icon={<HelpIcon colorIndex='light-1'/>}
              onClick={this.question}/>
          </Box>
        </Header>

        <Section>
          <Box align='center' textAlign='center' direction='column'>
            <Headline tag='h1' strong={false} size='large'>
              <br/>
              Thank you!
            </Headline>
            <Headline tag='h1' size='small'>
              <br/>
              Please return to the lobby to wait for your physician.
              <br/>
              <br/>
              You may visit the reception desk if you have any further questions.
            </Headline>
            <Button label='Done' align='center' href="/Dashboard"/>
          </Box>
        </Section>

        <Footer float={true} fixed={true} size="medium" justify="between" colorIndex="neutral-4-a">
          <Button icon={<CaretBackIcon/>} onClick = {event => this._onSubmit(event, 0)} colorIndex='light-1'/>
          <Meter min='0' max='8' type="bar" value={8} colorIndex='light-1' size="medium"/>
          {/*<Button icon={<CaretNextIcon/>} onClick = {event => this._onSubmit(event, 1)} colorIndex='light-1'/>*/}
          <Paragraph/>
        </Footer>
      </Article>
    );
  }
}

EndPage.defaultProps = {
  session: {
    error: undefined
  }
};

EndPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

EndPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default EndPage;
