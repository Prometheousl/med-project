import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import Sidebar from '../../common/Sidebar';
import SubmitNav from '../../common/SubmitNav';
import BasicInfoForm from '../forms/BasicInfoForm';
import FamilyHistoryForm from '../forms/FamilyHistoryForm';
import QuestionsForm from '../forms/QuestionsForm';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
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
  header: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  }
})

const submit = values => {
  console.log(values);
}

/**
 * Container component for the different health data components.
 * Organizes each into their respective boxes in a grid.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    }
  }



  // what is placed in Sidebar is passed as props.children to Sidebar
  render() {
    const { classes } = this.props;
    // not sure why I need to use Provider again... fix this later.
    return (
        <Sidebar header='Review'>
          <CssBaseline />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h4" align="center" className={classes.header}>
                Basic Information
              </Typography>
              <BasicInfoForm handleSubmit={submit}/>
              <Typography component="h1" variant="h4" align="center" className={classes.header}>
                Family Medical History
              </Typography>
              <FamilyHistoryForm handleSubmit={submit}/>
              <Typography component="h1" variant="h4" align="center" className={classes.header}>
                Medical Questions
              </Typography>
              <QuestionsForm handleSubmit={submit}/>
            </Paper>
          </main>
          <SubmitNav back='/questions' next='/vitals' />

        </Sidebar>

    );
  }
}

export default withRouter(withStyles(styles)(Review))
