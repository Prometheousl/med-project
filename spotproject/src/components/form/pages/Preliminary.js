import React,  { Component } from 'react';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Back from '../../common/Back';

const backgroundShape = require('../../../images/shape.svg');

const logo = require('../../../images/logo.png');

const contactNurse = () => {
  window.alert(`A nurse will be with you shortly.`);
};

//const numeral = require('numeral');
//numeral.defaultFormat('0');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary['A100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 10,
    padding: 20,
    paddingBottom: 500
  },
  grid: {
    margin: `0 ${theme.spacing.unit * 2}px`
  },
  smallContainer: {
    width: '60%'
  },
  bigContainer: {
    width: '80%'
  },
  logo: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepGrid: {
    width: '80%'
  },
  buttonBar: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 42
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  }
})

const getSteps = () => {
  return [
    'Pain',
    'Returning',
    'Result'
  ];
}

class Preliminary extends Component {

  state = {
    activeStep: 0,
    receivingChestPain: '',
    termsChecked: false,
    loading: true
  }

  componentDidMount() {

  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
    if(this.state.activeStep === 2) {
      setTimeout(() => this.props.history.push('/review'), 5000)
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTerms = event => {
    this.setState({ termsChecked: event.target.checked });
  };

  stepActions() {
    if(this.state.activeStep === 0) {
      return 'Next';
    }
    if(this.state.activeStep === 1) {
      return 'Next';
    }
    if(this.state.activeStep === 2) {
      return 'Done';
    }
    return 'Next';
  }

  render() {

    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, loading } = this.state;
    console.log(this.state.receivingChestPain);

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Back name='Main Page' path='/main' />
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.logo}>
                  <img width={100} height={100} src={logo} />
                </div>
                <div className={classes.stepContainer}>
                  <div className={classes.stepGrid}>
                    <Stepper classes={{root: classes.stepper}} activeStep={activeStep} alternativeLabel>
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  { activeStep === 0 && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <div>
                        <div style={{marginBottom: 32}}>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            Are you feeling any chest pain?
                          </Typography>
                        </div>
                        <div>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <RadioGroup
                            aria-label="ChestPain"
                            name="receivingChestPain"
                            className={classes.group}
                            value={this.state.receivingChestPain}
                            onChange={this.handleChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" onChange={contactNurse}/>
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                          </FormControl>
                        </div>
                      </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 1 && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                    <div>
                      <div style={{marginBottom: 32}}>
                        <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                          Are you a returning patient or a new patient?
                        </Typography>
                      </div>
                      <div>
                        <Grid spacing={24} container>
                          <Grid item xs={3}>
                            <Button variant="contained" color="primary" className={classes.button}>
                              Returning
                            </Button>
                          </Grid>
                          <Grid item xs={3}>
                            <Button component={Link} to="/basicInfo" variant="contained" color="secondary" className={classes.button}>
                              New
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 2 && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <div>
                        <div style={{marginBottom: 32}}>
                          <Typography variant="subtitle1" gutterBottom>
                            Enter your name and cwid and we will attempt to locate your records.
                          </Typography>
                          <Typography variant="body2" gutterBottom>

                          </Typography>
                        </div>
                      </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 3 && (
                  <div className={classes.bigContainer}>
                    <Paper className={classes.paper}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: 380, textAlign: 'center'}}>
                          <div style={{marginBottom: 32}}>
                            <Typography variant="h6" style={{fontWeight: 'bold'}} gutterBottom>
                              Collecting your data
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              We are processing your request
                            </Typography>
                          </div>
                          <div>
                            <Fade
                              in={loading}
                              style={{
                                transitionDelay: loading ? '800ms' : '0ms',
                              }}
                              unmountOnExit
                            >
                              <CircularProgress style={{marginBottom: 32, width: 100, height: 100}} />
                            </Fade>
                          </div>
                        </div>
                      </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep !== 3 && (
                     <div className={classes.buttonBar}>
                     { activeStep !== 2 ? (
                       <Button
                       disabled={activeStep === 0}
                       onClick={this.handleBack}
                       className={classes.backButton}
                       size='large'
                       >
                         Back
                       </Button>
                     ) : (
                       <Button
                       disabled={activeStep === 0}
                       onClick={this.handleBack}
                       className={classes.backButton}
                       size='large'
                       >
                         Cancel
                       </Button>
                     )}
                     <Button
                       variant="contained"
                       color="primary"
                       onClick={this.handleNext}
                       size='large'
                       style={this.state.receivingChestPain.length ? {background: classes.button, color: 'white'} : {}}
                       disabled={!this.state.receivingChestPain.length}
                     >
                       {this.stepActions()}
                     </Button>
                   </div>
                  )}

                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Preliminary))
