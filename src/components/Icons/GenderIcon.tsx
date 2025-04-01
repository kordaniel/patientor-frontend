import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { Gender } from '../../types';
import { assertNever } from '../../utils/parsersTypeGuards';

interface GenderIconProps {
  gender: Gender;
}

const GenderIcon = ({ gender }: GenderIconProps) => {
  switch (gender) {
    case Gender.Female: return <FemaleIcon />;
    case Gender.Male: return <MaleIcon />;
    case Gender.Other: return <TransgenderIcon />;
    default: return assertNever(gender);
  }
};

export default GenderIcon;
