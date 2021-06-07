export type DeepPartial<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]?: T[K] extends Record<string, any>
    ? DeepPartial<T[K]> | undefined
    : T[K] | undefined;
};
