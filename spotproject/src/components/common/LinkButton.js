import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  buttonMargin: {
    margin: '30px'
  },
});

class LinkButton extends Component {
  render() {
    const { classes, path, name, color } = this.props;
    return (
      <Button
        variant="contained"
        color={color}
        onClick={this.handleNext}
        size="large"
        component={Link}
        to={path}
        className={classes.buttonMargin}
      >
        {name}
      </Button>
    )
  }
}

LinkButton.propTypes = {
  classes: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default withRouter(withStyles(styles)(LinkButton));
