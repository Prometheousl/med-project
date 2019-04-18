import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// redux stuff
import { Field, reduxForm } from 'redux-form';
import asyncValidate from '../../../asyncValidate';
import validate from '../../validation/validateInfo';
import store from '../../../../../store';

const renderTextField = (
  { input, name, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    required
    id={name}
    name={name}
    label={label}
    fullWidth
    autoComplete="blah"
  />
);

function AddressForm() {
  const values = store.getState().form.BasicInfoForm.values;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Field name="firstName" component={renderTextField} label="First Name" value={values.firstName}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="lastName" component={renderTextField} label="Last Name" value={values.lastName}/>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="billing address-line1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="billing address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField id="state" name="state" label="State/Province/Region" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="billing postal-code"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="billing country"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default reduxForm({
  form: 'BasicInfoForm', // a unique identifier for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
  asyncValidate,
})(AddressForm);
