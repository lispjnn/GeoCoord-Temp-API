// Averages contents of array a.
export function average(a: number[]): number {
  return a.reduce((acc, e) => acc + e, 0) / a.length;
}
