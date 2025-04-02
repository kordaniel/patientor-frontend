import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

import ErrorRenderer from '../ErrorRenderer';

import patientService from '../../services/patients';
import { isString } from '../../utils/parsersTypeGuards';
import { Entry, HealthCheckEntryFormValues, HealthCheckRating, Patient } from '../../types';

const initialNewHealthcheckEntry: HealthCheckEntryFormValues = {
  type: 'HealthCheck',
  description: '',
  date: '',
  specialist: '',
  diagnosisCodes: [''],
  healthCheckRating: HealthCheckRating.Healthy,
};

interface AddEntryFormProps {
  patientId: Patient['id'];
  addEntryToPatient: (entry: Entry) => void;
}

const AddEntryForm = ({ patientId, addEntryToPatient }: AddEntryFormProps) => {
  const [error, setError] = useState<string>('');
  const [newHealthCheckEntry, setNewHealthCheckEntry] = useState<HealthCheckEntryFormValues>(initialNewHealthcheckEntry);

  const style: React.CSSProperties = {
    marginTop: '1.0em',
    marginBottom: '1.0em',
    padding: '0.5em',
    border: 'solid',
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      description: e.target.value,
    });
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      date: e.target.value,
    });
  };

  const handleSpecialistChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      specialist: e.target.value,
    });
  };

  const handleHealthCheckRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const addedChar = e.target.value.slice(-1)[0];
    if (isNaN(Number(addedChar))
      || Number(addedChar) < HealthCheckRating.Healthy
      || Number(addedChar) > HealthCheckRating.CriticalRisk
    ) {
      return;
    }
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      healthCheckRating: Number(addedChar),
    });
  };

  const handleDiagnosisCodesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const textInputElements = e.target.value.split(/[\s]+|,\s?/); // split input by whitespace and ',[ ]'
    const diagnosisCodes = textInputElements.filter((e, i) => e !== ''
      ? true                                                      // keep all non-empty diagnosis codes
      : textInputElements.length === 0
        ? true                                                    // keep the initial empty code
        : newHealthCheckEntry.diagnosisCodes.length === textInputElements.length
          ? false                                                 // trigged when user is erasing content from the textfield, discard emptied diagnose
          : (i+1) === textInputElements.length ? true : false     // prevent user from adding empty diagnoses and keep only the last one - triggered when user repeats whitespace or ,
    );

    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      diagnosisCodes,
    });
  };


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const newHealthCheckEntryResponse = await patientService.addEntry(patientId, newHealthCheckEntry);
      setError('');
      setNewHealthCheckEntry(initialNewHealthcheckEntry);
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
                if (!(cur.path) || !Array.isArray(cur.path) || !isString(cur.path[0]) || !(cur.path[0] in newHealthCheckEntry)) {
                  acc.push(e.message);
                } else {
                  const field = cur.path[0];
                  const suggestions = cur.options && Array.isArray(cur.options)
                    ? ` Expected: ${cur.options.join(', ')}.`
                    : null;
                  const errorString = suggestions                             // can safely cast here due to if check
                    ? `Value of ${field} incorrect: [${newHealthCheckEntry[field as keyof typeof newHealthCheckEntry]}].${suggestions}`
                    : `Value of ${field} incorrect: [${newHealthCheckEntry[field as keyof typeof newHealthCheckEntry]}].`;
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          fullWidth
          value={newHealthCheckEntry.description}
          onChange={handleDescriptionChange}
        />
        <TextField
          label="Date"
          fullWidth
          value={newHealthCheckEntry.date}
          onChange={handleDateChange}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={newHealthCheckEntry.specialist}
          onChange={handleSpecialistChange}
        />
        <TextField
          label="HealthCheck Rating"
          fullWidth
          value={newHealthCheckEntry.healthCheckRating}
          onChange={handleHealthCheckRatingChange}
        />
        <TextField
          label="Diagnosis codes (separate with space or comma)"
          fullWidth
          value={newHealthCheckEntry.diagnosisCodes.join(', ')}
          onChange={handleDiagnosisCodesChange}
        />

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
