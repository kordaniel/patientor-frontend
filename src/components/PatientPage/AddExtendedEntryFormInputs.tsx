import React, { ChangeEvent } from 'react';
import { CircularProgress, FormControlLabel, FormGroup, TextField } from '@mui/material';
import CheckBox from '@mui/material/Checkbox';

import  { EntryType, HealthCheckRating, NewEntryFormValues } from '../../types';

interface ExtendedEntryFormProps {
  newHealthCheckEntry: NewEntryFormValues;
  setNewHealthCheckEntry: React.Dispatch<React.SetStateAction<NewEntryFormValues>>;
}

export const HealthCheckValues = ({ newHealthCheckEntry, setNewHealthCheckEntry }: ExtendedEntryFormProps) => {
  if (newHealthCheckEntry.type !== EntryType.HealthCheck) {
    return <CircularProgress />;
  }

  const handleHealthCheckRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const addedChar = e.target.value.slice(-1)[0];
    if (isNaN(Number(addedChar))) {
      return;
    }

    const healthCheckRating = Number(addedChar);
    if (healthCheckRating < HealthCheckRating.Healthy || healthCheckRating > HealthCheckRating.CriticalRisk) {
      return;
    }

    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      healthCheckRating: Number(addedChar),
    });
  };

  return <TextField
    label="HealthCheck Rating"
    fullWidth
    value={newHealthCheckEntry.healthCheckRating}
    onChange={handleHealthCheckRatingChange}
  />;
};


export const HospitalEntryValues = ({ newHealthCheckEntry, setNewHealthCheckEntry }: ExtendedEntryFormProps) => {
  if (newHealthCheckEntry.type !== EntryType.Hospital) {
    return <CircularProgress />;
  }

  const handleDischargeDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      discharge: {
        ...newHealthCheckEntry.discharge,
        date: e.target.value,
      },
    });
  };

  const handleDischargeCriteriaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      discharge: {
        ...newHealthCheckEntry.discharge,
        criteria: e.target.value,
      },
    });
  };

  return (
    <>
      <TextField
        label="Discharge date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={newHealthCheckEntry.discharge.date}
        onChange={handleDischargeDateChange}
      />
      <TextField
        label="Discharge criteria"
        fullWidth
        value={newHealthCheckEntry.discharge.criteria}
        onChange={handleDischargeCriteriaChange}
      />
    </>
  );
};


export const OccupationalHealthcareValues = ({ newHealthCheckEntry, setNewHealthCheckEntry }: ExtendedEntryFormProps) => {
  if (newHealthCheckEntry.type !== EntryType.OccupationalHealthcare) {
    return <CircularProgress />;
  }

  const handleCheckbox = () => {
    const newFormState = {
      ...newHealthCheckEntry
    };

    if (!newHealthCheckEntry.sickLeave) {
      newFormState.sickLeave = {
        startDate: '',
        endDate: '',
      };
    } else {
      delete newFormState.sickLeave;
    }

    setNewHealthCheckEntry(newFormState);
  };

  const handleEmployerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      employerName: e.target.value,
    });
  };

  const handleSickLeaveStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!newHealthCheckEntry.sickLeave) {
      return;
    }

    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      sickLeave: {
        ...newHealthCheckEntry.sickLeave,
        startDate: e.target.value,
      },
    });
  };

  const handleSickLeaveEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!newHealthCheckEntry.sickLeave) {
      return;
    }

    setNewHealthCheckEntry({
      ...newHealthCheckEntry,
      sickLeave: {
        ...newHealthCheckEntry.sickLeave,
        endDate: e.target.value,
      },
    });
  };

  return (
    <>
      <TextField
        label="Employer name"
        fullWidth
        value={newHealthCheckEntry.employerName}
        onChange={handleEmployerNameChange}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <CheckBox
              checked={Boolean(newHealthCheckEntry.sickLeave)}
              onChange={handleCheckbox}
              inputProps={{ "aria-label": "Grant sickleave and open sickleave dates selection" }}
            />
          }
          label="Grant sickleave"
        />
      </FormGroup>
      {newHealthCheckEntry.sickLeave && (
        <>
          <TextField
            label="Start date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newHealthCheckEntry.sickLeave.startDate}
            onChange={handleSickLeaveStartDateChange}
          />
          <TextField
            label="End date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newHealthCheckEntry.sickLeave.endDate}
            onChange={handleSickLeaveEndDateChange}
          />
        </>
      )}
    </>
  );
};
