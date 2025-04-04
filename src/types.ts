type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
type UnionExtractExtendingFields<T, U> = Omit<T, keyof Omit<U, 'type'>>;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum EntryType {
  HealthCheck = 'HealthCheck',
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
}

interface BaseEntry {
  type: EntryType;
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: {
    date: string;
    criteria: string;
  };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn: string;
  dateOfBirth: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
export type BaseEntryFormValues = Required<Omit<BaseEntry,'id' | 'type'>>;

export type NewEntryFormValues = UnionOmit<Entry, 'id'>;

export type HealthCheckEntryFormValues = UnionExtractExtendingFields<HealthCheckEntry, BaseEntry>;
export type OccupationalHealthcareEntryFormValues = UnionExtractExtendingFields<OccupationalHealthcareEntry, BaseEntry>;
export type HospitalEntryFormValues = UnionExtractExtendingFields<HospitalEntry, BaseEntry>;
