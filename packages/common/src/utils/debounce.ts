type OmitFirst<Fn> = Fn extends (key: string, ...args: infer Params) => infer Return
  ? (...args: Params) => Return
  : never;

export const keyDebounce = <Fn extends (key: string, ...args: unknown[]) => unknown>(
  fn: Fn,
  timeout: number = 1000
) => {
  const timeouts: Record<string, NodeJS.Timeout> = {};

  return (key: string, ...args: Parameters<OmitFirst<Fn>>) => {
    const execute = () => {
      fn(key, ...args);
    };

    if (timeouts[key]) {
      clearTimeout(timeouts[key]);
    }

    timeouts[key] = setTimeout(execute, timeout);
  };
};
