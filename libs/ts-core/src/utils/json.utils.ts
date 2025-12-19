export const tryParseJson = <T>(jsonString: string): T | undefined => {
  try {
    JSON.parse(jsonString);
    return JSON.parse(jsonString) as T;
  } catch (err) {
    console.warn('Error parsing JSON:', err);
    return undefined;
  }
};

export const jsonCopy = <T>(json: T): T => {
  return JSON.parse(JSON.stringify(json)) as T;
};

export const jsonEquals = <T>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
