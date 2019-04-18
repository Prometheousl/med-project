import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import LinkButton from './LinkButton';
import Button from '@material-ui/core/Button';

import store from '../../store';

const endpoint = 'http://127.0.0.1:3000/';
const submitEndpoint = endpoint + 'submit';

const styles = theme => ({
  buttonMargin: {
    margin: '30px'
  },
});

class BottomNav extends Component {

  handleSubmit() {
    console.log(store.getState().form)
    axios.post(submitEndpoint,store.getState().form)
    .then(function(res) {
      console.log(res);
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  render() {
    const { classes, back, next } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={4} />
        <Grid item xs={2}>
          <LinkButton name="Back" path={back} color="secondary"/>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color='primary'
            onClick={this.handleSubmit}
            size="large"
            component={Link}
            to={next}
            className={classes.buttonMargin}
          >
            Submit
          </Button>
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
