
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseId = (obj: unknown): string => {
  if (!obj || !isString(obj) || obj.length < 1) {
    throw new Error('Incorrect or missing id');
  }

  return obj;
};

const constructErrorMessage = (error: unknown): string => {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  return errorMessage;
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export {
  parseId,
  constructErrorMessage,
  assertNever
};
