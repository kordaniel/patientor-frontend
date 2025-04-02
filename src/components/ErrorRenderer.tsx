import React from 'react';

const ErrorRenderer = ({ errorMsg }: { errorMsg: string | undefined }) => {
  const style: React.CSSProperties = {
    backgroundColor: 'lightblue',
    color: 'red',
    fontFamily: 'Arial',
    padding: '1em',
    borderStyle: 'double',
  };

  if (!errorMsg) {
    return null;
  }

  return (
    <p style={style}>{errorMsg}</p>
  );
};

export default ErrorRenderer;
