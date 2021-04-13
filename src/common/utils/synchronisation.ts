import { Infer, is, object, string, unknown } from 'superstruct';

const REDUX_STRUCT = object({
  type: string(),
  payload: unknown()
});

export type ReduxAction = Infer<typeof REDUX_STRUCT>;

export const isReduxAction = (action: unknown): action is ReduxAction => {
  return is(action, REDUX_STRUCT);
};
