import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import asyncValidate from '../asyncValidate';
import validate from './validation/validateInfo';
import store from '../../../store';

const styles = theme => ({

});

const renderTextField = (
  { input, name, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    id={name}
    name={name}
    label={label}
    hintText={label}
    floatingLabelText={label}
    fullWidth
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

const renderRequiredTextField = (
  { input, name, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    required
    id={name}
    name={name}
    label={label}
    hintText={label}
    floatingLabelText={label}
    fullWidth
    autoComplete="blah"
  />
);

const renderCheckbox = ({ input, label }) => (
  <Checkbox
    label={label}
    checked={input.value ? true : false}
    onCheck={input.onChange}
  />
);

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup
    {...input}
    {...rest}
    valueSelected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

const renderSelectField = (
  { input, label, meta: { touched, error }, children, ...custom },
) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);

const renderDateField = (
  { input, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    id="date"
    type="date"
    label={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
);
/**
 * A redux-form component. This component contains fields that the user enters
 * information in and the component stores that information in the redux store.
 *
 * This asks a series of basic information questions necessary for filling out the
 * EHR.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
const BasicInfoForm = props => {
  const { handleSubmit, pristine, reset, submitting, classes } = props;
  console.log(store.getState());

  const values = store.getState().form.BasicInfoForm.values;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Field name="cwid" component={renderTextField} label="CWID" value={values.cwid}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="email" component={renderTextField} label="Email" value={values.email}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="firstName" component={renderTextField} label="First Name" value={values.firstName}/>
        </Grid>
        <Grid item xs={10} sm={4}>
          <Field name="lastName" component={renderTextField} label="Last Name" value={values.lastName}/>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Field name="middleInitial" component={renderTextField} label="MI" value={values.middleInitial}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography align="left"> Birthday </Typography>
          <Field name="birthdate" component={renderDateField} label="Birthdate" value={values.birthdate}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="phoneNumber" component={renderTextField} label="Phone Number" value={values.phoneNumber}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="employed" component={renderCheckbox} label="Employed" value={values.employed}/>
        </Grid>
        <Grid item xs={6} sm={3}>
        <Typography variant="subtitle1"> US Citizen </Typography>
          <Field name="citizen" component={renderRadioGroup} label="US Citizen" value={values.citizen}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={6} sm={3}>
        <Typography variant="subtitle1"> Sex </Typography>
          <Field name="sex" component={renderRadioGroup} value={values.sex}>
            <RadioButton value="male" label="male" />
            <RadioButton value="female" label="female" />
          </Field>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="address" component={renderTextField} label="Address" value={values.address}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="city" component={renderTextField} label="City" value={values.city}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="state" component={renderTextField} label="State" value={values.state}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="zip" component={renderTextField} label="Zip" value={values.zip}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="emergencyContact" component={renderTextField} label="Emergency Contact" value={values.emergencyContact}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="contactRelationship" component={renderTextField} label="Relationship" value={values.contactRelationship}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="contactAddress" component={renderTextField} label="Address of Above" value={values.contactAddress}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="contactCity" component={renderTextField} label="City" value={values.contactCity}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="contactState" component={renderTextField} label="State" value={values.contactState}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field name="contactZip" component={renderTextField} label="Zip" value={values.contactZip}/>
        </Grid>
      </Grid>
    </form>
  );
};

export default withStyles(styles)(
    reduxForm({
    form: 'BasicInfoForm', // a unique identifier for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    asyncValidate,
  })(BasicInfoForm)
);
