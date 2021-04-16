import type { SerializedWallet, TUuid } from '@types';

import type { IAccount } from './account';

export enum DBRequestType {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  RESET = 'RESET',
  IS_NEW_USER = 'IS_NEW_USER',
  IS_LOGGED_IN = 'IS_LOGGED_IN',
  GET_FROM_STORE = 'GET_FROM_STORE',
  SET_IN_STORE = 'SET_IN_STORE',
  SAVE_ACCOUNT_SECRETS = 'SAVE_ACCOUNT_SECRETS',
  GET_PRIVATE_KEY = 'GET_PRIVATE_KEY',
  DELETE_ACCOUNT_SECRETS = 'DELETE_ACCOUNT_SECRETS'
}

interface BaseRequest<Type extends DBRequestType> {
  type: Type;
}

interface PasswordRequest<Type extends DBRequestType> extends BaseRequest<Type> {
  password: string;
}

type InitRequest = PasswordRequest<DBRequestType.INIT>;

type LoginRequest = PasswordRequest<DBRequestType.LOGIN>;

type LogoutRequest = BaseRequest<DBRequestType.LOGOUT>;

type ResetRequest = BaseRequest<DBRequestType.RESET>;

type GetLoginStateRequest = BaseRequest<DBRequestType.IS_LOGGED_IN>;

type GetNewUserStateRequest = BaseRequest<DBRequestType.IS_NEW_USER>;

interface GetFromStoreRequest extends BaseRequest<DBRequestType.GET_FROM_STORE> {
  key: string;
}

interface SetInStoreRequest extends BaseRequest<DBRequestType.SET_IN_STORE> {
  key: string;
  payload: any;
}

interface UuidRequest<Type extends DBRequestType> extends BaseRequest<Type> {
  uuid: TUuid;
}

interface SaveAccountSecretsRequest extends BaseRequest<DBRequestType.SAVE_ACCOUNT_SECRETS> {
  wallet: SerializedWallet;
}

type GetPrivateKeyRequest = UuidRequest<DBRequestType.GET_PRIVATE_KEY>;

type DeletePrivateKeyRequest = UuidRequest<DBRequestType.DELETE_ACCOUNT_SECRETS>;

export type DBRequest =
  | InitRequest
  | LoginRequest
  | LogoutRequest
  | ResetRequest
  | GetLoginStateRequest
  | GetNewUserStateRequest
  | GetFromStoreRequest
  | SetInStoreRequest
  | SaveAccountSecretsRequest
  | GetPrivateKeyRequest
  | DeletePrivateKeyRequest;

export type DBResponse = string | boolean | IAccount[] | void;
