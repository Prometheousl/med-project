import { createStore, combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

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

const persistConfig = {
  key: 'groot',
  storage: storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer, initialState);
export const persistor = persistStore(store);

export default store;
