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
import validate from '../validate';
import store from '../../../store'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  field: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

const renderTextField = (
  { input, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
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

const FamilyHistoryForm = props => {
  const { handleSubmit, pristine, reset, submitting, classes } = props;
  console.log(store.getState());

  const values = store.getState().form.FamilyHistoryForm.values;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={24} alignItems="flex-end">
        <Grid item xs={3}>
          <Typography variant="h4">Family</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4">Age</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Significant Medical Problems</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">Father</Typography>
        </Grid>
        <Grid item xs={3}>
          <Field name="fatherAge" component={renderTextField} label="Father's Age" value={values.fatherAge}/>
        </Grid>
        <Grid item xs={6}>
          <Field name="fatherProblems" component={renderTextField} multiLine={true} rows={2} label="Father's Medical Problems" value={values.fatherProblems}/>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">Mother</Typography>
        </Grid>
        <Grid item xs={3}>
          <Field name="motherAge" component={renderTextField} label="Mother's Age"value={values.motherAge}/>
        </Grid>
        <Grid item xs={6}>
          <Field name="motherProblems" component={renderTextField} multiLine={true} rows={2} label="Mother's Medical Problems" value={values.motherProblems}/>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">Siblings</Typography>
        </Grid>
        <Grid item xs={3}>
          <Field name="siblingsAges" component={renderTextField} label="Siblings' Ages" value={values.siblingsAges}/>
        </Grid>
        <Grid item xs={6}>
          <Field name="siblingProblems" component={renderTextField} multiLine={true} rows={2} label="Siblings' Medical Problems" value={values.siblingsProblems}/>
        </Grid>

        <Grid item xs={3}>
          <button type="submit" disabled={pristine || submitting}>Submit</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </button>
        </Grid>
      </Grid>
    </form>
  );
};

export default withStyles(styles)(
    reduxForm({
    form: 'FamilyHistoryForm', // a unique identifier for this form
    validate,
    asyncValidate,
  })(FamilyHistoryForm)
);
