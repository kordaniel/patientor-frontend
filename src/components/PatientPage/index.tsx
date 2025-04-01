import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import GenderIcon from '../Icons/GenderIcon';
import Entries from './Entries';

import patientService from '../../services/patients';
import { isString } from '../../utils/parsersTypeGuards';
import { Diagnosis, Patient } from '../../types';

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

export default PatientPage;
