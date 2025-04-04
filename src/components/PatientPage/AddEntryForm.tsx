import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';

import ErrorRenderer from '../ErrorRenderer';
import {
  HealthCheckValues,
  HospitalEntryValues,
  OccupationalHealthcareValues,
} from './AddExtendedEntryFormInputs';

import patientService from '../../services/patients';
import { assertNever, isString } from '../../utils/parsersTypeGuards';
import {
  BaseEntryFormValues,
  Entry,
  EntryType,
  HealthCheckEntryFormValues,
  HealthCheckRating,
  HospitalEntryFormValues,
  NewEntryFormValues,
  OccupationalHealthcareEntryFormValues,
  Patient
} from '../../types';

interface FormValues {
  emptyBaseEntry: Omit<BaseEntryFormValues, 'type'>;
  emptyHealthCheckEntry: HealthCheckEntryFormValues;
  emptyOccupationalHealthcareEntry: OccupationalHealthcareEntryFormValues;
  emptyHospitalEntry: HospitalEntryFormValues;
  /**
   * Creates a new object for the form with the required fields for every different type. If second argument
   * is passed, copies the state of the baseEntry fields to the new object.
   */
  constructNewEntry: (type: EntryType, baseEntryFormValues?: Omit<BaseEntryFormValues, 'type'>) => NewEntryFormValues;
}

const formValues: FormValues = {
  emptyBaseEntry: {
    description: '',
    date: '',
    specialist: '',
    diagnosisCodes: [''],
  },
  emptyHealthCheckEntry: {
    type: EntryType.HealthCheck,
    healthCheckRating: HealthCheckRating.Healthy,
  },
  emptyOccupationalHealthcareEntry: {
    type: EntryType.OccupationalHealthcare,
    employerName: '',
    sickLeave: {
      startDate: '',
      endDate: '',
    },
  },
  emptyHospitalEntry: {
    type: EntryType.Hospital,
    discharge: {
      date: '',
      criteria: '',
    },
  },
  constructNewEntry: (type, baseEntryFormValues): NewEntryFormValues => {
    const base: FormValues['emptyBaseEntry'] = baseEntryFormValues ? {
      description: baseEntryFormValues.description,
      date: baseEntryFormValues.date,
      specialist: baseEntryFormValues.specialist,
      diagnosisCodes: baseEntryFormValues.diagnosisCodes,
    } : formValues.emptyBaseEntry;
    switch (type) {
      case EntryType.HealthCheck: return { ...base, ...formValues.emptyHealthCheckEntry, };
      case EntryType.Hospital: return { ...base, ...formValues.emptyHospitalEntry, };
      case EntryType.OccupationalHealthcare: return { ...base, ...formValues.emptyOccupationalHealthcareEntry, };
      default: return assertNever(type);
    }
  },
};

interface AddEntryFormProps {
  patientId: Patient['id'];
  addEntryToPatient: (entry: Entry) => void;
}

interface EntryTypeOption {
  value: EntryType;
  label: string;
}

const entryTypeOptions: EntryTypeOption[] = Object.values(EntryType).map(type => ({
  value: type, label: type.toString()
}));

const AddEntryForm = ({ patientId, addEntryToPatient }: AddEntryFormProps) => {
  const [error, setError] = useState<string>('');
  const [newEntryValues, setNewEntryValues] = useState<NewEntryFormValues>(
    formValues.constructNewEntry(EntryType.HealthCheck)
  );

  const style: React.CSSProperties = {
    marginTop: '1em',
    marginBottom: '1em',
    padding: '0.5em',
    border: 'solid',
  };
  const formStyle: React.CSSProperties = {
    marginTop: '1em',
    display: 'flex',
    flexDirection: 'column',
    gap: '1em'
  };

  const selectExtendedEntryTypeFields = () => {
    // For some reason the newEntryValues.type must be extracted into
    // its own variable so that typescript will correctly recognize if
    // all the possible types are handled.. why??
    const selectedEntryType: EntryType = newEntryValues.type;
    switch (selectedEntryType) {
      case EntryType.HealthCheck:
        return <HealthCheckValues
          newHealthCheckEntry={newEntryValues}
          setNewHealthCheckEntry={setNewEntryValues}
        />;
      case EntryType.OccupationalHealthcare:
        return <OccupationalHealthcareValues
          newHealthCheckEntry={newEntryValues}
          setNewHealthCheckEntry={setNewEntryValues}
        />;
      case EntryType.Hospital:
        return <HospitalEntryValues
          newHealthCheckEntry={newEntryValues}
          setNewHealthCheckEntry={setNewEntryValues}
        />;
      default:
        return assertNever(selectedEntryType);
    }
  };

  const onEntryTypeChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    if (typeof e.target.value !== 'string') {
      console.error(`Selection of a not supported entry type: ${e.target.value}. Contact lazy coder.`);
      return;
    }
    const selectedType = e.target.value as EntryType;

    switch (selectedType) {
      case EntryType.HealthCheck: {
        setError('');
        setNewEntryValues(formValues.constructNewEntry(EntryType.HealthCheck, newEntryValues));
        break;
      }
      case EntryType.OccupationalHealthcare: {
        setError('');
        setNewEntryValues(formValues.constructNewEntry(EntryType.OccupationalHealthcare, newEntryValues));
        break;
      }
      case EntryType.Hospital: {
        setError('');
        setNewEntryValues(formValues.constructNewEntry(EntryType.Hospital, newEntryValues));
        break;
      }
      default: // NOTE: Fails at runtime if selection contains options outside the enum values.
        assertNever(selectedType);
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEntryValues({
      ...newEntryValues,
      description: e.target.value,
    });
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEntryValues({
      ...newEntryValues,
      date: e.target.value,
    });
  };

  const handleSpecialistChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEntryValues({
      ...newEntryValues,
      specialist: e.target.value,
    });
  };

  const handleDiagnosisCodesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const textInputElements = e.target.value.split(/[\s]+|,\s?/); // split input by whitespace and ,whitespace?
    const diagnosisCodes = textInputElements.filter((e, i) => e !== ''
      ? true                                                      // keep all non-empty diagnosis codes
      : textInputElements.length === 0
        ? true                                                    // keep the initial empty code
        : newEntryValues.diagnosisCodes.length === textInputElements.length
          ? false                                                 // trigged when user is erasing content from the textfield, discard emptied diagnose
          : (i+1) === textInputElements.length ? true : false     // prevent user from adding empty diagnoses and keep only the last one - triggered when user repeats whitespace or ,
    );

    setNewEntryValues({
      ...newEntryValues,
      diagnosisCodes,
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const newHealthCheckEntryResponse = await patientService.addEntry(patientId, {
        ...newEntryValues,
        diagnosisCodes: newEntryValues.diagnosisCodes.filter(c => c !== ''),
      });
      setError('');
      setNewEntryValues(formValues.constructNewEntry(newEntryValues.type));
      addEntryToPatient(newHealthCheckEntryResponse);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          if (e.response.status === 404) {
            setError(`Error (${e.response.statusText}): Patient not found in DB, contact lazy coder.`);
            console.error('404:', e.response.statusText);
          } else if (typeof e.response.data === 'string') {
            setError(e.response.data);
            console.error(e);
          } else if (e.response.data.error) {
            if (Array.isArray(e.response.data.error)) {
              const errorStr = e.response.data.error.reduce((acc: string[], cur: { options?: unknown, path?: unknown}) => {
                if (!(cur.path) || !Array.isArray(cur.path) || !isString(cur.path[0]) || !(cur.path[0] in newEntryValues)) {
                  acc.push(e.message);
                } else {
                  const field = cur.path[0];
                  const suggestions = cur.options && Array.isArray(cur.options)
                    ? ` Expected: ${cur.options.map(v => JSON.stringify(v)).join(', ')}.`
                    : null;
                  const errorString = suggestions                             // can safely cast here due to if check
                    ? `Value of ${field} incorrect: [${JSON.stringify(newEntryValues[field as keyof typeof newEntryValues])}].${suggestions}`
                    : `Value of ${field} incorrect: [${JSON.stringify(newEntryValues[field as keyof typeof newEntryValues])}].`;
                  acc.push(errorString);
                }
                return acc;
              }, []);
              setError(errorStr.join(' || '));
            } else {
              setError(e.message);
              console.error(e);
            }
          } else {
            setError(e.response.statusText);
            console.error(e);
          }
        }
      } else if (e instanceof Error) {
        setError(e.message);
        console.error(e);
      } else {
        setError('Unknown error');
        console.error('unknown error:', e);
      }
    }
  };

  return (
    <Box style={style}>
      <Typography style={{ marginBottom: "0.5em" }} variant="h6">New HealthCheck Entry</Typography>
      <ErrorRenderer errorMsg={error} />
      <InputLabel id="entryTypeSelection-label">Select entry type:</InputLabel>
      <Select
        label="Select entry type"
        fullWidth
        labelId="entryTypeSelection-label"
        id="entryTypeSelection"
        value={newEntryValues.type}
        onChange={onEntryTypeChange}
      >
        {entryTypeOptions.map(option => (
          <MenuItem key={option.label} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
      <form style={formStyle} onSubmit={handleSubmit}>
        <TextField
          label="Description"
          fullWidth
          value={newEntryValues.description}
          onChange={handleDescriptionChange}
        />
        <TextField
          label="Date"
          fullWidth
          value={newEntryValues.date}
          onChange={handleDateChange}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={newEntryValues.specialist}
          onChange={handleSpecialistChange}
        />
        <TextField
          label="Diagnosis codes (separate with space or comma)"
          fullWidth
          value={newEntryValues.diagnosisCodes.join(', ')}
          onChange={handleDiagnosisCodesChange}
        />
        {selectExtendedEntryTypeFields()}
        <Box display="flex" flexDirection="row-reverse" p={1}>
            <Button
              variant="contained"
              type="submit"
            >
              Add
            </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryForm;
