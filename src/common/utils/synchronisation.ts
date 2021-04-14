import { Infer, is, object, string, unknown } from 'superstruct';

const REDUX_ACTION_STRUCT = object({
  type: string(),
  payload: unknown()
});

const ENCRYPTED_ACTION_STRUCT = object({
  data: string()
});

export type ReduxAction = Infer<typeof REDUX_ACTION_STRUCT>;
export type EncryptedAction = Infer<typeof ENCRYPTED_ACTION_STRUCT>;

export const isReduxAction = (action: unknown): action is ReduxAction => {
  return is(action, REDUX_ACTION_STRUCT);
};

export const isEncryptedAction = (action: unknown): action is EncryptedAction => {
  return is(action, ENCRYPTED_ACTION_STRUCT);
};
