import React from 'react';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import LinkButton from './common/LinkButton';

const backgroundShape = require('../images/shape.svg');

const logo = require('../images/logo.png');

const background = require('../images/skybackground.jpg')

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary['A100'],
    overflow: 'hidden',
    background: `url(${background}) no-repeat`,
    backgroundSize: 'cover',
    marginTop: 0,
    padding: 20,
    paddingBottom: '100%'
  },
  logo: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center'
  },
  linkButton: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20%'
  }
});

/**
 * Container component for the different health data components.
 * Organizes each into their respective boxes in a grid.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
class Main extends React.Component {
  render() {

    const { classes } = this.props;
    return (
      <div>
        <CssBaseline />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12} >
                <Typography variant='h1' className={classes.logo}>Welcome to the Medical Clinic</Typography>
                <div className={classes.logo}>
                  <img width={100} height={100} src={logo} />
                </div>
                <div className={classes.linkButton}>
                  <LinkButton name="Begin" path="/preliminary" color="primary" />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Main))
