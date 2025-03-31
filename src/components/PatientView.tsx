import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SensitivePatient } from '../types';
import { Box, CircularProgress, Typography } from '@mui/material';

import patientService from '../services/patients';
import { isString } from '../utils/parsersTypeGuards';
import GenderIcon from './Icons/GenderIcon';

const PatientView = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<SensitivePatient | undefined>(undefined);

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
    </Box>
  );
};

export default PatientView;
