export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled type: ${JSON.stringify(value)}`);
};
