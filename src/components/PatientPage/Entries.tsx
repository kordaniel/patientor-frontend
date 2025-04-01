import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient
} from '../../types';
import { Box, Divider, Typography } from '@mui/material';

import EntryTypeIcon from '../Icons/EntryTypeIcon';
import HealthRatingBar from '../HealthRatingBar';
import { assertNever } from '../../utils/parsersTypeGuards';


interface DiagnosesProps {
  diagnosesList: Diagnosis[];
  diagnosisCodes: Entry['diagnosisCodes'];
}

const Diagnoses = ({ diagnosesList, diagnosisCodes }: DiagnosesProps) => {
  const renderEntryCode = (code: string): string => {
    const diagnose = diagnosesList.find(d => d.code === code);
    if (!diagnose) {
      return `${code}`;
    }
    return [
      code,
      diagnose.latin ? ` (${diagnose.latin})` : null,
      `: ${diagnose.name}`
    ].join('');
  };

  if (!diagnosisCodes || diagnosisCodes.length === 0) {
    return (
      <Typography variant="body1"><strong>No diagnosis codes</strong></Typography>
    );
  }

  return (
    <Box>
      <Typography variant="body1"><strong>Diagnoses:</strong></Typography>
      <ul style={{ margin: 0 }}>
        {diagnosisCodes.map(code => (
          <li key={code}><Typography variant="body1" style={{ fontStyle: "italic" }}>{renderEntryCode(code)}</Typography></li>
        ))}
      </ul>
    </Box>
  );
};

interface CommonEntryDetailsProps {
  entry: Entry;
  diagnosesList: Diagnosis[];
}

const CommonEntryDetails = ({ entry, diagnosesList }: CommonEntryDetailsProps) => {
  return (
    <Box>
      <Typography variant="body1">
        <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}&nbsp;
        <EntryTypeIcon entryType={entry.type} />
        {entry.type === 'OccupationalHealthcare' && (
          <>&nbsp;{entry.employerName}</>
        )}
      </Typography>
      <Typography variant="body1">
          <strong>Description:</strong> <Box component="span" style={{ fontStyle: "italic" }}>{entry.description}</Box>
      </Typography>
      <Diagnoses diagnosesList={diagnosesList} diagnosisCodes={entry.diagnosisCodes} />
    </Box>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <Box>
      <Typography variant="body1"><strong>Healthcheck rating:</strong>&nbsp;</Typography>
      <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
    </Box>
  );
};

const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  if (entry.sickLeave) {
    return (
      <Box>
        <Typography variant="body1"><strong>Sickleave:</strong></Typography>
        <ul style={{ margin: 0 }}>
          <li><Typography style={{ fontStyle: "italic" }}><strong>From:</strong> {new Date(entry.sickLeave.startDate).toLocaleDateString()}</Typography></li>
          <li><Typography style={{ fontStyle: "italic" }}><strong>To:</strong> {new Date(entry.sickLeave.endDate).toLocaleDateString()}</Typography></li>
        </ul>
      </Box>
    );
  }

  return (
    <Typography variant="body1"><strong>No sickleave</strong></Typography>
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <Box>
      <Typography variant="body1" style={{ fontStyle: "italic" }}><strong>Discharge:</strong> {new Date(entry.discharge.date).toLocaleDateString()}</Typography>
      <Typography variant="body1" style={{ fontStyle: "italic" }}><strong>Criteria:</strong> {entry.discharge.criteria}</Typography>
    </Box>
  );
};

interface EntryViewProps {
  entry: Entry;
  diagnosesList: Diagnosis[];
  renderDivider: boolean;
}

const EntryView = ({ entry, diagnosesList, renderDivider = false }: EntryViewProps) => {
  const entryTypeDetails = () => {
    switch (entry.type) {
      case 'HealthCheck':
        return <HealthCheckEntryDetails entry={entry} />;
      case 'Hospital':
        return <HospitalEntryDetails entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalHealthcareEntryDetails entry={entry} />;
      default:
        return assertNever(entry);
    }
  };

  return (
    <Box>
      <CommonEntryDetails entry={entry} diagnosesList={diagnosesList} />
      {entryTypeDetails()}
      <Typography variant="body1"><strong>Diagnose by:</strong> {entry.specialist}</Typography>
      {renderDivider && <Divider />}
    </Box>
  );
};

interface EntriesProps {
  entries: Patient['entries'];
  diagnosesList: Diagnosis[];
}

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
            renderDivider={i+1 < entries.length}
          />
        ))
        : <Typography>Patient has no entries</Typography>
      }
    </Box>
  );
};

export default Entries;
