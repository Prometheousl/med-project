class StateLoader {
    loadState() {
      console.log("Loading state!\n");
        try {
            let serializedState = localStorage.getItem("localhost:form");
            if (serializedState === null) {
                return this.initializeState();
            }
            return JSON.parse(serializedState);
        }
        catch (err) {
            return this.initializeState();
        }
    }

    saveState(state) {
      console.log("Saving state!\n");
        try {
            let serializedState = JSON.stringify(state);
            console.log(serializedState);
            localStorage.setItem("localhost:form", serializedState);
        }
        catch (err) {
        }
    }

    initializeState() {
        return {
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
    }
}

export default StateLoader;
