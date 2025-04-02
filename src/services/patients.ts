import axios from "axios";
import { Entry, HealthCheckEntryFormValues, NonSensitivePatient, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const addEntry = async (patientId: Patient['id'], object: HealthCheckEntryFormValues) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    object
  );

  return data;
};

const getAll = async () => {
  const { data } = await axios.get<NonSensitivePatient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getById = async (patientId: Patient['id']) => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${patientId}`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

export default {
  addEntry, getAll, getById, create
};
