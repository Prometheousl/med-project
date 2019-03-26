import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Sidebar from '../../common/Sidebar'
import BottomNav from '../../common/BottomNav'
import BasicInfoForm from '../forms/BasicInfoForm'

const styles = theme => ({
  typographyMargin: {
    marginBottom: '30px'
  }
});

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
class BasicInfo extends React.Component {
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

        <Sidebar header='Basic Info'>
          <Typography variant="h4" className={classes.typographyMargin}>Please fill out the following form carefully.</Typography>
          <Paper className={classes.paper}>
              <BasicInfoForm handleSubmit={submit}/>
          </Paper>
          <BottomNav type="submit" back='/main' next='/familyHistory'/>
        </Sidebar>

    );
  }
}

export default withRouter(withStyles(styles)(BasicInfo))
