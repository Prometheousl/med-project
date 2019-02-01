import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';

const styles = theme => ({
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  text: {
    display: 'inline-block',
    verticalAlign: 'text-bottom'
  }
});

class Back extends Component {
  render() {
    const { classes, path, name } = this.props;
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          <Link className={classes.link} to={{ pathname: '/main' }}>
            <KeyboardArrowLeft />
            <span className={classes.text}>Back to { name }</span>
          </Link>
        </Typography>
      </div>
    )
  }
}

Back.propTypes = {
  classes: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default withRouter(withStyles(styles)(Back));
