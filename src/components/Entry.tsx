import React from "react";

import {
  BaseEntry,
  Entry,
  HealthCheckRating
} from "../types";

import { assertNever } from "../utils";
import { useStateValue } from "../state";

import { Typography } from "@material-ui/core";
import Box from "@mui/material/Box";
import LocalHospitalIcon  from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WarningIcon from "@mui/icons-material/Warning";

type BaseEntryViewProps = {
  baseEntry: BaseEntry;
  Icon: JSX.Element;
};

const BaseEntryView = ({ baseEntry, Icon }: BaseEntryViewProps) => {
  const [ { diagnoses }, ] = useStateValue();

  return (
    <>
      <ul>
        <li><strong>Type & date</strong>: {Icon} {baseEntry.date}</li>
        <li><strong>Description</strong>: {baseEntry.description}</li>
        <li><strong>Diagnose by</strong>: {baseEntry.specialist}</li>
      </ul>
      <Typography variant="h6">Diagnoses</Typography>
      <ul>
        {baseEntry.diagnosisCodes !== undefined && baseEntry.diagnosisCodes.length > 0
          ? baseEntry.diagnosisCodes.map(c =>
              <li key={c}>
                <strong>{c}</strong>: {diagnoses[c]
                  ? diagnoses[c]?.name
                  : <em>No data for diagnose code..</em>
                }
              </li>
            )
          : <li>No diagnoses</li>
        }
      </ul>
      <Typography variant="h6">Details</Typography>
    </>
  );
};

const HealthRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon sx={{ color: 'rgba(0, 255, 0, 255)' }} />;
    case HealthCheckRating.LowRisk:
      return <FavoriteIcon sx={{ color: 'rgba(255, 255, 0, 255)' }} />;
    case HealthCheckRating.HighRisk:
      return <FavoriteIcon sx={{ color: 'rgba(255, 0, 0, 255)' }} />;
    case HealthCheckRating.CriticalRisk:
      return <WarningIcon sx={{ color: 'rgba(255, 0, 0, 255' }} />;
    default:
      return assertNever(rating);
  }
};

const EntryView = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return (
        <Box sx={{ mb: 1, p: 1, border: "1px dashed", borderRadius: 2 }}>
          <BaseEntryView
            baseEntry={entry}
            Icon={<LocalHospitalIcon />}
          />
          <ul>
            <li>Health rating: <HealthRatingIcon rating={entry.healthCheckRating} /></li>
          </ul>
        </Box>
      );
    case 'OccupationalHealthcare':
      return (
        <Box sx={{ mb: 1, p: 1, border: "1px dashed", borderRadius: 2 }}>
          <BaseEntryView baseEntry={entry} Icon={<WorkIcon />} />
          <ul>
            <li><strong>Employer</strong>: {entry.employerName}</li>
            {entry.sickLeave
              ?
                <>
                  <li><strong>Sickleave Start</strong>: {entry.sickLeave.startDate}</li>
                  <li><strong>Sickleave End</strong>: {entry.sickLeave.endDate}</li>
                </>
              : <li>No sickleave</li>
            }
          </ul>
        </Box>
      );
    case 'Hospital':
      return (
        <Box sx={{ p: 1, border: "1px dashed", borderRadius: 2 }}>
          <BaseEntryView baseEntry={entry} Icon={<VaccinesIcon />} />
          <ul>
            <li><strong>Discharge date</strong>: {entry.discharge.date}</li>
            <li><strong>Criteria</strong>: {entry.discharge.criteria}</li>
          </ul>
        </Box>

      );
    default:
      return assertNever(entry);
  }
};

export default EntryView;
