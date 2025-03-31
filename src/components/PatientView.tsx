import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Diagnosis, Entry, Patient } from '../types';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';

import patientService from '../services/patients';
import { isString } from '../utils/parsersTypeGuards';
import GenderIcon from './Icons/GenderIcon';

interface EntriesProps {
  entries: Patient['entries'];
  diagnosesList: Diagnosis[];
}

interface EntryViewProps {
  entry: Entry;
  diagnosesList: Diagnosis[];
  includeDivider: boolean;
}

interface PatientViewProps {
  diagnosesList: Diagnosis[];
}

const EntryView = ({ entry, diagnosesList, includeDivider = false }: EntryViewProps) => {
  const renderEntryCode = (code: string): string => {
    const diagnose = diagnosesList.find(d => d.code === code);
    if (!diagnose) {
      return `${code}`;
    }
    const parts = [
      code,
      diagnose.latin ? ` (${diagnose.latin})` : null,
      `: ${diagnose.name}`
    ];
    return parts.join('');
  };

  return (
    <Box>
      <Typography variant="body1">Date: {new Date(entry.date).toLocaleDateString()}</Typography>
      <Typography variant="body1">
        Description: <Box component="span" style={{ fontStyle: "italic" }}>{entry.description}</Box>
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
        <Box>
          <Typography variant="subtitle2">Diagnoses:</Typography>
          <ul style={{ margin: 0 }}>
            {entry.diagnosisCodes.map(code => (
              <li key={code}><Typography variant="subtitle2">{renderEntryCode(code)}</Typography></li>
            ))}
          </ul>
        </Box>
      ) : (
        <Typography variant="subtitle2">No diagnosis codes</Typography>
      )}
      {includeDivider && <Divider />}
    </Box>
  );
};

const Entries = ({ entries, diagnosesList }: EntriesProps) => {
  return (
    <Box style={{ marginTop: "1.0em" }} >
      <Typography style={{ marginBottom: "0.5em" }} variant="h6">Entries</Typography>
      {entries.length > 0
        ? entries.map((entry, i) => (
          <EntryView
            key={entry.id}
            entry={entry}
            diagnosesList={diagnosesList}
            includeDivider={i+1 < entries.length}
          />
        ))
        : <Typography>Patient has no entries</Typography>
      }
    </Box>
  );
};

const PatientView = ({ diagnosesList }: PatientViewProps) => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  useEffect(() => {
    const fetchPatient = async () => {
      if (isString(patientId)) {
        const patient = await patientService.getById(patientId);
        setPatient(patient);
      }
    };
    fetchPatient();
  }, [patientId]);

  if (!patient) {
    return (
      <Box style={{ marginTop: "1.0em" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ marginTop: "1.0em" }} >
      <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
        {patient.name}
        <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography variant="body1">SSN: {patient.ssn}</Typography>
      <Typography variant="body1">DoB: {new Date(patient.dateOfBirth).toLocaleDateString()}</Typography>
      <Typography variant="body1">Occupation: {patient.occupation}</Typography>
      <Entries entries={patient.entries} diagnosesList={diagnosesList} />
    </Box>
  );
};

export default PatientView;
