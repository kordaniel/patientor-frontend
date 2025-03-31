import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Diagnosis, NonSensitivePatient } from "./types";

import diagnoseService from "./services/diagnoses";
import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientView from "./components/PatientView";

const App = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    const fetchDiagnosesList = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };

    void fetchPatientList();
    void fetchDiagnosesList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patient">
              <Route path=":patientId" element={<PatientView diagnosesList={diagnoses} />} />
            </Route>
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
