import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import Sidebar from '../common/Sidebar'
import HeartRateChart from './dataWidgets/HeartRateChart';
import PatientData from './dataWidgets/PatientData';
import NibpData from './dataWidgets/NibpData';
import Spo2Data from './dataWidgets/Spo2Data';
import TemperatureData from './dataWidgets/TemperatureData';

import store from '../../store';

const styles = theme => ({
  root: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  section: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
  },
});

/**
 * Container component for the different health data components.
 * Organizes each into their respective boxes in a grid.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
class HealthData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getFirstName(name) {
    return name ? name : "John";
  }

  getLastName(name) {
    return name ? name : "Doe";
  }

  render() {
    const { classes } = this.props;
    const values = store.getState().form.BasicInfoForm.values;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Sidebar header='Health Data'>
          <Paper className={classes.paper}>
            <div className={classes.section}>
              <Typography variant="h4" gutterBottom component="h2" align="center">
                {this.getFirstName(values.firstName)} {this.getLastName(values.lastName)}
              </Typography>
              <PatientData />
            </div>
            <Divider variant='middle' />
            <div className={classes.section}>
              <Typography variant="h4" gutterBottom component="h2" align="center">
                Heart Rate
              </Typography>
              <HeartRateChart />
            </div>
            <Divider variant='middle' />
            <div className={classes.section}>
              <Typography variant="h4" gutterBottom component="h2" align="center">
                Blood Pressure
              </Typography>
              <NibpData />
            </div>
            <Divider variant='middle' />
            <div className={classes.section}>
              <Typography variant="h4" gutterBottom component="h2" align="center">
                Oxygen Levels
              </Typography>
              <Spo2Data />
            </div>
            <Divider variant='middle' />
            <div className={classes.section}>
              <Typography variant="h4" gutterBottom component="h2" align="center">
                Temperature
              </Typography>
              <TemperatureData />
            </div>
          </Paper>
        </Sidebar>
      </div>
    );
  }
}

export default withStyles(styles)(HealthData);
