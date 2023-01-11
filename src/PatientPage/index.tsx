import { useState }  from "react";
import axios         from "axios";
import { useParams } from "react-router-dom";

import { Patient, Gender } from "../types";
import { apiBaseUrl }      from "../constants";
import {
  useStateValue,
  addPatientSensitive
}                          from "../state";
import {
  parseId,
  constructErrorMessage
}                          from "../utils";

import EntryView           from "../components/Entry";

import { Typography }  from "@material-ui/core";
import FemaleIcon      from "@mui/icons-material/Female";
import MaleIcon        from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";


const PatientPage = () => {
  const [errorMsg, setErrorMsg] = useState<string>('');

  const setParamId = (): string => {
    try {
      return parseId(useParams<{ id: string }>().id);
    } catch (error: unknown) {
      setErrorMsg(constructErrorMessage(error));
      return '';
    }
  };

  const id = setParamId();

  const [{ patientsSensitive }, dispatch] = useStateValue();

  const patientData = !patientsSensitive[id]
    ? null
    : patientsSensitive[id];

  if (!errorMsg && !patientData) {
    const getPatientData = async () => {
        try {
          const { data: patientDataFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(addPatientSensitive(patientDataFromApi));
        } catch (error: unknown) {
          setErrorMsg(constructErrorMessage(error));
        }
    };

    void getPatientData();
  }

  if (errorMsg) {
    return (<div>{errorMsg}</div>);
  }

  return (
    <div>
    {patientData === null
      ? <Typography variant="h4">Loading patient data...</Typography>
      :
      <>
        <Typography variant="h4">
          {patientData?.name}
          {patientData?.gender === Gender.Male && <MaleIcon />}
          {patientData?.gender === Gender.Female && <FemaleIcon />}
          {patientData?.gender === Gender.Other && <TransgenderIcon />}
        </Typography>
        <p>
          Ssn: {patientData?.ssn}<br />
          Occupation: {patientData?.occupation}
        </p>
        <Typography variant="h5">Entries</Typography>
        {patientData?.entries !== undefined && patientData?.entries.length > 0
          ? patientData?.entries.map(e => <EntryView key={e.id} entry={e} />)
          : <p>No entries, patient is probably either really healthy or scared of doctors!</p>
        }
      </>
    }
    </div>
  );
};

export default PatientPage;
