import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import { Entry } from '../../types';
import { assertNever } from '../../utils/parsersTypeGuards';

const EntryTypeIcon = ({ entryType }: { entryType: Entry['type'] }) => {
  switch (entryType) {
    case 'HealthCheck': return <MedicalServicesIcon />;
    case 'Hospital': return <LocalHospitalIcon />;
    case 'OccupationalHealthcare': return <BusinessCenterIcon />;
    default: return assertNever(entryType);
  }
};

export default EntryTypeIcon;
