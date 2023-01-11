import { State } from "./state";
import { Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: 'ADD_PATIENT_SENSITIVE';
      payload: Patient;
    };

export const setPatientList = (patients: Patient[]): Action => {
  return {
    type: 'SET_PATIENT_LIST',
    payload: patients
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: 'ADD_PATIENT',
    payload: patient
  };
};

export const addPatientSensitive = (patientSensitive: Patient): Action => {
  return {
    type: 'ADD_PATIENT_SENSITIVE',
    payload: patientSensitive
  };
};


export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        },
        ...state.patientsSensitive
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        },
        ...state.patientsSensitive
      };
    case "ADD_PATIENT_SENSITIVE":
      return {
        ...state,
        ...state.patients,
        patientsSensitive: {
          ...state.patientsSensitive,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};
