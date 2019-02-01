import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Sidebar from '../../common/Sidebar'
import BottomNav from '../../common/BottomNav'
import FamilyHistoryForm from '../forms/FamilyHistoryForm'

const styles = theme => ({
  buttonMargin: {
    margin: '30px'
  },
  typographyMargin: {
    marginBottom: '30px'
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
class FamilyHistory extends React.Component {
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

        <Sidebar header='Family Medical History'>
          <Typography variant="h4" className={classes.typographyMargin}>Please let us know of any problems in your family's medical history.</Typography>
          <Paper className={classes.paper}>
            <FamilyHistoryForm handleSubmit={submit}/>
          </Paper>
          <BottomNav back='/basicInfo' next='/questions' />

        </Sidebar>

    );
  }
}

export default withRouter(withStyles(styles)(FamilyHistory))
