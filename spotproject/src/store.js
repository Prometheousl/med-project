import { createStore, combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import devToolsEnhancer from 'remote-redux-devtools';

const initialState = {
  form: {
    BasicInfoForm: {
      values: {
        address: "",
        birthdate: "",
        citizen: "",
        city: "",
        contactAddress: "",
        contactCity: "",
        contactRelationship: "",
        contactState: "",
        contactZip: "",
        cwid: "",
        emergencyContact: "",
        employed: false,
        firstName: "",
        lastName: "",
        middleInitial: "",
        phoneNumber: "",
        sex: "",
        state: "",
        zip: "",
      }
    },
    FamilyHistoryForm: {
      values: {
        fatherAge: "",
        fatherProblems: "",
        motherAge: "",
        motherProblems: "",
        siblingProblems: "",
        siblingsAges: "",
      }
    },
    QuestionsForm: {
      values: {
        asthma: "",
        cancer: "",
        comments: "",
        diabetes: "",
        diminishedHearing: "",
        drugAllergies: "",
        gastroProblems: "",
        heartDisease: "",
        hepatitis: "",
        highBloodPressure: "",
        listOther: "",
        other: "",
        psychiatricTreatment: "",
        regularMedication: "",
        seizures: "",
        seriousInjury: "",
        severeHeadaches: "",
        thyroid: "",
        tractInfections: "",
        traveled: "",
        tuberculosis: "",
        tuberculosisYesNo: "",
      }
    }
  }
};

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form"
});

export const store = createStore(
  reducer,
  initialState,
  devToolsEnhancer()
);

export default store;
