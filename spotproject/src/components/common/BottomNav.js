import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import LinkButton from './LinkButton';

const styles = theme => ({
  buttonMargin: {
    margin: '30px'
  },
});
/**
 * The bottom navigation for the page... has a next and back button.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
class BottomNav extends Component {
  render() {
    const { classes, back, next } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={4} />
        <Grid item xs={2}>
          <LinkButton name="Back" path={back} color="secondary"/>
        </Grid>
        <Grid item xs={3}>
          <LinkButton name="Next" path={next} color="primary"/>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    )
  }
}

BottomNav.propTypes = {
  classes: PropTypes.object.isRequired,
  back: PropTypes.string.isRequired,
  next: PropTypes.string.isRequired,
};

export default withRouter(withStyles(styles)(BottomNav));
