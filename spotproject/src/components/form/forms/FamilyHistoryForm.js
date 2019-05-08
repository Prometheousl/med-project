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
  { input, label, name, meta: { touched, error }, ...custom },
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
 * This asks a series of family history questions necessary for filling out the
 * EHR.
 *
 * @version 1.0.0
 * @author [Alex Lay](https://github.com/Prometheousl)
 */
const FamilyHistoryForm = props => {
  const { handleSubmit, pristine, reset, submitting, classes } = props;
  console.log(store.getState());

  let values = store.getState().form.FamilyHistoryForm.values;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={24}>
        <Grid item xs={24} sm={12}>
          <Typography variant='h6' align='left'>Father</Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Field name="fatherAge" component={renderTextField} label="Age" value={values.fatherAge}/>
        </Grid>
        <Grid item xs={22} sm={10}>
          <Field name="fatherProblems" component={renderTextField} multiLine={true} label="Father's Medical Problems" value={values.fatherProblems}/>
        </Grid>
        <Grid item xs={24} sm={12}>
          <Typography variant='h6' align='left'>Mother</Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Field name="motherAge" component={renderTextField} label="Age"value={values.motherAge}/>
        </Grid>
        <Grid item xs={22} sm={10}>
          <Field name="motherProblems" component={renderTextField} multiLine={true} label="Mother's Medical Problems" value={values.motherProblems}/>
        </Grid>
        <Grid item xs={24} sm={12}>
          <Typography variant='h6' align='left'>Siblings</Typography>
        </Grid>
        <Grid item xs={24} sm={12}>
          <Field name="siblingsAges" component={renderTextField} label="Ages" value={values.siblingsAges}/>
        </Grid>
        <Grid item xs={24} sm={12}>
          <Field name="siblingProblems" component={renderTextField} multiLine={true} label="Siblings' Medical Problems" value={values.siblingsProblems}/>
        </Grid>
      </Grid>
    </form>
  );
};

export default withStyles(styles)(
    reduxForm({
    form: 'FamilyHistoryForm', // a unique identifier for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    asyncValidate,
  })(FamilyHistoryForm)
);
