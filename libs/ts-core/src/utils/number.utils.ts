/**
 * Returns a random integer
 * @param min - The minimum int (optional)
 * @param max - The maximum int (optional)
 */
export function randomInt(min = 0, max = Number.MAX_SAFE_INTEGER) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

export const median = (arr: number[]) => {
  if (arr.length === 0) {
    throw new Error('Cannot calculate median of empty array');
  }
  const sorted = arr.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
};

export const averageDelta = (arr: number[]) => {
  if (arr.length < 2) {
    throw new Error('Cannot calculate average delta with fewer than 2 numbers');
  }
  const deltas = arr.slice(1).map((n, i) => n - arr[i]!);
  return average(deltas);
};

export const estimateNextNumber = (numbers: number[], weight = 0.5): number => {
  if (!numbers.length) {
    return 0;
  }

  if (numbers.length === 1) {
    return numbers[0]!;
  }

  const avgDelta = averageDelta(numbers);
  return numbers[numbers.length - 1]! + (avgDelta * weight);
};
