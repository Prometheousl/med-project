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

const QuestionsForm = props => {
  const { handleSubmit, pristine, reset, submitting, classes } = props;
  console.log(store.getState());

  let values = store.getState().form.QuestionsForm.values;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={24} alignItems="flex-end">
        <Grid item xs={3}>
          <Field name="drugAllergies" component={renderTextField} label="Do you have any drug allergies?" value={values.drugAllergies}/>
        </Grid>
        <Grid item xs={3}>
          <Field name="regularMedication" component={renderTextField} label="List your regular medication." value={values.regularMedication}/>
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={3}>
          <Field name="psychiatricTreatment" multiLine={true} rows={2} component={renderTextField} label="Have you ever received psychiatric treatment?" value={values.psychiatricTreatment}/>
        </Grid>
        <Grid item xs={3}>
          <Field name="seriousInjury" multiLine={true} rows={2} component={renderTextField} label="Have you ever had a serious injury or surgery? (Please List)" value={values.seriousInjury}/>
        </Grid>
        <Grid item xs={3}>
          <Field name="traveled" multiLine={true} rows={2} component={renderTextField} label="Have you traveled outside the United States in the last year?" value={values.traveled}/>
        </Grid>
        <Grid item xs={3}>
          <Field name="tuberculosis"  multiLine={true} rows={2} component={renderTextField} label="Have you been exposed to or had a positive test for tuberculosis?" value={values.tuberculosis}/>
        </Grid>
        <Grid item xs={12}>
          <Field name="listOther"  multiLine={true} rows={2} component={renderTextField} label="If you have any illness or medical condition that requires regular treatment or alternation of your lifestyle, please list it here." value={values.listOther}/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>Have you had any of the following? Select yes or no for all questions and briefly comment on yes answers in the space provided (dates, complications, etc.)</Typography>
        </Grid>
        <Grid item xs={2}>
        <Typography variant="h6"> Asthma </Typography>
          <Field name="asthma" component={renderRadioGroup} label="Asthma" value={values.asthma}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={2}>
        <Typography variant="h6"> Cancer </Typography>
          <Field name="cancer" component={renderRadioGroup} label="Severe Headaches" value={values.cancer}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={2}>
        <Typography variant="h6"> Hepatitis </Typography>
          <Field name="hepatitis" component={renderRadioGroup} label="Hepatitis" value={values.hepatitis}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={2}>
        <Typography variant="h6"> Tuberculosis </Typography>
          <Field name="tuberculosisYesNo" component={renderRadioGroup} label="Tuberculosis" value={values.tuberculosisYesNo}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={2}>
        <Typography variant="h6"> Diabetes </Typography>
          <Field name="diabetes" component={renderRadioGroup} label="Diabetes" value={values.diabetes}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={2}>
        <Typography variant="h6"> Thyroid Disease </Typography>
          <Field name="thyroid" component={renderRadioGroup} label="Thyroid Disease" value={values.thyroid}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> High Blood Pressure </Typography>
          <Field name="highBloodPressure" component={renderRadioGroup} label="Asthma" value={values.highBloodPressure}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Diminished Hearing </Typography>
          <Field name="diminishedHearing" component={renderRadioGroup} label="Asthma" value={values.diminishedHearing}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Gastrointestinal or Colon Problems </Typography>
          <Field name="gastroProblems" component={renderRadioGroup} label="Asthma" value={values.gastroProblems}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Repeated Urinary Tract Infection </Typography>
          <Field name="tractInfections" component={renderRadioGroup} label="Asthma" value={values.tractInfections}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Congenital Heart Problems or Heart Disease </Typography>
          <Field name="heartDisease" component={renderRadioGroup} label="Asthma" value={values.heartDisease}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Epilepsy, Convulsions, or Seizures </Typography>
          <Field name="seizures" component={renderRadioGroup} label="Asthma" value={values.seizures}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Severe Headaches </Typography>
          <Field name="severeHeadaches" component={renderRadioGroup} label="Asthma" value={values.severeHeadaches}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h6"> Other </Typography>
          <Field name="other" component={renderRadioGroup} label="Asthma" value={values.other}>
            <RadioButton value="yes" label="Yes" />
            <RadioButton value="no" label="No" />
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Field name="comments" multiLine={true} rows={2} component={renderTextField} label="Enter comments here." value={values.comments}>
          </Field>
        </Grid>
      </Grid>
    </form>
  );
};

export default withStyles(styles)(
    reduxForm({
    form: 'QuestionsForm', // a unique identifier for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    asyncValidate,
  })(QuestionsForm)
);
