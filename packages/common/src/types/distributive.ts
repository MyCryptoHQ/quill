// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type DistributiveOptional<T extends object, K extends keyof T = keyof T> = DistributiveOmit<
  T,
  K
> &
  Partial<Pick<T, K>>;
