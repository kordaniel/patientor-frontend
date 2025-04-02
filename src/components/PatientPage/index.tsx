import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import AddEntryForm from './AddEntryForm';
import Entries from './Entries';
import ErrorRenderer from '../ErrorRenderer';
import GenderIcon from '../Icons/GenderIcon';

import patientService from '../../services/patients';
import { isString } from '../../utils/parsersTypeGuards';
import { Diagnosis, Entry, Patient } from '../../types';

interface PatientPageProps {
  diagnosesList: Diagnosis[];
}

const PatientPage = ({ diagnosesList }: PatientPageProps) => {
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

  const addEntryToPatient = (newEntry: Entry) => {
    if (!patient) {
      console.error('no patient!');
      return;
    }
    setPatient({
      ...patient,
      entries: patient.entries.concat(newEntry),
    });
  };

  if (!patientId) {
    return (
      <Box style={{ marginTop: "1.0em" }}>
        <ErrorRenderer errorMsg="Error: Missing patient ID, contact lazy coder" />
      </Box>
    );
  }

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
      <AddEntryForm patientId={patientId} addEntryToPatient={addEntryToPatient} />
      <Entries entries={patient.entries} diagnosesList={diagnosesList} />
    </Box>
  );
};

export default PatientPage;
